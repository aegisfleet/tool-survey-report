---
title: "CodeQL 調査レポート"
tool_name: "CodeQL"
tool_reading: "コードキューエル"
category: "セキュリティ・静的解析"
developer: "GitHub"
official_site: "https://codeql.github.com/"
date: "2026-02-18"
last_updated: "2026-02-18"
tags:
  - "セキュリティ"
  - "静的解析"
  - "GitHub"
  - "DevSecOps"
description: "コードをデータとして扱い、脆弱性を検出するGitHubの高度な静的解析エンジン"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true  # 無料プランの有無 (OSS/Public Repos)
  is_oss: false  # OSS（オープンソース）かどうか (CLI/EngineはProprietary)
  starting_price: "無料 (OSS) / $30/user/月 (Enterprise)"  # 最低価格
  target_users:  # 想定ユーザー（1-3項目）
    - "セキュリティエンジニア"
    - "開発者"
    - "OSSメンテナ"
  latest_highlight: "2026年2月にKotlin 2.3.0対応やLLMプロンプトインジェクション検知を追加"
  update_frequency: "高"  # 更新頻度（高/中/低/不定期）

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85  # 最終スコア（0-100点）
  base_score: 70  # 基準点（固定）
  plus_points:  # 加点項目（各項目: 点数と理由）
    - point: 10
      reason: "GitHubネイティブで統合がスムーズ"
    - point: 5
      reason: "クエリ言語(QL)による柔軟で強力なカスタム解析が可能"
    - point: 5
      reason: "OSSに対しては完全に無料で利用可能"
  minus_points:  # 減点項目（各項目: 点数と理由）
    - point: -3
      reason: "独自のクエリ言語(QL)の学習コストが高い"
    - point: -2
      reason: "対応言語数がSonarQubeなどに比べると少なめ"
  summary: "GitHub利用者にとって最強のセキュリティツールだが、使いこなすには学習が必要"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/github/codeql"
  documentation: "https://codeql.github.com/docs/"
relationships:
  related_tools:
    - "SonarQube"
    - "Dependabot"
---

# **CodeQL 調査レポート**

## **1. 基本情報**

