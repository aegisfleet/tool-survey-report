---
title: Repomix 調査レポート
tool_name: Repomix
tool_reading: レポミックス
category: CLIツール群
developer: Kazuki Yamada
official_site: https://repomix.com/
date: '2026-09-08'
last_updated: '2026-09-08'
tags:
  - AI連携
  - 大規模言語モデル
  - コード解析
  - オープンソース
  - CLI
description: リポジトリ全体をAIが読みやすい単一のファイルにパッケージ化するオープンソースツール。
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - ソフトウェアエンジニア
    - AI開発者
  latest_highlight: 2026年8月にMCPサーバーのサンドボックスモード追加などのセキュリティ強化を実施
  update_frequency: 高
evaluation:
  score: 87
  base_score: 70
  plus_points:
    - point: 5
      reason: Tree-sitterによるコード圧縮機能でトークン数を大幅に削減可能
    - point: 4
      reason: GitignoreやSecretlint連携などセキュリティに配慮した設計
    - point: 5
      reason: MCP（Model Context Protocol）に標準対応しておりAIエージェントから直接利用可能
    - point: 3
      reason: 活発なオープンソース開発（GitHubスター数28K超）
  minus_points: []
  summary: AIコード解析の前処理ツールとして非常に優秀であり、MCP対応やセキュリティ機能も充実している強力なオープンソースツール。
links:
  github: https://github.com/yamadashy/repomix
  deepwiki: https://deepwiki.com/yamadashy/repomix
  codewiki: https://codewiki.google/github.com/yamadashy/repomix
  documentation: https://repomix.com/guide/
relationships:
  related_tools:
    - Claude
    - ChatGPT
    - Cursor
    - Claude Code
---

# **Repomix 調査レポート**

## **1. 基本情報**

