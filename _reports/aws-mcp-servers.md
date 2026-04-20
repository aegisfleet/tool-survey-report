---
title: AWS MCP Servers 調査レポート
tool_name: AWS MCP Servers
tool_reading: エーダブリューエス エムシーピー サーバーズ
category: MCPサーバー/基盤
developer: AWS Labs
official_site: https://awslabs.github.io/mcp/
date: '2026-04-21'
last_updated: '2026-04-21'
tags:
- AI
- AWS
- MCP
- オープンソース
- クラウド
- 開発者ツール
description: AWSリソース管理、CloudFormationデプロイ、Bedrock利用などをAIアシスタントから直接実行可能にするMCP対応サーバー群
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
  - AWS利用者
  - 開発者
  - AIエンジニア
  latest_highlight: CloudFormation, Bedrock, ドキュメント検索など9種のサーバーが公開
  update_frequency: 高
evaluation:
  score: 83
  base_score: 70
  plus_points:
  - point: 5
    reason: AWS公式のMCPサーバーであり、信頼性が高い
  - point: 5
    reason: ドキュメント検索からIaC、AIサービス連携まで幅広いユースケースをカバー
  - point: 3
    reason: オープンソースとして公開されており、カスタマイズが可能
  minus_points: []
  summary: AWSを利用するすべてのAI開発者にとって、環境構築や情報検索を劇的に効率化する必須ツール
links:
  github: https://github.com/awslabs/mcp
  documentation: https://awslabs.github.io/mcp/
relationships:
  parent: Model Context Protocol
  children: []
  related_tools:
  - Amazon Bedrock
  - AWS CloudFormation
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
* **カテゴリ**: MCPサーバー/基盤
* **概要**: AWS MCP Serversは、Model Context Protocol (MCP) に準拠した公式のMCPサーバー群です。Claude DesktopやCursorなどのMCP対応クライアントからAWSリソース管理、CloudFormationによるデプロイ、Amazon Bedrockの利用、ドキュメント検索などを直接実行可能にします。

## **2. 目的と主な利用シーン**

* **解決する課題**: AIアシスタントが最新のAWS仕様やユーザーのリソース状況を把握できない問題や、コンソール・エディタ間のコンテキストスイッチを解決する。
* **想定利用者**: クラウドインフラをコード管理しているSRE/DevOpsエンジニアや、AWS上で開発・運用を行うエンジニア。
* **利用シーン**:
  * AIアシスタントへの自然言語でのAWSドキュメント検索やリソース状況の問い合わせ。
  * チャットベースでのCloudFormationテンプレートの生成・デプロイ。
  * Amazon Bedrockを用いたRAGアプリの開発およびAI機能の統合検証。

## **3. 主要機能**

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
  * Node.js (v18以上) または Python などの各サーバーに応じた環境
  * AWS CLIの設定済み（`~/.aws/credentials`）
  * MCP対応クライアント（Claude Desktop, Cursorなど）
* **インストール/導入**:
  ```bash
  npx -y @awslabs/mcp-server-bedrock-kb --region us-east-1 --kb-id YOUR_KB_ID
  ```
* **初期設定**:
  * AWSの認証情報は標準のプロファイル（default）または環境変数を使用する。
  * クライアント側（例: Claude Desktop）の設定ファイル `mcpServers` セクションに実行コマンドを追記する。
* **クイックスタート**:
  * 公式ドキュメントの「Getting Started」に従い、まずは `aws-documentation-mcp-server` などを設定し、チャットで「〜について教えて」と呼びかけて動作確認を行う。

## **5. 特徴・強み (Pros)**

* **AWS公式提供**: AWS Labsが開発しており、AWSのベストプラクティスに沿った信頼性の高い実装。
* **包括的な機能**: APIラッパーにとどまらず、IaC (CloudFormation) やAI (Bedrock) といったモダンな開発フローを支援する構成。
* **安全性確保**: クライアント（Claudeなど）を介してHuman-in-the-loop（人間の承認）で実行されるため、意図しないリソース操作を防げる。