* **ツール名**: CodeQL
* **ツールの読み方**: コードキューエル
* **開発元**: GitHub
* **公式サイト**: [https://codeql.github.com/](https://codeql.github.com/)
* **関連リンク**:
  * GitHub: [https://github.com/github/codeql](https://github.com/github/codeql) （クエリとライブラリのリポジトリ）
  * ドキュメント: [https://codeql.github.com/docs/](https://codeql.github.com/docs/)
* **カテゴリ**: セキュリティ・静的解析 (SAST)
* **概要**: GitHubが開発・提供するセマンティックコード解析エンジン。コードをデータベース化し、SQLのようなクエリ言語「QL」を使って検索することで、脆弱性やバグを特定する。GitHub Advanced Securityの中核技術として利用されている。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * 従来の静的解析ツールでは検出が難しい、複雑なデータフローに起因する脆弱性の発見
  * 組織固有のセキュリティポリシーやコーディング規約への準拠チェック
* **想定利用者**:
  * セキュリティエンジニア
  * 大規模プロジェクトの開発チーム
  * オープンソースソフトウェアのメンテナ
* **利用シーン**:
  * CI/CDパイプライン（GitHub Actions）でのプルリクエストごとの自動セキュリティスキャン
  * 過去の脆弱性（CVE）と同じパターンを持つコードのバリアント分析（Variant Analysis）
  * 特定のAPIの誤用や危険なデータフローの検出

## **3. 主要機能**

* **セマンティックコード解析**: コードを単なるテキストではなく、意味を持つデータ（データベース）として扱い、深い解析を行う。
* **QL言語によるクエリ**: オブジェクト指向かつ論理型のクエリ言語「QL」を使用して、独自の解析ルールを作成可能。
* **バリアント分析**: 一つの脆弱性パターンから、類似した脆弱性をコードベース全体から一網打尽に検出する。
* **テイントトラッキング**: ユーザー入力などの信頼できないデータが、危険なシンク（SQL実行箇所など）に到達するまでのフローを追跡する。
* **GitHub Advanced Security統合**: GitHub ActionsやPull Request画面と深く統合されており、開発ワークフロー内で自然に利用できる。
* **CodeQL CLI**: ローカル環境やGitHub以外のCIシステムでも解析を実行できるコマンドラインツール。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * GitHubアカウント（GitHub Actions利用の場合）
  * GitHub Advanced Securityライセンス（プライベートリポジトリの場合）
  * CodeQL CLIを利用する場合は、対応OS（Linux, macOS, Windows）
* **インストール/導入**:
  GitHub Actionsで利用する場合、ワークフローファイルに以下を追加するだけです。
  ```yaml
  name: "CodeQL"
  on:
    push:
      branches: [ "main" ]
    pull_request:
      branches: [ "main" ]
  jobs:
    analyze:
      name: Analyze
      runs-on: ubuntu-latest
      permissions:
        actions: read
        contents: read
        security-events: write
      steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript # 解析対象言語を指定
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
  ```
* **初期設定**:
  * `codeql-action/init` アクションで解析対象の言語を指定する。
* **クイックスタート**:
  * パブリックリポジトリであれば、GitHubのリポジトリ設定「Security」タブから「Code scanning」を有効にするだけで、デフォルトのワークフローが提案され、すぐに開始できる。

## **5. 特徴・強み (Pros)**

* **圧倒的な検出精度と柔軟性**: 単純なパターンマッチングではなく、データフロー解析を行うため、誤検知（False Positive）を減らしつつ、深い脆弱性を検出できる。
* **GitHubエコシステムとの統合**: 開発者が普段使うGitHubのUI上で結果を確認・修正できるため、DevSecOpsの実現に最適。
* **拡張性**: 公開されている数千のクエリに加え、自組織専用のカスタムクエリを作成して運用できる。

## **6. 弱み・注意点 (Cons)**

* **学習コストが高い**: 独自のクエリ言語「QL」を習得する必要があり、カスタムクエリを作成するハードルが高い。
* **解析時間**: 深い解析を行うため、単純なリンターと比較するとスキャンに時間がかかる場合がある（特にビルドが必要な言語）。
* **対応言語の制限**: 主要な言語（C/C++, C#, Go, Java, Kotlin, JS/TS, Python, Ruby, Rust, Swift）には対応しているが、SonarQubeなどが対応しているマイナー言語には未対応な場合がある。

## **7. 料金プラン**

CodeQL自体は、GitHub Advanced Security (GHAS) の一部として提供されます。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Public Repositories** | 無料 | パブリックリポジトリでは全機能を無料で利用可能。OSS開発者向け。 |
| **GitHub Advanced Security** | $49/月/ユーザー (概算) | Enterpriseプランのアドオンとして提供。CodeQLに加え、Secret Scanningなども含まれる。正確な価格は営業担当への問い合わせが必要だが、一般的に高価。 |

* **課金体系**: アクティブコミッター数に基づくライセンス課金（Enterpriseの場合）。
* **無料トライアル**: GitHub Enterpriseのトライアルに含まれる場合がある。

## **8. 導入実績・事例**

* **導入企業**: Microsoft, Google, NASA, Uber など多数のテック企業。
* **導入事例**:
  * **Microsoft**: WindowsやOfficeなどの巨大なコードベースの脆弱性検出にCodeQLを活用。
  * **Uber**: モバイルアプリやバックエンドサービスのセキュリティ確保に利用。
* **対象業界**: ソフトウェア開発、金融、政府機関など、高いセキュリティレベルが求められる業界。

## **9. サポート体制**

* **ドキュメント**: 公式ドキュメントは非常に充実しており、QL言語のチュートリアルや各言語向けのガイドも豊富。
* **コミュニティ**: GitHub DiscussionsやIssuesで活発にやり取りが行われている。多くのセキュリティ研究者がクエリを寄稿している。
* **公式サポート**: Enterprise契約の場合はGitHubの公式サポート（Premium Support）が利用可能。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: GitHub APIを通じて、スキャン結果（アラート）の取得や管理が可能。
* **外部サービス連携**:
  * **VS Code**: 公式拡張機能「CodeQL for VS Code」があり、ローカルでクエリの作成や実行、デバッグが可能。
  * **CIツール**: Jenkins, GitLab CIなど、GitHub Actions以外のCIでもCodeQL CLIを使って連携可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **GitHub Actions** | ◎ | 純正アクションで設定不要に近い | 特になし |
| **Java / Kotlin** | ◯ | ビルドプロセスにフックして解析可能 | ビルド時間が延びる可能性あり |
| **JavaScript / TypeScript** | ◎ | ビルド不要で解析可能、人気が高い | 大規模なモノレポでは解析時間が長くなる傾向 |
| **PHP** | × | 公式サポートなし | コミュニティベースの対応はあるかもしれないが非推奨 |

## **11. セキュリティとコンプライアンス**

* **認証**: GitHubの認証基盤を利用。EnterpriseではSAML SSOなどに対応。
* **データ管理**: 解析データはGitHubのインフラ上で安全に管理される（クラウド版）。Self-hosted Runnerを使えば、ソースコードをGitHub側に送信せずに解析することも構成によっては可能。
* **準拠規格**: OWASP Top 10, CWE Top 25, SANS Top 25 などの主要なセキュリティ基準に対応したクエリセット（Query Suite）が提供されている。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: GitHubの「Security」タブに統合されており、Pull RequestのFiles Changedタブで該当行にアラートが表示されるため、開発者体験（DX）は非常に良い。
* **学習コスト**: デフォルトのクエリセットを使う分には学習コストはほぼゼロ。しかし、カスタムクエリを書く場合は「QL」言語の習得が必要で、これは難易度が高い（SQLや論理プログラミングの知識が役立つ）。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Default Setup**: 可能であればGitHubの「Default Setup」機能を使い、設定ファイルなしで自動構成する。
  * **Pull Requestでのブロック**: 重大な脆弱性（Critical/High）が検出された場合、マージをブロックするルールを設定する。
  * **カスタムクエリの共有**: 組織内で有用なカスタムクエリを作成し、Query Packとして共有・再利用する。
* **陥りやすい罠 (Antipatterns)**:
  * **全ルールを有効化**: 最初から全てのクエリ（Security Extendedなど）を有効にすると、アラートが多すぎて開発者が疲弊する。まずは「Default」スイートから始める。
  * **ビルド設定の無視**: コンパイル言語（Java, C++など）の場合、正確なビルドコマンドをCodeQLに伝えないと、解析精度が落ちる（または解析できない）。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: Reddit (r/devops, r/cybersecurity), Tech Blogs
* **総合評価**: 非常に高い。特にGitHubを利用している組織にとってはデファクトスタンダード。
* **ポジティブな評価**:
  * 「GitHub Actionsとの統合が完璧で、開発フローを阻害しない。」
  * 「バリアント分析が強力で、1つのバグから類似のバグを何個も見つけられた。」
  * 「誤検知が他のSASTツールに比べて少ない。」
* **ネガティブな評価 / 改善要望**:
  * 「QL言語が難しすぎる。簡単なカスタムルールを作るだけでも一苦労。」
  * 「スキャン時間が長い。大きなプルリクエストだと完了まで数十分かかることがある。」
  * 「GitHub Enterpriseのライセンス費用が高い。」

## **15. 直近半年のアップデート情報**

* **2026-02-05 (v2.24.1)**: Kotlin 2.3.0への対応、PythonでのLLMプロンプトインジェクション検知クエリ（実験的）の追加。
* **2026-01-26 (v2.24.0)**: JavaScript/TypeScriptで巨大ファイル（行長200文字超）を最小化ファイルとみなしてスキップする改善、Swift 6.2.3対応。
* **2026-01-09 (v2.23.9)**: 各種言語のバグ修正と安定性向上。
* **2025-12-10 (v2.23.8)**: C# 12の機能サポート強化。

(出典: [CodeQL Changelog](https://codeql.github.com/docs/codeql-overview/codeql-changelog/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | CodeQL | SonarQube | Snyk Code |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | 静的解析 (SAST) | ◎<br><small>深いセマンティック解析</small> | ◯<br><small>広範なルールベース</small> | ◯<br><small>高速なAI解析</small> |
| **言語サポート** | 対応言語数 | ◯<br><small>主要10言語+</small> | ◎<br><small>30言語以上</small> | ◯<br><small>主要言語</small> |
| **カスタマイズ** | クエリ柔軟性 | ◎<br><small>QL言語で自在に記述可</small> | △<br><small>XPath等で限定的</small> | △<br><small>限定的</small> |
| **統合** | GitHub連携 | ◎<br><small>ネイティブ統合</small> | ◯<br><small>PR装飾など対応</small> | ◯<br><small>PRチェック対応</small> |
| **品質** | コード品質指標 | △<br><small>セキュリティ特化</small> | ◎<br><small>複雑度、重複など網羅</small> | △<br><small>セキュリティ特化</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **CodeQL** | GitHub純正の深層解析エンジン | データフロー解析による高い精度、脆弱性の深掘り、GitHub統合 | 解析速度が遅め、言語サポートが主要言語に限られる | GitHubをメインで使用しており、セキュリティを最優先したい場合 |
| **SonarQube** | 汎用的なコード品質プラットフォーム | 圧倒的な対応言語数、セキュリティだけでなく「保守性」も可視化できる | 深い脆弱性（テイント解析）の精度はCodeQLに譲る場合がある | コード品質全体（複雑度、重複など）を管理したい場合、オンプレミス運用が必須の場合 |
| **Snyk Code** | 高速なAIベースのSAST | 非常に高速なスキャン、IDEでの使い勝手が良い | CodeQLほど詳細なカスタムクエリは書けない | 開発者のIDEでリアルタイムに修正させたい場合、スピード重視の場合 |

## **17. 総評**

* **総合的な評価**:
  セキュリティ専門家からも高く評価される、現時点で**最高峰のSASTツールの一つ**です。特にGitHub Advanced Securityを利用できる環境であれば、導入しない手はありません。
* **推奨されるチームやプロジェクト**:
  * GitHubで開発を行っている全てのチーム
  * セキュリティ要件が厳しいエンタープライズ開発
  * オープンソースプロジェクト（無料で利用できるため）
* **選択時のポイント**:
  * **GitHubを使っているか**: GitHub利用者ならCodeQLが第一候補。GitLabやBitbucketならSonarQubeやSnykが有力候補。
  * **何を重視するか**: 「深い脆弱性の発見」ならCodeQL。「コードの綺麗さ（保守性）」ならSonarQube。「スキャン速度」ならSnyk。
