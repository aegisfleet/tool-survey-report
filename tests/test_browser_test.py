
import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import argparse
import socket
import ipaddress

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.browser_test import run_browser_test, main, BrowserTestRunner, BrowserTestError

# SonarCloud: The following tests intentionally use insecure protocols and local IPs
# to verify that the browser test runner correctly handles them and respects security
# boundaries (like allow_internal_ips).

class TestBrowserTest(unittest.TestCase):

    def test_main_arg_parsing(self):
        # Test that main() calls run_browser_test with correct arguments
        test_args = [
            'scripts/browser_test.py',
            '--url', 'http://example.com',
            '--action', 'check',
            '--selector', '.test-selector',
            '--dark-mode',
            '--mobile',
            '--wait', '2.5',
            '--allow-internal-ips'
        ]
        with patch.object(sys, 'argv', test_args):
            with patch('scripts.browser_test.run_browser_test') as mock_run:
                main()
                mock_run.assert_called_once()
                args = mock_run.call_args[0][0]
                self.assertEqual(args.url, 'http://example.com')
                self.assertEqual(args.action, 'check')
                self.assertEqual(args.selector, '.test-selector')
                self.assertTrue(args.dark_mode)
                self.assertTrue(args.mobile)
                self.assertEqual(args.wait, 2.5)
                self.assertTrue(args.allow_internal_ips)

    def test_main_missing_url(self):
        test_args = ['scripts/browser_test.py']
        with patch.object(sys, 'argv', test_args):
            with patch('sys.stderr', new_callable=MagicMock): # Suppress stderr
                with self.assertRaises(SystemExit):
                    main()

    def test_main_invalid_action(self):
        test_args = ['scripts/browser_test.py', '--url', 'http://example.com', '--action', 'invalid']
        with patch.object(sys, 'argv', test_args):
            with patch('sys.stderr', new_callable=MagicMock): # Suppress stderr
                with self.assertRaises(SystemExit):
                    main()

    def test_main_default_args(self):
        test_args = ['scripts/browser_test.py', '--url', 'http://example.com']
        with patch.object(sys, 'argv', test_args):
            with patch('scripts.browser_test.run_browser_test') as mock_run:
                main()
                mock_run.assert_called_once()
                args = mock_run.call_args[0][0]
                self.assertEqual(args.url, 'http://example.com')
                self.assertEqual(args.action, 'screenshot')
                self.assertEqual(args.wait, 0)
                self.assertFalse(args.dark_mode)
                self.assertFalse(args.mobile)
                self.assertFalse(args.full_page)
                self.assertFalse(args.show_browser)
                self.assertFalse(args.allow_internal_ips)

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_screenshot(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))] # example.com IP
        # Mock playwright objects
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value

        args = argparse.Namespace(
            url='http://example.com',
            action='screenshot',
            selector=None,
            output='test.png',
            wait=0,
            dark_mode=False,
            mobile=False,
            full_page=False,
            show_browser=False,
            allow_internal_ips=False
        )

        run_browser_test(args)

        mock_page.goto.assert_called_with('http://example.com')
        mock_page.screenshot.assert_called_with(path='test.png', full_page=False)
        mock_browser.close.assert_called_once()

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_check_success(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value

        # Mock locator().all() to return a list with one visible element
        mock_element = MagicMock()
        mock_element.is_visible.return_value = True
        mock_page.locator.return_value.all.return_value = [mock_element]

        args = argparse.Namespace(
            url='http://example.com',
            action='check',
            selector='.test',
            output=None,
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False,
            allow_internal_ips=False
        )

        run_browser_test(args)
        mock_page.locator.assert_called_with('.test')

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_check_failure(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value
        # Mock locator().all() to return empty list or list with no visible elements
        mock_page.locator.return_value.all.return_value = []

        args = argparse.Namespace(
            url='http://example.com',
            action='check',
            selector='.not-found',
            output=None,
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False,
            allow_internal_ips=False
        )

        with self.assertRaises(SystemExit) as cm:
            run_browser_test(args)
        self.assertEqual(cm.exception.code, 1)

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_text(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value
        mock_element = mock_page.locator.return_value.first
        mock_element.is_visible.return_value = True
        mock_element.inner_text.return_value = "Hello World"

        args = argparse.Namespace(
            url='http://example.com',
            action='text',
            selector='h1',
            output=None,
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False,
            allow_internal_ips=False
        )

        run_browser_test(args)
        mock_element.inner_text.assert_called_once()

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_click(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value

        args = argparse.Namespace(
            url='http://example.com',
            action='click',
            selector='button',
            output='clicked.png',
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False,
            allow_internal_ips=False
        )

        run_browser_test(args)
        mock_page.click.assert_called_with('button')
        mock_page.screenshot.assert_called_with(path='clicked.png')

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_input(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value

        args = argparse.Namespace(
            url='http://example.com',
            action='input',
            selector='input#name',
            input_text='Jules',
            output=None,
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False,
            allow_internal_ips=False
        )

        run_browser_test(args)
        mock_page.fill.assert_called_with('input#name', 'Jules')

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_wait(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value

        args = argparse.Namespace(
            url='http://example.com',
            action='screenshot',
            selector=None,
            output='test.png',
            wait=0.1,
            dark_mode=False,
            mobile=False,
            full_page=False,
            show_browser=False,
            allow_internal_ips=False
        )

        with patch('time.sleep') as mock_sleep:
            run_browser_test(args)
            mock_sleep.assert_called_with(0.1)

    @patch('scripts.browser_test.sync_playwright')
    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_run_browser_test_mobile(self, mock_getaddrinfo, mock_playwright):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value

        args = argparse.Namespace(
            url='http://example.com',
            action='screenshot',
            selector=None,
            output='test.png',
            wait=0,
            dark_mode=False,
            mobile=True,
            full_page=False,
            show_browser=False,
            allow_internal_ips=False
        )

        run_browser_test(args)
        mock_browser.new_page.assert_called_with(viewport={'width': 375, 'height': 667})

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_public_ip(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))] # example.com (Public IP)
        args = argparse.Namespace(allow_internal_ips=False)
        runner = BrowserTestRunner(args)
        runner.validate_url('http://example.com')
        # Should not raise exception

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_private_ip(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('192.168.1.1', 80))] # Private IP
        args = argparse.Namespace(allow_internal_ips=False)
        runner = BrowserTestRunner(args)

        with self.assertRaises(BrowserTestError) as cm:
            runner.validate_url('http://internal-server.local')
        self.assertIn("Access to internal IP address 192.168.1.1 is restricted", str(cm.exception))

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_loopback_ip(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('127.0.0.1', 80))] # Loopback IP
        args = argparse.Namespace(allow_internal_ips=False)
        runner = BrowserTestRunner(args)

        with self.assertRaises(BrowserTestError) as cm:
            runner.validate_url('http://localhost')
        self.assertIn("Access to internal IP address 127.0.0.1 is restricted", str(cm.exception))

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_link_local_ip(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('169.254.169.254', 80))] # Link-local IP
        args = argparse.Namespace(allow_internal_ips=False)
        runner = BrowserTestRunner(args)

        with self.assertRaises(BrowserTestError) as cm:
            runner.validate_url('http://169.254.169.254')
        self.assertIn("Access to internal IP address 169.254.169.254 is restricted", str(cm.exception))

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_ipv6_loopback(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET6, socket.SOCK_STREAM, 6, '', ('::1', 80, 0, 0))] # IPv6 Loopback
        args = argparse.Namespace(allow_internal_ips=False)
        runner = BrowserTestRunner(args)

        with self.assertRaises(BrowserTestError) as cm:
            runner.validate_url('http://localhost')
        self.assertIn("Access to internal IP address ::1 is restricted", str(cm.exception))

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_allow_internal(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('127.0.0.1', 80))]
        args = argparse.Namespace(allow_internal_ips=True)
        runner = BrowserTestRunner(args)

        # Should not raise exception because allow_internal_ips is True
        runner.validate_url('http://localhost')

    @patch('scripts.browser_test.socket.getaddrinfo')
    def test_validate_url_invalid_url(self, mock_getaddrinfo):
         args = argparse.Namespace(allow_internal_ips=False)
         runner = BrowserTestRunner(args)

         # Providing a URL without hostname (e.g., just a path or empty)
         # In the new implementation, non-http/https URLs or relative URLs might be ignored
         # if parsed_url.hostname is None.
         # But we explicitly throw error if scheme is http/https and hostname is None

         # 'not_a_valid_url' is parsed as path='not_a_valid_url', scheme='', netloc=''
         # So it returns None.

         # Let's test a case that should fail: http:/// (empty host)
         with self.assertRaises(BrowserTestError):
             runner.validate_url('http://')

if __name__ == '__main__':
    unittest.main()
