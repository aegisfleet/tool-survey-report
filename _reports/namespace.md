---
title: Namespace 調査レポート
tool_name: Namespace
tool_reading: ネームスペース
category: CI/CDプラットフォーム
developer: Namespace Labs, Inc.
official_site: https://namespace.so/
date: '2026-07-31'
last_updated: '2026-07-31'
tags:
  - CI/CD
  - SaaS
  - クラウド
  - テスト用インフラ
  - 開発者ツール
description: AI開発やCI/CDを高速化するための、高性能なクラウド開発環境およびビルド基盤
quick_summary:
  has_free_plan: true
  is_oss: false
  starting_price: 無料
  target_users:
    - 開発者
    - 開発チーム
  latest_highlight: 2026年7月29日にWindowsランナー向けのキャッシュボリュームが利用可能になった
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: GitHub ActionsやDockerビルドなどのCI/CDを劇的に高速化する
    - point: 5
      reason: キャッシュボリュームやTurborepo、Bazelとの統合による高度なキャッシング
    - point: 5
      reason: macOS、Windows、Linuxなど複数プラットフォームにネイティブ対応
    - point: 5
      reason: DevboxesやRemote Buildersなど開発プロセス全体をカバーする機能が豊富
  minus_points:
    - point: -3
      reason: 高度な機能の利用にはプランや料金の検討が必要
    - point: -2
      reason: UIやドキュメントが英語中心
  summary: CI/CDの高速化とクラウド開発環境の効率化において非常に強力なプラットフォーム。
links:
  github: https://github.com/namespacelabs
  documentation: https://namespace.so/docs
relationships:
  related_tools:
    - GitHub Actions
    - Docker
    - Kubernetes
---

# **Namespace 調査レポート**

## **1. 基本情報**

