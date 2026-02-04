---
title: "Model Context Protocol (MCP) 調査レポート"
tool_name: "Model Context Protocol"
tool_reading: "モデルコンテキストプロトコル"
category: "開発者ツール"
developer: "Anthropic"
official_site: "https://modelcontextprotocol.io/"
date: "2026-02-03"
last_updated: "2026-02-03"
tags:
  - "AI"
  - "オープンソース"
  - "標準化"
  - "プロトコル"
  - "開発者ツール"
description: "AIモデルと外部のデータ・ツールを接続するためのオープン標準プロトコル"
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "AIエンジニア"
  latest_highlight: "主要なAIエディタ（Cursor, Windsurf）やClaude Desktopでの採用が加速"
  update_frequency: "高"
evaluation:
  score: 95
  base_score: 70
  plus_points:
    - point: 10
      reason: "AIとツール間の接続を標準化し、個別実装の乱立を防ぐ画期的なプロトコル"
    - point: 5
      reason: "Anthropic主導で、Microsoft, Google等の主要プレイヤーも参画・対応が進んでいる"
    - point: 5
      reason: "オープンソースであり、誰でもサーバーやクライアントを開発可能"
    - point: 5
      reason: "セキュリティ（サンドボックス化）とユーザビリティを両立"
  minus_points: []
  summary: "AIアプリケーションのエコシステムを根底から変える、事実上の標準（デファクトスタンダード）となるプロトコル"
links:
  github: "https://github.com/modelcontextprotocol"
  documentation: "https://modelcontextprotocol.io/introduction"
relationships:
  parent: ""
  children:
    - "AWS MCP Servers"
    - "Context7"
    - "MCP Apps"
  related_tools:
    - "Claude"
    - "Cursor"
    - "Windsurf"
    - "Cline"
    - "Agent Skills"
---

# **Model Context Protocol (MCP) 調査レポート**

## **1. 基本情報**

