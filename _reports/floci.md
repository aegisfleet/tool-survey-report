---
title: Floci 調査レポート
tool_name: Floci
tool_reading: フロキ
category: ☁️ インフラ/クラウド
developer: Floci コミュニティ
official_site: https://floci.io/
date: '2026-05-13'
last_updated: '2026-05-13'
tags:
  - AWS
  - テスト自動化
  - オープンソース
  - 開発者ツール
  - クラウド
  - ローカル環境
description: アカウント不要・完全無料で利用できる、高速かつ軽量なローカルAWSエミュレーター
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - バックエンド開発者
    - クラウドエンジニア
    - DevOpsエンジニア
  latest_highlight: Lambda、RDS、ECSなどのDocker統合強化を含むv1.5.15をリリース
  update_frequency: 高
evaluation:
  score: 92
  base_score: 70
  plus_points:
    - point: 6
      reason: LocalStack Communityの有償化・制限強化に対する完全無料の代替手段として強力
    - point: 5
      reason: Dockerを用いた実エンジンの統合（PostgreSQL, Kafkaなど）により本番環境との差異が少ない
    - point: 5
      reason: 起動が約24msと非常に高速で、コンテナのフットプリントも小さい
    - point: 3
      reason: Testcontainersに標準対応しており、テスト自動化に組み込みやすい
    - point: 3
      reason: マルチアカウント分離に標準で対応
  minus_points:
    - point: 0
      reason: ''
  summary: 無料で使えるLocalStack代替として、実エンジン連携による高精度なエミュレーションと軽量さを両立した最注目のAWSエミュレーター。
links:
  github: https://github.com/floci-io/floci
  deepwiki: https://deepwiki.com/floci-io/floci
  codewiki: https://codewiki.google/github.com/floci-io/floci
  documentation: https://floci.io/
relationships:
  parent: ''
  children: []
  related_tools:
    - LocalStack
    - fakecloud
---

# **Floci 調査レポート**

## **1. 基本情報**

