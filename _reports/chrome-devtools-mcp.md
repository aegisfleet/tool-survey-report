---
# === フロントマター ===
# 【必須項目】
title: "Chrome DevTools MCP 調査レポート"
tool_name: "Chrome DevTools MCP"
tool_reading: "クローム デブツールズ エムシーピー"
category: "開発者ツール"
developer: "Google LLC"
official_site: "https://github.com/ChromeDevTools/chrome-devtools-mcp"
date: "2026-03-12"
last_updated: "2026-03-12"
tags:
  - "MCP"
  - "ブラウザ自動化"
  - "テスト"
  - "AI"
  - "開発者ツール"
description: "AIコーディングアシスタント（Gemini、Claude、Cursorなど）にChromeブラウザの操作権限を与え、自動化やデバッグ、パフォーマンス分析を可能にするMCPサーバー"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "AIエージェント利用者"
    - "フロントエンドエンジニア"
    - "QAエンジニア"
  latest_highlight: "自動接続（autoConnect）オプションのサポート追加（Chrome 144以降）"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: "DevToolsプロトコルを通じた高度なブラウザ操作・分析が可能"
    - point: 5
      reason: "公式（Google / Chrome DevTools チーム）による提供で信頼性が高い"
    - point: 5
      reason: "無料でフル機能がオープンソースで利用可能"
  minus_points:
    - point: -2
      reason: "セットアップ時のオプション指定やポート設定がやや複雑"
  summary: "AIコーディングアシスタントにブラウザ検証能力を付与する強力かつ信頼性の高い公式ツール"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/ChromeDevTools/chrome-devtools-mcp"
  deepwiki: "https://deepwiki.com/ChromeDevTools/chrome-devtools-mcp"
relationships:
  related_tools:
    - "Playwright"
    - "Selenium"
    - "Model Context Protocol"
---

# **Chrome DevTools MCP 調査レポート**

## **1. 基本情報**

