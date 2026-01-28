---
# === フロントマター ===
# 【必須項目】
title: "Amazon Bedrock AgentCore Runtime 調査レポート"
tool_name: "Amazon Bedrock AgentCore Runtime"
tool_reading: "アマゾン ベッドロック エージェントコア ランタイム"
category: "AI開発基盤"
developer: "Amazon Web Services (AWS)"
official_site: "https://aws.amazon.com/bedrock/agentcore/"
date: "2026-01-28"
last_updated: "2026-01-28"
tags:
  - "AI"
  - "生成AI"
  - "エージェント"
  - "サーバーレス"
  - "AWS"
  - "LLM"
description: "AIエージェントやツールのための安全でサーバーレスなホスティング環境。フレームワークやモデルに依存せず、スケーラブルなエージェント実行基盤を提供。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: false
  is_oss: false
  starting_price: "従量課金"
  target_users:
    - "AIエンジニア"
    - "開発者"
    - "エンタープライズ"
  latest_highlight: "2025年10月に一般提供開始(GA)。MCPサーバーへの接続やIAM認証サポートが追加。"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: "サーバーレスでインフラ管理不要かつ数秒で数千セッションまでスケール可能"
    - point: 5
      reason: "I/O待ち時間が無料というエージェント特有のワークロードに最適化された料金モデル"
    - point: 3
      reason: "LangGraphやCrewAIなど任意のフレームワークを利用可能"
    - point: 2
      reason: "MicroVMによる完全なセッション分離で高いセキュリティを実現"
  minus_points:
    - point: -2
      reason: "AWSエコシステムへの依存度が高く、他のクラウドへの移行が難しい"
    - point: -2
      reason: "料金計算がCPU/メモリの秒単位であり、コスト見積もりが複雑になる場合がある"
  summary: "エージェント開発における「インフラ管理」と「コスト効率」の課題を解決する強力な基盤。AWS利用者なら第一選択肢。"

# 【任意項目】該当するもののみ記載
links:
  documentation: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html"
relationships:
  parent: "Amazon Bedrock"
  children: []
  related_tools:
    - "LangChain"
    - "LlamaIndex"
    - "Docker"
---

# **Amazon Bedrock AgentCore Runtime 調査レポート**

## **1. 基本情報**

