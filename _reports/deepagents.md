---
title: "Deep Agents 調査レポート"
tool_name: "Deep Agents"
tool_reading: "ディープエージェント"
category: "自律型AIエージェント"
developer: "LangChain"
official_site: "https://docs.langchain.com/oss/python/deepagents/overview"
date: "2026-03-12"
last_updated: "2026-03-12"
tags:
  - "AI"
  - "オープンソース"
  - "エージェント"
  - "開発者ツール"
  - "Python"
  - "LangChain"
description: "LangChainとLangGraph上に構築された、計画・ファイルシステム・サブエージェント等の機能を備えたAIエージェントフレームワーク"

quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "AIエンジニア"
  latest_highlight: "LangChainエコシステムとの強力な統合による包括的なエージェント構築フレームワークの提供"
  update_frequency: "高"

evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: "オープンソースであり、MITライセンスで提供されている"
    - point: 5
      reason: "計画、ファイルシステム、サブエージェントなどの高度な機能が組み込まれている"
    - point: 3
      reason: "LangChain・LangGraphのエコシステムと強力に統合されている"
    - point: 2
      reason: "CLIツールが提供されており、コマンドラインからの利用が容易"
  minus_points: []
  summary: "AIエージェントを迅速に構築するための強力な基盤を提供する、開発者向けの優れたオープンソースフレームワーク"

links:
  github: "https://github.com/langchain-ai/deepagents"
  documentation: "https://docs.langchain.com/oss/python/deepagents/overview"
  deepwiki: "https://deepwiki.com/langchain-ai/deepagents"
  codewiki: "https://codewiki.google/github.com/langchain-ai/deepagents"

relationships:
  parent: "LangChain"
  children: []
  related_tools:
    - "OpenHands"
    - "Devin"
---

# **Deep Agents 調査レポート**

## **1. 基本情報**

