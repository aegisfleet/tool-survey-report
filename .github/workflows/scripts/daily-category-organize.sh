#!/bin/bash
#
# Daily Category Organize Script using Antigravity CLI (agy).
#
# Environment variables used:
#   DRY_RUN: 'true' to display statistics and skip agy execution / PR creation.

set -euo pipefail

# Load common library
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=.github/workflows/scripts/agy-common.sh
source "${SCRIPT_DIR}/agy-common.sh"

#######################################
# Analyzes categories in _reports/ and outputs formatted statistics.
# Outputs:
#   Writes JSON with stats, mergeCandidates, and splitCandidates to stdout
#######################################
collect_category_stats() {
  python3 -c "
import glob, json, os, re

reports_dir = '${REPORTS_DIR}'
category_counts = {}

for p in glob.glob(os.path.join(reports_dir, '*.md')):
    with open(p, 'r', encoding='utf-8') as f:
        for line in f:
            m = re.match(r'^category:\s*[\'\"]?([^\'\"\r\n]+)', line)
            if m:
                cat = m.group(1).strip()
                category_counts[cat] = category_counts.get(cat, 0) + 1
                break

sorted_cats = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
to_merge = [(c, n) for c, n in sorted_cats if n <= 2]
to_split = [(c, n) for c, n in sorted_cats if n >= 10]

all_stats_lines = [f'  - {c}: {n}件' for c, n in sorted_cats]
merge_lines = [f'  - {c} ({n}件)' for c, n in to_merge]
split_lines = [f'  - {c} ({n}件)' for c, n in to_split]

result = {
    'total_count': len(sorted_cats),
    'merge_count': len(to_merge),
    'split_count': len(to_split),
    'all_stats': '\n'.join(all_stats_lines),
    'merge_candidates': '\n'.join(merge_lines) if merge_lines else '  なし',
    'split_candidates': '\n'.join(split_lines) if split_lines else '  なし',
}

print(json.dumps(result))
"
}

