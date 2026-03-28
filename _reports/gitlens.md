---
title: GitLens 調査レポート
tool_name: GitLens
tool_reading: ギットレンズ
category: 開発者ツール
developer: GitKraken
official_site: https://www.gitkraken.com/gitlens
date: '2026-03-17'
last_updated: '2026-03-17'
tags:
  - Git
  - IDE拡張機能
  - VS Code拡張機能
description: VS CodeなどのIDEに高度なGit機能を追加し、コードの履歴や作成者を視覚化する強力な拡張機能。
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - 開発チーム
  latest_highlight: AIエージェント機能「GitKraken AI」や「Commit Composer」のプレビュー公開
  update_frequency: 高
evaluation:
  score: 83
  base_score: 70
  plus_points:
    - point: 5
      reason: VS Codeで最もダウンロードされているGit拡張機能としての高い実績
    - point: 5
      reason: インラインBlameや強力なCommit Graphなど、可視化機能が非常に優れている
    - point: 5
      reason: GitKraken AIなど、AIを活用した機能が積極的に導入されている
  minus_points:
    - point: -2
      reason: 機能が豊富すぎるため、初心者には設定や操作がやや複雑に感じる場合がある
  summary: Git履歴の可視化とチームコラボレーションを劇的に向上させる、モダンIDEに必須クラスの拡張機能。
links:
  github: https://github.com/gitkraken/vscode-gitlens
  deepwiki: https://deepwiki.com/gitkraken/vscode-gitlens
relationships:
  parent: GitKraken
  related_tools:
    - GitHub Copilot
---




# **GitLens 調査レポート**

## **1. 基本情報**

