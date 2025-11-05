# カテゴリ/タグ/関連付けの整理指示書

## 目的

- レポート群のカテゴリおよびtagsの語彙を統一し、類似ツール間の関連性（検索・タグページ・比較表）を高める。
- ただし、ツール本来の説明や機能を損なわないよう、保守的で検証可能な変更のみを許可する。

## 作業範囲の制限

**重要**: 1回の作業では以下のいずれか1つのみを実行する：

1. **単一レポート中心の作業**: 1つのレポートファイルを選択し、そのレポートと直接関連する2-3個のレポートのみを対象とする
2. **カテゴリ統一作業**: 特定のカテゴリ（例：「AIコーディング支援」）に属するレポートのみを対象とする
3. **タグ統一作業**: 特定のタグ（例：「エージェント」）を持つレポートのみを対象とする

## 適用対象

- `_reports/*.md` のフロントマター（YAML）の `category`、`tags`、`relationships` を対象とする。
- **重要**: `last_updated` フィールドは更新しない（カテゴリ・タグ整理は内容変更ではないため）。
- ドキュメント本文は原則変更しない。

### 定義（標準語彙）

- **カテゴリ（推奨の正規化語）**
  - **AIコーディング支援**: AI技術を使ったコード生成・補完ツール
  - **自律型AIエージェント**: 自律的にタスクを実行するAIシステム
  - **AIコードエディタ**: AI機能が統合されたコードエディタ
  - **開発者ツール**: 開発プロセスを支援する汎用ツール
  - **CI/CD**: 継続的インテグレーション・デプロイメントツール
  - **バージョン管理**: ソースコードの変更履歴管理ツール
  - **テスト/QA**: テスト自動化・品質保証ツール
  - **データ可視化**: データの視覚化・分析ツール
  - **インフラ/クラウド**: インフラ管理・クラウドサービス

- **タグ（推奨セット、小文字/大文字混在を避ける）**
  - **AI関連**: AI, エージェント, 自律型, コード生成, 機械学習
  - **開発関連**: コーディング支援, 開発者ツール, IDE, CLI, API
  - **プロセス関連**: CI/CD, 自動化, テスト, デプロイ, 監視
  - **技術関連**: セキュリティ, クラウド, コンテナ, マイクロサービス
  - **その他**: 日本語対応, オープンソース, エンタープライズ

- **レポート関連付け（relationships）**
  - **目的**: レポート間の階層関係や関連性を明示し、ユーザーが関連レポートを発見しやすくする
  - **構造**: 以下の3つのフィールドで構成される階層的関連付けシステム

    ```yaml
    relationships:
      parent: "tool_name"        # 親レポート（1つのみ）
      children:                  # 子レポート（複数可）
        - "tool_name1"
        - "tool_name2"
      related_tools:             # 関連レポート（複数可）
        - "tool_name3"
        - "tool_name4"
    ```
  
  - **各フィールドの定義**:
    - **parent**: このツールの上位概念や基盤となるツール（例：GitHub Copilotの親はGitHub）
    - **children**: このツールから派生した、または密接に関連する下位ツール（例：GitHubの子はGitHub Copilot）
    - **related_tools**: 同等レベルで関連性の高いツール（競合製品、代替ツール、補完ツールなど）
  
  - **参照方法**: 全て各レポートのフロントマターで定義された `tool_name` の値（文字列）で参照する
    - 例： `_reports/github-copilot.md` の `tool_name: "GitHub Copilot"` → `"GitHub Copilot"`
    - 例： `_reports/gitlab-duo.md` の `tool_name: "GitLab Duo"` → `"GitLab Duo"`

### 変更ルール

1. **最小変更**: 既存カテゴリが適切な場合は変更せず、タグで補完する。
2. **カテゴリ変更**: 曖昧なカテゴリを標準語彙に置換する場合のみ実施。
3. **タグ統一**: 英語/日本語混在は日本語に統一（例: "Agent" → "エージェント"）。
4. **タグ数制限**: 多すぎる場合は関連性の高い上位5つに絞る。
5. **last_updated除外**: カテゴリ・タグ整理時は `last_updated` を更新しない。

#### 関連付け（relationships）ルール

1. **設定基準**:
   - **parent**: 明確な階層関係（プラットフォーム→機能、基盤→拡張）
   - **children**: 直接的な派生・統合関係
   - **related_tools**: 競合・補完・代替ツール