## **6. 弱み・注意点 (Cons)**

* **設定の複雑さ**: 複数のサーバーが含まれており、用途ごとに個別の設定が必要な場合がある。
* **利用コストの発生**: MCPサーバー自体の利用は無料だが、背後で実行されるAWS API呼び出し（特にBedrockなどの生成AI系）には通常のAWS利用料が発生する。
* **日本語対応**: GitHubやドキュメントは主に英語であるため、トラブルシューティングには英語の読解が必要。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **OSS** | 無料 | オープンソースであり利用自体は無料 |

* **課金体系**: AWSリソースの利用料（APIリクエスト、インスタンス稼働、Bedrockトークン料など）は別途AWSアカウント側で課金される。
* **無料トライアル**: なし（AWS自体の無料利用枠の適用はあり）。

## **8. 導入実績・事例**

* **導入企業**: GitHubのOSSプロジェクトであり、個人のAIエンジニアやAWS開発者を中心に利用が広がっている。
* **導入事例**: まだ公開事例は少ないものの、X(Twitter)等でCursorとBedrockの組み合わせによるRAG開発の効率化などが報告されている。
* **対象業界**: 業界を問わず、AWS上でAI開発やシステム構築を行う全ての開発チーム。

## **9. サポート体制**

* **ドキュメント**: GitHub Pages上の公式ドキュメントが充実している。
* **コミュニティ**: GitHub IssuesやDiscussionsでの報告・議論が活発。
* **公式サポート**: AWS LabsプロジェクトのためOSSとしての提供となり、通常のAWSサポート（ビジネスサポート等）の対象外となる場合がある。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: MCPプロトコル経由でAWS SDK for JavaScript v3を利用しAPIをコール。
* **外部サービス連携**: 各種AWSサービス (S3, Lambda, DynamoDB, Bedrock, CloudFormation等)。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Node.js** | ◎ | サーバーの実装言語が多く、親和性が高い。 | 特になし。 |
| **Python** | ◯ | MCPプロトコルは言語非依存のため利用可能。 | TS実装のサーバーを直接カスタマイズする場合はTSの知識が必要。 |
| **AWS CDK** | △ | 現状はCloudFormationサーバーが主。 | CDKとの直接連携は今後の課題。 |

## **11. セキュリティとコンプライアンス**

* **認証**: AWS CLI (`~/.aws/credentials`) の認証情報を利用し、IAMロールやMFAの設定がそのまま適用される。
* **データ管理**: ローカルで動作するため、認証情報が外部サーバーに送信されることはない。
* **準拠規格**: AWSのセキュリティ基準に準拠したSDKを使用している。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: AIクライアント（Claude Desktopなど）とのチャットインターフェースで完結し、CLIやコンソールを行き来する必要がなくシームレス。
* **学習コスト**: MCPのセットアップ方法の理解は必要だが、その後は自然言語で操作できるため学習コストは低い。ただしAWS機能の基礎知識は前提となる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **最小権限の原則 (Least Privilege)**: MCPサーバーを実行するプロファイルにはAdministratorAccessではなく、必要な操作のみを許可したIAMポリシーを付与する。
  * **ドキュメントサーバーの常駐**: 開発中はドキュメントサーバーを有効にしておき、ハルシネーションを防ぐために「公式ドキュメントに基づいて」と指示を補強する。
* **陥りやすい罠 (Antipatterns)**:
  * **本番環境への直結**: エージェントの自律的な誤操作のリスクがあるため、まずは開発環境（Sandboxアカウント）で試用する。
  * **利用料の監視漏れ**: 意図しないBedrockの大量呼び出しなどが発生しないよう、CloudWatch等でのコスト監視を設定せずに利用する。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub, X(Twitter) 等のSNS
* **総合評価**: AWSと生成AIを組み合わせる開発者から高い期待を集めており、GithubでのStar数も順調に伸びている。
* **ポジティブな評価**:
  * 「ドキュメント検索ツールとして非常に優れており、コンテキストスイッチが減った」
  * 「CloudFormationのデプロイまでチャットで完結するのが便利」
  * 「BedrockのKnowledge Bases連携がローカルから簡単にテストできて強力」
