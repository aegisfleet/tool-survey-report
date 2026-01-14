---
# === フロントマター ===
# 【必須項目】
title: "OpenTofu 調査レポート"
tool_name: "OpenTofu"
tool_reading: "オープントフ"
category: "構成管理"
developer: "Linux Foundation"
official_site: "https://opentofu.org/"
date: "2025-10-27"
last_updated: "2026-01-15"
tags:
  - "IaC"
  - "構成管理"
  - "自動化"
  - "クラウド"
  - "オープンソース"
  - "DevOps"
description: "Terraformのオープンソースフォーク。コミュニティ主導で開発されているInfrastructure as Code (IaC) ツール。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "インフラエンジニア"
    - "DevOpsエンジニア"
  latest_highlight: "2026年1月にv1.11.3をリリース"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 87
  base_score: 70
  plus_points:
    - point: 10
      reason: "Terraformとの完全な互換性を持ちつつ、ライセンスリスクがない"
    - point: 5
      reason: "クライアントサイド暗号化など、コミュニティ主導の便利な機能追加が迅速"
    - point: 5
      reason: "Linux Foundation傘下であり、プロジェクトの安定性と中立性が高い"
  minus_points:
    - point: -3
      reason: "Terraformと比較すると、エコシステムやサードパーティツールの対応がまだ発展途上"
  summary: "ライセンス懸念なくTerraformの全機能を使え、コミュニティ主導の改善も魅力的なIaCツール"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/opentofu/opentofu"
  documentation: "https://opentofu.org/docs/"
relationships:
  parent: "Terraform"
  related_tools:
    - "Pulumi"
    - "AWS CloudFormation"
    - "Ansible"
    - "LocalStack"
---

# **OpenTofu 調査レポート**

## **1. 基本情報**

