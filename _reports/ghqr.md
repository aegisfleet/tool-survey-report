---
title: GitHub Quick Review 調査レポート
tool_name: GitHub Quick Review
tool_reading: ギットハブ クイック レビュー / ジーエイチキューアール
category: セキュリティ・コンプライアンス
developer: Microsoft
official_site: https://github.com/microsoft/ghqr
date: '2026-04-25'
last_updated: '2026-04-25'
tags:
  - GitHub
  - セキュリティ
  - OSS
  - 開発ツール
description: GitHubエンタープライズ、組織、リポジトリのセキュリティとベストプラクティスを評価する強力なCLIツール。
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - セキュリティチーム
    - DevOpsエンジニア
    - GitHub管理者
  latest_highlight: 2026年4月にリポジトリスキャン機能やGHE.comサポートが追加されたv0.2.0をリリース
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 8
      reason: MCP（Model Context Protocol）をサポートし、AIツールと容易に連携可能
    - point: 5
      reason: 多岐にわたるセキュリティチェックをコマンドひとつで自動化できる
    - point: 5
      reason: Excel, Markdown, JSONなど多様な出力形式をサポート
  minus_points:
    - point: -3
      reason: 情報が公式GitHubリポジトリに限られており、日本語ドキュメントがない
  summary: GitHubのセキュリティリスクを網羅的に特定でき、AI連携も可能な実用性の高いツール
links:
  github: https://github.com/microsoft/ghqr
  deepwiki: https://deepwiki.com/microsoft/ghqr
---

# **GitHub Quick Review 調査レポート**

## **1. 基本情報**

