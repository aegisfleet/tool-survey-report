#!/bin/bash
#
# Daily Report Maintenance Script using Antigravity CLI (agy).
#
# This script identifies survey reports that require updates (either the oldest
# reports based on last_updated date or a user-specified target report), invokes
# the Antigravity CLI to conduct an up-to-date survey and update the report,
# commits the changes to a dedicated branch, and creates a pull request.
#
# Environment variables used:
#   REPORT_COUNT: Number of oldest reports to update (default: 1)
#   TARGET_REPORT: Specific report filename or tool name to update (optional)

set -euo pipefail

# Load common library
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=.github/workflows/scripts/agy-common.sh
source "${SCRIPT_DIR}/agy-common.sh"

#######################################
# Resolves a specific report file matching the target input.
# Arguments:
#   target_input: Filename or tool_name
# Outputs:
#   Writes matched file path to stdout
# Returns:
#   0 on success, 1 on failure
#######################################
find_specific_report() {
  local -r target_input="$1"
  local -r clean_target="$(echo "${target_input}" | tr '[:upper:]' '[:lower:]')"
  local matched=""

  # 1. Exact filename match
  if [[ -f "${REPORTS_DIR}/${target_input}" ]]; then
    matched="${REPORTS_DIR}/${target_input}"
  elif [[ -f "${REPORTS_DIR}/${target_input}.md" ]]; then
    matched="${REPORTS_DIR}/${target_input}.md"
  elif [[ -f "${REPORTS_DIR}/${clean_target}.md" ]]; then
    matched="${REPORTS_DIR}/${clean_target}.md"
  fi

  # 2. Exact tool_name match (case-insensitive)
  if [[ -z "${matched}" ]]; then
    for f in "${REPORTS_DIR}"/*.md; do
      [[ -e "${f}" ]] || continue
      local tname
      tname=$(extract_tool_name "${f}")
      if [[ "${tname,,}" == "${clean_target}" ]]; then
        matched="${f}"
        break
      fi
    done
  fi

  # 3. Partial filename or tool_name match
  if [[ -z "${matched}" ]]; then
    local -a partial_matches=()
    for f in "${REPORTS_DIR}"/*.md; do
      [[ -e "${f}" ]] || continue
      local fname
      fname="$(basename "${f}" .md)"
      local tname
      tname=$(extract_tool_name "${f}")
      if [[ "${fname,,}" =~ ${clean_target} ]] || [[ "${tname,,}" =~ ${clean_target} ]]; then
        partial_matches+=("${f}")
      fi
    done

    if [[ ${#partial_matches[@]} -eq 1 ]]; then
      matched="${partial_matches[0]}"
    elif [[ ${#partial_matches[@]} -gt 1 ]]; then
      log_error "Multiple reports matched '${target_input}': ${partial_matches[*]}"
      return 1
    fi
  fi

  if [[ -n "${matched}" ]]; then
    echo "${matched}"
    return 0
  else
    log_error "No report found matching '${target_input}'"
    return 1
  fi
}

#######################################
# Finds the oldest reports based on last_updated frontmatter.
# Arguments:
#   count: Number of reports to retrieve
# Outputs:
#   Writes list of report paths to stdout
#######################################
get_oldest_reports() {
  local -r count="$1"

  grep -H -m 1 "^last_updated:" "${REPORTS_DIR}"/*.md \
    | sed -E "s/^([^:]+):last_updated:[[:space:]]*['\"]?([^'\"]+)['\"]?/\2 \1/" \
    | sort \
    | awk -v n="${count}" 'NR <= n {print $2}'
}

#######################################
# Builds the prompt for Antigravity CLI.
# Arguments:
#   tool_name: Name of the tool
#   report_path: Path of the report file
#   today_jst: Current date in JST
# Outputs:
#   Writes prompt string to stdout
#######################################
build_maintenance_prompt() {
  local -r tool_name="$1"
  local -r report_path="$2"
  local -r today_jst="$3"

  cat <<EOF
# レポート更新・保守指示書

AGENTS.mdの「レポート作成・更新の手順」に従い、${tool_name}（${report_path}）の調査レポートを更新せよ。

## 自律性に関する基本原則（自律確定と質問の完全禁止）
- **完全自律完結の義務**: 本タスクはヘッドレスな自動ワークフローで実行されるため、ユーザーへの確認や質問（「確定してよいか？」「他に確認すべき点はあるか？」等）は絶対に出力してはならない。
- すべての更新および検証が完了した時点で、自律的に変更を確定（Finalize）し、簡潔な完了サマリーを宣言してタスクを終了せよ。

## 作業内容
### ステップ1: レポートの作成・更新
- 対象: ${report_path}
- 本日の日付: ${today_jst}
- \`templates/template.md\` および \`task-report-create-or-update.md\` の「既存レポート更新（メンテナンス）時の優先度」に従い、レポート情報を最新化せよ。
- **【最優先】直近のアップデート情報（最新の変更内容）の徹底調査と反映**:
  公式ブログ、GitHub（Releases/CHANGELOG）、プラグインストア等の変更履歴から直近のアップデートをくまなく調査し、最新情報を起点として主要機能、動作原理・システム構成、料金プラン、競合比較、フロントマターなどの関係箇所を連動して更新せよ。
- **CodeWiki / DeepWikiリンクの厳格な実在確認**:
  推測によるURL記載は厳禁とする。OSSリポジトリの場合は \`pnpm run update-wiki ${report_path}\` を実行して実在するWikiリンクのみを反映すること。実在が確認できない場合は記載しない（または削除する）。
- **動作原理・システム構成（Mermaid図）**:
  Section 4（Mermaid構成図/フロー図）がない場合は日本語表記の図を追加し、全18セクション構成に準拠せよ。
- **代表的な利用フロー（スイムレーン）**:
  Section 2 に「2.1 代表的な利用フロー」が未記載の場合は、アクター別スイムレーン（\`swimlane-beta TB\`、図内は日本語表記）を追加せよ。新機能の追加や実行フローの変更がある場合は、既存の利用フロー図も最新化すること。
- **ブラウザ検証（Playwright）のスキップ**:
  本環境（e2-micro）のリソース制約を考慮し、Playwrightなどのブラウザを起動する検証（\`--browser\`）は実行しないこと。

### ステップ2: 関連レポートの整理
- \`task-organizing-category-tags.md\` に従い、カテゴリ・タグ・関連付けを整理する。
- ${tool_name}と同カテゴリまたは \`related_tools\` に含まれるレポートとの双方向整合性を確保せよ。
- 必要に応じて \`_data/categories.yml\` を更新せよ。

## 完了条件
- ${report_path} の情報が最新化され、frontmatter の \`last_updated\` が更新されていること。
- 作業完了後、ユーザーへの質問や確認は一切行わず、自律的に作業を確定・完了させること。
EOF
}

#######################################
# Processes a single report update.
# Arguments:
#   report_path: Path of the report file to update
#   today_jst: Current date in JST
# Returns:
#   0 on success, 1 on failure
#######################################
process_single_report() {
  local -r report_path="$1"
  local -r today_jst="$2"
  local -r tool_name="$(extract_tool_name "${report_path}")"
  local -r tool_slug="$(basename "${report_path}" .md)"
  local -r branch_name="update-report-${tool_slug}-$(TZ='Asia/Tokyo' date +%Y%m%d-%H%M%S)"

  log_info "=== Processing: ${tool_name} (${report_path}) ==="

  git checkout -b "${branch_name}"

  local prompt
  prompt="$(build_maintenance_prompt "${tool_name}" "${report_path}" "${today_jst}")"

  if ! run_agy "${prompt}"; then
    log_error "Antigravity CLI execution failed for ${tool_name}."
    git checkout main
    git branch -D "${branch_name}" || true
    return 1
  fi

  local -r commit_msg="feat: update survey report for ${tool_name}"
  local -r pr_title="feat: update survey report for ${tool_name}"
  local -r pr_body="Automated daily survey report maintenance by Antigravity CLI (agy) for ${tool_name} (${today_jst})"

  if ! commit_and_create_pr "${branch_name}" "${commit_msg}" "${pr_title}" "${pr_body}"; then
    log_error "Failed to commit or create pull request for ${tool_name}."
    git checkout main
    git branch -D "${branch_name}" || true
    return 1
  fi

  git checkout main
  log_info "Successfully completed maintenance for ${tool_name}."
  return 0
}

#######################################
# Main execution function.
#######################################
main() {
  local -r report_count_env="${REPORT_COUNT:-1}"
  local -r target_report_env="${TARGET_REPORT:-}"
  local -r today_jst="$(TZ='Asia/Tokyo' date +'%Y-%m-%d')"

  log_info "Starting daily report maintenance with Antigravity CLI."

  setup_git_and_gh

  local -a target_reports=()

  if [[ -n "${target_report_env}" ]]; then
    log_info "Target report specified: '${target_report_env}'"
    local specific_report
    if specific_report="$(find_specific_report "${target_report_env}")"; then
      target_reports+=("${specific_report}")
    else
      log_error "Failed to locate target report '${target_report_env}'."
      exit 1
    fi
  else
    local count=1
    if [[ "${report_count_env}" =~ ^[0-9]+$ ]] && [[ "${report_count_env}" -ge 1 ]]; then
      count="${report_count_env}"
    else
      log_warn "Invalid REPORT_COUNT '${report_count_env}', defaulting to 1."
    fi

    log_info "Selecting ${count} oldest report(s) by last_updated..."
    mapfile -t target_reports < <(get_oldest_reports "${count}")
  fi

  if [[ ${#target_reports[@]} -eq 0 ]]; then
    log_error "No reports found to process."
    exit 1
  fi

  log_info "Reports to process (${#target_reports[@]}):"
  for r in "${target_reports[@]}"; do
    log_info "  - ${r}"
  done

  local success_count=0
  local fail_count=0

  for report in "${target_reports[@]}"; do
    if process_single_report "${report}" "${today_jst}"; then
      success_count=$((success_count + 1))
    else
      fail_count=$((fail_count + 1))
    fi
  done

  log_info "=== Maintenance Summary ==="
  log_info "Total: ${#target_reports[@]}, Succeeded: ${success_count}, Failed: ${fail_count}"

  if [[ ${success_count} -eq 0 ]] && [[ ${#target_reports[@]} -gt 0 ]]; then
    log_error "All report updates failed."
    exit 1
  fi

  log_info "All processing complete."
}

main "$@"
