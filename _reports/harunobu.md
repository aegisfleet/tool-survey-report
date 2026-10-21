---
title: Harunobu 調査レポート
tool_name: Harunobu
tool_reading: ハルノブ
category: テスト生成/品質QA
developer: デジタル庁 (Fact & Data Unit)
official_site: https://github.com/digital-go-jp/machine_readability_rule
date: '2026-10-21'
last_updated: '2026-10-21'
tags:
  - オープンソース
  - 機械可読性
  - 行政データ
  - デジタル庁
description: 行政データにおける機械可読性ルールに基づき、Excel/CSVファイルの機械可読性を自動採点・判定するツール
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 行政機関
    - データエンジニア
    - システム開発者
  latest_highlight: 「行政データにおける機械可読性に関するルール」の公開と、判定ツールHarunobuのオープンソース公開
  update_frequency: 中
evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: デジタル庁公式のルールに基づいた信頼性の高い判定ロジック
    - point: 5
      reason: CLI, Streamlit UI, Python APIの3つのインターフェースを提供し、多様なユースケースに対応
  minus_points:
    - point: -2
      reason: 一部のルールは判定対象外となっており、完全な判定はできない
  summary: 行政データの機械可読性向上に直結する、信頼性と実用性を兼ね備えたオープンソースツール
links:
  github: https://github.com/digital-go-jp/machine_readability_rule
  deepwiki: https://deepwiki.com/digital-go-jp/machine_readability_rule
  codewiki: https://codewiki.google/github.com/digital-go-jp/machine_readability_rule
  documentation: https://github.com/digital-go-jp/machine_readability_rule/tree/main/docs
relationships: null
---

# **Harunobu 調査レポート**

## **1. 基本情報**

