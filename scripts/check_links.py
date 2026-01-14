import os
import re
import argparse
import sys

# Check for playwright availability
try:
    from playwright.sync_api import sync_playwright
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False
    import urllib.request
    import urllib.error
    import socket
    socket.setdefaulttimeout(10)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Keywords indicating 404 pages
NOT_FOUND_KEYWORDS = [
    '404', 'not found', 'page not found', 'does not exist', 
    "couldn't find", 'ページが見つかりません', 'could not be found'
]

def find_links_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Regex for markdown links: [text](url)
    links = re.findall(r'\[.*?\]\((https?://[^\)]+)\)', content)
    return links


def check_link_with_playwright(url):
    """Check link using Playwright browser for better accuracy."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent=HEADERS['User-Agent']
        )
        page = context.new_page()
        
        try:
            response = page.goto(url, wait_until='networkidle', timeout=30000)
            status = response.status if response else 0
            
            # Wait extra time for JS to render
            page.wait_for_timeout(3000)
            
            # Check page content for 404 indicators
            try:
                body_text = page.inner_text('body').lower()
                title_text = page.title().lower()
                
                has_404_keywords = any(kw in body_text or kw in title_text for kw in NOT_FOUND_KEYWORDS)
                
                # Check for bot detection pages (which should be treated as 403 warnings, not success)
                is_bot_blocked = any(kw in body_text for kw in [
                    'access blocked', 'access denied', 'you have been blocked',
                    'unusual activity', 'security service', 'cloudflare'
                ])
                
                # If status is 200/403 but page shows 404 content, it's a soft 404
                if has_404_keywords and status != 404:
                    return 404, "Soft 404 (page shows not found message)"
                
                # If bot blocked, return 403 with clear message
                if is_bot_blocked:
                    return 403, "Bot detection blocked (manual verification needed)"
                    
            except Exception as e:
                pass
            
            if status == 200:
                return status, "OK"
            else:
                return status, f"HTTP {status}"
                
        except Exception as e:
            return 0, str(e)
        finally:
            browser.close()


def check_link_with_urllib(url):
    """Fallback: Check link using urllib (less accurate for bot-protected sites)."""
    import urllib.request
    import urllib.error
    
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        req.method = 'HEAD'
        try:
            with urllib.request.urlopen(req) as response:
                return response.status, "OK"
        except urllib.error.HTTPError as e:
            if e.code == 405:  # Method Not Allowed, try GET
                req.method = 'GET'
                with urllib.request.urlopen(req) as response:
                    return response.status, "OK"
            else:
                return e.code, e.reason
    except urllib.error.HTTPError as e:
        return e.code, e.reason
    except urllib.error.URLError as e:
        return 0, str(e.reason)
    except Exception as e:
        return 0, str(e)


def check_link(url, use_browser=False):
    """Check a single link."""
    if use_browser and HAS_PLAYWRIGHT:
        return check_link_with_playwright(url)
    else:
        return check_link_with_urllib(url)


def main():
    parser = argparse.ArgumentParser(description="Check links in markdown files.")
    parser.add_argument("target", nargs='?', default="_reports", help="Directory or file to check")
    parser.add_argument("--browser", "-b", action="store_true", 
                        help="Use browser (Playwright) for more accurate checking")
    args = parser.parse_args()

    target = args.target
    use_browser = args.browser
    files_to_check = []

    if os.path.isfile(target):
        files_to_check.append(target)
    elif os.path.isdir(target):
        for root, dirs, files in os.walk(target):
            for file in files:
                if file.endswith(".md"):
                    files_to_check.append(os.path.join(root, file))

    if use_browser:
        if not HAS_PLAYWRIGHT:
            print("Error: Playwright is not installed. Run: pip install playwright && playwright install chromium")
            sys.exit(1)
        print("Using browser mode (Playwright) for accurate checking...")
    else:
        print("Using urllib mode (fast but may miss soft 404s on bot-protected sites)")
        print("Tip: Use --browser flag for more accurate checking")

    broken_links = []
    warnings = []

    print(f"\nChecking links in {len(files_to_check)} files...\n")

    for filepath in files_to_check:
        print(f"Checking {filepath}...")
        links = find_links_in_file(filepath)
        for url in links:
            # Skip local links or anchors
            if not url.startswith('http'):
                continue

            print(f"  Checking {url}...", end='', flush=True)
            status, reason = check_link(url, use_browser=use_browser)
            print(f" {status} {reason}")

            if status == 404:
                broken_links.append((filepath, url, status, reason))
            elif status != 200:
                # 403, 500, etc. might be temporary or anti-bot, but worth noting.
                warnings.append((filepath, url, status, reason))

    print("\n--- Report ---")
    if broken_links:
        print(f"\nFound {len(broken_links)} broken links (404):")
        for filepath, url, status, reason in broken_links:
            print(f"  {filepath}: {url} -> {status} {reason}")

    if warnings:
        print(f"\nFound {len(warnings)} potential issues (non-200/404):")
        for filepath, url, status, reason in warnings:
            print(f"  {filepath}: {url} -> {status} {reason}")

    if broken_links:
        sys.exit(1)
    else:
        print("\nNo broken links found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
