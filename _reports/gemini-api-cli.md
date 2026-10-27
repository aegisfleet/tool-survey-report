---
title: Gemini API CLI 調査レポート
tool_name: Gemini API CLI
tool_reading: ジェミニ エーピーアイ シーエルアイ
category: AI開発ツール
developer: Google
official_site: https://github.com/google-gemini/gemini-api-cli
date: '2026-10-27'
last_updated: '2026-10-27'
tags:
  - CLI
  - 生成AI
  - 開発者ツール
  - オープンソース
description: AIエージェントやシェルスクリプトからGemini APIを直接利用できる公式CLIツール
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - AIエージェント利用者
  latest_highlight: 2026年10月にv0.4.4がリリースされ、関数実行結果のサブコンテンツ拡張などが追加
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: AIエージェント(Claude Code等)のコマンドラインから直接Geminiの各種機能が利用できる
    - point: 4
      reason: 画像・音声生成、ファイル解析、エージェント実行まで幅広いAPI機能に対応
    - point: 3
      reason: dry-runやjson出力対応など、自動化・機械処理向けの機能が充実
    - point: 3
      reason: 単一バイナリ(Go言語)で提供され環境構築が容易
  minus_points:
    - point: 0
      reason: 特になし
  summary: CLIからGemini APIのフル機能を利用でき、特に他のAIエージェントとの連携・能力拡張に強力なツール
links:
  github: https://github.com/google-gemini/gemini-api-cli
  deepwiki: https://deepwiki.com/google-gemini/gemini-api-cli
  codewiki: https://codewiki.google/github.com/google-gemini/gemini-api-cli
  documentation: https://ai.google.dev/gemini-api/docs
relationships:
  parent: Gemini
  related_tools:
    - Gemini Skills
---

# **Gemini API CLI 調査レポート**

## **1. 基本情報**

