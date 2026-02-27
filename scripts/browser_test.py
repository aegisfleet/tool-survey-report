
import argparse
import sys
from playwright.sync_api import sync_playwright
import time
import socket
import ipaddress
import urllib.parse

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

    def validate_url(self, url):
        """
        Validates the URL to prevent SSRF attacks.
        Checks if the resolved IP address is a private, loopback, or link-local address.
        """
        if self.args.allow_internal_ips:
            return

        try:
            parsed_url = urllib.parse.urlparse(url)
            hostname = parsed_url.hostname
            if not hostname:
                 # If we can't parse a hostname, it might be a malformed URL.
                 # In the context of page.route, 'url' is the full request URL.
                 # In the context of initial navigation, it's what the user provided.
                 # We'll allow it if it's not starting with http/https (e.g. data: or file: - wait, file: is dangerous too)
                 # Actually, Playwright handles non-http schemes.
                 # Let's enforce that if it looks like an absolute URL with a hostname, we check it.
                 # If it doesn't have a hostname, assume it's relative or safe scheme unless we want to block file:// too.
                 # For SSRF, we care about http/https to internal IPs.
                 if parsed_url.scheme in ['http', 'https']:
                     # Malformed http url?
                     raise BrowserTestError(f"Invalid URL (no hostname): {url}")
                 return

            # Resolve hostname to IP
            # We use getaddrinfo to support IPv6 and get all addresses
            # We filter for AF_INET and AF_INET6 to avoid other socket types
            addr_info = socket.getaddrinfo(hostname, None)

            for family, type, proto, canonname, sockaddr in addr_info:
                ip_str = sockaddr[0]
                # socket.getaddrinfo might return IPv6 with scope id (e.g. fe80::1%lo0)
                # ipaddress module handles standard formats.
                # Strip scope id if present for IPv6
                if '%' in ip_str:
                    ip_str = ip_str.split('%')[0]

                try:
                    ip = ipaddress.ip_address(ip_str)
                except ValueError:
                    continue # Skip if not a valid IP (shouldn't happen with getaddrinfo)

                if ip.is_private or ip.is_loopback or ip.is_link_local:
                     raise BrowserTestError(f"Access to internal IP address {ip_str} is restricted.")

        except (socket.gaierror, ValueError) as e:
            # If we can't resolve it, it might be an internal name that only resolves internally,
            # or just a bad domain.
            # To be safe, if we can't resolve it, we could block it, or let Playwright fail.
            # However, if it resolves internally but not on the machine running this check (unlikely in this context),
            # it implies split DNS.
            # Best practice for SSRF is to block if resolution fails or if it resolves to internal.
            # But valid external domains might transiently fail.
            # Let's log and allow if it's a resolution error? No, fail secure.
            # But gaierror is common.
            # The review said "fail securely (closed) if resolution fails".
            raise BrowserTestError(f"Error resolving URL {url}: {e}")

    def _handle_route(self, route):
        request = route.request
        try:
            self.validate_url(request.url)
            route.continue_()
        except BrowserTestError as e:
            print(f"Blocked request to {request.url}: {e}")
            route.abort()

    def navigate(self):
        print(f"Navigating to {self.args.url}...")

        # Setup request interception to validate all requests (including redirects)
        # We only do this if we are not allowing internal IPs
        if not self.args.allow_internal_ips:
             # Match all requests
             self.page.route("**/*", self._handle_route)

        try:
            # We still validate the initial URL before even trying to navigate
            # This catches the initial request before Playwright spins up the network stack
            self.validate_url(self.args.url)
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
    parser.add_argument('--allow-internal-ips', action='store_true', help='Allow access to internal/private IP addresses')

    args = parser.parse_args()
    run_browser_test(args)

if __name__ == '__main__':
    main()
