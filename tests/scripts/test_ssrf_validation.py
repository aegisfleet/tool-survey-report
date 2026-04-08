import unittest
import socket
import ipaddress
from urllib.parse import urlparse
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from scripts.ssrf_utils import is_url_ssr_safe, validate_url_ssr_safe, SSRFError

# SonarCloud: The following tests intentionally use insecure protocols and local IPs
# to verify that the SSRF protection logic correctly blocks them.
# NOSONAR is used for line-level silencing where appropriate in SonarCloud.

class TestSSRFValidation(unittest.TestCase):

    def test_unsafe_local_ips(self):
        unsafe_urls = [
            "http://127.0.0.1",
            "http://0.0.0.0",
            "http://localhost",
            "http://[::1]",
            "http://192.168.1.1",
            "http://10.0.0.1",
            "http://172.16.0.1",
            "http://169.254.169.254" # Cloud metadata
        ]

        for url in unsafe_urls:
            self.assertFalse(is_url_ssr_safe(url), f"Should block {url}")
            with self.assertRaises(SSRFError):
                validate_url_ssr_safe(url)

    def test_schemes(self):
        self.assertFalse(is_url_ssr_safe("ftp://example.com"))
        self.assertFalse(is_url_ssr_safe("file:///etc/passwd"))
        self.assertFalse(is_url_ssr_safe("javascript:alert(1)"))

    def test_safe_public_ip(self):
        # 8.8.8.8 is Google DNS, definitely public
        self.assertTrue(is_url_ssr_safe("http://8.8.8.8"), "Should allow public IP 8.8.8.8")

    def test_safe_public_domain(self):
        # We need to mock socket.getaddrinfo to avoid network calls and flaky tests
        original_getaddrinfo = socket.getaddrinfo

        def mock_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
            if host == "example.com":
                return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
            elif host == "internal.local":
                return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('192.168.1.100', 80))]
            return original_getaddrinfo(host, port, family, type, proto, flags)

        socket.getaddrinfo = mock_getaddrinfo
        try:
            self.assertTrue(is_url_ssr_safe("http://example.com"), "Should allow example.com")
            self.assertFalse(is_url_ssr_safe("http://internal.local"), "Should block internal.local")
        finally:
            socket.getaddrinfo = original_getaddrinfo

if __name__ == '__main__':
    unittest.main()
