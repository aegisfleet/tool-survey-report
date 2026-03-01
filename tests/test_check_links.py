import unittest
from unittest.mock import patch, MagicMock
import os
import sys

# Add the scripts directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from scripts.check_links import find_links_in_file, check_link_with_urllib, is_safe_url

class TestCheckLinks(unittest.TestCase):

    def test_find_links(self):
        # Create a temporary markdown file
        with open('test_links.md', 'w') as f:
            f.write("[Link 1](https://example.com)\n")
            f.write("[Link 2](https://google.com/search?q=test)\n")
            f.write("Some text [Link 3](http://sub.domain.org/path)\n")
            f.write("Broken link [test](not-a-url)\n")
        
        links = find_links_in_file('test_links.md')
        self.assertEqual(len(links), 3)
        self.assertIn("https://example.com", links)
        self.assertIn("https://google.com/search?q=test", links)
        self.assertIn("http://sub.domain.org/path", links)
        
        os.remove('test_links.md')

    @patch('urllib.request.urlopen')
    def test_check_link_success(self, mock_urlopen):
        # Mock response object
        mock_response = MagicMock()
        mock_response.status = 200
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        status, reason = check_link_with_urllib("https://example.com")
        self.assertEqual(status, 200)
        self.assertEqual(reason, "OK")

    @patch('urllib.request.urlopen')
    def test_check_link_404(self, mock_urlopen):
        import urllib.error
        
        # Mock HTTPError
        mock_urlopen.side_effect = urllib.error.HTTPError(
            "https://example.com/404", 404, "Not Found", None, None
        )

        status, reason = check_link_with_urllib("https://example.com/404")
        self.assertEqual(status, 404)
        self.assertEqual(reason, "Not Found")

    @patch('scripts.check_links.check_link')
    def test_duplicate_checks_cached(self, mock_check_link):
        from scripts.check_links import _process_files
        
        mock_check_link.return_value = (200, "OK")
        
        # We need to mock find_links_in_file to return same link twice
        with patch('scripts.check_links.find_links_in_file') as mock_find:
            mock_find.return_value = ["https://example.com", "https://example.com"]
            
            broken = []
            warnings = []
            _process_files(["test.md"], False, None, broken, warnings)
            
            # check_link should only be called once for the same URL
            mock_check_link.assert_called_once_with(
                "https://example.com", use_browser=False, browser_context=None, page=None
            )

    def test_ssrf_blocking(self):
        # Local IPs should be blocked
        self.assertFalse(is_safe_url("http://127.0.0.1"))
        self.assertFalse(is_safe_url("http://192.168.1.1"))
        self.assertFalse(is_safe_url("http://localhost"))
        # External IPs should be allowed
        self.assertTrue(is_safe_url("https://8.8.8.8"))
        self.assertTrue(is_safe_url("https://example.com"))

if __name__ == '__main__':
    unittest.main()
