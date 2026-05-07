---
title: Claude for Financial Services 調査レポート
tool_name: Claude for Financial Services
tool_reading: クロード・フォー・ファイナンシャル・サービシズ
category: AIエージェントフレームワーク
developer: Anthropic
official_site: https://github.com/anthropics/financial-services
date: '2026-05-08'
last_updated: '2026-05-08'
tags:
  - オープンソース
  - 金融
  - AIエージェント
  - MCP
description: 投資銀行や資産運用など金融サービス向けのワークフローに特化したリファレンスAIエージェントとMCPコネクターの統合パッケージ
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料（※API利用料は別途）
  target_users:
    - 投資銀行
    - 資産運用・プライベートエクイティ
    - 金融機関のIT部門
  latest_highlight: LSEG、S&P Globalなどのパートナープラグインと連携
  update_frequency: 高
evaluation:
  score: 83
  base_score: 70
  plus_points:
    - point: 5
      reason: 金融特有の高度なワークフロー（LBOモデリング、GL照合など）に特化したエージェントが提供されている
    - point: 5
      reason: 主要な金融データプロバイダー（S&P Global, PitchBook, FactSetなど）向けのMCPコネクターが標準で統合されている
    - point: 3
      reason: CoworkプラグインおよびManaged Agentsとしてのデプロイ方法を選択可能
  minus_points:
    - point: 0
      reason: 特になし
  summary: 金融業界に特化した実践的なAIエージェント・テンプレート群であり、専門データソースへの接続とワークフロー自動化のベストプラクティスを提示している
links:
  github: https://github.com/anthropics/financial-services
  deepwiki: https://deepwiki.com/anthropics/financial-services
---

# **Claude for Financial Services 調査レポート**

## **1. 基本情報**

