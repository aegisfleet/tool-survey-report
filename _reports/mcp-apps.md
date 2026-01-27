---
# === フロントマター ===
# 【必須項目】
title: "MCP Apps 調査レポート"
tool_name: "MCP Apps"
tool_reading: "エムシーピー アップス"
category: "開発者ツール"
developer: "Anthropic (Model Context Protocol Project)"
official_site: "https://modelcontextprotocol.io/docs/extensions/apps"
date: "2026-01-27"
last_updated: "2026-01-27"
tags:
  - "AIエージェント"
  - "UI/UX"
  - "オープンソース"
  - "開発者ツール"
description: "AIチャットインターフェース内でインタラクティブなUIを表示するためのModel Context Protocol (MCP) の拡張機能"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "AIエンジニア"
  latest_highlight: "Claude DesktopやVS Codeでのサポートが拡充中"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: "チャット内でのリッチなUI表現を標準化"
    - point: 5
      reason: "オープンソースで誰でも拡張可能"
    - point: 3
      reason: "セキュアなサンドボックス実行環境"
    - point: 2
      reason: "活発なエコシステムと開発速度"
  minus_points: []
  summary: "AIとの対話をテキストからインタラクティブな体験へと進化させる革新的なプロトコル拡張"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/modelcontextprotocol/ext-apps"
  documentation: "https://modelcontextprotocol.io/docs/extensions/apps"
relationships:
  parent: "Model Context Protocol"
  children: []
  related_tools:
    - "Claude"
    - "Visual Studio Code"
    - "Claude Code"
---

# **MCP Apps 調査レポート**

## **1. 基本情報**

