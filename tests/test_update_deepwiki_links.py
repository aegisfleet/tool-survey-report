import unittest
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ['TESTING'] = '1'
from scripts.update_wiki_links import get_github_repo

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

if __name__ == "__main__":
    unittest.main()
