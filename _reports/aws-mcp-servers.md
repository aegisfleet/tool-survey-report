---
title: "AWS MCP Servers 調査レポート"
tool_name: "AWS MCP Servers"
tool_reading: "エーダブリューエス エムシーピー サーバーズ"
category: "開発者ツール"
developer: "AWS Labs"
official_site: "https://awslabs.github.io/mcp/"
date: "2026-02-04"
last_updated: "2026-02-04"
tags:
  - "AWS"
  - "MCP"
  - "クラウド"
  - "AI"
  - "オープンソース"
  - "開発者ツール"
description: "AWSリソースやドキュメントをModel Context Protocol (MCP) を通じてAIアシスタントに接続するための公式サーバー群"
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "AWS利用者"
    - "開発者"
    - "AIエンジニア"
  latest_highlight: "CloudFormation, Bedrock, ドキュメント検索など9種のサーバーが公開"
  update_frequency: "高"
evaluation:
  score: 83
  base_score: 70
  plus_points:
    - point: 5
      reason: "AWS公式のMCPサーバーであり、信頼性が高い"
    - point: 5
      reason: "ドキュメント検索からIaC、AIサービス連携まで幅広いユースケースをカバー"
    - point: 3
      reason: "オープンソースとして公開されており、カスタマイズが可能"
  minus_points: []
  summary: "AWSを利用するすべてのAI開発者にとって、環境構築や情報検索を劇的に効率化する必須ツール"
links:
  github: "https://github.com/awslabs/mcp"
  documentation: "https://awslabs.github.io/mcp/"
relationships:
  parent: "Model Context Protocol"
  children: []
  related_tools:
    - "Amazon Bedrock"
    - "AWS CloudFormation"
---

# **AWS MCP Servers 調査レポート**

## **1. 基本情報**

