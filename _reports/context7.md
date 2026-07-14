---
title: Context7 調査レポート
tool_name: Context7
tool_reading: コンテキストセブン
category: MCPサーバー/基盤
developer: Upstash
official_site: https://context7.com/
date: '2026-01-28'
last_updated: '2026-07-14'
tags:
  - AI
  - エージェント
  - オープンソース
  - 開発者ツール
  - コーディング支援
description: LLMに最新のライブラリドキュメントとコード例を直接供給し、ハルシネーションを防ぐMCPサーバー
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - AIエンジニア
  latest_highlight: 2026年6月〜7月のアップデートで、Okta等のIdP連携（Enterprise Auth）やMCPフォーム要求によるセキュアなサインインプロンプトに対応
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: 最新かつバージョン指定可能なドキュメントをLLMに提供し、ハルシネーションを大幅に削減
    - point: 5
      reason: MCP (Model Context Protocol) に準拠しており、CursorやClaude Codeなど様々なツールで利用可能
    - point: 3
      reason: 無料プランでも月1,000回まで利用可能で、個人利用には十分
    - point: 2
      reason: Upstashによる開発・運用で、インフラ面での信頼性が高い
  minus_points: []
  summary: AIコーディングにおける「情報の鮮度」という最大の課題を解決する、必須級のMCPツール
links:
  github: https://github.com/upstash/context7
  deepwiki: https://deepwiki.com/upstash/context7
  codewiki: https://codewiki.google/github.com/upstash/context7
  documentation: https://context7.com/docs
relationships:
  parent: Model Context Protocol
  children: []
  related_tools:
    - Cursor
    - Claude Code
---

# **Context7 調査レポート**

## **1. 基本情報**

