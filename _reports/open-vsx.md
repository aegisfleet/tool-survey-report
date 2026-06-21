---
title: Open VSX 調査レポート
tool_name: Open VSX
tool_reading: オープン ブイエスエックス
category: 開発ユーティリティ
developer: Eclipse Foundation
official_site: https://open-vsx.org
date: '2026-06-21'
last_updated: '2026-06-21'
tags:
  - オープンソース
  - 開発ツール
  - 拡張機能
description: VS Code互換エディタ向けに拡張機能を提供する、ベンダー中立のオープンソースレジストリ
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - スタートアップ
    - エンタープライズ
  latest_highlight: v1.0.1でCLI、Web UI、Serverの不具合修正やキャッシュ制御の改善を実施
  update_frequency: 中
evaluation:
  score: 77
  base_score: 70
  plus_points:
    - point: 5
      reason: ベンダー中立なガバナンスとオープンソースでの提供
    - point: 5
      reason: 企業内でのセルフホストが可能
  minus_points:
    - point: -3
      reason: 一部のプロプライエタリな拡張機能が利用できない
  summary: ベンダーロックインを回避したい企業や、Theia・VSCodium等の代替IDEを利用する開発者にとって必須のインフラ
links:
  github: https://github.com/eclipse-openvsx/openvsx
  deepwiki: "https://deepwiki.com/eclipse-openvsx/openvsx"
  documentation: https://github.com/eclipse-openvsx/openvsx/wiki
relationships:
  related_tools:
    - Visual Studio Code
    - Eclipse IDE
---

# **Open VSX 調査レポート**

## **1. 基本情報**

