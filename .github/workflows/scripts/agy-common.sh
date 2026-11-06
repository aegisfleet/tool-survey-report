#!/bin/bash
#
# Common helper functions and configurations for Antigravity CLI (agy) workflows.
# Conforms to Google Shell Style Guide.

set -euo pipefail

# Directory constants
readonly REPORTS_DIR="_reports"
readonly TRENDING_DIR="_trending"
readonly CATEGORIES_FILE="_data/categories.yml"

# Antigravity CLI default parameters
readonly AGY_DEFAULT_MODEL="gemini-3.8-flash-medium"
readonly AGY_DEFAULT_EFFORT="medium"
readonly AGY_DEFAULT_TIMEOUT="40m"

#######################################
# Prints an informational log message.
#######################################
log_info() {
  echo "[INFO] $(date +'%Y-%m-%d %H:%M:%S') $*"
}

#######################################
# Prints a warning log message.
#######################################
log_warn() {
  echo "[WARN] $(date +'%Y-%m-%d %H:%M:%S') $*" >&2
}

#######################################
# Prints an error log message.
#######################################
log_error() {
  echo "[ERROR] $(date +'%Y-%m-%d %H:%M:%S') $*" >&2
}

#######################################
# Configures Git user and sets up credentials via gh CLI.
# Clears any GitHub Actions token extraheader to ensure VM's gh credentials
# are used for git push.
#######################################
setup_git_and_gh() {
  log_info "Configuring Git and GitHub CLI authentication..."
  git config --local --unset-all http.https://github.com/.extraheader 2>/dev/null || true

  local gh_user gh_email
  gh_user=$(gh api user --jq .login)
  gh_email=$(gh api user --jq '.email // "\(.id)+\(.login)@users.noreply.github.com"')

  git config user.name "${gh_user}"
  git config user.email "${gh_email}"
  gh auth setup-git
  log_info "Git configured as ${gh_user} <${gh_email}> with gh credential helper."
}

#######################################
# Extracts the tool_name from a report markdown file.
# Arguments:
#   file_path: Path of the markdown report
# Outputs:
#   Writes tool_name to stdout
#######################################
extract_tool_name() {
  local -r file_path="$1"
  local tool_name=""

  if [[ -f "${file_path}" ]]; then
    tool_name=$(grep -E "^tool_name:" "${file_path}" | head -n 1 | sed -E "s/^tool_name:[[:space:]]*['\"]?([^'\"]+)['\"]?/\1/" || echo "")
  fi

  if [[ -z "${tool_name}" ]]; then
    tool_name=$(basename "${file_path}" .md)
  fi

  echo "${tool_name}"
}

#######################################
# Invokes Antigravity CLI (agy) in headless mode with standard configurations.
# Arguments:
#   prompt: The prompt text to pass to agy
#   output_log: Path to write raw JSON output (default: agy_output.json)
# Returns:
#   0 on success, non-zero on failure
#######################################
run_agy() {
  local -r prompt="$1"
  local -r output_log="${2:-agy_output.json}"

  export SSH_CONNECTION="dummy 1 2 3"
  log_info "Invoking Antigravity CLI (model: ${AGY_DEFAULT_MODEL}, effort: ${AGY_DEFAULT_EFFORT}, timeout: ${AGY_DEFAULT_TIMEOUT})..."

  agy -p "${prompt}" \
    --model "${AGY_DEFAULT_MODEL}" \
    --effort "${AGY_DEFAULT_EFFORT}" \
    --dangerously-skip-permissions \
    --print-timeout "${AGY_DEFAULT_TIMEOUT}" \
    --output-format json < /dev/null | tee "${output_log}"
}

#######################################
# Scans staged files for secret-like strings that GitHub Push
# Protection would reject (Stripe / GitHub / AWS / Google / Slack /
# OpenAI-style keys and private key headers). This is a simple
# pre-push guard; it does not replace GitHub's own scanning.
# Outputs:
#   Writes only the offending file name and pattern label to stderr
#   (never the matched string itself)
# Returns:
#   0 when clean, 1 when a secret-like string is found
#######################################
scan_staged_for_secrets() {
  local -r patterns=(
    "Stripe API key|(sk|rk)_(live|test)_[0-9A-Za-z]{16,}"
    "Stripe webhook secret|whsec_[0-9A-Za-z]{32,}"
    "GitHub token|(ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{36,}|github_pat_[0-9A-Za-z_]{22,}"
    "AWS access key ID|AKIA[0-9A-Z]{16}"
    "Google API key|AIza[0-9A-Za-z_-]{35}"
    "Slack token|xox[baprs]-[0-9A-Za-z-]{10,}"
    "OpenAI-style API key|sk-(proj-|ant-)?[0-9A-Za-z_-]{20,}"
    "Private key header|-----BEGIN [A-Z ]*PRIVATE KEY-----"
  )

  local found=0
  local entry label regex file
  while IFS= read -r file; do
    [[ -n "${file}" && -f "${file}" ]] || continue
    for entry in "${patterns[@]}"; do
      label="${entry%%|*}"
      regex="${entry#*|}"
      if grep -E -q -e "${regex}" -- "${file}"; then
        log_error "Secret-like string detected (${label}) in staged file: ${file}"
        found=1
      fi
    done
  done < <(git diff --cached --name-only --diff-filter=ACM)

  if [[ "${found}" -ne 0 ]]; then
    log_error "Aborting: replace secret-like strings with placeholders (e.g. <YOUR_API_KEY>) before pushing."
    return 1
  fi

  log_info "Pre-push secret scan passed (no secret-like strings in staged files)."
  return 0
}

