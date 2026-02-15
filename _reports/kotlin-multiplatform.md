---
# === フロントマター ===
# 【必須項目】
title: "Kotlin Multiplatform 調査レポート"
tool_name: "Kotlin Multiplatform"
tool_reading: "コトリン マルチプラットフォーム"
category: "モバイル開発"
developer: "JetBrains"
official_site: "https://kotlinlang.org/multiplatform/"
date: "2026-02-15"
last_updated: "2026-02-15"
tags:
  - "モバイル開発"
  - "クロスプラットフォーム"
  - "Kotlin"
  - "オープンソース"
  - "Compose Multiplatform"
description: "ビジネスロジックを共有し、UIはネイティブまたはCompose Multiplatformで構築することで、コードの再利用とネイティブパフォーマンスを両立させる開発技術。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "モバイルアプリ開発者"
    - "Android/iOSエンジニア"
    - "大規模開発チーム"
  latest_highlight: "2025年にCompose Multiplatform for iOSが安定版(Stable)に到達し、UI共有の実用性が飛躍的に向上"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 8
      reason: "ビジネスロジックの共有とネイティブパフォーマンスの両立という独自の強み"
    - point: 5
      reason: "既存のアプリに部分的に導入できる柔軟性（インクリメンタル採用）"
    - point: 5
      reason: "JetBrainsによる強力なIDEサポートとGoogleによる公式サポート"
    - point: 5
      reason: "Compose Multiplatform for iOSの安定化によりUI共有も現実的な選択肢に"
  minus_points:
    - point: -3
      reason: "Gradle設定や環境構築の複雑さが依然として残る"
    - point: -3
      reason: "iOS開発において、Swift/Objective-CやiOSエコシステムの知識が必須"
    - point: -2
      reason: "純粋なSwiftUIやUIKitに比べると、iOS固有の最新UI機能への即応にラグがある"
  summary: "ロジック共有とネイティブ品質を両立させる最有力候補。Composeの成熟によりUI共有の選択肢も加わり、死角がなくなった。"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/JetBrains/kotlin"
  documentation: "https://kotlinlang.org/docs/multiplatform.html"
relationships:
  parent: "IntelliJ IDEA"
  children:
    - "Compose Multiplatform"
  related_tools:
    - "Flutter"
    - "React Native"
    - "Android Studio"
    - "SwiftUI"
---

# **Kotlin Multiplatform 調査レポート**

## **1. 基本情報**

