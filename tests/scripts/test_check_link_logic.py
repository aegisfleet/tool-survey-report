import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from scripts.check_links import _check_link_logic

class TestCheckLinkLogic(unittest.TestCase):

    def setUp(self):
        self.mock_page = MagicMock()
        self.mock_response = MagicMock()
        self.mock_page.goto.return_value = self.mock_response
        self.mock_response.status = 200
        self.mock_page.url = "https://example.com"
        self.mock_page.inner_text.return_value = "Normal page content"
        self.mock_page.title.return_value = "Example Title"

    def test_normal_200_ok(self):
        status, reason = _check_link_logic(self.mock_page, "https://example.com")
        self.assertEqual(status, 200)
        self.assertEqual(reason, "OK")

    def test_bot_detection_blocked(self):
        bot_keywords = [
            'access blocked', 'access denied', 'you have been blocked',
            'unusual activity', 'security service', 'cloudflare'
        ]
        for kw in bot_keywords:
            with self.subTest(keyword=kw):
                # Reset inner_text mock for each subtest
                self.mock_page.inner_text.return_value = f"Some text and {kw} more text"
                status, reason = _check_link_logic(self.mock_page, "https://example.com")
                self.assertEqual(status, 403)
                self.assertEqual(reason, "Bot detection blocked (manual verification needed)")

    def test_soft_404_general(self):
        self.mock_page.inner_text.return_value = "This page 404 not found in body"
        status, reason = _check_link_logic(self.mock_page, "https://example.com")
        self.assertEqual(status, 404)
        self.assertEqual(reason, "Soft 404 (page shows not found message)")

    def test_soft_404_github(self):
        self.mock_page.url = "https://github.com/nonexistent/repo"
        self.mock_page.title.return_value = "Page not found · GitHub"
        status, reason = _check_link_logic(self.mock_page, "https://github.com/nonexistent/repo")
        self.assertEqual(status, 404)
        self.assertEqual(reason, "Soft 404 (page shows not found message)")

    def test_soft_404_github_broken_repo(self):
        self.mock_page.url = "https://github.com/some/repo"
        self.mock_page.title.return_value = "GitHub"
        self.mock_page.inner_text.return_value = "this is not the web page you are looking for"
        status, reason = _check_link_logic(self.mock_page, "https://github.com/some/repo")
        self.assertEqual(status, 404)
        self.assertEqual(reason, "Soft 404 (page shows not found message)")

    @patch('scripts.check_links.is_safe_url')
    def test_soft_404_codewiki(self, mock_is_safe):
        mock_is_safe.return_value = True
        self.mock_page.url = "https://codewiki.google.com/path"
        self.mock_page.title.return_value = "not found | code wiki"
        self.mock_page.inner_text.return_value = "this page doesn’t exist"
        status, reason = _check_link_logic(self.mock_page, "https://codewiki.google.com/path")
        self.assertEqual(status, 404)
        self.assertEqual(reason, "Soft 404 (page shows not found message)")

    @patch('scripts.check_links.is_safe_url')
    def test_ssrf_blocked(self, mock_is_safe):
        mock_is_safe.return_value = False
        status, reason = _check_link_logic(self.mock_page, "http://127.0.0.1")
        self.assertEqual(status, 0)
        self.assertIn("Blocked", reason)

    def test_handle_exception_during_goto(self):
        self.mock_page.goto.side_effect = Exception("Network error")
        status, reason = _check_link_logic(self.mock_page, "https://example.com")
        self.assertEqual(status, 0)
        self.assertEqual(reason, "Network error")

if __name__ == "__main__":
    unittest.main()
