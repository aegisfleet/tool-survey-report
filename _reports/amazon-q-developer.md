---
title: "Amazon Q Developer 調査レポート"
tool_name: "Amazon Q Developer"
tool_reading: "アマゾン キュー デベロッパー"
category: "AIコーディングアシスタント"
developer: "Amazon Web Services (AWS)"
official_site: "https://aws.amazon.com/q/developer/"
date: "2026-01-09"
last_updated: "2026-01-09"
tags:
  - "AI"
  - "AWS"
  - "コーディング支援"
  - "開発者ツール"
  - "セキュリティ"
description: "AWSアプリケーションの開発、デバッグ、運用を支援する生成AIアシスタント。IDEやAWSコンソールに統合され、コード生成からインフラ管理まで幅広くサポートする。"
quick_summary:
  has_free_plan: true
  is_oss: false
  starting_price: "$19/月"
  target_users:
    - "AWS開発者"
    - "クラウドエンジニア"
    - "エンタープライズ"
  latest_highlight: "2025年11月にCLI機能が「Kiro CLI」へと統合・移行"
  update_frequency: "高"
evaluation:
  score: 82
  base_score: 70
  plus_points:
    - point: 5
      reason: "AWSサービスとの深い統合とインフラ管理能力"
    - point: 4
      reason: "Java/NETのバージョンアップグレードなどのコード変換機能が強力"
    - point: 3
      reason: "個人利用向けの無料プランが充実している"
  minus_points:
    - point: -2
      reason: "AWS以外の汎用的な開発タスクでは競合に劣る場合がある"
    - point: -2
      reason: "CLI機能のKiroへの移行による一時的な混乱の可能性"
  summary: "AWS環境での開発において最強のアシスタントだが、汎用的な利用では競合と比較が必要。"
links:
  documentation: "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html"
relationships:
  related_tools:
    - "Kiro"
    - "GitHub Copilot"
    - "GitLab Duo"
    - "Cursor"
    - "AWS CloudFormation"
    - "Claude"
---

# **Amazon Q Developer 調査レポート**

## **1. 基本情報**