* **ツール名**: MCP Apps
* **ツールの読み方**: エムシーピー アップス
* **開発元**: Anthropic (Model Context Protocol Project)
* **公式サイト**: [https://modelcontextprotocol.io/docs/extensions/apps](https://modelcontextprotocol.io/docs/extensions/apps)
* **関連リンク**:
  * GitHub: [https://github.com/modelcontextprotocol/ext-apps](https://github.com/modelcontextprotocol/ext-apps)
  * ドキュメント: [https://modelcontextprotocol.io/docs/extensions/apps](https://modelcontextprotocol.io/docs/extensions/apps)
* **カテゴリ**: 開発者ツール / AIエージェント拡張
* **概要**: AIチャットインターフェース内でインタラクティブなUIを表示するためのModel Context Protocol (MCP) の拡張機能。テキストだけでは表現しきれないデータ可視化や複雑な操作フォームなどを、チャットのコンテキスト内で安全に提供することを可能にする。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * テキストチャットだけでは伝わりにくい複雑な情報の可視化
  * チャットと別ウィンドウを行き来することによるコンテキストの分断
  * AIエージェントによる操作の承認フローやパラメータ設定の煩雑さ
* **想定利用者**:
  * AIエージェント開発者
  * MCPサーバー開発者
  * 社内ツールやダッシュボードをAI統合したいエンジニア
* **利用シーン**:
  * **データ分析**: 売上データやログデータをグラフやマップでインタラクティブに表示・分析する。
  * **設定・構成**: クラウドインフラの構成など、多数のパラメータを持つ設定をフォームUIで一括入力・確認する。
  * **リッチメディア**: PDFビューワー、3Dモデルのプレビュー、生成画像の編集などをチャット内で行う。
  * **リアルタイムモニタリング**: システムの稼働状況などのライブデータをダッシュボードとして表示し続ける。

## **3. 主要機能**

* **インタラクティブUI表示**: HTML/JS/CSSを用いたWebアプリケーションをチャット画面内のサンドボックス（iframe）で表示する機能。
* **コンテキスト保持**: チャットの会話履歴の中にUIが埋め込まれ、会話の流れを断ち切ることなくツールを利用できる。
* **双方向通信**: UI（アプリ）とMCPサーバー（バックエンド）の間でデータを送受信し、ユーザーの操作に応じてサーバー側の処理を実行したり、サーバーからのプッシュ通知を受け取ったりできる。
* **サンドボックス実行**: ホストアプリケーション（Claude Desktop等）とは分離されたiframe内で実行されるため、セキュリティが保たれる。
* **UIプリロード**: ツールが呼び出される前にUIリソースをプリロードし、高速な表示を可能にする。
* **機能委譲 (Delegation)**: アプリからホスト側の機能（他のMCPツールの呼び出し等）をリクエストできる（ユーザーの許可が必要）。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js 18以上
  * MCPに対応したホストアプリケーション（Claude Desktop, VS Code等）
* **インストール/導入**:
  AIコーディングエージェント（Claude Code等）を使用してセットアップする場合：
  ```bash
  # スキルのインストール（例）
  /plugin install mcp-apps@modelcontextprotocol-ext-apps
  ```
  手動でセットアップする場合：
  ```bash
  npm install @modelcontextprotocol/ext-apps @modelcontextprotocol/sdk
  npm install -D typescript vite vite-plugin-singlefile express cors
  ```
* **初期設定**:
  `server.ts` でツールとリソースを登録する。
  ```typescript
  // ツールの登録（UIリソースへの参照を含む）
  registerAppTool(server, "tool-name", { ... }, handler);
  // UIリソースの登録
  registerAppResource(server, "ui://...", path, options, handler);
  ```
* **クイックスタート**:
  AIエージェントに「カラーピッカーを表示するMCP Appを作成して」のように指示するか、サンプルプロジェクトをクローンして実行する。
  ```bash
  git clone https://github.com/modelcontextprotocol/ext-apps
  cd ext-apps/examples/basic-server-react
  npm install && npm start
  ```

## **5. 特徴・強み (Pros)**

* **チャット体験の拡張**: テキストベースの対話を、視覚的かつ操作可能な体験へと劇的に向上させる。
* **開発の容易さ**: 標準的なWeb技術（HTML, CSS, React等）を使ってUIを構築できるため、学習コストが低い。
* **プラットフォーム非依存**: MCP Appsの仕様に従っていれば、様々なMCP対応ホスト（クライアント）で動作する可能性がある。
* **セキュアな設計**: iframeによるサンドボックス化と、明確な権限管理により、サードパーティ製のアプリも安全に実行できる。
* **既存MCP資産の活用**: 既存のMCPサーバーにUI層を追加するだけで、アプリ化が可能。

## **6. 弱み・注意点 (Cons)**

* **ホストの対応状況**: まだ新しい仕様であるため、全てのMCPクライアントが対応しているわけではない（現在はClaude DesktopやVS Code Insidersなどが中心）。
* **UIの制約**: サンドボックス内での実行となるため、ホスト側のDOMへのアクセスや一部のWeb APIの使用には制限がある。
* **日本語ドキュメント**: 公式ドキュメントは英語が中心であり、日本語の情報はまだ少ない。

## **7. 料金プラン**

MCP Apps 自体はオープンソースのプロトコル仕様およびSDKであり、無料で利用・開発が可能。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **OSS / SDK** | 無料 | MCP Appsの開発に必要なSDKや仕様はすべてオープンソースで公開されている。 |

* **課金体系**: なし（ただし、利用するホストアプリケーションやAPI、デプロイ先サーバーの費用は別途発生する場合がある）。

## **8. 導入実績・事例**

* **導入企業**: Anthropic (Claude Desktopでの実装), Block (Goose), Postman (MCPJam) などがクライアントとして対応。
* **導入事例**:
  * **データ可視化**: 売上データやコホート分析のヒートマップ表示。
  * **3Dモデルビューワー**: Three.jsを用いた3Dオブジェクトのプレビュー。
  * **システムモニタリング**: サーバーのリソース使用状況をリアルタイムグラフで表示。
* **対象業界**: ソフトウェア開発、データ分析、DevOps分野での活用が先行している。

## **9. サポート体制**

* **ドキュメント**: 公式サイトおよびGitHubリポジトリに詳細な技術ドキュメントとサンプルコード（Examples）が用意されている。
* **コミュニティ**: GitHub DiscussionsやIssuesを通じて、開発者間の情報交換やバグ報告が行われている。
* **公式サポート**: Anthropicやオープンソースコミュニティによるメンテナンスが行われているが、商用製品のようなSLA付きサポートはない。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: MCP AppsはJSON-RPCベースのプロトコルであり、HTTPやStdioを介して通信する。
* **外部サービス連携**: アプリ内部から外部APIを叩くことも可能（CSP設定による）。また、ホスト側の機能を通じて、Google DriveやSlackなどの他のMCPサーバーと連携することも可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **React** | ◎ | エコシステムが最大。公式サンプルも豊富。 | 特になし。 |
| **Vite** | ◎ | シングルファイルHTMLへのバンドルが容易（`vite-plugin-singlefile`）。 | 設定が少し必要。 |
| **Vue.js / Svelte** | ◯ | 軽量でインタラクティブなUI構築に向いている。 | サンプル数はReactより少なめ。 |
| **Vanilla JS** | ◯ | 依存関係が少なく、シンプルなアプリに最適。 | 大規模化すると管理が大変。 |

## **11. セキュリティとコンプライアンス**

* **認証**: ホストアプリケーション側の認証機構に依存。アプリ自体はトークン等を用いてバックエンドとセキュアに通信可能。
* **データ管理**: アプリはサンドボックス内で実行され、ホストのデータ（CookieやLocalStorage等）には直接アクセスできない。
* **準拠規格**: オープンソースプロジェクトとして、標準的なセキュリティプラクティスに従っている。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: チャットの流れを中断せずにツールを使えるため、ユーザー体験は非常にスムーズ。UI自体はWeb技術で作れるため、自由度が高い。
* **学習コスト**: Web開発（HTML/JS）の知識があれば参入しやすい。MCP特有の通信プロトコル（JSON-RPC）の理解が少し必要だが、SDKが抽象化してくれる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Vite + SingleFile**: UIリソースを単一のHTMLファイルにバンドルすることで、配布とロードを簡素化する。
  * **UI Preloading**: ユーザーがツールを呼び出す可能性が高い場合、事前にUIリソースをロードしておき、待ち時間を短縮する。
  * **双方向通信の活用**: サーバーからのプッシュ通知を利用して、リアルタイムな状態更新を行う。
* **陥りやすい罠 (Antipatterns)**:
  * **過度な複雑化**: チャットの補助ツールであることを忘れ、巨大なSPAをそのまま埋め込もうとする（コンテキストディストラクション）。
  * **セキュリティ設定の不備**: CSP（Content Security Policy）を適切に設定せず、外部リソースを無制限に読み込む。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub, X (Twitter), 技術ブログ
* **総合評価**: 登場したばかりの技術であり、開発者コミュニティからは「チャットボットの可能性を広げる」として高い期待と評価を得ている。
* **ポジティブな評価**:
  * 「テキストだけでは表現できなかったデータが直感的に理解できるようになった」
  * 「Reactなどで簡単にチャット用UIが作れるのが素晴らしい」
  * 「Artifactsのような機能を自作できるのが画期的」
* **ネガティブな評価 / 改善要望**:
  * 「まだ対応しているクライアントが少ない」
  * 「デバッグが少し難しい（iframe内のため）」
* **特徴的なユースケース**:
  * 社内DBの管理画面をMCP App化し、チャットからレコードの検索・更新を行う。

## **15. 直近半年のアップデート情報**

* **2024-12**: MCP Appsの仕様公開とSDKのリリース。
* **2024-12**: Claude DesktopにおけるMCP Appsサポートのプレビュー開始。
* **2024-12**: GitHubリポジトリにてReact, Vue, Svelteなどのサンプルコード拡充。

(出典: [Model Context Protocol Blog](https://blog.modelcontextprotocol.io/), [GitHub Releases](https://github.com/modelcontextprotocol/ext-apps/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | MCP Apps | ChatGPT Canvas | Vercel AI SDK | Streamlit |
|:---:|:---|:---:|:---:|:---:|:---:|
| **統合環境** | チャット内表示 | ◎<br><small>標準機能</small> | ◎<br><small>専用UI</small> | ◎<br><small>Generative UI</small> | ×<br><small>独立アプリ</small> |
| **開発自由度** | UIカスタマイズ | ◎<br><small>フルWeb技術</small> | △<br><small>固定機能</small> | ◎<br><small>React等</small> | ◯<br><small>Python API</small> |
| **標準化** | プロトコル | ◎<br><small>MCP標準</small> | ×<br><small>独自</small> | △<br><small>Vercel独自</small> | ×<br><small>独自</small> |
| **汎用性** | クライアント対応 | ◯<br><small>複数対応予定</small> | ×<br><small>ChatGPTのみ</small> | ◯<br><small>SDK利用アプリ</small> | - |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **MCP Apps** | MCP標準の拡張機能として、チャット内に任意のWebアプリを表示 | プラットフォームに依存しない標準仕様。Claude等の既存LLMで使える。 | 対応ホストがまだ発展途上。 | 既存のMCPエコシステムを活用し、チャット体験を拡張したい場合。 |
| **ChatGPT Canvas** | OpenAIのチャット画面横に表示されるエディタ/キャンバス | ライティングやコーディングに特化したシームレスな体験。 | 開発者が自由にUIを拡張・自作することはできない。 | ChatGPTの標準機能として文章作成やコーディング支援を受けたい場合。 |
| **Vercel AI SDK** | AIアプリ開発のためのSDK (Generative UI) | ReactコンポーネントをLLMの出力としてストリーミング描画できる。 | VercelのエコシステムやReactに依存する部分が大きい。 | 独自のAIチャットアプリをゼロから開発する場合。 |
| **Streamlit** | Pythonのみでデータアプリを構築できるフレームワーク | フロントエンド知識不要で高速にアプリを作れる。 | チャットインターフェースとの統合は弱く、別画面になりがち。 | チャット統合よりも、単体のデータ分析アプリを素早く作りたい場合。 |

## **17. 総評**

* **総合的な評価**:
  MCP Appsは、LLMとの対話を「テキストのやり取り」から「インタラクティブな協働作業」へと昇華させるための重要な技術要素である。オープンな標準仕様であるため、特定のベンダーにロックインされることなく、開発者が自由に拡張機能を作成できる点が最大の魅力。
* **推奨されるチームやプロジェクト**:
  * 社内データを活用したAIアシスタントを開発しているチーム
  * 複雑なパラメータ設定やデータ可視化が必要なDevOpsツールを開発しているプロジェクト
* **選択時のポイント**:
  * 既存のMCPサーバーを活用したいか
  * 特定のAIプラットフォーム（Claude等）と深く統合したいか
  * UIのカスタマイズ性がどれくらい必要か
  これらを考慮し、単なるテキスト応答で十分か、MCP AppsによるリッチなUIが必要かを判断すべきである。
