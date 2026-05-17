---
category: AIエージェント基盤
date: '2026-03-28'
description: AutoGenとSemantic Kernelの次世代となる、エージェントとワークフローを構築するためのオープンソースAIフレームワーク
developer: Microsoft
evaluation:
  base_score: 70
  minus_points: []
  plus_points:
    - point: 5
      reason: Semantic KernelとAutoGenの利点を統合した強力なアーキテクチャ
    - point: 5
      reason: オープンソースであり、エコシステムやエンタープライズ対応が充実している
  score: 80
  summary: 次世代のマルチエージェントオーケストレーションとエンタープライズ向け機能を兼ね備えた強力なフレームワーク
last_updated: '2026-03-28'
links:
  codewiki: https://codewiki.google/github.com/microsoft/agent-framework
  deepwiki: https://deepwiki.com/microsoft/agent-framework
  github: https://github.com/microsoft/agent-framework
official_site: https://learn.microsoft.com/en-us/agent-framework/
quick_summary:
  has_free_plan: true
  is_oss: true
  latest_highlight: パブリックプレビューの公開
  starting_price: 無料
  target_users:
    - 開発者
    - エンタープライズ
  update_frequency: 高
relationships:
  related_tools:
    - A2A Protocol
tags:
  - AI
  - エージェント
  - オープンソース
  - ワークフロー
title: Microsoft Agent Framework 調査レポート
tool_name: Microsoft Agent Framework
tool_reading: マイクロソフト エージェント フレームワーク
---

# **Microsoft Agent Framework 調査レポート**

## **1. 基本情報**

