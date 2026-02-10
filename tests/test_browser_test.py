import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import argparse

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.browser_test import run_browser_test, main

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
            '--wait', '2.5'
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

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_screenshot(self, mock_playwright):
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
            show_browser=False
        )

        run_browser_test(args)

        mock_page.goto.assert_called_with('http://example.com')
        mock_page.screenshot.assert_called_with(path='test.png', full_page=False)
        mock_browser.close.assert_called_once()

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_check_success(self, mock_playwright):
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value
        mock_page.locator.return_value.count.return_value = 1

        args = argparse.Namespace(
            url='http://example.com',
            action='check',
            selector='.test',
            output=None,
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False
        )

        run_browser_test(args)
        mock_page.locator.assert_called_with('.test')

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_check_failure(self, mock_playwright):
        mock_p = mock_playwright.return_value.__enter__.return_value
        mock_browser = mock_p.chromium.launch.return_value
        mock_page = mock_browser.new_page.return_value
        mock_page.locator.return_value.count.return_value = 0

        args = argparse.Namespace(
            url='http://example.com',
            action='check',
            selector='.not-found',
            output=None,
            wait=0,
            dark_mode=False,
            mobile=False,
            show_browser=False
        )

        with self.assertRaises(SystemExit) as cm:
            run_browser_test(args)
        self.assertEqual(cm.exception.code, 1)

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_text(self, mock_playwright):
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
            show_browser=False
        )

        run_browser_test(args)
        mock_element.inner_text.assert_called_once()

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_click(self, mock_playwright):
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
            show_browser=False
        )

        run_browser_test(args)
        mock_page.click.assert_called_with('button')
        mock_page.screenshot.assert_called_with(path='clicked.png')

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_input(self, mock_playwright):
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
            show_browser=False
        )

        run_browser_test(args)
        mock_page.fill.assert_called_with('input#name', 'Jules')

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_wait(self, mock_playwright):
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
            show_browser=False
        )

        with patch('time.sleep') as mock_sleep:
            run_browser_test(args)
            mock_sleep.assert_called_with(0.1)

    @patch('scripts.browser_test.sync_playwright')
    def test_run_browser_test_mobile(self, mock_playwright):
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
            show_browser=False
        )

        run_browser_test(args)
        mock_browser.new_page.assert_called_with(viewport={'width': 375, 'height': 667})

if __name__ == '__main__':
    unittest.main()
