---
title: gflow-cli 調査レポート
tool_name: gflow-cli
tool_reading: ジー・フロー・シー・エル・アイ
category: AI画像生成
developer: Flavio Oliva (ffroliva)
official_site: https://ffroliva.github.io/gflow-cli/
date: '2026-09-26'
last_updated: '2026-09-26'
tags:
  - オープンソース
  - CLI
  - 動画生成
  - 画像生成
description: コマンドラインやAIエージェントからGoogle Flow (Veo, Imagen) を操作するためのCLIツールおよびMCPサーバー。
quick_summary:
  has_free_plan: false
  is_oss: true
  starting_price: 無料 (ツール自体は無料だが、Google Flowのクレジットを消費する)
  target_users:
    - 開発者
    - AIエージェント利用者
  latest_highlight: flow.google.com へのアカウント移行に伴うフロントエンドの切り替えに対応
  update_frequency: 高
evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: Google FlowをCLI/自動化できる稀有なツール
    - point: 5
      reason: MCPサーバー機能がビルトインされており、Claude Code等から直接利用可能
  minus_points:
    - point: -5
      reason: 非公開APIをヘッド付きブラウザで操作する仕組みのため、Googleの仕様変更で壊れやすい
    - point: -5
      reason: API利用ではなくWeb UIの自動操作のため、Googleの利用規約(ToS)上のリスクがある
  summary: Google Flowの自動化・バッチ処理を実現する強力なツールだが、非公式の仕組みに依存する点に注意が必要。
links:
  github: https://github.com/ffroliva/gflow-cli
  deepwiki: https://deepwiki.com/ffroliva/gflow-cli
---

# **gflow-cli 調査レポート**

## **1. 基本情報**

