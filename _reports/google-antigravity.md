---
# === フロントマター ===
# 【必須項目】
title: "Google Antigravity 調査レポート"
tool_name: "Google Antigravity"
tool_reading: "グーグル アンチグラビティ"
category: "AIコードエディタ"
developer: "Google"
official_site: "https://antigravity.google/"
date: "2026-02-28"
last_updated: "2026-02-28"
tags:
  - "AI"
  - "コーディング支援"
  - "IDE"
  - "エージェント"
  - "開発者ツール"
description: "AIを単なるツールではなく自律的なアクターとして活用する、エージェントファーストな新しい開発プラットフォーム。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: false
  starting_price: "無料"
  target_users:
    - "開発者"
  latest_highlight: "2026年2月にAccount Remediation Pathwayを追加（v1.19.6）"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 8
      reason: "複数のエージェントを非同期に並行して動作させ、それぞれがタスクを計画・実行・検証できる強力なAgent Manager機能"
    - point: 5
      reason: "VS Codeをフォークしており、既存の開発者に馴染みのあるEditor Viewを保持している"
    - point: 4
      reason: "Artifactsを用いたフィードバックループにより、レビューと軌道修正がGoogle Docsのように直感的に行える"
    - point: 3
      reason: "ブラウザと深く統合され、UIの変更やエンドツーエンドのテストを自律的に確認可能"
  minus_points:
    - point: -3
      reason: "AIエージェントに自律的にターミナルやブラウザを操作させることによるセキュリティ上の懸念事項やリスクへの対策（Allow List, Deny List等）の適切な運用が必要"
    - point: -2
      reason: "新しいプレビュー版ツールであり、まだ成熟途上にある"
  summary: "強力な自律型マルチエージェントオーケストレーションと、親しみやすいVS CodeベースのUIを融合させた、革新的な次世代AI開発プラットフォーム。"

# 【任意項目】該当するもののみ記載
links:
  documentation: "https://antigravity.google/docs"
relationships:
  related_tools:
    - "Visual Studio Code"
    - "Cursor"
    - "Windsurf"
---

# **Google Antigravity 調査レポート**

## **1. 基本情報**

