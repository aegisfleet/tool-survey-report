import os
import sys
import argparse
import yaml
import re

def load_all_reports(reports_dir):
    """Load tool_name map from all reports."""
    tool_map = {}
    report_data = {}
    
    if not os.path.exists(reports_dir):
        return tool_map, report_data

    for root, _, files in os.walk(reports_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                if content.startswith("---"):
                    parts = content.split("---", 2)
                    if len(parts) >= 3:
                        fm = yaml.safe_load(parts[1])
                        if isinstance(fm, dict):
                            tool_name = fm.get("tool_name")
                            if tool_name:
                                tool_map[tool_name] = filepath
                            report_data[filepath] = fm
            except Exception as e:
                print(f"Warning: Failed to parse YAML frontmatter in {filepath}: {e}", file=sys.stderr)
                
    return tool_map, report_data

def validate_relationships(filepath, fm, tool_map):
    """Validate relationships in a single report frontmatter."""
    errors = []
    current_tool = fm.get("tool_name")
    rel = fm.get("relationships")

    if not rel:
        return errors
    if not isinstance(rel, dict):
        errors.append(f"'relationships' must be a mapping/dict, got {type(rel).__name__}")
        return errors

    # 1. Parent validation
    if "parent" in rel and rel["parent"] is not None:
        parent = rel["parent"]
        if not isinstance(parent, str):
            errors.append(f"parent must be a string, got {type(parent).__name__}")
        else:
            parent = parent.strip()
            if not parent:
                errors.append("parent cannot be empty")
            elif parent == current_tool:
                errors.append(f"parent cannot refer to self ('{parent}')")
            elif parent not in tool_map:
                errors.append(f"parent '{parent}' not found in any report (must match an existing tool_name)")

    # 2. Children validation
    children = rel.get("children")
    if children is not None:
        if not isinstance(children, list):
            errors.append(f"children must be a list/array, got {type(children).__name__}")
        else:
            if len(children) > 5:
                errors.append(f"children exceeds maximum limit of 5 items (currently {len(children)} items)")
            
            seen_children = set()
            for idx, child in enumerate(children):
                if not isinstance(child, str):
                    errors.append(f"children[{idx}] must be a string, got {type(child).__name__}")
                else:
                    child = child.strip()
                    if not child:
                        errors.append(f"children[{idx}] cannot be empty")
                    elif child in seen_children:
                        errors.append(f"duplicate entry in children: '{child}'")
                    else:
                        seen_children.add(child)
                    
                    if child == current_tool:
                        errors.append(f"children cannot refer to self ('{child}')")
                    elif child not in tool_map:
                        errors.append(f"child '{child}' not found in any report (must match an existing tool_name)")

    # 3. Related tools validation
    related = rel.get("related_tools")
    if related is not None:
        if not isinstance(related, list):
            errors.append(f"related_tools must be a list/array, got {type(related).__name__}")
        else:
            if len(related) > 7:
                errors.append(f"related_tools exceeds maximum limit of 7 items (currently {len(related)} items)")
            
            seen_related = set()
            for idx, item in enumerate(related):
                if not isinstance(item, str):
                    errors.append(f"related_tools[{idx}] must be a string, got {type(item).__name__}")
                else:
                    item = item.strip()
                    if not item:
                        errors.append(f"related_tools[{idx}] cannot be empty")
                    elif item in seen_related:
                        errors.append(f"duplicate entry in related_tools: '{item}'")
                    else:
                        seen_related.add(item)
                    
                    if item == current_tool:
                        errors.append(f"related_tools cannot refer to self ('{item}')")
                    elif item not in tool_map:
                        errors.append(f"related_tool '{item}' not found in any report (must match an existing tool_name)")

    # 4. Overlap validation
    if isinstance(children, list) and isinstance(related, list):
        overlap = set([c for c in children if isinstance(c, str)]) & set([r for r in related if isinstance(r, str)])
        if overlap:
            errors.append(f"overlap between children and related_tools: {', '.join(sorted(overlap))}")

    return errors

def main():
    parser = argparse.ArgumentParser(description="Validate relationships in report frontmatter.")
    parser.add_argument("target", nargs="?", default="_reports", help="Directory or file to check")
    args = parser.parse_args()

    reports_dir = "_reports"
    tool_map, all_report_data = load_all_reports(reports_dir)

    target = args.target
    files_to_check = []

    if os.path.isfile(target):
        files_to_check.append(target)
    elif os.path.isdir(target):
        for root, _, files in os.walk(target):
            for file in files:
                if file.endswith(".md"):
                    files_to_check.append(os.path.join(root, file))
    else:
        print(f"Target not found: {target}", file=sys.stderr)
        sys.exit(1)

    if not files_to_check:
        print("No report files found to check.")
        sys.exit(0)

    print(f"Checking relationships in {len(files_to_check)} files...")
    total_errors = 0

    for filepath in sorted(files_to_check):
        fm = all_report_data.get(filepath)
        if fm is None:
            # File wasn't in all_report_data (e.g. loaded specifically or failed earlier)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                if content.startswith("---"):
                    parts = content.split("---", 2)
                    if len(parts) >= 3:
                        fm = yaml.safe_load(parts[1])
            except Exception as e:
                print(f"[FAIL] {filepath}: YAML parse error: {e}")
                total_errors += 1
                continue

        if not isinstance(fm, dict):
            continue

        errors = validate_relationships(filepath, fm, tool_map)
        if errors:
            print(f"[FAIL] {filepath}:")
            for err in errors:
                print(f"  - {err}")
            total_errors += len(errors)

    if total_errors > 0:
        print(f"\n❌ Found {total_errors} relationship validation error(s).")
        sys.exit(1)
    else:
        print(f"\n✅ All relationships in {len(files_to_check)} file(s) are valid.")
        sys.exit(0)

if __name__ == "__main__":
    main()
