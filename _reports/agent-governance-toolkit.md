---
title: Agent Governance Toolkit 調査レポート
tool_name: Agent Governance Toolkit
tool_reading: エージェント ガバナンス ツールキット
category: AIエージェント基盤
developer: Microsoft
official_site: https://github.com/microsoft/agent-governance-toolkit
date: '2026-05-28'
last_updated: '2026-05-28'
tags:
  - エージェント
  - ガバナンス
  - セキュリティ
  - コンプライアンス
  - 開発者ツール
description: 自律型AIエージェント向けのポリシー適用、ID管理、サンドボックス化、SREを提供する包括的なセキュリティ・ガバナンスツールキット。
layout: report
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - エンタープライズ
  latest_highlight: 2026年5月にパブリックプレビュー版(v3.7.0)がリリースされ、NIST AI RMFやEU AI Actなどのコンプライアンスに対応。
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 6
      reason: OWASP Agentic Top 10やNIST AI RMFなどに準拠した堅牢なセキュリティ機能をアプリケーションレベルで提供
    - point: 5
      reason: Semantic Kernel、AutoGen、LangChain、CrewAIなど幅広いエージェントフレームワークに統合可能
    - point: 4
      reason: pipインストールからわずか2行でポリシーを適用できる低い導入ハードル
  minus_points: []
  summary: エンタープライズレベルでの自律型AIエージェント運用に不可欠なセキュリティおよびガバナンス機能を包括的に提供する強力なオープンソースツールキット
links:
  github: https://github.com/microsoft/agent-governance-toolkit
  deepwiki: https://deepwiki.com/microsoft/agent-governance-toolkit
  documentation: https://microsoft.github.io/agent-governance-toolkit
relationships:
  related_tools:
    - Microsoft Agent Framework
    - Agent Lightning
    - LangChain
    - CrewAI
    - Claude Code
---

# **Agent Governance Toolkit 調査レポート**

## **1. 基本情報**

