
import argparse
import sys
from playwright.sync_api import sync_playwright
import time

class BrowserTestError(Exception):
    pass

class BrowserTestRunner:
    VIEWPORT_DESKTOP = {'width': 1280, 'height': 720}
    VIEWPORT_MOBILE = {'width': 375, 'height': 667}

    def __init__(self, args):
        self.args = args
        self.page = None

    def run(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=not self.args.show_browser)
            self.page = self.setup_page(browser)

            self.navigate()
            self.apply_dark_mode()
            self.wait()
            self.perform_action()

            browser.close()

    def setup_page(self, browser):
        viewport = self.VIEWPORT_DESKTOP
        if self.args.mobile:
            viewport = self.VIEWPORT_MOBILE
            
        return browser.new_page(viewport=viewport)

    def navigate(self):
        print(f"Navigating to {self.args.url}...")
        try:
            self.page.goto(self.args.url)
            self.page.wait_for_load_state('networkidle')
        except Exception as e:
            raise BrowserTestError(f"Error navigating to URL: {e}")

    def apply_dark_mode(self):
        if self.args.dark_mode:
            print("Enabling Dark Mode...")
            self.page.evaluate("document.body.setAttribute('data-theme', 'dark')")
            # Also dispatch event if needed, but attribute change is usually enough for CSS
            self.page.wait_for_timeout(500)

    def wait(self):
        if self.args.wait > 0:
            print(f"Waiting for {self.args.wait} seconds...")
            time.sleep(self.args.wait)

    def perform_action(self):
        action_map = {
            'screenshot': self._action_screenshot,
            'check': self._action_check,
            'text': self._action_text,
            'click': self._action_click,
            'input': self._action_input
        }

        handler = action_map.get(self.args.action)
        if handler:
            handler()
        else:
            raise BrowserTestError(f"Unknown action: {self.args.action}")

    def _get_element(self, selector):
        element = self.page.locator(selector).first
        if not element.is_visible():
            raise BrowserTestError(f"Element not found or not visible: {selector}")
        return element

    def _action_screenshot(self):
        if not self.args.output:
            raise BrowserTestError("--output is required for screenshot action")

        if self.args.selector:
            element = self._get_element(self.args.selector)
            element.screenshot(path=self.args.output)
            print(f"Element screenshot saved to {self.args.output}")
        else:
            self.page.screenshot(path=self.args.output, full_page=self.args.full_page)
            print(f"Screenshot saved to {self.args.output}")

    def _action_check(self):
        if not self.args.selector:
            raise BrowserTestError("--selector is required for check action")

        # Wait for at least one element to be attached
        try:
            self.page.wait_for_selector(self.args.selector, state='attached', timeout=5000)
        except:
            pass # Continue to check count

        # Check for visible elements
        elements = self.page.locator(self.args.selector).all()
        visible_count = sum(1 for el in elements if el.is_visible())
        
        if visible_count > 0:
            print(f"Found {visible_count} visible element(s) matching '{self.args.selector}'")
        else:
            # Also report total count for debugging
            total_count = len(elements)
            msg = f"No visible elements found matching: {self.args.selector} (Total attached: {total_count})"
            raise BrowserTestError(msg)

    def _action_text(self):
        if not self.args.selector:
            raise BrowserTestError("--selector is required for text action")

        element = self._get_element(self.args.selector)
        print(f"Text content: {element.inner_text()}")

    def _action_click(self):
        if not self.args.selector:
            raise BrowserTestError("--selector is required for click action")

        try:
            self.page.click(self.args.selector)
            print(f"Clicked element: {self.args.selector}")
            # Wait for potential navigation or animation
            self.page.wait_for_load_state('networkidle')
            self.page.wait_for_timeout(500)
            
            if self.args.output:
                self.page.screenshot(path=self.args.output)
                print(f"Post-click screenshot saved to {self.args.output}")
        except Exception as e:
            raise BrowserTestError(f"Error clicking element: {e}")

    def _action_input(self):
        if not self.args.selector or self.args.input_text is None:
            raise BrowserTestError("--selector and --input-text are required for input action")

        try:
            self.page.fill(self.args.selector, self.args.input_text)
            print(f"Filled '{self.args.input_text}' into {self.args.selector}")
            
            if self.args.output:
                self.page.screenshot(path=self.args.output)
                print(f"Post-input screenshot saved to {self.args.output}")
        except Exception as e:
            raise BrowserTestError(f"Error inputting text: {e}")

def run_browser_test(args):
    try:
        runner = BrowserTestRunner(args)
        runner.run()
    except BrowserTestError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

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