#######################################
# Builds prompt for category organization.
# Arguments:
#   today_jst: Current date in JST
#   all_stats: Formatted string of all category stats
#   merge_candidates: Formatted string of merge candidate categories
#   split_candidates: Formatted string of split candidate categories
# Outputs:
#   Writes prompt to stdout
#######################################
build_category_prompt() {
  local -r today_jst="$1"
  local -r all_stats="$2"
  local -r merge_candidates="$3"
  local -r split_candidates="$4"

  cat <<EOF
task-organizing-category-tags.md の「カテゴリの統合・分割基準」セクションに従い、${today_jst} のカテゴリ整理作業を実施せよ。

## 自律性に関する基本原則（自律確定と質問・確認の完全禁止）
- **完全自律完結の義務**: 本タスクは自動ワークフローで実行されるため、計画立案後や検証後に「この計画でよいか？」「確定してよいか？」といった質問・確認・提案は絶対に出力してはならない。
- すべての更新および検証が完了した時点で、自律的に変更を確定（Finalize）し、簡潔な完了報告を出力してタスクを終了せよ。

## 作業の背景
本日時点のカテゴリ別件数を集計した結果、以下の通りである：

### 全カテゴリ件数（降順）
${all_stats}

### 統合候補（1〜2件のカテゴリ）
${merge_candidates}

### 分割候補（10件以上のカテゴリ）
${split_candidates}

## 実行する作業フロー（計画承認を待たずに一貫して自律実行すること）

### ステップ1: カテゴリ統合
- task-organizing-category-tags.md の「統合の判定基準」に従い、統合候補カテゴリを処理せよ。
- 統合を見送るケースに該当する場合は変更しなくてよい。
- 変更が必要な場合は、対象レポートの category フィールドを更新し、_data/categories.yml も同期せよ。

### ステップ2: カテゴリ分割
- task-organizing-category-tags.md の「分割の判定基準」に従い、分割候補カテゴリを処理せよ。
- 分割を見送るケースに該当する場合は変更しなくてよい。
- 変更が必要な場合は、標準語彙リストに新カテゴリを追記してから対象レポートを更新せよ。

### ステップ3: タグ整理（カテゴリ変更に伴うもののみ）
- カテゴリ変更したレポートについて、task-organizing-category-tags.md の変更ルールに従いタグも整合させよ。

### ステップ4: 差分確認・検証・自律確定（Finalize）
- \`git diff\` で意図しない変更（フロントマター外の変更等）がないことを確認せよ。
- YAML構文チェックを実行せよ。
- 検証完了後、ユーザーへの確認を一切求めずに直ちにPR作成（確定）へ進め。

### 注意事項
- task-organizing-category-tags.md の「編集前チェックリスト」「変更後チェックリスト」を確認すること。
- last_updated フィールドは更新しないこと（カテゴリ整理は内容変更ではないため）。
- 変更が不要と判断した場合は、その旨を報告して変更を行わずに終了せよ。
EOF
}

#######################################
# Main execution function.
#######################################
main() {
  local -r dry_run_env="${DRY_RUN:-false}"
  local -r today_jst="$(TZ='Asia/Tokyo' date +'%Y-%m-%d')"

  log_info "Starting daily category organization for ${today_jst}."

  log_info "Analyzing categories in ${REPORTS_DIR}..."
  local stats_json
  stats_json="$(collect_category_stats)"

  local total_count merge_count split_count all_stats merge_candidates split_candidates
  total_count="$(echo "${stats_json}" | jq -r '.total_count')"
  merge_count="$(echo "${stats_json}" | jq -r '.merge_count')"
  split_count="$(echo "${stats_json}" | jq -r '.split_count')"
  all_stats="$(echo "${stats_json}" | jq -r '.all_stats')"
  merge_candidates="$(echo "${stats_json}" | jq -r '.merge_candidates')"
  split_candidates="$(echo "${stats_json}" | jq -r '.split_candidates')"

  log_info "Total categories: ${total_count}"
  log_info "Merge candidates (<= 2): ${merge_count}"
  log_info "Split candidates (>= 10): ${split_count}"

  if [[ "${merge_count}" -eq 0 ]] && [[ "${split_count}" -eq 0 ]]; then
    log_info "No categories require merge or split. Exiting successfully."
    exit 0
  fi

  if [[ "${dry_run_env}" == "true" ]]; then
    log_info "[DRY RUN] Skipping Antigravity CLI execution and PR creation."
    log_info "Merge candidates:\n${merge_candidates}"
    log_info "Split candidates:\n${split_candidates}"
    exit 0
  fi

  setup_git_and_gh

  local -r branch_name="daily-category-organize-${today_jst}-$(TZ='Asia/Tokyo' date +%H%M%S)"
  log_info "Creating and checking out branch: ${branch_name}"
  git checkout -b "${branch_name}"

  local prompt
  prompt="$(build_category_prompt "${today_jst}" "${all_stats}" "${merge_candidates}" "${split_candidates}")"

  if ! run_agy "${prompt}"; then
    log_error "Antigravity CLI execution failed."
    git checkout main
    git branch -D "${branch_name}" || true
    exit 1
  fi

  local -r commit_msg="chore: daily category and tag organization (${today_jst})"
  local -r pr_title="chore: daily category and tag organization (${today_jst})"
  local -r pr_body="Automated category and tag organization by Antigravity CLI (agy) for ${today_jst}"

  if ! commit_and_create_pr "${branch_name}" "${commit_msg}" "${pr_title}" "${pr_body}"; then
    log_info "No category changes were made (all proposed changes may have been deemed unnecessary). Exiting."
    git checkout main
    git branch -D "${branch_name}" || true
    exit 0
  fi

  git checkout main
  log_info "Daily category organization completed successfully."
}

main "$@"

