---
# === フロントマター ===
# 【必須項目】
title: "AWS CLI 調査レポート"
tool_name: "AWS CLI"
tool_reading: "エーダブリューエス シーエルアイ"
category: "インフラ/クラウド"
developer: "Amazon Web Services"
official_site: "https://aws.amazon.com/jp/cli/"
date: "2026-04-18"
last_updated: "2026-04-18"
tags:
  - "AWS"
  - "クラウド"
  - "CLI"
  - "オープンソース"
  - "自動化"
description: "コマンドラインからAWSサービスを管理し、スクリプトを使用して自動化できる統合ツール。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "DevOpsエンジニア"
    - "システム管理者"
  latest_highlight: "AWS Interconnectなど新サービス対応やパフォーマンス向上"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 93
  base_score: 70
  plus_points:
    - point: 10
      reason: "AWSサービスを網羅する公式の強力なCLIツール"
    - point: 5
      reason: "オープンソースであり活発な開発・更新（高頻度なリリース）"
    - point: 5
      reason: "スクリプト自動化、コマンド補完など生産性向上の機能が豊富"
    - point: 3
      reason: "無料で使用でき、追加コストなし"
  minus_points: []
  summary: "AWS環境を運用・自動化する上で必須となる、非常に強力で洗練された公式コマンドラインツール"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/aws/aws-cli"
  deepwiki: "https://deepwiki.com/aws/aws-cli"
  documentation: "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html"
relationships:
  related_tools:
    - "AWS CloudFormation"
    - "AWS DevOps Agent"
    - "AWS MCP Servers"
    - "AWS Security Hub"
---

# **AWS CLI 調査レポート**

## **1. 基本情報**