* **ツール名**: gflow-cli
* **ツールの読み方**: ジー・フロー・シー・エル・アイ
* **開発元**: Flavio Oliva (ffroliva)
* **公式サイト**: [https://ffroliva.github.io/gflow-cli/](https://ffroliva.github.io/gflow-cli/)
* **関連リンク**:
  * GitHub: [https://github.com/ffroliva/gflow-cli](https://github.com/ffroliva/gflow-cli)
  * ドキュメント: [https://ffroliva.github.io/gflow-cli/docs/](https://ffroliva.github.io/gflow-cli/docs/)
* **カテゴリ**: AI動画・画像生成 / 開発者ツール
* **概要**: Google Flow (Veoによる動画生成、Imagenによる画像生成) をコマンドラインから操作するためのPython製CLIツールです。MCP (Model Context Protocol) サーバー機能も備えており、ClaudeやCursorなどのAIエージェントから直接生成を指示することも可能です。

## **2. 目的と主な利用シーン**

* **解決する課題**: Google FlowのWeb UIにおける手作業（クリック操作）の負担をなくし、複数プロンプトのバッチ処理や、スクリプトによるパイプライン化、AIエージェントによる自動生成を実現する。
* **想定利用者**: AIによる動画・画像生成を自動化・バッチ化したいエンジニア、クリエイター。
* **利用シーン**:
  * 大量のテキストプロンプトをリスト化し、一括で画像・動画を生成するバッチ処理。
  * Claude CodeやCursorなどのAIエージェントにプロンプトを渡して、自律的に動画や画像を生成させる。
  * キャラクター（一貫した顔や体）を定義し、別々のショットでも同じキャラクターを登場させる動画の制作。

## **3. 主要機能**

* **バッチ生成**: シェルのループやTSV/JSONマニフェストファイルを使用して、複数のプロンプトを連続して生成可能。
* **一貫したキャラクター (Character Consistency)**: `gflow character create`で顔や体の参照用Characterを作成し、複数回の生成で同じ人物を登場させることが可能。
* **プロンプトツール**: `--tool creative-director`を使用すると、Googleの5つのコンポーネントに基づくリッチなプロンプトに自動的に書き換えてから生成を行う。
* **エージェント駆動 (MCPサーバー)**: `gflow mcp run` または `gflow serve` によってMCPサーバーを起動し、Claude Desktop, Cursor, VS Codeなどから直接ツールを操作可能。
* **パイプライン・複数シーン処理 (movie.toml)**: 複数のシーンをつなぎ合わせた動画生成を、単一のマニフェストファイル（`movie.toml`）から実行できる。
* **UIドリフトの検知**: Google FlowのUIが変更された場合、クレジットを消費する前に「ドリフト」を検知して安全に停止する仕組みを備える。

## **4. 動作原理・システム構成**

* **アーキテクチャ**:
  非公開のGoogle Flow API（`aisandbox-pa.googleapis.com` または `flow.google.com` の `batchexecute`）を、Playwrightを介した**ヘッド付きのChromiumブラウザ**で操作する仕組み（UI Mimicry）です。
* **主要コンポーネントとデータフロー**:
  1. CLI/MCPサーバーからのリクエスト。
  2. Playwrightがユーザー自身のGoogleアカウントでログインした状態のChromiumを起動。
  3. ブラウザを介してGoogle FlowのWeb UIを操作（クリックや通信）し、生成を実行。
  4. 生成されたメディア（動画・画像）をダウンロード。
* **特筆すべき要素技術**:
  Googleの強力なボット検知（reCAPTCHA等）やOAuthの制限を回避するため、純粋なHTTPリクエストではなく、Playwrightによるヘッド付きブラウザ操作を必須としています。自動化ブラウザと判定されないための特殊なフラグを使用しています。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * Google Flowへのアクセス権があるGoogleアカウント（クレジットを消費するため、Google AI Pro/Ultra プランなどを推奨）。
  * Python環境、およびパッケージマネージャの `uv`。
  * 初回ログイン時のためのディスプレイ環境。
* **インストール/導入**:

  ```bash
  uv tool install gflow-cli
  uv tool run --from gflow-cli playwright install chromium
  ```

* **初期設定**:
  以下のコマンドを実行してGoogleアカウントでログインします（Chromeのウィンドウが開きます）。
  ```bash
  gflow auth login --browser chrome
  ```

* **クイックスタート**:
  ```bash
  # 画像の生成
  gflow image t2i "a hot air balloon over Tokyo at sunrise"

  # 動画の生成
  gflow video t2v "Slow cinematic push-in on a sunlit forest clearing" --aspect 16:9
  ```

## **6. 特徴・強み (Pros)**

* コマンドラインからGoogleの最新生成AIモデル（Veo, Imagen）をスクリプト化して実行できる。
* MCPにネイティブ対応しており、ClaudeやCursorに「こんな動画を作って」と指示するだけで生成まで完結させられる。
* 単なる生成だけでなく、キャラクターの一貫性保持、バッチ処理、エラー時のフェイルファストなど、実運用に耐えうる機能が揃っている。

## **7. 弱み・注意点 (Cons)**

* **アカウントリスク**: 公式のAPIではなくWeb UIを自動操作するツールのため、Googleの利用規約に抵触する恐れがあり、アカウント停止のリスクはユーザーが負う必要がある。
* **動作の不安定さ**: Google側のUIや非公開APIの仕様変更により、予告なく動作しなくなる可能性が高い。
* **ヘッド付きブラウザの必須**: サーバーレス環境（Lambdaなど）での動作が難しく、デスクトップ環境やそれに準ずる設定が必要となる。
* ツール内のメッセージやドキュメントは主に英語であり、日本語の情報は少ない。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (MIT)** | 無料 | ツール自体の利用は完全に無料。ただし、**実行時にユーザー自身のGoogleアカウントのクレジットを消費する**（Veo動画生成等）。 |

* **課金体系**: ユーザーのGoogleアカウントのクレジット残高に依存。

## **9. 導入実績・事例**

* **導入企業**: 個人開発のOSSであり、特定の企業での公式な導入事例は公開されていない。
* **導入事例**: AI開発者やクリエイターが個人的なバッチ処理や、MCPを通じたAIエージェントの検証用途で使用しているケースが主。

## **10. サポート体制**

* **ドキュメント**: GitHubのREADMEやdocsディレクトリに詳細な構成やコマンドリファレンスが記述されている。
* **コミュニティ**: GitHubのIssueやDiscussionが主な窓口。
* **公式サポート**: 個人開発のオープンソースプロジェクトであるため、企業向けのSLAを伴う公式サポートはない（GitHub Sponsorsによる優先対応枠は存在する）。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: ツール自体はCLIおよびMCPサーバーとして動作。内部的にはGoogleの非公開API (`aisandbox-pa.googleapis.com` 等) と通信。
* **外部サービス連携**: MCPを介して、Claude Desktop, Cursor, VS Code, GitHub Copilot等のAIエージェントツールとシームレスに連携可能。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **MCP対応エージェント (Claude, Cursor等)** | ◎ | 公式にサポートされており、セットアップコマンド(`gflow mcp setup`)も用意されている | 特になし |
| **Python** | ◯ | 内部はPythonで書かれており、`FlowApiClient` をプログラムから直接呼び出すことも可能 | 非公開API依存のため、仕様変更による破壊的変更のリスク |

## **12. セキュリティとコンプライアンス**

* **認証**: GoogleアカウントによるOAuth認証（ローカルのChromiumブラウザを利用してセッションを確立）。
* **データ管理**: アカウントの認証情報や生成されたメディアのメタデータはローカルマシンのSQLiteデータベース等に保存される。
* **準拠規格**: オープンソースソフトウェアであり、特定のセキュリティ規格（SOC2等）の認証は取得していない。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CLIツールとして標準的な使用感（`gflow <コマンド> <サブコマンド>`）。JSON出力などにも対応。
* **学習コスト**: CUI操作に慣れているエンジニアであれば導入は容易だが、生成時のパラメータ（モデル名、アスペクト比など）やGoogle側の仕様を理解する必要がある。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * Claude CodeやCursorと連携し、エージェントにプロンプトの調整から生成までを自律的に行わせる。
  * `gflow image batch` を利用して、寝ている間に大量のバッチ生成を実行する。
* **陥りやすい罠 (Antipatterns)**:
  * GoogleのToSを無視して過剰な頻度でリクエストを送り、アカウントがブロックされる。
  * ヘッド付きブラウザが必要なことを理解せず、純粋なヘッドレスサーバー環境で実行しようとする。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub (Star数, Issue等)
* **総合評価**: GitHub Stars 228 (2026年09月現在)
* **ポジティブな評価**:
  * Google Flowの強力な生成機能をCLIで自動化できる数少ないツールとして重宝されている。
  * MCPサーバー対応が優秀で、AIエージェントとの組み合わせが強力。
* **ネガティブな評価 / 改善要望**:
  * GoogleのUI変更に影響されやすいため、時折ツールが動作しなくなる（Issueでの報告が多数）。
  * ヘッドレス環境で動かせるようにしてほしい（ただし現状Google側の制限で困難）。

## **16. 直近半年のアップデート情報**

* **2026-09-08ごろ**: Google Flowのアカウント移行 (`flow.google.com`への移行) に伴い、新しいフロントエンド（batchexecute通信）へ対応するための改修が進行中・導入済み。
* **2026-09ごろ**: データのローカルカタログ機能（SQLiteデータベース）の導入・強化 (`gflow data list`等)。
* **2026-09ごろ**: MCPサーバー機能の強化、特定の動作を無効化する `--no-spend` オプションの追加。

(出典: [GitHub README / Docs](https://github.com/ffroliva/gflow-cli))

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (gflow-cli) | Google Flow (公式Web UI) |
|:---:|:---|:---:|:---:|
| **基本機能** | 画像生成 (Imagen) | ◯<br><small>CLIから実行可能</small> | ◎<br><small>ブラウザで直感的に操作可能</small> |
| **基本機能** | 動画生成 (Veo) | ◯<br><small>CLIから実行可能</small> | ◎<br><small>ブラウザで直感的に操作可能</small> |
| **自動化** | バッチ処理 | ◎<br><small>ファイル指定による一括生成が可能</small> | ×<br><small>手動操作のみ</small> |
| **拡張性** | エージェント連携 (MCP) | ◎<br><small>Claude等から直接操作可能</small> | ×<br><small>連携機能なし</small> |
| **安定性** | 動作の安定性 | △<br><small>UIの変更により動作しなくなるリスク</small> | ◎<br><small>公式提供のため安定</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール (gflow-cli)** | CLI / MCPサーバーによるGoogle Flowの操作 | 自動化、バッチ処理、AIエージェントからの直接操作 | 非公式ツールのための安定性の懸念、ToSリスク | 生成作業をスクリプト化・自動化したい場合 |
| **Google Flow (公式Web UI)** | 公式のWebベースの操作画面 | 安定して確実に動作する | 手動で操作する必要があり、自動化ができない | 単発で動画や画像を生成したい場合 |

## **18. 総評**

* **総合的な評価**:
  Google Flow (Veo, Imagen) を自動化するという、需要がありつつもGoogleの仕様上実現が難しい課題に対して、Playwrightによるブラウザ操作というアプローチで解決を図った非常に野心的なツールです。特にMCP対応により、最新のAIエージェント開発環境とシームレスに結合できる点は特筆に値します。
* **推奨されるチームやプロジェクト**:
  AIによる動画・画像生成プロセスを自動化したい個人のクリエイターや研究者。最新のAIエージェント技術に関心のある開発者。
* **選択時のポイント**:
  非公開APIとWeb UIの構造に依存しているため、動作の安定性にはリスクがあります。ビジネスのクリティカルなパスに組み込むのではなく、実験的なワークフローや個人の生産性向上のためのツールとして割り切って使用することをおすすめします。
