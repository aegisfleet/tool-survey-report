---
title: "act (nektos/act) 調査レポート"
tool_name: "act"
tool_reading: "アクト"
category: "DevOps"
developer: "nektos"
official_site: "https://nektosact.com/"
date: "2026-01-29"
last_updated: "2026-01-29"
tags:
  - "CI/CD"
  - "GitHub Actions"
  - "OSS"
  - "Local Development"
description: "GitHub Actionsのワークフローをローカル環境で実行できるコマンドラインツール。Dockerを使用してローカルでCI/CDパイプラインをシミュレートする。"

quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "ソフトウェアエンジニア"
    - "DevOpsエンジニア"
    - "OSSメンテナ"
  latest_highlight: "2026年1月にv0.2.84をリリース。安定性と互換性が向上。"
  update_frequency: "高"

evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: "完全無料でGitHub Actionsのローカル実行環境を提供"
    - point: 5
      reason: "開発サイクルの大幅な短縮（プッシュ不要でテスト可能）"
    - point: 5
      reason: "活発なオープンソースコミュニティと頻繁なアップデート"
  minus_points:
    - point: -3
      reason: "GitHubホステッドランナーとの完全な互換性はない（一部機能制限あり）"
    - point: -2
      reason: "Docker環境のセットアップとリソースが必要"
  summary: "GitHub Actionsを利用する開発者にとって必須級のツール。完全な互換性はないものの、開発効率を劇的に向上させる。"

links:
  github: "https://github.com/nektos/act"
  documentation: "https://nektosact.com/introduction.html"

relationships:
  parent: "GitHub Actions"
  children: []
  related_tools:
    - "Docker"
    - "CircleCI CLI"
    - "Dagger"
---

# **act (nektos/act) 調査レポート**

## **1. 基本情報**