* **ツール名**: Chrome DevTools MCP
* **ツールの読み方**: クローム デブツールズ エムシーピー
* **開発元**: Google LLC (Chrome DevTools チーム)
* **公式サイト**: [https://github.com/ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
* **関連リンク**:
  * GitHub: [https://github.com/ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
* **カテゴリ**: 開発者ツール
* **概要**: AIコーディングアシスタント（Gemini、Claude、Cursor、Copilotなど）に対して、ライブのChromeブラウザを制御および検査する能力を提供するModel-Context-Protocol (MCP) サーバーです。自動化、詳細なデバッグ、パフォーマンス分析を行うことができます。

## **2. 目的と主な利用シーン**

* **解決する課題**: AIエージェントがブラウザの実際の表示状態やパフォーマンス、ネットワークリクエストなどを直接確認できないという課題を解決します。
* **想定利用者**: AIコーディングアシスタントを利用する開発者、テスト自動化エンジニア、QAチーム
* **利用シーン**:
  * AIエージェントによるフロントエンドコードの修正後、実際のブラウザで正しくレンダリングされているかスクリーンショットを撮って確認させる。
  * ウェブサイトのパフォーマンス問題（Core Web Vitalsなど）をAIに分析させる。
  * コンソールエラーやネットワークリクエストの失敗をAIにデバッグさせる。

## **3. 主要機能**

* **パフォーマンス分析 (Performance insights)**: Chrome DevToolsを使用してトレースを記録し、実行可能なパフォーマンスの洞察を抽出します。
* **高度なブラウザデバッグ (Advanced browser debugging)**: ネットワークリクエストの分析、スクリーンショットの取得、ブラウザコンソールのメッセージ（ソースマップ付きスタックトレース対応）の確認が可能です。
* **信頼性の高い自動化 (Reliable automation)**: Puppeteerを使用してChromeでのアクションを自動化し、アクションの結果を自動的に待機します（クリック、入力、ナビゲーションなど）。
* **UIエミュレーション**: ライト/ダークモードの切り替え、CPUスロットリング、ネットワークスロットリング、ビューポートのサイズ変更、モバイルデバイスエミュレーションなどをサポートします。
* **Lighthouse監査**: アクセシビリティ、SEO、ベストプラクティスに関するLighthouseスコアとレポートを取得できます。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js v20.19 またはそれ以降のLTSバージョン
  * 最新のChrome安定版
  * npm
* **インストール/導入**:
  MCPクライアントの設定ファイルに以下を追加します。
  ```json
  {
    "mcpServers": {
      "chrome-devtools": {
        "command": "npx",
        "args": ["-y", "chrome-devtools-mcp@latest"]
      }
    }
  }
  ```
* **初期設定**:
  * 既存のChromeインスタンスに接続したい場合は `--autoConnect` フラグ（Chrome 144以上）や、リモートデバッグポートを有効にした上で `--browser-url` オプションを使用します。
* **クイックスタート**:
  MCPクライアント内で以下のプロンプトを入力して動作確認を行います。
  ```
  Check the performance of https://developers.chrome.com
  ```

## **5. 特徴・強み (Pros)**

* Chrome DevToolsチームによる公式提供のため、DevToolsプロトコル(CDP)の機能をフルに活用した高度な制御が可能です。
* パフォーマンス・ネットワーク・コンソールといった開発者向けの詳細な情報にAIが直接アクセスできます。
* Puppeteerベースの堅牢な自動化エンジンを内蔵しており、待機処理などが安定しています。

## **6. 弱み・注意点 (Cons)**

* 機密情報や個人情報が含まれるブラウザのコンテンツをMCPクライアント（AI）に露出するため、不要な情報の共有に注意が必要です。
* 既存のブラウザのプロファイルをそのまま利用するためには、ポートフォワーディングや起動オプションの調整など、やや複雑な設定が必要です。
* 日本語に特化したUIやドキュメントは提供されていません（出力や操作対象ページ自体は日本語に対応しています）。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (OSS)** | 無料 | Apache-2.0ライセンス。すべての機能が無料で利用可能。 |

* **課金体系**: 完全無料（オープンソース）
* **無料トライアル**: なし（完全に無料のため）

## **8. 導入実績・事例**

* **導入企業**: オープンソースツールのため、特定の企業導入事例は公式には公開されていません。
* **導入事例**: Claude Code、Cursor、Gemini Code Assist、Copilot など、主要なAIエージェント・IDEにて標準的または推奨されるブラウザ連携MCPサーバーとして広く利用されています。
* **対象業界**: ソフトウェア開発全般

## **9. サポート体制**

* **ドキュメント**: GitHubのREADMEおよび `docs/` ディレクトリ内にツールリファレンスやトラブルシューティングガイドが提供されています。
* **コミュニティ**: GitHub IssuesやDiscussionsを通じたオープンソースコミュニティが存在します。
* **公式サポート**: 商用の公式サポートはありませんが、GoogleのChrome DevToolsチームがメインでメンテナンスを行っています。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: MCP (Model Context Protocol) サーバーとして動作し、MCP互換の任意のクライアントと連携可能です。
* **外部サービス連携**: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, Kiro, Qoderなど、多数のAIコーディングアシスタントと標準で連携可能です。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **MCP対応AIエージェント** | ◎ | MCPプロトコルに従ってシームレスに連携可能 | 特になし |
| **Puppeteer** | ◎ | 内部でPuppeteerを使用しており、親和性が高い | 特になし |
| **Chrome / Chromium** | ◎ | 公式ツールであり、最新のChrome機能に追従 | 特になし |

## **11. セキュリティとコンプライアンス**

* **認証**: デスクトップローカルで実行されるため、外部からの認証メカニズムは組み込まれていません。必要に応じてWebSocketへのカスタムヘッダー（`--wsHeaders`）設定が可能です。
* **データ管理**: デフォルトではパフォーマンスツールがトレースURLをGoogle CrUX APIに送信し、実際のユーザー体験データを取得します（`--no-performance-crux` で無効化可能）。また、匿名の使用統計情報もGoogleに送信されます（`--no-usage-statistics` で無効化可能）。
* **準拠規格**: オープンソースプロジェクトのため、特定のエンタープライズ向けコンプライアンス認証（SOC2など）は取得していません。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 本ツール自体はバックグラウンドで動作するサーバーであり、操作はMCPクライアント（チャットUIなど）を通じて自然言語で行われます。
* **学習コスト**: クライアント側（Cursorなど）の設定ファイルに数行のJSONを追記するだけで導入できるため、学習コストは非常に低いです。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 既存の認証済みセッションを再利用したい場合は、`--autoConnect` フラグを使用するか、リモートデバッグポート（例: 9222）を有効にして起動したChromeに `--browser-url` で接続する構成が推奨されます。
  * 単純なタスクのみを行う場合は、`--slim --headless` を指定してリソース消費を抑えることができます。
* **陥りやすい罠 (Antipatterns)**:
  * セキュリティ上の理由から、普段プライベートなブラウジングに使用しているプロファイルでリモートデバッグポートを無闇に開くことは避けるべきです（専用の一時ディレクトリの使用が推奨されます）。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub リポジトリ (Stars)
* **総合評価**: 28.7k Stars (GitHub)
* **ポジティブな評価**:
  * 「AIエージェントにブラウザで実際の動作を確認させることができるようになり、フロントエンド開発の生産性が劇的に向上した」
  * 「パフォーマンス分析やLighthouse監査までツールとして提供されているのが素晴らしい」
  * 「Puppeteerベースのため、要素の待機やクリックの安定性が高い」
* **ネガティブな評価 / 改善要望**:
  * 「既存のブラウザセッション（ログイン状態など）を引き継いで実行する設定が初学者には少し分かりにくい」
  * 「クラッシュした際の再接続やエラーハンドリングに関する課題がある」
* **特徴的なユースケース**:
  * AIに指定したURLを巡回させ、Lighthouseのスコアが低いページを特定して、その改善コードを提案・修正させる完全自動化フロー。

## **15. 直近半年のアップデート情報**

* **2026-03-11**: v0.20.0 リリース
* **2025-XX-XX**: Chrome 144以降における `--autoConnect` オプションの追加。既存のブラウザへのより簡単な接続をサポート。
* **2025-XX-XX**: パフォーマンス測定ツールの拡充（`performance_start_trace`, `performance_analyze_insight` など）。

(出典: [GitHub Releases](https://github.com/ChromeDevTools/chrome-devtools-mcp/releases) )

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (Chrome DevTools MCP) | Puppeteer / Playwright (直接利用) | Browser-use |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | ブラウザ自動操作 | ◎<br><small>AI向けにツール化済み</small> | ◯<br><small>コード実装が必要</small> | ◎<br><small>AI特化型自動化</small> |
| **分析機能** | Lighthouse / パフォーマンス | ◎<br><small>DevToolsネイティブ統合</small> | △<br><small>追加実装・連携が必要</small> | △<br><small>操作メインで分析機能は弱い</small> |
| **連携容易性** | MCPネイティブサポート | ◎<br><small>MCPサーバーとして提供</small> | ×<br><small>自身でMCPサーバーを構築必要</small> | ◯<br><small>一部MCPサポートあり</small> |
| **非機能要件** | 学習コスト（導入の手間） | ◎<br><small>設定ファイル追記のみ</small> | △<br><small>スクリプト作成の知識が必要</small> | ◯<br><small>ライブラリの組み込みが必要</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | Google公式のMCPサーバー | DevToolsプロトコルへの完全なアクセス、パフォーマンス分析 | 複雑なシナリオはAIの推論能力に依存する | CursorやClaude CodeなどのMCP対応クライアントで即座にブラウザ連携を使いたい場合 |
| **Puppeteer / Playwright** | ブラウザ自動化の標準ライブラリ | 完全に制御可能、CI/CDでのテストに最適 | AI連携には自前でラップするコードが必要 | 固定のテストシナリオを安定して高速に実行したい場合 |
| **Browser-use** | AIによるブラウザ操作に特化したライブラリ | 独自のDOM理解による高い操作成功率 | パフォーマンス分析等の開発者向け機能は少ない | Pythonベースの独自AIエージェントを構築しており、より柔軟なブラウザ操作を重視する場合 |

## **17. 総評**

* **総合的な評価**:
  Chrome DevTools MCPは、AIコーディングアシスタントに「目」と「手」を与える画期的なツールです。単なるクリックや入力の自動化にとどまらず、Lighthouse監査やパフォーマンスプロファイリングといった、通常は開発者が手動で行う高度な分析タスクまでAIに委譲できる点が最大の魅力です。Google公式のプロジェクトである安心感もあり、フロントエンド開発のパラダイムを大きく変える可能性を秘めています。
* **推奨されるチームやプロジェクト**:
  * Cursor、Claude Code、GitHub CopilotなどのMCP対応AIエージェントを日常的に利用しているすべての開発チーム。
  * 特にUIの検証、アクセシビリティ改善、パフォーマンス・チューニングに課題を抱えるフロントエンドチーム。
* **選択時のポイント**:
  AIを使ったスクレイピングやRPA的な用途であればBrowser-use等の特化型ライブラリも強力ですが、「開発中のアプリケーションをデバッグ・分析する」という目的においては、DevToolsの深部までアクセスできる本ツールが最良の選択肢となります。
