---
title: zizmor 調査レポート
tool_name: zizmor
tool_reading: ジズモア
category: コード品質/静的解析
developer: zizmorcore
official_site: https://zizmor.sh/
date: '2026-05-17'
last_updated: '2026-05-17'
tags:
  - オープンソース
  - セキュリティ
  - 静的解析
  - GitHub Actions
description: GitHub Actionsワークフロー内の一般的なセキュリティ脆弱性を検出する静的解析ツール
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - DevSecOpsエンジニア
  latest_highlight: 2026年5月16日にv1.25.2をリリース
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: GitHub Actionsに特化した豊富な監査ルール（テンプレートインジェクション、過剰な権限など）を標準搭載
    - point: 5
      reason: Rust製で高速に動作し、オフライン環境での解析にも対応
    - point: 5
      reason: 自動修正（auto-fix）機能やGitHub Actions向けインテグレーションが提供されている
  minus_points: []
  summary: GitHub Actionsワークフローの安全性を確保する上で非常に強力かつ手軽に導入できる必須級のツール
links:
  github: https://github.com/zizmorcore/zizmor
  deepwiki: https://deepwiki.com/zizmorcore/zizmor
  codewiki: https://codewiki.google/github.com/zizmorcore/zizmor
  documentation: https://docs.zizmor.sh/
relationships:
  related_tools:
    - Trivy
---

# **zizmor 調査レポート**

## **1. 基本情報**