* **ツール名**: Claude for Financial Services
* **ツールの読み方**: クロード・フォー・ファイナンシャル・サービシズ
* **開発元**: Anthropic
* **公式サイト**: [https://github.com/anthropics/financial-services](https://github.com/anthropics/financial-services)
* **関連リンク**:
  * GitHub: [https://github.com/anthropics/financial-services](https://github.com/anthropics/financial-services)
  * ドキュメント (Managed Agents): [https://docs.claude.com/en/api/managed-agents](https://docs.claude.com/en/api/managed-agents)
  * ドキュメント (Cowork): [https://claude.com/product/cowork](https://claude.com/product/cowork)
* **カテゴリ**: AIエージェントフレームワーク
* **概要**: 投資銀行、株式調査、プライベートエクイティ、ウェルスマネジメントなど、金融機関のワークフローに最適化されたリファレンス・エージェント、スキル、データコネクター(MCP)のセット。

## **2. 目的と主な利用シーン**

* **解決する課題**: 金融機関における高度な分析、データ照合、報告書作成など、専門的で定型的なワークフローの自動化と効率化。
* **想定利用者**: 投資銀行員、リサーチアナリスト、ファンドアドミニストレーター、金融機関のIT・開発部門。
* **利用シーン**:
  * ピッチ資料の作成（類似企業比較、LBOモデルからのデータ抽出と資料化）。
  * 決算説明会およびファイリングデータからのモデル更新とレポート原案作成。
  * 総勘定元帳（GL）の照合と不一致原因の特定。
  * 顧客のポートフォリオレビューやリバランス提案の準備。

## **3. 主要機能**

* **専門ワークフロー向けエージェント**: ピッチ作成エージェント(Pitch Agent)、市場調査員(Market Researcher)、GL照合(GL Reconciler)など、特定の業務をエンドツーエンドで実行するエージェント群を提供。
* **バーティカル・プラグイン**: 投資銀行業務、株式調査、プライベートエクイティなど、金融の各領域に特化したスキルセット（`/comps`, `/dcf`, `/earnings` などのコマンドを含む）をバンドル。
* **データコネクター (MCP)**: S&P Global、FactSet、PitchBook、Morningstarなどの主要金融データプロバイダーと接続するためのMCP(Model Context Protocol)サーバー設定を統合。
* **Microsoft 365 統合ツール**: Excel、PowerPoint、Word、Outlook向けのClaudeアドインをカスタマイズしてデプロイするための管理ツールを同梱。
* **柔軟なデプロイオプション**: Coworkプラグインとして直接インストールするか、自社のワークフローエンジン背後でClaude Managed Agents APIを介してヘッドレスでデプロイすることが可能。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Anthropic APIキー（Managed Agentの場合）またはCoworkアカウント
  * 接続先データプロバイダーのAPIキーやサブスクリプション（MCP利用時）
* **インストール/導入**:

  **Claude Codeを利用したインストール例**:
  ```bash
  # マーケットプレイスの追加
  claude plugin marketplace add anthropics/claude-for-financial-services

  # コアスキルとコネクターのインストール
  claude plugin install financial-analysis@claude-for-financial-services

  # 特定のエージェントのインストール
  claude plugin install pitch-agent@claude-for-financial-services
  ```

* **初期設定**:
  * Managed Agentの場合: `.mcp.json`に自社データプロバイダーの設定を記載。
  * 展開スクリプトの実行:
    ```bash
    export ANTHROPIC_API_KEY=sk-ant-...
    scripts/deploy-managed-agent.sh gl-reconciler
    ```
* **クイックスタート**:
  * Cowork上では、プラグイン追加画面からリポジトリのURLを入力することでエージェント群を有効化できる。

## **5. 特徴・強み (Pros)**

* 金融機関の実際の業務フロー（モデル監査、ピッチ作成、DDチェックリスト等）に即した即戦力のプロンプトとスキルが提供されている。
* データ連携の標準規格であるMCPをフル活用しており、金融機関がすでに契約している外部情報端末やデータベースとシームレスに連携可能。
* 全ての設定がMarkdownとYAMLで記述されており、ビルドプロセス不要で自社向けにカスタマイズ（用語の変更、テンプレートの追加など）が容易。

## **6. 弱み・注意点 (Cons)**

* このリポジトリで提供されるシステムはあくまで「原案の作成」を行うものであり、投資助言や取引実行を行うものではないため、出力には専門家によるレビューが必須。
* データコネクター（MCP）を利用するには、各情報プロバイダー（S&P Global、FactSetなど）との個別契約およびAPIキーが別途必要となる。
* 主に英語ベースで構築されており、日本語環境での利用についてはUI・プロンプトチューニングが必要となる可能性がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (Apache 2.0)** | 無料 | 本リポジトリのテンプレートやスクリプトは無償で利用・改変可能 |

* **課金体系**: リポジトリ自体の利用は無料だが、システムを実行するためのClaude API（Managed Agents）利用料、および外部データベンダー（MCP）の接続費用が別途発生する。
* **無料トライアル**: オープンソースのため制限なし。

## **8. 導入実績・事例**

* **導入企業**: Anthropicが提唱するリファレンス実装のため、特定の企業導入事例はリポジトリ上では公開されていないが、LSEGやS&P Globalといった大手パートナーが参画・プラグインを提供している。
* **導入事例**: LSEG（債券RV、スワップカーブ監視）、S&P Global（ティアシート、決算プレビュー）などのパートナービルドプラグインが用意されており、業界標準のユースケースとして提示されている。
* **対象業界**: 投資銀行、アセットマネジメント、ファンド管理、ウェルスマネジメント等。

## **9. サポート体制**

* **ドキュメント**: リポジトリのREADMEが詳細なガイドとなっており、アーキテクチャ、セットアップ方法、エージェントごとの機能が記載されている。
* **コミュニティ**: GitHubのIssueおよびPull Requestベースで開発が進行。
* **公式サポート**: オープンソースプロジェクトとしての提供。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Claude Managed Agents API (`/v1/agents`) に対応しており、自社システムからAPI経由でエージェントを呼び出し可能。
* **外部サービス連携**:
  MCPを通じて以下のプロバイダーと標準で連携設定が可能：
  Daloopa, Morningstar, S&P Global, FactSet, Moody's, MT Newswires, Aiera, LSEG, PitchBook, Chronograph, Egnyte

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Claude API / Managed Agents** | ◎ | ネイティブに対応したアーキテクチャ | 特になし |
| **Model Context Protocol (MCP)** | ◎ | 外部データ統合の基盤として採用 | 各プロバイダー側のMCP対応状況に依存 |
| **Microsoft 365 (Excel, PPT, Word)** | ◯ | 専用のセットアップツールが同梱 | Azure ADやGraph APIの管理者権限設定が必要 |

## **11. セキュリティとコンプライアンス**

* **認証**: デプロイ環境（Cowork環境または自社のAPI環境）および各MCPプロバイダーへのAPI認証に依存する。
* **データ管理**: データはユーザー自身が管理する環境、またはAnthropicのAPIポリシーに準拠する形で処理される。Microsoft 365プラグインの場合は自社クラウド（Vertex AI、Bedrock等）を向くように設定可能。
* **準拠規格**: ツール自体はオープンソースのテンプレートであるため、実際のコンプライアンス要件（金融規制等）はこれをデプロイ・運用する各社の責任となる。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Cowork上ではGUIからプラグインとして追加でき、チャットインターフェースでスラッシュコマンド(`/dcf`, `/comps` 等)を使って直感的に操作できる。
* **学習コスト**: 金融実務（LBOモデル、DCF等）への深い理解が前提となる。技術的には設定ファイル（YAML/Markdown）を編集するのみで済むため、AIエンジニアにとってはカスタマイズのハードルは低い。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * `.mcp.json` の設定を書き換え、自社の社内データベースや利用中の外部端末（Bloomberg, FactSet等）のMCPサーバーへ接続することで、ハルシネーションを防ぎ事実に基づく出力に限定させる。
  * `agents/<slug>.md` のプロンプトや、スキルファイル内（例：PPTのレイアウト指示）に自社のフォーマットルールや専門用語を追記する。
* **陥りやすい罠 (Antipatterns)**:
  * エージェントの出力をそのまま意思決定や顧客への提供に使うこと。（リポジトリでも「いかなる助言にも該当しない」と明記されており、ヒューマン・イン・ザ・ループが必須）。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: オープンソースのリファレンス実装という性質上、G2やCapterraなどのレビューサイトには登録されていない。
* **総合評価**: 該当なし。GitHubのリポジトリでは約11,500スターを獲得しており、開発者や金融機関のIT部門からの関心が非常に高いことが伺える。
* **ポジティブな評価**:
  * 金融業界向けにどのようなプロンプトやエージェント構成を組めばよいかの具体的なショーケースとして優れている。
* **ネガティブな評価 / 改善要望**:
  * 該当なし。
* **特徴的なユースケース**:
  * KYC(顧客確認)ドキュメントのパースや審査ルールの評価など、バックオフィス・コンプライアンス系の自動化。

## **15. 直近半年のアップデート情報**

* **2026-05**: (※本リポジトリは継続的にコミットが行われており、詳細なReleaseは発行されていないが、直近でManaged Agent Cookbooksの追加やClaude for Microsoft 365連携機能が更新されている。)

(出典: [GitHubリポジトリ](https://github.com/anthropics/financial-services) )

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | crewAI | AutoGPT |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | 汎用タスク実行 | ◯<br><small>特定の金融ワークフロー向け</small> | ◎<br><small>汎用的なエージェント構築</small> | ◎<br><small>自律的な汎用タスク</small> |
| **カテゴリ特定** | 金融特化のプロンプト/スキル | ◎<br><small>LBOやDCF等に特化</small> | △<br><small>自作が必要</small> | △<br><small>自作が必要</small> |
| **連携** | MCPによるデータプロバイダー連携 | ◎<br><small>主要ベンダー連携が同梱</small> | △<br><small>自作が必要</small> | △<br><small>自作が必要</small> |
| **非機能要件** | MS 365 統合設定 | ◎<br><small>管理ツール同梱</small> | ×<br><small>-</small> | ×<br><small>-</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | 金融特化のClaudeリファレンスエージェント | 事前定義された金融ワークフロー、MCPによる主要ベンダー連携 | 他のLLM（OpenAI等）ではそのまま使えない | 投資銀行やファンドで、素早く高度なAI業務アシスタントを立ち上げたい場合 |
| **crewAI** | 汎用的なマルチエージェントフレームワーク | 柔軟なエージェント設計、多様なLLMサポート | 金融に特化したテンプレートや連携は自ら実装が必要 | ゼロから自社の要件に合わせたマルチエージェントシステムをPythonで構築したい場合 |
| **AutoGPT** | 自律型AIエージェント | ゴールを与えるだけで自律的に行動・調査する | ハルシネーションの制御が難しく、金融の厳密な実務には不向きなケースも | 汎用的なリサーチや情報収集を自律的に行わせたい場合 |

## **17. 総評**

* **総合的な評価**:
  金融業界という規制や情報の厳密さが求められる領域において、AIをどのように業務（ピッチ作成、モデル構築、GL照合など）に組み込むべきかのベストプラクティスを提示する非常に価値の高いリファレンス実装です。特にMCPを用いた外部金融データベンダーとの連携が最初から組み込まれている点は、実運用へのハードルを大きく下げています。
* **推奨されるチームやプロジェクト**:
  投資銀行、アセットマネジメント、プライベートエクイティなどの業務部門と連携し、生成AIによる業務効率化を推進する金融機関のIT・DX推進チームに強く推奨されます。
* **選択時のポイント**:
  ゼロからエージェントをプロンプトエンジニアリングして構築するのではなく、Anthropicが提唱する「型」をベースに自社データやフォーマットを組み込んでチューニングするアプローチをとりたい場合に最適な出発点となります。
