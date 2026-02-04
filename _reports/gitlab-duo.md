---
# === フロントマター ===
# 【必須項目】
title: "GitLab Duo 調査レポート"
tool_name: "GitLab Duo"
tool_reading: "ギットラボ デュオ"
category: "AIコーディング支援"
developer: "GitLab Inc."
official_site: "https://about.gitlab.com/gitlab-duo/"
date: "2026-02-05"
last_updated: "2026-02-05"
tags:
  - "AI"
  - "DevSecOps"
  - "コーディング支援"
  - "エージェント"
  - "CI/CD"
  - "DevOps"
description: "GitLabのDevSecOpsプラットフォームに統合されたAI機能群。コード生成からセキュリティスキャン、自律型エージェントによるタスク実行まで、開発ライフサイクル全体を支援する。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: false  # GitLabの無料プランでも一部機能（トライアル等）はあるが、Duo自体は有料アドオンが主
  is_oss: false  # プロプライエタリ
  starting_price: "$19/月"  # Duo Pro
  target_users:
    - "開発者"
    - "DevOpsエンジニア"
    - "セキュリティ担当者"
  latest_highlight: "2026年1月にGitLab Duo Agent Platformと自律型エージェント機能が正式リリース"
  update_frequency: "高"  # 毎月リリース

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 82  # Agent Platformの追加で加点
  base_score: 70
  plus_points:
    - point: 5
      reason: "DevSecOpsライフサイクル全体（計画、開発、セキュリティ、運用）を単一プラットフォームでカバーしている点"
    - point: 5
      reason: "自律型エージェント（Agent Platform）により、複雑なタスクの自動化が可能になった点"
    - point: 5
      reason: "セキュリティ機能（脆弱性解説・修正案提示）が非常に強力で、シフトレフトを推進できる点"
  minus_points:
    - point: -3
      reason: "GitLabプラットフォームへの依存度が高く、他のツールチェーンとの組み合わせが難しい場合がある"
  summary: "DevSecOps全体をAIで強化する強力なプラットフォーム。特にAgent機能の追加により、単なるコーディング支援を超えた価値を提供する。"

# 【任意項目】該当するもののみ記載
links:
  documentation: "https://docs.gitlab.com/ee/user/gitlab_duo/"
relationships:
  parent: "GitLab"
  children: []
  related_tools:
    - "GitHub Copilot"
    - "Amazon Q Developer"
    - "Cursor"
---

# **GitLab Duo 調査レポート**

## **1. 基本情報**