* **ツール名**: Namespace
* **ツールの読み方**: ネームスペース
* **開発元**: Namespace Labs, Inc.
* **公式サイト**: [https://namespace.so/](https://namespace.so/)
* **関連リンク**:
  * GitHub: [https://github.com/namespacelabs](https://github.com/namespacelabs)
  * ドキュメント: [https://namespace.so/docs](https://namespace.so/docs)
* **カテゴリ**: CI/CDプラットフォーム
* **概要**: AIエージェント向けのクラウド開発環境(Devboxes)や、GitHub ActionsなどのCI/CD、Dockerビルドを高速化する専用のコンピュートプラットフォームです。

## **2. 目的と主な利用シーン**

* **解決する課題**: CI/CDのビルド時間やテスト時間の長期化、ローカル開発環境のセットアップの手間やリソース不足を解消する。
* **想定利用者**: ソフトウェアエンジニア、プラットフォームエンジニア、DevOpsチーム、AI開発者
* **利用シーン**:
  * GitHub Actionsの実行環境をNamespaceのランナーに置き換え、ビルド時間を短縮する。
  * ローカル環境からシームレスにアクセス可能な高性能クラウド開発環境（Devbox）を利用する。
  * DockerやBazelのビルドを高速なリモートビルダーで並列・高速処理する。

## **3. 主要機能**

* **GitHub Actions Runners**: GitHub Actionsのドロップインリプレイスメントとして動作し、Mac/Windows/Linuxに対応した高速なランナーを提供。
* **Devboxes**: AIコーディングエージェントや開発者向けの、即座に起動するクラウド開発環境（VS Code, JetBrains Gateway, SSH対応）。
* **高速なリモートキャッシング**: Bazelリモートキャッシュ、Turborepoキャッシュ、Dockerレイヤーのクロスインボケーションキャッシュを提供。
* **Docker Builders**: Namespaceのリモートコンピュートを使用した高性能なDockerイメージビルド。
* **マルチプラットフォームコンピュート**: Apple Silicon (M5/M4/M2)、Windows、Linux ARM64/AMD64の各インスタンスを提供。
* **ネットワークポリシー管理**: イグレス（外部送信）フィルタリングなど、Devboxやランナーのネットワークアクセス制御。
* **統合ダッシュボード**: ワークスペースの利用状況（CPU、メモリ、ネットワーク）、ジョブのインサイト、監査ログの可視化。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: クラウド完結型のコンピュートプラットフォーム
* **主要コンポーネントとデータフロー**:
  * コントロールプレーンがユーザーの要求に応じて数秒で仮想マシン（Linux、macOS、Windows）をプロビジョニング。
  * コンピュートノードには専用のNVMeストレージが直結されており、依存関係やキャッシュ（Cache Volumes）、アーティファクトへの低遅延・高スループットなアクセスを実現。
  * OIDC（OpenID Connect）を利用してGitHub ActionsやAWS、GCP等の外部サービスとセキュアにフェデレーションし、認証情報を保持せずに一時トークンで通信。
* **特筆すべき要素技術**:
  * 動的データパイプライン技術によるベースイメージのオンデマンドフェッチ（ランナーの高速起動）。
  * 1スレッドあたり1Gbps以上が保証された高速ネットワーキング。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * GitHubアカウントでのログイン、またはSAML SSOによるサインイン
* **インストール/導入**:
  * Namespace CLI (`nsc`) のインストール:
  ```bash
  npm install -g @namespacelabs/cli
  ```
* **初期設定**:
  * CLIでのログイン: `nsc login`
  * GitHub Actionsの連携: ダッシュボードからGitHubリポジトリへのアクセスを許可。
* **クイックスタート**:
  * GitHub Actionsの `runs-on` をNamespaceのプロファイル（例: `namespace-profile-default`）に変更するだけで実行可能。

## **6. 特徴・強み (Pros)**

* NVMeストレージと高速ネットワーク（1Gbps/スレッド）に裏打ちされた、他社を圧倒するビルド・実行速度。
* macOS（Apple Silicon）、Windows、Linuxの全OSに一元的に対応し、CI/CD基盤を統合できる。
* 設定が極めてシンプルであり、GitHub Actionsの場合は `runs-on` の変更などわずか数行の修正で導入可能。
* Breakpoint Actionなど、CI環境の一時停止・SSHデバッグといった高度なトラブルシューティング機能を標準搭載。

## **7. 弱み・注意点 (Cons)**

* ダッシュボードや公式ドキュメント、サポートはすべて英語であり、日本語対応していない。
* 大規模並列実行や巨大なマシンシェイプ（例: 64 vCPU〜）を活用する場合、料金が従量課金で大きく跳ね上がる可能性がある。
* 独自の機能（Devboxや特定のキャッシュ機構）への依存度が上がると、他のプラットフォームへの移行コストが高くなる。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Developer** | 従量課金 ($0/月) | 基本的なCI/CDランナー、Devbox、プラットフォーム機能へのアクセス。ユニット時間やストレージは利用分のみ支払い。 |
| **Team** | $100/月 | 100,000ユニット時間/月が含まれ、Windowsランナーの利用も可能。小〜中規模チーム向け。 |
| **Business** | $250/月 | 250,000ユニット時間/月が含まれ、大規模シェイプやBazelキャッシュ、RBAC、Slackサポートが付属。 |
| **Enterprise** | カスタム | SSO、カスタムログ/メトリクスエクスポート、高メモリインスタンスなど、エンタープライズ向けの高度な機能とボリュームディスカウント。 |

* **課金体系**: 従量課金制（ユニット時間 = 1 vCPU + 2 GB RAM を1分間実行。Linuxは1倍、Windowsは2倍、macOSは10倍などプラットフォームごとの乗数あり）
* **無料トライアル**: 新規サインアップ時にComputeやDevbox等の30日間無料トライアルあり（クレジットカード不要）。

## **9. 導入実績・事例**

* **導入企業**: Warp, Ghostty, fal.ai, Framer, Ramp, Shaped, Dfinity
* **導入事例**:
  * **Warp**: CIや独自のクラウドエージェントプラットフォームをNamespaceで実行し、パフォーマンスを大幅改善。
  * **Shaped**: GitHub Actionsで2行のYAML変更のみでビルド時間を87%削減。
  * **Dfinity**: Namespaceのインフラ導入によりビルド時間が90%短縮され、メンテナンスのオーバーヘッドがゼロに。
* **対象業界**: 最新のAI・開発者ツール企業、フィンテック、Web3関連企業などスピードを重視するソフトウェア企業全般。

## **10. サポート体制**

* **ドキュメント**: [Namespace Documentation](https://namespace.so/docs)（詳細なCLIリファレンス、API連携ガイド、アーキテクチャ解説を含む）
* **コミュニティ**: Discordサーバーあり。
* **公式サポート**: メール(`support@namespace.so`)による直接サポート。Businessプラン以上は専用Slackチャンネルを通じたエンジニアの直接サポートを提供。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: ワークスペースやインスタンス、コンテナレジストリ、キャッシュなどをプログラムから操作できるgRPCベースのAPI/SDKを提供。
* **外部サービス連携**: GitHub Actions, GitLab CI/CD, CircleCI, Buildkite, AWS (Cognito等連携), GCP, Docker, Kubernetes, Slackなど。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **GitHub Actions** | ◎ | ドロップインでランナーを置き換え可能、キャッシュアクションも公式提供。 | 特になし |
| **Docker / Buildx** | ◎ | リモートビルダーを用いた高速ビルドとレジストリへのシームレスなプッシュが可能。 | 特になし |
| **Bazel / Turborepo** | ◎ | ネイティブなリモートキャッシュ対応による劇的なビルド高速化。 | Businessプラン以上または追加課金が必要な場合あり |
| **Playwright / E2Eテスト** | ◯ | 高並列な環境とキャッシングでブラウザテストを高速化。 | 大量のリソース消費に注意 |

## **12. セキュリティとコンプライアンス**

* **認証**: OIDCフェデレーション対応、SAML SSO対応（Enterpriseプラン）。RBAC（ロールベースアクセス制御）による権限管理。
* **データ管理**: インスタンス間のVPCによるネットワーク隔離、テナントごとの暗号化キーを用いたVault（シークレット管理）。
* **準拠規格**: SOC2取得済み。Trust Centerにてレポートやサブプロセッサ情報を公開。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: ダッシュボードはモダンかつ直感的で、ジョブの実行時間やリソースの消費量（CPU、メモリ、ネットワーク）、キャッシュのヒット率などを視覚的に把握しやすい。
* **学習コスト**: GitHub Actions等の既存のCI/CD利用経験があれば導入は極めて簡単（数行のYAML変更のみ）。ただし、CLI（`nsc`）やAPIを通じた高度な環境構築・プロファイリングの活用には、公式英語ドキュメントの理解が必要。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **AIエージェントの安全な実行**: Devboxとイグレス（外部送信）フィルタリングを組み合わせることで、Claudeや独自AIエージェントが実行するコードの通信先を安全なドメインのみに制限する。
  * **Cache Volumesの活用**: ビルドやテスト時に生成される中間ファイルや依存関係（npm, pip, Gradle等）を専用の高速ボリュームに保存し、次回以降の実行時間を短縮する。
* **陥りやすい罠 (Antipatterns)**:
  * **過剰なシェイプの選択**: 必要以上の巨大なマシンシェイプ（例: 64 vCPUなど）を常時選択するとコストが跳ね上がる。適切なプロファイリングを行い、リソース消費に見合ったシェイプを選択すること。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: 公式サイトの導入事例、X(Twitter)、Reddit
* **総合評価**: レビューサイトのスコアは不明だが、開発者コミュニティで高く評価されている。
* **ポジティブな評価**:
  * 「CIのビルド時間が劇的に短縮され、開発体験が飛躍的に向上した。」
  * 「2行のYAML変更だけで済むため、既存のワークフローへの統合が驚くほど簡単。」
  * 「サポートチームの対応が迅速で、直接エンジニアとやり取りできるのが素晴らしい。」
* **ネガティブな評価 / 改善要望**:
  * 「独自のDevboxや高速なランナーは魅力的だが、個人開発や小規模プロジェクトにはオーバースペックでコストが見合わない場合がある。」（Redditより要約）
* **特徴的なユースケース**:
  * 大規模なRustやC++プロジェクトのコンパイル時間を、BazelリモートキャッシュやsccacheとNamespaceの巨大インスタンスを組み合わせて数分から数十秒に短縮。

## **16. 直近半年のアップデート情報**

* **2026-07-29**: Windowsランナー向けにキャッシュボリューム機能を提供開始。
* **2026-07-28**: Windowsランナー向けにブレークポイント（CI一時停止・デバッグ機能）をサポート。
* **2026-07-15**: 64 vCPU（最大512GBメモリ）のLinux AMD64大容量マシンシェイプの提供を開始。
* **2026-06-19**: ネットワークのイグレス（外部送信）トラフィックをUI上で可視化し、通信先ドメインを分析可能に。
* **2026-06-11**: Devboxのタグベースのリース機能（`acquire` / `release`）を追加し、エージェントの連続タスク処理における環境の再利用を最適化。
* **2026-05-20**: AnthropicのClaude Managed AgentsをDevbox上で安全に実行するための統合機能を提供。

(出典: [Namespace Changelog](https://namespace.so/changelog))

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Namespace | GitHub Actions | GitLab CI/CD | CircleCI |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | CI/CDランナー実行 | ◎<br><small>Mac/Win/Linuxで超高速</small> | ◯<br><small>標準的な速度</small> | ◯<br><small>標準的な速度</small> | ◯<br><small>リソースクラスで調整可</small> |
| **環境構築** | クラウド開発環境 | ◎<br><small>Devboxes機能</small> | ◯<br><small>Codespaces</small> | ◯<br><small>Workspaces</small> | ×<br><small>CI特化</small> |
| **パフォーマンス** | ビルドキャッシュ | ◎<br><small>NVMe直結ボリューム</small> | △<br><small>ネットワーク転送発生</small> | △<br><small>ネットワーク転送発生</small> | ◯<br><small>Dockerレイヤーキャッシュ等</small> |
| **エンタープライズ** | SSO/RBAC | ◯<br><small>Enterprise/Business</small> | ◎<br><small>Enterpriseで完備</small> | ◎<br><small>標準機能として豊富</small> | ◎<br><small>詳細な権限管理</small> |
| **非機能要件** | 日本語対応 | ×<br><small>英語のみ</small> | ◎<br><small>UI/ドキュメント充実</small> | ◎<br><small>UI/ドキュメント充実</small> | ◯<br><small>一部日本語対応</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Namespace** | 高速な実行環境の提供に特化したプラットフォーム | 圧倒的なビルド速度、簡単な導入、Devbox等の開発者体験の高さ | 日本語未対応、依存度が高まると移行しづらい | CI/CDの遅延が開発のボトルネックになっており、速度を金で解決したい場合 |
| **GitHub Actions** | GitHubネイティブの標準CI/CD | エコシステムが巨大、設定が容易 | デフォルトランナーの速度やキャッシュI/Oに限界がある | GitHubでコード管理しており、標準的なCI/CDで事足りる場合 |
| **GitLab CI/CD** | GitLabに統合された強力なCI/CD | パイプラインの柔軟性、DevSecOps機能の充実 | GitLabへの依存、Runnerの自己ホスト運用コスト | GitLabプラットフォームを全社で採用している場合 |
| **CircleCI** | 高速で柔軟なCI/CDサービス | Orbによる設定の再利用、豊富なリソースクラス | 独自の設定記法、料金体系が複雑 | 複数のVCSを利用し、専用の高度なCI基盤を構築したい場合 |

## **18. 総評**

* **総合的な評価**:
  * Namespaceは、ソフトウェア開発における「待ち時間」を極限まで削減することにフォーカスした、次世代のコンピュートプラットフォームです。GitHub Actionsへのドロップイン対応や、ローカルボリュームを利用した爆速のキャッシュ機構など、開発者の生産性を最大化するための機能が緻密に作り込まれています。AIエージェントの安全なサンドボックスとしてのDevboxも、今後のAI主導の開発ワークフローにおいて重要な役割を果たすでしょう。
* **推奨されるチームやプロジェクト**:
  * CI/CDのビルドやテスト時間が10分以上かかっており、フィードバックループの遅さが課題となっている中〜大規模開発チーム。
  * 頻繁にDockerイメージをビルドするプロジェクトや、巨大なモノレポ（TurborepoやBazelを利用）を運用するチーム。
  * 自律型AIエージェントを安全かつ分離された環境で実行・検証したいAIツール開発企業。
* **選択時のポイント**:
  * 現在のCI/CD環境（GitHub Actionsなど）を使い続けながら、ランナーのスペックやキャッシュ速度だけを強化したい場合に最適な選択肢となります。ただし、コストは従量制で利用量に応じて変動するため、プロファイリング機能を用いて適切なマシンシェイプを選択する運用管理が求められます。