* **ツール名**: AWS MCP Servers
* **ツールの読み方**: エーダブリューエス エムシーピー サーバーズ
* **開発元**: AWS Labs
* **公式サイト**: [https://awslabs.github.io/mcp/](https://awslabs.github.io/mcp/)
* **関連リンク**:
  * GitHub: [https://github.com/awslabs/mcp](https://github.com/awslabs/mcp)
  * ドキュメント: [https://awslabs.github.io/mcp/](https://awslabs.github.io/mcp/)
* **カテゴリ**: 開発者ツール / AWS
* **概要**: AWS MCP Serversは、Model Context Protocol (MCP) に準拠した公式のMCPサーバー群です。これを使用することで、Claude DesktopやCursorなどのMCP対応クライアントから、AWSのリソース管理、CloudFormationによるデプロイ、Amazon Bedrockの利用、AWSドキュメントの検索などを直接行うことが可能になります。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * AIアシスタントがAWSの最新情報やアカウント内のリソース状況を把握していない。
  * AWSコンソールとエディタを行き来するコンテキストスイッチのコスト。
  * CloudFormationテンプレートの作成やデバッグに手間がかかる。
* **想定利用者**:
  * AWSを利用してアプリケーションを開発・運用するエンジニア
  * クラウドインフラをコード管理しているSRE/DevOpsエンジニア
* **利用シーン**:
  * **ドキュメント検索**: "S3のライフサイクルポリシーの設定方法は？" とAIに尋ねて、最新の公式ドキュメントに基づいた回答を得る。
  * **インフラ構築**: 自然言語で指示してCloudFormationテンプレートを生成・デプロイする。
  * **トラブルシューティング**: アカウント内のリソース状態（EC2インスタンスのステータスなど）をAIに確認させる。
  * **AI機能の統合**: Amazon BedrockのKnowledge Basesを利用してRAGアプリを開発する。

## **3. 主要機能**

AWS MCP Serversは複数のサーバー実装を含んでいます：

* **AWS Documentation MCP Server**: AWSの公式ドキュメントを検索・参照する機能。
* **AWS CloudFormation MCP Server**: CloudFormationスタックの作成、更新、リソース情報の取得。
* **Amazon Bedrock Context Retrieval MCP Server**: Bedrock Knowledge Basesからの情報取得。
* **Amazon Bedrock Agent Runtime MCP Server**: Bedrock Agentsの実行。
* **AWS HealthOmics MCP Server**: ヘルスケアデータのワークフロー実行。
* **AWS Pricing MCP Server**: AWSサービスの料金情報の取得（Q/A形式）。
* **Amazon MQ MCP Server**: メッセージブローカーの管理。
* **DocumentDB MCP Server**: DocumentDBの管理。
* **Core MCP Server**: AWS SDK (v3) をラップし、汎用的なAWS APIコールを可能にするサーバー。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js (v18以上)
  * AWS CLIの設定済み（`~/.aws/credentials`）
  * MCP対応クライアント（Claude Desktop, Cursorなど）
* **インストール/導入**:
  リポジトリをクローンし、必要なサーバーをビルドしてクライアント設定に追加する。
  `npx` を使用した直接実行も可能。
  例（Claude Desktopの設定）:
  ```json
  {
    "mcpServers": {
      "aws-kb": {
        "command": "npx",
        "args": ["-y", "@awslabs/mcp-server-bedrock-kb", "--region", "us-east-1", "--kb-id", "YOUR_KB_ID"]
      }
    }
  }
  ```
* **初期設定**:
  * AWSの認証情報は標準のプロファイル（default）または環境変数を使用する。
* **クイックスタート**:
  * 公式ドキュメントの "Getting Started" に従い、まずは `aws-documentation-mcp-server` を設定してドキュメント検索を試すのが推奨される。

## **5. 特徴・強み (Pros)**

* **AWS公式**: AWS Labsが開発しており、AWSのベストプラクティスに沿った実装が期待できる。
* **包括的な機能**: 単なるAPIラッパーにとどまらず、IaC (CloudFormation) やAI (Bedrock) といったモダンな開発フローを支援するサーバーが揃っている。
* **安全性**: クライアント（Claudeなど）を介してHuman-in-the-loop（人間の承認）を経て実行されるため、意図しないリソース操作を防げる。

## **6. 弱み・注意点 (Cons)**

* **設定の複雑さ**: 複数のサーバーが含まれており、それぞれ個別に設定が必要な場合がある。
* **コスト**: サーバー自体の利用は無料だが、背後で実行されるAWS API呼び出し（特にBedrockなど）には通常のAWS利用料が発生する。
* **開発段階**: まだ新しいプロジェクトであり、頻繁な更新や仕様変更の可能性がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **OSS** | 無料 | GitHubで公開されており、利用自体は無料。 |

* **課金体系**: AWSリソースの利用料（APIリクエスト、インスタンス稼働、Bedrockトークン料など）は別途AWSアカウントに課金される。

## **8. 導入実績・事例**

* **導入企業**: 公開直後のため具体的な企業名はまだ少ないが、多くのAWS開発者が検証を行っている。
* **コミュニティ**: GitHubのStar数は増加傾向にあり、AWSブログでも紹介されている。

## **9. サポート体制**

* **ドキュメント**: GitHub Pages上の公式ドキュメントが充実している。
* **コミュニティ**: GitHub IssuesやDiscussionsでの報告・議論が可能。
* **公式サポート**: AWS Labsプロジェクトであるため、通常のAWSサポート（ビジネスサポート等）の対象外となる場合がある点に注意（あくまでOSSとしての提供）。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: MCPプロトコル経由でAWS SDK for JavaScript v3を利用。
* **外部サービス連携**: 各種AWSサービス (S3, Lambda, DynamoDB, Bedrock, etc.)。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Node.js** | ◎ | 実装言語であり、親和性が高い。 | 特になし。 |
| **Python** | ◯ | MCPは言語非依存のため利用可能。 | サーバー自体はTS実装が多い。 |
| **AWS CDK** | △ | 現状はCloudFormationサーバーが主。 | CDKとの直接連携は今後の課題か。 |

## **11. セキュリティとコンプライアンス**

* **認証**: AWS CLI (`~/.aws/credentials`) の認証情報を利用するため、IAMロールやMFAの設定がそのまま適用される。
* **データ管理**: ローカルで動作するため、認証情報が外部サーバーに送信されることはない。
* **準拠規格**: AWSのセキュリティ基準に準拠したSDKを使用。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: AIとのチャットインターフェースで完結するため、CLIやコンソールを行き来する必要がなく、操作性は高い。
* **学習コスト**: MCPのセットアップさえできれば、あとは自然言語で操作できるため学習コストは低い。ただしAWSの基礎知識は必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **最小権限の原則**: MCPサーバーを実行するプロファイルには、AdministratorAccessではなく、必要な操作のみを許可したIAMポリシーを付与する。
  * **ドキュメントサーバーの常駐**: 開発中は常にドキュメントサーバーを有効にしておき、ハルシネーションを防ぐ。
* **陥りやすい罠 (Antipatterns)**:
  * **本番環境への直結**: 誤操作のリスクがあるため、まずは開発環境（Sandboxアカウント）で試用する。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: X (Twitter), GitHub
* **総合評価**: AWSと生成AIを組み合わせる開発者から高い期待を集めている。
* **ポジティブな評価**:
  * 「ドキュメント検索が便利すぎる、もう検索窓はいらない」
  * 「CloudFormationのデプロイまでチャットで完結するのは未来感がある」
* **ネガティブな評価 / 改善要望**:
  * 「セットアップ手順が少し長い」
  * 「もっと多くのサービスに対応してほしい」

## **15. 直近半年のアップデート情報**

* **2024-11**: AWS MCP Servers 初回リリース。主要なサーバー群（Documentation, CloudFormation, Bedrock）が公開。

(出典: [GitHub Releases](https://github.com/awslabs/mcp/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | AWS MCP Servers | AWS CLI | AWS Console |
|:---:|:---|:---:|:---:|:---:|
| **インターフェース** | 自然言語操作 | ◎<br><small>AI経由</small> | ×<br><small>コマンド</small> | ×<br><small>GUI</small> |
| **情報取得** | ドキュメント統合 | ◎<br><small>即座に検索</small> | ×<br><small>不可</small> | △<br><small>別タブで検索</small> |
| **自動化** | 複数手順の実行 | ◎<br><small>AIが推論</small> | ◯<br><small>スクリプト化要</small> | ×<br><small>手動</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **AWS MCP Servers** | AIエージェント向けインターフェース | 自然言語でリソース操作・情報検索が可能。コンテキストスイッチ不要。 | まだ対応していない操作がある。 | AIアシスタント（Claude/Cursor）を使いながらAWS開発を行う場合。 |
| **AWS CLI** | コマンドラインツール | 全機能を網羅し、スクリプト化が容易。 | コマンドやオプションを覚える必要がある。 | 定型作業の自動化や、厳密な操作が必要な場合。 |
| **AWS Console** | Web管理画面 | 視覚的にリソースを確認・設定できる。 | 手順が多く、再現性がない。 | 全体像の把握や、GUIでの設定が楽なサービスを利用する場合。 |

## **17. 総評**

* **総合的な評価**:
  AWS MCP Serversは、AWS開発の体験を「検索・調査・コマンド実行」のサイクルから「対話・指示・確認」のサイクルへと変革するツールである。特にドキュメントサーバーとBedrock連携は、開発効率を大きく向上させるポテンシャルがある。
* **推奨されるチームやプロジェクト**:
  * 生成AIを活用した開発フローを積極的に取り入れているチーム。
  * AWS上での開発頻度が高いエンジニア。
* **選択時のポイント**:
  * 既存のAWS CLI/CDKワークフローを完全に置き換えるものではなく、AIによる「ブースト」として導入するのが良い。