* **ツール名**: GitHub Quick Review (ghqr)
* **ツールの読み方**: ギットハブ クイック レビュー / ジーエイチキューアール
* **開発元**: Microsoft
* **公式サイト**: [https://github.com/microsoft/ghqr](https://github.com/microsoft/ghqr)
* **関連リンク**:
  * GitHub: [https://github.com/microsoft/ghqr](https://github.com/microsoft/ghqr)
* **カテゴリ**: セキュリティ・コンプライアンス
* **概要**: GitHub Quick Review (ghqr)は、GitHubのエンタープライズ、組織、リポジトリを分析し、セキュリティのベストプラクティスや推奨設定への準拠状況を評価するオープンソースのCLIツールである。セキュリティギャップや不適切な設定を迅速に特定するのに役立つ。

## **2. 目的と主な利用シーン**

* **解決する課題**: 大規模なGitHub環境において、セキュリティ設定（2FA、ブランチ保護、依存関係管理など）が組織全体で一貫して適用されているかを手動で確認する手間とヒューマンエラーのリスクを解消する。
* **想定利用者**: セキュリティチーム、DevOpsエンジニア、GitHub Enterprise管理者
* **利用シーン**:
  * 定期的なセキュリティ監査やコンプライアンス評価
  * 新規または既存のGitHub Organizationのリスクアセスメント
  * CopilotやGitHub Advanced Securityなどの利用状況・設定の把握

## **3. 主要機能**

* **セキュリティスキャン**: Dependabotアラート、シークレットスキャン、コードスキャン、GHAS（GitHub Advanced Security）の状況をリポジトリ横断で評価する。
* **アクセス制御のチェック**: 2FAの強制、メンバー権限、SAML SSO、CODEOWNERSの有無を検証する。
* **ブランチ保護の検証**: 必須レビュー、ステータスチェック、管理者権限の強制設定などを確認する。
* **Copilotポリシー分析**: 組織単位でのシート使用状況、コンテンツ除外設定、ポリシー構成、MCP設定をスキャンする。
* **ガバナンスとコンプライアンス**: IP許可リスト、リポジトリ作成ポリシー、フォークポリシー、監査ログストリーミング設定を確認する。
* **アクションと依存関係の確認**: ワークフロー権限、許可されたアクション、セルフホストランナー、Dependabotのバージョン更新などを評価する。
* **MCP（Model Context Protocol）サーバー機能**: AIアシスタント（VS Code/GitHub Copilot等）がghqrの機能と対話するためのサーバーとして動作する。
* **多様な出力形式**: スキャン結果はMarkdown、Excel（デフォルト）、JSONフォーマットで出力され、優先順位付きの推奨事項が含まれる。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * GitHub Personal Access Token (PAT) が必要。
  * スキャン対象に応じたスコープ設定（`read:org`, `read:enterprise`, `repo`, `read:audit_log`, `read:user`, `copilot`）が必要。
* **インストール/導入**:

  ```bash
  # Linux / macOS
  bash -c "$(curl -fsSL https://raw.githubusercontent.com/microsoft/ghqr/main/scripts/install.sh)"

  # Docker
  docker pull ghcr.io/microsoft/ghqr:latest
  ```

* **初期設定**:
  * `GITHUB_TOKEN` 環境変数にアクセストークンを設定する。
* **クイックスタート**:

  ```bash
  # トークンの設定
  export GITHUB_TOKEN=<your-personal-access-token>

  # 組織をスキャン
  ghqr scan -o my-org

  # エンタープライズをスキャン
  ghqr scan -e my-enterprise
  ```

## **5. 特徴・強み (Pros)**

* **包括的なカバレッジ**: セキュリティ、アクセス制御、Copilotポリシー、GitHub Actions設定など、GitHub特有の設定を網羅的に監査できる。
* **AIとの統合（MCPサポート）**: Model Context Protocolサーバーを内蔵しており、VS CodeやGitHub CopilotなどのAIアシスタントから直接スキャンや分析を呼び出せる。
* **データレジデンシのサポート**: `GHE.com` のカスタムサブドメインを使用するGitHub Enterprise Cloud with Data Residencyに対応している。
* **自動レート制限処理**: GitHub APIのレート制限（GraphQL/REST）に対して、大規模環境でも指数的バックオフによる自動処理が行われる。

## **6. 弱み・注意点 (Cons)**

* **公式サポート・ドキュメントの言語**: ドキュメントやインターフェースは英語のみであり、日本語による公式サポートは提供されていない。
* **トークンの権限管理**: 詳細なスキャンを行うためにはPATに幅広いスコープを付与する必要があり、トークンの取り扱いには十分な注意が必要。
* **新しいツール**: まだバージョン0.x系（2026年4月時点）のツールであり、活発に開発中であるため、仕様変更が発生する可能性がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (MIT)** | 無料 | すべての機能が利用可能 |

* **課金体系**: 完全無料（オープンソース）
* **無料トライアル**: 該当なし

## **8. 導入実績・事例**

* **導入企業**: Microsoftが開発・公開しているツールである。公開された特定の企業事例は現在見当たらない。
* **導入事例**: 大規模なGitHubエンタープライズを利用している組織で、セキュリティ監査や設定の標準化のために利用されている。
* **対象業界**: 業界を問わず、GitHubを基盤としてソフトウェア開発を行っているすべての組織。

## **9. サポート体制**

* **ドキュメント**: GitHubリポジトリのREADMEが公式ドキュメントとして機能している。
* **コミュニティ**: GitHub IssuesおよびGitHub Discussionsを通じてコミュニティサポートや機能要望が行われている。
* **公式サポート**: オープンソースプロジェクトであるため、商用のSLA付き公式サポートは存在しない。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: ツール自体がGitHubのREST APIおよびGraphQL APIを利用してデータを収集する。
* **外部サービス連携**: MCP（Model Context Protocol）をサポートしており、VS CodeなどのエディタやAIアシスタントと統合できる。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **GitHub Enterprise** | ◎ | ネイティブに対応しており、最も親和性が高い。 | 特になし。 |
| **VS Code / Copilot** | ◎ | MCPサーバーとして統合可能で、IDE内からAIを通じてスキャンを実行できる。 | `mcp.json` の設定が必要。 |
| **GitLab / Bitbucket** | × | GitHub専用のツールであるため利用不可。 | 代替ツールの検討が必要。 |

## **11. セキュリティとコンプライアンス**

* **認証**: GitHub Personal Access Token (PAT) を使用して認証する。
* **データ管理**: CLIツールとしてローカル（または実行環境）で動作し、収集したデータは指定した形式（Excel, JSON, Markdown）でローカルに出力される。
* **準拠規格**: ツール自体が特定の規格認証を取得しているわけではないが、SOC2やISO27001などで求められる「アクセス制御」や「変更管理」の証跡確認に活用できる。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: コマンドラインベースの標準的なインターフェース。結果がExcelやMarkdownで出力されるため、レポートとしての視認性は高い。
* **学習コスト**: GitHubのセキュリティ概念（GHAS、ブランチ保護、Dependabotなど）を理解していれば、ツールの操作自体は非常にシンプルで学習コストは低い。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **CI/CDへの組み込み**: GitHub Actionsなどのワークフローに定期スキャンとして組み込み、Organizationのセキュリティポスチャの低下を自動検知する。
  * **IDEでのMCP活用**: 開発者のローカル環境でMCPサーバーとして稼働させ、Copilotを通じて対話的に自チームのリポジトリ設定状況を確認・修正する。
* **陥りやすい罠 (Antipatterns)**:
  * **過剰な権限を持つPATの放置**: スキャン用に作成したPATを無期限で放置したり、不要なスコープまで付与したりすることはセキュリティリスクとなる。
  * **出力レポートの不適切な管理**: 出力されるExcelやJSONにはインフラのセキュリティ状態という機密情報が含まれるため、レポートファイルのアクセス管理を怠らないこと。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2、Capterraなどの商用レビューサイトには未登録（GitHubリポジトリやSNS上の反応が主）。
* **総合評価**: 不明
* **ポジティブな評価**:
  * コマンド一つで複雑なGitHub設定状況をExcelに出力してくれる点が便利。
  * MCPに対応しているため、AI経由で「このOrganizationのセキュリティの弱点は？」と聞くだけで調査できる点が革新的。
* **ネガティブな評価 / 改善要望**:
  * オープンソースであるため、より洗練されたダッシュボードやSaaS型の一元管理機能がない。
* **特徴的なユースケース**:
  * 複数の企業をM&Aした後の、各組織のGitHub設定の棚卸しとセキュリティベースラインの統一監査。

## **15. 直近半年のアップデート情報**

* **2026-04-22**: v.0.2.0 リリース。リポジトリスキャン機能（`--repository`）の追加、GHE.com（Data Residency）対応、ルールセットエンリッチメントの進捗ログ出力などを追加。
* **2026-03-16**: v.0.1.3 リリース。
* **2026-03-11**: v.0.1.2 リリース。EnterpriseDiscoveryStageにおけるスキップロジックの改善など。
* **2026-03-02**: v.0.1.1 リリース。各種依存関係やアクションのアップデート。
* **2026-02-24**: v.0.1.0 リリース（初期リリースに近いバージョン）。

(出典: [GitHub Releases](https://github.com/microsoft/ghqr/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | GitHub Quick Review | Legitify | SonarQube | Semgrep |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | SCM設定・ポリシー監査 | ◎<br><small>GitHub特化</small> | ◎<br><small>GitHub/GitLab両対応</small> | ×<br><small>対象外</small> | ×<br><small>対象外</small> |
| **セキュリティ** | 静的コード解析(SAST) | ×<br><small>設定確認のみ</small> | ×<br><small>設定確認のみ</small> | ◎<br><small>詳細なコード解析</small> | ◎<br><small>高速なSAST</small> |
| **プラットフォーム** | GitHub連携 | ◎<br><small>専用ツール</small> | ◯<br><small>複数対応</small> | ◯<br><small>複数対応</small> | ◯<br><small>複数対応</small> |
| **非機能要件** | AI・MCP連携 | ◎<br><small>MCPサーバー内蔵</small> | △<br><small>機能なし</small> | △<br><small>独自AI連携</small> | △<br><small>独自AI機能</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **GitHub Quick Review** | GitHub専用の設定・セキュリティ監査ツール | MCP連携によるAI親和性、GitHub特有の項目に強い | ソースコード自体の脆弱性スキャンはできない | GitHub組織全体のポリシーやセキュリティ設定を監査・是正したい場合 |
| **Legitify** | オープンソースのSCMセキュリティスキャナー | GitHubとGitLabの両方に対応、修復手順を提供 | 商用版(Legit Security)への誘導的側面あり | GitHubとGitLabが混在する環境のポリシー監査 |
| **SonarQube** | 定番のコード品質・セキュリティプラットフォーム | 言語対応が豊富、PRレビューとの統合 | インフラやSCM設定自体の監査には不向き | 開発時のコード品質向上とSASTを中心にしたい場合 |
| **Semgrep** | 高速な軽量静的コード解析ツール | CI/CDに組み込みやすく独自ルールの作成が容易 | GitHubの設定やポリシー監査は対象外 | CI/CDパイプライン上でコードの脆弱性を高速に検知したい場合 |

## **17. 総評**

* **総合的な評価**:
  GitHub Quick Review (ghqr)は、GitHubを基盤とする組織にとって、セキュリティポスチャとベストプラクティスへの準拠状況を可視化する非常に強力なツールである。静的コード解析ではなく、リポジトリや組織の「設定ミス」や「セキュリティ機能の有効化漏れ」を検知することに特化しており、かゆいところに手が届く設計となっている。特にMCPサーバーを内蔵している点はモダンであり、CopilotなどのAIを通じた対話的な運用を可能にしている。
* **推奨されるチームやプロジェクト**:
  多数のリポジトリや複数のOrganizationを管理する企業、プラットフォームエンジニアリングチーム、セキュリティ監査部門に強く推奨される。
* **選択時のポイント**:
  ソースコードの脆弱性（SAST）や依存関係の脆弱性（SCA）を見つけるSonarQubeやSemgrepなどのツールと**競合するものではなく、補完関係にある**。SCM基盤（GitHub自体）のセキュリティ設定の網羅的チェックを行いたい場合は、ghqrやLegitifyの導入が最適解となる。GitLabなども併用している場合はLegitifyが有力な代替となるが、GitHub専業であればghqrがファーストチョイスとなる。