* **ツール名**: OpenTofu
* **ツールの読み方**: オープントフ
* **開発元**: Linux Foundation
* **公式サイト**: [https://opentofu.org/](https://opentofu.org/)
* **関連リンク**:
  * GitHub: [https://github.com/opentofu/opentofu](https://github.com/opentofu/opentofu)
  * ドキュメント: [https://opentofu.org/docs/](https://opentofu.org/docs/)
  * レビューサイト: G2、Capterra、ITreviewにレビュー登録なし (2026年1月時点)
* **カテゴリ**: 構成管理
* **概要**: OpenTofuは、Terraformのオープンソースフォークであり、コミュニティ主導で開発されているInfrastructure as Code (IaC) ツールです。宣言的な設定ファイルを用いて、クラウドやオンプレミスのインフラを安全かつ効率的に構築、変更、バージョン管理します。

## **2. 目的と主な利用シーン**

* **解決する課題**: TerraformのBUSLライセンスへの変更によって生じたベンダーロックインのリスクを回避し、真にオープンソースなIaCツールを提供します。
* **想定利用者**: インフラエンジニア, SRE, DevOpsエンジニア, Terraformのライセンス変更に懸念を持つ企業
* **利用シーン**:
  * Terraformからのシームレスな移行
  * マルチクラウド環境のインフラ構築と一元管理
  * 開発、ステージング、本番環境の一貫したプロビジョニング
  * CI/CDパイプラインへのインフラ自動化の統合

## **3. 主要機能**

* **Terraform v1.5.xとの完全互換**: 既存のTerraformコードとStateファイルをそのまま利用可能。
* **Infrastructure as Code (IaC)**: HCL (HashiCorp Configuration Language) を用いてインフラをコードとして記述。
* **実行計画 (Execution Plans)**: `tofu plan`コマンドで変更適用前に影響範囲をプレビュー。
* **状態管理 (State Management)**: インフラの現在の状態をStateファイルで管理し、コードとの差分を検出。
* **クライアントサイド状態暗号化**: Stateファイルをリモートバックエンドに送信する前に、クライアント側で暗号化し、機密情報を保護。
* **ループ可能なimportブロック**: `for_each`を使用して複数のリソースを一度に`import`可能にし、既存インフラのコード化を効率化。
* **プロバイダーの動的設定**: `for_each`ループを使ってプロバイダー設定を動的に生成し、マルチリージョン展開などを簡潔に記述。
* **除外フラグ**: `plan`や`apply`時に`-exclude`フラグで特定のリソースを一時的に除外。

## **4. 特徴・強み (Pros)**

* **完全なオープンソース**: MPL-2.0ライセンスで公開されており、商用利用を含めライセンスの心配が一切不要。
* **Terraformからの移行が容易**: Terraform v1.5.xまでとの後方互換性が保証されており、コマンドを`terraform`から`tofu`に置き換えるだけで移行可能。
* **コミュニティ主導の開発**: 開発がコミュニティによって推進され、ユーザーが本当に必要とする機能（クライアントサイド暗号化など）が迅速に実装される。
* **中立性と安定性**: プロジェクトがLinux Foundationの管理下にあるため、特定企業の意向に左右されず、長期的な安定性が保証されている。
* **CNCFプロジェクト**: 2025年4月にCNCF (Cloud Native Computing Foundation) のサンドボックスプロジェクトとして採用され、クラウドネイティブエコシステムでの信頼性が向上。

## **5. 弱み・注意点 (Cons)**

* **エコシステムの成熟度**: Terraformに存在する一部のサードパーティツールやドキュメントが、OpenTofuにまだ完全に対応していない可能性がある。
* **HashiCorpとの機能乖離リスク**: 将来的にTerraformが大幅な変更を行った場合、OpenTofuがそれに追従しない、または追従に時間がかかる可能性がある。
* **商用サポートの不在**: OpenTofuプロジェクト自体からの公式な商用サポートはなく、サポートが必要な場合はサードパーティベンダーに依存する必要がある。

## **6. 料金プラン**

OpenTofuはオープンソースソフトウェアのため、すべての機能を無料で利用できます。

| プラン名 | 料金 | 主な特徴 |
|---|---|---|
| **OpenTofu (OSS)** | 無料 | 全機能を利用可能。セルフホストまたはサードパーティのプラットフォーム上で利用。 |

* **課金体系**: なし
* **無料トライアル**: なし (常に無料)

## **7. 導入実績・事例**

* **CNCFサンドボックスプロジェクト**: 2025年4月にCloud Native Computing Foundation (CNCF)に採用されており、クラウドネイティブコミュニティでの信頼性を示しています。
* **主要な支援企業**: Harness, Spacelift, Gruntwork, Scalrなど、多くのテクノロジー企業が支持を表明し、コントリビューターとして開発に参加。
* **導入企業**: 個別の企業名はまだ広く公開されていませんが、Terraformからの移行が容易なため、ライセンスを懸念する多くの企業で採用が進んでいると報告されています。

## **8. サポート体制**

* **ドキュメント**: [公式サイト](https://opentofu.org/docs/)にて、Terraformのドキュメントをベースにした包括的なドキュメントが提供されています。
* **コミュニティ**:
  * **Slack**: [公式Slackチャンネル](https://opentofu.org/slack/)があり、開発者やユーザーが活発に交流しています。
  * **GitHub**: [GitHub Discussions](https://github.com/orgs/opentofu/discussions)や[GitHub Issues](https://github.com/opentofu/opentofu/issues)で質問やバグ報告が可能です。
* **公式サポート**: OpenTofuプロジェクト自体からの商用サポートはありません。Harnessなどの支援企業が各自のプラットフォーム上でOpenTofuの有償サポートを提供しています。

## **9. 連携機能 (API・インテグレーション)**

* **API**: Terraformとの互換性があるため、TerraformのAPIと連携する既存のツールは、多くの場合OpenTofuでも動作します。
* **外部サービス連携**: Terraformと同様に、Public Tofu Registryを通じて数千のプロバイダー（AWS, Azure, GCPなど）やモジュールを利用でき、広範なエコシステムとの連携が可能です。

## **10. セキュリティとコンプライアンス**

* **認証**: 各クラウドプロバイダーが提供する認証機構（IAMロール、サービスアカウント等）を利用。
* **データ管理**: Stateファイルの暗号化機能（v1.7以降）により、機密情報を含むStateファイルをクライアントサイドで暗号化してからリモートに保存可能。
* **準拠規格**: プロジェクト自体は特定の認証を取得していませんが、Linux Foundation傘下のプロジェクトとして、オープンソースのベストプラクティスに準拠しています。

## **11. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: OpenTofuはCUIベースのツールであり、操作性はTerraformと全く同じです。既存のTerraformユーザーであれば、コマンドのエイリアスを設定するだけ (`alias terraform=tofu`) ですぐに利用を開始できます。
* **学習コスト**: Terraform経験者であれば学習コストはほぼゼロです。新規に学習する場合も、Terraform向けに作成された豊富な学習教材やドキュメントを参考にすることができます。

## **12. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub Discussions, 公式Slack, Reddit等の技術フォーラム (G2, Capterra等に登録なし)
* **総合評価**: レビューサイトのスコアなし。コミュニティでは非常にポジティブな評価が多い。
* **ポジティブな評価**:
  * 「Terraformからの移行が驚くほどスムーズだった。ライセンスの懸念から解放されて安心した。」
  * 「コミュニティの反応が速く、自分たちが欲しいと思っていたクライアントサイド暗号化のような機能がすぐに実装された。」
  * 「Linux FoundationとCNCFの後ろ盾があるので、安心して本番環境に投入できる。」
* **ネガティブな評価 / 改善要望**:
  * 「まだTerraformの認知度が高く、チーム内でOpenTofuへの移行を説得するのに少し時間がかかった。」
  * 「Terraform Registryの一部のマイナーなプロバイダーやモジュールが、Tofu Registryでまだ利用できないことがあった。」
  * 「HashiCorpが今後どのような破壊的変更を行ってくるか、という漠然とした不安は残る。」

## **13. 直近半年のアップデート情報**

* **2026-01-13 (v1.11.3)**: 複数のバグ修正とパフォーマンス改善を含むメンテナンスリリース。
* **2025-12-05 (v1.11.0)**: ループ可能な`import`ブロック、`removed`ブロック内での`for_each`サポートなど、リファクタリングを容易にするための機能が強化。
* **2025-10-15 (v1.10.0)**: OCIレジストリのサポート改善や、S3バックエンドでのネイティブなStateロックなどが追加。
* **2025-08-20 (v1.9.0)**: プロバイダーの`for_each`対応や、`plan`/`apply`時の`-exclude`フラグが追加。

(出典: [GitHub Releases](https://github.com/opentofu/opentofu/releases))

## **14. 類似ツールとの比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---|---|---|---|---|
| **OpenTofu** | Terraformのオープンソースフォーク。コミュニティ主導。 | Terraform互換、ライセンスリスクなし、迅速な機能追加 | エコシステムの成熟度、実績 | ライセンスの自由度とコミュニティを重視する場合。Terraformからの移行先として。 |
| **Terraform** | IaCのデファクトスタンダード。HashiCorpが開発。 | 巨大なエコシステム、豊富な実績とドキュメント | BUSLライセンスによるベンダーロックインのリスク | 商用サポートやエコシステムの充実を最優先する場合。 |
| **Pulumi** | 汎用プログラミング言語でインフラを定義。 | 複雑なロジックを記述可能、テストや再利用が容易 | HCLより学習コストが高い、状態管理がSaaS中心 | 開発者が使い慣れた言語でインフラを管理したい場合。 |
| **AWS CloudFormation** | AWS専用のIaCサービス。 | AWSサービスとの緊密な統合、AWSコンソールから利用可 | AWSに完全にロックインされる、YAML/JSONの記述が冗長 | インフラがAWSに限定されている場合。 |

## **15. 総評**

* **総合的な評価**:
  * OpenTofuは、Terraformのライセンス変更をきっかけに生まれた、真にオープンソースなIaCツールです。Terraformからのスムーズな移行パスと完全な互換性を提供しつつ、コミュニティ主導でユーザーが求める便利な機能を迅速に追加しており、非常に有望なプロジェクトと言えます。
* **推奨されるチームやプロジェクト**:
  * これからIaCを導入する、あるいはオープンソースであることを重視するすべてのチーム。
  * 現在Terraformを利用しており、HashiCorpのライセンス変更に懸念を抱いているチーム。
  * CNCFのエコシステムに沿ったツールスタックを好むチーム。
* **選択時のポイント**:
  * Terraformとの互換性が高いため、移行リスクは非常に低いです。ライセンスの自由度と、コミュニリによる迅速な機能改善を重視するならば、OpenTofuはTerraformに代わる強力な第一候補となります。
