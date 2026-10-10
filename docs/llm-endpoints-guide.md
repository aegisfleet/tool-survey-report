# AIエージェント・LLM向け機能（llms.txt / JSONインデックス）運用・メンテナンスガイド

本ドキュメントは、本サイトで提供している **AIエージェント・LLM（ChatGPT, Claude, Perplexity等）向け情報取得エンドポイント** の仕様、アーキテクチャ、および改修時のメンテナンス手順をまとめたものです。

---

## 1. 概要とアーキテクチャ

本サイトは、ソフトウェア開発者だけでなくAIエージェントが自律的にツール情報を収集・参照することを前提に設計されています。

### 提供しているエンドポイント一覧

| パス | 種別 | 役割・用途 | 生成方式 |
| :--- | :--- | :--- | :--- |
| `/llms.txt` | Markdown | [llmstxt.org](https://llmstxt.org/) 標準仕様に準拠したAI向けサイト案内・検索規則 | Jekyll (Liquid) で自動生成 |
| `/llms-full.txt` | Markdown | 全ツールのカテゴリ別完全インデックス | Jekyll (Liquid) で自動生成 |
| `/reports-summary.json` | JSON | 全ツールのメタデータを含む軽量JSONインデックス | Jekyll (Liquid) で自動生成 |
| `/robots.txt` | Text | AIクローラー（GPTBot, ClaudeBot等）の許可とSitemap/llms.txt案内 | Jekyll (Liquid) で自動生成 |
| 各レポートのRaw Markdown | Markdown | クリーンなMarkdown本文（GitHub Raw連携） | GitHub raw URLで直接配信 |

### 自動更新の仕組み（メンテナンスフリー設計）

上記のエンドポイント（`llms.txt`, `llms-full.txt`, `reports-summary.json`）は、すべて **Jekyllのテンプレート（Liquid）** として記述されています。
* レポートファイル（`_reports/*.md`）の追加・更新・削除
* カテゴリ（`_data/categories.yml`）の変更

が発生すると、GitHub ActionsのJekyllビルド時に自動的に最新のレポート内容・カテゴリ一覧が反映されるため、**通常運用でこれらのファイルを手動更新する必要はありません**。また、ハードコードされた件数やサイズ表記は排除されています。

---

## 2. 各ファイルの仕様と注意点

### 2.1. `llms.txt`
* **ファイル**: [llms.txt](file:///home/poti/work/tool-survey-report/llms.txt)
* **公開URL**: `https://aegisfleet.github.io/tool-survey-report/llms.txt`
* **仕様**:
  * H1: サイトタイトル
  * Blockquote (`>`): サイト概要
  * データ取得ガイド: `reports-summary.json`, `llms-full.txt`, `sitemap.xml` へのリンク
  * URL構造規則: 個別レポート、トレンド、Raw MarkdownのURL構文
  * 主要カテゴリ: `site.reports` からカテゴリ別に代表ツールを動的抽出
  * 高評価ツール: 評価スコア（`evaluation.score`）が85以上のツールを自動抽出
  * AI向け案内・引用ガイド: ユーザーへの回答時に提示すべきレポートURLの形式をAIに指示

### 2.2. `llms-full.txt`
* **ファイル**: [llms-full.txt](file:///home/poti/work/tool-survey-report/llms-full.txt)
* **公開URL**: `https://aegisfleet.github.io/tool-survey-report/llms-full.txt`
* **仕様**:
  * 全カテゴリと各カテゴリに属する全ツールの完全一覧。
  * ツール名、詳細URL、1行概要、開発元、スコア、料金体系（無料プラン有無・開始価格）を出力。

### 2.3. `reports-summary.json`
* **ファイル**: [reports-summary.json](file:///home/poti/work/tool-survey-report/reports-summary.json)
* **公開URL**: `https://aegisfleet.github.io/tool-survey-report/reports-summary.json`
* **仕様**:
  * JSON配列形式。各要素は以下のスキーマを持ちます：
    ```json
    {
      "tool_name": "Cursor",
      "slug": "cursor",
      "url": "https://aegisfleet.github.io/tool-survey-report/reports/cursor/",
      "raw_markdown_url": "https://raw.githubusercontent.com/aegisfleet/tool-survey-report/main/_reports/cursor.md",
      "category": "AIエディタ/IDE",
      "tags": ["AI", "IDE", "コーディング支援"],
      "description": "...",
      "developer": "Anysphere, Inc.",
      "official_site": "https://cursor.com/",
      "score": 88,
      "pricing": {
        "has_free_plan": true,
        "is_oss": false,
        "starting_price": "$20/月"
      },
      "related_tools": ["GitHub Copilot", "Cline"],
      "last_updated": "2026-05-10"
    }
    ```
* **注意点**: Frontmatterのスキーマ（`quick_summary` や `evaluation.score`）を変更した場合は、このテンプレート内のキー指定も同期して修正してください。

### 2.4. Raw Markdown連携
* **ファイル**: [_layouts/report.html](file:///home/poti/work/tool-survey-report/_layouts/report.html), [_layouts/default.html](file:///home/poti/work/tool-survey-report/_layouts/default.html)
* **仕様**:
  * 各レポートヘッダーの「Markdown」ボタンから、GitHub上の元Markdownファイル（`https://raw.githubusercontent.com/aegisfleet/tool-survey-report/main/{{ page.path }}`）を直接開くことができます。
  * HTMLの `<head>` にも `<link rel="alternate" type="text/markdown" href="...">` を出力し、AIエージェントのヘッドレスブラウジング時に検知可能にしています。

---

## 3. 改修時のチェックリスト

サイト改修（レイアウト変更やFrontmatter拡張など）を行う際は、以下の点を確認してください：

1. **Jekyllビルド確認**:
   * `bundle exec jekyll build` または `pnpm dev:fast` を実行し、構文エラーが発生しないこと。
2. **JSON形式の妥当性**:
   * `reports-summary.json` を変更した場合は、ビルド成果物（`_site/reports-summary.json`）が正しいJSON形式としてパースできること。
3. **改行・フォーマットの崩れ防止**:
   * Liquidタグ（`{% %}`）による空白・改行の削除（`{%-` や `-%}`）で意図しない行の連結が発生していないか、生成された `_site/llms.txt` のテキストを確認すること。
4. **ハードコード値の混入防止**:
   * レポート件数やファイルサイズなどの変動する数値を静的テキストとしてハードコードしないこと。