* **ツール名**: Deep Agents
* **ツールの読み方**: ディープエージェント
* **開発元**: LangChain
* **公式サイト**: [https://docs.langchain.com/oss/python/deepagents/overview](https://docs.langchain.com/oss/python/deepagents/overview)
* **関連リンク**:
  * GitHub: [https://github.com/langchain-ai/deepagents](https://github.com/langchain-ai/deepagents)
  * DeepWiki: [https://deepwiki.com/langchain-ai/deepagents](https://deepwiki.com/langchain-ai/deepagents)
  * CodeWiki: [https://codewiki.google/github.com/langchain-ai/deepagents](https://codewiki.google/github.com/langchain-ai/deepagents)
* **カテゴリ**: 自律型AIエージェント
* **概要**: LangChainとLangGraphを基盤とした、包括的なAIエージェントフレームワーク。計画、ファイルシステムアクセス、サブエージェントの生成など、複雑なタスクを処理するために必要なツールが「バッテリー同梱（Batteries included）」で提供される。

## **2. 目的と主な利用シーン**

* **解決する課題**: 複雑なプロンプトやツールの組み込み、コンテキスト管理を開発者が自ら構築する手間を省き、すぐに機能するエージェントを提供する。
* **想定利用者**: AIアプリケーション開発者、ソフトウェアエンジニア
* **利用シーン**:
  * 複雑で複数ステップにわたるタスクの自動化・支援
  * 大規模なファイルシステムやコードベースを操作・管理するタスク
  * 専門的なサブタスクを切り出して複数のエージェント（サブエージェント）に委譲するワークフローの構築

## **3. 主要機能**

* **計画とタスク分解 (Planning)**: `write_todos` ツールにより、複雑なタスクを個別のステップに分解し、進捗を追跡、適宜計画を修正する。
* **ファイルシステムバックエンド**: `ls`, `read_file`, `write_file`, `edit_file` などのツールでファイルを操作。コンテキストを効率的に管理する。
* **サブエージェントの生成 (Subagents)**: 特定のサブタスクに特化したエージェントを生成し、コンテキストを分離して作業を委譲する。
* **シェルの実行 (Shell access)**: `execute` ツールにより、サンドボックス化された環境でシェルコマンドを実行する。
* **長期記憶 (Long-term memory)**: LangGraphのMemory Storeを活用し、複数の会話やスレッドをまたいで情報を保持する。
* **Deep Agents CLI**: Web検索やサンドボックス、永続的なメモリ、Human-in-the-loop（人間の承認）などの機能を備えたターミナル用コーディングエージェント。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Python環境
  * 各種LLM APIキー
* **インストール**:
  ```bash
  pip install -U deepagents
  # または
  uv add deepagents
  ```
* **クイックスタート**:
  ```python
  from deepagents import create_deep_agent

  agent = create_deep_agent()
  result = agent.invoke({"messages": [{"role": "user", "content": "LangGraphについて調査し、概要をまとめてください"}]})
  print(result)
  ```

## **5. 特徴・強み (Pros)**

* **100% オープンソース**: MITライセンスの下で提供されており、自由に拡張やカスタマイズが可能。
* **プロバイダに依存しない**: ツール呼び出し（Tool calling）をサポートする任意のLLM（フロンティアモデル、オープンモデル問わず）で利用可能。
* **LangGraphベース**: ストリーミング、永続化、チェックポイント機能を備えた、本番環境レベルの堅牢なランタイム。
* **カスタマイズの容易さ**: 独自のツール追加やモデルの変更、プロンプトの調整が容易に行える。

## **6. 弱み・注意点 (Cons)**

* **LLMへの依存度が高い**: エージェントが安全に動作するためには、提供されるツールやサンドボックス環境での適切な権限設定が必須。モデル自身が自己抑制（Self-police）を行うことには期待できない。
* **Pythonエコシステムへの依存**: 現状は主にPythonでの利用が前提となる（JS/TS向けの `deepagents.js` も存在）。
* **日本語ドキュメントの不足**: 日本語の公式ドキュメントやサポートが十分に整備されていない可能性がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (MIT)** | 無料 | すべての機能を利用可能。自身でホスティング、LLMのAPI費用は別途必要。 |

* **課金体系**: ソフトウェア自体は無料。利用するLLM（OpenAI, Anthropicなど）のAPI利用料が別途発生する。
* **無料トライアル**: オープンソースであるため無期限に無料利用可能

## **8. 導入実績・事例**

* **導入企業**: 公開事例は現状少ないが、LangChainエコシステムの一部として広くコミュニティで利用・検証されている。
* **導入事例**: Claude Codeの仕組みにインスパイアされており、高度なコーディング支援や調査アシスタントとしての利用が想定される。
* **対象業界**: ソフトウェア開発、AI・機械学習分野全般

## **9. サポート体制**

* **ドキュメント**: LangChainの公式ドキュメントサイト（docs.langchain.com）に詳細なリファレンスとガイドが用意されている。
* **コミュニティ**: LangChain ForumやGitHubのIssues、Discussionsが活発。
* **公式サポート**: オープンソースプロジェクトのため、コミュニティベースのサポートが中心。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Python SDKとして機能し、他のアプリケーションから容易に呼び出せる。
* **外部サービス連携**: LangSmithとの連携によるトレース・デバッグ・評価のサポート。MCP（Model Context Protocol）も `langchain-mcp-adapters` 経由でサポート。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | ネイティブSDKが提供され、LangChainエコシステムと完全に統合 | 特になし |
| **LangGraph** | ◎ | エージェントのランタイムとして内部で使用。チェックポイント等の機能がそのまま利用可能 | 特になし |
| **Node.js / TypeScript** | ◯ | `deepagents.js` という別プロジェクトが存在 | Python版と機能差がある可能性 |

## **11. セキュリティとコンプライアンス**

* **認証**: ツールとしての認証機能はなく、利用するLLM APIのキー管理に依存する。
* **データ管理**: ファイルシステムバックエンドを柔軟に切り替え可能（インメモリ、ローカルディスク、カスタムバックエンド等）。
* **準拠規格**: 特に公開されていない。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CLIツールは直感的であり、チャット形式でのインタラクティブな利用やスクリプトへの組み込みが容易。
* **学習コスト**: LangChainやLangGraphの基礎知識があると理解が早いが、`create_deep_agent` を使うことで、複雑な内部実装を知らなくても簡単にエージェントを構築できる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 複雑なタスクでは `write_todos` を活用し、エージェント自身に計画を立てさせる。
  * サブエージェントを用いてコンテキストを分離し、メインエージェントのコンテキストウィンドウのオーバーフローを防ぐ。
  * LangSmithを併用し、エージェントの挙動を監視・デバッグする。
* **陥りやすい罠 (Antipatterns)**:
  * サンドボックスを使用せずに強力な `execute` ツール（シェル実行）を与え、意図しないシステム変更を許してしまうこと。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub
* **総合評価**: GitHub Stars 10.6k (2026年3月現在)
* **ポジティブな評価**:
  * LangChainエコシステムとの親和性が高く、既存の資産を活かしやすい。
  * 計画、ファイル操作、サブエージェントなどの必要な機能が最初から揃っている「Batteries included」な点が評価されている。
* **ネガティブな評価 / 改善要望**:
  * 複雑なエージェントを構築する際の設定やカスタマイズが、初心者にはまだ敷居が高いと感じられる場合がある。
* **特徴的なユースケース**:
  * LangChain/LangGraphエコシステムと統合した強力な自律型エージェント開発環境としての活用。

## **15. 直近半年のアップデート情報**

* **2026-03-11**: バージョン 0.4.10 リリース。
* **2025-08-01**: 初回リリース以降、継続的に機能拡張を実施。

(出典: [GitHub Releases](https://github.com/langchain-ai/deepagents/releases) など)

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Deep Agents | OpenHands | Devin |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | 自律実行 | ◎<br><small>計画・実行ループ内蔵</small> | ◎<br><small>強力な自律実行</small> | ◎<br><small>高度な自律性</small> |
| **カテゴリ特定** | ツール連携 | ◎<br><small>LangChainエコシステム</small> | ◯<br><small>独自/一部連携</small> | ◯<br><small>独自環境</small> |
| **拡張性** | サブエージェント | ◎<br><small>標準でサポート</small> | △<br><small>限定的</small> | -<br><small>不明</small> |
| **非機能要件** | オープンソース | ◎<br><small>MITライセンス</small> | ◎<br><small>MITライセンス</small> | ×<br><small>プロプライエタリ</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Deep Agents** | LangChainベースの多機能エージェント | 必要な機能が最初から揃っている | カスタマイズ性が高すぎる | LangChainエコシステムで迅速に高機能なエージェントを構築したい場合 |
| **OpenHands** | ソフトウェア開発特化型エージェント | コーディングや環境構築に強力 | 汎用的なタスクには不向きな場合がある | ソフトウェア開発の自動化に特化したい場合 |
| **Devin** | 完全自律型のソフトウェアエンジニアAI | 非常に高い精度でタスクを完遂 | クローズドソースであり利用コストが高い | 予算があり、最高峰の自律型エンジニアAIを利用したい場合 |

## **17. 総評**

* **総合的な評価**:
  LangChainとLangGraphの強力な基盤の上に構築された、非常に実用的な自律型AIエージェントフレームワーク。複雑なエージェントをゼロから構築する手間を省き、計画、コンテキスト管理、サブエージェントといった高度な機能を簡単に組み込める点が素晴らしい。
* **推奨されるチームやプロジェクト**:
  AIを組み込んだアプリケーションを開発するチーム、既存のLangChain/LangGraphエコシステムを活用しているプロジェクト、高度な自律型エージェントを迅速にプロトタイピング・本番導入したいチーム。
* **選択時のポイント**:
  LangGraphを使って独自の複雑なワークフローを構築する前の第一歩として、あるいは汎用的なタスクを処理する高機能なエージェントがすぐに必要な場合に、Deep Agentsは有力な選択肢となる。