* **ツール名**: Microsoft Agent Framework
* **ツールの読み方**: マイクロソフト エージェント フレームワーク
* **開発元**: Microsoft
* **公式サイト**: [https://learn.microsoft.com/en-us/agent-framework/](https://learn.microsoft.com/en-us/agent-framework/)
* **関連リンク**:
  * GitHub: [https://github.com/microsoft/agent-framework](https://github.com/microsoft/agent-framework)
* **カテゴリ**: AIエージェント基盤
* **概要**: Agent Frameworkは、堅牢で将来性のあるAIエージェントソリューションを構築するためのフレームワークです。単一エージェントから複雑なマルチエージェントオーケストレーションまで、AutoGenやSemantic Kernelの利点を組み合わせた次世代の基盤を提供します。

## **2. 目的と主な利用シーン**

* **解決する課題**: 複雑化するAIアプリケーションにおける、複数エージェント間の連携、状態管理、ワークフローの可視化と制御の難しさを解消します。
* **想定利用者**: ソフトウェアエンジニア、AI開発者、エンタープライズ企業
* **利用シーン**:
  * 自律型エージェントによるオープンエンドなタスクの解決
  * グラフベースのワークフローを用いた、複数エージェントや機能の連携処理
  * 人間参加型（Human-in-the-loop）を含む長期的なAIタスクの実行と管理

## **3. 主要機能**

* **Agents (エージェント)**: LLMを利用して入力を処理し、ツールやMCPサーバーを呼び出して応答を生成する個別のエージェントを作成できます。
* **Workflows (ワークフロー)**: エージェントと機能をグラフベースで接続し、型安全なルーティングやチェックポイントを含むマルチステップタスクを構築できます。
* **State Management (状態管理)**: 長期間実行されるシナリオや、人間の介入を必要とするプロセス向けに、堅牢なセッション状態の管理を提供します。
* **Tools & MCP Server Support**: MCP（Model Context Protocol）クライアントや各種ツールとの統合により、エージェントの機能を容易に拡張できます。
* **Telemetry & Middleware**: エージェントの動作をインターセプトするミドルウェアや、エンタープライズ向けのテレメトリ機能をサポートします。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * .NET (C#) または Python環境
  * Azure OpenAI, OpenAI などの LLMプロバイダーのアカウントおよびAPIキー
* **インストール/導入**:
  ```bash
  # Pythonの場合
  pip install agent-framework --pre
  ```

  ```bash
  # C# (.NET)の場合
  dotnet add package Azure.AI.OpenAI --prerelease
  dotnet add package Azure.Identity
  dotnet add package Microsoft.Agents.AI.OpenAI --prerelease
  ```
* **初期設定**:
  * `AZURE_OPENAI_ENDPOINT` などの環境変数を設定するか、`.env` ファイルを使用します。
* **クイックスタート**:
  公式ドキュメントのチュートリアルに従い、単純なLLM呼び出しを行うHelloAgentを作成することから始めます。

## **5. 特徴・強み (Pros)**

* AutoGenのシンプルなエージェント抽象化と、Semantic Kernelのエンタープライズ向け機能（状態管理、型安全、ミドルウェアなど）を融合している点。
* グラフベースのワークフローにより、マルチエージェントの実行経路を明示的に制御できる点。
* オープンソースであり、Microsoftによる継続的なサポートと改善が期待できる点。

## **6. 弱み・注意点 (Cons)**

* 現在パブリックプレビュー段階であり、本番環境での利用には仕様変更のリスクを考慮する必要がある。
* 機能が豊富である反面、単純なタスクにはオーバーヘッドとなる可能性がある。
* 公式ドキュメントやリソースは主に英語であり、日本語での情報はまだ限られている。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース** | 無料 | GitHubで公開されており、誰でも利用可能（※別途利用するLLMAPIの利用料は必要） |

* **課金体系**: フレームワーク自体の利用は無料です。連携するAIモデル（Azure OpenAI等）の利用に応じた従量課金が発生します。
* **無料トライアル**: フレームワーク自体は完全無料のオープンソースです。

## **8. 導入実績・事例**

* **導入企業**: パブリックプレビューのため、具体的な企業の大規模導入事例は公式サイトでは大きく取り上げられていませんが、Microsoftのエコシステム内で利用が進んでいます。
* **導入事例**: AIソリューションの基盤として、社内ツールやシステム連携に活用されています。
* **対象業界**: 業界を問わず、AIを活用したシステム開発を行うあらゆる企業。

## **9. サポート体制**

* **ドキュメント**: Microsoft Learnにて、詳細なチュートリアル、アーキテクチャガイド、APIリファレンスが提供されています。
* **コミュニティ**: GitHubリポジトリにて、IssueやPull Requestを通じて活発な開発とサポートが行われています。
* **公式サポート**: Microsoftの標準的なサポートチャネルおよびGitHub Issueでの対応が基本となります。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: PythonおよびC#向けのライブラリとして提供されます。
* **外部サービス連携**: Azure OpenAI、OpenAI、Anthropic、Ollamaなどの主要なLLMプロバイダー。MCPサーバーを利用した多様な外部ツールとの連携。A2A Protocol、Azure Functions、Durable Task、DevUI等。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | 公式SDK（プレビュー）が提供されており、ドキュメントも充実 | プレビュー版のため破壊的変更の可能性 |
| **C# (.NET)** | ◎ | 公式SDK（プレビュー）が提供されており、Microsoft技術と親和性が高い | プレビュー版のため破壊的変更の可能性 |
| **JavaScript/TypeScript** | △ | 現時点では主要なサポート対象として明記されていない | 他の言語への対応状況に依存 |

## **11. セキュリティとコンプライアンス**

* **認証**: Azure Identityなど、各クラウドプロバイダーの標準的な認証メカニズムと統合可能。
* **データ管理**: アプリケーション側で管理。Azure環境と統合する場合はAzureのエンタープライズグレードのセキュリティに準拠可能。
* **準拠規格**: ユーザーのインフラストラクチャ（Azure等）に依存。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 基本的に開発者向けのSDK/フレームワークであり、DevUIなどの統合UIツールを用いることで開発体験が向上します。
* **学習コスト**: Semantic KernelやAutoGenの経験があれば移行しやすいですが、グラフベースのワークフローやエンタープライズ機能の理解には一定の学習が必要です。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * オープンエンドな対話にはエージェントを、明確な手順があるプロセスにはワークフローを使用する。
  * 関数で解決できるタスクにはAIエージェントを使わず、直接関数を呼び出す。
* **陥りやすい罠 (Antipatterns)**:
  * 単純なタスクに対して不要に複雑なマルチエージェントワークフローを構築してしまうこと。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub、開発者コミュニティ
* **総合評価**: 評価中 (パブリックプレビュー段階)
* **ポジティブな評価**:
  * Semantic KernelとAutoGenの統合による強力な基盤への期待。
  * ワークフローによる明示的な制御のしやすさ。
* **ネガティブな評価 / 改善要望**:
  * プレビュー版であるためのドキュメントの不足や、頻繁なアップデートへの追従の手間。
* **特徴的なユースケース**:
  * 既存のSemantic KernelやAutoGenベースのプロジェクトからの移行。

## **15. 直近半年のアップデート情報**

* **2026-02-20**: Microsoft LearnにてAgent Frameworkのドキュメント（パブリックプレビュー）が更新・公開されました。

(出典: [Microsoft Learn](https://learn.microsoft.com/en-us/agent-framework/overview/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | LangChain | Dify |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | エージェント構築 | ◎<br><small>SKとAutoGenの統合</small> | ◎<br><small>豊富なエコシステム</small> | ◯<br><small>ノーコード/ローコード</small> |
| **カテゴリ特定** | ワークフロー制御 | ◎<br><small>グラフベースの明示的制御</small> | ◎<br><small>LangGraph</small> | ◎<br><small>ビジュアルワークフロー</small> |
| **エンタープライズ** | 状態管理 | ◎<br><small>強力なセッション管理</small> | ◯<br><small>標準的なメモリ管理</small> | ◯<br><small>組み込みの管理</small> |
| **非機能要件** | 日本語対応 | △<br><small>ドキュメントは主に英語</small> | ◯<br><small>コミュニティ情報豊富</small> | ◎<br><small>UI/ドキュメント対応</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | Microsoftの次世代AIフレームワーク | C#とPythonの強力なサポート、SK/AutoGenの利点統合 | エコシステムが発展途上 | エンタープライズ向けの堅牢なエージェントシステムをC#/Pythonで構築する場合 |
| **LangChain** | 最も普及しているAI開発フレームワーク | 圧倒的な連携機能とコミュニティ、LangGraphによる制御 | 抽象化が複雑になりがち | 既存の豊富なインテグレーションを活用したい場合 |
| **Dify** | LLMアプリケーション開発プラットフォーム | GUIベースで直感的に開発可能、BaaSとして機能 | コードベースの細かな制御に制限 | ノーコード/ローコードで素早く開発・運用したい場合 |

## **17. 総評**

* **総合的な評価**:
  Microsoft Agent Frameworkは、AutoGenの使いやすさとSemantic Kernelのエンタープライズ向け機能を融合させた、非常に有望な次世代AIフレームワークです。特に、グラフベースのワークフローによる明示的な制御と堅牢な状態管理は、複雑化するエンタープライズ要件に応える強力な武器となります。
* **推奨されるチームやプロジェクト**:
  * 大規模なマルチエージェントシステムを構築する開発チーム。
  * すでにC# (.NET) やPythonでMicrosoftエコシステムを活用しているエンタープライズプロジェクト。
* **選択時のポイント**:
  * プロセスが明確なタスク（ワークフロー）と、オープンエンドな対話（エージェント）の使い分けが重要となるプロジェクトにおいて、強力な選択肢となります。
