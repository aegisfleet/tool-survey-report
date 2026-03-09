import os
import re
import yaml
from playwright.sync_api import sync_playwright

REPORTS_DIR = '_reports'

def get_github_repo(content):
    # Search for github link in front matter
    match = re.search(r'github:\s*"(https?://github\.com/([^/]+)/([^/"]+))"', content)
    if not match:
        match = re.search(r'github:\s*(https?://github\.com/([^/]+)/([^/\n\s]+))', content)
    
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

def update_file(filepath, owner, repo, has_deepwiki, has_codewiki):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    in_links = False
    updated = False
    
    deepwiki_line = f'  deepwiki: "https://deepwiki.com/{owner}/{repo}"\n'
    codewiki_line = '  codewiki: "https://codewiki.google/"\n'
    
    for line in lines:
        new_lines.append(line)
        if 'links:' in line:
            in_links = True
        elif in_links and not updated:
            # Check if we are still in links section or reached next section
            if line.strip() == "" or not line.startswith('  '):
                # Insert before ending the section
                if not has_codewiki:
                    new_lines.insert(-1, codewiki_line)
                if not has_deepwiki and owner and repo:
                    new_lines.insert(-1, deepwiki_line)
                updated = True
                in_links = False
            elif 'github:' in line:
                # Good place to insert after github
                if not has_deepwiki and owner and repo:
                    new_lines.append(deepwiki_line)
                if not has_codewiki:
                    new_lines.append(codewiki_line)
                updated = True
                in_links = False

    if updated:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    files = [f for f in os.listdir(REPORTS_DIR) if f.endswith('.md')]
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        updated_count = 0
        
        for filename in files:
            filepath = os.path.join(REPORTS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            has_deepwiki = 'deepwiki:' in content
            has_codewiki = 'codewiki:' in content

            if has_deepwiki and has_codewiki:
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

                # We always add codewiki if github exists
                should_update = (deepwiki_exists and not has_deepwiki) or not has_codewiki
                if should_update:
                    # if deepwiki_exists is False, we pass has_deepwiki=True to prevent inserting it
                    if update_file(filepath, owner, repo, has_deepwiki or not deepwiki_exists, has_codewiki):
                        updated_count += 1
                        print(f"  Updated links for {filename}")
        
        browser.close()
        print(f"\nTotal updated: {updated_count}")

if __name__ == "__main__":
    main()
