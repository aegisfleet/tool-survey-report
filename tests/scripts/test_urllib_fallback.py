import unittest
from unittest.mock import patch, MagicMock
import urllib.request
import urllib.error
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from scripts.check_links import check_link_with_urllib

class TestUrllibFallback(unittest.TestCase):

    @patch('scripts.check_links.is_safe_url')
    def test_ssrf_protection(self, mock_is_safe):
        """Test that unsafe URLs are blocked."""
        mock_is_safe.return_value = False
        url = "http://127.0.0.1" # NOSONAR
        status, reason = check_link_with_urllib(url)
        self.assertEqual(status, 0)
        self.assertIn("Blocked", reason)
        mock_is_safe.assert_called_with(url)

    @patch('scripts.check_links.is_safe_url')
    @patch('urllib.request.urlopen')
    def test_check_link_success_head(self, mock_urlopen, mock_is_safe):
        """Test successful link check using HEAD request."""
        mock_is_safe.return_value = True
        mock_response = MagicMock()
        mock_response.status = 200
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        url = "https://example.com"
        status, reason = check_link_with_urllib(url)

        self.assertEqual(status, 200)
        self.assertEqual(reason, "OK")

        # Verify HEAD request was attempted
        args, kwargs = mock_urlopen.call_args
        req = args[0]
        self.assertEqual(req.method, 'HEAD')

    @patch('scripts.check_links.is_safe_url')
    @patch('urllib.request.urlopen')
    def test_check_link_fallback_to_get(self, mock_urlopen, mock_is_safe):
        """Test fallback to GET when HEAD returns 405."""
        mock_is_safe.return_value = True

        # First call to urlopen (HEAD) raises HTTPError 405
        # Second call (GET) returns 200 OK
        mock_response_get = MagicMock()
        mock_response_get.status = 200
        mock_response_get.__enter__.return_value = mock_response_get

        # We need to capture the Request objects passed to urlopen
        captured_requests = []
        def side_effect(req):
            captured_requests.append(req)
            if len(captured_requests) == 1:
                raise urllib.error.HTTPError("url", 405, "Method Not Allowed", {}, None)
            return mock_response_get

        mock_urlopen.side_effect = side_effect

        url = "https://example.com"
        status, reason = check_link_with_urllib(url)

        self.assertEqual(status, 200)
        self.assertEqual(reason, "OK")
        self.assertEqual(mock_urlopen.call_count, 2)

        # Verify first call was HEAD
        self.assertEqual(captured_requests[0].method, 'HEAD')

        # Verify second call was GET
        self.assertEqual(captured_requests[1].method, 'GET')

    @patch('scripts.check_links.is_safe_url')
    @patch('urllib.request.urlopen')
    def test_check_link_404_not_found(self, mock_urlopen, mock_is_safe):
        """Test handling of 404 Not Found."""
        mock_is_safe.return_value = True
        mock_urlopen.side_effect = urllib.error.HTTPError("url", 404, "Not Found", {}, None)

        url = "https://example.com/notfound"
        status, reason = check_link_with_urllib(url)

        self.assertEqual(status, 404)
        self.assertEqual(reason, "Not Found")

    @patch('scripts.check_links.is_safe_url')
    @patch('urllib.request.urlopen')
    def test_check_link_url_error(self, mock_urlopen, mock_is_safe):
        """Test handling of URLError (e.g., DNS failure)."""
        mock_is_safe.return_value = True
        mock_urlopen.side_effect = urllib.error.URLError("DNS failure")

        url = "https://nonexistent.domain"
        status, reason = check_link_with_urllib(url)

        self.assertEqual(status, 0)
        self.assertEqual(reason, "DNS failure")

    @patch('scripts.check_links.is_safe_url')
    @patch('urllib.request.urlopen')
    def test_check_link_generic_exception(self, mock_urlopen, mock_is_safe):
        """Test handling of generic Exception."""
        mock_is_safe.return_value = True
        mock_urlopen.side_effect = Exception("Something went wrong")

        url = "https://example.com"
        status, reason = check_link_with_urllib(url)

        self.assertEqual(status, 0)
        self.assertEqual(reason, "Something went wrong")

if __name__ == "__main__":
    unittest.main()