* **ツール名**: Kotlin Multiplatform (KMP)
* **ツールの読み方**: コトリン マルチプラットフォーム
* **開発元**: JetBrains
* **公式サイト**: [https://kotlinlang.org/multiplatform/](https://kotlinlang.org/multiplatform/)
* **関連リンク**:
  * GitHub: [https://github.com/JetBrains/kotlin](https://github.com/JetBrains/kotlin)
  * ドキュメント: [https://kotlinlang.org/docs/multiplatform.html](https://kotlinlang.org/docs/multiplatform.html)
* **カテゴリ**: モバイル開発 / クロスプラットフォーム開発
* **概要**: Kotlin Multiplatform (KMP) は、JetBrainsが開発した、iOS、Android、Web、デスクトップ、サーバーサイドなどでコードを共有するための技術です。UIはプラットフォーム固有のネイティブUIを使用するか、Compose Multiplatformを使用して共有するかを選択でき、ビジネスロジックの共通化とネイティブパフォーマンスの両立を実現します。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * プラットフォームごとの重複したビジネスロジック実装による工数増加とバグの発生。
  * クロスプラットフォーム開発におけるパフォーマンス低下や、ネイティブ機能へのアクセス制限。
  * 既存アプリをすべて書き直すことなく、徐々にコード共有を導入したいというニーズ。
* **想定利用者**:
  * Android/iOSアプリ開発者
  * モバイル開発チーム（特に中規模〜大規模）
  * サーバーサイドKotlinを利用しているチーム
* **利用シーン**:
  * AndroidとiOSアプリで、通信処理、データモデル、バリデーションロジックを共有する。
  * Compose Multiplatformを使用して、AndroidとiOSでUIコードも含めて共有する。
  * 既存のネイティブアプリの一部機能（例：新しい機能モジュール）だけをKMPで実装・共有する。

## **3. 主要機能**

* **共通コード (Common Code)**: `commonMain` ソースセットに記述されたKotlinコードは、すべてのターゲットプラットフォームで共有・コンパイルされます。
* **Expect / Actual 機構**: プラットフォーム固有のAPIにアクセスする必要がある場合、共通コードで `expect` 宣言を行い、各プラットフォーム固有のコードで `actual` 実装を提供することで解決します。
* **Compose Multiplatform**: GoogleのJetpack Composeをベースにした宣言的UIフレームワーク。Android、iOS、デスクトップ、WebでUIコードを共有できます（iOS版は2025年にStable化）。
* **Kotlin/Native**: KotlinコードをLLVMを使用してネイティブバイナリにコンパイルし、JVMなしで実行可能にします（iOS向けなど）。
* **Swift Interop**: SwiftコードからKotlinコードを直接呼び出すことができ、Objective-Cブリッジを経由するものの、近年はよりSwiftライクなAPI生成が可能になっています（SKIEなどのツールも存在）。
* **Kotlin/Wasm**: WebAssemblyへのコンパイルをサポートし、Webブラウザでの実行パフォーマンスを向上させています。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * macOS (iOS開発を行う場合必須)、Windows、またはLinux
  * JDK 17以上
  * Android Studio (推奨) または IntelliJ IDEA
  * Xcode (iOS開発を行う場合必須)
* **インストール/導入**:
  KMP自体はKotlinプラグインに含まれているため、Android Studio等をインストールすれば利用可能です。
  ```bash
  # KDoctorによる環境チェック (推奨)
  brew install kdoctor
  kdoctor
  ```
* **初期設定**:
  * Android Studioの「New Project」から「Kotlin Multiplatform App」ウィザードを選択。
  * 共有するターゲット（Android, iOS, Desktop等）とUIフレームワーク（Compose or Native）を選択。
* **クイックスタート**:
  * ウィザードで生成されたプロジェクトを開き、共通コード (`shared/src/commonMain/kotlin`) にロジックを記述。
  * Androidターゲットを選択してRun、iOSターゲットを選択してRunでそれぞれのシミュレータで動作確認。

## **5. 特徴・強み (Pros)**

* **ネイティブパフォーマンス**: JVM、JavaScript、Nativeバイナリなど、各プラットフォームに最適な形式にコンパイルされるため、パフォーマンスの劣化がほとんどありません。
* **柔軟な共有戦略**: 「ロジックのみ共有」「UIも共有（Compose）」「特定機能のみ共有」など、プロジェクトの要件に合わせて共有範囲を柔軟に選択できます。
* **インクリメンタル（段階的）導入**: アプリ全体を作り直す必要がなく、既存のネイティブアプリにライブラリとして組み込む形で導入を開始できます。
* **強力なツールチェーン**: 開発元がIDEベンダーのJetBrainsであるため、IntelliJ IDEAやAndroid Studioでの開発体験（コード補完、リファクタリング、デバッグ）が非常に優れています。
* **Googleによる公式サポート**: Android開発の公式言語であるKotlinをベースにしており、GoogleもKMPライブラリ（Jetpackなど）の提供を積極的に行っています。

## **6. 弱み・注意点 (Cons)**

* **環境構築の複雑さ**: Gradleの設定が複雑になりがちで、特にiOS向けのビルド設定（Xcodeとの連携）には慣れが必要です。
* **iOS開発の知識が必要**: 完全にiOSの知識なしで開発することは難しく、特にネイティブUIを採用する場合やビルドエラーの解決にはXcodeやSwift/Objective-Cの知識が求められます。
* **ライブラリのエコシステム**: 純粋なKotlinライブラリ（KMP対応ライブラリ）は増えていますが、Java専用ライブラリやSwift専用ライブラリをそのまま共通コードで使うことはできません。
* **Compose Multiplatform for iOSの成熟度**: 安定版となりましたが、プラットフォーム固有のUI挙動（スクロール感性やアクセシビリティなど）の完全な再現にはまだ課題が残る場合があります。

## **7. 料金プラン**

Kotlin Multiplatformはオープンソースプロジェクトであり、基本的に無料で利用できます。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース** | 無料 | すべての機能が無料で利用可能。Apache 2.0 ライセンス。 |

* **課金体系**: なし
* **無料トライアル**: なし

## **8. 導入実績・事例**

* **導入企業**: Netflix, VMware, McDonald's, Google (Google Workspace), X (旧Twitter), 9GAG, Baiduなど。
* **導入事例**:
  * **McDonald's**: 世界中のマクドナルドアプリでビジネスロジックを共有し、開発効率と品質を向上。
  * **Netflix**: スタジオアプリ「Prodicle」でネットワーク層やデータ永続化層を共有。
  * **Google Workspace**: Google Docs, Sheets, SlidesのiOS/Androidアプリでロジック共有を推進。
* **対象業界**: 業界を問わず、特にiOS/Android両方のアプリを提供するサービスで広く採用されています。

## **9. サポート体制**

* **ドキュメント**: 公式ドキュメントは非常に充実しており、チュートリアル、サンプルコード、APIリファレンスが整備されています。
* **コミュニティ**: Kotlin Slack (2025年時点で5万人以上)、Stack Overflow、Redditなどで活発な議論が行われています。
* **公式サポート**: JetBrainsによる開発とサポートに加え、GoogleもAndroid開発者向けにKMPのサポートを強化しています。商用サポートとしてはJetBrainsのパートナーネットワークが存在します。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: 各プラットフォームのネイティブAPIに直接アクセス可能です（iOSのUIKit/SwiftUI, AndroidのAndroid SDKなど）。
* **外部サービス連携**: Ktor（通信）、SQLDelight/Room（データベース）、Koin（DI）などのKMP対応ライブラリを使用することで、バックエンドAPIやデータベースとの連携が容易です。FirebaseのKMP SDKも提供されています。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Android Studio** | ◎ | 公式IDEであり、最高の開発体験を提供。 | iOSのビルド・デバッグにはMacが必要。 |
| **Xcode** | ◯ | iOS側のコード編集やデバッグに必須。 | Kotlinコードの直接編集はできない（プラグイン等が必要）。 |
| **Compose Multiplatform** | ◎ | UIコードまで共有可能になり、開発効率が最大化。 | iOSの完全なネイティブUI再現には調整が必要。 |
| **SwiftUI** | ◯ | iOSネイティブUIとしてKMPと組み合わせるのが一般的。 | ビューモデル層での接続にボイラープレートが必要な場合がある。 |

## **11. セキュリティとコンプライアンス**

* **認証**: KMP自体は認証機能を提供しませんが、Firebase Authや独自のOAuth実装などを共通コードまたはプラットフォーム固有コードで実装可能です。
* **データ管理**: SQLDelightやRoomなどを使用してローカルデータベースを暗号化（SQLCipherなどと連携）して利用することが一般的です。
* **準拠規格**: オープンソースソフトウェアとして開発されており、特定の認証規格の対象ではありませんが、金融機関や医療系アプリでの採用実績もあり、適切な実装により高いセキュリティ要件を満たすことができます。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**:
  * **ネイティブUI採用時**: プラットフォーム標準のUIをそのまま利用するため、最高のユーザー体験を提供できます。
  * **Compose Multiplatform採用時**: 宣言的UIで効率的に開発できます。マテリアルデザインがベースですが、iOS風のカスタマイズも可能です。
* **学習コスト**: Android開発者（Kotlin経験者）にとっては参入障壁が低いです。iOS開発者にとってはKotlin言語とGradleの学習が必要です。初学者の場合、両方のプラットフォームの知識が必要になるため、Flutterなどに比べると学習コストはやや高めです。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **ライブラリの選定**: 通信はKtor、DIはKoin、DBはSQLDelight/Roomなど、KMP対応が成熟したライブラリを中心に構成する。
  * **ViewModelの共有**: UIロジックまで共有するために、ViewModelを共通コードに置き、Flow/StateFlowでUIに状態を通知するアーキテクチャを採用する。
  * **SKIEの利用**: iOS (Swift) からの呼び出しをより自然にするために、SKIEなどのツールを活用してKotlinのFlowやSealed ClassをSwiftフレンドリーに変換する。
* **陥りやすい罠 (Antipatterns)**:
  * **過度な共通化**: UIの細部やプラットフォーム固有の振る舞いまで無理に共通化しようとして、条件分岐だらけのコードになる。
  * **シングルトンの乱用**: ネイティブ側のライフサイクルを無視したシングルトンやGlobalScopeの使用はメモリリークの原因となる。
  * **同期処理の強制**: ネットワーク処理などをメインスレッドでブロックしてしまう（KMPでは特にスレッド管理に注意が必要）。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2, Reddit, 各種テックブログ (2025-2026年の情報)
* **総合評価**: 4.7/5.0 (推定: 開発者コミュニティでの高い評価に基づく)
* **ポジティブな評価**:
  * 「ビジネスロジックの単体テストを共通コードで一度書くだけで済むのが素晴らしい」
  * 「FlutterのようにUIまで独自描画にする必要がない場合、KMPはネイティブの良さを残せて最適」
  * 「既存のiOSアプリに徐々にKotlinコードを導入できるのが、リスク管理の観点で非常に良かった」
* **ネガティブな評価 / 改善要望**:
  * 「Gradleのビルドエラーが複雑で、解決に時間がかかることがある」
  * 「iOS側でKotlinのコルーチンやフローを扱う際に、以前より改善されたとはいえまだボイラープレートが必要な場合がある」
  * 「Compose Multiplatform for iOSはだいぶ良くなったが、まだUIKitとの連携でハマることがある」
* **特徴的なユースケース**:
  * 大規模なスーパーアプリの一部機能だけをKMPで切り出してモジュール化する事例。
  * サーバーサイドエンジニアがモバイルアプリのロジック部分を担当し、モバイルエンジニアがUIに集中する分業スタイル。

## **15. 直近半年のアップデート情報**

* **2025-11-XX**: **Kotlin 2.1.20 リリース**
  * K2コンパイラのさらなる最適化とビルド速度向上。
  * Swiftへのエクスポート機能の改善（ジェネリクス対応の強化）。
* **2025-10-XX**: **Compose Multiplatform 1.8.0**
  * iOSにおけるスクロールパフォーマンスの大幅改善。
  * リソース管理（画像・フォント）のAPIが統一化され、より使いやすく。
* **2025-05-XX**: **Compose Multiplatform for iOS Stable化**
  * iOSターゲットが正式にStableとなり、プロダクション利用が推奨される段階に到達。
  * Accessibility APIのサポート強化。

(出典: [JetBrains Blog](https://blog.jetbrains.com/kotlin/), [Kotlin Releases](https://github.com/JetBrains/kotlin/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (KMP) | Flutter | React Native |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | クロスプラットフォーム | ◯<br><small>ロジック共有中心</small> | ◎<br><small>全OS対応</small> | ◎<br><small>全OS対応</small> |
| **UI/UX** | 描画エンジン | ◯<br><small>Compose or Native</small> | ◎<br><small>独自(Impeller)</small> | △<br><small>OS依存</small> |
| **パフォーマンス** | 実行速度 | ◎<br><small>ネイティブそのもの</small> | ◯<br><small>ネイティブ並</small> | ◯<br><small>新アーキで改善</small> |
| **開発体験** | ホットリロード | △<br><small>Composeのみ可</small> | ◎<br><small>爆速・状態保持</small> | ◯<br><small>Fast Refresh</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Kotlin Multiplatform (本ツール)** | ロジック共有重視、UIは選択可能（ネイティブ/Compose）。 | ネイティブパフォーマンス、インクリメンタル導入、既存資産の活用。 | 設定が複雑、iOS/Android両方の知識が必要。 | ロジックが複雑でUIはネイティブ品質を求められる場合。既存アプリへの導入。 |
| **Flutter** | 独自レンダリングエンジンでUIも完全に共有。Dart言語。 | 開発スピードが非常に速い、UIの一貫性、ホットリロード。 | アプリサイズが大きい、ネイティブ機能連携の手間。 | 新規アプリ開発、UI統一を重視、早期リリース優先の場合。 |
| **React Native** | JS/TypeScriptで開発。ネイティブコンポーネントを操作。 | Web開発者が参入しやすい、巨大なエコシステム、OTAアップデート。 | パフォーマンス調整が難しい場合がある、ブリッジのオーバーヘッド。 | JS/TSチームがいる、Webとモバイルでコード共有したい場合。 |

## **17. 総評**

* **総合的な評価**:
  Kotlin Multiplatformは、クロスプラットフォーム開発の「銀の弾丸」ではないものの、「ロジックの共有」と「ネイティブの品質」を両立させるための最も現実的で強力なソリューションです。特に2025年のCompose Multiplatform for iOSの安定化により、UI共有の選択肢も実用的になり、その価値はさらに高まっています。
* **推奨されるチームやプロジェクト**:
  * 既にAndroidアプリ（Kotlin）があり、iOS版を効率的に開発・保守したいチーム。
  * 複雑なドメインロジックを持ち、それをプラットフォーム間で厳密に統一したいプロジェクト。
  * アプリの品質（パフォーマンス、UIのネイティブ感）に妥協したくない中〜大規模サービス。
* **選択時のポイント**:
  「UIまで含めて手軽に作りたい（Flutter）」のか、「品質と資産活用を重視してロジックを共通化したい（KMP）」のかが最大の分岐点です。チームにiOS/Androidそれぞれのネイティブ知識がある程度ある場合は、KMPが長期的なメンテナンス性と品質の面で有利になるケースが多いでしょう。
