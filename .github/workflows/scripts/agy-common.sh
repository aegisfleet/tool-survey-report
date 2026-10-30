#!/bin/bash
#
# Common helper functions and configurations for Antigravity CLI (agy) workflows.
# Conforms to Google Shell Style Guide.

set -euo pipefail

# Directory constants
readonly REPORTS_DIR="_reports"
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
  if [[ -z "$(git status --porcelain "${REPORTS_DIR}" "${CATEGORIES_FILE}")" ]]; then
    log_warn "No report or category changes detected to commit."
    return 1
  fi

  log_info "Staging report and category changes..."
  git add "${REPORTS_DIR}"/ "${CATEGORIES_FILE}"

  log_info "Committing: ${commit_msg}"
  git commit -m "${commit_msg}"

  log_info "Pushing branch ${branch_name} to origin..."
  git push origin "${branch_name}"

  log_info "Creating Pull Request: ${pr_title}"
  gh pr create \
    --base main \
    --head "${branch_name}" \
    --title "${pr_title}" \
    --body "${pr_body}"

  log_info "Pull Request created successfully."
  return 0
}

