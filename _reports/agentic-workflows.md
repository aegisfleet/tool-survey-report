---
title: "Agentic Workflows 調査レポート"
tool_name: "Agentic Workflows"
tool_reading: "エージェンティック ワークフローズ"
category: "GitHub Actions拡張"
developer: "GitHub Next"
official_site: "https://githubnext.com/projects/agentic-workflows/"
date: "2026-01-27"
last_updated: "2026-01-27"
tags:
  - "GitHub Actions"
  - "AI"
  - "Automation"
  - "Natural Language"
  - "Research Prototype"
description: "GitHub Actionsのワークフローを自然言語で記述し、AIエージェント（Claude CodeやOpenAI Codex）に実行させるためのGitHub Nextプロジェクト。"

quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料 (Research Prototype)"
  target_users:
    - "開発者"
    - "DevOpsエンジニア"
    - "OSSメンテナ"
  latest_highlight: "2026年1月27日にv0.37.26をリリース"
  update_frequency: "高"

evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: "自然言語でワークフローを定義できる革新性"
    - point: 5
      reason: "GitHub Actionsのセキュリティモデルを継承した安全性"
    - point: 3
      reason: "特定のモデルに依存しないエンジン非依存設計"
  minus_points:
    - point: -3
      reason: "リサーチプロトタイプであり、本番利用には注意が必要"
  summary: "自然言語プログラミングをGitHub Actionsに持ち込む野心的なプロジェクト。既存のGitHubエコシステムとの親和性が高く、将来性が期待できる。"

links:
  github: "https://github.com/githubnext/gh-aw"
  documentation: "https://githubnext.github.io/gh-aw/"
relationships:
  parent: "GitHub Actions"
  children: []
  related_tools:
    - "Claude Code"
    - "OpenAI Codex"
    - "GitHub Copilot"
---

# **Agentic Workflows 調査レポート**

## **1. 基本情報**

