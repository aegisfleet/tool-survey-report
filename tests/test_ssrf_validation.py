import unittest
import socket
import ipaddress
from scripts.check_links import is_safe_url

class TestSSRFValidation(unittest.TestCase):
    """
    Unit tests for SSRF validation logic in check_links.py.
    
    NOTE: These tests use http:// examples and local IP addresses 
    intentionally to verify the blocking logic of the SSRF protection.
    These are not actual vulnerabilities but test cases for the validator.
    """

    def test_public_urls(self):
        # SONAR_IGNORE_START
        self.assertTrue(is_safe_url("https://www.google.com"))
        self.assertTrue(is_safe_url("https://github.com/aegisfleet"))
        self.assertTrue(is_safe_url("http://example.com")) # NOSONAR
        # SONAR_IGNORE_END

    def test_private_ips(self):
        """Verify that private network ranges are blocked."""
        # NOSONAR: Testing blocking of private IPs
        self.assertFalse(is_safe_url("http://127.0.0.1"))
        self.assertFalse(is_safe_url("http://192.168.0.1"))
        self.assertFalse(is_safe_url("http://10.0.0.1"))
        self.assertFalse(is_safe_url("http://172.16.0.1"))
        self.assertFalse(is_safe_url("http://localhost"))

    def test_ipv6_blocking(self):
        """Verify that IPv6 local/private addresses are blocked."""
        # NOSONAR: Testing blocking of IPv6 local/private addresses
        self.assertFalse(is_safe_url("http://[::1]"))
        self.assertFalse(is_safe_url("http://[fc00::]"))
        self.assertFalse(is_safe_url("http://[fe80::]"))

    def test_invalid_urls(self):
        self.assertFalse(is_safe_url("not-a-url"))
        self.assertFalse(is_safe_url("ftp://example.com"))
        self.assertFalse(is_safe_url("file:///etc/passwd"))

    def test_dns_resolution_failure(self):
        # Should return False for hostnames that don't exist
        self.assertFalse(is_safe_url("http://this.hostname.should.not.exist.at.all.12345"))

if __name__ == '__main__':
    unittest.main()