* **ツール名**: Amazon Q Developer
* **ツールの読み方**: アマゾン キュー デベロッパー
* **開発元**: Amazon Web Services (AWS)
* **公式サイト**: [https://aws.amazon.com/q/developer/](https://aws.amazon.com/q/developer/)
* **関連リンク**:
  * ドキュメント: [https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html)
  * レビューサイト: [G2](https://www.g2.com/products/amazon-q-developer/reviews)
* **カテゴリ**: AIコーディングアシスタント / クラウド開発支援
* **概要**: Amazon Q Developerは、AWS上でのアプリケーション構築、運用、トラブルシューティングを加速させるための生成AIアシスタントです。IDEでのコード生成だけでなく、AWSマネジメントコンソール上でのインフラ構成相談やエラー診断、さらにはレガシーコードのアップグレードまで、開発ライフサイクル全体を支援します。以前は「Amazon CodeWhisperer」として知られていた機能を含み、大幅に拡張されています。

## **2. 目的と主な利用シーン**

* **解決する課題**: AWSサービスの複雑な設定やベストプラクティスの調査時間の短縮、定型的なコーディング作業の自動化、レガシーシステムのモダナイゼーションにおける工数削減。
* **想定利用者**: AWSを利用するソフトウェアエンジニア、DevOpsエンジニア、クラウドアーキテクト。
* **利用シーン**:
  * IDE内での機能実装コードや単体テストの自動生成
  * AWSマネジメントコンソールでの「EC2インスタンスの選び方」などの自然言語による相談
  * エラーログの原因分析と修正案の提示
  * Java 8から17へのバージョンアップグレードなどの大規模なコード変換タスク

## **3. 主要機能**

* **コード生成と補完**: IDE（VS Code, IntelliJ IDEAなど）で、コメントや自然言語の指示からコードを生成。複数行の補完も可能。
* **Amazon Q Chat**: IDEやAWSコンソール上で対話形式による技術的な質問、コードの説明、デバッグ支援を提供。
* **セキュリティスキャン**: コード内の脆弱性を検出し、修正案を提示する機能（旧CodeWhispererの機能）。
* **Amazon Q Developer Agents**: 機能の実装、ドキュメント作成、テスト、コードレビューなどを自律的に実行するエージェント機能。
* **コード変換 (Code Transformation)**: Javaや.NETアプリケーションのバージョンアップグレードや、WindowsからLinuxへのポーティングを自動化。
* **AWSインフラ管理支援**: コンソール上でリソースのコスト分析、設定ミス診断、アーキテクチャの提案を行う。
* **GitHub統合 (Preview)**: GitHubのインターフェース内で直接コード生成やプルリクエストのレビューを行う機能。

## **4. 特徴・強み (Pros)**

* **AWSとの圧倒的な親和性**: AWS SDKやCDK、CloudFormationの記述において、他の汎用AIツールよりも正確でベストプラクティスに沿った提案が可能。
* **強力なコード変換機能**: Javaのバージョンアップグレードなど、手作業では膨大な時間がかかるタスクを大幅に短縮できる点は独自の強み。
* **充実した無料プラン**: 個人開発者向けには多くの機能が無料で提供されており、手軽に導入できる。
* **セキュリティ重視**: AWSのセキュリティ基準に基づいたスキャンと修正提案が可能で、エンタープライズ利用に適している。

## **5. 弱み・注意点 (Cons)**

* **CLI機能の移行**: 2025年11月より、CLI機能は「Kiro CLI」に移行・統合されたため、従来のQ Developer CLIユーザーはアップグレードが必要。
* **汎用性の限界**: フロントエンド開発やAWSに関係のないロジックの実装では、GitHub CopilotやCursorと比較してコンテキスト理解や提案精度が劣る場合がある。
* **複雑なアーキテクチャへの対応**: 非常に複雑なAWSアーキテクチャの質問に対しては、一般的すぎる回答が返ってくることがある。
* **日本語対応**: チャットは日本語に対応しているが、ドキュメントや一部の高度な機能のUIは英語が中心の場合がある。

## **6. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---|---|---|
| **Free Tier** | 無料 | 個人向け。コード生成、チャット、月50回のエージェント利用、月500回のセキュリティスキャン。 |
| **Pro Tier** | $19/ユーザー/月 | 企業・組織向け。無制限のエージェント利用、無制限のセキュリティスキャン、ユーザー管理、SSO対応。 |

* **課金体系**: ユーザー単位の月額課金。
* **無料トライアル**: Free Tierは期限なしで利用可能。

## **7. 導入実績・事例**

* **導入企業**: BT Group, National Australia Bank, Toyota Connected, Takeda Pharmaceuticals など。
* **導入事例**: BT Groupでは、Amazon Q Developerを使用することで、ボイラープレートコードの作成時間を削減し、数十万行のJavaコードのアップグレードを実施。
* **対象業界**: 金融、通信、製造、ヘルスケアなど、AWSを利用するあらゆる業界。

## **8. サポート体制**

* **ドキュメント**: AWS公式ドキュメントとして非常に詳細な情報が提供されている。
* **コミュニティ**: AWS re:PostやGitHub Issues、各種デベロッパーコミュニティで活発な議論が行われている。
* **公式サポート**: AWSサポートプランに準じて、技術的な問い合わせが可能。

## **9. 連携機能 (API・インテグレーション)**

* **API**: 開発者向けのAPIも提供されており、カスタムツールへの組み込みが可能。
* **外部サービス連携**:
  * IDE: VS Code, IntelliJ IDEA, Visual Studio
  * チャットツール: Slack, Microsoft Teams（AWS Chatbot経由）
  * リポジトリ: GitHub, GitLab, Bitbucket

## **10. セキュリティとコンプライアンス**

* **認証**: AWS IAM Identity Centerを使用したSSO認証に対応。
* **データ管理**: プロ設定では、ユーザーのコードがAmazon Qの学習に使用されないように設定可能。AWSの厳格なセキュリティ基準に準拠。
* **準拠規格**: SOC 2, ISO 27001, HIPAA, GDPRなど、AWSが取得している主要なコンプライアンス認証に対応。

## **11. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: IDEの拡張機能としてシームレスに動作し、チャットウィンドウも直感的。AWSコンソール内でもポップアップで手軽に質問できる。
* **学習コスト**: 一般的なAIチャットツールと同様の操作感であるため、導入障壁は低い。ただし、AWS特有の用語や概念の理解は必要。

## **12. ユーザーの声（レビュー分析）**

* **調査対象**: G2, Capterra
* **総合評価**: 4.5/5.0 (G2)
* **ポジティブな評価**:
  * 「AWS CDKのコードを書く際に、ドキュメントを行き来する時間が大幅に減った」
  * 「Javaのアップグレード機能は魔法のようで、数週間の作業が数日に短縮された」
  * 「無料枠でも十分な機能が使えるのがありがたい」
* **ネガティブな評価 / 改善要望**:
  * 「AWS以外のライブラリに関する質問の精度がイマイチ」
  * 「たまに古いAWSの書き方を提案してくることがある」
  * 「CLIがKiroに変わって、使い方が少し変わったので戸惑った」
* **特徴的なユースケース**:
  * 社内のAWSインフラに関する質問対応ボットとしてSlackに統合して利用。

## **13. 直近半年のアップデート情報**

* **2025-11-17**: CLI機能が「Kiro CLI」として独立・移行。Q Developer CLIユーザーは`q update`で移行可能に。
* **2025-11-xx**: GitHub内でのプレビュー機能（コード生成、レビュー）の提供開始。
* **2025-08-06**: コード変換機能（Java Transformation）にジョブ履歴の確認機能を追加。
* **2025-01-07**: IDE内でのインラインチャット機能の強化と、ECSタスク定義作成支援の改善。

(出典: [AWS Documentation History](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/doc-history.html), [AWS News Blog](https://aws.amazon.com/blogs/aws/))

## **14. 類似ツールとの比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---|---|---|---|---|
| **Amazon Q Developer** | AWS特化型AIアシスタント | AWSインフラ、CDK、コード変換に強い。無料枠が大きい。 | 汎用的な開発タスクでは他社に劣る場合がある。 | AWS中心の開発、レガシーコードの移行、AWS環境の運用。 |
| **GitHub Copilot** | 汎用的なAIコーディング支援 | 圧倒的なユーザー数、多言語対応、高速な補完。 | インフラ管理やコード変換機能はない。 | 一般的なWeb/アプリ開発、AWSに依存しないプロジェクト。 |
| **Cursor** | AIネイティブエディタ | コードベース全体の理解、編集能力が高い。 | エディタを変える必要がある（VS Codeフォーク）。 | 大規模なリファクタリング、複雑なコードベースの理解が必要な場合。 |
| **Kiro** | AIコードエディタ (CLI含む) | スペック駆動開発、エージェント機能。CLIが強力。 | まだ新しいツール。Q Developer CLIの後継。 | 高度なCLI操作や自律エージェントによる開発を好む場合。 |

## **15. 総評**

* **総合的な評価**: Amazon Q Developerは、AWSを利用する開発者にとって必携のツールです。特にインフラ構築（IaC）やAWSサービスのトラブルシューティングにおいて、他のAIツールを凌駕する価値を提供します。また、コード変換機能はエンタープライズのレガシー資産活用において強力な武器となります。
* **推奨されるチームやプロジェクト**: AWS上でサービスを構築・運用しているチーム、Java等のレガシーコードの更新を抱えている組織。
* **選択時のポイント**: AWSに特化した支援が必要か、汎用的なコーディング支援が必要かで判断します。GitHub Copilotと併用することも一般的で、それぞれの強みを生かした使い分けが推奨されます。
