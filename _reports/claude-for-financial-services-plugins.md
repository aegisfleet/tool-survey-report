---
title: Claude for Financial Services Plugins 調査レポート
tool_name: Claude for Financial Services Plugins
tool_reading: クロード フォー ファイナンシャル サービス プラグイン
category: AI開発基盤
developer: Anthropic
official_site: https://github.com/anthropics/financial-services-plugins
date: '2026-03-27'
last_updated: '2026-03-27'
tags:
  - AI
  - エージェント
  - オープンソース
  - プラグイン
  - 金融
description: Claudeを投資銀行、株式調査、未公開株、ウェルスマネジメント等の金融サービス専門のAIに強化するプラグイン群
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 金融専門職
    - アナリスト
    - 投資銀行家
  latest_highlight: 金融サービス向けプラグインをオープンソースとして公開
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 8
      reason: Daloopa、S&P Global、FactSetなど多様な金融データソースとMCP経由で強力に連携
    - point: 5
      reason: 投資銀行、株式調査など特化型の高度な金融分析ワークフローを完備
    - point: 5
      reason: オープンソースであり自社特有のプロセスに合わせて容易にカスタマイズ可能
  minus_points:
    - point: -3
      reason: 利用には各データプロバイダー（MCPサーバー）の契約・APIキーが別途必要
  summary: 金融業務に特化した強力なAI拡張ツールだが、真価を発揮するには外部データソースの契約が前提となる。
links:
  github: https://github.com/anthropics/financial-services-plugins
  deepwiki: https://deepwiki.com/anthropics/financial-services-plugins
  codewiki: https://codewiki.google/github.com/anthropics/financial-services-plugins
relationships:
  parent: Claude Cowork
  related_tools:
    - Claude Code
---




# **Claude for Financial Services Plugins 調査レポート**

## **1. 基本情報**