2. **妥当性確認**:
   - 参照先ファイルの存在確認
   - 双方向関係の整合性（親子関係の相互設定）
   - 循環参照の回避

3. **数の制限**:
   - **parent**: 1つのみ
   - **children**: 最大5つ
   - **related_tools**: 最大7つ

### 編集前チェックリスト

- [ ] YAML形式の正確性確認
- [ ] ツールの主要機能を公式情報で確認済み
- [ ] カテゴリが業界標準と一致
- [ ] タグが本文の機能説明と整合
- [ ] 同カテゴリツールとの分類一貫性
- [ ] 関連付け参照先ファイルの存在確認
- [ ] 親子関係の双方向整合性
- [ ] 循環参照なし
- [ ] 最小変更の原則遵守
- [ ] `last_updated` 非更新の確認

## 実務手順（段階的アプローチ）

### ステップ1: 作業対象の選定

以下のいずれか1つを選択する：

- **オプションA**: 特定の1レポートを中心とした関連レポート群（最大4ファイル）
- **オプションB**: 特定カテゴリのレポート群（最大5ファイル）
- **オプションC**: 特定タグの統一作業（最大5ファイル）

### ステップ2: 事前確認

1. **対象ファイル数確認**: `ls _reports/ | grep -E "(対象パターン)" | wc -l`
2. **現状把握**: `grep -h "^tags:\|^category:" _reports/対象ファイル*.md`
3. **関連付け確認**: `grep -A 10 "^relationships:" _reports/対象ファイル*.md`
4. **ツール調査**:
   - 公式サイトで主要機能確認
   - 業界標準分類との照合
   - 関連レポート（競合・代替・統合）の特定
5. **参照先ファイル存在確認**
6. **作業ログ作成**: `echo "作業開始: $(date)" > work-log-$(date +%Y%m%d).txt`

### ステップ3: 変更実行

1. **1ファイルずつ編集**: 即座にYAMLチェック
2. **変更記録**: 作業ログに記録
3. **中間確認**: 3ファイル毎に整合性チェック

### ステップ4: 検証とコミット

1. **YAML構文チェック**: 全ファイルのパース確認
2. **関連付け整合性**:
   - 参照先ファイル存在確認
   - 双方向関係確認
   - 循環参照確認
3. **差分確認**: `git diff` で意図しない変更チェック
4. **コミット**: 変更内容を明記

### ステップ5: 進捗の記録

1. **進捗状況の更新**: このファイル(`task-organizing-category-tags.md`)の末尾にある`進捗状況`セクションに、実施した作業内容を簡潔に記載する。

## 分類の正確性確保

### 分類手順

1. **公式情報確認**: 公式サイトの「About」「Features」で分類用語を特定
2. **機能ベース分類**: 主要機能・利用シーン・ターゲットユーザーを把握
3. **業界標準照合**: 同種ツールの分類、技術メディアでの扱いを確認

### 分類例

- **CI/CD**: GitHub Actions, Jenkins, GitLab CI
- **バージョン管理**: Git, GitHub, GitLab
- **AIコーディング支援**: GitHub Copilot, Cursor
- **IDE/エディタ**: VS Code, IntelliJ IDEA

### 判断基準

- **複数機能ツール**: 主要機能でカテゴリ決定、副次機能はタグ
- **曖昧なケース**: 公式自己紹介文を最優先
- **変更判断**: 明らかな間違いのみ変更、疑問時は現状維持

## エラー対応

### 復旧手順

1. **YAML構文エラー**: `.bak` から復元
2. **意図しない変更**: `git checkout -- ファイル名` でリバート
3. **分類不明**: 変更保留、追加調査実施
4. **作業中断**: ログに理由記録

### 中断基準

- 3ファイル以上でエラー発生時
- 1ファイルで2回以上エラー時はスキップ
- 分類に確信なき場合は現状維持
- 作業時間30分超過時は進捗確認

## 作業例（段階的アプローチ）

### 例1: 単一レポート中心の作業

**対象**: `_reports/jules.md` + 関連する自律型AIツール2-3個

**作業前の確認**:

```bash
grep -l "自律\|エージェント\|Agent" _reports/*.md | head -4
```

**変更例**:

- メインファイル `jules.md`:
  - 変更前 tags: `["AI", "開発者ツール", "コーディング支援", "CLI", "自律型エージェント"]`
  - 変更後 tags: `["AI", "エージェント", "自律型", "コーディング支援", "開発者ツール", "CLI"]`
  - 関連付け追加:

    ```yaml
    relationships:
      related_tools:
        - "Devin"
        - "OpenHands"
        - "GitHub Copilot"
    ```

