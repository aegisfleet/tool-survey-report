import unittest
from unittest.mock import patch, mock_open
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.check_links import find_links_in_file

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

    @patch("builtins.open", new_callable=mock_open, read_data="[Example](http://example.com)")
    def test_single_link(self, mock_file):
        """Test find_links_in_file with a single link."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["http://example.com"])

    @patch("builtins.open", new_callable=mock_open, read_data="[Example 1](http://example.com)\n[Example 2](https://test.com)")
    def test_multiple_links(self, mock_file):
        """Test find_links_in_file with multiple links on different lines."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["http://example.com", "https://test.com"])

    @patch("builtins.open", new_callable=mock_open, read_data="[HTTP](http://example.com) and [HTTPS](https://secure.com)")
    def test_http_and_https(self, mock_file):
        """Test find_links_in_file with http and https links."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["http://example.com", "https://secure.com"])

    @patch("builtins.open", new_callable=mock_open, read_data="[FTP](ftp://example.com) and [Relative](/foo/bar)")
    def test_ignore_non_http_links(self, mock_file):
        """Test find_links_in_file ignores non-http/https links."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, [])

    @patch("builtins.open", new_callable=mock_open, read_data="[Link 1](http://site1.com) text [Link 2](http://site2.com)")
    def test_multiple_links_same_line(self, mock_file):
        """Test find_links_in_file with multiple links on the same line."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["http://site1.com", "http://site2.com"])

    @unittest.expectedFailure
    @patch("builtins.open", new_callable=mock_open, read_data="[Link](http://example.com/foo(bar))")
    def test_link_with_parentheses(self, mock_file):
        """Test find_links_in_file with parentheses in URL (known failure)."""
        links = find_links_in_file("dummy.md")
        self.assertEqual(links, ["http://example.com/foo(bar)"])

if __name__ == "__main__":
    unittest.main()
