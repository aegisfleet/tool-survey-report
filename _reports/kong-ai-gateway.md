---
# === フロントマター ===
# 【必須項目】
title: "Kong AI Gateway 調査レポート"
tool_name: "Kong AI Gateway"
tool_reading: "コング エーアイ ゲートウェイ"
category: "AIインフラ"
developer: "Kong Inc."
official_site: "https://konghq.com/products/kong-ai-gateway"
date: "2026-06-22"
last_updated: "2026-06-22"
tags:
  - "AIゲートウェイ"
  - "LLMプロキシ"
  - "APIゲートウェイ"
  - "エンタープライズ"
  - "オープンソース"
description: "生成AIアプリケーションと各種LLMの中間に位置し、一元的なトラフィック制御、セキュリティポリシー適用、コスト管理を実現するエンタープライズ向けAIゲートウェイ"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料 (OSS版) / サブスクリプションは要問い合わせ"
  target_users:
    - "プラットフォームエンジニア"
    - "バックエンドエンジニア"
    - "AIアプリ開発者"
  latest_highlight: "Kong AI Gateway 3.14にてA2A (Agent-to-Agent) トラフィック管理とMCPをサポート"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 10
      reason: "強力なAPIゲートウェイ(Kong)としての実績と拡張性、エコシステムの広さ"
    - point: 5
      reason: "Agent-to-Agent(A2A)やMCPなど最新のAIエージェントトレンドへの迅速な対応"
    - point: 5
      reason: "ハイブリッドなデプロイメント環境（Kubernetes、自己ホスト、クラウド）への柔軟な対応"
  minus_points:
    - point: -5
      reason: "複雑な設定と学習コスト（Kongアーキテクチャの理解が必要）"
  summary: "既存のAPI管理と統合できる強力なAIゲートウェイだが、導入や設定には一定のインフラ知識が求められる"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/Kong/kong"
  documentation: "https://developer.konghq.com/ai-gateway/"
relationships:
  parent: "Kong Gateway"
  children: []
  related_tools: []
---

# **Kong AI Gateway 調査レポート**

## **1. 基本情報**

