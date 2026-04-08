import unittest
from unittest.mock import patch
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
            "http://127.0.0.1", # NOSONAR
            "http://0.0.0.0", # NOSONAR
            "http://localhost", # NOSONAR
            "http://[::1]", # NOSONAR
            "http://192.168.1.1", # NOSONAR
            "http://10.0.0.1", # NOSONAR
            "http://172.16.0.1", # NOSONAR
            "http://169.254.169.254" # NOSONAR - Cloud metadata
        ]

        for url in unsafe_urls:
            self.assertFalse(is_url_ssr_safe(url), f"Should block {url}")
            with self.assertRaises(SSRFError):
                validate_url_ssr_safe(url)

    def test_schemes(self):
        self.assertFalse(is_url_ssr_safe("ftp://example.com")) # NOSONAR
        self.assertFalse(is_url_ssr_safe("file:///etc/passwd")) # NOSONAR
        self.assertFalse(is_url_ssr_safe("javascript:alert(1)")) # NOSONAR

    def test_safe_public_ip(self):
        # 8.8.8.8 is Google DNS, definitely public
        self.assertTrue(is_url_ssr_safe("http://8.8.8.8"), "Should allow public IP 8.8.8.8") # NOSONAR

    def test_safe_public_domain(self):
        # We need to mock socket.getaddrinfo to avoid network calls and flaky tests
        def mock_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
            if host == "example.com":
                return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 80))]
            elif host == "internal.local":
                return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('192.168.1.100', 80))] # NOSONAR
            return socket.getaddrinfo(host, port, family, type, proto, flags)

        with patch('socket.getaddrinfo', side_effect=mock_getaddrinfo):
            self.assertTrue(is_url_ssr_safe("http://example.com"), "Should allow example.com")
            self.assertFalse(is_url_ssr_safe("http://internal.local"), "Should block internal.local")

if __name__ == '__main__':
    unittest.main()
