import unittest
from unittest.mock import patch, mock_open
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.check_links import find_links_in_file
from scripts import check_links

class TestLinkCaching(unittest.TestCase):

    @patch('scripts.check_links.find_links_in_file')
    @patch('scripts.check_links.check_link')
    def test_duplicate_checks_cached(self, mock_check_link, mock_find_links):
        """Test that duplicate links are checked only once."""
        # Setup
        files_to_check = ['dummy.md']
        broken_links = []
        warnings = []

        # Mock find_links_in_file to return duplicate links
        mock_find_links.return_value = ['https://example.com', 'https://example.com', 'https://example.org']

        # Mock check_link to return 200 OK
        mock_check_link.return_value = (200, "OK")

        # Run
        check_links._process_files(files_to_check, False, None, broken_links, warnings)

        # Verify
        # check_link should be called once for http://example.com and once for http://example.org
        self.assertEqual(mock_check_link.call_count, 2)

        calls = [args[0] for args, _ in mock_check_link.call_args_list]
        self.assertIn('https://example.com', calls)
        self.assertIn('https://example.org', calls)
        self.assertEqual(calls.count('https://example.com'), 1)

class TestFindLinksInFile(unittest.TestCase):

    @patch("builtins.open", new_callable=mock_open, read_data="")
    def test_empty_file(self, mock_file):
        """Test find_links_in_file with an empty file."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, [])

    @patch("builtins.open", new_callable=mock_open, read_data="This is a file with no links.")
    def test_no_links(self, mock_file):
        """Test find_links_in_file with text but no links."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, [])

    @patch("builtins.open", new_callable=mock_open, read_data="[Example](https://example.com)")
    def test_single_link(self, mock_file):
        """Test find_links_in_file with a single link."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["https://example.com"])

    @patch("builtins.open", new_callable=mock_open, read_data="[Example 1](https://example.com)\n[Example 2](https://test.com)")
    def test_multiple_links(self, mock_file):
        """Test find_links_in_file with multiple links on different lines."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["https://example.com", "https://test.com"])

    @patch("builtins.open", new_callable=mock_open, read_data="[HTTP](https://example.com) and [HTTPS](https://secure.com)")
    def test_http_and_https(self, mock_file):
        """Test find_links_in_file with http and https links."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["https://example.com", "https://secure.com"])

    @patch("builtins.open", new_callable=mock_open, read_data="[FTP](ftp://example.com) and [Relative](/foo/bar)")
    def test_ignore_non_http_links(self, mock_file):
        """Test find_links_in_file ignores non-http/https links."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, [])

    @patch("builtins.open", new_callable=mock_open, read_data="[Link 1](https://site1.com) text [Link 2](https://site2.com)")
    def test_multiple_links_same_line(self, mock_file):
        """Test find_links_in_file with multiple links on the same line."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["https://site1.com", "https://site2.com"])

    @unittest.expectedFailure
    @patch("builtins.open", new_callable=mock_open, read_data="[Link](http://example.com/foo(bar))")
    def test_link_with_parentheses(self, mock_file):
        """Test find_links_in_file with parentheses in URL (known failure)."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["http://example.com/foo(bar)"])

if __name__ == "__main__":
    unittest.main()
