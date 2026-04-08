import socket
import ipaddress
import urllib.parse

class SSRFError(Exception):
    """Exception raised for SSRF-related validation errors."""
    pass

def _is_restricted_ip(ip):
    """Checks if an IP address is in a restricted range."""
    return (ip.is_private or
            ip.is_loopback or
            ip.is_link_local or
            ip.is_multicast or
            ip.is_reserved or
            ip.is_unspecified)

def _validate_ip_literal(hostname):
    """
    Attempts to validate hostname as an IP literal.
    Returns True if it is an IP literal (validated), False otherwise.
    Raises SSRFError if it's a restricted IP literal.
    """
    try:
        ip = ipaddress.ip_address(hostname.strip("[]"))
        if _is_restricted_ip(ip):
            raise SSRFError(f"Access to internal IP address {hostname} is restricted.")
        return True
    except ValueError:
        return False

def _resolve_and_validate(hostname, url):
    """
    Resolves hostname and validates all resulting IP addresses.
    Raises SSRFError if resolution fails or any IP is restricted.
    """
    try:
        # We use getaddrinfo to support IPv6 and get all addresses
        addr_info = socket.getaddrinfo(hostname, None)
    except socket.gaierror as e:
        # If we can't resolve it, fail securely.
        raise SSRFError(f"Error resolving URL {url}: {e}") from e

    for addr in addr_info:
        # addr is (family, type, proto, canonname, sockaddr)
        ip_str = addr[4][0]
        # Handle IPv6 scope id if present
        if '%' in ip_str:
            ip_str = ip_str.split('%')[0]

        try:
            ip = ipaddress.ip_address(ip_str)
        except ValueError:
            continue # Skip if not a valid IP

        if _is_restricted_ip(ip):
            raise SSRFError(f"Access to internal IP address {ip_str} is restricted.")

def validate_url_ssr_safe(url):
    """
    Validates the URL to prevent SSRF attacks.
    Checks:
    1. Scheme is http or https.
    2. Hostname exists.
    3. Hostname resolves to a public IP address (not private, loopback, link-local, etc).

    Raises SSRFError if the URL is deemed unsafe.
    """
    try:
        parsed_url = urllib.parse.urlparse(url)

        if parsed_url.scheme not in ['http', 'https']:
            raise SSRFError(f"Invalid URL scheme: {parsed_url.scheme}. Only http and https are allowed.")

        hostname = parsed_url.hostname
        if not hostname:
            raise SSRFError(f"Invalid URL (no hostname): {url}")

        if not _validate_ip_literal(hostname):
            _resolve_and_validate(hostname, url)

    except SSRFError:
        raise
    except Exception as e:
        # Catch-all for any other unexpected errors during validation
        raise SSRFError(f"SSRF validation failed for {url}: {e}") from e

def is_url_ssr_safe(url):
    """
    Boolean helper for SSRF validation.
    Returns True if the URL is safe, False otherwise.
    """
    try:
        validate_url_ssr_safe(url)
        return True
    except SSRFError:
        return False
