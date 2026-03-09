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

def update_file(filepath, owner, repo):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    in_links = False
    updated = False
    
    deepwiki_line = f'  deepwiki: "https://deepwiki.com/{owner}/{repo}"\n'
    
    for line in lines:
        new_lines.append(line)
        if 'links:' in line:
            in_links = True
        elif in_links and not updated:
            # Check if we are still in links section or reached next section
            if line.strip() == "" or not line.startswith('  '):
                # Insert before ending the section
                new_lines.insert(-1, deepwiki_line)
                updated = True
                in_links = False
            elif 'github:' in line:
                # Good place to insert after github
                new_lines.append(deepwiki_line)
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
            
            if 'deepwiki:' in content:
                continue
            
            owner, repo = get_github_repo(content)
            if owner and repo:
                print(f"Checking DeepWiki for {filename} ({owner}/{repo})...")
                if check_deepwiki_exists(page, owner, repo):
                    print(f"  Found! Updating {filename}")
                    if update_file(filepath, owner, repo):
                        updated_count += 1
                else:
                    print(f"  Not found.")
        
        browser.close()
        print(f"\nTotal updated: {updated_count}")

if __name__ == "__main__":
    main()
