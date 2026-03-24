import unittest
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
os.environ['TESTING'] = '1'
from scripts.update_wiki_links import get_github_repo, update_file
from unittest.mock import patch, mock_open

class TestGetGithubRepo(unittest.TestCase):
    def test_quoted_url(self):
        content = 'github: "https://github.com/owner/repo"'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

    def test_unquoted_url(self):
        content = 'github: https://github.com/owner/repo'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

    def test_http_url(self):
        content = 'github: "http://github.com/owner/repo"'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

    def test_url_with_dashes(self):
        content = 'github: "https://github.com/my-owner/my-repo"'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "my-owner")
        self.assertEqual(repo, "my-repo")

    def test_no_github_link(self):
        content = 'title: "My Report"\nlinks:\n  website: "https://example.com"'
        owner, repo = get_github_repo(content)
        self.assertIsNone(owner)
        self.assertIsNone(repo)

    def test_malformed_github_link(self):
        content = 'github: "https://notgithub.com/owner/repo"'
        owner, repo = get_github_repo(content)
        self.assertIsNone(owner)
        self.assertIsNone(repo)

    def test_extra_spaces(self):
        content = 'github:    "https://github.com/owner/repo"'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

    def test_trailing_slash_quoted(self):
        content = 'github: "https://github.com/owner/repo/"'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

    def test_trailing_slash_unquoted(self):
        content = 'github: https://github.com/owner/repo/'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

    def test_anchoring_line_start(self):
        content = 'notgithub: "https://github.com/wrong/repo"'
        owner, repo = get_github_repo(content)
        self.assertIsNone(owner)
        self.assertIsNone(repo)

    def test_match_with_indent(self):
        content = 'links:\n  github: "https://github.com/owner/repo"'
        owner, repo = get_github_repo(content)
        self.assertEqual(owner, "owner")
        self.assertEqual(repo, "repo")

class TestUpdateFile(unittest.TestCase):
    def test_update_file_not_found(self):
        with patch("builtins.open", side_effect=FileNotFoundError):
            with self.assertRaises(FileNotFoundError):
                update_file("non_existent.md", "owner", "repo", True, True)

    def test_update_file_placeholder_replacement(self):
        content = 'codewiki: "https://codewiki.google/"\n'
        filepath = "dummy.md"
        owner = "owner"
        repo = "repo"
        expected_url = f'https://codewiki.google/github.com/{owner}/{repo}'

        m = mock_open(read_data=content)
        with patch("builtins.open", m):
            result = update_file(filepath, owner, repo, True, False)
            self.assertTrue(result)

            # Check if write was called with updated content
            handle = m()
            written_content = "".join(call.args[0] for call in handle.write.call_args_list)
            if not written_content: # writelines was used
                 written_content = "".join("".join(call.args[0]) for call in handle.writelines.call_args_list)

            self.assertIn(f'codewiki: "{expected_url}"', written_content)

    def test_update_file_after_github_entry(self):
        content = 'links:\n  github: "https://github.com/owner/repo"\n'
        filepath = "dummy.md"
        owner = "owner"
        repo = "repo"
        expected_codewiki = f'  codewiki: "https://codewiki.google/github.com/{owner}/{repo}"\n'
        expected_deepwiki = f'  deepwiki: "https://deepwiki.com/{owner}/{repo}"\n'

        m = mock_open(read_data=content)
        with patch("builtins.open", m):
            result = update_file(filepath, owner, repo, False, False)
            self.assertTrue(result)

            handle = m()
            written_content = "".join("".join(call.args[0]) for call in handle.writelines.call_args_list)

            self.assertIn(expected_codewiki, written_content)
            self.assertIn(expected_deepwiki, written_content)

    def test_update_file_end_of_links_section(self):
        content = 'links:\n  other: "something"\n\n'
        filepath = "dummy.md"
        owner = "owner"
        repo = "repo"
        expected_codewiki = f'  codewiki: "https://codewiki.google/github.com/{owner}/{repo}"\n'
        expected_deepwiki = f'  deepwiki: "https://deepwiki.com/{owner}/{repo}"\n'

        m = mock_open(read_data=content)
        with patch("builtins.open", m):
            result = update_file(filepath, owner, repo, False, False)
            self.assertTrue(result)

            handle = m()
            written_content = "".join("".join(call.args[0]) for call in handle.writelines.call_args_list)

            self.assertIn(expected_codewiki, written_content)
            self.assertIn(expected_deepwiki, written_content)

    def test_update_file_no_changes(self):
        owner = "owner"
        repo = "repo"
        content = f'links:\n  codewiki: "https://codewiki.google/github.com/{owner}/{repo}"\n  deepwiki: "https://deepwiki.com/{owner}/{repo}"\n'
        filepath = "dummy.md"

        m = mock_open(read_data=content)
        with patch("builtins.open", m):
            result = update_file(filepath, owner, repo, True, True)
            self.assertFalse(result)

            handle = m()
            handle.write.assert_not_called()
            handle.writelines.assert_not_called()

    def test_update_file_write_error(self):
        content = 'codewiki: "https://codewiki.google/"\n'
        filepath = "dummy.md"
        owner = "owner"
        repo = "repo"

        m = mock_open(read_data=content)
        def side_effect(file, mode='r', *args, **kwargs):
            if 'w' in mode:
                raise OSError("Disk full")
            return m.return_value

        with patch("builtins.open", side_effect=side_effect):
            with self.assertRaises(OSError):
                update_file(filepath, owner, repo, True, False)

if __name__ == "__main__":
    unittest.main()
