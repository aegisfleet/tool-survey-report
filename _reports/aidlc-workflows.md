---
title: AI-DLC Workflows 調査レポート
tool_name: AI-DLC Workflows
tool_reading: エーアイディーエルシー ワークフローズ
category: 開発ワークフロー
developer: AWS Labs
official_site: https://github.com/awslabs/aidlc-workflows
date: '2026-06-18'
last_updated: '2026-06-18'
description: AI agents into verifiable, self-correcting engineering workflows.
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  latest_highlight: Preview release of AI-DLC Workflows 2.0
links:
  github: https://github.com/awslabs/aidlc-workflows
  deepwiki: https://deepwiki.com/awslabs/aidlc-workflows
---

# **AI-DLC Workflows 調査レポート**

## **1. 基本情報**

* **ツール名**: AI-DLC Workflows
* **ツールの読み方**: エーアイディーエルシー ワークフローズ
* **開発元**: AWS Labs
* **公式サイト**: [https://github.com/awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows)
* **関連リンク**:
  * GitHub: [https://github.com/awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows)
* **カテゴリ**: 開発ワークフロー
* **概要**: AI agents into verifiable, self-correcting engineering workflows.

## **2. 目的と主な利用シーン**

* **解決する課題**: Generative AI can make mistakes. AI agents require verification and self-correction.
* **利用シーン**:
  * Inception (WHAT to build and WHY)
  * Construction (HOW to build it)
  * Operations (Deployment and monitoring)

## **3. 主要機能**

* **Adaptive Intelligence**: Only executes stages that add value to your specific request.
* **Context-Aware**: Analyzes existing codebase and complexity requirements.
* **Risk-Based**: Complex changes get comprehensive treatment, simple changes stay efficient.
* **Question-Driven**: Structured multiple-choice questions in files, not chat.
* **Always in Control**: Review execution plans and approve each phase.
* **Extensible**: Layer custom rules on top of the core workflow.

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Kiro, Amazon Q Developer IDE Plugin, Cursor IDE, Cline VS Code Extension, Claude Code CLI, GitHub Copilot のいずれかをインストールしていること。
* **インストール/導入**:

  Download the latest release zip file named `ai-dlc-rules-v<release-number>.zip` from the Releases page. Extract the zip. It contains an `aidlc-rules/` folder with two subdirectories: `aws-aidlc-rules/` and `aws-aidlc-rule-details/`.
* **初期設定**:
  * Extract to agent-specific config directories (e.g., `.kiro/steering/`, `.amazonq/rules/`).

## **5. 特徴・強み (Pros)**

* Framework agnostic (works with Kiro, Amazon Q Developer IDE Plugin, Cursor IDE, Cline, Claude Code, GitHub Copilot).
* Extensible via Markdown rules and opt-in prompts.
* Always in control (human in the loop).

## **6. 弱み・注意点 (Cons)**

* Requires platform-specific directory setup depending on the agent.

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **無料プラン** | 無料 | MIT-0 License |

* **課金体系**: 完全無料

## **8. 導入実績・事例**

* 公開事例なし

## **9. サポート体制**

* **ドキュメント**: `docs/GENERATED_DOCS_REFERENCE.md` および README

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **外部サービス連携**: Kiro, Amazon Q Developer, Cursor, Cline, Claude Code, GitHub Copilot

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **各種コーディングエージェント** | ◎ | 開発環境に合わせたファイル配置でルールを適用可能 | 特になし |

## **11. セキュリティとコンプライアンス**

* **データ管理**: Extensions feature supports `security/` and `resiliency/` rules enforcement locally.

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: "Using AI-DLC, ..." から対話型で開始. Question-driven setup.

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * Commit rule configuration directories to Version Control (`CLAUDE.md`, `AGENTS.md`, `.amazonq/rules/`, `.kiro/steering/` etc.).

## **14. ユーザーの声（レビュー分析）**

* (記載なし)

## **15. 直近半年のアップデート情報**

* **2026-04-20**: Latest release published. AI-DLC Workflows 2.0 (Preview) announced.

(出典: [Releases page](https://github.com/awslabs/aidlc-workflows/releases) )

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール |
|:---:|:---|:---:|
| **基本機能** | 自律的ワークフロー | ◎<br><small>3フェーズの適応型</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **AI-DLC Workflows** | 適応型エンジニアリングワークフロー | 汎用性が高い | 設定が手動 | AIエージェントに厳格な手順を求める場合 |

## **17. 総評**

* **総合的な評価**:
  * AI agents require structured methodologies to minimize variance and hallucinations. AI-DLC provides this through explicit guidance and human-in-the-loop approvals.
* **推奨されるチームやプロジェクト**:
  * AIコーディングアシスタントを活用して開発を進めるすべてのチーム
* **選択時のポイント**:
  * エージェント任せにせず、品質やセキュリティを確保しながらAIを活用したい場合