* **ツール名**: Floci
* **ツールの読み方**: フロキ
* **開発元**: Floci コミュニティ
* **公式サイト**: [https://floci.io/](https://floci.io/)
* **関連リンク**:
  * GitHub: [https://github.com/floci-io/floci](https://github.com/floci-io/floci)
  * DeepWiki: [https://deepwiki.com/floci-io/floci](https://deepwiki.com/floci-io/floci)
  * CodeWiki: [https://codewiki.google/github.com/floci-io/floci](https://codewiki.google/github.com/floci-io/floci)
  * ドキュメント: [https://floci.io/](https://floci.io/)
* **カテゴリ**: ☁️ インフラ/クラウド
* **概要**: LocalStackの代替として開発された、完全無料・オープンソースのローカルAWSエミュレーター。実際のDockerコンテナを利用して各種AWSサービスを高い再現度でエミュレートし、アカウント認証やトークン不要で利用できる。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * LocalStack Community版における機能制限やアカウント登録の必須化（2026年3月以降）への対応
  * モックベースのエミュレーターにおける、本番環境（データベース、メッセージブローカー等）との挙動の乖離
  * CI/CD環境でのAWSエミュレーターの起動遅延とリソース消費
* **想定利用者**:
  * AWSを利用するバックエンド開発者・インフラエンジニア
  * 自動テスト（CI/CD）のパイプラインを構築するDevOpsエンジニア
* **利用シーン**:
  * **ローカルでのAWSアプリ開発**: S3、SQS、DynamoDB、Lambdaなどを用いたアプリケーションの動作確認
  * **CI/CDでの自動テスト**: Testcontainersを利用して、テスト毎にクリーンなAWS環境を瞬時に立ち上げ、統合テストを実施
  * **マルチテナント・複数アカウントテスト**: 12桁のAWSアカウントIDに基づき、リソースが完全に分離される性質を活かしたマルチアカウント環境のテスト

## **3. 主要機能**

* **広範なAWSサービスのサポート**: S3, SQS, DynamoDB, Lambda, API Gateway v2, EC2, ECS, EKS, RDS, MSKなど、47種類のAWSサービスをエミュレート。
* **実Dockerエンジンの統合**: Lambda、RDS（PostgreSQL/MySQL）、ElastiCache（Redis）、MSK（Kafka）などはモックではなく実際のDockerコンテナを立ち上げて動作させるため、本番互換性が高い。
* **IAM・SigV4認証の再現**: RDSやElastiCacheなどのコンテナサービスに対しても、実環境と同じIAM認証（SigV4）を用いた接続検証が可能。
* **柔軟なストレージモード**: 用途に応じて、`memory`（オンメモリ/CI向け）、`persistent`（永続化）、`hybrid`（非同期フラッシュ）、`wal`（高耐久ログ）の4つのストレージモードを選択可能。
* **Testcontainersの公式サポート**: Java、Node.js、Python向けに公式のTestcontainersモジュールを提供（Go言語向けも開発中）。
* **マルチアカウント分離機能**: リクエストに含まれるアクセスキーを自動的にアカウントIDとして認識し、アカウント毎にリソース名前空間を完全に分離。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Dockerのインストール
* **インストール/導入**:

  `docker-compose.yml` を作成し、以下のように記述する：

  ```yaml
  services:
    floci:
      image: floci/floci:latest
      ports:
        - "4566:4566"
      volumes:
        - ./data:/app/data
        # Lambdaなどのコンテナ実行サービスを利用する場合はDockerソケットのマウントが必要
        - /var/run/docker.sock:/var/run/docker.sock
  ```

* **初期設定**:
  * 特に設定ファイルやAPIキーは不要。
* **クイックスタート**:
  ```bash
  docker compose up -d
  ```
  起動後、AWS CLIやSDKのエンドポイントを `http://localhost:4566` に向けるだけで利用可能。
  ```bash
  export AWS_ENDPOINT_URL=http://localhost:4566
  export AWS_DEFAULT_REGION=us-east-1
  export AWS_ACCESS_KEY_ID=test
  export AWS_SECRET_ACCESS_KEY=test

  aws s3 mb s3://my-bucket
  ```

## **5. 特徴・強み (Pros)**

* **LocalStackとのドロップイン互換性**: エンドポイント（4566ポート）や初期化スクリプトのディレクトリ構成（`/_localstack/init`）が互換となっており、イメージを差し替えるだけでLocalStackから簡単に移行できる。
* **高再現度なコンテナ統合**: データベース（RDS）やキャッシュ（ElastiCache）、Kafka（MSK）などは、モックではなく実際のエンジン（PostgreSQL, MySQL, Valkey, Redpanda等）をDocker上で起動するため、SQLの方言や特定機能の互換性を心配する必要がない。
* **完全無料で制限なし**: アカウント登録や認証トークンは一切不要。すべての機能がMITライセンスのもと無料で利用可能。
* **軽量・高速**: 独自のネイティブバイナリにより、起動時間が約24msと極めて短く、待機時のメモリ消費もわずか約13MBに抑えられている。

## **6. 弱み・注意点 (Cons)**

* **ホストのDocker環境への依存**: LambdaやRDS等の実行に実際のDockerコンテナを使用するため、Dockerソケット（`/var/run/docker.sock`）のマウントが必要となる。環境によってはセキュリティポリシーの調整が必要。
* **新興プロジェクト**: LocalStackほどの長年の歴史や巨大なコミュニティによる隅々までの検証（エッジケースのカバー）という点では、まだ発展途上の部分がある可能性がある。
* **日本語対応**: 公式ドキュメントは英語ベース。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース版** | 無料 | すべての機能（47種類のAWSサービス、Testcontainers連携、マルチアカウント分離など）が含まれる。MITライセンス。 |

* **課金体系**: 完全無料
* **無料トライアル**: 該当なし

## **8. 導入実績・事例**

* **導入企業**: 新規のオープンソースプロジェクトであるため公開事例はまだ少ないが、GitHubのStar数（8.8k）が示すように多くの開発者から注目を集めている。
* **導入事例**:
  * LocalStack Community版の有償化・ライセンス変更に伴い、CI/CDパイプラインでのテスト用エミュレーターとしてFlociへ乗り換える事例がコミュニティで多数報告されている。
  * Testcontainersを活用して、JavaやNode.jsプロジェクトの統合テスト環境を自動構築する用途での導入。
* **対象業界**: 業界を問わず、AWS環境を利用したバックエンド開発を行っているすべての企業・開発者。

## **9. サポート体制**

* **ドキュメント**: 公式サイト（https://floci.io/）にて、マイグレーションガイド、各サービスの対応状況、ストレージ設定などのドキュメントが提供されている。
* **コミュニティ**: Slackコミュニティ、GitHub Discussionsが存在し、質問や機能要望、バグ報告が活発に行われている。
* **公式サポート**: オープンソースプロジェクトのため、商用サポートは提供されていない。Issueによるコミュニティサポートとなる。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: AWS SDK（Boto3, AWS SDK for Java/Node.js/Goなど）およびAWS CLIと100%互換。エンドポイントを `http://localhost:4566` に変更するだけで利用できる。
* **外部サービス連携**: Docker Composeによる各種ツールとの連携、GitHub ActionsやGitLab CIなど主要なCI/CDサービスでの利用が可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Java (Testcontainers)** | ◎ | 公式の `testcontainers-floci` モジュールがあり、Spring Bootとの統合（`@ServiceConnection`）もサポートされている。 | 特になし |
| **Node.js (TypeScript)** | ◎ | 公式の `@floci/testcontainers` を利用してJestなどのテストとシームレスに統合可能。 | 特になし |
| **Python** | ◎ | 公式の `testcontainers-floci` を提供。pytestのfixtureとして容易に組み込める。 | 特になし |
| **Terraform / OpenTofu** | ◎ | AWSプロバイダーのエンドポイントをFlociに向けることで、IaCのローカル検証が可能。 | 特になし |

## **11. セキュリティとコンプライアンス**

* **認証**: ローカルテストツールであり、任意のダミークレデンシャル（例: `test`/`test`）で動作する。マルチアカウント機能により、アクセスキーをアカウントIDとして分離できる。
* **データ管理**: データはコンテナ内、またはマウントしたローカルディレクトリ（`persistent` モードの場合）に保存される。外部への意図しないデータ送信はない。
* **準拠規格**: オープンソース（MITライセンス）として提供されているローカル開発支援ツールである。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 管理用のWeb UI（ダッシュボード）は標準では提供されておらず、AWS CLIやSDKからの操作が基本となる。しかし、LocalStackからの移行が非常にスムーズ（環境変数やポートが同じ）なため、すでにLocalStackを使っているユーザーにとっては導入コストがほぼゼロ。
* **学習コスト**: AWS CLIやSDKの使い方を知っていれば、特別なツールの学習は不要。Testcontainersの連携も公式ドキュメントに数行のコードスニペットが記載されており、非常にわかりやすい。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Testcontainersでのクリーンなテスト**: CI環境において、テストケースごとにFlociコンテナを起動・破棄することで、常にクリーンな状態での統合テストを実現する。デフォルトの `memory` ストレージモードを使用すれば高速。
  * **LocalStackからの透過的移行**: 既存の `docker-compose.yml` における `image: localstack/localstack` を `image: floci/floci:latest` に書き換えるだけで移行が完了する。
* **陥りやすい罠 (Antipatterns)**:
  * **Dockerソケットの権限忘れ**: LambdaやRDSなど、FlociからDockerコンテナを立ち上げるサービスを利用する場合、Dockerソケットのマウント設定を忘れると動作しない。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub（スター数、Issues）、X(Twitter) などの開発者コミュニティの声。
* **総合評価**: LocalStackの強力な代替として、多くの開発者から高い関心と肯定的なフィードバックを得ている。GitHubのスター数も8.8kに達している。
* **ポジティブな評価**:
  * 「LocalStack Communityのライセンス変更後、完全に無料で使える代替手段として非常に助かる」
  * 「AWS CLIと同じように操作でき、LocalStackからの移行が驚くほど簡単だった」
  * 「コンテナの起動が爆速で、CIパイプラインの時間が大幅に短縮された」
* **ネガティブな評価 / 改善要望**:
  * 「一部のマイナーなAWSサービスにはまだ対応していない部分がある」
  * 「Go言語向けのTestcontainersモジュールを早く正式リリースしてほしい」
* **特徴的なユースケース**: RDSやKafka（MSK）を別途起動するのではなく、Flociの機能を通じてAWSと同じように操作・プロビジョニングし、ローカル開発環境の構築をシンプルにする使い方。

## **15. 直近半年のアップデート情報**

* **2026-05-13**: v1.5.15をリリース。安定性向上やコンテナ統合機能の改善が含まれる。

(出典: [GitHub Releases](https://github.com/floci-io/floci/releases) など)

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Floci | LocalStack | fakecloud |
|:---:|:---|:---:|:---:|:---:|
| **利用形態** | アカウント登録・トークン | ◎<br><small>不要</small> | ×<br><small>2026/03以降必須</small> | ◎<br><small>不要</small> |
| **パフォーマンス** | 起動時間 | ◎<br><small>約24ms</small> | △<br><small>数秒かかる</small> | ◎<br><small>非常に高速</small> |
| **対応範囲** | サポートするサービス数 | ◯<br><small>主要47サービス</small> | ◎<br><small>100以上</small> | △<br><small>主要22サービス</small> |
| **再現性** | 実エンジンのDocker起動 | ◎<br><small>RDS/Kafka等に対応</small> | △<br><small>有料プラン等による</small> | ×<br><small>モック中心</small> |
| **テスト連携** | Testcontainers公式モジュール | ◎<br><small>Java/Node/Python提供</small> | ◎<br><small>提供あり</small> | ◯<br><small>公式テスト用SDK提供</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Floci** | 実エンジン統合型のエミュレーター | 完全無料。起動が高速。実エンジン（RDS, MSK等）による高い本番互換性。 | Dockerソケットのマウントが必要。対応サービスは主要なものに留まる。 | 無料でLocalStackの代替を探している場合。本番に近いデータベース挙動を検証したい場合。 |
| **LocalStack** | 最も歴史のあるAWSエミュレーター | 対応サービス数が圧倒的。巨大なコミュニティと情報量。 | Community版の制限。リソース消費が大きい。 | マイナーなAWSサービスを利用する場合。企業サポートが必要な場合。 |
| **fakecloud** | 単一バイナリ動作の軽量エミュレーター | Docker不要で単一バイナリで動く。セットアップが極めて簡単。 | 対応サービスが限定的（22種類）。 | Dockerを使わず、CI/CDで極限まで軽くAWSモックを動かしたい場合。 |

## **17. 総評**

* **総合的な評価**:
  LocalStackがCommunity版に制限を設けたことで生じた「無料で手軽に使えるAWSエミュレーター」の空位を見事に埋めるツールです。単なるAPIのモックに留まらず、RDSやMSKなどのステートフルなサービスに対して実物のDockerコンテナを透過的に立ち上げるアプローチは、本番環境との挙動の乖離を減らす素晴らしいアーキテクチャ設計です。起動の高速さも相まって、これからのローカル開発・テストのデファクトスタンダードになるポテンシャルを秘めています。
* **推奨されるチームやプロジェクト**:
  * AWSを利用し、CI/CDで頻繁に自動統合テストを実行している開発チーム。
  * LocalStackのアカウント登録や制限に不満を抱えているチーム。
  * コンテナを活用したモダンなテスト手法（Testcontainersなど）を取り入れているプロジェクト。
* **選択時のポイント**:
  47種類の主要サービスを利用している範囲であれば、Flociは最良の選択肢です。ただし、Dockerソケットのマウントが必要となるため、CI環境のセキュリティ要件（DinDの可否など）を事前に確認することが重要です。