#######################################
# Escapes unescaped Liquid syntax ({{ ... }} and {% ... %}) in the
# Markdown body (after YAML frontmatter) of staged .md files under
# _reports/ and _trending/ by wrapping them in {% raw %}...{% endraw %}.
# Re-stages any modified files and fails if unescaped Liquid delimiters
# still remain.
# Returns:
#   0 when clean/fixed, 1 if unfixable Liquid delimiters remain
#######################################
sanitize_staged_liquid_syntax() {
  local -a md_files=()
  local file
  while IFS= read -r file; do
    if [[ "${file}" == *.md && -f "${file}" ]]; then
      md_files+=("${file}")
    fi
  done < <(git diff --cached --name-only --diff-filter=ACM)

  if [[ ${#md_files[@]} -eq 0 ]]; then
    return 0
  fi

  if ! python3 - "${md_files[@]}" <<'PYEOF'
import re
import sys

raw_block_re = re.compile(r"(\{%-?\s*raw\s*-?%\}.*?\{%-?\s*endraw\s*-?%\})", re.DOTALL)
liquid_expr_re = re.compile(r"(\$\{\{[^{}\n]*\}\}|\{\{[^{}\n]*\}\}|\{%[^%\n]*%\})")
fm_end_re = re.compile(r"\r?\n---\r?\n")

unfixed = False
for path in sys.argv[1:]:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if content.startswith("---\n") or content.startswith("---\r\n"):
        start_len = 5 if content.startswith("---\r\n") else 4
        m = fm_end_re.search(content, start_len)
        if not m:
            continue
        head = content[: m.end()]
        body = content[m.end() :]
    else:
        head = ""
        body = content

    parts = raw_block_re.split(body)
    changed = False
    for i in range(0, len(parts), 2):
        new_part, count = liquid_expr_re.subn(r"{% raw %}\1{% endraw %}", parts[i])
        if count > 0:
            parts[i] = new_part
            changed = True

    new_body = "".join(parts)
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(head + new_body)
        print(f"[INFO] Auto-escaped unescaped Liquid syntax in {path}")

    cleaned = raw_block_re.sub("", new_body)
    if "{{" in cleaned or "{%" in cleaned:
        print(f"[ERROR] Unescaped Liquid syntax remains in {path}", file=sys.stderr)
        unfixed = True

sys.exit(1 if unfixed else 0)
PYEOF
  then
    log_error "Unescaped Liquid syntax detected in staged Markdown files."
    return 1
  fi

  git add "${md_files[@]}"
  log_info "Pre-push Liquid syntax check passed."
  return 0
}

#######################################
# Commits changes in _reports/ and categories.yml, pushes to remote, and creates a PR.
# Arguments:
#   branch_name: Head branch name
#   commit_msg: Git commit message
#   pr_title: PR title
#   pr_body: PR body description
# Returns:
#   0 on success, 1 on failure / no changes
#######################################
commit_and_create_pr() {
  local -r branch_name="$1"
  local -r commit_msg="$2"
  local -r pr_title="$3"
  local -r pr_body="$4"

  # Check for changes in allowed paths
  if [[ -z "$(git status --porcelain "${REPORTS_DIR}" "${CATEGORIES_FILE}" "${TRENDING_DIR}" 2>/dev/null)" ]]; then
    log_warn "No report, trending, or category changes detected to commit."
    return 1
  fi

  log_info "Staging report, trending, and category changes..."
  git add "${REPORTS_DIR}"/ "${CATEGORIES_FILE}" "${TRENDING_DIR}"/ 2>/dev/null || true

  # Pre-push guard: ensure Liquid syntax in Markdown body is wrapped in {% raw %}...{% endraw %}.
  if ! sanitize_staged_liquid_syntax; then
    log_error "Liquid syntax check failed; aborting before commit and push."
    return 1
  fi

  # Pre-push guard: never push secret-like strings (Push Protection
  # would reject them, and a rejected push must not look successful).
  if ! scan_staged_for_secrets; then
    log_error "Secret scan failed; aborting before commit and push."
    return 1
  fi

  log_info "Committing: ${commit_msg}"
  if ! git commit -m "${commit_msg}"; then
    log_error "git commit failed."
    return 1
  fi

  log_info "Pushing branch ${branch_name} to origin..."
  if ! git push origin "${branch_name}"; then
    log_error "git push failed for branch ${branch_name}."
    return 1
  fi

  log_info "Creating Pull Request: ${pr_title}"
  if ! gh pr create \
    --base main \
    --head "${branch_name}" \
    --title "${pr_title}" \
    --body "${pr_body}"; then
    log_error "Failed to create Pull Request for branch ${branch_name}."
    return 1
  fi

  log_info "Pull Request created successfully."
  return 0
}

