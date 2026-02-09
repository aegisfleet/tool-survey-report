
import argparse
import sys
from playwright.sync_api import sync_playwright
import time

def run_browser_test(args):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not args.show_browser)
        
        viewport = {'width': 1280, 'height': 720}
        if args.mobile:
            viewport = {'width': 375, 'height': 667}
            
        page = browser.new_page(viewport=viewport)
        
        print(f"Navigating to {args.url}...")
        try:
            page.goto(args.url)
            page.wait_for_load_state('networkidle')
        except Exception as e:
            print(f"Error navigating to URL: {e}")
            sys.exit(1)

        if args.dark_mode:
            print("Enabling Dark Mode...")
            page.evaluate("document.body.setAttribute('data-theme', 'dark')")
            # Also dispatch event if needed, but attribute change is usually enough for CSS
            page.wait_for_timeout(500)

        if args.wait > 0:
            print(f"Waiting for {args.wait} seconds...")
            time.sleep(args.wait)

        if args.action == 'screenshot':
            if not args.output:
                print("Error: --output is required for screenshot action")
                sys.exit(1)
            
            if args.selector:
                element = page.locator(args.selector).first
                if element.is_visible():
                    element.screenshot(path=args.output)
                    print(f"Element screenshot saved to {args.output}")
                else:
                    print(f"Element not found or not visible: {args.selector}")
            else:
                page.screenshot(path=args.output, full_page=args.full_page)
                print(f"Screenshot saved to {args.output}")

        elif args.action == 'check':
            if not args.selector:
                print("Error: --selector is required for check action")
                sys.exit(1)
            
            count = page.locator(args.selector).count()
            if count > 0:
                print(f"Found {count} element(s) matching '{args.selector}'")
            else:
                print(f"Element not found: {args.selector}")
                sys.exit(1)

        elif args.action == 'text':
            if not args.selector:
                print("Error: --selector is required for text action")
                sys.exit(1)
            
            element = page.locator(args.selector).first
            if element.is_visible():
                print(f"Text content: {element.inner_text()}")
            else:
                print(f"Element not found or not visible: {args.selector}")
                sys.exit(1)

        elif args.action == 'click':
            if not args.selector:
                print("Error: --selector is required for click action")
                sys.exit(1)
            
            try:
                page.click(args.selector)
                print(f"Clicked element: {args.selector}")
                # Wait for potential navigation or animation
                page.wait_for_load_state('networkidle')
                page.wait_for_timeout(500)
                
                if args.output:
                    page.screenshot(path=args.output)
                    print(f"Post-click screenshot saved to {args.output}")
            except Exception as e:
                print(f"Error clicking element: {e}")
                sys.exit(1)

        elif args.action == 'input':
            if not args.selector or args.input_text is None:
                print("Error: --selector and --input-text are required for input action")
                sys.exit(1)
            
            try:
                page.fill(args.selector, args.input_text)
                print(f"Filled '{args.input_text}' into {args.selector}")
                
                if args.output:
                    page.screenshot(path=args.output)
                    print(f"Post-input screenshot saved to {args.output}")
            except Exception as e:
                print(f"Error inputting text: {e}")
                sys.exit(1)

        browser.close()

def main():
    parser = argparse.ArgumentParser(description='Browser testing utility using Playwright')
    
    parser.add_argument('--url', required=True, help='Target URL')
    parser.add_argument('--action', choices=['screenshot', 'check', 'text', 'click', 'input'], default='screenshot', help='Action to perform')
    parser.add_argument('--selector', help='CSS selector for target element')
    parser.add_argument('--output', help='Path to save screenshot')
    parser.add_argument('--input-text', help='Text to input for input action')
    parser.add_argument('--wait', type=float, default=0, help='Wait time in seconds before action')
    parser.add_argument('--dark-mode', action='store_true', help='Enable dark mode')
    parser.add_argument('--mobile', action='store_true', help='Use mobile viewport')
    parser.add_argument('--full-page', action='store_true', help='Capture full page screenshot')
    parser.add_argument('--show-browser', action='store_true', help='Show browser GUI (headless=False)')

    args = parser.parse_args()
    run_browser_test(args)

if __name__ == '__main__':
    main()