* **ツール名**: Harunobu (機械可読性ルール判定ツール)
* **ツールの読み方**: ハルノブ
* **開発元**: デジタル庁 (Fact & Data Unit)
* **公式サイト**: [https://github.com/digital-go-jp/machine_readability_rule](https://github.com/digital-go-jp/machine_readability_rule)
* **関連リンク**:
  * GitHub: [https://github.com/digital-go-jp/machine_readability_rule](https://github.com/digital-go-jp/machine_readability_rule)
  * DeepWiki: [https://deepwiki.com/digital-go-jp/machine_readability_rule](https://deepwiki.com/digital-go-jp/machine_readability_rule)
  * CodeWiki: [https://codewiki.google/github.com/digital-go-jp/machine_readability_rule](https://codewiki.google/github.com/digital-go-jp/machine_readability_rule)
  * ドキュメント: [https://github.com/digital-go-jp/machine_readability_rule/tree/main/docs](https://github.com/digital-go-jp/machine_readability_rule/tree/main/docs)
* **カテゴリ**: データ品質チェック
* **概要**: 行政データにおける機械可読性に関するルールに基づき、ExcelやCSVファイルがルールに適合しているかを自動判定し、100点満点で採点するオープンソースのツール。

## **2. 目的と主な利用シーン**

* **解決する課題**: 行政データの機械可読性ルールの遵守状況を客観的に評価し、データ整備の品質向上と標準化を支援する。
* **想定利用者**: 行政機関の担当者、データ整備を行う事業者、システム開発者。
* **利用シーン**:
  * 公開前の行政データ（Excel/CSV）の機械可読性チェック。
  * データ整備システムやAIを利用したデータクレンジングパイプラインへの判定ロジックの組み込み。
  * 既存データの機械可読性スコアの現状把握と課題の洗い出し。

## **3. 主要機能**

* **ファイル判定・採点**: Excel（.xlsx, .xlsm）、CSV、TSVファイルを読み込み、機械可読性ルールに従って100点満点で採点する。
* **レイアウト推定機能**: ファイル内のデータ領域（表領域）を自動的に推定して判定対象を特定する。
* **違反箇所特定と理由提示**: ルール違反があった箇所（セルなど）の一覧と、違反したルール内容・理由を提示する。
* **多様なインターフェース**: CLI（コマンドライン）、StreamlitによるWeb UI、Python APIの3つの利用方法を提供する。
* **採点モード選択**: 簡易チェック（lite）、通常利用（standard）、詳細分析（thorough）の3つのモードで対象ルールレベルを切り替えられる。
* **AI補完判定オプション**: AI（Gemini, OpenAI, Anthropic等）を利用して、ルール判定を補完する機能を持つ。
* **結果ファイル出力**: 判定結果をJSON形式またはCSV形式で出力し、後続のシステムやAIの指示書として活用できる。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: ローカル実行型のCLI/Webアプリ、およびPythonライブラリ。
* **主要コンポーネントとデータフロー**:
  * ユーザーがExcel/CSVファイルを入力（UIアップロードまたはCLIパス指定）。
  * 内部のReaderとAnalyzerがファイルをパースし、レイアウト検出（LayoutDetector, IslandDetector）で表領域を特定。
  * 各ルールプラグインが決定論的に判定を実行（必要に応じてAI補完を利用）。
  * LevelScorerが各ルールの判定結果からスコアを算出。
  * JSONまたはCSV形式で結果を出力。
* **特筆すべき要素技術**:
  * Python環境構築に`uv`パッケージマネージャーを採用。
  * WebUIの構築にStreamlitを採用。
  * 依存関係としてpandasなどのデータ処理ライブラリを使用。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * OS: Windows / macOS / Linux
  * ランタイム: Python 3.10 以上
  * メモリ: 1 GB 以上
  * パッケージマネージャ: `uv` 推奨
* **インストール/導入**:

  ```bash
  # Dockerの場合
  docker build -t harunobu .
  docker run -p 8080:8080 harunobu

  # ローカルCLIとしてインストール
  uv pip install "harunobu @ git+https://github.com/digital-go-jp/machine_readability_rule.git"
  ```

* **初期設定**:
  * AI補完機能を使用する場合は、`.env`ファイルにAPIキーを設定する。
* **クイックスタート**:
  * CLIでの実行例: `uv run harunobu analyze data.xlsx --output json`

## **6. 特徴・強み (Pros)**

* デジタル庁が公開している公式の「行政データにおける機械可読性に関するルール」に厳密に準拠している。
* コマンドライン、Web画面、プログラム組み込み用のAPIが用意されており、多様なユーザーとユースケースに対応できる。
* Dockerを使った簡単なセットアップや、最新のパッケージマネージャ`uv`に対応している。
* AIを利用した高度な判定補完機能をオプションとして備えている。
* 判定結果を機械可読な形式（JSON/CSV）で出力でき、データ修正パイプラインへの統合が容易。

## **7. 弱み・注意点 (Cons)**

* あくまでサンプル実装であり、完全性や正確性を保証するものではない（免責事項あり）。
* 一部のルールについては判定対象外となっている。
* 公式のサポート窓口やSLAは提供されない（OSSとしての提供）。
* 巨大なファイルを処理する場合、メモリ要件が高くなる可能性がある。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (MIT)** | 無料 | すべての機能を制限なく利用可能。ソースコードの改変や商用利用も可能。 |

* **課金体系**: なし（無料のオープンソースソフトウェア）。ただしAI補完機能を使用する場合、各AIプロバイダー（OpenAIなど）のAPI利用料が別途発生する。
* **無料トライアル**: 該当なし。

## **9. 導入実績・事例**

* **導入企業**: 公開事例なし。ただし、デジタル庁が主導する行政データ標準化の取り組みにおいて、各府省庁や自治体での利用が想定される。
* **導入事例**: データ整備を支援するAIツールのバックエンドでの判定ロジックとしての組み込みなど。
* **対象業界**: 行政機関、地方自治体、それらを支援するSIerやデータ整備事業者。

## **10. サポート体制**

* **ドキュメント**: GitHubリポジトリ内にREADME.mdや`docs/`ディレクトリ配下に詳細なマニュアル（出力フォーマット、UI操作、制限事項など）が整備されている。
* **コミュニティ**: GitHubのIssue機能を通じたバグ報告が可能（質問や機能要望は不可）。
* **公式サポート**: なし。デジタル庁によるOSSとしての提供であり、個別のサポート対応は行われない。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: Pythonライブラリとして提供されており、任意のPythonアプリケーションから`analyze()`関数を呼び出して利用可能。
* **外部サービス連携**: OpenAI、Anthropic、Google Geminiなどの各種LLM APIと連携し、判定機能を補完することが可能。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | ネイティブなライブラリとして直接インポートして利用可能。 | 特になし |
| **Docker** | ◎ | 公式のDockerfileが提供されており、環境非依存で動作可能。 | 特になし |
| **Streamlit** | ◎ | デフォルトのUIとして組み込まれている。 | 特になし |
| **Node.js / その他言語** | △ | 直接のSDKはないが、CLIとして呼び出し、JSON出力をパースして連携可能。 | プロセス間通信のオーバーヘッド |

## **12. セキュリティとコンプライアンス**

* **認証**: ツール自体に認証機能はない（ローカルまたは内部ネットワークでの実行を想定）。
* **データ管理**: ファイルの処理は実行環境のローカルメモリ上で行われ、外部サーバへは送信されない（AI補完機能利用時を除く）。
* **準拠規格**: 該当なし。ただし、デジタル庁のセキュリティポリシーに準拠した管理が行われている。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Streamlit製のUIは、ファイルのアップロードからプレビュー、判定結果の表示までステップバイステップで直感的に操作できるデザインになっている。
* **学習コスト**: UIの利用はブラウザ操作のみのため非常に低い。CLIやAPIの利用も、一般的なPythonツールと同程度でドキュメントが整っているため導入しやすい。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * CI/CDパイプラインにHarunobuのCLIを組み込み、データファイルがコミットされた際に自動的に機械可読性チェックを行う。
  * Harunobuが出力するJSON結果をAIエージェントに渡し、データクレンジング作業を自動化する。
* **陥りやすい罠 (Antipatterns)**:
  * 免責事項を読まずに、判定結果を100%完璧なものと過信し、目視確認を全く行わないこと。
  * AI補完機能を有効にする際、機密情報が含まれるデータを意図せず外部のAI APIへ送信してしまうこと。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: GitHubリポジトリ
* **総合評価**: N/A (新しく公開されたOSSツールのため、レビューサイトでの評価はまだない)
* **ポジティブな評価**:
  * デジタル庁が公開しているルールを、システム的に検証できるツールが公式から提供されたこと自体が画期的。
  * ローカルで完結して動かせるため、セキュリティ要件の厳しい行政データでも扱いやすい。
* **ネガティブな評価 / 改善要望**:
  * 特定の複雑なExcelファイル形式において、レイアウト推定がうまく働かないケースがある（既知の制限事項）。
* **特徴的なユースケース**:
  * 自治体向けシステムのデータ移行プロジェクトにおいて、移行元データの品質アセスメントに活用。

## **16. 直近半年のアップデート情報**

* **2024-10**: リポジトリの初期コミットおよびツールの公開。

(出典: [GitHub リポジトリ コミット履歴](https://github.com/digital-go-jp/machine_readability_rule/commits/main/))

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Harunobu | pandas (データ処理) | Great Expectations |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | Excel/CSV読み込み | ◯<br><small>標準対応</small> | ◎<br><small>強力なI/O</small> | ◯<br><small>対応</small> |
| **カテゴリ特定** | 行政データルール特化 | ◎<br><small>デジタル庁ルール準拠</small> | ×<br><small>汎用ライブラリ</small> | ×<br><small>汎用データバリデーション</small> |
| **高度な機能** | AI補完判定 | ◯<br><small>オプション搭載</small> | ×<br><small>非対応</small> | △<br><small>拡張機能による</small> |
| **非機能要件** | 日本語対応 | ◎<br><small>完全対応</small> | ◯<br><small>標準的</small> | ◯<br><small>標準的</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Harunobu** | 行政データ機械可読性ルールに特化した判定ツール。 | デジタル庁公式ルールに基づく独自の採点ロジックとレイアウト推定。 | 汎用的なデータ品質チェックには向かない。 | 行政機関へ提出するデータや、オープンデータの品質チェックを行う場合。 |
| **pandas** | 汎用的なPythonデータ分析ライブラリ。 | 柔軟なデータ操作と強力な処理能力。 | ルール判定ロジックは自作する必要がある。 | ルールに縛られない柔軟なデータクレンジングを行いたい場合。 |
| **Great Expectations** | 汎用的なデータバリデーション・ドキュメント生成ツール。 | 豊富なアサーションと自動ドキュメント生成。 | 行政独自のルールはカスタム実装が必要。学習コストが高い。 | 大規模なデータパイプライン全般の品質保証を行いたい場合。 |

## **18. 総評**

* **総合的な評価**:
  * Harunobuは、デジタル庁が定めた行政データの機械可読性ルールをシステム的に評価できる非常に有用なツールである。ExcelやCSVなどの一般的なファイル形式に対応し、UI、CLI、APIの3つのインターフェースを提供することで、非エンジニアの担当者からシステム開発者まで幅広いユーザー層をカバーしている。AI補完機能など先進的な機能も備えており、オープンソースとして公開された意義は大きい。
* **推奨されるチームやプロジェクト**:
  * 行政機関や地方自治体でデータ標準化・オープンデータ公開を担当するチーム。
  * 自治体向けシステムやGovTechサービスを開発するSIer、システム開発プロジェクト。
* **選択時のポイント**:
  * 単なるデータ型のチェックにとどまらず、「行政データの機械可読性」という特定のドメインルールに基づいた品質評価が必要な場合に、Harunobuは唯一無二の選択肢となる。