* **ツール名**: AWS CLI
* **ツールの読み方**: エーダブリューエス シーエルアイ
* **開発元**: Amazon Web Services
* **公式サイト**: [https://aws.amazon.com/jp/cli/](https://aws.amazon.com/jp/cli/)
* **関連リンク**:
  * GitHub: [https://github.com/aws/aws-cli](https://github.com/aws/aws-cli)
  * ドキュメント: [https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
* **カテゴリ**: インフラ/クラウド
* **概要**: AWS コマンドラインインターフェイス (AWS CLI) は、AWSのサービスを管理するための統合ツールです。ダウンロードおよび設定用の単一のツールのみを使用して、コマンドラインから AWSの複数のサービスを制御し、スクリプトを使用してこれらを自動化することができます。

## **2. 目的と主な利用シーン**

* **解決する課題**: ブラウザベースのAWSマネジメントコンソールを使わずに、ターミナルから直接AWSサービスを操作・自動化したいというニーズに対応。
* **想定利用者**: 開発者、DevOpsエンジニア、インフラストラクチャ管理者。
* **利用シーン**:
  * サーバーのプロビジョニングや設定の自動化スクリプトへの組み込み
  * CI/CDパイプラインでのAWSリソースのデプロイメント
  * 日常的なS3バケットへのファイル同期やEC2インスタンスの管理

## **3. 主要機能**

* **統合されたサービス管理**: 一つのツール（`aws`コマンド）で、EC2、S3、IAMなどほぼ全てのAWSサービスを制御可能。
* **コマンド補完**: Tabキーを使用して部分的に入力されたコマンドやリソース名（DynamoDBテーブル名、IAMユーザー名など）を補完する機能。
* **自動プロンプト**: コマンド、パラメータ、リソースなどのプロンプトを表示し、対話的にコマンドを組み立てる機能。
* **SSOログイン機能**: `aws login` CLI コマンドにより、既存のコンソール認証情報を使用してAWSにプログラムでアクセス。
* **コマンド履歴**: `aws history` コマンドで過去の実行履歴を確認・表示。
* **JSON/YAML出力**: 実行結果のフォーマットをJSON、YAML、テキスト、テーブル形式で出力可能。
* **高レベルS3コマンド**: `aws s3 sync` などの複雑な操作を簡素化するコマンド群。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * AWSアカウント
  * アクセスキーIDとシークレットアクセスキー（またはIAMロール/SSO環境）
* **インストール/導入**:

  ```bash
  # Linux x86-64 executable installer の例
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  ```

* **初期設定**:
  * `aws configure` コマンドを実行し、アクセスキー、シークレットキー、デフォルトリージョン、出力フォーマットを設定します。
* **クイックスタート**:
  * インストール後、バージョン確認と簡単なS3リストコマンドで動作確認が可能です。
  ```bash
  aws --version
  aws s3 ls
  ```

## **5. 特徴・強み (Pros)**

* **高い網羅性**: AWSの新サービスや機能がリリースされると、迅速にCLIにも対応が追加されます。
* **スクリプト親和性**: JSON出力と `jq` や内蔵の `--query`（JMESPath）を組み合わせることで、複雑な自動化スクリプトを容易に作成できます。
* **認証の柔軟性**: 環境変数、設定ファイル、EC2インスタンスメタデータ（IAMロール）、AWS SSOなど、多様な認証方式をサポート。
* **マルチプラットフォーム**: Windows, macOS, Linuxのすべてで一貫したエクスペリエンスを提供。

## **6. 弱み・注意点 (Cons)**

* **学習曲線**: AWSの各サービスの概念とAPIモデルを理解している必要があるため、AWS初心者にはコマンドの組み立てが難しく感じられる場合があります。
* **出力形式の理解**: 複雑なJSON応答を解析するために、JMESPath（`--query`オプション）の構文を学ぶ必要があります。
* **v1とv2の非互換性**: AWS CLI v1とv2では一部動作が異なるため、移行時には注意が必要です。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **完全無料** | 無料 | AWS CLIツール自体の利用は完全無料（※ただし、操作したAWSサービス自体の利用料は発生します） |

* **課金体系**: ツールは無料。呼び出したAWSサービスの料金規定に従う。
* **無料トライアル**: AWS自体の無料枠（Free Tier）を利用可能。

## **8. 導入実績・事例**

* **導入企業**: AWSを利用している世界中の数百万の企業や開発者。
* **導入事例**: AWSインフラストラクチャのIaC（Infrastructure as Code）化、CI/CDパイプライン（GitHub Actions, GitLab CIなど）におけるAWSリソース操作など、広範に利用されています。
* **対象業界**: クラウドインフラを利用するすべての業界（IT、金融、ヘルスケア、スタートアップなど）。

## **9. サポート体制**

* **ドキュメント**: [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/) および [Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html) が非常に充実しています。
* **コミュニティ**: [GitHub Repository](https://github.com/aws/aws-cli) でのIssue報告、Stack Overflow (`aws-cli`タグ)、AWS re:Postなどの活発なコミュニティ。
* **公式サポート**: AWSのサポートプランに加入している場合、AWSサポートから公式なサポートを受けることができます。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: 本ツール自体がAWSの各種APIをラップするインターフェースです。
* **外部サービス連携**: 各種CI/CDツール（Jenkins, GitHub Actions, GitLab CI/CD, CircleCIなど）とシームレスに連携。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Bash/Shell Script** | ◎ | コマンドラインツールとして設計されており、シェルスクリプトとの相性が最高。 | 複雑なロジックはシェルスクリプトだと可読性が下がる。 |
| **Python** | ◎ | Pythonベース（boto3）で開発されており、Python環境での連携も容易。 | AWS SDK for Python (Boto3) を直接使う方が良いケースもある。 |
| **CI/CDツール (GitHub Actions等)** | ◎ | 公式アクションやコンテナイメージが提供されており、組み込みが容易。 | 認証情報の安全な管理（OIDC連携など）を適切に行う必要がある。 |
| **Docker** | ◎ | 公式のDockerイメージ（`amazon/aws-cli`）が提供されている。 | コンテナサイズや不要な依存関係の整理が必要な場合がある。 |

## **11. セキュリティとコンプライアンス**

* **認証**: IAMユーザー認証、AWS SSO (IAM Identity Center)、一時的認証情報 (STS)、EC2/ECS IAMロールなど、AWSの強力なセキュリティモデルを完全にサポート。
* **データ管理**: CLI自体はクライアント側ツールであり、データはユーザー環境とAWS間で直接通信されます。
* **準拠規格**: AWS CLIはAWSのサービスと通信するため、AWS自体の各種コンプライアンス（SOC、ISO、HIPAA、GDPR等）の枠組みの中で利用されます。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: v2から導入された自動プロンプト（`--cli-auto-prompt`）により、対話型でのコマンド入力が可能になり、UXが大幅に向上しました。
* **学習コスト**: AWSの基本概念を理解していれば、`aws [service] help` コマンドを活用することで容易に学習できますが、複雑なJMESPathクエリの習得には少し時間がかかります。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **AWS SSOの利用**: 長期的なアクセスキー（IAMユーザー）の代わりに、AWS IAM Identity Center (SSO) と連携して短期クレデンシャルを利用する。
  * **JMESPathの活用**: `--query` パラメータを使用して、サーバー側でJSON出力をフィルタリングし、必要なデータだけを取得する。
  * **自動プロンプト**: 使い慣れないコマンドは `aws [command] --cli-auto-prompt` で対話的に組み立てる。
* **陥りやすい罠 (Antipatterns)**:
  * **アクセスキーのハードコード**: スクリプト内にアクセスキーをハードコードすることは重大なセキュリティリスク。環境変数やIAMロールを使用するべき。
  * **ページネーションの無視**: 一部のコマンドは結果をページネーション（分割）して返すため、すべての結果を取得していないのに処理を進めてしまう。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub, 開発者ブログ, Stack Overflow
* **総合評価**: クラウドCLIのデファクトスタンダードとして圧倒的な支持。（公式GitHubリポジトリのStar数：16k以上）
* **ポジティブな評価**:
  * "AWSのあらゆる操作がコマンドラインから可能になり、自動化に不可欠。"
  * "v2の自動プロンプトやSSO統合が非常に便利。"
  * "ドキュメントが充実しており、トラブルシューティングがしやすい。"
* **ネガティブな評価 / 改善要望**:
  * "一部のサービスのコマンド体系が他と異なり、一貫性に欠ける場合がある。"
  * "出力のJSONをパースするためのJMESPathの学習が面倒。"
  * "v1からv2への移行時に破壊的変更があり、スクリプトの修正が必要だった。"
* **特徴的なユースケース**:
  * ローカルのDockerコンテナ内からホストのIAMロールを借用して安全にAWSリソースにアクセスする構成。

## **15. 直近半年のアップデート情報**

* **2024-11-26**: `AWS CLI 2.0.0dev preview release` - AWS CLI v2の最初の開発者プレビューがリリースされ、リソース値の自動補完や自動プロンプト（ウィザード）、SSO連携の強化などが発表されました。（※過去の大きなマイルストーンとして記載）
* **2024-03-XX**: 各種新サービス（Clean Rooms, Ground Station, Interconnect等）への対応を順次追加。
* **2024-02-XX**: セキュリティアップデート（OpenSSLバンドルの更新）およびPython 3.14への対応準備。
* **頻繁な更新**: ほぼ毎日のように、AWSのAPI変更に追従するためのマイナーリリース（例：2.34.xシリーズ）が行われています。

(出典: [GitHub Releases](https://github.com/aws/aws-cli/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | AWS CLI | AWS CloudShell | Terraform/CloudFormation | AWS Tools for PowerShell |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | AWS操作網羅性 | ◎<br><small>ほぼ全API対応</small> | ◎<br><small>CLI組み込み済み</small> | ◯<br><small>IaC特化</small> | ◎<br><small>PowerShell向け</small> |
| **環境** | ローカル実行 | ◎<br><small>全OS対応</small> | ×<br><small>ブラウザ上のみ</small> | ◎<br><small>全OS対応</small> | ◯<br><small>Windows親和性高</small> |
| **非機能要件** | 状態管理 (State) | ×<br><small>コマンド実行のみ</small> | ×<br><small>コマンド実行のみ</small> | ◎<br><small>状態を管理し差分適用</small> | ×<br><small>コマンド実行のみ</small> |
| **自動化** | スクリプト親和性 | ◎<br><small>シェルスクリプト最適</small> | ◯<br><small>一時環境</small> | ◎<br><small>宣言的IaC</small> | ◎<br><small>PSスクリプト</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **AWS CLI** | 公式の汎用コマンドラインツール | 汎用性が高く、軽量。シェルスクリプトと相性が良い。 | 状態管理ができない（冪等性の担保は自己責任）。 | 単発の作業自動化、CI/CDパイプライン、ファイル同期（S3）。 |
| **AWS CloudShell** | ブラウザベースのコンソール環境 | 環境構築不要、認証済み状態で即座にCLIを利用可能。 | セッションが一時的であり、ローカルスクリプトの本格的な開発には不向き。 | 手軽に少しだけAWSリソースを確認・操作したい場合。 |
| **AWS CloudFormation / Terraform** | 宣言的なInfrastructure as Code | インフラの状態管理（State）ができ、冪等性が担保される。 | 単発の簡単な操作（例: EC2の再起動）には大げさ。 | 複雑なインフラのプロビジョニングや構成管理を行う場合。 |
| **AWS Tools for PowerShell** | PowerShell用のモジュール | Windows環境やPowerShellのオブジェクト指向パイプラインと高い親和性。 | Linux/macOSユーザーにはBash/CLIほど馴染みがない。 | Windows管理者やPowerShellを標準として使用しているチーム。 |

## **17. 総評**

* **総合的な評価**:
  AWS CLIは、AWSを利用するすべての開発者およびシステム管理者にとって、必須のツールです。v2へのアップデートにより、対話型プロンプトやSSO統合が改善され、使い勝手がさらに向上しました。オープンソースとして頻繁に更新されており、AWSの最新機能に即座に対応できる点が強みです。
* **推奨されるチームやプロジェクト**:
  * AWSをクラウド基盤として利用しているすべてのチーム。
  * CI/CDパイプラインを構築・運用するDevOpsチーム。
  * インフラのプロビジョニングや日々の運用作業を自動化したいシステム管理者。
* **選択時のポイント**:
  インフラストラクチャ全体を構築・管理する場合は、TerraformやAWS CloudFormationなどのIaCツールの使用を優先すべきです。しかし、IaCツールの機能でカバーしきれない操作や、CI/CDパイプライン内での単発のスクリプト実行、S3のファイル同期などにおいては、AWS CLIが最適かつ不可欠な選択肢となります。
