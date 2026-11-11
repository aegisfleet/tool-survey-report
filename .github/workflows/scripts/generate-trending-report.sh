#!/bin/bash
#
# Daily Trending Topics Report Generation Script using Antigravity CLI (agy).
#
# Environment variables used:
#   FOCUS_TOPIC: Optional specific topic to focus the investigation on.

set -euo pipefail

# Load common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR
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
- **一般層**: IT業界のマネージャー、経営者、学生、プログラミング学習者。業界の動向を素早く把握したいが、文字の壁や専門用語には不慣れ。
両者を満足させるために、本レポートでは **「結論3行・表 ＋ 折りたたみ詳細（二層構造）」** を採用する（後述の執筆ルール参照）。

## 執筆スタイル：二層構造ルール（厳守）
文字の壁を排除し、「30秒で全体像がわかり、気になるトピックだけ深掘りできる」構造を必ず守ること。

### 1. 冒頭サマリー（セクション1）
- 従来の長文概要段落は廃止する。
- 引用ブロック（\`>\`）で 💡 **今日のハイライト** を3行の箇条書き（専門用語を使わない日常語）で配置し、\`{: .callout-summary}\` を付与する。
- 直後に「30秒早見テーブル」（\`| 区分 | トピック / ツール | ざっくり言うと？（1行要約） | 影響・おすすめ対象 |\`）を配置し、本日の全トピックと対象者を一覧化する。

### 2. 各トピックの二層構造（セクション2〜4）
すべてのトピックで以下の3段構成を徹底する。長文の箇条書きを漫然と並べることは禁止する。
1. **ひとこと ＆ 例え話（初期表示）**:
   - 引用ブロックで **「🔰 ひとことで言うと」**（専門用語を一切使わず1行で本質を説明）と **「💬 例えるなら：...」**（日常の身近なたとえ話）を配置する。
   - セクションに応じて Kramdown クラスを付与する：
     - 緊急セキュリティ: \`{: .callout-danger}\`
     - メジャーリリース: \`{: .callout-info}\`
     - 注目のトレンド: \`{: .callout-tip}\`
2. **直感的な要約表 / Before-After表（初期表示）**:
   - 緊急セキュリティ: 「リスク度 / 影響を受ける人 / 悪用のされやすさ / まずやるべき対策」を表で提示。
   - メジャーリリース: 「比較ポイント / これまで (Before) / これから (After)」の比較表で変化を提示。
   - 注目のトレンド: 「注目ポイント / 内容 / おすすめ対象」の表で提示。
3. **詳細の折りたたみ（<details>）**:
   - \`<details markdown="1">\` と \`<summary>🔍 技術的な仕組み・対象バージョン・対策コマンドを見る（エンジニア向け）</summary>\`（またはリリース詳細を見る）で囲み、エンジニアが必要とする技術詳細、対象バージョン、実行コマンド、一次ソースリンクを折りたたむ。

### 3. 専門用語とKramdownインラインツールチップ
- レポート末尾に **「📖 用語解説」セクション** を設け、本日のレポートで使用された専門用語のうち一般読者に馴染みが薄いものを5〜10件、表形式で平易に解説する（例え話を交える）。
- レポート最下部には、必ず **Kramdown略語定義（\`*[略語]: 解説文\`）** を記述せよ。これにより、読者が本文中の用語にカーソルを合わせる（またはタップする）だけで即座に意味が表示される。

## レポートの量と質の要求事項
1. **動的なタイトルと説明文の生成（フロントマター）**: **全セクション（セキュリティ、リリース、トレンド）の調査と執筆をすべて完了した後に、その全体の内容を最もよく表すタイトルと説明文を最後にフロントマターに記入せよ。** テンプレートのプレースホルダのままにするのではなく、必ずその日の内容を反映した独自のテキストに変更すること。
   - \`title\`: 「AI/開発トレンド: [最重要トピック15文字以内]」のような、その日の核心がわかる具体的な見出しにすること。
   - \`description\`: その日の主要な話題3点を網羅した約100文字程度の具体的な要約にすること。
   - \`tags\`: セクション2, 3, 4で取り上げた主要なツール名を抽出し、カンマ区切りのリストとして追加せよ（ツール名のみを抽出し、バージョン番号や説明文は含めないこと）。
2. **総文字数**: 日本語で **4000文字以上（7000文字程度を目安とするが、内容に応じて超過しても構わない。7000文字を超えてもユーザー確認を求めずに作業を完遂すること）** とすること。折りたたみ内部の技術詳細も含めて充実させること。
3. **項目数**: 「緊急セキュリティ情報」「メジャーリリース・新機能」「注目のトレンドツール」の各セクションにおいて、必ず **少なくとも3〜5件ずつの独立したトピックス** をピックアップせよ。
4. **鮮度の厳守**: 古い情報の引用は厳禁とし、RSS、SNS、テックニュースの最新記事から「今まさに起きていること」を抽出せよ。
5. **ハルシネーション（幻覚）の厳禁**: 実在しないモデル名や架空のバージョン番号は絶対に記述しないこと。必ずファクトチェックを行い、現実に発生した事象のみを記載せよ。
6. **一次情報ソースの明記とURLの正確性**: CVEやGHSAを指す具体的な個別URLや、ツールの公式アナウンスURLを正確に記載すること。
7. **ブラウザ検証（Playwright）のスキップ**: 本環境（e2-micro）のリソース制約を考慮し、Playwrightなどのブラウザを起動する検証（\`--browser\`）は実行しないこと。
8. **Jekyll（Liquid）構文のエスケープ（厳守）**: 本サイトはJekyllでビルドされるため、本文やインラインコード・コードブロック内に \`{{ ... }}\` や \`{% ... %}\`（Jinja2/Liquidのテンプレートタグ、GitHub Actionsの \`\${{ ... }}\`、React JSXの \`style={{ ... }}\` 等）をそのまま記述すると \`Liquid::SyntaxError\` でサイトビルドが失敗する。これらを記述する際は必ず \`{% raw %}...{% endraw %}\` で囲んでエスケープすること（例: \`\` \`{% raw %}{% completion %}{% endraw %}\` \`\`）。

## 図を使った説明（1日1〜2図ルール）
- 本日のトピック中、最も構造や処理の流れが複雑なもの（1〜2件）をMermaid図で視覚化する。
- 図の直前に「何を示す図か」を短く説明し、直後に「図の見方」として要点を平易な日本語で説明する。
- 利用者・ツール・外部サービスなど複数の役割の間で処理が受け渡される場合は \`swimlane-beta TB\` を優先し、シンプルなデータ・処理の流れは \`flowchart LR\` または \`flowchart TD\`（5〜8ノード以内）を使う。
- \`subgraph\` を使う場合はASCIIのIDと引用符付き表示名（例: \`subgraph App["アプリ"]\`）にする。記号を含むエッジラベルも引用符で囲む（例: \`A -->|"設定 (任意)"| B\`）。
- 逆向き矢印の直後にインラインラベルを付ける記法（例: \`A <--|応答| B\`）は禁止する。逆方向の関係は始点と終点を入れ替えた順方向の矢印で表す（例: \`B -->|応答| A\`）。

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

  local -r branch_name="generate-trending-${today_jst}-$(TZ='Asia/Tokyo' date +%H%M%S)"
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

  local -r report_path="${TRENDING_DIR}/${today_jst}.md"
  if [[ ! -f "${report_path}" ]]; then
    log_error "Generated trending report not found: ${report_path}"
    git checkout main
    git branch -D "${branch_name}" || true
    exit 1
  fi

  if ! uv run python3 scripts/check_mermaid.py --static "${report_path}"; then
    log_error "Mermaid validation failed for ${report_path}."
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
