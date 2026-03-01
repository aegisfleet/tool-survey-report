---
# === フロントマター ===
# 【必須項目】
title: "Microsoft Work IQ 調査レポート"
tool_name: "Microsoft Work IQ"
tool_reading: "マイクロソフト ワーク アイキュー"
category: "開発者ツール"
developer: "Microsoft"
official_site: "https://github.com/microsoft/work-iq-mcp"
date: "2026-01-25"
last_updated: "2026-03-01"
tags:
  - "AI"
  - "エージェント"
  - "開発者ツール"
  - "Microsoft 365"
  - "CLI"
description: "Microsoft 365のデータ（メール、会議、ドキュメントなど）に自然言語でアクセスするためのMCPサーバーおよびCLIツール。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: false
  starting_price: "無料"
  target_users:
    - "開発者"
    - "Microsoft 365 ユーザー"
  latest_highlight: "2025年11月のIgnite 2025でPublic Previewとして発表"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 75
  base_score: 70
  plus_points:
    - point: 5
      reason: "MCP（Model Context Protocol）に公式対応しており、AIエージェントとの連携が容易"
    - point: 3
      reason: "CLIツールが付属しており、手軽に動作確認や対話が可能"
  minus_points:
    - point: -3
      reason: "Public Preview段階であり、機能やAPIが変更される可能性がある"
  summary: "Microsoft 365データをAIエージェントから利用するための公式かつ標準的な手段として有望"

# 【任意項目】該当するもののみ記載
links:
  documentation: "https://github.com/microsoft/work-iq-mcp/blob/main/README.md"
relationships:
  parent: "Microsoft 365 Copilot"
  related_tools:
    - "GitHub Copilot"
    - "Model Context Protocol"
---

# **Microsoft Work IQ 調査レポート**

## **1. 基本情報**

