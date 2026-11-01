import os
import re
import argparse
import sys
import unicodedata

# Check for playwright availability
try:
    from playwright.sync_api import sync_playwright
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False

HTML_CONTENT = """<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: false });
    window.mermaid = mermaid;
    window.mermaidReady = true;
  </script>
</head>
<body>
</body>
</html>"""

def find_mermaid_blocks(filepath):
    """Extract Mermaid code blocks with their start line numbers."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    blocks = []
    in_block = False
    current_block = []
    start_line = 0
    
    for idx, line in enumerate(lines):
        # Match markdown block start
        if line.strip().startswith("```mermaid"):
            in_block = True
            start_line = idx + 1  # 1-indexed
            current_block = []
        elif line.strip() == "```" and in_block:
            in_block = False
            blocks.append({
                "code": "\n".join(current_block),
                "line": start_line
            })
        elif in_block:
            current_block.append(line.rstrip('\r\n'))
            
    return blocks

def validate_static_mermaid_blocks(filepath, blocks):
    """Validate Mermaid blocks without a browser.

    Catches subgraph labels that Mermaid's lexer cannot parse unless quoted,
    such as Japanese punctuation inside an unquoted title (e.g. ストレージ・配信層).
    """
    errors = []
    subgraph_pattern = re.compile(r'^\s*subgraph\s+(.+?)\s*$')
    # Characters that break Mermaid's lexer in unquoted subgraph labels.
    invalid_ascii_chars = set(',()[]{}<>|@=~"')

    for block in blocks:
        for offset, line in enumerate(block["code"].splitlines(), start=1):
            match = subgraph_pattern.match(line)
            if not match:
                continue

            label = match.group(1)
            if label.startswith('"') or '[' in label:
                continue

            # Mermaid accepts many ASCII punctuation characters in unquoted
            # titles, but some ASCII punctuation and non-ASCII punctuation/
            # symbols (e.g. '・', '：', '（', '—') break the lexer.
            invalid_chars = sorted({
                char for char in label
                if char in invalid_ascii_chars
                or (ord(char) > 127 and unicodedata.category(char)[0] in ('P', 'S'))
            })
            if invalid_chars:
                errors.append({
                    "line": block["line"] + offset,
                    "error": (
                        "Unquoted subgraph label contains punctuation that Mermaid "
                        f"cannot parse: {''.join(invalid_chars)}. "
                        'Quote it as subgraph ID["表示名"] or subgraph "表示名".'
                    )
                })

    return errors

def validate_mermaid_blocks(filepath, blocks, page):
    """Validate all Mermaid blocks in a file using Playwright."""
    errors = []
    
    # JavaScript check function
    # Note: mermaid.parse in v11 is an async function returning a Promise.
    js_validator = """
    async (code) => {
        if (!window.mermaid) {
            return { valid: false, error: "Mermaid library is not loaded in the browser." };
        }
        try {
            await window.mermaid.parse(code);
            return { valid: true, error: null };
        } catch (e) {
            return { valid: false, error: e.message || String(e) };
        }
    }
    """
    
    for block in blocks:
        code = block["code"]
        line = block["line"]
        
        try:
            result = page.evaluate(js_validator, code)
            if not result["valid"]:
                errors.append({
                    "line": line,
                    "error": result["error"]
                })
        except Exception as e:
            errors.append({
                "line": line,
                "error": f"Evaluation error: {str(e)}"
            })
            
    return errors

def check_files(files_to_check, page=None):
    """Run static checks for every file, plus browser parsing when available."""
    total_errors = 0

    for filepath in files_to_check:
        blocks = find_mermaid_blocks(filepath)
        if not blocks:
            continue

        print(f"  Checking {filepath} ({len(blocks)} diagrams)...", end="", flush=True)
        errors = validate_static_mermaid_blocks(filepath, blocks)
        if page is not None:
            errors.extend(validate_mermaid_blocks(filepath, blocks, page))

        if errors:
            print(" FAIL")
            for err in errors:
                print(f"    Line {err['line']}: Syntax Error: {err['error']}")
            total_errors += len(errors)
        else:
            print(" OK")

    return total_errors


def main():
    parser = argparse.ArgumentParser(description="Validate Mermaid syntax in markdown files.")
    parser.add_argument("target", nargs='?', default="_reports", help="Directory or file to check")
    parser.add_argument("--static", action="store_true", help="Run static checks only (no browser)")
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

    if not files_to_check:
        print("No markdown files found to check.")
        sys.exit(0)

    print(f"Checking Mermaid syntax in {len(files_to_check)} files...")

    if args.static:
        print("Running static checks only (--static).")
        total_errors = check_files(files_to_check)
    elif not HAS_PLAYWRIGHT:
        print("Warning: Playwright is not installed. Running static checks only.")
        print("Tip: Run 'uv run python3 -m playwright install chromium' to enable full syntax checking.")
        total_errors = check_files(files_to_check)
    else:
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                try:
                    # Create a page and load the HTML content with Mermaid loaded
                    page = browser.new_page()
                    page.set_content(HTML_CONTENT)

                    # Wait for Mermaid to be ready on window
                    page.wait_for_function("window.mermaidReady === true", timeout=15000)
                    total_errors = check_files(files_to_check, page)
                finally:
                    browser.close()
        except Exception as e:
            print(f"Warning: Browser-based Mermaid check unavailable ({e}). Running static checks only.")
            total_errors = check_files(files_to_check)

    if total_errors > 0:
        print(f"\nFound {total_errors} Mermaid syntax errors.")
        sys.exit(1)
    else:
        print("\nAll Mermaid diagrams are valid.")
        sys.exit(0)

if __name__ == "__main__":
    main()