* **ツール名**: act (nektos/act)
* **ツールの読み方**: アクト
* **開発元**: nektos (コミュニティ主導のOSS)
* **公式サイト**: [https://nektosact.com/](https://nektosact.com/)
* **関連リンク**:
  * GitHub: [https://github.com/nektos/act](https://github.com/nektos/act)
  * ドキュメント: [https://nektosact.com/introduction.html](https://nektosact.com/introduction.html)
  * レビューサイト: なし (GitHub Stars: 68k+ / 2026年1月時点)
* **カテゴリ**: DevOps / CI/CD
* **概要**: GitHub Actionsのワークフロー定義ファイル（`.github/workflows`）を読み込み、Dockerコンテナを使用してローカル環境で実行するコマンドラインツール。「Think globally, act locally」を掲げ、クラウドへのプッシュなしでCI/CDパイプラインのテストを可能にする。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * GitHub Actionsの動作確認のために、修正のたびにコミット・プッシュを行う手間と時間の無駄。
  * 「コミット→プッシュ→CI失敗→修正」という長いフィードバックループ。
  * `Makefile`等のローカルタスクランナーとCI設定の二重管理。
* **想定利用者**:
  * GitHub Actionsを利用してCI/CDパイプラインを構築するすべての開発者。
  * CIのデバッグに時間を取られているエンジニア。
* **利用シーン**:
  * **CIワークフローのローカルデバッグ**: シンタックスエラーやスクリプトの動作をプッシュ前に手元で確認。
  * **ローカルタスクランナー**: `Makefile`の代わりにGitHub Actionsの定義を使ってビルドやテストを実行。
  * **クリーンな環境でのテスト**: 依存関係が含まれたDockerコンテナ上でテストを実行し、「自分のマシンでは動く」問題を排除。

## **3. 主要機能**

* **ワークフローのローカル実行**: `.github/workflows/` 内のYAMLファイルを解析し、Docker APIを通じてジョブを実行。
* **イベントトリガーのシミュレーション**: `push` や `pull_request` などのGitHubイベントをローカルで発火させてワークフローを実行。
* **アーティファクトの利用**: アクション間でのデータの受け渡しやアーティファクトの保存・利用をサポート。
* **シークレット管理**: ローカルの `.secrets` ファイルを通じて、APIキーなどの機密情報を安全に注入可能。
* **プラットフォーム指定**: `-P` オプションにより、ジョブを実行するDockerイメージ（Ubuntuなど）をカスタマイズ可能。
* **ドライラン**: 実際の実行を行わずに、どのジョブが実行されるかを確認する機能（`act -n`）。
* **特定のジョブのみ実行**: ワークフロー全体ではなく、特定のジョブを指定して実行可能（`act -j job_name`）。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Docker Engine (または Docker Desktop) がインストールされ、実行されていること。
  * Git がインストールされていること。
* **インストール/導入**:
  ```bash
  # macOS (Homebrew)
  brew install act

  # Windows (Chocolatey)
  choco install act-cli

  # Linux (Curl)
  curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
  ```
* **初期設定**:
  * 初回実行時にデフォルトのDockerイメージサイズ（Large/Medium/Micro）を選択するプロンプトが表示される。
  * `.actrc` ファイルにデフォルトの引数を設定可能。
* **クイックスタート**:
  ```bash
  # リポジトリのルートディレクトリで実行（デフォルトですべてのpushイベントを実行）
  act

  # 特定のイベント（例: pull_request）をトリガーとして実行
  act pull_request
  ```

## **5. 特徴・強み (Pros)**

* **高速なフィードバックループ**: コード変更からテスト結果確認までの時間を数分〜数十分から数秒〜数分に短縮できる。コミット履歴を汚さずに試行錯誤が可能。
* **GitHub Actionsとの互換性**: 標準のYAML構文をそのまま解釈するため、特別な設定ファイルを追加で書く必要がない。
* **環境の一貫性**: Dockerコンテナ上で実行されるため、ローカル環境の汚れや依存関係の差異に影響されにくい。
* **クロスプラットフォーム**: Windows, Mac, Linuxのいずれでも動作（Dockerが必要）。

## **6. 弱み・注意点 (Cons)**

* **完全な互換性ではない**: GitHubホステッドランナーの環境を完全に再現できるわけではない。特にプリインストールされているソフトウェアの違いがある。
* **Docker依存**: 実行にはDocker Engineが必要であり、Docker Desktop等のライセンスやリソース消費（CPU/メモリ）の影響を受ける。
* **Docker in Dockerの複雑さ**: ワークフロー内でさらにDockerを使用する場合（Serviceコンテナなど）、設定が複雑になりトラブルが発生しやすい。
* **Apple Silicon (M1/M2/M3) の課題**: 一部のx86_64ベースのDockerイメージを使用する際、エミュレーションによりパフォーマンスが低下する場合がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **OSS (MIT License)** | 無料 | すべての機能を無制限に利用可能。 |

* **課金体系**: 完全無料（オープンソース）。
* **無料トライアル**: なし（最初から全機能利用可能）。

## **8. 導入実績・事例**

* **導入企業**: 特定の企業導入リストは公開されていないが、GitHub Star数68,000超（2026年1月）という数字が広範な利用を示している。
* **導入事例**:
  * **OSSプロジェクト**: コントリビューションガイドラインに「PR作成前に `act` でテストを通すこと」を推奨するプロジェクトが多数存在。
  * **個人開発者**: プライベートリポジトリの無料枠（Actions実行時間）を節約するためにローカルでテストを完結させる。
* **対象業界**: Web開発、クラウドネイティブ開発、DevOpsを採用している全業界。

## **9. サポート体制**

* **ドキュメント**: [User Guide](https://nektosact.com/) が整備されており、インストールから高度な設定まで網羅されている。
* **コミュニティ**: GitHub Discussions と Issues が非常に活発。ユーザー同士の助け合いや開発者からのレスポンスがある。
* **公式サポート**: 企業による有償サポートはない。コミュニティサポートのみ。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: 外部から制御するための公式Web APIはないが、CLIツールとしてスクリプトから呼び出し可能。
* **外部サービス連携**:
  * **Docker**: 実行基盤として必須。
  * **GitHub**: APIトークンを使用することで、GitHub上のリポジトリ情報やパッケージと連携可能。
  * **VS Code**: 公式拡張機能ではないが、`act` を統合するサードパーティ製拡張機能が存在する。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Node.js / JS / TS** | ◎ | 軽量なコンテナで高速に動作。 | 特になし |
| **Python** | ◎ | Python環境のセットアップが容易。 | 特になし |
| **Go** | ◎ | コンパイル・テストが高速。 | 特になし |
| **iOS / macOS** | × | DockerはLinuxコンテナがベースのため動作不可。 | macOS固有の機能（Xcode等）は利用できない。 |
| **Windows** | △ | Docker上でWindowsコンテナを使う必要があり設定が複雑。 | 基本的にはLinuxベースのワークフロー向け。 |

## **11. セキュリティとコンプライアンス**

* **認証**: GitHub Personal Access Token (PAT) を `-s GITHUB_TOKEN=...` で渡すことでプライベートリポジトリにアクセス可能。
* **データ管理**: すべてのデータはローカルマシン内で完結し、外部サーバーへの送信は行われない（GitHub APIを叩く場合を除く）。
* **準拠規格**: OSSのため特定の認証は取得していないが、コードは公開されており透明性が高い。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: シンプルなCLI。実行結果はGitHub ActionsのウェブUIのログに似た形式でカラー出力され、視認性が高い。
* **学習コスト**: DockerとGitHub Actionsの基本知識があれば、追加の学習コストは非常に低い。数個のコマンドオプションを覚えるだけで使える。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **軽量イメージの利用**: `-P ubuntu-latest=node:16-buster-slim` のように、必要なツールだけが入った軽量Dockerイメージを指定することで実行速度を上げる。
  * **Makeでのラップ**: `Makefile` に `test: act` のように記述し、開発者がコマンド一発で実行できるようにする。
* **陥りやすい罠 (Antipatterns)**:
  * **シークレットのコミット**: `.secrets` ファイルを誤ってGitにコミットしてしまう。必ず `.gitignore` に追加すること。
  * **過度な信頼**: 「`act` で動いたから本番でも動く」と思い込み、GitHub上での最終確認を怠る。環境差異による失敗はあり得る。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub Issues, Twitter (X), Tech Blogs (Qiita, Zenn, Dev.to)
* **総合評価**: 非常に好評。特に「待ち時間」に不満を持つ開発者から熱烈に支持されている。
* **ポジティブな評価**:
  * 「もう "fix ci", "retry" といったゴミコミットを量産しなくて済むのが最高。」
  * 「飛行機の中など、オフラインでもCIの一部を動かせるのが便利。」
  * 「デバッグサイクルが圧倒的に速くなった。」
* **ネガティブな評価 / 改善要望**:
  * 「GitHubホステッドランナーに入っているツールがなくてコケることがある（Imageの差異）。」
  * 「M1 MacだとDockerの挙動が遅かったり、アーキテクチャ違いで動かないアクションがある。」
  * 「`services` (DBなど) の立ち上げでトラブルが起きがち。」
* **特徴的なユースケース**:
  * CIの設定ファイルを「ローカル開発環境のセットアップスクリプト」として兼用し、新規参画者の環境構築を自動化する。

## **15. 直近半年のアップデート情報**

* **2026-01-01 (v0.2.84)**: メンテナンスリリース。依存パッケージのセキュリティアップデートとバグ修正。
* **2025-12-01 (v0.2.83)**: Mergify設定の更新など、開発フロー周辺の改善。
* **2025-10-XX (v0.2.82)**: 依存関係のアップデートによる安定性向上。
* **2025-09-XX (v0.2.81)**: Matrix展開ロジックの修正や、ステップコンテナのワークディレクトリ処理の修正。
* **2025-08-XX (v0.2.80)**: テスト環境のベースイメージ更新（buster -> bookworm）。

(出典: [GitHub Releases](https://github.com/nektos/act/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | act | GitHub Actions (Cloud) | CircleCI CLI | Dagger |
|:---:|:---|:---:|:---:|:---:|:---:|
| **実行環境** | ローカル実行 | ◎<br><small>Dockerで再現</small> | ×<br><small>不可</small> | ◯<br><small>専用コンテナ</small> | ◎<br><small>どこでも動作</small> |
| **互換性** | Actions構文 | ◎<br><small>ネイティブ対応</small> | ◎<br><small>本家</small> | ×<br><small>CircleCI構文</small> | ×<br><small>独自/CUE/SDK</small> |
| **セットアップ** | 容易さ | ◯<br><small>Installのみ</small> | ◎<br><small>不要</small> | △<br><small>Token設定等</small> | △<br><small>SDK学習必要</small> |
| **コスト** | 無料利用 | ◎<br><small>完全無料</small> | ◯<br><small>制限あり</small> | ◯<br><small>制限あり</small> | ◎<br><small>OSS版あり</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **act** | GitHub Actionsローカルランナー | Actionsの資産をそのまま使える。無料。 | 完全な環境再現は困難。Docker必須。 | GitHub Actionsを利用しており、ローカルで高速にフィードバックを得たい場合。 |
| **GitHub Actions (Cloud)** | 本家クラウド実行環境 | 完全な互換性。セットアップ不要。並列実行能力。 | フィードバックが遅い。デバッグがしにくい。 | 最終的な動作確認、本番デプロイ、重い処理。 |
| **CircleCI CLI** | CircleCI用ローカルツール | 強力なデバッグ機能とCircleCIとの整合性。 | GitHub Actionsとは互換性がない。 | CircleCIをメインのCIとして利用している場合。 |
| **Dagger** | ポータブルCI/CDエンジン | 特定のCIツールに依存せず、Go/Python等で記述可能。 | 独自の学習が必要。Actions資産は直接使えない。 | ベンダーロックインを避け、CIパイプライン自体をコードとして管理・ポータブルにしたい場合。 |

## **17. 総評**

* **総合的な評価**:
  `act` は、GitHub Actionsを中心とした現代の開発ワークフローにおいて、**開発者体験（DX）を大きく向上させる重要なピース**である。クラウド上のCIの結果を待つという「無駄な時間」を排除できる点は、個人の生産性だけでなくチーム全体の速度向上に寄与する。
* **推奨されるチームやプロジェクト**:
  * GitHub ActionsをメインのCI/CDとして採用しているすべてのプロジェクト。
  * CIパイプラインの修正や保守を行う頻度が高いDevOpsチーム。
* **選択時のポイント**:
  * 「ローカルでの事前検証用」と割り切り、最終的な品質保証はクラウド上のGitHub Actionsで行うという運用設計ができるかどうかが鍵となる。完全な互換性を求めすぎると、Docker環境の調整に時間を取られるため注意が必要。