* **ツール名**: Microsoft Work IQ
* **ツールの読み方**: マイクロソフト ワーク アイキュー
* **開発元**: Microsoft
* **公式サイト**: [https://github.com/microsoft/work-iq-mcp](https://github.com/microsoft/work-iq-mcp)
* **関連リンク**:
  * ドキュメント: [README](https://github.com/microsoft/work-iq-mcp/blob/main/README.md)
  * アナウンス: [Ignite 2025 Book of News](https://news.microsoft.com/ignite-2025-book-of-news/)
* **カテゴリ**: AI開発基盤
* **概要**: Microsoft Work IQ (MCP Server) は、AIエージェントがMicrosoft 365のデータ（メール、会議、ドキュメント、Teamsメッセージ、連絡先など）に安全かつ自然言語でアクセスするためのインターフェースを提供します。Model Context Protocol (MCP) に準拠しており、GitHub Copilot CLIやその他のMCP対応クライアントから利用可能です。

## **2. 目的と主な利用シーン**

* **解決する課題**: AIエージェントがユーザーの業務コンテキスト（メールや会議の内容など）を理解し、実用的な回答やアクションを行うためのデータアクセス手段の提供。
* **想定利用者**: AIエージェントを開発または利用する開発者、Microsoft 365 Copilotユーザー。
* **利用シーン**:
  * **日常業務の振り返り**: 「今週のサラさんとのメールの内容を要約して」といった自然言語での問い合わせ。
  * **会議準備**: 「明日の会議に関連するドキュメントを探して」といったコンテキストに基づく情報検索。
  * **コーディング支援**: GitHub Copilot CLIから「プロジェクトXに関する仕様書の内容を確認して」と指示し、コード生成のコンテキストとして利用。

## **3. 主要機能**

* **自然言語クエリ**: メール、会議、ドキュメント、Teams、連絡先などのMicrosoft 365データを自然言語で検索・取得可能。
* **MCPサーバー**: Model Context Protocol (MCP) に準拠したサーバーとして動作し、様々なMCPクライアント（Claude Desktop, GitHub Copilotなど）と接続可能。
* **CLIツール**: `workiq` コマンドラインツールを提供し、手動でのクエリ実行やインタラクティブな対話が可能。
* **GitHub Copilot統合**: GitHub Copilot CLIのプラグインとして簡単にインストール・利用可能。
* **管理者承認フロー**: テナント管理者の承認（Admin Consent）に基づいた安全なデータアクセス制御。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js 18以上 (npmおよびnpxを含む)
  * Microsoft 365のテナントとアカウント (初回アクセス時にテナント管理者による承認が必要)
* **インストール/導入**:
  ```bash
  # グローバルインストールの場合
  npm install -g @microsoft/workiq
  ```
* **初期設定**:
  * 初回実行時に `workiq accept-eula` を実行し、EULAに同意する。
  * Entra IDによるデバイスコード認証やブラウザ認証が行われる。
* **クイックスタート**:
  * GitHub Copilot CLIを使用する場合、以下のコマンドでプラグインを追加し利用可能。
  ```bash
  copilot
  /plugin marketplace add github/copilot-plugins
  /plugin install workiq@copilot-plugins
  ```
  * 単体のCLIとして利用する場合、`workiq ask -q "明日の予定を教えて"` で質問が可能。
  * MCPサーバーとして起動する場合、`npx -y @microsoft/workiq mcp` を実行する（各種エディタ等の設定ファイルにこのコマンドを記述する）。

## **5. 特徴・強み (Pros)**

* **公式MCPサポート**: Microsoftが提供する公式のMCPサーバーであり、信頼性とMicrosoft 365エコシステムとの整合性が高い。
* **導入の容易さ**: `npm` でインストールでき、Copilot CLIへのプラグイン追加もコマンド一つで完了する。
* **クロスプラットフォーム**: Windows, Linux, macOSに加え、WSL (Windows Subsystem for Linux) もサポートしている。

## **6. 弱み・注意点 (Cons)**

* **プレビュー段階**: Public Previewであるため、機能変更や不具合の可能性がある。また、ソースコードは公開されていない（プロプライエタリ）。
* **管理者権限の必要性**: 利用するにはMicrosoft 365テナントの管理者による承認が必要であり、個人利用や権限のない企業環境では導入ハードルがある。
* **日本語対応**: ツール自体のインターフェースやドキュメントは主に英語であるが、クエリ自体は日本語でも動作する（M365 Copilotの言語能力に依存）。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---|---|---|
| **Microsoft Work IQ Tool** | 無料 | ツール自体のインストールと利用は無料（npmパッケージ）。 |
| **Microsoft 365 Copilot** | 有料 | データアクセスにはMicrosoft 365 Copilotのライセンスとデータへのアクセス権が必要となる場合がある。 |

* **課金体系**: ツール自体は無料。バックエンドのM365利用には既存のサブスクリプションが必要。
* **無料トライアル**: なし（ツールの利用自体は無料）。

## **8. 導入実績・事例**

* **導入企業**: 公開事例はまだ少ないが、GitHub CopilotやM365 Copilotを利用する先進的な開発者コミュニティで利用が始まっている。
* **導入事例**: GitHub Copilot CLIと組み合わせて、ターミナルから離れずに仕様確認やメールチェックを行う開発者の事例など。
* **対象業界**: ソフトウェア開発、ITサービス、およびMicrosoft 365を導入している全業界。

## **9. サポート体制**

* **ドキュメント**: GitHubリポジトリ内のREADMEおよび関連ドキュメント。
* **コミュニティ**: GitHub Issuesを通じたフィードバックや質問が可能。
* **公式サポート**: 現時点ではGitHub Issuesが主な窓口であり、SLA付きのサポートは明記されていない（プレビューのため）。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Model Context Protocol (MCP) を通じた標準的なインターフェースを提供。
* **外部サービス連携**:
  * **GitHub Copilot CLI**: プラグインとしてシームレスに連携。
  * **MCP対応クライアント**: Claude DesktopなどのMCPをサポートするあらゆるツールから接続可能（理論上）。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Node.js** | ◎ | ツール自体がNode.jsで動作するため親和性が高い。 | 特になし |
| **GitHub Copilot** | ◎ | 公式プラグインとして提供されており、セットアップが容易。 | 特になし |
| **WSL** | ◯ | WSL上での動作もサポートされており、Windows開発者にとって便利。 | ブラウザ認証のために追加パッケージが必要な場合がある。 |

## **11. セキュリティとコンプライアンス**

* **認証**: Microsoft Entra ID (旧Azure AD) を使用した認証。管理者によるテナント単位の同意（Admin Consent）が必須。
* **データ管理**: ユーザーのMicrosoft 365データにアクセスするが、データはMicrosoft 365のセキュリティ境界内で処理される。
* **準拠規格**: Microsoft 365のコンプライアンス基準に準拠（ツールとしての個別の認証取得状況はREADMEに記載なし）。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CLIベースであり、開発者にとっては馴染みやすい。自然言語で操作できるため、コマンドオプションを覚える必要が少ない。
* **学習コスト**: `workiq ask` コマンド一つで対話できるため、学習コストは非常に低い。MCPの設定も標準化されている。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * GitHub Copilot CLIのエイリアスや拡張機能として常駐させ、コーディング中の「ちょっとした確認」に利用する。
  * MCPサーバーとして常駐させ、複数のAIエージェントから共有のコンテキストソースとして利用する。
* **陥りやすい罠 (Antipatterns)**:
  * 管理者承認を得ずに利用しようとして認証エラーになる（事前にIT部門への確認が必要）。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub Repository Stars/Forks, X(Twitter)
* **総合評価**: GitHub Star 240+ (2026年1月時点)
* **ポジティブな評価**:
  * 「ターミナルからメールや予定を確認できるのは開発フローを中断させなくて良い」
  * 「MCPに対応しているため、自作のエージェントに組み込みやすい」
* **ネガティブな評価 / 改善要望**:
  * 「管理者権限が必要なため、大企業では導入のハードルが高い」
  * 「まだプレビュー版なので動作が不安定なことがある」

## **15. 直近半年のアップデート情報**

* **2025-11-18**: Microsoft Ignite 2025にてWork IQおよびMCPサーバーのPublic Previewが発表。(出典: [Microsoft 365 Blog](https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/18/microsoft-ignite-2025-copilot-and-agents-built-to-power-the-frontier-firm/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | Glean | Microsoft Graph API |
|:---:|:---|:---:|:---:|:---:|
| **データアクセス** | 自然言語クエリ | ◎<br><small>自然言語で検索可能</small> | ◎<br><small>横断検索に特化</small> | ×<br><small>コード記述とAPI呼び出しが必要</small> |
| **統合** | MCP対応 | ◎<br><small>公式提供</small> | △<br><small>独自コネクタ等</small> | ×<br><small>非対応</small> |
| **対象** | M365データ | ◎<br><small>特化</small> | ◎<br><small>多岐にわたるSaaS対応</small> | ◎<br><small>全データにアクセス可能</small> |
| **導入** | 手軽さ | ◎<br><small>npm install</small> | △<br><small>エンタープライズ契約が必要</small> | △<br><small>アプリ登録・実装が必要</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Microsoft Work IQ** | M365専用のMCPサーバー＆CLI。 | Microsoft公式、MCP準拠、Copilot CLI連携。無料。 | M365データに限定される。プレビュー版。 | 開発者が個人のM365データをAIエージェントから利用したい場合。 |
| **Glean** | 企業向け横断検索・AIプラットフォーム。 | M365以外にもSlack, Jira, GitHubなど多数のSaaSを横断検索可能。 | 高額なエンタープライズ契約が必要。 | 全社的なナレッジ検索・活用基盤を構築する場合。 |
| **Microsoft Graph API** | M365データにアクセスするためのREST API。 | 柔軟性が高く、あらゆるアプリケーションに組み込み可能。 | 実装工数がかかる。自然言語処理は自前で実装が必要。 | 独自のカスタムアプリケーションを開発する場合。 |

## **17. 総評**

* **総合的な評価**: Microsoft Work IQは、Microsoft 365の膨大なデータをAIエージェントエコシステム（特にMCP）に開放する重要なツールである。開発者は複雑なAPIを叩くことなく、自然言語でメールやドキュメントにアクセスできるため、エージェント開発の生産性が向上する。
* **推奨されるチームやプロジェクト**: GitHub Copilotを活用している開発チーム、社内用AIエージェントを開発しているエンジニア。
* **選択時のポイント**: 導入にはテナント管理者の協力が不可欠であるため、組織のセキュリティポリシーと照らし合わせて利用可否を確認する必要がある。
