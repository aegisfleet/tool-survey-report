---
# === フロントマター ===
# 【必須項目】
title: "SonarQube Cloud 調査レポート"
tool_name: "SonarQube Cloud"
tool_reading: "ソナーキューブ クラウド / ソナークラウド"
category: "コード品質"
developer: "SonarSource"
official_site: "https://sonarcloud.io/"
date: "2026-02-18"
last_updated: "2026-02-18"
tags:
  - "コード品質"
  - "静的解析"
  - "SAST"
  - "DevSecOps"
  - "SaaS"
  - "CI/CD"
description: "40以上の言語に対応したクラウドベースの静的コード解析プラットフォーム。GitHubなどのクラウドALMと連携し、プルリクエストごとにコード品質とセキュリティを自動チェックします。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: false
  starting_price: "€10/月 (100k LOC)"
  target_users:
    - "開発者"
    - "スタートアップ"
    - "DevOpsチーム"
  latest_highlight: "SonarCloud から SonarQube Cloud へリブランディング"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 88
  base_score: 70
  plus_points:
    - point: 8
      reason: "インフラ管理不要で即座に利用開始できる手軽さ（SaaS）"
    - point: 5
      reason: "オープンソースプロジェクトであれば全機能を無料で利用可能"
    - point: 5
      reason: "GitHub, Bitbucket, Azure DevOps, GitLab との連携が極めてスムーズ"
  minus_points:
    - point: -0
      reason: ""
  summary: "インフラ管理の手間なく、業界標準のコード品質管理を導入できる強力なSaaSツール。OSS開発やスタートアップに最適。"

# 【任意項目】該当するもののみ記載
links:
  documentation: "https://docs.sonarcloud.io/"
relationships:
  related_tools:
    - "SonarQube"
    - "Snyk"
    - "Codacy"
---

# **SonarQube Cloud 調査レポート**

## **1. 基本情報**