* **ツール名**: zizmor
* **ツールの読み方**: ジズモア
* **開発元**: zizmorcore (William Woodruff)
* **公式サイト**: [https://zizmor.sh/](https://zizmor.sh/)
* **関連リンク**:
  * GitHub: [https://github.com/zizmorcore/zizmor](https://github.com/zizmorcore/zizmor)
  * DeepWiki: [https://deepwiki.com/zizmorcore/zizmor](https://deepwiki.com/zizmorcore/zizmor)
  * CodeWiki: [https://codewiki.google/github.com/zizmorcore/zizmor](https://codewiki.google/github.com/zizmorcore/zizmor)
  * ドキュメント: [https://docs.zizmor.sh/](https://docs.zizmor.sh/)
* **カテゴリ**: セキュリティ
* **概要**: GitHub ActionsワークフローやCI/CDセットアップによく見られるセキュリティ上の問題を検出する静的解析ツール。テンプレートインジェクションや過剰な権限設定、ハードコードされた認証情報などのリスクを高速に特定する。

## **2. 目的と主な利用シーン**

* **解決する課題**: GitHub Actionsを利用したCI/CDパイプラインにおける設定ミスや脆弱性（サプライチェーン攻撃の温床となる問題など）を未然に防ぐ。
* **想定利用者**: 開発者、DevSecOpsエンジニア、プラットフォームエンジニア
* **利用シーン**:
  * CI/CDパイプライン上でPull Request時の自動セキュリティチェックとして実行
  * ローカル環境でのコミット前のフック（pre-commit）として実行
  * 既存リポジトリ群のGitHub Actions設定の一括監査

## **3. 主要機能**

* **テンプレートインジェクション検知**: `${{ ... }}` 内でユーザーの入力や動的な値が適切にエスケープされずに実行される脆弱性を検出する。
* **過剰な権限スコープの検出**: ワークフローやジョブに対して不必要に強力な権限が与えられている設定を警告する。
* **不適切な認証情報の管理検知**: 環境変数外に配置されたシークレットや、ログでマスクされない形でのシークレット利用を検出する。
* **キャッシュポイズニング検知**: リリースワークフローなどで以前のCIステータス（キャッシュ）を利用することで発生する攻撃のリスクを特定する。
* **自動修正（Auto-fix）**: `--fix` オプションにより、ピン留めされていないActionへのハッシュ値付与や不安全な構文の一部を自動で修正する。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * パッケージマネージャー（Cargo, pip, Homebrewなど）がインストールされたOS
  * アカウント作成は不要。
* **インストール/導入**:

  ```bash
  # Cargo (Rust) を使用する場合
  cargo install zizmor

  # Homebrew (macOS) を使用する場合
  brew install zizmor
  ```

* **初期設定**:
  * APIキーなどは不要。そのままコマンドラインから実行可能。
* **クイックスタート**:
  * リポジトリのルートで `zizmor` コマンドを実行するだけで、`.github/workflows` ディレクトリ内のワークフローを解析する。

  ```bash
  zizmor .
  ```

## **5. 特徴・強み (Pros)**

* Rustによる実装で非常に高速に動作する。
* GitHub Actions特有の仕様（コンテキストの評価やトリガーの条件など）を深く理解した監査ルールを備えている。
* オフライン動作に対応しており、ローカルでの実行時に外部APIへの依存がない。
* SARIF形式での出力に対応しており、GitHub Advanced Securityと連携してPull Request上にアラートを表示しやすい。

## **6. 弱み・注意点 (Cons)**

* ルールによっては一部誤検知（特にPedanticモードでの実行時）が発生する可能性がある。
* 日本語対応の公式ドキュメントやUIはなく、出力およびドキュメントは英語のみ提供されている。
* GitHub Actions以外のCI/CDツール（GitLab CIやCircleCIなど）には対応していない。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **無料プラン** | 無料 | 完全なオープンソースであり、すべての機能が無料で利用可能 |

* **課金体系**: 完全無料（オープンソースソフトウェア）
* **無料トライアル**: なし（常に無料）

## **8. 導入実績・事例**

* **導入企業**: 公開事例としての企業リストは公式サイトに明記されていないが、多数のOSSプロジェクトや企業でGitHub Actions経由で利用されている。
* **導入事例**: CIパイプラインの自動化ステップとしてGitHub Actionsのワークフロー内で `zizmorcore/zizmor-action` として使用されている。
* **対象業界**: 業界を問わず、GitHub Actionsを利用するすべてのソフトウェア開発プロジェクト。

## **9. サポート体制**

* **ドキュメント**: [公式ドキュメントサイト](https://docs.zizmor.sh/)にて、インストール手順、クイックスタート、各監査ルールの詳細な説明が提供されている。
* **コミュニティ**: [公式Discordサーバー](https://discord.com/invite/PGU3zGZuGG)やGitHub Issuesを通じて活発な議論やサポートが行われている。
* **公式サポート**: オープンソースであるため、開発者コミュニティベースのサポートが中心。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: ツール自体はCLIとして提供されており、標準出力やファイル出力（SARIF形式など）を介して他ツールと連携する。
* **外部サービス連携**: GitHub（GitHub Actions）とシームレスに連携。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **GitHub Actions** | ◎ | 公式の `zizmorcore/zizmor-action` が提供されており、組み込みが極めて容易 | 特になし |
| **pre-commit** | ◎ | `.pre-commit-config.yaml` 経由での設定が公式サポートされている | 特になし |
| **SARIF互換ツール** | ◯ | SARIF出力に対応し、セキュリティダッシュボードに統合可能 | ツール側でのパース処理の確認が必要 |

## **11. セキュリティとコンプライアンス**

* **認証**: ツール実行時の認証は不要。
* **データ管理**: 実行環境ローカル内で静的解析を行うため、外部へのコードや設定の送信は行われない。
* **準拠規格**: オープンソースプロジェクトとしての提供であり、特定のエンタープライズ向け規格の認証取得は公式サイトで公開されていない。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: コマンドラインツール（CLI）として直感的で分かりやすい出力を備える。色付けされた警告メッセージや、エラーが発生した行のコードスニペットのハイライト機能がある。
* **学習コスト**: インストール後すぐにコマンドを打つだけで利用できるため、学習コストは非常に低い。ルールごとに公式ドキュメントで解説されているため、警告の解消方法も容易に学べる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 公式提供のGitHub Actionを用いてPull Requestごとの自動検査を組み込む。出力フォーマットをSARIFにして、GitHubのSecurityタブに警告を集約する。
  * 開発者のローカル環境で `pre-commit` フックとして導入し、コードをPushする前にエラーを修正させる。
* **陥りやすい罠 (Antipatterns)**:
  * 検出された警告に対して、原因を理解しないまま場当たり的な変更を行ってしまうこと。公式ドキュメントの「Remediation（修正方法）」セクションを必ず確認する。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHubのStar数、X(Twitter)などのコミュニティの反応
* **総合評価**: GitHubリポジトリは5,000 Star以上を獲得しており、多くの開発者から支持されている。
* **ポジティブな評価**:
  * 「GitHub Actionsにおける設定ミスを的確に指摘してくれるため非常に役立つ」
  * 「Rust製で動作が早く、CIでのオーバーヘッドが少ない」
  * 「出される警告のドキュメントが丁寧で修正方針がわかりやすい」
* **ネガティブな評価 / 改善要望**:
  * 一部の特殊なマクロやコマンドを用いたスクリプトにおいて、コンテキストの評価が難しく誤検知となるケースがある（継続的に改善中）。
* **特徴的なユースケース**:
  * CIパイプライン監査の一環として、セキュリティに特化したLinterとしてTrivyなどと併用する事例が多い。

## **15. 直近半年のアップデート情報**

* **2026-05-16**: v1.25.2リリース (バグ修正とルール精度の向上)
* **2026-05-12**: v1.25.0リリース (GitHub Appのインストールトークンの危険な使用を検知するルールの追加)
* **2026-04-18**: v1.24.0リリース (`secrets-outside-env`監査のカスタマイズ対応)

(出典: [GitHub Releases](https://github.com/zizmorcore/zizmor/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | Trivy |
|:---:|:---|:---:|:---:|
| **基本機能** | GitHub Actionsの静的解析 | ◎<br><small>Actionsに特化</small> | ◯<br><small>IaCスキャンの機能の一部として対応</small> |
| **カテゴリ特定** | コンテナ脆弱性のスキャン | ×<br><small>非対応</small> | ◎<br><small>標準で強力にサポート</small> |
| **エンタープライズ** | SARIF出力 | ◯<br><small>対応</small> | ◯<br><small>対応</small> |
| **非機能要件** | 動作速度 | ◎<br><small>高速なRust実装</small> | ◯<br><small>Go実装。DB更新が必要なケースあり</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | GitHub Actions専用のセキュリティ監査ツール | Actionsの設定ミスや特有の脆弱性に非常に詳しい | 対象がGitHub Actionsのみに限定される | GitHub Actionsのワークフローの安全性を集中的に高めたい場合 |
| **Trivy** | 汎用的な脆弱性・IaCスキャナー | コンテナ、OSパッケージ、各種IaCツールなど対象が幅広い | Actions専用ツールと比べると、特有の複雑なコンテキストの検知精度で劣る場合がある | コンテナやTerraformなどを含め、統合的にセキュリティをチェックしたい場合 |

## **17. 総評**

* **総合的な評価**:
  * GitHub Actionsを活用するあらゆるプロジェクトにおいて、脆弱性の温床となりやすい設定ミスを自動的に発見してくれる極めて有用なツール。高速かつ導入が容易である点が大きな魅力である。
* **推奨されるチームやプロジェクト**:
  * GitHub ActionsでCI/CDを運用しているすべてのチーム。特に公開リポジトリ（オープンソースプロジェクト）においては、プルリクエスト時のリスク軽減に必須となる。
* **選択時のポイント**:
  * すでにTrivyなどのIaCセキュリティスキャナーを導入している場合でも、zizmorのGitHub Actionsに特化した深い監査ルールはそれらを補完する強力な機能を持つため、併用することが推奨される。