* **ツール名**: Repomix
* **ツールの読み方**: レポミックス
* **開発元**: Kazuki Yamada
* **公式サイト**: [https://repomix.com/](https://repomix.com/)
* **関連リンク**:
  * GitHub: [https://github.com/yamadashy/repomix](https://github.com/yamadashy/repomix)
  * DeepWiki: [https://deepwiki.com/yamadashy/repomix](https://deepwiki.com/yamadashy/repomix)
  * CodeWiki: [https://codewiki.google/github.com/yamadashy/repomix](https://codewiki.google/github.com/yamadashy/repomix)
  * ドキュメント: [https://repomix.com/guide/](https://repomix.com/guide/)
* **カテゴリ**: 開発者ツール
* **概要**: Repomixは、コードベース全体をLLM（大規模言語モデル）などのAIツールが処理しやすい単一のフォーマットに変換・パッケージ化するオープンソースのコマンドラインツールである。

## **2. 目的と主な利用シーン**

* **解決する課題**: 複数のファイルやディレクトリにまたがるコードベース全体を、AIプロンプトのコンテキストとして効率的かつ安全に渡すことの難しさ。
* **想定利用者**: ソフトウェアエンジニア、AI開発者、コードレビューアー
* **利用シーン**:
  * AI（Claude, ChatGPTなど）によるコードベース全体のコードレビューとリファクタリング。
  * プロジェクト全体の構造や設計に基づいた包括的なドキュメント（README等）の自動生成。
  * AIによる広範なバグ調査や機能追加に向けた実装計画の策定。

## **3. 主要機能**

* **AI最適化フォーマット出力**: リポジトリをXML、Markdown、JSON、またはプレーンテキストなど、AIが理解しやすい形式で単一ファイルにパッケージ化する。
* **コード圧縮（Code Compression）**: Tree-sitterを活用し、実装の詳細を削除しながらクラスや関数のシグネチャなど重要な構造を抽出することで、トークン使用量を約70%削減する。
* **Git・無視ルールの自動適用**: プロジェクトの `.gitignore`、`.ignore`、`.repomixignore` を自動的に尊重し、不要なファイルを除外する。
* **セキュリティ・シークレットスキャン**: Secretlintを統合しており、認証情報などのシークレットを含む可能性のあるファイルを検出・除外する機能を持つ。
* **トークン数のカウントアップ**: 出力されるファイルやリポジトリ全体のトークン数（GPT-4o等のエンコーディング基準）を計算・表示し、LLMのコンテキストウィンドウ制限の管理を支援する。
* **MCPサーバー統合**: Model Context Protocol（MCP）サーバーとして動作し、AIアシスタント（Claude Code等）から直接コードベースを読み込み、分析させることができる。
* **リモートリポジトリ処理**: `repomix --remote <URL>` コマンドを使用することで、クローンすることなくGitHub上のリモートリポジトリを直接パッケージ化できる。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: ローカルで動作するNode.jsベースのCLIツール（またはライブラリ、MCPサーバー）
* **主要コンポーネントとデータフロー**:
  * **入力**: 指定されたローカルディレクトリ、またはGitHubリモートリポジトリ（自動クローン/フェッチ処理）。
  * **フィルタリング**: `.gitignore` などの無視ルールや、CLI引数（`--include`, `--ignore`）に基づき対象ファイルを絞り込む。同時にSecretlintによるシークレットスキャンを実施。
  * **処理**: Tree-sitter（オプション）によるAST解析・コード圧縮。
  * **出力**: 各ファイルのメタデータ、ディレクトリ構造、ファイル内容を結合し、指定されたフォーマット（XML等）でファイル出力、または標準出力する。
* **特筆すべき要素技術**:
  * ASTパースに `Tree-sitter` を使用し、言語の構造を理解した高度なコード圧縮を実現。
  * トークナイゼーションの計算には `gpt-tokenizer` などを使用。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * Node.js (npx) または bun などのJavaScriptランタイム、あるいはDocker。
  * アカウント登録やクレジットカードは不要。
* **インストール/導入**:

  ```bash
  # npxを使用してインストールなしで直接実行
  npx repomix@latest

  # グローバルインストールの場合
  npm install -g repomix
  ```

* **初期設定**:
  * デフォルトでは設定不要。
  * 必要に応じて `repomix --init` で `repomix.config.json` を生成し、カスタム設定を行う。
* **クイックスタート**:
  * プロジェクトディレクトリ内で `repomix` と実行するだけで、`repomix-output.xml` が生成される。

## **6. 特徴・強み (Pros)**

* コマンド一つでコードベース全体をLLMコンテキストに最適化できる圧倒的な手軽さ。
* Tree-sitterによる高度なASTベースのコード圧縮により、コンテキストウィンドウ（トークン数）を節約しつつ、AIに必要なアーキテクチャやシグネチャを保持できる点。
* Model Context Protocol (MCP) をサポートしており、Claude CodeやCursor等の最新AIエージェントツールとシームレスに統合できる。
* ブラウザ拡張機能やVSCode拡張機能など、CLI以外の環境（GUI等）からの利用サポートもコミュニティ主導で活発である。

## **7. 弱み・注意点 (Cons)**

* 巨大なリポジトリ全体をパッキングした場合、いくら圧縮しても出力サイズが数MB以上になり、利用するLLMのコンテキストウィンドウ上限を超える可能性がある。
* Secretlintによるシークレット検出はヒューリスティックなものであり、完璧なセキュリティ境界を保証するものではないため、最終的な機密情報の混入チェックはユーザー自身が注意を払う必要がある。
* 基本的なUIは英語であり、ドキュメントの大部分も英語である（ただし、Webサイトは日本語等への多言語対応が行われている）。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (MIT)** | 無料 | 全ての機能が無制限で利用可能 |

* **課金体系**: 完全無料（MITライセンスによるオープンソースソフトウェア）
* **無料トライアル**: なし（常時無料）

## **9. 導入実績・事例**

* **導入企業**: オープンソースツールのため企業名での公式な実績リストはないが、世界中の多くの開発者に利用されている（GitHubスター数28K超）。
* **導入事例**:
  * LLM向けのコードジェネレーションワークフローでの文脈抽出。
  * 書籍、ドキュメント、ブログ等のナレッジベースをLLMで読み込ませるデータパックとしての活用。
* **対象業界**: ソフトウェア開発全般、AI/ML開発

## **10. サポート体制**

* **ドキュメント**: 公式ドキュメントサイト（[https://repomix.com/guide/](https://repomix.com/guide/)）にて詳細な設定や機能説明が提供されている。
* **コミュニティ**: Discordサーバー（[https://discord.gg/wNYzTwZFku](https://discord.gg/wNYzTwZFku)）およびGitHubのDiscussionsが活発。
* **公式サポート**: オープンソースであるため、GitHub Issuesを通じたバグ報告・機能要望の対応が基本となる。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: Node.jsライブラリとしてインポートしてプログラム内部から実行するAPIが提供されている（`import { runCli } from 'repomix';`）。
* **外部サービス連携**:
  * GitHub Actions（CI/CDワークフロー内での自動パッキング）。
  * Claude Code Plugins（公式のMCP・探索プラグインあり）。
  * Model Context Protocol (MCP) サーバー機能。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Node.js / TypeScript** | ◎ | ツール自体がTS/JS製であり、設定ファイル (`repomix.config.ts`) も型安全に記述可能。ライブラリとしての組み込みも容易。 | 特になし |
| **Claude / Cursor** | ◎ | MCPサーバーとしてのネイティブ対応や、Agent Skills生成機能（`.claude/skills/`）があり相性が極めて良い。 | 特になし |
| **Docker** | ◯ | 公式コンテナイメージ（`ghcr.io/yamadashy/repomix`）が提供されており、隔離環境での実行が容易。 | 特になし |

## **12. セキュリティとコンプライアンス**

* **認証**: ローカルで動作するCLIであるため、ツール自体の認証機能はない。
* **データ管理**: クラウドへデータを送信するSaaSではなく、ローカル完結で動作するためデータの保存場所は利用者の環境に依存する。
* **準拠規格**: オープンソースツールのため、ISOやSOC2等の企業向けコンプライアンス認証は取得対象外。ただし、実行時にSecretlintを用いてパスワードやAPIキーなどの機密情報を自動検出・除外するセキュリティ機能（`--security-check`）を備えている。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: コマンドラインツール（CLI）であり、`repomix`と打つだけでデフォルト動作するため非常に直感的である。Web版（repomix.com）を利用すればブラウザ上からも容易に利用可能。
* **学習コスト**: 低い。インストールしてコマンドを実行するだけで基本要件は満たせる。無視パターンの設定や出力フォーマット（XML, Markdown等）のカスタマイズも、設定ファイル（JSON, TS等）を通じて容易に行える。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * `--compress` フラグを利用してコードベースのAST構造を保持しつつトークン数を削減し、プロンプトのコンテキストサイズ上限への到達を防ぐ。
  * MCPサーバー（`repomix --mcp`）として常駐させ、Claude Codeなどのエージェントからオンデマンドで部分的にコードベースをパッキング・検索させる構成。
  * `repomix-instruction.md` などのカスタム指示ファイルを設定し、プロジェクト固有のコーディング規約や前提知識を出力ファイルの先頭・末尾に付与する。
* **陥りやすい罠 (Antipatterns)**:
  * 巨大なリポジトリ（数千ファイル）に対して無思慮にフルパッキングを実行し、LLMに投入してしまうこと（コンテキスト限界超過やハルシネーションの原因となる）。不要なディレクトリを `.repomixignore` で除外するか、`--include` で特定のディレクトリに絞り込むべきである。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub (Star / Issues), X (Twitter), 開発者ブログ
* **総合評価**: 非常に高く、GitHubで28K以上のスターを獲得している。
* **ポジティブな評価**:
  * 「コマンド一発でLLMに投げられるテキストファイルが作れるのが信じられないほど便利。」
  * 「Tree-sitterによるコード圧縮機能が秀逸で、トークン節約に大いに役立っている。」
  * 「MCPの対応や、Claude Code向けのプラグインなど、AI時代の開発ワークフローに完全にフィットしている。」
* **ネガティブな評価 / 改善要望**:
  * 「数万ファイルある巨大なモノレポだと、パッキングやASTパースに時間がかかる場合がある。」
  * （過去のIssueより）「環境によっては特定のエンコーディングのファイル処理で警告が出ることがある。」
* **特徴的なユースケース**:
  * OSSリポジトリをパッキングし、ChatGPTやClaudeに「このライブラリの全体アーキテクチャを解説して」と投げるリバースエンジニアリング・学習用途。

## **16. 直近半年のアップデート情報**

* **2026-08-04**: v1.18.0リリース。MCPサーバーのサンドボックスモード（`--sandbox`）追加。指定ディレクトリ外へのアクセスを制限するセキュリティ強化。
* **2026-08-04**: v1.18.0にて、リモートリポジトリ処理時のURLクレデンシャル秘匿化や、クラウダメタデータエンドポイントのクローン拒否などのセキュリティハードニングを実施。

(出典: [GitHub Releases (yamadashy/repomix)](https://github.com/yamadashy/repomix/releases) )

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Repomix | Gitingest |
|:---:|:---|:---:|:---:|
| **基本機能** | リポジトリのパッキング | ◎<br><small>XML/Markdown/JSON等に対応</small> | ◯<br><small>Markdown対応</small> |
| **高度な機能** | ASTベースのコード圧縮 | ◎<br><small>Tree-sitterを使用</small> | ×<br><small>非対応</small> |
| **高度な機能** | トークン数計算 | ◎<br><small>表示可能</small> | ◯<br><small>Web版で表示</small> |
| **セキュリティ** | シークレット除外 | ◎<br><small>Secretlint内蔵</small> | △<br><small>標準的なgitignore依存</small> |
| **エコシステム** | MCPサーバー対応 | ◎<br><small>公式サポート</small> | ×<br><small>非対応</small> |
| **エコシステム** | 動作環境 | ◯<br><small>Node.jsベース</small> | ◯<br><small>Pythonベース</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Repomix** | Node.js製の高度なコードベースパッカー | Tree-sitterによる圧縮、MCP対応、Secretlint連携 | 巨大リポジトリでは生成サイズがLLM上限を超える | AIコーディングアシスタントへのコンテキスト渡し、TypeScript/JSプロジェクトでの利用 |
| **Gitingest** | Python製のリポジトリコンテキスト抽出ツール | Pythonエコシステムとの親和性、シンプルな設計 | AST圧縮やMCPといった高度な機能が少ない | Pythonベースのプロジェクト、データサイエンス系ワークフローでの利用 |

## **18. 総評**

* **総合的な評価**:
  * Repomixは、AIを活用したソフトウェア開発において「リポジトリのコンテキストをLLMに渡す」というプロセスを極めて簡単かつセキュアに行うことができる、非常に優秀なツールである。特にTree-sitterによるコード圧縮とMCPへの対応は、他ツールと一線を画す強力な機能となっている。
* **推奨されるチームやプロジェクト**:
  * LLM（Claude, ChatGPT等）をコードレビューやリファクタリング、ドキュメント生成に日常的に活用しているすべての開発チーム。
  * Claude CodeやCursorなどのAIエージェントを使用している開発者。
* **選択時のポイント**:
  * Node.js環境が整備されている場合、またはWeb/JS系プロジェクトにおいては第一選択となる。Pythonエコシステムに強く依存している環境であれば類似のGitingestなども候補となるが、機能の豊富さとAIエージェントへの組み込みやすさではRepomixに軍配が上がる。