* **ツール名**: Google Antigravity
* **ツールの読み方**: グーグル アンチグラビティ
* **開発元**: Google
* **公式サイト**: [https://antigravity.google/](https://antigravity.google/)
* **関連リンク**:
  * ドキュメント: [https://antigravity.google/docs](https://antigravity.google/docs)
  * ユースケース: [https://antigravity.google/use-cases](https://antigravity.google/use-cases)
  * ダウンロード: [https://antigravity.google/download](https://antigravity.google/download)
  * 公式ブログ記事: [Build with Google Antigravity, our new agentic development platform](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
* **カテゴリ**: AIコードエディタ
* **概要**: Google Antigravityは、単なるコード補完ツールではなく、AIを「自律的なアクター」として前提とした新しいエージェントファーストな開発プラットフォームです。VS Codeをフォークした親しみやすいエディタに、エージェントを管理・監視する「Mission Control」機能を追加し、エディタ・ターミナル・ブラウザ横断の複雑なタスクを並行処理させることができます。

## **2. 目的と主な利用シーン**

* **解決する課題**: 単一のチャットUIでの同期的かつ限定的なAI対話の限界を超え、複数タスクの非同期・並行処理や、ブラウザでの検証まで含めたエンドツーエンドの開発プロセスを自律化することで、コンテキストスイッチを削減する。
* **想定利用者**: 個人開発者、AIを活用して生産性を大幅に向上させたいソフトウェアエンジニア。
* **利用シーン**:
  * バックグラウンドでの長時間かかるメンテナンスタスクやバグ修正の委任
  * 新機能のコード生成から、ターミナルでの起動、ブラウザでのテスト・検証までの自動化
  * UI変更の依頼と、スクリーンショットや動画等によるArtifactsを介した直感的なレビュー
  * 同時に複数のバグや機能を、複数のエージェントに並行して作業させる

## **3. 主要機能**

* **Agent Manager (Mission Control)**: ファイルツリーではなく、複数エージェントを同時にスポーンし、監視・操作するためのダッシュボード。非同期で進む複数のワークストリームを視覚化します。
* **Editor View**: VS Codeをベースにした従来のエディタ画面で、インライン補完や自然言語によるコマンド(`Cmd + I`)など、同期的なハンズオン作業が可能です。
* **Artifacts (成果物)**: エージェントが作業の進捗や結果を示すために作成する、マークダウン、タスクリスト、実装計画、コード差分、ブラウザ動画・スクリーンショットなどの成果物。Google Docsのようなコメント機能で直感的にフィードバックが可能です。
* **Antigravity Browser / Subagent**: 専用のブラウザサブエージェントが、実際にブラウザを操作（クリック、スクロール、タイピング等）し、Webサイトの閲覧やアプリの検証を自律的に行います。
* **Skills (プログレッシブ・ディスクロージャー)**: プロジェクトに特有の知識やコーディング規約などを「スキル」として定義し、必要な時だけエージェントのコンテキストにロードさせる機能（ツールブロートの防止）。
* **Rules & Workflows**: エージェントの挙動をカスタマイズするためのガイドライン（Rules）や、オンデマンドで呼び出せる保存済みのプロンプトセット（Workflows）。
* **セキュリティ・ポリシー制御**: エージェントによるターミナルやブラウザの操作に対する権限管理機能（Secure Mode、Allow List / Deny List、JavaScript実行ポリシーなど）。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * 個人のGmailアカウント
  * Chromeブラウザ
  * ローカルマシン (macOS, Windows, Linux)
* **インストール/導入**:
  公式サイトからOSに合ったインストーラーをダウンロードしてインストールします。
* **初期設定**:
  1. 初回起動時に、既存のVS CodeやCursorの設定をインポートするか選択。
  2. エージェントの自律性レベル（Terminal Execution policy, Review policy, JavaScript Execution policy）を設定。「Review-driven development」などが選択可能。
  3. GmailアカウントでGoogleにサインイン。
* **クイックスタート**:
  * Agent Manager画面の「Playground」や、開いたワークスペースから対話を開始。
  * 「Planningモード」または「Fastモード」を選び、プロンプトを入力してエージェントにタスクを依頼する。

## **5. 特徴・強み (Pros)**

* **強力なマルチエージェント管理**: 単一のチャットではなく、Agent Managerを通じて複数のエージェントを並行動作させられるため、作業スループットが劇的に向上する。
* **検証の自動化と可視化 (Artifacts)**: エージェントがコードを書きっぱなしにするのではなく、ブラウザで動作確認した動画やスクリーンショットなどの成果物(Artifacts)を提出するため、信頼性("Trust Gap"の解消)が担保される。
* **VS Codeベースの親和性**: エディタ部分はVS Codeをフォークしているため、既存の拡張機能やキーバインド、UI操作などのマッスルメモリーをそのまま活かせる。
* **Skillsによるコンテキスト最適化**: 巨大なプロンプトを毎回送るのではなく、特定条件で発火するスキルパッケージを構築することで、トークン節約と精度向上を両立できる。

## **6. 弱み・注意点 (Cons)**

* **セキュリティリスク**: エージェントが自律的にターミナルコマンドの実行やブラウザ操作を行うため、Prompt Injectionやデータ流出などの潜在的リスクがある（これを防ぐためのポリシー管理が必要）。
* **プレビュー版であること**: 現在は個人用Gmailアカウント向けのプレビュー版としての提供であり、一部機能の安定性やエンタープライズ機能において未知数な部分がある。
* **利用モデルの制限**: ローカル環境ではなくクラウドモデル(Gemini 3 Pro, Claude 3.5 Sonnet等)への依存があり、無料クォータ等の制限がある点に留意が必要。
* **日本語対応**: UIや公式ドキュメントは英語が中心であり、日本語での完全なローカライズ状況については確認が必要です。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **プレビュー版** | 無料 | 個人用Gmailアカウントで利用可能。主要モデル（Gemini 3 Pro等）の利用枠（無料クォータ）が付属。 |

* **課金体系**: 現在はプレビュー版として無償提供中。
* **無料トライアル**: 上記の通りプレビュー版として利用可能。

## **8. 導入実績・事例**

* **導入企業**: 公式ブログにてパブリックプレビューとして発表されたばかりのツールであるため、具体的な大企業の導入事例などは広く公開されていない。
* **導入事例**: Codelabsなどで、カンファレンスサイトの構築や生産性アプリの作成、GCPへのデプロイなどのユースケースが紹介されている。
* **対象業界**: ソフトウェア開発全般。

## **9. サポート体制**

* **ドキュメント**: 公式ドキュメント、ユースケース集、Google Codelabsのチュートリアルが提供されている。
* **コミュニティ**: YouTube公式チャンネル(`@googleantigravity`)など。
* **公式サポート**: アプリケーション内の Agent Manager や Editor 画面からフィードバック(Report Issue)を送信可能。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: MCP (Model Context Protocol) サーバーへの接続をサポート（エディタ内から `@` を使用して MCP サーバーを参照可能）。
* **外部サービス連携**: Chromeブラウザ（専用の拡張機能を介したブラウザ自動化連携）、Google Cloud Platform（Codelabsにて連携・デプロイ方法が公開）。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | チュートリアル等でもFlask/FastAPIを利用したアプリ作成が紹介されており、親和性が高い。 | 特になし |
| **Webフロントエンド (HTML/CSS/JS)** | ◎ | Antigravity Browserを用いたUIプレビューや検証の自動化が非常に効果的。 | 複雑なSPA時のブラウザエージェントの挙動確認が必要。 |
| **Google Cloud** | ◎ | Googleの公式ツールであり、デプロイや連携ガイドラインが整備されている。 | 特になし |

## **11. セキュリティとコンプライアンス**

* **認証**: 個人のGoogleアカウント (Gmail) による認証。
* **データ管理**: 詳細は公式サイトのプライバシーポリシーに準拠するが、セキュリティ設定において「Secure Mode」や「Terminal Command Auto Execution (Allow/Deny List)」などが利用者に提供されている。
* **準拠規格**: 公式サイトでは公開されていない。問い合わせが必要。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Editor部分はVS Codeベースであり非常に馴染み深い。一方、Agent Manager画面は複数エージェントをダッシュボード形式で管理するユニークなUXであり、高い可視性を誇る。
* **学習コスト**: VS Code自体の操作には学習コストはかからないが、Agent Managerを用いた非同期タスクの割り振りや、Rules / Workflows / Skills などの設定、セキュリティポリシーのチューニングには一定の学習が必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Planning ModeとFast Modeの使い分け**: 複雑な調査や実装はPlanningモードで行い、Artifacts（タスクリスト等）を確認する。単純な修正やコマンド実行はFastモードで迅速に行う。
  * **Skillsの構築**: グローバルおよびワークスペースごとにSKILL.mdを作成し、コーディング規約やレビュー観点を「スキル」としてエージェントにプログレッシブに読み込ませることで、トークン削減と精度向上を図る。
  * **Artifactsでのレビュー**: エージェントが提示する実装計画やコード差分、ブラウザでの動作検証ビデオに対して、Google Docsライクなコメント機能で的確にフィードバックを行う。
* **陥りやすい罠 (Antipatterns)**:
  * **チャットへの過度な依存**: エージェントに全てを任せて同期的に待つのではなく、Agent Managerを利用して非同期にタスクを複数走らせないこと（Antigravityの強みを活かせない）。
  * **セキュリティポリシーの過信**: Terminal Auto Executionを「Turbo」に設定しつつ、Deny Listのメンテナンスを怠ること。特に外部サイトからのPrompt Injectionリスクには注意が必要。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: Googleによる公式発表およびチュートリアル（プレビュー公開直後のため、G2等の外部レビューサイトへの登録なし）
* **総合評価**: 評価データ不足
* **ポジティブな評価**:
  * 「チャットボットがサイドバーにいるだけでなく、独立したワークスペースを持って自律的に検証まで行うアプローチが新しい」
  * 「ブラウザの操作動画をArtifactとして提出してくれるため、コードを見なくても意図通り動くか確認できる」
* **ネガティブな評価 / 改善要望**:
  * プレビュー版リリース直後のため、利用者の声はまだ十分に蓄積されていない。
* **特徴的なユースケース**:
  * バグの再現、テストケースの生成、修正の実施までをバックグラウンドでエージェントに完全委任するケース。

## **15. 直近半年のアップデート情報**

* **2026-02-26 (v1.19.6)**: Account Remediation Pathway
* **2026-02-26 (v1.19.5)**: Browser Fix
* **2026-02-25 (v1.19.4)**: Stability and UI Improvements
* **2026-02-21 (v1.18.4)**: Fix for Windows Auto-updater
* **2026-02-19 (v1.18.3)**: Settings, Artifacts, and Stability
* **2026-02-03 (v1.16.5)**: Bug Fixes
* **2026-01-24 (v1.15.8)**: Performance Improvements
* **2026-01-23 (v1.15.6)**: Terminal Sandboxing
* **2026-01-13 (v1.14.2)**: Agent Skills
* **2025-12-19 (v1.13.3)**: Google Workspace Support
* **2025-12-17 (v1.12.4)**: Gemini 3 Flash
* **2025-12-08 (v1.11.17)**: Secure Mode and Security Fixes
* **2025-12-04 (v1.11.14)**: Google One Support
* **2025-11-26 (v1.11.9)**: Stability and Bug Fixes
* **2025-11-20 (v1.11.5)**: Nano Banana Pro
* **2025-11-18 (v1.11.3)**: Launch Day Feedback
* **2025-11-18 (v1.11.2)**: Google Antigravity

(出典: [公式ブログ](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/) / [Changelog](https://antigravity.google/changelog))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (Antigravity) | Cursor | Windsurf | VS Code |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | エディタ統合 | ◎<br><small>VS Codeフォーク</small> | ◎<br><small>VS Codeフォーク</small> | ◎<br><small>独自IDEとプラグイン</small> | -<br><small>ベース</small> |
| **カテゴリ特定** | エージェント自律性 | ◎<br><small>複数並行・ブラウザ操作</small> | ◎<br><small>Multi-Agent機能</small> | ◎<br><small>Cascadeエージェント</small> | ×<br><small>なし</small> |
| **エンタープライズ** | 検証の自動化 | ◎<br><small>動画等Artifactを生成</small> | △<br><small>ブラウザ自動化は弱い</small> | ◯<br><small>ライブプレビュー搭載</small> | ×<br><small>なし</small> |
| **非機能要件** | セキュリティ管理 | ◯<br><small>細かい実行ポリシー管理</small> | ◯<br><small>SOC2等</small> | ◎<br><small>SOC2/FedRAMP</small> | ◎<br><small>標準機能</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Google Antigravity** | Agent Managerとブラウザ操作能力を備えた新しい開発環境。 | 複数エージェントの非同期オーケストレーション。ブラウザを操作してArtifact（成果物・動画）を作成し、視覚的なレビューが可能。 | まだパブリックプレビュー段階であり、コミュニティや知見が発展途上。 | コーディングだけでなく、ブラウザのテストやターミナル操作を含めたエンドツーエンドのタスクを並行して任せたい場合。 |
| **Cursor** | VS CodeベースのAIネイティブエディタの先駆者。 | Composer機能や既存の膨大なVS Codeエコシステムとの高い互換性。 | 月額料金やリソース消費の課題がある。 | エディタ内での複雑なファイル横断リファクタリングや、実績あるAIエディタを使いたい場合。 |
| **Windsurf** | 直感的なライブプレビューとCascadeエージェントを搭載。 | プラグインとしての導入も可能。UI変更のリアルタイム確認に優れる。 | コミュニティやエコシステムが発展途上。 | フロントエンド開発で即座のプレビューを重視する場合や、既存IDEを使い続けたい場合。 |
| **VS Code** | 世界標準のオープンソースエディタ。 | 圧倒的な拡張機能数と安定性。 | デフォルトで高度な自律型AIエージェント機能は搭載されていない。 | 特定のAI機能にロックインされず、自分の好きなツールを組み合わせて環境構築したい場合。 |

## **17. 総評**

* **総合的な評価**:
  Google Antigravityは、これまでの「人間のコーディングをAIが補完する」というアプローチから、「AIエージェントの作業を人間がマネジメントする」というパラダイムシフトを体現する強力なプラットフォームです。VS CodeベースのEditor Viewによる手動開発の快適さを保ちつつ、Agent Managerを通じて複数のタスクを並行してAIに委任できる点が最大の魅力です。さらに、Antigravity Browserによるテスト実行や、Artifact（動画やスクリーンショット）による検証プロセスは、LLMに対する信頼（Trust Gap）の構築に大きく寄与します。
* **推奨されるチームやプロジェクト**:
  日常的に複数のバグ修正やリファクタリング、新機能開発などの並行タスクを抱えている開発者。特にバックグラウンドでテストやブラウザ検証を走らせながら別作業を進めたい、フルスタックエンジニアに最適です。
* **選択時のポイント**:
  プレビュー版であるため、商用プロジェクトでの全面導入には慎重さが求められます。しかし、Cursorなどのエディタ内作業に限定されたAI体験に限界を感じており、ターミナル操作やブラウザ検証を含めた「自律的タスク遂行」を求める開発者にとっては、次に試すべき最も魅力的な選択肢となります。
