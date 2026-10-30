#!/bin/bash
#
# Daily Trending Topics Report Generation Script using Antigravity CLI (agy).
#
# Environment variables used:
#   FOCUS_TOPIC: Optional specific topic to focus the investigation on.

set -euo pipefail

# Load common library
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=.github/workflows/scripts/agy-common.sh
source "${SCRIPT_DIR}/agy-common.sh"

readonly TRENDING_TEMPLATE_FILE="templates/trending_template.md"

#######################################
# Builds the prompt for generating the trending report.
# Arguments:
#   today_jst: Current date string in JST (YYYY-MM-DD)
#   focus_topic: Optional focus topic string
# Outputs:
#   Writes generated prompt to stdout
#######################################
build_trending_prompt() {
  local -r today_jst="$1"
  local -r focus_topic="$2"

  local template_content=""
  if [[ -f "${TRENDING_TEMPLATE_FILE}" ]]; then
    template_content="$(cat "${TRENDING_TEMPLATE_FILE}")"
  else
    log_error "Trending template file not found: ${TRENDING_TEMPLATE_FILE}"
    exit 1
  fi

  local focus_section=""
  if [[ -n "${focus_topic}" ]]; then
    focus_section=$(cat <<EOF
## 特別注力トピック
- ${focus_topic}
EOF
)
  fi

  cat <<EOF
# 【最重要】最新情報に基づく深掘りレポート作成指令

本日は **${today_jst}** である。現在のAI・開発ツール業界において、過去24〜48時間以内に発生した極めて鮮度の高い重要なトピックスを網羅的に調査し、合計 **4000文字から7000文字程度** の詳細な日次レポートを作成せよ。

## 想定読者
このレポートの読者は多様である。以下のすべての層が価値を感じられるレポートを目指せ。
- **専門家層**: ソフトウェアエンジニア、DevOps担当者、セキュリティエンジニア。正確な技術情報と具体的な対策手順を求めている。
- **一般層**: IT業界のマネージャー、経営者、学生、プログラミング学習者。業界の動向を把握したいが、専門用語には不慣れ。
両者を満足させるために、本レポートでは **「二層構造」** を採用する（後述の執筆ルール参照）。

## 執筆スタイル：二層構造ルール（厳守）
各セクション・各項目において、以下の二層構造を必ず守ること。

### 概要層（初学者・一般読者向け）
- セクション1「本日のまとめ」の冒頭には、引用ブロック（\`>\`）で 💡 **今日のポイント** を3行の箇条書きで配置する。専門用語は使わず、「何が起きたか」「なぜ重要か」を日常の言葉で表現する。
- セクション2〜4の各項目には、必ず **「🔰 ひとことで言うと」** を最初に配置する。これは専門用語を一切使わず、その項目の本質を1行で伝える文である。例: 「このツールを使っているパソコンが、外部から乗っ取られる恐れがあります」
- セクション2の各項目には **「🛡️ まずやるべきこと」** を配置し、非エンジニアでも実行できる具体的なアクションを記載する。例: 「最新版にアップデートしてください」「使用を一時停止してください」
- セクション3の各項目には **「👥 誰に影響があるか」** を配置し、影響を受けるユーザー層を明記する。
- セクション4の各項目には **「💡 こんな人におすすめ」** を配置し、具体的な利用者像を明記する。
- セクション6「総評」の冒頭には、引用ブロック（\`>\`）で 📌 **今日の一言まとめ** を1〜2行で配置する。

### 詳細層（専門家向け）
- 概要層の後に、従来と同等以上の技術的詳細を記述する。具体的なバージョン番号、CVE/GHSA番号、対策手順、技術的ブレークスルーの解説などは省略せず正確に書く。
- セキュリティ項目では **「📊 影響の大きさ」** として「影響を受ける人」と「悪用の容易さ」を明記する。

### 専門用語の取り扱い
- 本文中で初出の専門用語には、カッコ書きで簡潔な補足を添えよ。例: 「RCE（遠隔からコードを実行される攻撃）」「SSRF（サーバーに意図しない通信をさせる攻撃手法）」
- レポート末尾に **「📖 用語解説」セクション** を必ず設け、本日のレポートで使用された専門用語のうち一般読者に馴染みが薄いものを5〜10件、表形式で平易に解説する。例え話や身近な例を積極的に使うこと。

## レポートの量と質の要求事項
1. **動的なタイトルと説明文の生成（フロントマター）**: **全セクション（セキュリティ、リリース、トレンド）の調査と執筆をすべて完了した後に、その全体の内容を最もよく表すタイトルと説明文を最後にフロントマターに記入せよ。** テンプレートのプレースホルダのままにするのではなく、必ずその日の内容を反映した独自のテキストに変更すること。
   - \`title\`: 「AIトレンド: [最重要トピック15文字以内]」のような、その日の核心がわかる具体的な見出しにすること。
   - \`description\`: その日の主要な話題3点を網羅した約100文字程度の具体的な要約にすること。
   - \`tags\`: セクション2, 3, 4で取り上げた主要なツール名を抽出し、カンマ区切りのリストとして追加せよ（ツール名のみを抽出し、バージョン番号や説明文は含めないこと）。
2. **総文字数**: 日本語で **4000文字以上（7000文字程度を目安とするが、内容に応じて超過しても構わない。7000文字を超えてもユーザー確認を求めずに作業を完遂すること）** とすること。
3. **項目数**: 「緊急セキュリティ情報」「メジャーリリース・新機能」「注目のトレンドツール」の各セクションにおいて、必ず **少なくとも3〜5件ずつの独立したトピックス** をピックアップせよ。
4. **鮮度の厳守**: 古い情報の引用は厳禁とし、RSS、SNS、テックニュースの最新記事から「今まさに起きていること」を抽出せよ。
5. **ハルシネーション（幻覚）の厳禁**: 実在しないモデル名や架空のバージョン番号は絶対に記述しないこと。必ずファクトチェックを行い、現実に発生した事象のみを記載せよ。
6. **一次情報ソースの明記とURLの正確性**: CVEやGHSAを指す具体的な個別URLや、ツールの公式アナウンスURLを正確に記載すること。
7. **ブラウザ検証（Playwright）のスキップ**: 本環境（e2-micro）のリソース制約を考慮し、Playwrightなどのブラウザを起動する検証（\`--browser\`）は実行しないこと。

## 主要調査ソース
- **セキュリティ**: CVE (MITRE), JVN, GitHub Security Advisories, OSV, Mynavi Tech+ (セキュリティカテゴリ)
- **技術ニュース**: Publickey, TechCrunch Japan, ITmedia NEWS, InfoQ Japan, Gihyo.jp
- **トレンド**: Hacker News (Top), GitHub Trending, Reddit (r/programming), Product Hunt, Zenn/Qiita (トレンド項目)
- **公式発表**: OpenAI, Anthropic, Google Cloud Blog, AWS Blog, Azure Blog, Vercel Blog, Meta AI Blog

${focus_section}

## 作成指示
1. 作成したレポートは \`_trending/${today_jst}.md\` というファイル名で保存せよ。
2. 作業完了後、ユーザーへの質問や確認（「提出してよいですか？」など）は一切行わず、自律的に作業を確定・完了させること。

## レポートテンプレート（厳守）

\`\`\`markdown
${template_content}
\`\`\`
EOF
}

#######################################
# Main execution function.
#######################################
main() {
  local -r focus_topic="${FOCUS_TOPIC:-}"
  local -r today_jst="$(TZ='Asia/Tokyo' date +'%Y-%m-%d')"

  log_info "Starting daily trending topics report generation for ${today_jst}."
  if [[ -n "${focus_topic}" ]]; then
    log_info "Focus topic specified: ${focus_topic}"
  fi

  setup_git_and_gh

  local -r branch_name="generate-trending-${today_jst}-$(date +%H%M%S)"
  log_info "Creating and checking out branch: ${branch_name}"
  git checkout -b "${branch_name}"

  local prompt
  prompt="$(build_trending_prompt "${today_jst}" "${focus_topic}")"

  if ! run_agy "${prompt}"; then
    log_error "Antigravity CLI execution failed."
    git checkout main
    git branch -D "${branch_name}" || true
    exit 1
  fi

  local -r commit_msg="docs: add daily trending topics report for ${today_jst}"
  local -r pr_title="[Daily Topics] ${today_jst}"
  local -r pr_body="Automated daily trending topics report generated by Antigravity CLI (agy) for ${today_jst}"

  if ! commit_and_create_pr "${branch_name}" "${commit_msg}" "${pr_title}" "${pr_body}"; then
    log_error "Failed to commit or create pull request for trending report."
    git checkout main
    git branch -D "${branch_name}" || true
    exit 1
  fi

  git checkout main
  log_info "Daily trending topics report generation completed successfully."
}

main "$@"