* **ツール名**: Agent Governance Toolkit
* **ツールの読み方**: エージェント ガバナンス ツールキット
* **開発元**: Microsoft
* **公式サイト**: [https://github.com/microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
* **関連リンク**:
  * GitHub: [https://github.com/microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
  * ドキュメント: [https://microsoft.github.io/agent-governance-toolkit](https://microsoft.github.io/agent-governance-toolkit)
* **カテゴリ**: AIエージェント基盤
* **概要**: Agent Governance Toolkit (AGT) は、自律型AIエージェントに対するポリシーの強制、ゼロトラストID管理、実行サンドボックス化、およびSRE（サイト信頼性エンジニアリング）機能を提供するオープンソースのツールキットです。

## **2. 目的と主な利用シーン**

* **解決する課題**: ツールへのアクセス権を持つAIエージェントが自律的に意思決定を行う際の、「許可されていないアクションの実行防止」「問題発生時のエージェントの特定」「決定プロセスとポリシーの監査・証明」という3つのセキュリティおよびガバナンス上の課題を解決します。
* **想定利用者**: AIアプリケーション開発者、セキュリティエンジニア、コンプライアンス担当者
* **利用シーン**:
  * 自律型エージェントのツール呼び出しをインターセプトし、破壊的な操作をブロックする
  * マルチエージェントシステムにおいて、特定のエージェントの行動履歴とポリシー適用状況の監査ログを残す
  * 外部ツールやプラグインの実行をサンドボックス内で安全に隔離する

## **3. 主要機能**

* **Policy Engine (Agent OS)**: ツール呼び出しをインターセプトし、設定されたYAML/OPA/Cedarポリシーに従って、アクションの許可・ブロック・人間による承認要求を制御します。
* **Zero-trust Identity (Agent Mesh)**: エージェントごとのID管理、信頼スコアリング、ピアツーピアの信頼交渉機能を提供します。
* **Execution Sandboxing (Agent Runtime)**: 4つの特権リングによる実行サンドボックス化、サーガオーケストレーション、終了制御を提供します。
* **Reliability Engineering (Agent SRE)**: キルスイッチ機能、SLO（サービスレベル目標）モニタリング、カオスエンジニアリング、サーキットブレーカーなどを実装します。
* **Audit & Compliance (Agent Compliance)**: 意思決定の改ざん防止ログ（Merkle監査）、OWASP検証、ポリシーのリント機能を提供します。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Python 3.10以降（他にもTypeScript, .NET, Rust, Go向けのSDKを提供）
* **インストール/導入**:

  ```bash
  # Pythonの場合
  pip install agent-governance-toolkit[full]
  ```

* **初期設定**:
  * ポリシーファイル (`policy.yaml`) を作成し、デフォルトのアクションやルールを定義します。
* **クイックスタート**:

  ```python
  from agentmesh.governance import govern

  # 既存のツールにガバナンスを適用
  safe_tool = govern(my_tool, policy="policy.yaml")

  # 実行時にポリシーが評価され、ブロック時は GovernanceDenied がスローされる
  ```

## **5. 特徴・強み (Pros)**

* **決定論的な制御**: プロンプトに依存した不確実な安全対策（確率論的制御）ではなく、アプリケーションレイヤーでの確実な実行制御（決定論的制御）を実現。
* **あらゆるフレームワークとの互換性**: Microsoft Agent Framework, Semantic Kernel, AutoGenだけでなく、LangChain, CrewAI, OpenAI Agents SDKなど多彩なフレームワークと連携可能。
* **包括的なセキュリティカバレッジ**: OWASP Agentic Top 10のすべてのリスクカテゴリにマッピングされ、厳密な規格への対応が可能。

## **6. 弱み・注意点 (Cons)**

* 本番環境での利用は想定されているものの、現在はパブリックプレビュー段階であり、破壊的変更（Breaking Changes）の可能性がある。
* 高度なポリシー制御や分散環境でのアイデンティティ管理（SPIFFE/DID）を活用するには、運用・ネットワークアーキテクチャへの理解が求められる。
* ドキュメントは充実しているが、主に英語が中心である（一部は日本語対応済み）。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソースプラン** | 無料 | すべてのガバナンス機能、ポリシーエンジン、監査ログ機能が含まれる |

* **課金体系**: 完全無料（MITライセンスによるオープンソースソフトウェア）
* **無料トライアル**: オープンソースのため制限なく利用可能

## **8. 導入実績・事例**

* **導入企業**: パブリックプレビューのため具体的な社名公表は少ないですが、Microsoftのエコシステムおよびエンタープライズでの試験導入が進んでいます。
* **導入事例**: マルチエージェントによる自動化パイプラインでの安全なツール実行基盤として利用。
* **対象業界**: 厳格なコンプライアンスが求められる金融、ヘルスケア、政府機関などのエンタープライズ全般。

## **9. サポート体制**

* **ドキュメント**: Microsoftの公式ドキュメントサイトにて、アーキテクチャ設計、チュートリアル、APIリファレンスが網羅的に公開されています。
* **コミュニティ**: GitHub上のDiscussionsやIssuesを通じた活発なフィードバックループ。
* **公式サポート**: GitHub Issuesでのバグ報告・対応（※エンタープライズ向け商用サポートの有無については現状未明記）。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: 開発言語ごとにネイティブなSDK（Python, TypeScript, .NET, Rust, Go）を提供。
* **外部サービス連携**: MCP（Model Context Protocol）と連携したセキュリティゲートウェイ機能を提供。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | 最も機能が充実したフルスタックサポート（pip install [full]） | 特になし |
| **TypeScript / Node.js** | ◎ | Copilot CLIやClaude Codeなど主要な開発ツールとの統合が強力 | Python版に比べると一部の機能がサブセットになる可能性 |
| **.NET / C#** | ◎ | MicrosoftエコシステムやSemantic Kernelとの親和性が非常に高い | 特になし |
| **Go / Rust** | ◯ | 高パフォーマンス環境向けのSDKが提供されている | エコシステムの拡充はこれからの部分がある |

## **11. セキュリティとコンプライアンス**

* **認証**: SPIFFE、DID、mTLSを利用したゼロトラストなエージェントID管理をサポート。
* **データ管理**: アプリケーションコード内で完結するため、機密情報が外部モデルに漏洩するリスクを制御可能。
* **準拠規格**: OWASP Agentic Top 10に100%カバー対応、NIST AI RMF 1.0、EU AI Act、SOC 2へのコンプライアンスマッピングと監査証跡（Decision BOM）をサポート。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 開発者向けのSDK/CLIツールであり、`agt doctor` や `agt verify` といったCLIコマンドで簡単にコンプライアンススキャンやポリシーのlintが可能。
* **学習コスト**: 基本的なYAMLポリシーの記述と関数のラップ（`govern()`）だけであれば学習コストは非常に低い。大規模なマルチエージェント基盤を構築する場合は、アーキテクチャの理解が必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 単一のツール機能に絞って `govern()` を適用し、段階的にIdentityやAudit Logのレイヤーを追加するアプローチ。
  * CI/CDパイプラインに `agt verify` を組み込み、OWASP準拠度やプロンプトインジェクションへの耐性を自動スキャンする。
* **陥りやすい罠 (Antipatterns)**:
  * プロンプトへの指示（モデルレイヤーの防御）だけで安全性を確保しようとすること。これは確率論的な防御に過ぎず、悪意ある操作を確実にブロックできないため、AGTのポリシーエンジン（アプリケーションレイヤーでの防御）を併用すべき。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub
* **総合評価**: 該当なし（開発者向けツールキットのため）
* **ポジティブな評価**:
  * 既存のエージェントフレームワーク（LangChain, AutoGenなど）を置き換えることなく、透過的にガバナンス機能を注入できる設計が優れている。
  * プロンプトインジェクション対策の限界を認め、決定論的なアプリケーションコードでの防御にシフトしたアプローチが高く評価されている。
* **ネガティブな評価 / 改善要望**:
  * プレビュー版であるため、APIの安定化や本番環境での大規模事例を待つ声がある。
* **特徴的なユースケース**:
  * シャドーAI（管理外のAIエージェント）の検出機能（Shadow AI Discovery）を用いたエンタープライズのインベントリ管理。

## **15. 直近半年のアップデート情報**

* **2026-05-18**: v3.7.0 リリース。パブリックプレビューとして公開され、TypeScript、.NET、Rust、Goなど多言語対応のSDKが強化。
* **2026-03-XX**: MCP Security Gateway仕様の実装。ツールのポイズニング検出やドリフト監視が追加。
* **2026-01-XX**: 監査およびコンプライアンス機能の強化。Decision BOM（意思決定の部品表）やMerkleツリーベースの改ざん防止ログ機能が統合。

(出典: [GitHub Releases](https://github.com/microsoft/agent-governance-toolkit/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | NeMo Guardrails | LangSmith |
|:---:|:---:|:---:|:---:|:---:|
| **基本機能** | ポリシー適用 | ◎<br><small>決定論的かつFW非依存</small> | ◯<br><small>対話の制御が主</small> | △<br><small>モニタリング主体</small> |
| **カテゴリ特定** | ツール実行制御 | ◎<br><small>サンドボックスと権限管理</small> | ◯<br><small>関数呼び出しの制限</small> | ×<br><small>非対応</small> |
| **エンタープライズ** | コンプライアンス証明 | ◎<br><small>改ざん防止ログ</small> | △<br><small>限定的</small> | ◯<br><small>トレース・監査</small> |
| **非機能要件** | フレームワーク依存性 | ◎<br><small>あらゆるFWと統合可</small> | ◯<br><small>主要FW対応</small> | ◯<br><small>LangChain連携強</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | AIエージェントの包括的なガバナンス基盤 | 決定論的なセキュリティ制御、OWASP/NIST完全準拠 | プレビュー版であること | エンタープライズで自律型エージェントの安全な運用基盤を構築したい場合 |
| **NeMo Guardrails** | LLMとの対話フロー制御ツール | プロンプト/対話の制御に特化し、安全な対話を実現 | 実行サンドボックスやキルスイッチ機能は弱い | エージェントの「発言内容」や対話の安全性を重視する場合 |
| **LangSmith** | LLMアプリのテスト・可観測性プラットフォーム | 開発時のトレース、デバッグ、プロンプト管理に優れる | 実行前のポリシー強制（ブロック）を主目的としない | LangChainエコシステムを活用し、開発時の品質向上を目指す場合 |

## **17. 総評**

* **総合的な評価**:
  Agent Governance Toolkitは、確率論に依存する「プロンプトへの安全指示」からの脱却を図り、決定論的なアプリケーションコードレベルでのガバナンスを提供する非常に画期的なツールキットです。単なる監視にとどまらず、アクセス制御、サンドボックス化、改ざん防止機能などを通じて、OWASPなどの厳格なコンプライアンス要件を満たせる点が極めて高く評価できます。
* **推奨されるチームやプロジェクト**:
  * 金融機関や医療機関など、法規制・コンプライアンス順守が絶対条件となるエンタープライズプロジェクト。
  * ツール呼び出し（DBクエリやメール送信など）を行う自律型AIエージェントを開発しているチーム。
* **選択時のポイント**:
  * エージェントの動作フレームワーク（LangChain, AutoGenなど）を問わず、既存のシステムに透過的に後付けできるため、セキュリティのベースラインを統一したい組織において強力な選択肢となります。