- 関連ファイル: 同様の統一ルールを適用し、双方向の関連付けを設定（最大3ファイル）

### 例2: カテゴリ統一作業

**対象**: `category: "AIコーディング支援"` のレポート群のみ

**作業前の確認**:

```bash
grep -l "category.*AI.*コーディング" _reports/*.md
```

### 関連付け判断基準

#### parent/children 設定基準

- **同一開発元**: GitHub → GitHub Copilot
- **プラットフォーム機能**: AWS → AWS CodeCommit
- **基盤拡張**: Git → GitHub/GitLab

#### related_tools 設定基準

- **直接競合**: GitHub Copilot ↔ Cursor（同機能）
- **補完関係**: GitHub Actions ↔ Jenkins（選択肢）
- **代替ツール**: Git ↔ Mercurial（異なる解決法）
- **統合可能**: VS Code ↔ GitHub Copilot（併用）

#### 避けるべきケース

- **間接的関係**: Docker と Kubernetes
- **異なる領域**: テストツールとデプロイツール
- **一時的関係**: 単発コラボレーション

## 進捗状況

- **2025-10-25**:
  - **作業内容**: AIコーディング支援ツールのカテゴリとタグを標準化。
  - **対象ファイル**:
    - `_reports/coderabbit.md`
    - `_reports/github-copilot.md`
    - `_reports/cursor.md`
    - `_reports/openhands.md`
    - `_reports/devin.md`
  - **変更概要**:
    - `coderabbit.md`: `tags` を `["AI", "コーディング支援", "コードレビュー", "自動化"]` に標準化。
    - `cursor.md`: `tags` を `["AI", "コーディング支援", "コードエディタ", "IDE"]` に標準化。
    - `github-copilot.md`, `openhands.md`, `devin.md` は変更不要であることを確認。
- **2025-10-26**:
  - **作業内容**: AI関連レポートのカテゴリ統一と関連付けの追加。
  - **対象ファイル**:
    - `_reports/kiro.md`
    - `_reports/cline.md`
    - `_reports/openai-codex.md`
  - **変更概要**:
    - `kiro.md`: `category` を `AI IDE` から `AIコードエディタ` に変更。
    - `cline.md`: `category` を `AIコーディングエージェント` から `自律型AIエージェント` に変更し、`tags` を標準化。`relationships` を追加。
    - `openai-codex.md`: `category` を `AIコーディングエージェント` から `AIコーディング支援` に変更し、`tags` を標準化。`relationships` を追加。
- **2025-10-26**:
  - **作業内容**: 勤怠管理ツールのカテゴリとタグを標準化。
  - **対象ファイル**:
    - `_reports/king-of-time.md`
    - `_reports/jobcan-kinmu-kanri.md`
  - **変更概要**:
    - `king-of-time.md`: `category` を `勤怠管理システム` から `勤怠管理` に変更。
    - `jobcan-kinmu-kanri.md`: `tags` の `労務管理` を `人事労務` に変更。
- **2025-10-26**:
  - **作業内容**: テスト自動化関連レポートのカテゴリ統一と関連付けの追加。
  - **対象ファイル**:
    - `_reports/autify.md`
    - `_reports/magicpod.md`
    - `_reports/cypress.md`
    - `_reports/playwright.md`
    - `_reports/selenium.md`
  - **変更概要**:
    - `autify.md`, `magicpod.md`, `selenium.md` の `category` を `テスト自動化` から `テスト/QA` に変更。
    - `cypress.md`, `playwright.md` の `category` を `テスト自動化フレームワーク` から `テスト/QA` に変更。
    - `cypress.md`, `playwright.md`, `selenium.md` に相互の `related_tools` を追加。
