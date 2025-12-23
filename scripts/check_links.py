import os
import re
import urllib.request
import urllib.error
import socket
import argparse
import sys

# Increase timeout
socket.setdefaulttimeout(10)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def find_links_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Regex for markdown links: [text](url)
    # This is a simple regex and might miss some edge cases or match non-links, but good enough for now.
    links = re.findall(r'\[.*?\]\((https?://[^\)]+)\)', content)
    # Also find bare URLs if needed, but usually we care about [link](url)
    return links

def check_link(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        # Try HEAD first
        req.method = 'HEAD'
        try:
            with urllib.request.urlopen(req) as response:
                return response.status, "OK"
        except urllib.error.HTTPError as e:
            if e.code == 405: # Method Not Allowed, try GET
                req.method = 'GET'
                with urllib.request.urlopen(req) as response:
                    return response.status, "OK"
            else:
                return e.code, e.reason
    except urllib.error.HTTPError as e:
        return e.code, e.reason
    except urllib.error.URLError as e:
        return 0, str(e.reason)
    except Exception as e:
        return 0, str(e)

def main():
    parser = argparse.ArgumentParser(description="Check links in markdown files.")
    parser.add_argument("target", nargs='?', default="_reports", help="Directory or file to check")
    args = parser.parse_args()

    target = args.target
    files_to_check = []

    if os.path.isfile(target):
        files_to_check.append(target)
    elif os.path.isdir(target):
        for root, dirs, files in os.walk(target):
            for file in files:
                if file.endswith(".md"):
                    files_to_check.append(os.path.join(root, file))

    broken_links = []
    warnings = []

    print(f"Checking links in {len(files_to_check)} files...")

    for filepath in files_to_check:
        print(f"Checking {filepath}...")
        links = find_links_in_file(filepath)
        for url in links:
            # Skip local links or anchors
            if not url.startswith('http'):
                continue

            print(f"  Checking {url}...", end='', flush=True)
            status, reason = check_link(url)
            print(f" {status} {reason}")

            if status == 404:
                broken_links.append((filepath, url, status, reason))
            elif status != 200:
                # 403, 500, etc. might be temporary or anti-bot, but worth noting.
                warnings.append((filepath, url, status, reason))

    print("\n--- Report ---")
    if broken_links:
        print(f"\nFound {len(broken_links)} broken links (404):")
        for filepath, url, status, reason in broken_links:
            print(f"  {filepath}: {url} -> {status} {reason}")

    if warnings:
        print(f"\nFound {len(warnings)} potential issues (non-200/404):")
        for filepath, url, status, reason in warnings:
            print(f"  {filepath}: {url} -> {status} {reason}")

    if broken_links:
        sys.exit(1)
    else:
        print("\nNo broken links found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