* **ツール名**: Open VSX
* **ツールの読み方**: オープン ブイエスエックス
* **開発元**: Eclipse Foundation
* **公式サイト**: [https://open-vsx.org](https://open-vsx.org)
* **関連リンク**:
  * GitHub: [https://github.com/eclipse-openvsx/openvsx](https://github.com/eclipse-openvsx/openvsx)
  * ドキュメント: [https://github.com/eclipse-openvsx/openvsx/wiki](https://github.com/eclipse-openvsx/openvsx/wiki)
* **カテゴリ**: 開発者ツール
* **概要**: Open VSXは、Visual Studio Codeの拡張機能APIと互換性のある拡張機能を提供するための、オープンソースのレジストリです。MicrosoftのVisual Studio Marketplaceのベンダー中立な代替として機能し、Eclipse TheiaやVSCodiumなど、様々なIDEから利用可能です。

## **2. 目的と主な利用シーン**

* **解決する課題**: Visual Studio Marketplaceのライセンス規約により、Microsoft製品以外のIDEからMarketplaceを利用できないという制限を回避する。
* **想定利用者**: 代替IDE（VSCodium、Eclipse Theiaなど）のユーザー、拡張機能の開発者、社内専用の拡張機能レジストリを構築したい企業。
* **利用シーン**:
  * VSCodiumやEclipse Theiaなどの代替IDE環境における拡張機能の検索とインストール。
  * `ovsx`コマンドラインツールを用いた、自作の拡張機能の公開と管理。
  * 企業ネットワーク内での、プライベートなOpen VSXインスタンスの構築と運用。

## **3. 主要機能**

* **ベンダー中立な公開レジストリ**: 開発者が拡張機能を自由に公開・利用できるプラットフォーム（open-vsx.org）の提供。
* **CLIツール (`ovsx`)**: 拡張機能のパッケージ化と公開をコマンドラインから行うためのツール。VS Codeの`vsce`と同様の操作性を持つ。
* **セルフホスト機能**: 企業や組織が独自のネットワーク内にOpen VSXのインスタンスを立ち上げ、プライベートなレジストリとして運用する機能。
* **Web UI**: Visual Studio Marketplaceに似た、拡張機能の検索や詳細情報の確認が可能なWebインターフェース。
* **検索エンジン連携**: Elasticsearchを用いた高速な検索機能（デフォルト）。小規模なデプロイ向けにデータベースクエリによる検索にも対応。
* **クラウドストレージのサポート**: 拡張機能ファイルの保存先として、AWS S3、Azure Blob Storage、Google Cloud Storageなどの外部ストレージサービスをサポート。
* **OAuth2認証**: GitHub等のOAuthプロバイダーを利用したユーザー認証機能。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * (公開レジストリを利用する場合) Eclipse.orgのアカウント作成とPublisher Agreementへの同意が必要。
  * (拡張機能を公開する場合) Node.jsとnpm。
* **インストール/導入**:

  ```bash
  # ovsx CLIのインストール（またはnpx経由での実行）
  npm install -g ovsx
  ```

* **初期設定**:
  * open-vsx.orgにログインし、アクセストークンを生成。
* **クイックスタート**:
  * 名前空間の作成: `npx ovsx create-namespace <publisher-name> -p <token>`
  * 拡張機能の公開: `npx ovsx publish <package.vsix> -p <token>`

## **5. 特徴・強み (Pros)**

* **ベンダーロックインの回避**: 特定の企業（Microsoft）に依存せず、オープンなガバナンス（Eclipse Foundation）の下で運営されている。
* **セルフホストの容易さ**: Dockerイメージが提供されており、Spring BootベースのサーバーとPostgreSQLを用いて容易に社内構築が可能。
* **柔軟な構成**: ストレージ（ローカル、S3、Azure、GCP）や検索エンジン（Elasticsearch、DB検索）を要件に合わせて選択可能。
* **CLIの互換性**: VS Codeの`vsce`ツールに慣れた開発者が容易に移行できる`ovsx`コマンドの提供。

## **6. 弱み・注意点 (Cons)**

* **一部の拡張機能の欠如**: Microsoftが提供する一部のプロプライエタリな拡張機能は、ライセンスの制限によりOpen VSXには公開されていない。
* **Marketplaceとの二重管理**: 拡張機能開発者は、より多くのユーザーにリーチするために、VS MarketplaceとOpen VSXの両方に公開・保守する手間が生じることがある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **無料プラン** | 無料 | 個人開発者、オープンソースプロジェクト、教育機関向け。最大3 RPS（リクエスト/秒）。 |
| **Enterprise** | €100,000/年 | 中規模な商用プラットフォーム向け。最大15 RPS。SLAターゲット、インシデントレスポンス。 |
| **Enterprise XL** | €500,000/年 | クラウドIDEや大規模な商用プラットフォーム向け。最大50 RPS。SLA保証、サービスクレジット。 |

* **課金体系**: Sustained usage（月間の95パーセンタイル RPS）に基づく。
* 無料のパブリックレジストリ（open-vsx.org）は、個人およびオープンソースプロジェクトで制限なく利用可能。

## **8. 導入実績・事例**

* **導入事例**:
  * VSCodium: テレメトリを排除したVS Codeのビルドで、デフォルトのレジストリとして採用。
  * Eclipse Theia: クラウドおよびデスクトップIDEのプラットフォーム。
  * Gitpod: クラウドベースの開発環境。

## **9. サポート体制**

* **ドキュメント**: GitHubリポジトリ上のWikiにて、デプロイや公開方法に関する詳細なドキュメントが提供されている。
* **コミュニティ**: GitHub Issuesでのディスカッションや、Slackワークスペース（Open VSX Working Group）でのサポート。
* **公式サポート**: マネージドサービス（Managed Registry）を契約しているエンタープライズ顧客向けに、SLAに基づくプロフェッショナルな運用サポートを提供。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: VS Codeの拡張機能APIと互換性のあるREST APIを提供。
* **外部サービス連携**:
  * GitHub: OAuthログインや、GitHub Actionsを用いた自動公開ワークフロー（`HaaLeo/publish-vscode-extension`等）。
  * クラウドストレージ: AWS S3、Azure Blob、GCPストレージ等。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Docker / Kubernetes** | ◎ | 公式Dockerイメージが提供されており、デプロイが容易 | 特になし |
| **Node.js / npm** | ◎ | CLIツール(`ovsx`)がNode.jsベースで提供 | 特になし |
| **Java (Spring Boot)** | ◯ | サーバーサイドの実装言語であり、必要に応じたカスタマイズが可能 | Javaの運用知識が必要 |

## **11. セキュリティとコンプライアンス**

* **認証**: OAuth2による認証（デフォルトはGitHub）。Personal Access TokenによるCLIでの認証。
* **データ管理**: 拡張機能ファイルはローカル、またはAWS S3、Azure、GCP等のクラウドストレージに保存可能。
* **拡張機能のスキャン**: セキュリティ強化のため、シークレット（APIキー等）の漏洩検知、既知の悪意あるファイルのブロック、ネームスペースのタイポスクワッティング検出などの自動スキャン機能を搭載可能。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Web UIはVisual Studio Marketplaceに似たクリーンで直感的なデザインを採用しており、拡張機能の検索や詳細情報の確認が容易。
* **学習コスト**: 既にVS Code向けに拡張機能を作成・公開したことのある開発者にとっては、`ovsx`ツールの使用方法は`vsce`とほぼ同じであるため、学習コストは非常に低い。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * GitHub Actionsを利用して、リリースタグの作成時にVS MarketplaceとOpen VSXの両方へ自動で公開するCI/CDパイプラインを構築する。
  * 企業内での利用の場合、`ovsx.upstream.url`プロパティを設定し、社内の拡張機能はローカルに保持しつつ、公開されている拡張機能はopen-vsx.orgへフォールバックする構成をとる。
* **陥りやすい罠 (Antipatterns)**:
  * 公開時にアクセストークンをパブリックなリポジトリに誤ってコミットしてしまう。トークンのローテーションと有効期限の管理を適切に行う必要がある。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: XDA Developers, 開発者コミュニティ
* **ポジティブな評価**:
  * Microsoftのエコシステムに縛られない、オープンなガバナンスモデルが高く評価されている。
  * 任意の代替IDE（VSCodium等）からシームレスに拡張機能をインストールできる自由度が支持されている。
* **ネガティブな評価 / 改善要望**:
  * 一部の人気のあるプロプライエタリな拡張機能が利用できないことに対する不満がある。

## **15. 直近半年のアップデート情報**

* **2024-06-11**: v1.0.1 - CLIのパスエンコード修正、拡張機能削除時のキャッシュクリア修正、パラメーターバリデーションの追加。
* **2024-05-28**: v1.0.0 - 読み取り専用モードの追加、Redis接続のTLSサポート、XXE攻撃への対策、各種依存関係の更新。
* **2024-05-22**: v0.34.6 - 失敗したスキャナージョブの再試行機能、キャッシュ制御ヘッダーの微調整、最新エンドポイントのセマンティックソート修正。

(出典: [GitHub Releases](https://github.com/eclipse-openvsx/openvsx/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | Visual Studio Marketplace |
|:---:|:---|:---:|:---:|
| **基本機能** | 拡張機能の公開・検索 | ◯<br><small>標準対応</small> | ◎<br><small>最大のエコシステム</small> |
| **ライセンス** | 利用制限 | ◎<br><small>どのIDEからも利用可能</small> | ×<br><small>Microsoft製品専用</small> |
| **運用** | セルフホスト | ◎<br><small>社内構築が容易</small> | ×<br><small>クラウドサービスのみ</small> |
| **ガバナンス** | 運営母体 | ◎<br><small>Eclipse Foundation（中立）</small> | △<br><small>Microsoft単独</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | オープンソースでベンダー中立なレジストリ。 | 任意のIDEで利用可能。オンプレミスでの構築が可能。 | Microsoft独自の拡張機能が存在しない。 | VSCodiumなどの代替IDEを使用する場合。企業内でクローズドな拡張機能レジストリを構築したい場合。 |
| **Visual Studio Marketplace** | Microsoftが運営する公式レジストリ。 | 圧倒的な数の拡張機能と、公式サポート。 | Microsoft製IDEでしか利用できないライセンス制限。 | 公式のVS Codeを使用し、制約なく全ての拡張機能を利用したい場合。 |

## **17. 総評**

* **総合的な評価**:
  Open VSXは、拡張機能エコシステムのオープン性を保つために非常に重要なインフラです。機能的にはVS Marketplaceと同等の能力を持ちながら、特定のベンダーに依存しない点が最大の魅力です。
* **推奨されるチームやプロジェクト**:
  VSCodiumやEclipse Theiaなどをベースにした開発環境を構築しているチームや、セキュリティ・コンプライアンスの観点から自社専用の拡張機能レジストリを運用したいエンタープライズ企業に強く推奨されます。
* **選択時のポイント**:
  利用したい拡張機能がMicrosoftのプロプライエタリなライセンスに縛られていないかを確認することが重要です。オープンソースの拡張機能であれば、Open VSXを介して問題なく利用可能です。