- **2025-10-26**:
  - **作業内容**: 人事・勤怠管理ツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/works-hi-company.md`
    - `_reports/smarthr.md`
    - `_reports/king-of-time.md`
    - `_reports/jobcan-kinmu-kanri.md`
    - `_reports/moneyforward-cloud-kinmu.md`
  - **変更概要**:
    - `_reports/company.md` を `_reports/works-hi-company.md` にリネーム。
    - `works-hi-company.md`, `smarthr.md` の `category` を `人事労務` に統一。
    - `king-of-time.md`, `jobcan-kinmu-kanri.md`, `moneyforward-cloud-kinmu.md` の `category` が `勤怠管理` であることを確認。
    - 上記5つのファイルに相互の `related_tools` を追加。
- **2025-10-26**:
  - **作業内容**: バージョン管理およびCI/CDツールのカテゴリと関連付けを整理。
  - **対象ファイル**:
    - `_reports/github.md`
    - `_reports/gitlab.md`
    - `_reports/github-actions.md`
    - `_reports/gitlab-ci.md`
    - `_reports/jenkins.md`
  - **変更概要**:
    - `github.md` と `gitlab.md` の `category` が `バージョン管理` であることを確認。
    - `github-actions.md`, `gitlab-ci.md`, `jenkins.md` の `category` が `CI/CD` であることを確認。
    - `github-actions.md` の `related_tools` を修正し、`GitLab` への参照をより具体的な `GitLab CI/CD` に変更。
    - 上記のCI/CDツール間で双方向の `related_tools` が設定されていることを確認。
- **2025-10-26**:
  - **作業内容**: 主要な生成AIツール（ChatGPT、Gemini、Claude）のカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/chatgpt.md`
    - `_reports/gemini.md`
    - `_reports/claude.md`
  - **変更概要**:
    - `claude.md` の `category` を `開発者ツール` から `生成AI` に変更し、他の2ツールと統一。
    - 3つのレポート間に相互の `related_tools` を追加し、競合関係を明示した。
- **2025-10-26**:
  - **作業内容**: Windsurfを基軸としたAIコーディング支援ツールの関連付けを整理。
  - **対象ファイル**:
    - `_reports/windsurf.md`
    - `_reports/cursor.md`
    - `_reports/github-copilot.md`
  - **変更概要**:
    - 3つのレポート間に相互の `related_tools` を追加し、競合関係を明示した。カテゴリとタグは変更なし。
- **2025-10-26**:
  - **作業内容**: CodeceptJSを基軸としたテスト自動化ツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/codeceptjs.md`
    - `_reports/playwright.md`
    - `_reports/cypress.md`
    - `_reports/selenium.md`
  - **変更概要**:
    - `codeceptjs.md` の `category` を `テスト自動化フレームワーク` から `テスト/QA` に変更。
    - 上記4つのレポート間に相互の `related_tools` を追加し、関連性を明示した。
- **2025-10-26**:
  - **作業内容**: Manusを基軸とした自律型AIエージェントの関連付けを整理。
  - **対象ファイル**:
    - `_reports/manus.md`
    - `_reports/devin.md`
    - `_reports/openhands.md`
  - **変更概要**:
    - 3つのレポート間に相互の `related_tools` を追加し、競合関係を明示した。カテゴリとタグは変更なし。
- **2025-10-26**:
  - **作業内容**: Cucumberを基軸としたテスト自動化ツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/cucumber.md`
    - `_reports/selenium.md`
    - `_reports/playwright.md`
    - `_reports/cypress.md`
    - `_reports/codeceptjs.md`
  - **変更概要**:
    - `cucumber.md` の `category` を `テスト自動化` から `テスト/QA` に変更。
    - 上記5つのレポート間に相互の `related_tools` を追加し、関連性を明示した。
- **2025-10-26**:
  - **作業内容**: MagicPodを基軸としたテスト/QAツールの関連付けを整理。
  - **対象ファイル**:
    - `_reports/magicpod.md`
    - `_reports/autify.md`
    - `_reports/selenium.md`
    - `_reports/cypress.md`
    - `_reports/playwright.md`
  - **変更概要**:
    - `magicpod.md` と `autify.md` に `relationships` を追加。
    - 既存のテスト自動化ツールレポート（`selenium.md`, `cypress.md`, `playwright.md`）に `MagicPod` と `Autify` への関連付けを追加し、双方向の関係を確立。
- **2025-10-26**:
  - **作業内容**: Appiumを基軸としたテスト/QAツールの関連付けを整理。
  - **対象ファイル**:
    - `_reports/appium.md`
    - `_reports/selenium.md`
    - `_reports/playwright.md`
    - `_reports/cypress.md`
    - `_reports/magicpod.md`
    - `_reports/autify.md`
  - **変更概要**:
    - `appium.md` に `relationships` を追加。
    - 既存のテスト自動化ツールレポート5つに `Appium` への関連付けを追加し、双方向の関係を確立。