* **ツール名**: SonarQube Cloud (旧 SonarCloud)
* **ツールの読み方**: ソナーキューブ クラウド / ソナークラウド
* **開発元**: SonarSource
* **公式サイト**: [https://sonarcloud.io/](https://sonarcloud.io/)
* **関連リンク**:
  * ドキュメント: [https://docs.sonarcloud.io/](https://docs.sonarcloud.io/)
  * レビューサイト: [G2](https://www.g2.com/products/sonarqube/reviews) | [Capterra](https://www.capterra.com/p/168436/SonarCloud/)
  * コミュニティ: [https://community.sonarsource.com/c/sc/9](https://community.sonarsource.com/c/sc/9)
* **カテゴリ**: コード品質, 静的解析 (SAST), DevSecOps
* **概要**: SonarQube Cloud は、開発者のワークフローに統合されたクラウドベースのコード品質・セキュリティ分析サービスです。40以上の言語に対応し、バグ、脆弱性、コードの臭い（Code Smells）を自動検出し、プルリクエストの段階で修正を促します。SonarQube のSaaS版として位置づけられ、インフラ管理不要で利用できます。

## **2. 目的と主な利用シーン**

* **解決する課題**: コードレビューの自動化、セキュリティ脆弱性の早期発見、技術的負債の可視化と削減。特にSaaS環境での開発において、サーバー管理のコストをかけずに高度な解析機能を導入したいというニーズに応えます。
* **想定利用者**: クラウドベースで開発を行うソフトウェア開発チーム、オープンソースプロジェクトのメンテナ、DevOpsエンジニア。
* **利用シーン**:
  * GitHub / GitLab / Bitbucket / Azure DevOps 上のプルリクエストに対する自動コードレビュー
  * オープンソースプロジェクトの品質保証（無料利用可能）
  * マイクロサービスアーキテクチャにおける多数のリポジトリの一元管理

## **3. 主要機能**

* **マルチ言語解析**: Java, JavaScript, TypeScript, Python, C#, C++, Go, Swift, Kotlin, Ruby, PHPなど、40以上の主要なプログラミング言語をサポート。
* **自動解析 (Automatic Analysis)**: GitHub上の特定の言語（JS/TS, Python, PHPなど）のプロジェクトに対して、CI設定ファイルなしで自動的に解析を実行可能。
* **プルリクエスト装飾 (Pull Request Decoration)**: プルリクエストの画面上に解析結果（バグ、脆弱性、カバレッジ低下など）を直接コメントとして表示。
* **品質ゲート (Quality Gates)**: 「新しいコードのカバレッジ80%以上」「クリティカルなIssueゼロ」などの基準を設定し、満たさない場合はマージをブロック。
* **SonarLint 連携**: IDE拡張機能である SonarLint と連携し、ローカルでのコーディング中とCIでの解析ルールを同期（Connected Mode）。
* **ブランチ解析**: フィーチャーブランチやロングリブブランチごとの品質推移を追跡。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * GitHub, Bitbucket, Azure DevOps, GitLab のいずれかのアカウント
  * 解析対象のソースコードがクラウド上のリポジトリにあること
* **導入手順**:
  1. 公式サイト (https://sonarcloud.io/) にアクセスし、既存のALMアカウント（GitHub等）でログイン。
  2. インポートしたい組織（Organization）を選択し、SonarQube Cloud アプリをインストール。
  3. 解析したいリポジトリを選択してプロジェクトを作成。
  4. Automatic Analysis 対応言語の場合は即座に解析開始。非対応言語（Java, C#など）の場合は、提供されるスニペットをCIパイプライン（GitHub Actions, .gitlab-ci.yml等）に追加。
* **初期設定**:
  * Quality Gate の定義（デフォルトの "Sonar Way" から必要に応じてカスタマイズ）。
  * 解析範囲の調整（`sonar.sources`, `sonar.tests`, `sonar.exclusions` などを `sonar-project.properties` で設定）。

## **5. 特徴・強み (Pros)**

* **インフラ管理不要**: サーバーの構築、維持、アップデートが一切不要で、常に最新の解析エンジンを利用可能。
* **ALMツールとの親和性**: GitHub等の主要プラットフォームと深く統合されており、数クリックで導入が完了する。
* **OSSへの貢献**: 公開されているオープンソースプロジェクトであれば、Enterprise相当の機能を完全に無料で利用できる。
* **高速なフィードバック**: プルリクエスト作成直後に解析が走り、レビュー前に品質チェックが終わるため、開発サイクルを止めない。

## **6. 弱み・注意点 (Cons)**

* **カスタマイズの制限**: SonarQube Server（オンプレ版）に比べ、プラグインの追加や一部の高度な設定変更が制限されている。
* **インターネット接続必須**: ソースコードをクラウド（SonarSourceのサーバー）に送信して解析するため、完全な閉域網での利用や厳格なデータ持ち出し規制がある場合は不向き。
* **料金体系**: 行数（LOC）ベースの課金であるため、大規模なレガシーコードベースを持つ場合、コストが高額になる可能性がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Free** | 無料 | パブリックプロジェクト（OSS）限定。全機能利用可能。 |
| **Paid** | €10/月〜 | プライベートプロジェクト用。100k LOCまで€10。以降LOC数に応じて変動。 |
| **Enterprise** | 要問い合わせ | 大規模組織向け。ポートフォリオ管理、高度なサポートなど。 |

* **課金体系**: 分析対象の全プライベートプロジェクトの合計コード行数（LOC）に基づく従量課金（段階的な定額制）。
* **無料トライアル**: プライベートプランの14日間無料トライアルあり。

## **8. 導入実績・事例**

* **導入企業**: 数千〜数万の企業・プロジェクトで利用されている。具体的な事例として、多くのオープンソースプロジェクトがバッジを表示している。
* **対象業界**: Webサービス、モバイルアプリ開発、SaaSベンダーなど、クラウドネイティブな開発を行う組織。

## **9. サポート体制**

* **ドキュメント**: [SonarQube Cloud Documentation](https://docs.sonarcloud.io/) が充実している（英語）。
* **コミュニティ**: Sonar Community Forum で活発な質疑応答が行われている。
* **公式サポート**: 有償プラン向けにサポートが提供される。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Web API が提供されており、メトリクスの取得や設定変更が可能。
* **外部サービス連携**: GitHub, Bitbucket Cloud, Azure DevOps, GitLab とのネイティブ連携が強力。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **JavaScript / TypeScript** | ◎ | Automatic Analysisにより設定不要で解析可能 | 特になし |
| **Java / Kotlin** | ◯ | Maven / Gradle プラグインで容易に統合可能 | コンパイルが必要なためCIでのビルドステップへの組み込みが必須 |
| **C# (.NET)** | ◯ | .NET スキャナーを利用して解析 | ビルドプロセスへの統合が必要 |
| **C / C++** | ◯ | Build Wrapper を使用して高精度な解析が可能 | 解析環境のセットアップがやや複雑 |

## **11. セキュリティとコンプライアンス**

* **認証**: GitHub, Bitbucket, Azure DevOps, GitLab のOAuth認証を利用。SAML SSOなどはEnterpriseプランで対応。
* **データ管理**: AWS (Amazon Web Services) 上でホストされており、SOC 2 Type II などの認証を取得。解析後のソースコードは保存されない（キャッシュを除く）。
* **準拠規格**: ISO 27001 認証取得済み。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: モダンで洗練されたWeb UI。プロジェクトの健全性（Overall Code Health）が一目でわかるダッシュボードが特徴。
* **学習コスト**: 導入は非常に簡単だが、検出されたIssueの修正方法やQuality Gateの適切な調整には一定の知識が必要。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Clean as You Code**: 全体の技術的負債をゼロにすることに固執せず、「New Code（新しいコード）」の品質を完璧に保つことに注力する。Quality Gate も "New Code" に対して厳格に設定する。
  * **SonarLint の導入**: 各開発者のIDEに SonarLint を入れ、Connected Mode で SonarQube Cloud と同期させることで、コミット前に問題を修正する。
* **陥りやすい罠 (Antipatterns)**:
  * **過剰なルール適用**: 誤検知が多いルールを放置してオオカミ少年化させる。不要なルールはプロファイルから除外するか、Issueを "Won't Fix" / "False Positive" としてマークし、AI学習させる。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2, Capterra
* **総合評価**: 4.4 / 5.0 (SonarQubeとしての評価が多いが、SaaS版も同様に高評価)
* **ポジティブな評価**:
  * 「セットアップが信じられないほど簡単」
  * 「GitHubのプルリクエストに直接コメントしてくれるのが便利」
  * 「OSSなら無料で使えるのが素晴らしい」
* **ネガティブな評価 / 改善要望**:
  * 「モノレポ（Monorepo）のサポート設定が少し複雑」
  * 「スキャン時間が長くなることがある」
  * 「誤検知（False Positive）の報告フローがもっと簡単だと良い」

## **15. 直近半年のアップデート情報**

* **2025年後半**: "SonarCloud" から "SonarQube Cloud" へのリブランディングが進行。
* **継続的**: 新しい言語バージョンのサポート（Java 21, Python 3.12など）や、AIによるコード修正提案機能（AI CodeFix）の強化。
* **機能追加**: Terraform や AWS CloudFormation などの IaC (Infrastructure as Code) スキャンの強化。

(出典: [SonarSource Blog](https://www.sonarsource.com/blog/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | SonarQube Cloud | SonarQube Server | Snyk | GitHub Advanced Security |
|:---:|:---|:---:|:---:|:---:|:---:|
| **導入形態** | SaaS / オンプレ | SaaS | オンプレ (Self-hosted) | SaaS | SaaS |
| **基本機能** | 静的解析 (SAST) | ◎ | ◎ | ◯ | ◎ |
| **セキュリティ** | 脆弱性検知 | ◯ | ◯ | ◎ | ◎ |
| **コスト** | 無料プラン | ◎ (OSSのみ) | ◎ (Community版) | △ (制限あり) | × (OSSのみ) |
| **運用** | インフラ管理 | 不要 | 必要 | 不要 | 不要 |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **SonarQube Cloud** | SaaS版SonarQube | インフラ管理不要、GitHub連携最強 | カスタマイズ性がServer版より低い | クラウドベースの開発、OSS、運用コストを下げたい場合 |
| **SonarQube Server** | オンプレ版SonarQube | データ管理の完全性、プラグイン拡張 | サーバー構築・運用の手間がかかる | 閉域網での利用、厳格なデータ統制が必要な場合 |
| **Snyk** | セキュリティ特化 | 脆弱性DBの質が高い、依存関係チェックに強い | コード品質（バグ・臭い）の検出はSonarに劣る | セキュリティ脆弱性の排除を最優先する場合 |

## **17. 総評**

* **総合的な評価**: コード品質管理のデファクトスタンダードであるSonarQubeの機能を、手軽なSaaSとして利用できる非常に優れたサービス。特にGitHubで開発を行っているチームにとっては、導入しない理由が見当たらないほど親和性が高い。
* **推奨されるチームやプロジェクト**: スタートアップ、Web系企業、オープンソースプロジェクト、DevOpsを推進するチーム。
* **選択時のポイント**: 自社でサーバーを管理できるリソースがあるか、ソースコードを外部に出せるか（セキュリティポリシー）が判断の分かれ目となる。管理コストを嫌うなら SonarQube Cloud 一択。