* **ツール名**: Model Context Protocol
* **ツールの読み方**: モデルコンテキストプロトコル
* **開発元**: Anthropic (オープンソースコミュニティ)
* **公式サイト**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
* **関連リンク**:
  * GitHub: [https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
  * ドキュメント: [https://modelcontextprotocol.io/introduction](https://modelcontextprotocol.io/introduction)
* **カテゴリ**: 開発者ツール / AIプロトコル
* **概要**: Model Context Protocol (MCP) は、AIモデルと外部のデータ、ツール、プロンプトを接続するためのオープン標準プロトコルです。これまでAIアプリケーションごとに個別に実装されていた統合（インテグレーション）を標準化し、一度サーバーを構築すれば、CursorやClaude Desktopなど、あらゆるMCP対応クライアントから利用可能にします。いわば「AIアプリケーションのためのUSBポート」のような役割を果たします。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * **サイロ化**: AIツールごとに異なるAPI統合を書く必要がある（n×m問題）。
  * **コンテキスト不足**: AIがローカルファイルや社内データベースなどの最新情報にアクセスできない。
  * **開発コスト**: 新しいデータソースを追加するたびに、すべてのAIツールに対してコネクタを開発するのは非効率。
* **想定利用者**:
  * AIアプリケーション開発者（クライアント側）
  * ツール・サービス開発者（サーバー側）
  * 日々の業務でAIを活用するエンジニア
* **利用シーン**:
  * **ローカル開発**: プロジェクト内のファイル構造やコードベースをAIに読み込ませてコーディング支援を受ける。
  * **データベース操作**: SQLクエリを実行したり、スキーマ情報を取得して分析する。
  * **外部API連携**: Linearのタスク管理、Slackのメッセージ送信、GitHubの操作などをAIから行う。
  * **情報検索**: Web検索や社内Wiki（Notion等）の内容を取得して回答の根拠にする。

## **3. 主要機能**

* **MCPサーバー**: データやツールを公開する軽量なサーバー。ローカルPC上やリモートサーバーで動作する。
* **MCPクライアント (Host)**: サーバーに接続し、ツールやリソースを利用するAIアプリケーション（例: Claude Desktop, Cursor, Zed）。
* **リソース (Resources)**: サーバーが提供する読み取り専用のデータ（ファイル、ログ、DBレコードなど）。
* **ツール (Tools)**: AIが実行可能な関数やアクション（APIコール、計算、データ操作など）。
* **プロンプト (Prompts)**: サーバー側で定義された、再利用可能なプロンプトテンプレート。
* **トランスポート層**: JSON-RPC 2.0を用いた通信。Stdio（標準入出力）またはSSE（Server-Sent Events）をサポート。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js または Python 環境（SDK利用時）
  * MCP対応クライアント（Claude Desktop, Cursorなど）
* **インストール/導入**:
  各クライアントの設定ファイルに、使用したいMCPサーバーのコマンドを記述する。
  例（Claude Desktopの場合 `~/Library/Application Support/Claude/claude_desktop_config.json`）:
  ```json
  {
    "mcpServers": {
      "sqlite": {
        "command": "uvx",
        "args": ["mcp-server-sqlite", "--db-path", "/path/to/db.sqlite"]
      }
    }
  }
  ```
* **初期設定**:
  * 必要なMCPサーバーをインストール（`npm install` や `pip install`、あるいは `npx`/`uvx` で直接実行）。
  * 設定ファイルを編集してクライアントを再起動。
* **クイックスタート**:
  * 公式の [Quickstart Guide](https://modelcontextprotocol.io/quickstart) に従い、シンプルなMCPサーバーを作成・接続する。
  * 既存のコミュニティ製サーバー（GitHub, Google Drive, PostgreSQLなど）を利用する。

## **5. 特徴・強み (Pros)**

* **エコシステムの統一**: 「一度書けばどこでも動く（Write once, run anywhere）」を実現。開発者は特定のAIモデルに依存せずにツールを作成できる。
* **セキュリティ**: サーバーはサンドボックス化されており、AIがアクセスできる範囲を明確に制御可能。
* **柔軟性**: ローカルのCLIツールからクラウドサービスまで、あらゆるものをAIに接続できる。
* **主要プレイヤーの支持**: Anthropicが主導し、Microsoft, Google, Zed, Replitなどがサポートや関心を表明しており、将来性が高い。

## **6. 弱み・注意点 (Cons)**

* **クライアントの対応状況**: 急速に普及しているものの、すべてのAIツールがMCPに対応しているわけではない。
* **設定の手間**: 現状ではJSON設定ファイルを手動で編集する必要があるケースが多く、非エンジニアにはハードルが高い（Smitheryなどのインストーラーで改善されつつある）。
* **ローカルサーバーの管理**: ローカルで多数のサーバーを動かす場合、リソース消費や管理が煩雑になる可能性がある。

## **7. 料金プラン**

Model Context Protocol 自体はオープンソース（MITライセンス）であり、完全に無料。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **OSS** | 無料 | 仕様、SDK、サンプルコードがすべて公開されている。 |

* **課金体系**: なし（ただし、接続先の外部APIやサービス利用料は別途発生する）。

## **8. 導入実績・事例**

* **導入企業**: Anthropic (Claude), Cursor, Windsurf (Codeium), Zed, Replit, Sourcegraph (Cody) などがクライアントとして対応。
* **サーバー実装**: Google Drive, Slack, GitHub, PostgreSQL, Linear, Notion などの主要サービスのMCPサーバーが公開されている。
* **コミュニティ**: 発表直後から数多くのコミュニティ製サーバー（mcp-servers）が開発されている。

## **9. サポート体制**

* **ドキュメント**: 公式ドキュメントが充実しており、チュートリアルやAPIリファレンスが整備されている。
* **コミュニティ**: DiscordサーバーやGitHub Discussionsが活発。
* **公式サポート**: 特定の企業による商用サポートはないが、エコシステム全体でサポートが行われている。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: JSON-RPCベースのシンプルなプロトコル。
* **外部サービス連携**: 基本的にあらゆるAPIをラップしてMCPサーバー化できるため、連携範囲は無限大。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **TypeScript / Node.js** | ◎ | 公式SDKがあり、エコシステムが最も充実している。 | 特になし。 |
| **Python** | ◎ | 公式SDKがあり、データ分析やAI系ライブラリとの親和性が高い。 | 環境構築（venv等）が必要。 |
| **Java / Kotlin** | ◯ | コミュニティ製SDKが存在する。 | 公式SDKほどの更新頻度ではない可能性。 |

## **11. セキュリティとコンプライアンス**

* **認証**: プロトコル自体には認証機構は含まれないが、トランスポート層やサーバー実装側でAPIキー等の管理を行う。
* **データ管理**: クライアント（Host）がユーザーの承認を得てからツールを実行するモデル（Human in the loop）が推奨されており、勝手にデータを送信したり破壊的な操作を行ったりすることを防ぐ仕組みがある。
* **準拠規格**: オープン標準として透明性が高い。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: ユーザーはチャットインターフェースから自然言語で指示するだけで、裏側でMCPツールが動くため、体験は非常にシームレス。
* **学習コスト**: サーバー開発者にとっては、シンプルなRPCサーバーを書くだけなので学習コストは低い。SDKが複雑さを隠蔽してくれる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Smitheryの利用**: MCPサーバーの検索・インストールにCLIツール `smithery` を使うと設定が楽になる。
  * **単一責任の原則**: 1つのMCPサーバーに機能を詰め込みすぎず、機能ごとにサーバーを分ける。
* **陥りやすい罠 (Antipatterns)**:
  * **重すぎる処理**: タイムアウトを考慮せず、長時間かかる処理を同期的に実行させる。
  * **過剰な権限**: `rm -rf` のような危険なコマンドをガードなしで実行できるようにする。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: X (Twitter), GitHub, Tech Blog
* **総合評価**: 「AIのiPhoneモーメント」「これこそ待ち望んでいた標準化」といった絶賛の声が多い。
* **ポジティブな評価**:
  * 「CursorとClaudeで同じツールが使えるのが最高」
  * 「自分専用のツールを簡単に作ってAIに組み込める」
* **ネガティブな評価 / 改善要望**:
  * 「Windowsでのセットアップが少し面倒（パスの問題など）」
  * 「まだ対応していないエディタがある」

## **15. 直近半年のアップデート情報**

* **2024-11**: Model Context Protocol オープンソース公開。
* **2024-12**: SDKのアップデート、コミュニティサーバーの拡充。
* **2025-01**: MCP Apps (UI拡張) の仕様公開。

(出典: [Model Context Protocol Blog](https://modelcontextprotocol.io/blog))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | MCP | OpenAI Actions | LangChain Tools |
|:---:|:---|:---:|:---:|:---:|
| **標準化** | 共通プロトコル | ◎<br><small>業界標準</small> | ×<br><small>OpenAI専用</small> | △<br><small>FW依存</small> |
| **ポータビリティ** | クライアント間移動 | ◎<br><small>設定のみで可</small> | ×<br><small>不可</small> | △<br><small>コード修正要</small> |
| **実装言語** | SDK対応 | ◎<br><small>TS/Python他</small> | - | ◎<br><small>TS/Python</small> |
| **ローカル連携** | ローカルファイル | ◎<br><small>Stdio接続</small> | ×<br><small>クラウドのみ</small> | ◯<br><small>実装次第</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Model Context Protocol** | オープンな接続プロトコル | クライアントとサーバーがN:Mで接続可能。ローカル連携に強い。 | クライアント側の対応が必要。 | 汎用的なツールを作り、複数のAIエディタや環境で使い回したい場合。 |
| **OpenAI Actions (GPTs)** | ChatGPT専用のツール連携 | ChatGPT内での設定が簡単。 | OpenAIのエコシステムに閉じており、他で使えない。 | ChatGPTのみをターゲットにしたツールやGPTsを作る場合。 |
| **LangChain Tools** | アプリ開発FW内のツール定義 | LangChainのエコシステム内でリッチな連鎖が可能。 | LangChainというフレームワークへの依存が発生する。 | LangChainを使って独自のAIアプリケーションを構築する場合。 |

## **17. 総評**

* **総合的な評価**:
  Model Context Protocolは、AIとツールの連携における「共通言語」を確立した革命的な技術である。これまで分断されていたAIエコシステムをつなぎ、開発者が一度の労力で最大の価値を提供できる環境を整えた。
* **推奨されるチームやプロジェクト**:
  * 社内ツールや独自のデータソースをAIに安全に接続したい企業。
  * AI開発ツールやエージェントを作成しているベンダー。
* **選択時のポイント**:
  * 独自のツールを開発する場合、まずはMCPサーバーとして実装することを強く推奨する。それにより、Cursor, Claude, Windsurfなど多くのプラットフォームですぐに利用可能になるからだ。