- **2025-10-26**:
  - **作業内容**: Zapierを基軸としたワークフロー自動化ツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/zapier.md`
    - `_reports/microsoft-power-automate.md`
    - `_reports/n8n.md`
  - **変更概要**:
    - 3つのレポートの `category` を `ワークフロー自動化` に統一。
    - `microsoft-power-automate.md` の `tags` を修正。
    - 3つのレポート間に相互の `related_tools` を追加し、競合関係を明示した。
- **2025-10-26**:
  - **作業内容**: Grokを基軸とした生成AIツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/grok.md`
    - `_reports/chatgpt.md`
    - `_reports/gemini.md`
    - `_reports/claude.md`
  - **変更概要**:
    - `grok.md` の `category` を `AIアシスタント` から `生成AI` に変更し、`tags` を標準化。
    - 上記4つのレポート間に相互の `related_tools` を追加し、競合関係を明示した。
- **2025-10-26**:
  - **作業内容**: Rakuten AIを基軸とした生成AIツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/rakuten-ai.md`
    - `_reports/chatgpt.md`
    - `_reports/gemini.md`
    - `_reports/claude.md`
    - `_reports/grok.md`
  - **変更概要**:
    - `rakuten-ai.md` の `category` を `AI` から `生成AI` に変更。
    - 上記5つのレポート間に相互の `related_tools` を追加し、競合関係を明示した。
- **2025-10-27**:
  - **作業内容**: Pulumiを基軸とした構成管理ツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/pulumi.md`
    - `_reports/terraform.md`
    - `_reports/aws-cloudformation.md`
    - `_reports/ansible.md`
  - **変更概要**:
    - `pulumi.md` の `category` を `Infrastructure as Code` から `構成管理` に変更し、`tags` を標準化。
    - 上記4つのレポート間に相互の `related_tools` を追加し、競合・関連関係を明示した。
- **2025-10-27**:
  - **作業内容**: OpenTofuを基軸とした構成管理ツールのタグ標準化と関連付けの整理。
  - **対象ファイル**:
    - `_reports/opentofu.md`
    - `_reports/terraform.md`
    - `_reports/pulumi.md`
    - `_reports/aws-cloudformation.md`
    - `_reports/ansible.md`
  - **変更概要**:
    - `opentofu.md`: `tags` を日本語に標準化し、`parent: Terraform` および `related_tools` を追加。
    - `terraform.md`: `tags` を日本語に標準化し、`children: [OpenTofu]` を追加して親子関係を双方向に設定。
    - `pulumi.md`, `aws-cloudformation.md`, `ansible.md`: `tags` を標準化し、`related_tools` に `OpenTofu` を追加。
- **2025-10-30**:
  - **作業内容**: Dockerを基軸としたコンテナ関連レポートのタグ標準化と関連付けの整理。
  - **対象ファイル**:
    - `_reports/docker.md`
    - `_reports/kubernetes.md`
    - `_reports/podman.md`
  - **変更概要**:
    - `kubernetes.md`: `tags` に `コンテナ` を追加し、他のツールとの共通性を確保。
    - 3つのレポート間に相互の `related_tools` を追加し、関連性を明示した。
- **2025-11-04**:
  - **作業内容**: GIMPを基軸としたデザインツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/gimp.md`
    - `_reports/affinity.md`
    - `_reports/canva.md`
  - **変更概要**:
    - 3つのレポートの `category` を `デザインツール` に統一。
    - `tags` を `デザインツール` を含むように標準化。
    - CanvaとAffinityの親子関係、および3ツール間の双方向の `related_tools` を追加。
- **2025-11-05**:
  - **作業内容**: LilysAIを基軸とした生成AIツールのカテゴリ統一と関連付けの整理。
  - **対象ファイル**:
    - `_reports/lilysai.md`
    - `_reports/notebooklm.md`
    - `_reports/chatgpt.md`
    - `_reports/gemini.md`
    - `_reports/claude.md`
  - **変更概要**:
    - `lilysai.md`: `category` を `生成AI` に変更し、`tags` を標準化。`related_tools` に `NotebookLM` を追加。
    - `notebooklm.md`: `category` を `生成AI` に変更し、`related_tools` に `LilysAI` を追加して双方向の関係を確立。
    - ユーザーからのフィードバックに基づき、当初追加した `ChatGPT`, `Gemini`, `Claude` との関連付けは、機能の焦点が異なるため削除。