* **ツール名**: Agentic Workflows
* **ツールの読み方**: エージェンティック ワークフローズ
* **開発元**: GitHub Next
* **公式サイト**: [https://githubnext.com/projects/agentic-workflows/](https://githubnext.com/projects/agentic-workflows/)
* **関連リンク**:
  * GitHub: [https://github.com/githubnext/gh-aw](https://github.com/githubnext/gh-aw)
  * ドキュメント: [https://githubnext.github.io/gh-aw/](https://githubnext.github.io/gh-aw/)
  * サンプル集: [https://github.com/githubnext/agentics](https://github.com/githubnext/agentics)
* **カテゴリ**: GitHub Actions拡張 / 自然言語プログラミング
* **概要**: GitHub Nextが開発するリサーチプロトタイプ。GitHub Actionsのワークフローを複雑なYAMLではなく自然言語（Markdown）で記述し、それをAIエージェント（Claude CodeやOpenAI Codexなど）が解釈して実行可能なGitHub Actionsワークフロー（YAML）に変換・実行する仕組み。

## **2. 目的と主な利用シーン**

* **解決する課題**: 複雑なスクリプトを書かずに、リポジトリ内の定型作業（トリアージ、ドキュメント更新、テスト改善など）を自動化する。また、AIエージェントの力を借りて、単なる自動化以上の「判断」を伴うタスクを実行する。
* **想定利用者**: GitHubを利用するソフトウェア開発者、OSSメンテナ、DevOpsエンジニア。
* **利用シーン**:
  * **Issueのトリアージ**: 新しいIssueの内容を分析し、適切なラベル付けや担当者割り当て、返信案の作成を行う。
  * **ドキュメントの自動更新**: コードの変更を検知し、READMEやAPIドキュメントの更新が必要な箇所を特定して修正PRを作成する。
  * **アクセシビリティレビュー**: コードやドキュメントをスキャンし、アクセシビリティ上の問題を指摘したり修正案を提示する。
  * **継続的なテスト改善**: カバレッジレポートや変更内容に基づいて、不足しているテストケースを提案・実装する。

## **3. 主要機能**

* **自然言語によるワークフロー定義**: `.github/workflows` にYAMLを書く代わりに、自然言語で指示を書いたMarkdownファイルを記述するだけで動作する。
* **GitHub Native**: GitHub Actionsの基盤（トリガー、権限、ログ、アーティファクト）をそのまま利用するため、既存のエコシステムと完全に統合されている。
* **マルチエンジン対応**: 特定のAIモデルに依存せず、Claude CodeやOpenAI Codexなど複数の「コーディングエージェント」をエンジンとして利用可能。
* **セキュリティとガードレール**: `safe-outputs` による書き込み制限、サンドボックス実行、人間によるレビュー（PR作成）を前提とした安全設計。
* **gh aw CLI**: 自然言語で書かれたMarkdownファイルを、実行可能なGitHub Actions YAMLにコンパイルするためのCLIツール。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * GitHubアカウント
  * `gh` (GitHub CLI) のインストール
  * AIエンジンの利用権限（例: Claude CodeやOpenAI Codexへのアクセス）
* **インストール/導入**:
  ```bash
  # gh aw 拡張機能のインストール
  gh extension install githubnext/gh-aw
  ```
* **初期設定**:
  * リポジトリでセットアップウィザードを実行
  ```bash
  gh aw init
  ```
* **クイックスタート**:
  * `workflow.md` ファイルを作成し、自然言語でタスクを記述。
  * `gh aw run` でローカル実行またはGitHub Actions用にコンパイル。

## **5. 特徴・強み (Pros)**

* **プログラミングの民主化**: 自然言語で記述できるため、複雑なGitHub APIやActionsの構文を熟知していなくても高度な自動化が可能。
* **エンジンの交換可能性**: AIモデルの進化に合わせて、バックエンドのエンジン（ClaudeからCodexへ、あるいはその逆）を簡単に切り替えられる。
* **透明性と監査性**: 最終的にはGitHub ActionsのYAMLとして実行されるため、何が起きているかがログとして残り、チーム全体で監査可能。

## **6. 弱み・注意点 (Cons)**

* **リサーチプロトタイプ**: まだ製品版（GA）ではなく、仕様変更や不安定な動作が含まれる可能性がある。「Use at your own risk」と明記されている。
* **コストとリソース**: AIモデルの実行（特に高性能なモデル）にはAPIコストや実行時間がかかる場合がある。
* **プロンプトエンジニアリング**: 自然言語とはいえ、意図通りに動かすためには明確な指示（プロンプト）を書くスキルが必要。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Research Prototype** | **無料** | ツール自体はGitHub CLI拡張として無償で利用可能。 |
| **モデル利用料** | 変動 | バックエンドで使用するAIモデル（Claude Code等）のAPI利用料やサブスクリプションが別途必要になる場合がある。 |

* **課金体系**: Agentic Workflows自体への課金はないが、実行基盤（GitHub Actionsの分数）とAIモデルのコストがかかる。
* **無料トライアル**: なし（OSS/無料ツールのため）。

## **8. 導入実績・事例**

* **導入企業**: GitHub Nextプロジェクトとして公開されており、主に早期アダプターやOSSコミュニティでの実験的利用が進んでいる。
* **導入事例**:
  * **GitHub Next**: 自社プロジェクト内でのIssue管理やドキュメント更新に利用。
  * **OSSプロジェクト**: コントリビューターへの自動応答や、PRの品質チェックに活用。
* **対象業界**: ソフトウェア開発全般。特にOSSメンテナンスの効率化に注目が集まっている。

## **9. サポート体制**

* **ドキュメント**: [GitHub Pages](https://githubnext.github.io/gh-aw/) に詳細なガイド、チュートリアル、リファレンスが公開されている。
* **コミュニティ**: GitHub NextのDiscordサーバー (`#continuous-ai` チャンネル) や、GitHubリポジトリのDiscussionsで活発な議論が行われている。
* **公式サポート**: リサーチプロジェクトのため、SLAを伴う商用サポートは提供されていない。GitHub Issuesでのバグ報告が中心。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: GitHub ActionsのAPIをフル活用可能。MCP (Model Context Protocol) を通じて外部ツールとも連携できる。
* **外部サービス連携**:
  * **GitHub**: Issue, PR, Discussions, Wikiなど全機能。
  * **AIプロバイダー**: Anthropic (Claude), OpenAI (Codex/GPT)。
  * **MCP対応ツール**: データベース、Web検索、Slackなど、MCPサーバーが存在するあらゆるツール。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **GitHub Actions** | ◎ | ネイティブ統合されており、既存のアクションと組み合わせ可能。 | 特になし |
| **Markdown** | ◎ | 定義ファイルそのものがMarkdownであり、ドキュメント感覚で記述できる。 | 独自のフロントマター記法を覚える必要あり |
| **Container** | ◯ | エージェントはコンテナ内で動作するため、環境の一貫性が保たれる。 | コンテナ起動のオーバーヘッド |

## **11. セキュリティとコンプライアンス**

* **認証**: GitHub Actionsの `GITHUB_TOKEN` やOIDCを使用したセキュアな認証。
* **データ管理**: リポジトリ内のデータはActionsのセキュリティ境界内で処理される。
* **準拠規格**: GitHub Actionsの準拠規格（SOC 2, ISO 27001等）を継承。
* **Safe Outputs**: AIが勝手にコードを書き換えるのを防ぐため、出力（Pull Request作成など）を厳密に定義し、制限する機能を持つ。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 定義はテキストエディタ（Markdown）、実行はGitHub ActionsのWeb UIで確認。`gh aw` CLIによるローカル開発体験も提供されている。
* **学習コスト**: GitHub ActionsのYAMLを書くよりは遥かに低いが、効果的な「指示」を書くための慣れは必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **小さく始める**: 最初は「Issueにラベルを貼る」だけの単純なワークフローから始め、徐々に複雑なタスクに広げる。
  * **明確なゴール設定**: エージェントに対して「何を達成すれば成功か」を具体的かつ定量的に指示する。
  * **人間によるレビュー**: 重要な変更（コード修正など）は必ずPull Requestを作成させ、人間がレビューしてからマージするフローを徹底する。
* **陥りやすい罠 (Antipatterns)**:
  * **曖昧な指示**: 「いい感じにして」といった曖昧な指示は、予期せぬ動作やリソースの浪費につながる。
  * **過剰な権限付与**: 必要以上のPermissionsをワークフローに与えない。最小権限の原則を守る。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub, Discord, Tech Blog (2026年1月時点)
* **総合評価**: リサーチ段階だが、そのコンセプトへの期待値は非常に高い。
* **ポジティブな評価**:
  * 「YAML地獄から解放される未来が見える」
  * 「ドキュメント更新のような退屈な作業を丸投げできるのが最高」
  * 「Claude Codeのような強力なエージェントをCI/CDに組み込めるのは画期的」
* **ネガティブな評価 / 改善要望**:
  * 「まだ動作が遅いことがある」
  * 「プロトタイプなのでAPIが変わりやすく、本番運用には勇気がいる」
* **特徴的なユースケース**:
  * OSSメンテナが「Issueの重複チェック」や「再現手順の確認」を自動化し、負担を軽減している例。

## **15. 直近半年のアップデート情報**

* **2026-01-27 (v0.37.26)**: 最新リリース。安定性向上とバグ修正。
* **2026-01-12**: "Peli's Agent Factory" 公開。エージェントワークフローの活用ガイドツアー。
* **2025-Late**: MCP (Model Context Protocol) への対応強化。外部ツール連携が容易に。
* **2025-Late**: セキュリティ機能（Safe Outputs, Allow-listing）の拡充。

(出典: [GitHub Releases](https://github.com/githubnext/gh-aw/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Agentic Workflows | GitHub Actions (通常) | Claude Code | GitHub Copilot |
|:---:|:---|:---:|:---:|:---:|:---:|
| **定義方法** | 自然言語記述 | ◎<br><small>Markdownで記述</small> | ×<br><small>YAMLで記述</small> | ◯<br><small>対話的に指示</small> | △<br><small>補完のみ</small> |
| **実行場所** | CI/CD統合 | ◎<br><small>Actions上で動作</small> | ◎<br><small>ネイティブ</small> | △<br><small>ローカル/SSH主体のCLI</small> | ×<br><small>IDE内</small> |
| **自律性** | タスク遂行能力 | ◎<br><small>調査・判断・実行</small> | ×<br><small>定義された手順のみ</small> | ◎<br><small>自律的に遂行</small> | △<br><small>支援のみ</small> |
| **安全性** | ガードレール | ◎<br><small>Safe Outputs等</small> | ◯<br><small>権限設定のみ</small> | ◯<br><small>確認プロンプト</small> | - |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Agentic Workflows** | GitHub Actions × 自然言語AI | CI/CDパイプラインの中で自律的な判断・実行が可能。GitHub完全統合。 | まだリサーチ段階。実行速度やコストはAIモデルに依存。 | 定型作業だが判断が必要なタスク（トリアージ、レビュー等）を自動化したい場合。 |
| **GitHub Actions (通常)** | 定型的なCI/CD | 確実性、高速性、コスト予測の容易さ。 | 複雑なロジック記述が困難。自律的な判断はできない。 | テスト実行やビルドなど、手順が明確で厳密な自動化が必要な場合。 |
| **Claude Code** | 汎用コーディングエージェント | 非常に高い推論能力と自律性。ローカルや任意の環境で動く。 | CI/CDへの統合はAgentic Workflowsほどシームレスではない（自前設定が必要）。 | 開発者の手元で、特定のタスクをがっつり依頼したい場合。 |

## **17. 総評**

* **総合的な評価**:
  Agentic Workflowsは、「CI/CDの定義を自然言語で行う」というパラダイムシフトを提案する野心的なプロジェクトである。GitHub Actionsの堅牢な基盤の上で、最新のAIエージェントの柔軟性を活用できる点は非常に強力。リサーチプロトタイプであることを理解した上で、OSS活動の効率化などに導入するには最適である。
* **推奨されるチームやプロジェクト**:
  * IssueやPRの管理に追われているOSSメンテナチーム。
  * 新しい技術の導入に積極的なDevOpsチーム。
* **選択時のポイント**:
  * 「決まりきった手順」なら通常のActions、「判断が必要なタスク」ならAgentic Workflowsという使い分けが重要。将来的にGitHubの標準機能になる可能性も秘めている。
