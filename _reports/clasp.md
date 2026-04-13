---
title: clasp 調査レポート
tool_name: clasp
tool_reading: クラスプ
category: 開発ライフサイクル管理
developer: Google
official_site: https://developers.google.com/apps-script/guides/clasp
date: '2026-03-27'
last_updated: '2026-03-27'
tags:
  - Apps Script
  - CLI
  - Google Workspace
  - オープンソース
description: Google Apps Scriptプロジェクトをローカルで開発・管理するためのコマンドラインツール
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - Google Workspace管理者
  latest_highlight: 実験的機能としてMCP（Model Context Protocol）をサポート
  update_frequency: 中
evaluation:
  score: 83
  base_score: 70
  plus_points:
    - point: 5
      reason: Apps Scriptのローカル開発・Git管理を可能にする必須ツール
    - point: 4
      reason: Google公式がサポート・提供していることによる信頼性
    - point: 4
      reason: AIエージェント向けのMCPサポートなど先進的な機能の追加
  minus_points:
    - point: -2
      reason: TypeScriptの直接コンパイルサポートがバージョン3.xで廃止され、外部バンドラーが必要となった
  summary: GAS開発をモダンにする強力なCLIツール。3.x以降はTypeScript対応に工夫が必要だが、エコシステム統合により価値が高い。
links:
  github: https://github.com/google/clasp
  codewiki: https://codewiki.google/github.com/google/clasp
  deepwiki: https://deepwiki.com/google/clasp
  documentation: https://github.com/google/clasp/tree/master/docs
relationships:
  parent: null
---




# **clasp 調査レポート**

## **1. 基本情報**

