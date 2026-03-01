import unittest
import sys
import os
from unittest.mock import patch, MagicMock

# Add scripts directory to path to import components
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import scripts.browser_test as browser_test

# SonarCloud security hotspot exclusions for testing purposes:
# The following tests intentionally use "http://" and internal IP addresses 
# to verify that the application correctly handles or blocks them.
# These are test vectors, not actual vulnerabilities in the production environment.
# NOSONAR

class TestBrowserTest(unittest.TestCase):

    def test_argument_parsing_basic(self):
        """Test basic argument parsing for site URL and actions."""
        args = browser_test.parse_args(["https://example.com", "screenshot", "check:title:Example"])
        self.assertEqual(args.url, "https://example.com")
        self.assertEqual(len(args.actions), 2)
        self.assertEqual(args.actions[0], "screenshot")

    def test_url_validation_safe(self):
        """Test URL validation with safe public URLs."""
        self.assertTrue(browser_test.is_safe_url("https://www.google.com"))
        self.assertTrue(browser_test.is_safe_url("https://github.com"))

    def test_url_validation_unsafe(self):
        """Test URL validation with private/internal IP addresses (SSRF protection)."""
        # NOSONAR: Intentional testing of SSRF blocking
        self.assertFalse(browser_test.is_safe_url("http://127.0.0.1"))
        self.assertFalse(browser_test.is_safe_url("http://192.168.1.1"))
        self.assertFalse(browser_test.is_safe_url("http://localhost"))

    @patch('scripts.browser_test.sync_playwright')
    def test_run_test_screenshot(self, mock_playwright):
        """Test the run_test logic for a simple screenshot action."""
        mock_browser = MagicMock()
        mock_context = MagicMock()
        mock_page = MagicMock()
        
        mock_playwright.return_value.start.return_value.chromium.launch.return_value = mock_browser
        mock_browser.new_context.return_value = mock_context
        mock_context.new_page.return_value = mock_page
        
        # Mock successful navigation
        mock_response = MagicMock()
        mock_response.status = 200
        mock_page.goto.return_value = mock_response

        browser_test.run_test("https://example.com", ["screenshot"])
        
        mock_page.goto.assert_called_with("https://example.com", wait_until="networkidle", timeout=30000)
        mock_page.screenshot.assert_called()

    def test_action_parsing_check(self):
        """Test parsing of complex check actions."""
        action = "check:text:Welcome"
        parts = action.split(':')
        self.assertEqual(parts[0], "check")
        self.assertEqual(parts[1], "text")
        self.assertEqual(parts[2], "Welcome")

    def test_action_parsing_input(self):
        """Test parsing of input actions with selectors."""
        action = "input:#search:query"
        parts = action.split(':')
        self.assertEqual(parts[0], "input")
        self.assertEqual(parts[1], "#search")
        self.assertEqual(parts[2], "query")

    @patch('scripts.browser_test.sync_playwright')
    def test_wait_action(self, mock_playwright):
        """Test that wait action correctly calls sleep."""
        mock_page = MagicMock()
        mock_playwright.return_value.start.return_value.chromium.launch.return_value.new_context.return_value.new_page.return_value = mock_page
        
        with patch('time.sleep') as mock_sleep:
            browser_test.run_test("https://example.com", ["wait:2"])
            mock_sleep.assert_called_with(2.0)

    @patch('scripts.browser_test.sync_playwright')
    def test_mobile_view(self, mock_playwright):
        """Test that --mobile flag uses appropriate device settings."""
        mock_browser = MagicMock()
        mock_playwright.return_value.start.return_value.chromium.launch.return_value = mock_browser
        
        browser_test.run_test("https://example.com", ["screenshot"], mobile=True)
        
        # Check if new_context was called with mobile-like parameters
        args, kwargs = mock_browser.new_context.call_args
        self.assertIn('viewport', kwargs)
        self.assertEqual(kwargs['viewport']['width'], 375)
        self.assertTrue(kwargs['is_mobile'])

if __name__ == '__main__':
    unittest.main()
