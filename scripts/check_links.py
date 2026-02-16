import os
import re
import argparse
import sys
import atexit

# Check for playwright availability
try:
    from playwright.sync_api import sync_playwright
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False
    sync_playwright = None
    import urllib.request
    import urllib.error
    import socket
    socket.setdefaulttimeout(10)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

BROWSER_CONFIG = {
    'viewport': {'width': 1280, 'height': 720},
    'user_agent': HEADERS['User-Agent']
}

# Keywords indicating 404 pages
NOT_FOUND_KEYWORDS = [
    '404', 'not found', 'page not found', 'does not exist', 
    "couldn't find", 'ページが見つかりません', 'could not be found'
]

# Global Playwright instances
_PLAYWRIGHT = None
_BROWSER = None
_CONTEXT = None

def _get_global_context():
    """Lazily initialize and return the global Playwright context.

    This function implements a singleton pattern for the Playwright browser instance
    and context. This is a performance optimization to avoid launching a new
    browser instance for every link check, which is an expensive operation.
    """
    global _PLAYWRIGHT, _BROWSER, _CONTEXT

    if _CONTEXT:
        return _CONTEXT

    if HAS_PLAYWRIGHT:
        if not _PLAYWRIGHT:
            _PLAYWRIGHT = sync_playwright().start()

        if not _BROWSER:
            _BROWSER = _PLAYWRIGHT.chromium.launch(headless=True)

        if not _CONTEXT:
            _CONTEXT = _BROWSER.new_context(**BROWSER_CONFIG)

    return _CONTEXT

def _cleanup_global_context():
    """Cleanup global Playwright resources."""
    global _PLAYWRIGHT, _BROWSER, _CONTEXT

    if _CONTEXT:
        _CONTEXT.close()
        _CONTEXT = None

    if _BROWSER:
        _BROWSER.close()
        _BROWSER = None

    if _PLAYWRIGHT:
        _PLAYWRIGHT.stop()
        _PLAYWRIGHT = None

atexit.register(_cleanup_global_context)

def find_links_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Regex for markdown links: [text](url)
    links = re.findall(r'\[.*?\]\((https?://[^\)]+)\)', content)
    return links


def check_link_with_playwright(url, browser_context=None, page=None):
    """Check link using Playwright browser for better accuracy.

    If a 'page' object is provided, it is reused to avoid the overhead of
    creating a new page for each request. This is critical for performance
    when checking many links.
    """
    # Use provided page if available
    if page:
        return _check_link_logic(page, url)

    # Use provided context or fall back to global singleton
    context = browser_context or _get_global_context()

    if not context:
        return 0, "Playwright context not available"

    new_page = context.new_page()
    try:
        return _check_link_logic(new_page, url)
    finally:
        new_page.close()


def _check_link_logic(page, url):
    """Internal logic to check a link using a Playwright page."""
    try:
        response = page.goto(url, wait_until='networkidle', timeout=30000)
        status = response.status if response else 0

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


def check_link(url, use_browser=False, browser_context=None, page=None):
    """Check a single link."""
    if use_browser and HAS_PLAYWRIGHT:
        return check_link_with_playwright(url, browser_context=browser_context, page=page)
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

    # Process files (context is managed globally if needed)
    _process_files(files_to_check, use_browser, None, broken_links, warnings)

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


def _process_files(files_to_check, use_browser, browser_context, broken_links, warnings):
    """Process files and check links within them."""
    page = None
    # PERFORMANCE: Create a single page and reuse it for all link checks in this batch.
    # This avoids creating/closing pages repeatedly, which saves time.
    if use_browser and HAS_PLAYWRIGHT:
        context = browser_context or _get_global_context()
        if context:
            page = context.new_page()

    try:
        for filepath in files_to_check:
            print(f"Checking {filepath}...")
            links = find_links_in_file(filepath)
            for url in links:
                # Skip local links or anchors
                if not url.startswith('http'):
                    continue

                print(f"  Checking {url}...", end='', flush=True)
                status, reason = check_link(url, use_browser=use_browser, browser_context=browser_context, page=page)
                print(f" {status} {reason}")

                if status == 404:
                    broken_links.append((filepath, url, status, reason))
                elif status != 200:
                    warnings.append((filepath, url, status, reason))
    finally:
        if page:
            page.close()

if __name__ == "__main__":
    main()