* **ツール名**: Gemini API CLI (gemini-api)
* **ツールの読み方**: ジェミニ エーピーアイ シーエルアイ
* **開発元**: Google
* **公式サイト**: [https://github.com/google-gemini/gemini-api-cli](https://github.com/google-gemini/gemini-api-cli)
* **関連リンク**:
  * GitHub: [https://github.com/google-gemini/gemini-api-cli](https://github.com/google-gemini/gemini-api-cli)
  * DeepWiki: [https://deepwiki.com/google-gemini/gemini-api-cli](https://deepwiki.com/google-gemini/gemini-api-cli)
  * CodeWiki: [https://codewiki.google/github.com/google-gemini/gemini-api-cli](https://codewiki.google/github.com/google-gemini/gemini-api-cli)
  * ドキュメント: [https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
* **カテゴリ**: AI開発ツール
* **概要**: コーディングエージェントやアシスタントツールによるヘッドレス利用を想定して構築されたGemini APIのコマンドラインインターフェース（CLI）。シェルスクリプトやCIジョブからも同一のインターフェースで利用可能。

## **2. 目的と主な利用シーン**

* **解決する課題**: アプリ開発中のコーディングエージェントが、画像生成や音声合成、PDFからの情報抽出、マルチステップのリサーチなどをGeminiモデル・エージェントに直接委譲して実行する手段を提供する。
* **想定利用者**: AIエージェント（Codex, Claude Code, Antigravity, OpenClaw, Hermesなど）、スクリプトによる自動化を行う開発者。
* **利用シーン**:
  * AIコーディングエージェントがアプリのモックアップ作成時に、Geminiを用いて必要なアセット（画像・音声・動画）を自動生成する。
  * PDF、画像、音声、動画、CSVなどのファイルをAIで分析・テキスト化・字幕作成するバッチ処理。
  * CI/CDパイプラインやシェルスクリプト内で、LLMを用いたテキスト生成や推論を自動実行する。

## **3. 主要機能**

* **テキスト生成 (`generate`)**: テキストおよびマルチモーダル生成（デフォルトモデル: `gemini-3.8-flash`）。
* **画像生成/編集 (`image`)**: テキストプロンプトからの画像生成および既存画像の編集（デフォルト: `gemini-nano-banana-2.1`）。
* **音声/音楽/動画生成 (`tts`, `music`, `video`)**: テキストから音声（TTS）、音楽、動画の生成。
* **ファイル分析・文字起こし (`analyze`, `transcribe`)**: PDF、画像、音声、動画、CSV等のファイルの分析。Markdown、プレーンテキスト、JSON、SRT形式への文字起こし対応。
* **エージェント・インタラクション管理 (`agent`)**: Geminiのマネージドエージェントを利用した処理の実行（非同期でのバックグラウンド実行やステータス確認が可能）。
* **機械向けインターフェース機能**: `--schema`（JSON Schema出力）、`--dry-run`（ドライラン）、`--output-format json`、`--jq`（JSONフィルタ）など、スクリプトや他のAIから利用・パースしやすい機能が充実。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: Go言語で記述された単一バイナリのクライアントアプリケーション。Gemini Interactions API等のREST/RPC APIと通信する。
* **主要コンポーネントとデータフロー**:
  * ユーザーまたはAIエージェントがシェルからコマンドを発行。
  * CLIがリクエストを構成し、OSのキーチェーンまたは設定ファイルからAPIキーを取得。
  * Gemini APIへリクエストを送信。
  * 結果は標準出力ストリームに書き出される。メディア生成の場合は、指定したファイルパス（`--out`）に直接ファイルが保存され、ファイルパスが標準出力される。
* **特筆すべき要素技術**:
  * `--dry-run`オプションにより、ネットワーク接続なしでリクエスト構成や引数のバリデーションが可能。
  * エージェントモード (`--agent-mode`) により、エラー出力を構造化JSONで行い、標準出力をTOON形式にするなど、機械学習エージェントの利用に最適化されている。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * Gemini APIキーの取得（Google AI Studioから）
* **インストール/導入**:

  ```bash
  # Goがインストールされている場合
  go install github.com/google-gemini/gemini-api-cli/cmd/gemini-api@latest
  ```

* **初期設定**:
  * 環境変数 `GEMINI_API_KEY` を設定、または `gemini-api configure --api-key "YOUR_API_KEY"` で設定（OSのキーチェーン等に安全に保存される）。
* **クイックスタート**:
  * 動作確認（ネットワークアクセスなし）: `gemini-api generate "Hello from my agent" --dry-run`
  * 実際のAPI呼び出し: `gemini-api generate "Hello from my agent"`

## **6. 特徴・強み (Pros)**

* **AIエージェントとの高い親和性**: エージェント（Claude Code等）に `AGENTS.md` 等で「gemini-apiコマンドが使える」と指示するだけで、エージェント自身が `--help` や `--schema` で仕様を学習し、自律的にAPIを呼び出せる設計（Self-describing interface）。
* **マルチモーダル・メディア生成への対応**: テキストだけでなく、画像、音声、音楽、動画の生成や分析を単一のツールでカバーできる。
* **非同期・バックグラウンド実行**: マネージドエージェントの長時間のタスクをバックグラウンドで開始し、IDだけ受け取って後から結果を確認するワークフロー（ポーリング）にネイティブ対応。
* **セキュアな設計**: `--dry-run`による事前検証や、OSキーチェーンとの連携など。

## **7. 弱み・注意点 (Cons)**

* **ベータ版ステータス**: 現在はベータ版であり、Gemini Interactions APIの進化に伴い破壊的変更が発生する可能性があるため、CI/CDで利用する場合はバージョンのピン留めが推奨されている。
* **OSSコントリビューション非受付**: 現時点では外部からのPull Request（OSSとしてのコントリビューション）は受け付けていない。
* **日本語対応**: コマンド自体やヘルプ出力等は英語である。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (Apache 2.0)** | 無料 | ツールの利用自体は無料（Gemini APIの利用には別途API利用料がかかる場合がある） |

* **課金体系**: CLIツールは完全無料。バックエンドのGemini APIはGoogle AI Studioの料金体系（無料枠あり）に従う。
* **無料トライアル**: Gemini API自体の無料枠を利用可能。

## **9. 導入実績・事例**

* **導入企業**: 公開事例なし（比較的新しいツールのベータ版のため）。
* **導入事例**: AIコーディングエージェント（Codex, Claude Code等）のツールとしての利用例がREADME内で提示されている。
* **対象業界**: ソフトウェア開発、自動化パイプライン構築。

## **10. サポート体制**

* **ドキュメント**: GitHubリポジトリのREADME、およびCLI内蔵の `--help`, `--usage`, `--schema`。
* **コミュニティ**: 外部のプルリクエストは受け付けていないが、バグ報告やフィードバックはGitHub Issuesで受け付けている。
* **公式サポート**: 公式なSLA付きのサポートはない。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: バックエンドとしてGemini API（Interactions API, Files API等）を利用。
* **外部サービス連携**: 各種AIエージェントツール（Claude Code, Cursor等）からのシェルアクセスによる連携。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Bash / Shell スクリプト** | ◎ | `--jq` フィルタや `--output-format json` によりシェルスクリプトからのパース・連携が極めて容易 | 特になし |
| **Go言語** | ◯ | ツール自体がGoで書かれており `go install` で容易に導入可能 | SDKではなくCLIツール |
| **AI エージェントフレームワーク** | ◎ | `--agent-mode`、`--usage`、`--schema` 等エージェントが利用・解釈しやすい機能が豊富 | 破壊的変更の可能性に注意 |

## **12. セキュリティとコンプライアンス**

* **認証**: Google AI StudioのAPIキーによる認証。キーはOS標準のキーチェーン（macOS Keychain, Linux Secret Service, Windows Credential Manager）または設定ファイルに保存できる。
* **データ管理**: CLI自体はローカルで動作し、ファイルのアップロード（Files API）等はGemini API側の仕様（48時間保持など）に従う。
* **準拠規格**: Apache License 2.0 で提供されている。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: ターミナルでの利用（CLI）に特化している。人間向けのインタラクティブなエクスプローラー機能（`gemini-api explore`）や設定機能（`gemini-api configure --interactive`）も搭載。
* **学習コスト**: 一般的なCLIツールの使用経験があれば容易。また、AIエージェントに利用させる場合、自己記述的なヘルプ（`--schema` 等）があるためエージェント側の学習・適応コストも低い。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 独自のAIエージェント（CursorやClaude Code等）にシェルアクセス権限を与え、`AGENTS.md`（または `.cursorrules` 等）に本CLIの利用手順（`--help`や`--schema`を見ること、出力をパースすること等）を記述しておく。これにより、エージェントが自律的にGeminiのモデルや画像生成機能を利用できるようになる。
  * バッチスクリプト等から呼び出す際は `--stream=false --output-format json` を指定し、必要に応じて `--jq` で出力をフィルタリングして受け取る。
* **陥りやすい罠 (Antipatterns)**:
  * CI環境等で利用する際に `latest` を使用し続けると、ベータ版の破壊的変更により突然スクリプトが動かなくなる可能性がある。GitHub Releasesで特定のバージョン（例：`v0.4.4`）にピン留めすることが強く推奨される。
  * メディア生成などにおいて、APIキーや出力先パスの指定を誤るとエラーになるため、事前に `--dry-run` を用いてコマンドをバリデーションする。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub Repository
* **総合評価**: 該当なし（G2などのレビューサイトには未登録）
* **ポジティブな評価**:
  * 開発ツールとして、単一のCLIバイナリで幅広いGemini機能（テキスト、画像、音声、動画、リサーチエージェント）にアクセスできる設計が優れている。
* **ネガティブな評価 / 改善要望**:
  * コントリビューション（PR）の受け付けがない点については、コミュニティ主導の機能追加を望む声がある可能性がある。
* **特徴的なユースケース**:
  * コーディングエージェントに「このアプリのランディングページを作って」と指示するだけで、エージェントが背後で本CLIを呼び出し、マスコット画像を生成し、音声を作成し、競合調査を行ってページを完成させるという自律的なワークフロー。

## **16. 直近半年のアップデート情報**

* **2026-10-23**: v0.4.4 - OpenAPI Generatorの更新、`FunctionResultSubContent`にオーディオ・ドキュメント・ビデオコンテンツを含める機能拡張など。キーを持たないユーザーへのドキュメント案内改善。
* **2026-10-19**: v0.4.3 - リストコマンドの`--all`ページネーション対応テスト追加、`video`コマンドへのオプション追加、モデルへの`gemini-4-argon`追加など。
* **2026-10-12**: v0.4.2 - 各種バグ修正など。
* **2026-05-19**: v0.1.0 - 初回リリース。

(出典: [GitHub リポジトリ/Releases](https://github.com/google-gemini/gemini-api-cli/releases))

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Gemini API CLI | 汎用 curl コマンド | OpenAI CLI |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | CLIからのAPI実行 | ◎<br><small>専用コマンドが用意されている</small> | ◯<br><small>JSONの組み立てが必要</small> | ◎<br><small>OpenAI特化</small> |
| **マルチモーダル** | 画像/音声/動画 生成 | ◎<br><small>gemini-api tts 等専用コマンドあり</small> | △<br><small>バイナリ処理が煩雑</small> | ◯<br><small>DALL-E, TTS等対応</small> |
| **自動化連携** | 機械向け出力 (JSON, jq) | ◎<br><small>--output-format json や --jq を内蔵</small> | ◯<br><small>外部jqコマンドが必要</small> | ◯<br><small>JSON出力対応</small> |
| **非機能要件** | 自己記述性・ドライラン | ◎<br><small>--schema, --usage, --dry-run完備</small> | ×<br><small>API仕様の参照が別途必要</small> | △<br><small>一部ヘルプのみ</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Gemini API CLI** | Gemini API（Interactions API等）専用の公式CLI | エージェント（機械）からの利用を前提とした設計、ドライラン機能、単一バイナリでの多機能サポート | Gemini API専用であり他社APIには非対応 | AIエージェントにGeminiの機能（画像/音声生成、ファイル解析等）を委譲させたい場合、またはスクリプトでGeminiを利用したい場合 |
| **curl** | 汎用HTTPクライアント | 全てのREST APIに利用可能、環境依存が少ない | 複雑なJSONペイロードの構築やレスポンスのパース（ファイル保存等）に手間がかかる | 非常に単純なAPIリクエストのみを行う場合や、専用CLIがインストールできない環境 |
| **OpenAI CLI** | OpenAIプラットフォーム用のCLIツール | OpenAIモデルの利用に最適化されている | OpenAIプラットフォーム限定 | 利用するLLM基盤がOpenAI（ChatGPTなど）である場合 |

## **18. 総評**

* **総合的な評価**:
  Gemini API CLIは、単なる開発者向けのAPIクライアントにとどまらず、**「AIエージェントにシェルコマンドとして機能を付与する」**という明確なコンセプトを持った非常に強力なツールである。自己記述的なインターフェース（`--schema`, `--usage`）や安全なプレビュー機能（`--dry-run`）など、最新の開発ワークフローを強力にサポートする。
* **推奨されるチームやプロジェクト**:
  * AIコーディングエージェント（Claude Code, Cursorなど）を開発フローに組み込んでいるチーム。
  * シェルスクリプトやCI/CDパイプライン上で、LLMによるテキスト解析やファイル変換（文字起こし等）を自動化したいプロジェクト。
* **選択時のポイント**:
  * 他のAIモデルを利用する場合は別ツールが必要だが、Geminiを利用する（またはエージェントにGeminiを使わせる）のであれば、HTTPリクエストを自作するよりも圧倒的に生産性が高い。現時点ではベータ版であるため、バージョン固定運用を前提に導入するのが良い。
