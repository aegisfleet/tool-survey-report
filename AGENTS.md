# AGENTS.md

## 概要

エージェントは複数の作業指示を扱う。
基本行動はこのファイルに定義されるが、特定のタスクを行う場合は以下の指示書を参照する。

## タスク指示書・ガイド一覧

- レポートの作成/更新: [task-report-create-or-update.md](./task-report-create-or-update.md)
- カテゴリ/タグ/関連付けの整理: [task-organizing-category-tags.md](./task-organizing-category-tags.md)
- AIエージェント・LLM向け機能（llms.txt / JSONインデックス）の運用ガイド: [docs/llm-endpoints-guide.md](./docs/llm-endpoints-guide.md)

## レポート作成・更新の手順

レポートを新規作成または更新する場合は、以下の手順に従って作業を行う。

### ステップ1: レポートの作成・更新

1. [task-report-create-or-update.md](./task-report-create-or-update.md) を参照する
2. 新規の場合は `templates/template.md` のテンプレートを基に作成、既存の場合は情報を最新化する
3. 調査完了後のチェックリストを確認し、全項目をクリアする。CodeWikiやDeepWikiなどの外部Wikiリンクは、推測でURLを記述してはならない（未インデックスのリポジトリはSoft 404となるため）。必ず実在確認を行い、存在しない場合はリンクを記載しないこと。レポートの検証（`scripts/run_checks.py`）を行う際は、CodeWikiなどの動的サイトのリンク切れを正確に検知するため、可能な限り `--browser` フラグを使用すること。ブラウザを起動できない環境では、少なくとも `uv run python3 scripts/check_mermaid.py --static <ファイル>` を実行し、Mermaidの構文エラー（特に `subgraph` のID・表示名に含まれる未引用の記号）がないことを確認すること。なお `check_mermaid.py` のブラウザ検証は `mermaid.parse()` による構文解析のみのため、「パースは成功するがレンダリングに失敗する」不具合（例: 逆向き矢印の直後にインラインラベルを付ける `A <--|ラベル| B` 記法）を検出できない。Mermaidの逆向き矢印にインラインラベルを付けず、逆向きの関係は始点・終点を入れ替えた順方向エッジ（`B -->|ラベル| A`）で記述すること。

### ステップ2: 関連レポートの整理

1. [task-organizing-category-tags.md](./task-organizing-category-tags.md) を参照する
2. 作成/更新したレポートを「単一レポート中心の作業」の対象として、以下を整理する：
   - カテゴリが標準語彙に従っているか確認
   - タグが正規化リストに従っているか確認・統一
   - 関連レポートとの `relationships` を設定（双方向リンクの整合性を含む）
3. 関連レポートにタグを追加する場合は、**各ツールごとに個別調査**を行い妥当性を確認する
4. 編集前チェックリストを確認し、コミットする

### 注意事項

- ステップ1とステップ2は**必ずこの順序**で実行すること
- 関連レポートへの変更は最小限に留め、既存の正確な情報を損なわないこと
- 不明点がある場合は公式情報を優先し、推測での変更は避けること
- **CodeWiki/DeepWikiリンクの推測記載の禁止**: オープンソースツールであってもCodeWikiページが生成されていないリポジトリは多数存在する。必ず実在確認（ブラウザ検証または `pnpm run update-wiki`）を行い、存在しない場合はフロントマターおよび本文のリンクを記載しない（削除する）こと。
- ホーム画面、レイアウト、スタイルなどのフロントエンドに変更を加えた場合は、必ずブラウザ動作確認ワークフロー（[.agent/workflows/browser-test.md](./.agent/workflows/browser-test.md)）に従って `scripts/browser_test.py` を実行し、表示崩れやJavaScriptエラー（コンソールに出力されます）が発生していないことを確認すること。

## 開発環境・ツール

エージェントが本リポジトリで操作を行う際は、以下のルールを厳守すること。

- **パッケージマネージャー**: 必ず `pnpm` を使用すること（`npm` や `yarn` は使用禁止）。
- **インストール**: 依存関係をインストールする際は、必ず `--frozen-lockfile` フラグを使用すること。
  - コマンド: `pnpm install --frozen-lockfile`
  - これにより、`pnpm-lock.yaml` の意図しない更新を防ぎ、環境の一貫性を保つ。