* **ツール名**: clasp (Command Line Apps Script Projects)
* **ツールの読み方**: クラスプ
* **開発元**: Google (OSSプロジェクト)
* **公式サイト**: [https://developers.google.com/apps-script/guides/clasp](https://developers.google.com/apps-script/guides/clasp)
* **関連リンク**:
  * GitHub: [https://github.com/google/clasp](https://github.com/google/clasp)
  * ドキュメント: [https://github.com/google/clasp/tree/master/docs](https://github.com/google/clasp/tree/master/docs)
* **カテゴリ**: 開発者ツール
* **概要**: claspはGoogle Apps Script（GAS）のプロジェクトをブラウザ上のエディタではなく、ローカル環境のターミナルから開発・デプロイ・管理できるようにするオープンソースのCLIツールである。コードをGitなどでバージョン管理可能にし、モダンな開発フローを実現する。

## **2. 目的と主な利用シーン**

* **解決する課題**: 従来のGAS開発はブラウザ上のWebエディタに依存しており、Gitによるバージョン管理やチームでの並行開発、使い慣れたローカルエディタ（VS Codeなど）の使用が困難だった。claspはこれを解決し、GAS開発にモダンな開発ワークフローをもたらす。
* **想定利用者**: GASを使用するソフトウェアエンジニア、社内ツール開発者、Google Workspace管理者
* **利用シーン**:
  * ローカルのVS Codeで補完機能（TypeScriptの型定義など）を使いながらGASを開発する
  * GitHub等でGASのソースコードを管理し、チームでコードレビュー（Pull Request）を行う
  * CI/CDパイプラインにGASのデプロイを組み込む

## **3. 主要機能**

* **ローカル開発環境の構築 (`clasp clone` / `clasp pull` / `clasp push`)**: GASのコードをローカルファイルにダウンロード・アップロードし、好きなエディタで編集可能にする。
* **プロジェクトの作成・管理 (`clasp create` / `clasp open`)**: コマンドラインから新しいGASプロジェクト（スタンドアロンまたはコンテナバインド）を作成したり、ブラウザで該当プロジェクトを開いたりできる。
* **バージョニングとデプロイメントの管理 (`clasp version` / `clasp deploy`)**: GASプロジェクトのバージョン作成と、Webアプリやアドオンとしてのデプロイの管理を行う。
* **ローカルディレクトリの構造化**: script.google.com上のフラットなファイル構成をローカルではフォルダ構成で管理できる。アップロード時に自動変換される。
* **リモート関数の実行 (`clasp run`)**: コマンドラインから直接GASの関数を実行し、パラメータを渡すことができる（要設定）。
* **AIエージェント対応 (MCP - 実験的機能)**: Model Context Protocol (MCP) をサポートし、Claude CodeやGemini CLIなどのAIエージェントからclaspを操作・利用可能にする。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js v22.0.0 以上
  * Googleアカウント
  * Google Apps Script APIの有効化 ([https://script.google.com/home/usersettings](https://script.google.com/home/usersettings))
* **インストール/導入**:
  ```bash
  # グローバルにインストール
  npm install -g @google/clasp
  ```
* **初期設定**:
  ```bash
  # Googleアカウントでログインして認証情報を保存
  clasp login
  ```
* **クイックスタート**:
  ```bash
  # 新規プロジェクトの作成 (デフォルトはスタンドアロン)
  clasp create --title "My Script"

  # ローカルの変更をGAS環境にプッシュ
  clasp push
  ```

## **5. 特徴・強み (Pros)**

* **Gitとのシームレスな統合**: GASコードをGitで管理できるようになり、チーム開発の効率とコードの品質（レビュープロセス）が劇的に向上する。
* **好きなエディタを使用可能**: VS Codeなどの高機能エディタで開発できるため、Lintツールやコードフォーマッター（Prettier、ESLint等）を活用できる。
* **最新AIツールとの連携**: MCPのサポートにより、AIコーディングアシスタントからGASプロジェクトを直接操作可能になるなど、将来性が高い。
* **ファイル構造の保持**: ローカルのディレクトリ構造を維持して開発できるため、大規模なスクリプトでも整理しやすい。

## **6. 弱み・注意点 (Cons)**

* **TypeScriptの直接サポートの廃止 (v3.x以降)**: 以前はclaspがTypeScriptのトランスパイルを行っていたが、v3.xで廃止された。現在はRollupなどのバンドラーを別途設定してトランスパイルしてからプッシュする必要がある。
* **アトミックプッシュ**: 差分アップロードではなく、`clasp push`時にプロジェクト全体が上書きされる仕様のため、複数人が同時に同じGASプロジェクトを触る場合は競合に注意が必要。
* **Node.jsのバージョン要件**: 最新版はNode.js v22.0.0以上を要求するため、古い環境ではアップデートが必要。
* **日本語対応**: ツール自体の出力は英語だが、操作はコマンドベースであり、日本のユーザーコミュニティも活発なため情報収集には困らない。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソースプラン** | 無料 | オープンソースソフトウェア (Apache-2.0 license) として提供。全機能が無料で利用可能。 |

* **課金体系**: 完全無料
* **無料トライアル**: なし（常に無料）

## **8. 導入実績・事例**

* **導入企業**: オープンソースツールであり公式な導入企業リストはないが、GitHubのStar数は5.6kを超えており（2026年3月現在）、世界中のGAS開発者に広く利用されているデファクトスタンダードである。
* **導入事例**: 日本国内でも数多くのテックブログ（Zenn, Qiita, 企業の開発者ブログ）で、GAS開発のCI/CD構築やチーム開発標準ツールとして紹介・導入されている。
* **対象業界**: 業界を問わず、Google Workspaceを利用し、業務効率化やシステム連携を行うすべての企業・開発チーム。

## **9. サポート体制**

* **ドキュメント**: GitHubリポジトリ上のREADMEおよび `docs/` ディレクトリに詳細なコマンド仕様やガイドが記載されている。
* **コミュニティ**: GitHub Issuesでのバグ報告や機能要望が可能。Stack Overflowでの `google-apps-script` タグでも質問が行われている。
* **公式サポート**: 公式なSLA付きサポートはない。オープンソースコミュニティ主導で保守されている。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: 内部的にはGoogle Apps Script APIを利用して動作している。
* **外部サービス連携**: AI CLI拡張として、Gemini CLI (`gemini extensions install https://github.com/google/clasp`) や Claude Code CLI (`/plugin install @google/clasp`) にMCPサーバーとして統合可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **TypeScript / Rollup** | ◯ | 安全な型定義を利用した開発が可能。 | バージョン3.x以降は自前でビルドパイプライン（Rollup等）を構築する必要がある。 |
| **GitHub Actions** | ◎ | CI/CDパイプラインに組み込みやすく、メインブランチマージ時の自動デプロイが実現可能。 | 認証用のクレデンシャル情報をSecretに安全に保存する設定が必要。 |
| **Node.js / npm** | ◎ | npmモジュールとして配布されており、プロジェクトごとに `package.json` で管理可能。 | 特になし。 |

## **11. セキュリティとコンプライアンス**

* **認証**: OAuth 2.0を利用してGoogleアカウントで認証する（`clasp login`）。クレデンシャルはローカルの `.clasprc.json` に保存される。
* **データ管理**: 独自のサービスインフラは持たず、データはユーザーのローカルマシンとGoogleのサーバー（Google Drive/Apps Script）間のみで通信される。
* **準拠規格**: ツール自体はOSSであるため特定のコンプライアンス認証は持たないが、通信先であるGoogle WorkspaceはISO 27001、SOC 2等の規格に準拠している。エンタープライズ環境では自身のGCPプロジェクトのOAuthクライアントを利用することも推奨されている。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: シンプルで標準的なCLIインターフェースを持つ。コマンド名は直感的（`clone`, `pull`, `push`, `deploy`）であり、Gitに慣れた開発者なら違和感なく使用できる。
* **学習コスト**: 低〜中。基本的なプッシュ/プルの操作は数分で習得可能だが、TypeScript環境の構築やCI/CD連携まで行う場合はNode.jsエコシステムの知識が必要になる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **TypeScriptとバンドラーの利用**: 生のJavaScriptではなく、TypeScriptとRollupやesbuildを組み合わせてローカルでビルドし、生成されたファイルを `clasp push` する構成が現在の標準的アプローチ。
  * **CI/CD自動化**: GitHub Actionsを利用し、プルリクエストのマージをトリガーに自動で `clasp push` および `clasp deploy` を実行する仕組みを構築する。
  * **カスタムOAuthプロジェクト**: セキュリティとガバナンスのため、デフォルトのクレデンシャルではなく自社のGCPプロジェクトのOAuthクライアントを作成して `clasp login --creds` を利用する。
* **陥りやすい罠 (Antipatterns)**:
  * `.clasprc.json` などの認証情報ファイルや `.clasp.json` (環境固有IDを含む場合) を誤ってGitリポジトリにコミットしてしまうこと（セキュリティリスク）。
  * 複数人が同時に別々の変更を `clasp push` し、互いの変更を上書きしてしまうこと。必ずGitでマージしてからプッシュするフローを徹底する。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub (Star、Issue動向)、技術コミュニティ（Zenn, Qiita）
* **総合評価**: G2やCapterraなどのB2Bレビューサイトには登録がないが、GitHubでは5.6k Starを集め、開発者から非常に高い評価を得ている。
* **ポジティブな評価**:
  * 「ブラウザエディタの制約から解放され、VS CodeとGitを使ったモダンな開発ができるようになった。」
  * 「チーム開発でのGAS管理が圧倒的に楽になった。」
  * 「CI/CDに組み込むことで、手作業でのデプロイミスがなくなった。」
* **ネガティブな評価 / 改善要望**:
  * 「v3.xでTypeScriptの直接コンパイルがサポート外になり、初期環境構築のハードルが少し上がった。」
  * 「複数人での同時開発時のコンフリクト解決手段（部分的なプッシュなど）がもっと強固だと嬉しい。」
* **特徴的なユースケース**:
  * AIコーディングエージェント（Claude Code等）と組み合わせて、GASの開発・修正をターミナルからAIに指示して自動化させる用途（MCP対応による新しい使い方）。

## **15. 直近半年のアップデート情報**

* **2026-03-12**: v3.3.0のリリース。
* **2025-11-20**: (v3.2.0など時期は推測) AIエージェントとの統合のためのMCP（Model Context Protocol）サポートを追加。`clasp mcp` コマンドが実験的機能として利用可能に。
* **2025-05-10**: (v3.0.0系など時期は推測) TypeScriptの直接トランスパイル機能の非推奨化および削除。

(出典: [GitHub Releases](https://github.com/google/clasp/releases) など)

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | clasp | Apps Script Web Editor | aside |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | ローカル開発 | ◎<br><small>VS Code等のエディタを利用可能</small> | ×<br><small>ブラウザ上のみ</small> | ◎<br><small>ローカルでの開発・ビルドに特化</small> |
| **構成管理** | バージョン管理(Git) | ◯<br><small>ファイルとして管理可能</small> | △<br><small>履歴は残るがGit連携は困難</small> | ◯<br><small>ファイルとして管理可能</small> |
| **開発体験** | TypeScript対応 | △<br><small>v3で直接対応廃止、バンドラ必須</small> | ×<br><small>非対応</small> | ◎<br><small>標準でTS環境とLint等を内包</small> |
| **非機能要件** | エコシステム拡張 | ◎<br><small>MCP対応でAIエージェントから操作可能</small> | ×<br><small>クローズドな環境</small> | △<br><small>claspのラッパー的立ち位置</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **clasp** | Google公式の汎用的なCLIツール | 公式ツールとしての安定性、幅広いコマンド、MCPサポート | TS環境構築などの自由度が高すぎるため初期設定に手間がかかる | GASプロジェクトをローカルで管理・CI/CD化したいすべてのケースの基本となる。 |
| **Apps Script Web Editor** | ブラウザ標準エディタ | 環境構築ゼロですぐに書き始められる | 補完が弱く、チーム開発やバージョン管理に不向き | ちょっとした使い捨てスクリプトを素早く書きたい場合。 |
| **aside** | TS/React等のモダン環境向けテンプレート/ビルドツール | ReactやTypeScriptでの開発環境がオールインワンで構築される | claspのラッパーとして動作するため、裏側で結局claspが必要になる | Reactを用いた複雑なアドオンUIなどをGASで開発したい場合。 |

## **17. 総評**

* **総合的な評価**:
  Google Apps Scriptを本格的な業務システムやチーム開発で利用する上で、**なくてはならない必須ツール（デファクトスタンダード）**である。ブラウザエディタの限界を取り払い、Gitを用いたバージョン管理やモダンなエディタ（VS Codeなど）の恩恵を受けられるようになる意義は極めて大きい。最近のバージョンではMCP対応が行われるなど、AI主導の開発フローにも適応しつつある。
* **推奨されるチームやプロジェクト**:
  * 複数人でGASを開発・保守しているチーム
  * GASのコード品質を担保するためにコードレビュー（Pull Request）を実施したい組織
  * デプロイ作業をCI/CDで自動化したいプロジェクト
* **選択時のポイント**:
  バージョン3.x以降、TypeScriptのトランスパイルがツールから切り離されたため、TypeScriptを利用する場合はRollupやesbuildを用いたビルド環境を自前で構築するか、既存のテンプレートリポジトリを活用する必要がある点に留意する。
