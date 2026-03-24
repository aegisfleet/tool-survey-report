import os
import re
import argparse

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    # If playwright is missing, we raise a clear error at import time if not in a testing environment.
    # This avoids a confusing TypeError when sync_playwright() is called later.
    if os.environ.get('TESTING') != '1':
        raise ImportError("playwright is not installed. Please run: pip install playwright && playwright install chromium")
    sync_playwright = None

REPORTS_DIR = '_reports'

# Global regex cache for performance optimization
GITHUB_REPO_QUOTED_RE = re.compile(r'^\s*github:\s*"(https?://github\.com/([^/"]+)/([^/"]+))/?"', re.MULTILINE)
GITHUB_REPO_UNQUOTED_RE = re.compile(r'^\s*github:\s*(https?://github\.com/([^/\s]+)/([^/\s]+))/?(?:\s|$)', re.MULTILINE)
CODEWIKI_RE = re.compile(r'(codewiki:\s*)"https://codewiki\.google/"')

def get_github_repo(content):
    # Search for github link in front matter (anchored to line start)
    # Support both quoted and unquoted URLs, and handle optional trailing slash
    match = GITHUB_REPO_QUOTED_RE.search(content)
    if not match:
        match = GITHUB_REPO_UNQUOTED_RE.search(content)
    
    if match:
        return match.group(2), match.group(3)
    return None, None

def check_deepwiki_exists(page, owner, repo):
    url = f"https://deepwiki.com/{owner}/{repo}"
    try:
        response = page.goto(url, wait_until='networkidle', timeout=15000)
        if response and response.status == 200:
            # Basic 404 check in content
            body_text = page.inner_text('body').lower()
            if '404' in body_text or 'not found' in body_text:
                return False
            return True
        return False
    except Exception:
        return False

def check_codewiki_exists(page, owner, repo):
    url = f"https://codewiki.google/github.com/{owner}/{repo}"
    try:
        response = page.goto(url, wait_until='networkidle', timeout=15000)
        if response and response.status == 200:
            body_text = page.inner_text('body').lower()
            title_text = page.title().lower()
            if '404' in body_text or 'not found' in body_text or "not found | code wiki" in title_text:
                return False
            return True
        return False
    except Exception:
        return False

def update_file(filepath, owner, repo, has_deepwiki, has_codewiki):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    codewiki_url = f'https://codewiki.google/github.com/{owner}/{repo}'
    deepwiki_url = f'https://deepwiki.com/{owner}/{repo}'
    
    updated = False
    
    # Use regex to replace placeholder with or without indentation
    new_content = CODEWIKI_RE.sub(rf'\1"{codewiki_url}"', content)
    if new_content != content:
        content = new_content
        updated = True
        has_codewiki = True
    
    lines = content.splitlines(keepends=True)
    new_lines = []
    in_links = False
    link_section_updated = False
    
    for line in lines:
        new_lines.append(line)
        if 'links:' in line:
            in_links = True
        elif in_links and not link_section_updated:
            if line.strip() == "" or (line.strip() and not line.startswith('  ')):
                # Insert at end of section if missing
                if not has_codewiki:
                    new_lines.insert(-1, f'  codewiki: "{codewiki_url}"\n')
                    updated = True
                if not has_deepwiki:
                    new_lines.insert(-1, f'  deepwiki: "{deepwiki_url}"\n')
                    updated = True
                link_section_updated = True
                in_links = False
            elif 'github:' in line:
                if not has_deepwiki:
                    new_lines.append(f'  deepwiki: "{deepwiki_url}"\n')
                    updated = True
                if not has_codewiki:
                    new_lines.append(f'  codewiki: "{codewiki_url}"\n')
                    updated = True
                link_section_updated = True
                in_links = False

    if updated:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    parser = argparse.ArgumentParser(description='Update DeepWiki and CodeWiki links in report files.')
    parser.add_argument('file_path', nargs='?', help='Path to a specific markdown file to update.')
    args = parser.parse_args()

    if args.file_path:
        if not os.path.exists(args.file_path):
            print(f"Error: File not found: {args.file_path}")
            return
        files_to_process = [args.file_path]
    else:
        files_to_process = [os.path.join(REPORTS_DIR, f) for f in os.listdir(REPORTS_DIR) if f.endswith('.md')]
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        updated_count = 0
        
        for filepath in files_to_process:
            filename = os.path.basename(filepath)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            has_deepwiki = 'deepwiki:' in content
            has_codewiki = 'codewiki:' in content
            has_placeholder = 'codewiki: "https://codewiki.google/"' in content

            if has_deepwiki and has_codewiki and not has_placeholder:
                continue
            
            owner, repo = get_github_repo(content)
            if owner and repo:
                deepwiki_exists = False
                if not has_deepwiki:
                    print(f"Checking DeepWiki for {filename} ({owner}/{repo})...")
                    deepwiki_exists = check_deepwiki_exists(page, owner, repo)
                    if deepwiki_exists:
                        print(f"  Found DeepWiki! Updating {filename}")
                    else:
                        print(f"  DeepWiki not found.")

                codewiki_exists = False
                if not has_codewiki or has_placeholder:
                    print(f"Checking CodeWiki for {filename} ({owner}/{repo})...")
                    codewiki_exists = check_codewiki_exists(page, owner, repo)
                    if codewiki_exists:
                        print(f"  Found CodeWiki! Updating {filename}")
                    else:
                        print("  CodeWiki not found.")

                # We update if deepwiki found, or codewiki is found (when it was missing or a placeholder)
                should_update = (deepwiki_exists and not has_deepwiki) or codewiki_exists
                if should_update:
                    # If a link does not exist on the web, we pass True for 'has_*' to prevent it from being added
                    pass_deepwiki = has_deepwiki or not deepwiki_exists
                    pass_codewiki = has_codewiki or (not codewiki_exists and not has_placeholder)
                    if update_file(filepath, owner, repo, pass_deepwiki, pass_codewiki):
                        updated_count += 1
                        print(f"  Updated links for {filename}")
        
        browser.close()
        print(f"\nTotal updated: {updated_count}")

if __name__ == "__main__":
    main()