* **ツール名**: GitLab Duo
* **ツールの読み方**: ギットラボ デュオ
* **開発元**: GitLab Inc.
* **公式サイト**: [https://about.gitlab.com/gitlab-duo/](https://about.gitlab.com/gitlab-duo/)
* **関連リンク**:
  * ドキュメント: [https://docs.gitlab.com/ee/user/gitlab_duo/](https://docs.gitlab.com/ee/user/gitlab_duo/)
  * リリースノート: [https://about.gitlab.com/releases/](https://about.gitlab.com/releases/)
* **カテゴリ**: AIコーディング支援
* **概要**: GitLab Duoは、GitLabのDevSecOpsプラットフォームに統合されたAI機能スイートです。従来のコード生成やチャット機能に加え、自律型エージェント（Agent Platform）を備え、計画、コーディング、セキュリティ、CI/CDのパイプライン修正など、ソフトウェア開発ライフサイクル全体を支援します。

## **2. 目的と主な利用シーン**

* **解決する課題**: 開発者の定型作業の削減、複雑なコードベースの理解、セキュリティ脆弱性の早期発見と修正、運用トラブルの迅速な解決。
* **想定利用者**: ソフトウェア開発者、セキュリティエンジニア、DevOpsエンジニア、プロダクトマネージャー。
* **利用シーン**:
  * IDE内でのコード自動生成やリファクタリング（Code Suggestions）。
  * 脆弱性スキャン結果に対するAIによる解説と修正コードの適用。
  * 失敗したCI/CDパイプラインのログ分析と根本原因の特定。
  * IssueやEpicの説明から開発計画やテストケースを自動生成。
  * 自律型エージェントによる、複数のツールやAPIを跨いだタスクの実行。

## **3. 主要機能**

* **Code Suggestions**: 対応するIDE（VS Code, JetBrains等）内で、コードの自動補完や関数全体の生成を行う。
* **GitLab Duo Chat**: 自然言語での対話を通じて、コードの説明、テスト生成、GitLabの操作方法の質問などが可能。
* **GitLab Duo Agent Platform**: 複数のAIエージェントが連携して複雑なタスクを実行する基盤。「Planner Agent」や「Security Analyst Agent」などが含まれる。
* **Vulnerability Explanation & Resolution**: セキュリティスキャンで検出された脆弱性の内容を説明し、修正のためのマージリクエストを自動作成または提案する。
* **Root Cause Analysis**: CI/CDパイプラインのジョブ失敗時に、ログを解析して根本原因と解決策を提示する。
* **Merge Request Summary**: マージリクエストの変更点やレビューのポイントを自動的に要約し、レビュアーの負担を軽減する。
* **Code Review**: AIがコードの変更内容をレビューし、改善点やバグの可能性を指摘する。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * GitLab Premium または Ultimate プランの利用（SaaS または Self-Managed）。
  * GitLab Duo Pro または Enterprise アドオンの購入。
  * 対応IDE（VS Code, GitLab Web IDE, JetBrains IDEs, Visual Studio）のインストール。
* **インストール/導入**:
  * IDEに「GitLab Workflow」拡張機能をインストールする。
* **初期設定**:
  * GitLab管理者によるDuo機能の有効化（Group/Projectレベル）。
  * IDE拡張機能でGitLabアカウント（Personal Access Token等）を連携。
* **クイックスタート**:
  1. GitLab上のプロジェクトを開く（Web IDEまたはローカルIDE）。
  2. ソースコードファイルを開き、コメントでやりたいことを記述してEnterを押すと、コードが提案される。
  3. チャットウィンドウを開き、「このコードを説明して」と入力して対話を開始する。

## **5. 特徴・強み (Pros)**

* **DevSecOpsプラットフォームとの完全統合**: コードだけでなく、Issue、MR、CI/CD、セキュリティまで、開発ライフサイクル全体のデータとコンテキストをAIが理解・活用できる。
* **強力なセキュリティ機能**: 単なる指摘だけでなく、具体的な修正案の提示や自動修正MRの作成まで行えるため、実用性が高い。
* **プライバシー重視**: 顧客のプライベートコードをAIモデルの学習に使用しないことを明言しており、エンタープライズでも安心して導入できる。
* **Agentic AIの活用**: 新たに追加されたAgent Platformにより、単発の質問回答だけでなく、一連の作業フローを自律的に実行できる可能性が広がっている。

## **6. 弱み・注意点 (Cons)**

* **プラットフォーム依存**: GitLabを利用していることが前提であり、GitHubやBitbucketなど他のプラットフォームを利用している場合は導入できない。
* **コスト**: Premium/Ultimateプランに加えてアドオン料金が必要となるため、導入コストが高くなる場合がある。
* **日本語対応**: UIやチャットの日本語対応は進んでいるが、ドキュメントや最新機能の一部は英語のみの場合がある。
* **IDE連携の軽快さ**: 競合のGitHub Copilotと比較して、IDE拡張機能の動作や補完のレスポンスで劣ると感じる場合がある（改善傾向にはある）。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **GitLab Duo Pro** | $19/ユーザー/月 | Code Suggestions, Chat, 一般的な開発支援機能。Premium/Ultimateに追加可能。 |
| **GitLab Duo Enterprise** | 要問い合わせ | Proの全機能 + 脆弱性解説・修正、ルートコーズ分析、サマリー機能、Agent機能など。Premium/Ultimateに追加可能。 |

* **課金体系**: ユーザー単位の年額払い（月額換算価格が表示されることが多い）。
* **無料トライアル**: 60日間の無料トライアルが提供される場合がある（組織のプラン状況による）。

## **8. 導入実績・事例**

* **導入企業**: NVIDIA, Siemens, T-Mobile, Goldman Sachs など、GitLabを採用している多くのグローバル企業が活用。
* **導入事例**:
  * **T-Mobile**: CI/CDパイプラインの修正時間を短縮し、開発者の生産性を向上。
  * **Siemens**: コードレビューの効率化とセキュリティ脆弱性の早期発見に活用。
* **対象業界**: 金融、通信、製造、テクノロジーなど、セキュリティとコンプライアンスを重視する業界で特に強みを発揮。

## **9. サポート体制**

* **ドキュメント**: 公式ドキュメント（[docs.gitlab.com](https://docs.gitlab.com/ee/user/gitlab_duo/)）が非常に充実している。
* **コミュニティ**: GitLab ForumやIssue Trackerで活発な議論やバグ報告が行われている。
* **公式サポート**: GitLabのサポートプラン（Premium/Ultimate）に基づき、24/365のサポート（英語）やSLAが提供される。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: GitLab APIを通じてAI機能の一部にアクセス可能（GraphQL/REST）。
* **外部サービス連携**:
  * **IDE**: VS Code, JetBrains (IntelliJ, PyCharm等), Visual Studio, Neovim。
  * **Cloud**: Google Cloud (Vertex AI), AWS (Bedrock) とのバックエンド連携（ユーザーは意識せずに利用）。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **GitLab CI/CD** | ◎ | ログ分析や設定生成で最大限の効果を発揮 | GitLab CI以外のCIツールでは機能制限あり |
| **Python / Go / Java** | ◎ | 学習データが豊富でコード生成の精度が高い | 特になし |
| **Terraform / Ansible** | ◯ | IaCコードの生成や解説にも対応 | 複雑なモジュール構成では精度が落ちる場合も |
| **React / Vue.js** | ◯ | フロントエンドのボイラープレート生成に有用 | 最新のフレームワーク機能への追従はモデル依存 |

## **11. セキュリティとコンプライアンス**

* **認証**: GitLabの認証基盤（SSO, SAML, LDAP等）を利用し、プロジェクト単位・グループ単位での権限管理が可能。
* **データ管理**: 顧客のコードはAIモデルの学習には使用されない（Zero Retentionポリシーを採用している機能が多い）。データは暗号化されて転送・保存される。
* **準拠規格**: SOC 2 Type 2, ISO 27001, GDPR などの主要なセキュリティ基準に準拠。AI Transparency Centerで詳細情報を公開。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: GitLabのWeb画面内に統合されており、違和感なく利用できる。IDE拡張機能も主要なIDEの作法に合わせている。Duo ChatはWebとIDEの両方で利用可能。
* **学習コスト**: チャット形式で直感的に利用できるため、基本的な機能の学習コストは低い。ただし、Agent機能や高度なDevSecOpsワークフローへの組み込みには、GitLab自体の知識が必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **セキュリティのシフトレフト**: 脆弱性スキャンとDuoの修正提案を組み合わせ、マージ前に脆弱性を解消するフローを確立する。
  * **コンテキストの活用**: チャットで質問する際は、関連するファイルを開いておくか、`/include` コマンド等でコンテキストを明示的に与えると精度が向上する。
  * **レビューの効率化**: マージリクエスト作成時にDuoにサマリーを書かせ、レビュアーが概要を素早く把握できるようにする。
* **陥りやすい罠 (Antipatterns)**:
  * **AIの過信**: 提案されたコード（特にセキュリティ修正）を検証せずにそのまま本番環境にデプロイする（必ず人間のレビューを通すべき）。
  * **コンテキスト不足**: 具体的な指示を与えずに曖昧な質問をし、期待する回答が得られないと判断してしまう。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2, Reddit, Tech Blogs (2025年時点の情報を統合)
* **総合評価**: 4.4/5.0 (推定: DevSecOpsプラットフォームとしての評価を含む)
* **ポジティブな評価**:
  * 「CI/CDの失敗原因を数秒で特定してくれるRoot Cause Analysisは、デバッグ時間を劇的に短縮してくれた。」
  * 「セキュリティ修正のMRを自動作成してくれる機能は、脆弱性対応のハードルを大きく下げてくれる。」
  * 「IDEだけでなくWeb UIでもチャットが使えるのが便利。」
* **ネガティブな評価 / 改善要望**:
  * 「IDEでのコード補完のスピードは、まだGitHub Copilotの方が速いと感じることがある。」
  * 「Enterprise版の機能を使いたいが、価格が高い。」
  * 「日本語での対話精度は向上しているが、まだ英語の方がスムーズ。」
* **特徴的なユースケース**:
  * 運用チームが、アラート発生時にDuoを使ってログを解析し、迅速に一次対応を行うケース。

## **15. 直近半年のアップデート情報**

* **2026-01-15 (GitLab 18.8)**: **GitLab Duo Agent Platform**、Planner Agent、Security Analyst Agentが正式リリース。自律的なタスク実行が可能に。
* **2025-12-18 (GitLab 18.7)**: GitLab Duo Analyticsダッシュボードの改善、シークレット有効性チェック機能の追加。
* **2025-11-20 (GitLab 18.6)**: 生産性を向上させる新UIの導入、限定的ながら正確なコード検索（Exact Code Search）機能の追加。
* **2025-10-16 (GitLab 18.5)**: GitLab Duo Planner AgentとSecurity Analyst Agentのベータ版公開。Maven仮想レジストリUIの改善。
* **2025-09-18 (GitLab 18.4)**: GitLab Duo Model Selectionが一般提供開始（GA）。利用するAIモデルを選択可能に。

(出典: [GitLab Releases](https://about.gitlab.com/releases/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | GitLab Duo | GitHub Copilot | Amazon Q Developer |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | コード補完・生成 | ◯<br><small>標準的</small> | ◎<br><small>高速・高精度</small> | ◯<br><small>AWSに強い</small> |
| **チャット** | 自然言語対話 | ◎<br><small>Web/IDE両対応</small> | ◎<br><small>IDE統合が強力</small> | ◎<br><small>AWSコンソール統合</small> |
| **セキュリティ** | 脆弱性修正提案 | ◎<br><small>解説・自動MR作成</small> | ◯<br><small>解説・修正提案</small> | ◯<br><small>スキャン・解説</small> |
| **運用・CI/CD** | 根本原因分析 | ◎<br><small>CIログ解析が強力</small> | △<br><small>拡張機能依存</small> | ◯<br><small>AWSログ解析</small> |
| **エージェント** | 自律タスク実行 | ◎<br><small>Agent Platform</small> | ◯<br><small>Workspace Agent等</small> | △<br><small>限定的</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **GitLab Duo** | DevSecOpsプラットフォーム統合型 | CI/CDやセキュリティを含むライフサイクル全体をカバー。Agentic AIによる自律化。 | GitLab環境への依存。IDE補完の速度感。 | GitLabをメインのDevOps基盤として利用している場合。セキュリティ重視。 |
| **GitHub Copilot** | コーディング特化型 | 圧倒的なユーザー数とエコシステム。IDE体験の洗練度。 | ライフサイクル後半（運用・CI）の支援はGitLabに比べると限定的。 | GitHubを利用している、または純粋なコーディング支援を最優先する場合。 |
| **Amazon Q Developer** | AWS特化型 | AWSリソースの知識、AWSコンソールでの操作支援。 | AWS以外の環境での汎用性。 | AWSを中心としたクラウドネイティブ開発を行っている場合。 |

## **17. 総評**

* **総合的な評価**:
  GitLab Duoは、コードを書く「点」の支援だけでなく、ソフトウェアを開発・運用する「線・面」の支援を指向している点が最大の特徴です。特に**Agent Platform**の導入により、単なるアシスタントから「自律的なチームメイト」へと進化しつつあります。GitLabユーザーにとっては、追加のツール導入なしに高度なAI恩恵を受けられる必須級のソリューションです。
* **推奨されるチームやプロジェクト**:
  * セキュリティと開発スピードの両立（DevSecOps）を目指すエンタープライズチーム。
  * GitLab CI/CDを既に活用しており、パイプラインの効率化を図りたいプロジェクト。
* **選択時のポイント**:
  * 開発プラットフォームがGitLabかGitHubか（プラットフォームに合わせるのが基本）。
  * 「コーディングの快適さ」を最優先するか（Copilot有利）、「プロセス全体の効率化・安全性」を重視するか（Duo有利）。