* **ツール名**: Claude for Financial Services Plugins
* **ツールの読み方**: クロード フォー ファイナンシャル サービス プラグイン
* **開発元**: Anthropic
* **公式サイト**: [https://github.com/anthropics/financial-services-plugins](https://github.com/anthropics/financial-services-plugins)
* **関連リンク**:
  * GitHub: [https://github.com/anthropics/financial-services-plugins](https://github.com/anthropics/financial-services-plugins)
* **カテゴリ**: AI開発基盤
* **概要**: Claude for Financial Services Pluginsは、Claude（Claude CoworkやClaude Code）を金融サービス専門のAIアシスタントに強化するためのオープンソースのプラグイン群である。投資銀行、株式調査、未公開株、ウェルスマネジメントといった金融特化のワークフローをサポートし、MCP経由で専門的なデータソースと連携して高度な分析やドキュメント作成を可能にする。

## **2. 目的と主な利用シーン**

* **解決する課題**: 複数のデータソースからの情報収集や、複雑な財務モデル構築、定型的な金融レポート・プレゼン資料作成にかかる手作業の時間を削減し、エラーを防止する。
* **想定利用者**: 投資銀行家、株式リサーチアナリスト、未公開株（PE）プロフェッショナル、ウェルスマネージャーなどの金融専門職。
* **利用シーン**:
  * リアルタイムデータを取得し、決算結果を分析して株式調査レポートを作成する（Research to Report）。
  * 類似企業比較分析、DCFモデル、LBOモデルなどを、関数や感度分析表を含むExcel形式で構築する（Spreadsheet Analysis）。
  * CIM（機密情報メモ）、ティーザー、プロセスレターの草案作成や、企業指定のPowerPointテンプレートに沿ったピッチ資料の自動生成（Deal Materials）。

## **3. 主要機能**

* **Financial Analysis（コアプラグイン）**: 全てのデータコネクターを提供し、比較分析、DCFモデル、LBOモデル、財務3表の構築やPowerPointテンプレートの再利用を可能にする基礎機能。
* **Investment Banking（アドオン）**: CIM、ティーザー、プロセスレターの作成、買い手リスト構築、合併モデル実行など投資銀行業務特化の機能。
* **Equity Research（アドオン）**: 決算アップデートやカバレッジ開始レポートの執筆、投資テーマの維持、カタリスト追跡など株式調査特化の機能。
* **Private Equity（アドオン）**: 案件のソーシング・スクリーニング、デューデリジェンスのチェックリスト実行、IC（投資委員会）メモの作成、ポートフォリオKPI監視機能。
* **Wealth Management（アドオン）**: クライアントミーティングの準備、ファイナンシャルプラン構築、ポートフォリオのリバランス、タックスロス・ハーベスティングの機会特定機能。
* **Partner-Built Plugins**: LSEGやS&P Globalなどのデータパートナーが構築・維持する、自社データをClaudeワークフローに直接取り込むための専用プラグイン。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Claude CoworkまたはClaude Codeの環境。
  * 連携するデータプロバイダー（MCPサーバー）のAPIキーまたはサブスクリプション。
* **インストール/導入**:
  Claude Codeの場合、以下のコマンドを実行する。
  ```bash
  # マーケットプレイスの追加
  claude plugin marketplace add anthropics/financial-services-plugins

  # コアプラグインのインストール（必須）
  claude plugin install financial-analysis@financial-services-plugins

  # 必要に応じて機能特化のプラグインを追加
  claude plugin install investment-banking@financial-services-plugins
  claude plugin install equity-research@financial-services-plugins
  claude plugin install private-equity@financial-services-plugins
  claude plugin install wealth-management@financial-services-plugins
  ```
* **初期設定**:
  * `.mcp.json` ファイルを編集し、社内ツールや特定のデータプロバイダーへの接続設定を行う。
* **クイックスタート**:
  * インストール後、プラグインは自動的に有効になる。`/comps [company]`（比較分析）や `/earnings [company] [quarter]`（決算アップデート）などのスラッシュコマンドを使用して直ちに実行可能。

## **5. 特徴・強み (Pros)**

* **強力なMCPデータ連携**: Daloopa、Morningstar、S&P Global、FactSetなど、金融専門家が日常的に使用する11のデータソースと標準で統合できる。
* **エンドツーエンドのワークフロー**: 単なる一問一答ではなく、データ収集から分析、最終的な成果物（生きたExcelモデルやフォーマット済みのPowerPoint、Wordドキュメント）の生成までを一貫して行える。
* **高いカスタマイズ性**: 全てMarkdownとJSONファイルで構成されており、コード不要で自社の専門用語、取引プロセス、指定のフォーマット基準などをClaudeに教え込むことができる。

## **6. 弱み・注意点 (Cons)**

* **データソースの別途契約が必要**: プラグイン自体は無料のオープンソースだが、実用的な分析を行うためのMCPサーバー（FactSet、S&P Globalなど）の利用には各社との有料契約・APIキーが必須となる。
* **出力結果の専門家によるレビューが必須**: 財務モデルや分析結果は投資助言を構成するものではないため、最終決定の前に必ず金融専門家による検証と確認が必要である。
* **環境構築のハードル**: コマンドラインツール（Claude Code）や設定ファイル（`.mcp.json`）の編集が必要なため、非エンジニアには初期設定がやや難しく感じられる可能性がある。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース版** | 無料 | GitHubから取得可能、Apache-2.0ライセンス。すべてのプラグイン機能が利用可能。 |

* **課金体系**: プラグイン自体は無料。ただし、Claude APIの利用料金や、各データプロバイダーのMCPサーバー接続にかかるサブスクリプション費用が別途必要。
* **無料トライアル**: プラグイン自体の導入はいつでも無料で行える。

## **8. 導入実績・事例**

* **導入企業**: 公開事例なし。ただし、金融特化の機能を求めている投資銀行やPEファンド等の専門機関がターゲットとなっている。
* **導入事例**: LSEGやS&P Globalなどの大手データプロバイダーがパートナーとして専用プラグインを提供しており、金融業界における標準的なデータソースとしての利用が見込まれている。
* **対象業界**: 投資銀行、株式リサーチ、未公開株（PE）、ウェルスマネジメント、その他金融サービス全般。

## **9. サポート体制**

* **ドキュメント**: GitHub上のREADME.mdファイルにて、概要、インストール方法、コマンドリスト、カスタマイズ方法などが提供されている。
* **コミュニティ**: GitHubリポジトリのIssueやPull Requestを通じたオープンソースコミュニティでの議論・貢献が可能。
* **公式サポート**: オープンソースプロジェクトのため、企業向けの専用SLAを伴う直接サポートは提供されていない。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: ClaudeのMCP（Model Context Protocol）に完全対応。
* **外部サービス連携**: Daloopa, Morningstar, S&P Global, FactSet, Moody's, MT Newswires, Aiera, LSEG, PitchBook, Chronograph, Egnyte といった主要な金融データプラットフォーム・ドキュメント管理システムと連携可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Claude Code** | ◎ | 公式CLIツールであり、コマンド一つでプラグインのインストール・管理が可能 | 特になし |
| **MCP (Model Context Protocol)** | ◎ | プラグインの根幹となる技術であり、各種データプロバイダーとの標準的な通信を実現 | 各プロバイダーへのアクセス権が必要 |

## **11. セキュリティとコンプライアンス**

* **認証**: 各データプロバイダー（MCPサーバー）との通信において、該当プロバイダーが要求するAPIキーや認証メカニズム（OAuth等）を使用する。
* **データ管理**: プラグイン自体はデータを持たず、Claude環境内で処理が完結する。データの保管場所等は利用するClaudeの環境や対象データプロバイダーのポリシーに依存する。
* **準拠規格**: 公式サイトでは公開されていない。金融機関での利用にあたっては、自社のコンプライアンス基準に基づきClaude環境全体のセキュリティ評価を行う必要がある。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Claude CoworkのUIやClaude CodeのCLIを通じて操作する。スラッシュコマンド（例: `/comps`）による直感的な指示が可能。
* **学習コスト**: スラッシュコマンドの使い方自体は容易。しかし、自社のフォーマットや独自のワークフローに合わせてMarkdownやJSON（スキルやコマンドの定義）をカスタマイズするには、一定の学習とプロンプトエンジニアリングの知識が必要となる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 最初にコアとなる `financial-analysis` プラグインをインストールし、必要なデータコネクターの基盤を整える。
  * `/ppt-template` コマンドを使用して、自社のPowerPointレイアウトを学習させ、出力されるピッチ資料のフォーマットを統一する。
  * 既存のスキル（`skills/` ディレクトリのMarkdown）を編集し、教科書通りの手順ではなく「自社固有の分析プロセス」をClaudeに教え込む。
* **陥りやすい罠 (Antipatterns)**:
  * 生成された財務モデル（Excel等）を、人間によるクロスチェックや数値の検証を行わずにそのまま実務に使用すること。
  * 全てのアドオンプラグインをむやみにインストールし、コンテキストが肥大化して本来の業務意図から外れた応答を招くこと。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHubリポジトリ
* **総合評価**: 6.9k スター (GitHub)
* **ポジティブな評価**:
  * 投資銀行や株式調査など、具体的な職種にフォーカスしたワークフローが最初から用意されている点が画期的。
  * 複雑なExcelの財務モデル（LBOやDCF）がそのまま動く形で出力されるのは非常に実用的。
  * MarkdownとJSONだけでカスタマイズでき、プログラミング不要なのが良い。
* **ネガティブな評価 / 改善要望**:
  * 有用なデータを引き出すためには、高価な金融データプロバイダーの契約が必要になる。
  * 出力結果には時折ハルシネーション（誤った数値の生成）が含まれるため、レビューの手間が完全には無くならない。
* **特徴的なユースケース**:
  * 自社の過去のデューデリジェンスレポートを読み込ませ、特定業界の新しい案件に対する初期スクリーニングとICメモの草案作成を全自動化する。

## **15. 直近半年のアップデート情報**

* **2025-02-27 (推定)**: リポジトリが公開され、多数の初期コミットが行われた。コアプラグインや各種アドオン、パートナー提供プラグイン（LSEG, S&P Global）の基本構造が実装された。

(出典: [GitHub Commits](https://github.com/anthropics/financial-services-plugins/commits/main/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Claude for Financial Services Plugins | Bloomberg Terminal / FactSet等の専用端末 | 一般的な汎用AI（ChatGPT 等） |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | 金融データアクセス | ◯<br><small>MCP経由で連携（別途契約必要）</small> | ◎<br><small>ネイティブで最高峰のデータ網</small> | △<br><small>Web検索または限定的なプラグイン</small> |
| **カテゴリ特定** | 財務モデル自動生成 | ◎<br><small>DCF/LBO等をExcel形式で出力</small> | ◯<br><small>豊富なテンプレート機能を提供</small> | △<br><small>高度なプロンプトが必要、形式崩れあり</small> |
| **エンタープライズ** | ワークフローカスタマイズ | ◎<br><small>Markdown/JSONで容易に定義可能</small> | △<br><small>システム側が提供する機能に依存</small> | ◯<br><small>カスタムプロンプト/GPTs等で対応</small> |
| **非機能要件** | オープンソース・拡張性 | ◎<br><small>コード不要でプラグイン自体の改造が可能</small> | ×<br><small>プロプライエタリ</small> | △<br><small>プラットフォームの制約下でのみ拡張可</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Claude for Financial Services Plugins** | Claudeを金融特化AIに変えるOSSプラグイン | 財務モデル・資料作成の自動化、容易なカスタマイズ性 | データ利用には別途各プロバイダーとの契約が必要 | すでにデータプロバイダーと契約しており、資料作成やモデル構築の時間を短縮したい場合 |
| **Bloomberg Terminal / FactSet等の専用端末** | 金融プロフェッショナル向けの事実上の標準プラットフォーム | 圧倒的なデータの網羅性とリアルタイム性、堅牢な機能 | 非常に高価、AIによる「ゼロからの資料作成」は一部限定的 | データへのアクセスや精緻な市場分析が最優先される場合 |
| **一般的な汎用AI（ChatGPT 等）** | 汎用的な生成AIモデル | 幅広いタスクに対応、初期コストが低い | 金融特化の専門知識や、複雑な財務モデルの出力精度が劣る | 日常的なテキスト要約や一般的なコード生成など、金融特化以外のタスクも多くこなす場合 |

## **17. 総評**

* **総合的な評価**:
  Claude for Financial Services Pluginsは、生成AIの力を金融専門職の具体的なワークフローに直接落とし込む非常に強力なツールである。特に、手作業で行われていたExcelでの財務モデル構築（DCF、LBOなど）や、定型的なPowerPoint資料の作成を自動化し、そのまま実務で使える形式で出力できる点が最大の評価ポイントである。
* **推奨されるチームやプロジェクト**:
  投資銀行、PEファンド、ヘッジファンド、株式リサーチ部門など、日々大量の財務データを分析し、フォーマット化された資料を迅速に作成する必要があるチーム。
* **選択時のポイント**:
  本プラグイン自体は無料だが、その真価はS&P GlobalやFactSetといった外部データプロバイダーとの連携（MCP経由）にあって初めて発揮される。そのため、すでにこれらのデータサービスと契約している企業にとって、既存のデータ資産を活用しつつAIによる業務効率化を図るための最有力な選択肢となる。