- **実行**: スクリプトの実行には `pnpm run <script>` または `pnpm <script>` を使用すること。
  - **Jekyllサーバーの起動**:
    - 通常起動: `pnpm run dev` または `pnpm dev`
    - 高速起動（開発・デバッグ用）: `pnpm run dev:fast` または `pnpm dev:fast` （レポートの大半のビルドをスキップし、1.5秒程度で起動します）
- **バイナリ実行**: `npx` の代わりに `pnpm dlx` を使用すること。
- **Python環境の実行**: Pythonスクリプトやツールを実行する際は、一貫した仮想環境を使用するため、`uv run python3` または `.venv/bin/` 以下の実行ファイルを直接使用すること。
- **堅牢な引数設計（注意点）**: スクリプト内で引数を追加・変更した際、テスト側のモック（`argparse.Namespace`）で属性エラーが発生するのを防ぐため、スクリプト内での引数へのアクセスは `getattr(self.args, 'name', default)` などを用いて安全に行うことを推奨する。

## フロントエンド実装規約・静的解析（Biome / SonarLint）

HTML（`_layouts/`, `_includes/`）、SCSS（`_sass/`, `assets/css/`）、JavaScript（`assets/js/`）を変更する際は、SonarQube（SonarLint）およびアクセシビリティ規約（WCAG 2.1 AA）に準拠するため、以下のルールを厳守し、変更後に必ず `pnpm run check` および `pnpm run lint` を実行すること。

1. **HTML / アクセシビリティ規約**:
   - クリックやキーボード操作を受け付けるインタラクティブ要素には、`<span>` や `<div>` に `role="button"` や `tabindex="0"` を付与するのではなく、ネイティブの `<button type="button">` を使用すること（`Web:S6819`, `Web:S6848`, `Web:S6845`）。
   - `<img>` や `<div>` などの非インタラクティブ要素にインラインイベント属性（`onerror`, `onclick` 等）を記述せず、JavaScriptのイベントリスナーで処理すること（`Web:S6847`）。
   - `aria-label` を指定する場合は、要素の可視テキスト（Visible Label）が `aria-label` の文字列内に含まれるようにすること（WCAG 2.5.3 Label in Name / `Web:S6841`）。
2. **SCSS / スタイル規約**:
   - `!important` の使用は避け、セレクタの詳細度（Specificity）で解決すること（`css:S4656`）。
   - `transition: all` や `$transition-base`（`all` を含む変数）の直接使用は避け、アニメーションさせるプロパティ（`transform`, `opacity`, `background-color` 等）を明示的に列挙すること（`css:S7924`）。
   - `transform` 等を伴うアニメーション・トランジションには、同一セレクタ内に `@media (prefers-reduced-motion: reduce) { transition: none; }`（または `animation: none;`）を併記すること（`css:S7924`）。
   - バッジやチップ等の文字色と背景色は、ライトモード・ダークモード双方で WCAG AA のコントラスト比（通常テキスト 4.5:1 以上）を満たすこと（`css:S7924`）。
   - `_sass/*.scss` のパーシャルを変更した際、Jekyllの `--incremental` モードで `assets/css/main.scss` の再ビルドがスキップされるのを防ぐため、`pnpm run lint:frontend`（または `pnpm run lint`）を実行して `assets/css/main.scss` のタイムスタンプ同期と `.sass-cache` のクリアを行うこと。
3. **JavaScript 規約**:
   - 関数の認知的複雑度（Cognitive Complexity）は **15以下** に抑えること（`biome.json` の `noExcessiveCognitiveComplexity` で強制 / `javascript:S3776`）。
   - `data-*` 属性の読み書きには `getAttribute`/`setAttribute` ではなく `element.dataset` を使用すること（`javascript:S6653`）。
   - 文字コード操作には `charCodeAt`/`String.fromCharCode` ではなく `codePointAt`/`String.fromCodePoint` を使用すること（`javascript:S6643`）。
   - 配列のTruthyフィルタには `.filter((x) => x)` ではなく `.filter(Boolean)` を使用し、`.sort()` には必ず比較関数を指定すること（`javascript:S6645`, `javascript:S2871`）。

## コードレビュー設定

- レビュー対象外：`_reports/**` （レポートファイルは自動生成または特定フォーマットのため、通常のコードレビューからは除外する）