* **ネガティブな評価 / 改善要望**:
  * 「各サーバーのセットアップ手順がまだ煩雑で初心者には分かりにくい」
  * 「もっと多くのAWSサービス（CDKなど）に対応してほしい」
  * 「APIのレスポンスが遅い場合があり、プロンプトの調整が必要」
* **特徴的なユースケース**:
  * AIコーディング支援エディタ（Cursor等）と連携し、AWSインフラの設計から構築までを対話型で行う。

## **15. 直近半年のアップデート情報**

* **2026-04-14**: `dynamodb` サーバーでのSecrets Manager連携の強化や `aws-dataprocessing-mcp-server` の改善、AWS CLIのアップデートを実施。
* **2026-03-31**: `redshift-mcp-server` でのDB名欠落バグ修正や、非推奨サーバーに対するCODEOWNERSの更新。
* **2026-03-24**: `AgentCore MCP Server` へ9つのコードインタプリタツールを統合、`pricing` ツールの入力検証の強化などを実施。
* **2026-03-13**: 複数のサーバー（CloudFormation, Bedrock KB等）に対して一旦非推奨警告を追加したが、一部を除き撤回されるなどの流動的なアップデート。AgentCoreへの25個のブラウザツールの統合やドキュメントサーバーの機能強化（read_sections）を追加。
* **2026-03-09**: `terraform-mcp-server` および `aws-diagram-mcp-server` の非推奨化が決定され、マイグレーションガイドが追加される。

(出典: [GitHub Releases](https://github.com/awslabs/mcp/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | AWS CLI | AWS Console |
|:---:|:---|:---:|:---:|:---:|
| **インターフェース** | 自然言語操作 | ◎<br><small>AI経由で直感的に操作可能</small> | ×<br><small>コマンドの記憶が必要</small> | ×<br><small>GUI操作のみ</small> |
| **情報取得** | ドキュメント統合 | ◎<br><small>即座に検索しコンテキスト化</small> | ×<br><small>対応していない</small> | △<br><small>別タブで検索が必要</small> |
| **自動化** | 複数手順の実行 | ◎<br><small>AIが推論して一括実行</small> | ◯<br><small>シェルスクリプト化が必要</small> | ×<br><small>手動で順次実行</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | AIエージェント向けインターフェース | 自然言語でリソース操作・情報検索が可能。コンテキストスイッチ不要。 | まだ対応していないサービスや操作がある。 | ClaudeやCursorなどのAIアシスタントを使いながらAWS開発を行う場合。 |
| **AWS CLI** | コマンドラインツール | 全機能を網羅し、スクリプト化が容易。 | コマンドやオプションを正確に覚える必要がある。 | 定型作業の自動化や、厳密な操作が必要な場合。 |
| **AWS Console** | Web管理画面 | 視覚的にリソースを確認・設定できる。 | 手順が多く、再現性がない。 | 全体像の把握や、GUIでの設定が楽なサービスを利用する場合。 |

## **17. 総評**

* **総合的な評価**:
  AWS MCP Serversは、AWS開発の体験を「検索・調査・コマンド実行」から「対話・指示・確認」へと大きく変革するツールです。特に公式ドキュメントサーバーとBedrock連携は、開発中のコンテキストスイッチを無くし効率を飛躍的に向上させるポテンシャルがあります。
* **推奨されるチームやプロジェクト**:
  * 生成AIを活用した開発フロー（CursorやClaude Desktop）を積極的に取り入れているチーム。
  * AWS上でのシステム構築・運用を日常的に行うエンジニア。
* **選択時のポイント**:
  * 既存のAWS CLIやCDKワークフローを完全に置き換えるものではなく、AIアシスタントによる「開発ブースト」として導入するのが効果的です。運用においては、適切なIAM権限の設計を必ずセットで行う必要があります。