* **ツール名**: Amazon Bedrock AgentCore Runtime
* **ツールの読み方**: アマゾン ベッドロック エージェントコア ランタイム
* **開発元**: Amazon Web Services (AWS)
* **公式サイト**: [https://aws.amazon.com/bedrock/agentcore/](https://aws.amazon.com/bedrock/agentcore/)
* **関連リンク**:
  * ドキュメント: [https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html)
  * 料金ページ: [https://aws.amazon.com/bedrock/agentcore/pricing/](https://aws.amazon.com/bedrock/agentcore/pricing/)
* **カテゴリ**: AI開発基盤 (エージェントホスティング)
* **概要**: Amazon Bedrock AgentCore Runtimeは、AIエージェントやツールをデプロイ・実行するための、安全でサーバーレスなホスティング環境です。インフラの管理を必要とせず、エージェントの推論プロセス（I/O待ち時間）に最適化された料金体系を提供します。LangGraphやCrewAIなど任意のフレームワークを利用可能です。

## **2. 目的と主な利用シーン**

* **解決する課題**: 自前のサーバー管理（EC2やK8s）の手間を省きつつ、AIエージェント特有の「長い待ち時間（LLMの応答待ちなど）」によるコスト増大を防ぐ。また、セッション間のデータ混入リスクを排除する。
* **想定利用者**: AIアプリケーション開発者、MLOpsエンジニア、エンタープライズのIT部門
* **利用シーン**:
  * 複雑な推論やマルチステップのタスクを実行する自律型AIエージェントのホスティング
  * 社内ツールやAPIを操作するエージェントの安全な実行環境
  * ユーザーごとに独立したメモリ空間が必要なチャットボットアプリケーション

## **3. 主要機能**

* **サーバーレス・デプロイ**: コード（Zip）またはコンテナイメージをアップロードするだけで、エージェントを即座にデプロイ可能。
* **フレームワーク非依存**: LangChain, LangGraph, CrewAI, LlamaIndex, Strands など、主要なオープンソースフレームワークをそのまま利用可能。
* **セッション分離**: 各ユーザーセッションは専用のMicroVMで実行され、CPU、メモリ、ファイルシステムが完全に分離されるため、データ漏洩のリスクがない。
* **長時間実行**: 最大8時間の実行時間をサポートし、複雑な非同期タスクや長時間にわたる推論プロセスに対応。
* **MCPサポート**: Model Context Protocol (MCP) をサポートし、他のエージェントやツールとの標準化された通信が可能。
* **AgentCore Identity**: ユーザーに代わってAWSリソースやサードパーティツール（Slack, GitHub等）へ安全にアクセスするための認証機能。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * AWSアカウント
  * AWS CLIおよびIAM権限の設定
  * Docker（コンテナデプロイの場合）またはPython環境
* **インストール/導入**:
  AWSマネジメントコンソール、またはAWS CLI/SDK、CloudFormationを使用してリソースを作成。
* **初期設定**:
  1. エージェントのコードを作成（例: `main.py`）。
  2. 依存関係（`requirements.txt`）を含めてZip化、またはDockerfileを作成してECRにプッシュ。
  3. AgentCore Runtimeで新しいエージェントを作成し、ソースを指定してデプロイ。

## **5. 特徴・強み (Pros)**

* **コスト効率の高さ**: 一般的なコンピュートサービス（常時課金）と異なり、I/O待ち時間（LLMの応答待ちやAPIコール中）は課金対象外となるため、エージェントワークロードにおいて大幅なコスト削減が可能。
* **堅牢なセキュリティ**: Firecracker MicroVM技術による強力な分離により、マルチテナント環境でも他ユーザーの影響を受けず、データの安全性が保たれる。
* **スケーラビリティ**: 需要に応じてゼロから数千セッションまで自動的にスケールするため、スパイクアクセスにも対応可能。

## **6. 弱み・注意点 (Cons)**

* **コールドスタート**: サーバーレス特有のコールドスタート（初期起動の遅延）が発生する可能性がある（ただし、MicroVMは比較的高速）。
* **AWS依存**: AWSの独自機能（IAMなど）と深く統合されているため、他のクラウドプラットフォームへの移行やハイブリッド構成の難易度が上がる可能性がある。
* **料金体系の複雑さ**: CPUとメモリの消費量（GB-hour/vCPU-hour）に基づく秒単位の計算が必要で、単純な月額固定費ではないため予算管理に注意が必要。

## **7. 料金プラン**

AgentCoreは「実際に消費したアクティブなリソース」に対してのみ課金される従量課金制です。**I/O待ち時間（アイドル時）は無料**です。

| リソース | 料金 (us-east-1) | 備考 |
|---------|------|---------|
| **vCPU** | $0.0895 / vCPU-hour | アクティブな処理時間のみ課金 |
| **メモリ** | $0.00945 / GB-hour | セッション中のピークメモリ使用量に対して課金 |

* **課金体系**: セッション開始から終了までの間、アクティブなCPU処理時間と、確保されたメモリ量に応じて秒単位で課金。I/O待機中はCPU課金が発生しない。
* **無料枠**: 新規AWSアカウント向けにAgentCore用の無料クレジット（$200相当）が提供される場合がある（AWS Free Tierの一部）。

## **8. 導入実績・事例**

* **導入企業**: Ericsson, Thomson Reuters, Cox Automotive, Amazon Devices
* **導入事例**:
  * **Ericsson**: 数万人の従業員向けにR&D効率化エージェントを展開。任意のフレームワークを使える柔軟性を評価。
  * **Thomson Reuters**: コンテンツワークフローの自動化に採用。インフラ管理の認知負荷を削減し、開発期間を数ヶ月から数週間に短縮。
  * **Cox Automotive**: ディーラー体験を向上させる仮想アシスタントや、車両発見・購入を効率化するエージェントマーケットプレイスに活用。

## **9. サポート体制**

* **ドキュメント**: AWS公式ドキュメント（日本語対応あり）が充実しており、チュートリアルやAPIリファレンスが提供されている。
* **コミュニティ**: AWS re:Post フォーラムや、GitHub上のサンプルリポジトリ（awslabs/amazon-bedrock-agentcore-samples）で情報交換が可能。
* **公式サポート**: AWS Supportプラン（Business, Enterprise等）に加入することで、SLA付きの技術サポートを受けられる。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: AWS SDK (Boto3など) を通じてプログラムからエージェントの作成、更新、実行が可能。
* **外部サービス連携**: AgentCore Gatewayを通じて、Slack, Microsoft 365, Salesforce などのSaaSや、社内のプライベートAPIと安全に連携可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **LangChain / LangGraph** | ◎ | 公式にサポートされており、複雑なグラフ構造のエージェントをそのままホスティング可能。 | 特になし |
| **CrewAI** | ◎ | マルチエージェント構成のデプロイに適している。 | エージェント間の通信レイテンシを考慮する必要がある。 |
| **Python** | ◎ | SDKやランタイムのサポートが最も手厚い。 | 基本的にPythonベースのフレームワークが主流。 |
| **Docker** | ◯ | 独自のランタイム環境が必要な場合に柔軟に対応可能。 | イメージサイズが大きくなると起動時間に影響する。 |

## **11. セキュリティとコンプライアンス**

* **認証**: AWS IAMによるアクセス制御に加え、AgentCore IdentityによるOAuth/APIキー管理が可能。
* **データ管理**: データは顧客のAWSアカウント環境内で処理され、モデルの学習には使用されない。セッションごとのデータは完全に分離される。
* **準拠規格**: AWSの標準的なコンプライアンス基準（ISO, SOC, GDPR, HIPAAなど）に準拠している（サービス提供リージョンによる）。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: AWSマネジメントコンソール上で設定を行う。GUIは機能的だが、本格的な開発にはCLIやIaC（CloudFormation/Terraform）の利用が推奨される。
* **学習コスト**: AWSの基本的な知識（IAM, ECR, S3など）があれば導入はスムーズ。エージェントフレームワーク自体の知識は別途必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **I/O待ちの活用**: AgentCoreの料金モデルを活かすため、LLM呼び出しやAPI待ちが多い処理を集約させる。
  * **小さなコンテナ**: 高速な起動を実現するため、コンテナイメージは最小限に保つ。
  * **Observabilityの有効化**: CloudWatchと連携したAgentCore Observabilityを有効にし、エージェントの挙動や推論ステップを可視化する。
* **陥りやすい罠 (Antipatterns)**:
  * **CPUバウンドな処理**: 純粋な計算処理（動画エンコードなど）を長時間行うと、EC2やLambdaよりも割高になる可能性がある。
  * **ステート管理の不備**: セッション分離は強力だが、セッションを跨ぐ永続化データは外部DB（DynamoDBなど）やAgentCore Memoryに適切に保存する必要がある。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: 公式事例、AWS Summit発表資料
* **ポジティブな評価**:
  * 「インフラ管理から解放され、ビジネスロジックの開発に集中できるようになった」
  * 「セキュリティ要件の厳しい金融・医療業界でも安心して使える分離レベルが魅力」
  * 「既存のLangGraphエージェントをそのままクラウドに移行できたのが便利」
* **ネガティブな評価 / 改善要望**:
  * 「新しいサービスのため、まだ一部のリージョンでしか利用できない場合がある」
  * 「デバッグ時にローカル環境との差異に戸惑うことがある」

## **15. 直近半年のアップデート情報**

* **2025-10-13**: **一般提供開始 (GA)**: プレビューを経て正式リリース。MCPサーバー接続、IAM認証サポート、Observabilityの強化などが含まれる。
* **2025-07-xx**: **プレビューリリース**: AgentCore Runtimeを含む初期機能セットが発表。

(出典: [AWS News Blog](https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | AgentCore Runtime | AWS Lambda | ECS (Fargate) | LangSmith (Hosted) |
|:---:|:---|:---:|:---:|:---:|:---:|
| **実行環境** | サーバーレス | ◎ | ◎ | ◯ | △<br><small>SaaS型</small> |
| **コスト** | I/O無料 | ◎<br><small>独自仕様</small> | ×<br><small>待機中も課金</small> | ×<br><small>稼働中課金</small> | - |
| **セキュリティ** | セッション分離 | ◎<br><small>MicroVM</small> | ◎<br><small>MicroVM</small> | ◯<br><small>タスク単位</small> | △<br><small>共有環境</small> |
| **制限** | 実行時間 | ◎<br><small>最大8時間</small> | △<br><small>最大15分</small> | ◎<br><small>無制限</small> | △ |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **AgentCore Runtime** | エージェント特化のホスティング。 | I/O待ち時間が無料。セッション分離と長時間実行の両立。 | 汎用的なWebアプリには不向き。 | 自律型エージェントをコスト効率よく安全に動かしたい場合。 |
| **AWS Lambda** | 汎用サーバーレス関数。 | イベント駆動で圧倒的な実績。エコシステムが巨大。 | 15分の実行制限があり、長時間のエージェント思考には不向き。 | 短時間の単発タスクや、単純なチャットボットの場合。 |
| **Amazon ECS (Fargate)** | コンテナ向けサーバーレス。 | 既存のコンテナ資産をそのまま動かせる。長時間実行可能。 | 待機時間も含めて課金されるため、対話型エージェントではコストが嵩む。 | 常に稼働し続けるバックグラウンド処理やWebサーバーの場合。 |

## **17. 総評**

* **総合的な評価**:
  Amazon Bedrock AgentCore Runtimeは、生成AIエージェントの実運用における最大の課題である「コスト」と「セキュリティ」に対して、非常に合理的な解を提示しています。特にI/O待ち時間を無料にする価格モデルは、LLMを利用するアプリケーションにとって革命的です。
* **推奨されるチームやプロジェクト**:
  AWSを利用しており、LangGraphやCrewAIなどで構築したエージェントを本番環境にデプロイしようとしているチーム。特に、対話型で処理時間が長くなる傾向にある高度なエージェントを開発している場合に最適です。
* **選択時のポイント**:
  15分以内に終わる単純な処理ならLambdaでも十分ですが、複雑な推論やツール利用を行うエージェントならAgentCore Runtimeの方がコストと機能のバランスが優れています。