* **ツール名**: Kong AI Gateway
* **ツールの読み方**: コング エーアイ ゲートウェイ
* **開発元**: Kong Inc.
* **公式サイト**: [https://konghq.com/products/kong-ai-gateway](https://konghq.com/products/kong-ai-gateway)
* **関連リンク**:
  * GitHub: [https://github.com/Kong/kong](https://github.com/Kong/kong)
  * ドキュメント: [https://developer.konghq.com/ai-gateway/](https://developer.konghq.com/ai-gateway/)
  * レビューサイト: [Gartner](https://www.gartner.com/reviews/product/kong-gateway) | [G2](https://www.g2.com/products/kong-inc-kong-konnect/reviews)
* **カテゴリ**: AIインフラ
* **概要**: Kong AI Gatewayは、生成AIアプリケーションと各種LLM（Large Language Model）の中間に配置されるAI・APIゲートウェイです。プロンプト制御、コスト・トークン管理、ルーティング、トラフィック制御を単一のプラットフォームで提供し、AIの全データパスを一元的にガバナンスします。

## **2. 目的と主な利用シーン**

* **解決する課題**: 複数のLLMプロバイダーへのアクセスが分散することによるガバナンスの欠如、トークン消費コストの増大、APIキー管理の複雑化、AIエージェント間通信の可視化不足を解決します。
* **想定利用者**: プラットフォームエンジニア、バックエンドエンジニア、DevOpsチーム、AIアプリケーション開発者。
* **利用シーン**:
  * 複数LLM（OpenAI、Anthropic、Bedrockなど）のAPIキーをゲートウェイで一元管理し、アプリケーション側から隠蔽する。
  * トークンベースのレート制限を設定し、高額なLLM利用コストの予期せぬ急騰を防ぐ。
  * Semantic Caching（意味的キャッシュ）を利用して、同一・類似のプロンプトに対する応答遅延とコストを削減する。
  * マルチエージェントアーキテクチャにおいて、Agent-to-Agent（A2A）のトラフィックを可視化・制御する。

## **3. 主要機能**

* **マルチプロバイダールーティングとロードバランシング**: 複数のLLMモデル（OpenAI, Anthropic, Cohere, Llama等）にリクエストを転送し、可用性を高めるためのフォールバックやロードバランシングを提供します。
* **トークンベースのレート制限（Token Rate Limiting）**: 従来のAPIリクエスト単位だけでなく、プロンプトとレスポンスのトークン数に基づいた厳密なレート制限とコスト管理が可能です。
* **Semantic Caching（意味的キャッシュ）**: プロンプトの意味を解釈し、過去の類似リクエストのキャッシュを返すことで、LLMへの直接アクセスを減らし、レイテンシーとコストを削減します。
* **PIIマスクとプロンプトガードレール**: 個人情報（PII）をLLMへ送信する前にサニタイズ（匿名化）したり、不適切なプロンプトをブロックするガードレール機能を備えています。
* **Agent-to-Agent (A2A) および MCP サポート**: エージェント同士の通信トラフィックや、Model Context Protocol (MCP) のルーティングとガバナンスに対応しています（v3.14以降）。
* **ストリーミングレスポンスのサポート**: LLM特有のチャンク単位でのストリーミングレスポンスにネイティブ対応し、アプリケーションに低遅延で結果を返却します。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Kubernetesクラスタ、またはDocker環境。
  * (Konnectを使用する場合) Kong Konnectのアカウント。
* **インストール/導入**:

  ```bash
  # Dockerを用いたオープンソース版（Kong Gateway）の起動例
  docker run -d --name kong \
    -e "KONG_DATABASE=off" \
    -e "KONG_DECLARATIVE_CONFIG=/kong/declarative/kong.yml" \
    -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
    -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
    -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl" \
    -p 8000:8000 \
    -p 8443:8443 \
    -p 127.0.0.1:8001:8001 \
    -p 127.0.0.1:8444:8444 \
    kong:latest
  ```

* **初期設定**:
  * KongのAIプラグイン（`ai-proxy` 等）を有効化し、利用するLLMプロバイダーのAPIキーを環境変数やVaultに設定します。
* **クイックスタート**:
  * 宣言的設定ファイル（YAML）またはAdmin API経由で、AIプロキシサービスとルートを作成し、特定のエンドポイントからLLMへアクセスできるよう構成します。

## **5. 特徴・強み (Pros)**

* **エンタープライズグレードの基盤**: オープンソースで実績のある高性能APIゲートウェイ「Kong Gateway (Nginxベース)」の上に構築されているため、トラフィック増大に対するスケーラビリティと安定性が非常に高いです。
* **APIとAIの統合管理**: 従来のREST API・GraphQL・gRPCトラフィックの管理と、LLMトラフィックの管理を一つのプラットフォーム（Kong Konnect等）で統合できます。
* **エージェント指向への対応**: LLMへの単一リクエストの仲介に留まらず、Agent-to-Agent（A2A）やMCPトラフィックの可視化・ガバナンス機能も提供し、次世代のAIアーキテクチャに対応しています。
* **Kubernetesネイティブ**: Kubernetes Ingress ControllerやGateway APIと深く統合されており、クラウドネイティブ環境との親和性が高いです。

## **6. 弱み・注意点 (Cons)**

* **学習コストの高さ**: 設定やプラグイン管理、データプレーン/コントロールプレーンの概念など、Kong独自のアーキテクチャを理解する必要があり、単純なプロキシツールと比べると導入ハードルが高いです。
* **高度な機能は有料**: オープンソース版（OSS）でもAI Proxyなどの基本機能は使えますが、GUIダッシュボード、高度な分析、一部のセキュリティ機能（OIDC等）、RBACなどは有料のKonnect PlusやEnterpriseプランに依存します。
* **価格体系の複雑さ**: Kong Konnect（SaaS版）は、ゲートウェイ単位の月額課金に加え、APIリクエスト数やAIモデル数などに基づく従量課金があり、コスト見積もりが複雑になりがちです。
* **日本語情報の少なさ**: 公式ドキュメントや最新機能（AI Gateway）に関する情報は英語が主体であり、国内のコミュニティによる日本語情報は限定的です。

## **7. 料金プラン**

Kongは「Kong Konnect」という統合プラットフォームの中でAI Gateway機能を提供しています。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Kong Gateway OSS** | 無料 | 自己ホスト型のオープンソース。コアとなるプロキシ機能と一部のAIプラグインを利用可能だが、GUIや高度な分析はなし。 |
| **Konnect Free Trial** | 無料 | 30日間のエンタープライズ機能トライアル。ゲートウェイ制限なし。 |
| **Konnect Plus** | 従量課金制 | 月額の基本料金＋APIリクエスト数および利用LLMモデル数に応じた課金（例: 月間100万リクエストまで無料、以降超過分課金）。AI Gatewayは5モデルまで含み、以降はモデル単位で追加料金。 |
| **Konnect Enterprise** | 要問い合わせ | 年間契約。高度なセキュリティ、カスタムプラグイン、SSO/RBAC、24/365サポートなど、大規模エンタープライズ向け機能を提供。 |

* **課金体系**: ゲートウェイ数、APIリクエストボリューム、利用するLLMモデル数などのハイブリッドモデル。

## **8. 導入実績・事例**

* **導入企業**: Kong Gateway全体としては、Wayfair, Nasdaq, PayPal, GSK, Yahoo! Japanなどの大手企業で導入実績があります。AI Gatewayはこれらの既存エンタープライズ基盤上で導入が進んでいます。
* **導入事例**:
  * アプリケーションごとに分散していたOpenAIのAPIキー管理をKongで一元化し、コンプライアンス要件を満たしたケース。
  * Semantic Cachingにより、外部LLMプロバイダーのAPI呼び出し回数を削減し、ランニングコストを大幅に抑制した事例。
* **対象業界**: 金融、ヘルスケア、EC、テクノロジーなど、厳密なセキュリティとガバナンスが求められるエンタープライズ全般。

## **9. サポート体制**

* **ドキュメント**: [Kong Docs](https://developer.konghq.com/) が提供されており、アーキテクチャからプラグイン設定まで詳細に網羅されています（英語）。
* **コミュニティ**: [Kong Nation](https://discuss.konghq.com/) という公式フォーラムや、GitHubでの活発な議論が行われています。
* **公式サポート**: Konnect Enterpriseプランなどを契約している場合、24時間365日のSLA付きエンタープライズサポート窓口（メール、チケットシステム等）が提供されます。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Admin APIを通じて、ゲートウェイの設定やプラグインの動的構成が可能です。
* **外部サービス連携**: OpenAI, Anthropic, Amazon Bedrock, Google Gemini, Databricks, DeepSeek, vLLM, Cohere など主要なLLMプロバイダー・推論プラットフォームのプロキシとしてネイティブ対応しています。さらにDatadog, Prometheus, Splunk等の監視ツールとも連携します。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Kubernetes (K8s)** | ◎ | Kong Ingress Controller経由でCRDとして宣言的に管理でき、親和性が極めて高い | K8sの知識とIngressの理解が必須 |
| **CI/CD (GitOps)** | ◎ | decKというCLIツールやTerraformプロバイダにより設定をコード(YAML)で管理可能 | Kong固有の設定仕様を学習する必要あり |
| **Python / Node.js等 (アプリ側)** | ◯ | アプリケーション側はKongを単なるAPIエンドポイントとして扱うだけでよく、言語に依存しない | LLMの公式SDKのベースURLをKongに向ける設定が必要 |

## **11. セキュリティとコンプライアンス**

* **認証**: OAuth2.0、OIDC、JWT、APIキー認証、mTLSなど、エンタープライズで求められる多様な認証・認可メカニズムをプラグインとして提供します。
* **データ管理**: データプレーン（プロキシ）はユーザーの環境内にデプロイでき（ハイブリッドモード）、LLMへのトラフィックデータやキャッシュは自社インフラ内に留めることが可能です。PII（個人情報）マスクプラグインにより、機密データの外部流出を防ぎます。
* **準拠規格**: Kong Inc.は SOC2 Type2、ISO 27001 などの認証を取得しています。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: オープンソース版はCUI/APIベースの操作となります。SaaS版の「Kong Konnect」を使用すれば、洗練されたGUIダッシュボードでサービス、ルート、プラグインの設定やトラフィックの可視化が直感的に行えます。
* **学習コスト**: Kongは単なるリバースプロキシを超えたプラットフォームであり、「Workspace」「Service」「Route」「Consumer」「Plugin」という概念モデルを正しく理解するまでの学習コストは高めです。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **APIキーの一元管理**: アプリケーションコード内にLLMのAPIキーを持たせず、Kong側（Vault等との連携）に持たせることで、キーローテーションを安全かつ無停止で行う。
  * **フォールバックとロードバランシング**: メインのLLMがダウンした際やレートリミットに達した際に、別のプロバイダー（例: OpenAIからAzure OpenAIへ）に自動的にルーティングする設定を組む。
* **陥りやすい罠 (Antipatterns)**:
  * **OSS版での自作ダッシュボード**: OSS版でコストを抑えようとして、Admin APIを叩く管理画面や分析基盤を自作し始めると、開発・保守の「隠れたコスト（運用工数）」がSaaS版の料金を上回ることがある。
  * **キャッシングの過信**: Semantic Cachingを設定する際、キャッシュヒットの閾値（類似度スコア）を低く設定しすぎると、文脈が異なるプロンプトに対して誤ったキャッシュ回答を返してしまうリスクがある。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2, Gartner Peer Insights
* **総合評価**: 約 4.5/5.0 (Kong Gateway全体として)
* **ポジティブな評価**:
  * 「豊富なプラグインエコシステムにより、認証やレート制限、AIプロキシなどの複雑な要件を素早く実装できる」
  * 「Kubernetesとの統合が優れており、パフォーマンスと安定性が非常に高い」
  * 「ハイブリッド展開（コントロールプレーンはクラウド、データプレーンはオンプレミス）がセキュリティ面で非常に助かる」
* **ネガティブな評価 / 改善要望**:
  * 「初期設定の複雑さと学習曲線の急峻さ。API管理の経験がないチームにはハードルが高い」
  * 「OSS版からEnterprise版へ移行する際の機能ギャップと価格のジャンプが大きい」
* **特徴的なユースケース**:
  * 生成AIを社内展開するにあたり、部署ごとのトークン消費量をKongのコンシューマー設定でトラッキングし、チャージバック（部門別課金）の基礎データとして活用している。

## **15. 直近半年のアップデート情報**

* **2026-06-04**: Kong Gateway 3.14.0.5 パッチリリース。AI GatewayにおけるKonnectアナリティクスの不具合修正や、PEMキーの暗号化に関する修正を含む。
* **2026-04-14**: Kong Gateway 3.14 (Agent Gateway機能追加)。Agent-to-Agent（A2A）トラフィックのネイティブサポート、MCPサーバーのプロキシ機能、トークン削減のための実行モデルなど、「エージェント指向AI」に向けた大型アップデート。
* **2026-04-XX**: AI GatewayにDatabricks、DeepSeek、vLLMモデルのサポートを追加。

(出典: [Kong Gateway Changelog](https://developer.konghq.com/gateway/changelog/) / [Product Releases](https://konghq.com/blog/product-releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Kong AI Gateway | Gloo AI Gateway | Portkey | Maxim AI (Bifrost) |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | マルチLLMルーティング | ◎<br><small>主要な全LLM対応</small> | ◯<br><small>標準的対応</small> | ◎<br><small>広範なモデルサポート</small> | ◯<br><small>OSSで拡張可能</small> |
| **コスト最適化** | セマンティックキャッシュ | ◯<br><small>プラグインで提供</small> | ◯<br><small>Envoyベースで提供</small> | ◎<br><small>専用の高度なキャッシュ</small> | △<br><small>限定的</small> |
| **セキュリティ** | PII・データ保護 | ◯<br><small>マスク機能あり</small> | ◯<br><small>Envoy拡張</small> | ◯<br><small>標準機能</small> | △<br><small>追加実装が必要</small> |
| **AI特化型機能**| A2A・MCPトラフィック管理 | ◎<br><small>3.14より強力な対応</small> | ◯<br><small>Agentgateway Enterprise</small> | △<br><small>APIプロキシ中心</small> | △<br><small>主に推論トラフィック特化</small> |
| **エンタープライズ** | RBAC / SSO / 監査 | ◎<br><small>Konnect Enterpriseで完備</small> | ◎<br><small>Solo.ioエンタープライズ</small> | ◯<br><small>SaaSで提供</small> | △<br><small>OSS中心</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Kong AI Gateway** | Nginx/Kongベースの堅牢なゲートウェイ | 既存のAPIとAIトラフィックを単一のエンタープライズ基盤で統合管理できる | 学習コストが高く、多機能ゆえにシンプルな用途にはオーバースペック | 既にKongを導入している企業や、API/AIを横断して厳密なガバナンスが必要な大企業 |
| **Gloo AI Gateway** | EnvoyベースでK8sに特化したAPIゲートウェイ | Kubernetes/Istioエコシステムとの深い統合。Solo.ioのエンタープライズサポート | K8s環境以外での展開が弱い。Envoyの複雑な設定 | Kubernetesネイティブな環境（Istioなど）を既に構築しているプラットフォームチーム |
| **Portkey** | AIアプリ開発に特化したフルスタックのAIゲートウェイ＆可観測性ツール | プロンプト管理、評価、高度なキャッシュなどAI特化機能が豊富で導入が容易 | 汎用的なAPIゲートウェイとしては使えない（AI特化） | LLMアプリケーションの開発アジリティを最優先し、手軽に高度な機能を使いたいAI開発チーム |
| **Maxim AI (Bifrost)**| Go言語で書かれたOSSのAI専用ゲートウェイ | 高速で軽量。LLMとエージェントトラフィックに特化したアーキテクチャ | エコシステムやエンタープライズ機能（SSOなど）は発展途上 | 汎用API管理基盤のオーバーヘッドを避け、シンプルで高速な推論プロキシを自社で運用したいチーム |

## **17. 総評**

* **総合的な評価**:
  Kong AI Gatewayは、従来の堅牢なAPI管理インフラストラクチャの上にAI固有の機能（ルーティング、セマンティックキャッシュ、プロンプトガードレール）をシームレスに統合した非常に強力なソリューションです。特に直近のアップデート（v3.14）でAgent-to-Agent (A2A) や MCPトラフィックの管理機能を追加したことで、単純なLLMプロキシを超え、「マルチエージェント時代のコントロールプレーン」としての地位を確立しつつあります。
* **推奨されるチームやプロジェクト**:
  全社規模で複数の生成AIアプリケーションやエージェントシステムを展開し、トークンコスト、セキュリティポリシー、APIキーを中央集権的に管理・監査する必要があるエンタープライズ企業・プラットフォームエンジニアリングチーム。
* **選択時のポイント**:
  組織がすでにKongを利用している場合、AI Gatewayの導入は最も自然な拡張となります。一方で、「単にいくつかのLLMのAPIを叩きたいだけ」の小規模なプロジェクトや、インフラ管理にリソースを割けないスタートアップにとっては、KongのアーキテクチャやKonnectの価格体系は重すぎる可能性があります。その場合は、よりAIアプリ開発に特化したSaaS（Portkeyなど）と比較検討することを推奨します。