* **ツール名**: GitLens
* **ツールの読み方**: ギットレンズ
* **開発元**: GitKraken (Axosoft, LLC)
* **公式サイト**: [https://www.gitkraken.com/gitlens](https://www.gitkraken.com/gitlens)
* **関連リンク**:
  * GitHub: [https://github.com/gitkraken/vscode-gitlens](https://github.com/gitkraken/vscode-gitlens)
  * ドキュメント: [https://help.gitkraken.com/gitlens/gitlens-home/](https://help.gitkraken.com/gitlens/gitlens-home/)
* **カテゴリ**: 開発者ツール (Git拡張機能)
* **概要**: GitLensは、VS CodeなどのモダンIDE向けに提供されている強力なGit拡張機能です。インラインBlameやリッチなホバー表示によってコードの作成者や履歴を視覚化し、リポジトリの理解とコラボレーションを支援します。

## **2. 目的と主な利用シーン**

* **解決する課題**: リポジトリの履歴追跡の難しさ、コンテキストスイッチによる生産性低下、コードレビュー時のコミュニケーションの摩擦。
* **想定利用者**: ソフトウェア開発者、エンジニアリングチーム、コードレビュー担当者。
* **利用シーン**:
  * **Interactive Code History**: 複雑なブランチや複数の貢献者がいるリポジトリで、誰が、いつ、なぜコードを変更したかを理解する。
  * **Accelerate PR Reviews**: GitHubやGitLabなどのPRをIDE内で直接確認し、コンテキストスイッチを減らしてレビューを高速化する。
  * **Streamline Collaboration**: Cloud PatchesやCode Suggestを使用して、WIP(作業中)コードを共有したり、IDE上で直接提案を行ったりする。

## **3. 主要機能**

* **Inline Blame (インラインBlame)**: 現在の行やステータスバーに、その行を最後に変更した人、日時、理由を控えめに表示します。
* **Commit Graph (コミットグラフ)**: リポジトリの履歴を検索可能な色分けされたタイムラインとして視覚化し、ブランチの関係性やコミットの流れを直感的に把握できます（Pro機能）。
* **Launchpad**: GitHub、GitLabなどのプルリクエスト(PR)やIssueを統合し、レビューの優先順位付けやブロッカーの特定をIDE内で行えます。
* **GitKraken AI**: AIを活用して、コミットメッセージの生成、変更の要約、PRの説明作成、変更履歴(Changelog)の生成などを自動化します。
* **Cloud Workspaces & Worktrees**: 複数のリポジトリをグループ化して管理するCloud Workspacesや、現在のブランチから離れることなく別ブランチで作業できるWorktreesを提供します。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Visual Studio Code (または Cursor, Windsurf などの対応IDE) がインストールされていること。
  * Gitがインストールされていること。
* **インストール/導入**:
  * VS Codeの拡張機能ビュー（`Ctrl+Shift+X` または `Cmd+Shift+X`）を開く。
  * 「GitLens」で検索し、「Install」をクリックする。
  * （またはコマンドパレットから `ext install eamodio.gitlens` を実行）
* **初期設定**:
  * インストール後、ウェルカム画面やセットアップウィザードが表示され、機能の有効化やUIのカスタマイズを行えます。
  * 高度な機能（LaunchpadやAI機能）を利用する場合は、GitKrakenアカウントでのサインインや、GitHub/GitLabなどのリモートプロバイダーとの連携設定が必要です。
* **クイックスタート**:
  * Git管理下のプロジェクトを開き、コード内の任意の行にカーソルを合わせると、インラインBlameが表示されます。ホバーすると詳細情報が確認できます。

## **5. 特徴・強み (Pros)**

* **圧倒的な普及率と実績**: VS Code拡張機能として4,000万回以上のインストール実績があり、事実上の標準ツールとして多くの開発者に支持されています。
* **高度な可視化とナビゲーション**: Blame、CodeLens、File Historyなど、コードの文脈を理解するための視覚的ツールが豊富で、エディタから離れることなくGitの履歴を深く探索できます。
* **シームレスな統合**: GitHub、GitLab、Jira、Azure DevOpsなど多数のプラットフォームと強力に連携し、IssueやPRをIDE内で直接管理できます。
* **AIによる生産性向上**: GitKraken AIにより、面倒なコミットメッセージの作成やPRの説明文作成を自動化し、開発者の負担を軽減します。

## **6. 弱み・注意点 (Cons)**

* **機能の多さと学習コスト**:非常に多くの機能を持つため、すべての機能を使いこなすまでに時間がかかる可能性があります。初心者にとっては設定項目が多く、直感的に操作できない場面もあります。
* **Pro機能との区別**: Community版（無料）でも強力な機能を利用できますが、Commit Graphの高度な操作や、プライベートリポジトリにおける高度な視覚化、Cloud PatchesなどはProライセンスが必要です。
* **日本語対応の状況**: UIやドキュメントは主に英語で提供されており、機能の深い理解やサポートの利用には英語力が求められます。設定名なども英語のまま使用することが一般的です。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Community** | 無料 | パブリック/ローカルリポジトリ向けの強力なGit拡張。インラインBlame、CodeLens、ファイル履歴ナビゲーションなど。 |
| **Pro** | $X/月 | プライベートリポジトリでの全機能へのアクセス。高度なCommit Graph、Worktrees、Visual File History、GitKraken AI機能など。 |
| **Advanced** | $X/月 | AI Changelog Creation、AI Pull Request Creationなどのより高度なAI機能。 |
| **Business** | $X/月 | 企業向けのセキュリティや管理機能、シングルサインオン(SSO)など。 |

* **課金体系**: サブスクリプションベース（年額/月額などの詳細な価格はGitKraken公式サイトを参照）。
* **無料トライアル**: 新規サインアップで、Pro機能のフリートライアルを利用可能です。

## **8. 導入実績・事例**

* **導入企業**: 4,000万回以上のインストール実績があり、世界中の多くのソフトウェア開発企業やオープンソースプロジェクトで利用されています。
* **導入事例**: 特定のエンタープライズ事例は公開されていませんが、GitHubの数多くのリポジトリでデファクトスタンダードとして利用されています。
* **対象業界**: ソフトウェア開発、ITサービス、システムインテグレーションなど、コードを管理するあらゆる業界。

## **9. サポート体制**

* **ドキュメント**: [GitLens Help Center](https://help.gitkraken.com/gitlens/gitlens-home/) にて、各機能のチュートリアルやFAQが詳細に解説されています。
* **コミュニティ**: GitHub Discussions や GitKrakenのSlackコミュニティなど、ユーザー同士で情報交換を行える場が活発に運営されています。
* **公式サポート**: GitHubのIssuesを利用したバグ報告や機能改善要望が可能で、Proライセンスユーザーは優先的なメールサポート（カスタマーサクセスチーム）を受けることができます。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: GitLensの拡張機能自体を操作する公開APIは一般的に提供されていませんが、GitKrakenのエコシステム(APIやCLI)と密接に連携します。
* **外部サービス連携**:
  * **Gitホスティング**: GitHub, GitLab, Bitbucket, Azure DevOps, Gitea, Gerrit
  * **課題管理**: Jira, Trello, Zendesk (カスタムAuto-linksによる連携)
  * **AI/LLM**: Google Gemini, OpenAI, Anthropic, DeepSeek, GitHub Copilot

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **VS Code** | ◎ | ファーストクラスサポート。エディタのUIとシームレスに統合 | 特になし |
| **Cursor / Windsurf / Trae** | ◎ | AIを統合した最新のIDEでも公式にサポート | 各IDEのAI機能との使い分けが必要 |
| **Kiro** | ◎ | GitKrakenが提供するIDE環境とも強力に連携 | 開発環境に依存する |
| **JetBrains (IntelliJ等)** | △ | 近日公開予定 (Coming Soon) | 現時点ではVS Codeほどの統合は未提供 |

## **11. セキュリティとコンプライアンス**

* **認証**: Gitプロバイダー(GitHub, GitLab等)の認証を標準のOAuthやアクセストークン経由で行います。
* **データ管理**: 基本的にコードデータはローカルのGitリポジトリや各Gitプロバイダーに保存されますが、Cloud PatchesやCloud Workspaces機能を利用する際は、GitKrakenのクラウドサービス(Enterprise grade)を経由します。
* **準拠規格**: GitKraken社として、エンタープライズ向けのセキュリティ(SSOやアクセスコントロール)を提供し、大規模組織での利用にも対応する「Trust Center」を運用しています。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: VS Codeのソースコントロールビューやステータスバー、エディタ画面に統合されるため、GitLens自体が独立したUIを持つというより、エディタの機能を拡張するような感覚で利用できます。表示されるBlameやヒートマップは直感的で視覚的な理解を助けます。
* **学習コスト**: 基本的なインラインBlameやリビジョンナビゲーションの利用はインストール後すぐに活用できますが、Commit GraphやWorktrees、Interactive Rebase Editorなどの高度な機能を使いこなすためには、Gitの深い知識とツールの操作方法の両方を学習する必要があります。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Launchpadの活用**: GitHubやGitLabでPRレビューを行う際、ブラウザを開かずにIDE内のLaunchpadで一覧を確認し、コードコンテキストを保持したままレビューを行うことで、コンテキストスイッチを防ぎます。
  * **Cloud Patches**: WIPのコード変更についてフィードバックを求める際、コミットを作ってプッシュするのではなく、Cloud Patchesを利用して直接変更を共有し、チームでプレビュー・議論を行う。
  * **Commit Composer**: AIにコミットメッセージをドラフトさせ、手動でレビュー・調整してからコミットすることで、品質の高いGit履歴を効率的に作成する。
* **陥りやすい罠 (Antipatterns)**:
  * **情報過多**: デフォルトの設定ではすべてのファイルの行末にBlame情報が表示されるため、コードの可読性を損なうと感じる場合があります。不要な機能はコマンドパレット(Toggle Line Blame等)からオフにして利用するのが推奨されます。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitKraken公式サイトの証言、VS Code Marketplaceのレビュー、X(旧Twitter)
* **総合評価**: VS Code拡張機能として非常に高く評価されており、事実上のデファクトスタンダードとして認知されています。
* **ポジティブな評価**:
  * 「GitLensのコミットグラフ機能は、これまで使ったどのGit GUIよりも優れている。」(Xのユーザー)
  * 「インラインBlameや履歴機能がVS Code標準であるかのように馴染んでおり、誰がいつ変更したかが一瞬でわかる。」
  * 「誰もがGitエキスパートになったように感じさせてくれるツール。」
* **ネガティブな評価 / 改善要望**:
  * 「無料版とPro版の違いが分かりにくく、以前は無料だった一部の高度な視覚化機能が有料化されていることに不満を持つことがある。」
  * 「機能が多すぎて設定画面が複雑になっている。初心者にはハードルが高い。」
* **特徴的なユースケース**:
  * 過去のコード改修におけるバグ発生の原因を特定するために、インラインBlameから関連PRを即座に開き、当時の仕様議論（IssueやPRのコメント）をIDE内で直接確認する用途。

## **15. 直近半年のアップデート情報**

* **2026-02-11 (v17.10)**: AIを活用した機能の拡充とパフォーマンスの最適化を含むメジャーアップデート。
* **2026-01-13 (v17.9)**: 新たな機能追加とバグ修正、Commit Graphなどの改善。
* **2025-12-17 (v17.8)**: Workspaces機能の強化と、AIプロンプトの改善によるCommit Composerの精度向上。
* **2025-11-11 (v17.7)**: GitKraken MCP (Model Context Protocol) を通じたAIアシスタントとの連携機能を導入し、Git履歴とIssueコンテキストの提供を可能に。
* **2025-10-07 (v17.6)**: 多数のファイル変更があるリポジトリでのパフォーマンス向上、LaunchpadのUX改善。

(出典: [GitKraken Releases/Changelog](https://github.com/gitkraken/vscode-gitlens/releases) / GitClear 記録)

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | GitLens | GitKraken Desktop | GitHub Desktop | Git Graph (VS Code) |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | 履歴可視化 | ◎<br><small>詳細なBlameとグラフ</small> | ◎<br><small>GUIとして強力</small> | ◯<br><small>基本的な履歴</small> | ◯<br><small>軽量なグラフ表示</small> |
| **カテゴリ特定** | IDE統合 | ◎<br><small>VS Code等に完全統合</small> | △<br><small>独立したアプリ</small> | △<br><small>独立したアプリ</small> | ◎<br><small>VS Codeに統合</small> |
| **高度な操作** | Worktrees | ◯<br><small>Pro機能で対応</small> | ◎<br><small>標準対応</small> | ×<br><small>非対応</small> | ×<br><small>非対応</small> |
| **AI連携** | コミット生成等 | ◎<br><small>GitKraken AI搭載</small> | ◎<br><small>GitKraken AI搭載</small> | ×<br><small>サードパーティ頼り</small> | ×<br><small>非対応</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **GitLens** | VS Code等のIDE拡張として動作するGit機能強化ツール。 | エディタから離れることなく、コード作成者の文脈や履歴をインラインで確認できる。 | 全ての機能（特に高度なグラフやコラボレーション）を利用するには有料のProライセンスが必要。 | VS Codeを主軸にしており、コンテキストスイッチを最小限に抑えたい開発者。 |
| **GitKraken Desktop** | 独立したスタンドアロンの強力なGit GUIクライアント。 | OSに依存せず、複雑なGit操作をドラッグ＆ドロップなどの直感的なUIで安全に行える。 | IDEとは別のアプリを立ち上げて操作する必要がある。 | リポジトリ全体を俯瞰し、コンフリクトの解消やリベースなどの複雑な操作を安全に行いたい場合。 |
| **GitHub Desktop** | GitHub公式の無料Gitクライアント。 | 完全無料で利用でき、GitHubとの連携が非常にスムーズ。初心者に優しいUI。 | 高度なGit操作（Worktrees、複雑なリベース等）には対応していない。 | GitHubを利用しており、複雑なGit操作を必要としない初心者やデザイナー。 |
| **Git Graph** | VS Codeのオープンソース拡張機能。 | 軽量で高速に動作し、コミットグラフを視覚的に表示する機能に特化。無料。 | GitLensのような強力なインラインBlameやAI機能、PR連携などの高度な機能はない。 | インラインBlameなどは不要で、単にコミットグラフだけをVS Code内で確認したい場合。 |

## **17. 総評**

* **総合的な評価**:
  * GitLensは、VS Codeエコシステムにおいて不可欠と言えるほど強力なGit拡張機能です。単なるコミット履歴の表示にとどまらず、インラインBlame、LaunchpadによるPR統合、Cloud PatchesやAI機能の導入など、開発者の生産性を飛躍的に高める機能を継続的に提供しています。Community版でも十分な価値を提供しますが、Pro版の機能はチーム開発において非常に強力です。
* **推奨されるチームやプロジェクト**:
  * VS Code, Cursor, Windsurfなどの対応IDEを標準エディタとしているチーム。
  * 大規模なリポジトリを扱い、コードの変更意図や文脈を素早く理解する必要があるプロジェクト。
  * PRレビューの効率化や、WIPコードの早期共有を推進したい開発チーム。
* **選択時のポイント**:
  * コマンドラインでのGit操作に習熟している場合でも、インラインでの視覚的なフィードバックは非常に有益です。ただし、無料版ではグラフ表示などに制限があるため、チーム全体でPro機能（AI連携やCloud Workspacesなど）の恩恵を受けられるかどうかが、有償ライセンス導入の判断基準となります。スタンドアロンのGUIが必要な場合はGitKraken Desktop、エディタ完結ならGitLensという使い分けが推奨されます。