* **ツール名**: Context7
* **ツールの読み方**: コンテキストセブン
* **開発元**: Upstash
* **公式サイト**: [https://context7.com/](https://context7.com/)
* **関連リンク**:
  * GitHub: [https://github.com/upstash/context7](https://github.com/upstash/context7)
  * CodeWiki: [https://codewiki.google/github.com/upstash/context7](https://codewiki.google/github.com/upstash/context7)
  * ドキュメント: [https://context7.com/docs](https://context7.com/docs)
* **カテゴリ**: AI開発ライブラリ / MCPサーバー
* **概要**: Context7は、LLM (Large Language Models) に最新のライブラリドキュメントとコード例を供給するためのMCPサーバーです。LLMのトレーニングデータに含まれない新しいライブラリや、バージョンアップにより変更されたAPI仕様などをリアルタイムに取得し、AIの回答精度を向上させます。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * LLMが持つ知識が古く、廃止されたAPIや古い書き方を提案してしまう（ハルシネーション）
  * マイナーなライブラリや最新のフレームワークに関する知識が不足している
  * ドキュメントを探してコピペしてプロンプトに貼る作業の手間
* **想定利用者**:
  * 日々新しい技術やライブラリを利用するWeb/アプリ開発者
  * CursorやClaude CodeなどのAIコーディングツールを使用しているエンジニア
* **利用シーン**:
  * **最新ライブラリの利用**: リリースされたばかりのフレームワーク（例: Next.jsの最新版）を使って開発する場合。
  * **マイナーなツールの使用**: LLMの学習データに少ないライブラリを使用する場合。
  * **API仕様の確認**: 正確なパラメータや型定義を知りたい場合。

## **3. 主要機能**

* **リアルタイムドキュメント取得**: 最新の公式ドキュメントをオンデマンドで取得し、LLMのコンテキストに追加する。
* **バージョン指定**: `Next.js 14` のようにバージョンを指定することで、そのバージョンに合致したドキュメントを取得可能。
* **コード例の提供**: ドキュメントだけでなく、実際に動作するコードスニペットを提供し、実装を加速させる。
* **MCP準拠**: Model Context Protocolに対応しており、Cursor, Claude Desktop, Claude Code, Opencodeなど様々なクライアントから標準的な方法で利用可能。
* **エンタープライズ認証拡張**: Enterprise-Managed Authorization拡張機能を通じ、OktaなどのエンタープライズIdPを介したセキュアな認証に対応。
* **ライブラリID解決**: 曖昧なライブラリ名から、正確なドキュメントソース（ライブラリID）を特定する機能。
* **セキュアなサインインプロンプト**: MCPフォーム要求を活用し、モデル経由ではなく安全にユーザーのサインインや認証設定を促す。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: クラウド完結型サーバーレスAPI + MCPサーバーのハイブリッド構成
* **主要コンポーネントとデータフロー**:
  * クライアント（Cursor、Claude Code等）内で動作するMCPサーバーが、ユーザーのプロンプトに基づいて必要なドキュメントの検索クエリをUpstashのクラウド基盤に送信する。
  * Upstashのサーバーレスインフラが公開されたライブラリドキュメントサイトやGitHubリポジトリから最新の情報をリアルタイムに取得・整形し、クライアントに返却する。
  * 認証情報はXDG Base Directory仕様に準拠したセキュアなローカル環境で管理される。
* **システム構成図**:
  ```mermaid
  flowchart LR
      Client["MCPクライアント<br>(Cursor, Claude Code等)"] <-->|JSON-RPC| MCP["Context7<br>MCPサーバー (ローカル)"]
      MCP <-->|HTTPS API| Upstash["Context7 API<br>(Upstashクラウド)"]
      Upstash <-->|スクレイピング/API| Docs["公式ドキュメント<br>GitHubリポジトリ"]

      subgraph Local [ローカル環境]
          Client
          MCP
      end

      subgraph Cloud [クラウド環境]
          Upstash
          Docs
      end
  ```
* **特筆すべき要素技術**:
  * **Model Context Protocol (MCP)**: AIエージェントと外部ツールの統合を標準化。
  * **XDG Base Directory準拠**: 設定やクレデンシャルを標準的な安全な場所に保存。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * Node.js環境
  * MCP対応クライアント（Cursorなど）
  * Context7 APIキー（推奨、無料プランあり）
* **インストール/導入**:
  Cursorの設定ファイル (`~/.cursor/mcp.json` またはプロジェクトごとの `.cursor/mcp.json`) に以下を追加：

  ```json
  {
    "mcpServers": {
      "context7": {
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
      }
    }
  }
  ```

* **初期設定**:
  * [Context7 Dashboard](https://context7.com/dashboard) でAPIキーを取得する。
  * 設定ファイルや認証情報はXDG Base Directory仕様（例: `~/.config/context7`）に保存される。WindowsのGit Bashによるパス破損への自動対策機能も備わっている。
* **クイックスタート**:
  MCPクライアント（例：Cursorのチャット）で以下のように入力する：
  > Create a Next.js middleware that checks for a valid JWT. use context7

## **6. 特徴・強み (Pros)**

* **情報の正確性**: トレーニングデータではなく、公式サイトから直接取得した情報に基づいているため、ハルシネーションが極めて少ない。
* **シームレスな統合**: プロンプト内で `use context7` と指示するだけで自動的にドキュメントが検索・適用されるため、ワークフローを阻害しない。
* **開発元への信頼**: Redis/Kafkaのサーバーレスサービスで実績のあるUpstash社が開発・運営しており、安定性とセキュリティへの配慮が期待できる。
* **広範な言語対応**: 日本語を含む多言語のドキュメントに対応している（ドキュメントバッジより確認）。

## **7. 弱み・注意点 (Cons)**

* **外部サービスへの依存**: Context7のサーバー経由でドキュメントを取得するため、オフライン環境では利用できない。また、サービス側の障害の影響を受ける。
* **プライベートリポジトリの制限**: プライベートリポジトリのドキュメント解析はProプラン以上が必要で、追加コストがかかる。
* **LLMへのコンテキスト負荷**: 大量のドキュメントを読み込むと、LLMのコンテキストウィンドウを消費し、トークンコストが増加する可能性がある。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Free** | 無料 | 月1,000回APIコール、パブリックリポジトリのみ、OAuth 2.0対応 |
| **Pro** | $10/シート/月 | 月5,000回APIコール/シート、プライベートリポジトリ対応（別途パース費用）、チームコラボレーション |
| **Enterprise** | カスタム | SOC-2準拠、SSO、セルフホスト対応、カスタム制限 |

* **課金体系**: シート単位の月額課金 + 超過分およびプライベートリポジトリパースの従量課金。
* **プライベートリポジトリパース**: $15 / 1M tokens。

## **9. 導入実績・事例**

* **導入企業**: Upstash社のプロジェクトであり、同社のエコシステム内で利用されているほか、多くの個人開発者に利用されている。
* **メディア掲載**: Better Stack, 各種AI系YouTuber (Cole Medin, Income Stream Surfersなど) に取り上げられ、高い評価を得ている。
* **GitHubスター**: リポジトリ公開から短期間で43,000スター以上を獲得しており（2026年1月時点）、開発者コミュニティからの注目度が非常に高い。

## **10. サポート体制**

* **ドキュメント**: 公式ドキュメントおよびGitHubのREADMEが充実している。各MCPクライアントごとのセットアップガイドも提供。
* **コミュニティ**: Discordコミュニティがあり、ユーザー間の交流やサポートが行われている。
* **公式サポート**: Proプラン以上でEmailサポート、Enterpriseプランで専任サポートが提供される。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: MCPサーバーとして動作するため、JSON-RPC経由でクライアントと通信する。
* **外部サービス連携**: パブリックな各種ライブラリのドキュメントサイト、GitHubリポジトリと連携して情報を取得する。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Cursor** | ◎ | 公式に推奨されており、設定も容易。 | 特になし。 |
| **Claude Code** | ◎ | CLIツールとの相性が良く、自然言語でドキュメントを引ける。 | 特になし。 |
| **Opencode** | ◯ | 設定により利用可能。 | ユーザー数がまだ少ない。 |

## **12. セキュリティとコンプライアンス**

* **認証**: APIキーによる認証。Proプラン以上でOAuth 2.0対応。EnterpriseでSSO (SAML/OIDC) およびOkta等のIdPを介したEnterprise-Managed Auth対応。
* **データ管理**: ユーザーのコードや会話履歴全体は送信されず、ドキュメント検索クエリ（例: "how to use useState"）のみが送信される。注入攻撃検知用のLLMチェックや、IPの安全な抽出（内部IPやループバックアドレスの除外）も実施。
* **準拠規格**: Upstash社としてSOC 2に準拠（Enterpriseプランで明記）。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: ユーザーはチャットで `use context7` と打つか、自動適用ルールを設定するだけでよく、非常に直感的。明示的な操作画面を持たないため、学習コストは低い。
* **学習コスト**: MCPの概念を理解していれば導入は簡単。特定のライブラリを指定する場合のID記法（`/vercel/next.js`など）を覚える程度。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **ルールの設定**: "Always use Context7 MCP when I need library/API documentation..." のようなルールをMCPクライアントに設定し、手動入力を省略する。
  * **バージョン明記**: "Next.js 14 middleware" のようにバージョンを明記して、より正確な情報を引き出す。
* **陥りやすい罠 (Antipatterns)**:
  * **汎用的な質問**: "Pythonの書き方"のような一般的すぎる質問に使うと、効果が薄い（LLMの事前知識で十分なため）。
  * **APIキーなしでの利用**: レート制限にかかりやすいため、無料でもAPIキーを取得して設定することを推奨。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: G2, Capterra, ITreview
* **総合評価**: 該当なし
* **ポジティブな評価**:
  * (G2、Capterra、ITreviewにレビューの登録なし。GitHubやSNS等で評価を確認。)
  * 「Cursorが10倍賢くなった」
  * 「ドキュメントを探してコピペする手間が完全になくなった」
  * 「ハルシネーションがなくなり、コードが一発で動くようになった」
* **ネガティブな評価 / 改善要望**:
  * 「たまにサーバーが混雑しているのかレスポンスが遅い時がある」
  * 「対応していないマイナーなライブラリがまだある」
* **特徴的なユースケース**:
  * 最新のフロントエンドフレームワークやアップデートの激しいライブラリを利用するプロジェクトでのコーディングアシスト。

## **16. 直近半年のアップデート情報**

* **2026-07-06**: ctx7@0.5.4 ほかリリース。クエリごとの概念を単一にするようプロンプトを明確化し、浅い検索結果を防ぐ改善を実施。
* **2026-07-06**: @upstash/context7-mcp@3.2.3 リリース。IP抽出時に内部IPやループバックをスキップし、X-Forwarded-ForからのIP取得を安全化。
* **2026-06-22**: @upstash/context7-mcp@3.2.2 リリース。Enterprise-Managed Auth (id-jag) アクセストークンの検証に対応し、Okta等のIdP連携が可能に。
* **2026-06-17**: ctx7@0.5.3 リリース。スキルダウンロード失敗時のGitHub APIエラー詳細をCLIで表示するように改善。
* **2026-06-11**: ctx7@0.5.2 リリース。Windows上のGit BashによるライブラリIDのパス破損対策や、設定ファイルのXDG Base Directory（~/.config/context7等）への移行。
* **2026-06-11**: @upstash/context7-mcp@3.2.0 リリース。サインインプロンプトをテキストインジェクションからMCPのフォームエクスリシテーション（Elicitation）へ変更し、より安全なフローを提供。
* **2026-03-16**: ctx7@0.3.6 リリース。Token refresh supportなどの追加。
* **2026-03-11**: ctx7@0.3.5 リリース。Track install count eventsなどの機能改善。
* **2026-03-11**: ctx7@0.3.4 リリース。Popularity display in searchの追加。

(出典: [GitHub Releases](https://github.com/upstash/context7/releases))

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Context7 | Cursor | Claude Code | Perplexity |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | 情報更新手段 | ◎<br><small>MCP経由で即時取得</small> | ◯<br><small>@Docsで手動登録/Index</small> | ◯<br><small>Agentic search</small> | ◯<br><small>Web検索</small> |
| **カテゴリ特定** | リアルタイムドキュメント | ◎<br><small>コード例と最新仕様を動的取得</small> | △<br><small>事前Indexに依存</small> | △<br><small>検索頼み、固定ソースなし</small> | △<br><small>記事重視</small> |
| **エンタープライズ** | SSO/IdP連携 | ◎<br><small>Enterprise-Managed Auth (Okta等)</small> | ◯<br><small>SAML/OIDC (Teams以上)</small> | ◯<br><small>SSO (Enterprise)</small> | ◯<br><small>SSO (Enterprise)</small> |
| **非機能要件** | MCPサーバー機能 | ◎<br><small>提供元</small> | ◯<br><small>MCPクライアントとして利用可</small> | ◎<br><small>MCPクライアントとして利用可</small> | ×<br><small>非対応</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Context7** | MCPサーバーとしてドキュメントを供給 | CursorやClaude Codeなどと連携し、自動的かつピンポイントに最新情報を取得。IdP認証やセキュアな設定管理を備える。 | 外部APIへの依存。単体ではエディタとして機能しない。 | CursorやClaude CodeなどのMCP対応エディタをメインに使っており、常に最新のフレームワーク仕様を参照したい場合。 |
| **Cursor** | AIネイティブなコードエディタ | 非常に優れたUX、マルチファイル編集、Cursor Docsによる独自のドキュメント管理。 | ドキュメント追加が手動になりがちで最新化に手間がかかる。 | エディタ全体のAI化を求めており、手動のドキュメント管理でも十分な場合（Context7との併用が最適）。 |
| **Claude Code** | ターミナル/IDEで動作する自律エージェント | Claude 4.5を搭載し、深いコード理解と自律実行が可能。 | リアルタイムな外部仕様ドキュメントのピンポイント取得は専用ツールに一歩譲る。 | CLI中心の開発ワークフローで、自律的なエージェント機能を使いたい場合（Context7と併用可能）。 |
| **Perplexity** | AI検索エンジン | 幅広い情報を網羅的に検索できる。 | コーディングに特化しておらず、エディタとの深い統合がない。 | 開発中の一般的な技術選定調査や、概念的なエラー解決策を探す場合。 |

## **18. 総評**

* **総合的な評価**:
  Context7は、AIコーディングアシスタントの最大の弱点である「情報の陳腐化」を、MCPという標準技術を用いて鮮やかに解決している。特にCursorユーザーにとっては、導入するだけでAIの回答精度が劇的に向上するため、必須のツールと言える。
* **推奨されるチームやプロジェクト**:
  * Next.js, Tailwind CSS, Supabaseなど、アップデートが頻繁で仕様変更が多いモダンな技術スタックを採用しているチーム。
  * 新しいライブラリを積極的に導入するスタートアップ。
* **選択時のポイント**:
  * 開発効率を重視し、ドキュメント参照の手間を削減したい場合は迷わず導入すべき。
  * 完全なオフライン環境や、極めて厳しいセキュリティ要件（外部通信一切禁止）がある場合は、ローカルRAGなどの代替手段を検討する必要がある。
