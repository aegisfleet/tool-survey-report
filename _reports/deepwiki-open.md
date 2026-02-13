---
# === フロントマター ===
# 【必須項目】
title: "DeepWiki-Open 調査レポート"
tool_name: "DeepWiki-Open"
tool_reading: "ディープウィキ オープン"
category: "ドキュメント/ナレッジ"
developer: "AsyncFuncAI"
official_site: "https://github.com/AsyncFuncAI/deepwiki-open"
date: "2026-02-11"
last_updated: "2026-02-11"
tags:
  - "AI"
  - "オープンソース"
  - "ドキュメント生成"
  - "開発者ツール"
  - "セルフホスト"
description: "GitHub/GitLab/Bitbucketリポジトリ向けのOSSドキュメント自動生成ツール。現在はメンテナンスモード。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "テックリード"
    - "OSSコントリビューター"
  latest_highlight: "開発リソースをAsyncReviewへ移行し、本プロジェクトはメンテナンスモードへ"
  update_frequency: "低"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 74
  base_score: 70
  plus_points:
    - point: 8
      reason: "完全なオープンソースでセルフホスト可能、データのプライバシーが確保できる"
    - point: 5
      reason: "Google, OpenAI, Azure, Ollamaなど多様なLLMプロバイダーに対応"
    - point: 3
      reason: "RAGやDeepResearchなどの高度なコード分析機能を搭載"
  minus_points:
    - point: -5
      reason: "主要な開発が終了し、メンテナンスモードに移行している（将来性の懸念）"
    - point: -3
      reason: "DockerやAPIキーの管理など、導入・運用の技術的ハードルが高い"
    - point: -2
      reason: "公式リリースがなく、安定版の特定が難しい"
    - point: -2
      reason: "ドキュメントの質が元のコードに依存する"
  summary: "強力なOSSツールだが、開発が縮小傾向にあるため、長期利用には注意が必要。"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/AsyncFuncAI/deepwiki-open"
  deepwiki: "https://deepwiki.com/AsyncFuncAI/deepwiki-open"
  documentation: "https://asyncfunc.mintlify.app/"
relationships:
  related_tools:
    - "DeepWiki"
    - "Code Wiki"
---

# **DeepWiki-Open 調査レポート**

## **1. 基本情報**

* **ツール名**: DeepWiki-Open
* **ツールの読み方**: ディープウィキ オープン
* **開発元**: AsyncFuncAI
* **公式サイト**: [https://github.com/AsyncFuncAI/deepwiki-open](https://github.com/AsyncFuncAI/deepwiki-open)
* **関連リンク**:
  * GitHub: [https://github.com/AsyncFuncAI/deepwiki-open](https://github.com/AsyncFuncAI/deepwiki-open)
  * DeepWiki: [https://deepwiki.com/AsyncFuncAI/deepwiki-open](https://deepwiki.com/AsyncFuncAI/deepwiki-open)
  * ドキュメント: [https://asyncfunc.mintlify.app/](https://asyncfunc.mintlify.app/)
* **カテゴリ**: ドキュメント/ナレッジ
* **概要**: GitHub/GitLab/Bitbucketリポジトリのコードを解析し、Wiki形式のドキュメント、アーキテクチャ図、Q&A機能を自動生成するオープンソースツール。現在はメンテナンスモードに移行しており、主要な開発リソースは後継プロジェクトの「AsyncReview」に移っている。

## **2. 目的と主な利用シーン**

* **解決する課題**: コードベースの理解にかかるコストの削減と、ドキュメント作成・保守の自動化。
* **想定利用者**: プライバシーを重視する開発チーム, OSSプロジェクトのメンテナー, レガシーコードを解析する必要があるエンジニア
* **利用シーン**:
  * 社内規定で外部SaaSを利用できない環境でのドキュメント生成
  * 新規参画メンバーへのコードベースの構造説明
  * 複雑な依存関係を持つプロジェクトの可視化

## **3. 主要機能**

* **AIドキュメント生成**: リポジトリの構造を解析し、Wikiページを自動生成。Google Gemini, OpenAI, Azure, Ollamaなど複数のLLMプロバイダーを選択可能。
* **DeepResearch**: 複雑な問いに対してAIが複数回の調査を行い、詳細なレポートを作成する自律型リサーチ機能。
* **Ask機能 (RAG)**: リポジトリの内容についてチャット形式で質問し、関連コードに基づいた回答を得ることができる。
* **アーキテクチャ図の自動生成**: Mermaid.jsを用いて、クラス図やシーケンス図などの視覚的なダイアグラムを自動作成。
* **プライベートリポジトリ対応**: パーソナルアクセストークン（PAT）を使用し、GitHub/GitLab/Bitbucketのプライベートリポジトリも解析可能。
* **認可モード (Authorization Mode)**: Wiki生成機能へのアクセスを特定のコード（パスワード）で制限する機能。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Docker および Docker Compose
  * 各種LLMプロバイダーのAPIキー（Google AI Studio, OpenAI, Azure等）または Ollama（ローカルLLM用）
* **インストール/導入**:
  ```bash
  git clone https://github.com/AsyncFuncAI/deepwiki-open.git
  cd deepwiki-open
  ```
* **初期設定**:
  `.env`ファイルを作成し、必要なAPIキーを設定する。
  ```bash
  echo "GOOGLE_API_KEY=your_key" > .env
  # 必要に応じて他のキーも追加
  ```
* **クイックスタート**:
  ```bash
  docker-compose up
  # http://localhost:3000 にアクセスし、リポジトリURLを入力
  ```

## **5. 特徴・強み (Pros)**

* **完全なデータコントロール**: セルフホスト型であるため、ソースコードやドキュメントが外部のサーバーに保存される心配がなく、セキュリティポリシーの厳しい組織でも導入しやすい。
* **コスト効率**: ソフトウェア自体は無料で、LLMのAPI利用料のみで運用可能。Ollamaを使えば完全に無料で動作させることもできる。
* **柔軟なモデル選択**: プロジェクトの予算や精度要件に合わせて、安価なモデル（Gemini Flashなど）から高性能モデル（GPT-4oなど）まで自由に切り替えられる。

## **6. 弱み・注意点 (Cons)**

* **開発体制の縮小**: 開発者が「AsyncReview」に注力することを発表しており、本ツールはメンテナンスモードとなっているため、新機能の追加は期待しにくい。
* **セットアップの手間**: 商用SaaS（DeepWikiなど）と異なり、サーバーの構築、Dockerの管理、APIキーの取得など、ユーザー自身で行うべき作業が多い。
* **インフラリソース**: 特にローカルLLM（Ollama）を利用する場合、十分なVRAMを持つGPUなど、ハイスペックなマシンが必要になる。

## **7. 料金プラン**

オープンソースソフトウェア（MITライセンス）のため、ライセンス料は無料。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **Community Edition** | 無料 | すべての機能を無制限に利用可能（セルフホスト）。 |

* **課金体系**: ソフトウェアは無料。利用するLLMプロバイダー（OpenAI, Google等）へのAPI利用料が発生する。
* **無料トライアル**: なし（OSSのため即時利用可能）。

## **8. 導入実績・事例**

* **導入企業**: オープンソースプロジェクトのため、特定の企業名は公開されていない。
* **導入事例**: GitHubのStar数が14.2k（2026年2月時点）を超えており、個人開発者や研究目的での利用が広がっている。
* **対象業界**: ソフトウェア開発、特にセキュリティ要件の高い金融・医療分野でのセルフホスト需要。

## **9. サポート体制**

* **ドキュメント**: [Mintlify上の公式ドキュメント](https://asyncfunc.mintlify.app/)およびGitHubのREADMEに詳細なセットアップ手順がある。
* **コミュニティ**: [公式Discordサーバー](https://discord.gg/gMwThUMeme)があり、ユーザー間の助け合いが行われている。
* **公式サポート**: 商用サポートは提供されていない。GitHub Issuesでのバグ報告は受け付けているが、対応はコミュニティベースとなる。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: FastAPIベースのバックエンドAPIがあり、ドキュメント生成やRAG機能をプログラムから呼び出すことが可能。
* **外部サービス連携**:
  * **ソースコード管理**: GitHub, GitLab, Bitbucket
  * **LLMプロバイダー**: Google Gemini, OpenAI, Azure OpenAI, OpenRouter, Ollama

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | バックエンドがPython製であり、カスタマイズが容易。 | 特になし |
| **Docker** | ◎ | 公式で推奨されるデプロイ方法。 | Docker環境の知識が必須。 |
| **Next.js** | ◯ | フロントエンドのコードベースとして採用されている。 | カスタマイズにはReact/Next.jsの知識が必要。 |

## **11. セキュリティとコンプライアンス**

* **認証**: 「Authorization Mode」により、Wiki生成機能に簡易的なパスワード制限をかけることが可能。SSOなどの高度な認証は非搭載。
* **データ管理**: データはすべてセルフホスト環境（ローカルまたは自社サーバー）に保存される。外部への送信はLLM API利用時のみ（Ollama利用時は完全ローカル）。
* **準拠規格**: 特定の認証は取得していないが、セルフホストにより組織のコンプライアンス要件に合わせやすい。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: シンプルなWebインターフェース。リポジトリURLを入力するだけでWikiが生成され、左サイドバーでページ遷移が可能。チャットUIも直感的。
* **学習コスト**: 導入（セットアップ）のコストは高いが、一度構築してしまえば利用者の学習コストは非常に低い。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Ollamaとの併用**: 機密性の高いプロジェクトでは、Ollamaとローカルモデル（Llama 3など）を使用して、データ流出リスクを完全に排除する。
  * **Gemini Flashの活用**: コストを抑えつつ高速に生成したい場合、Google Gemini Flashモデルを選択する（無料枠や低価格設定が魅力）。
* **陥りやすい罠 (Antipatterns)**:
  * **巨大リポジトリの一括生成**: 非常に大きなリポジトリを一度に解析しようとすると、APIレート制限やメモリ不足に陥る可能性がある。
  * **メンテナンスモードの無視**: バグ修正や新機能追加が期待できないため、長期的な基幹システムとしての採用は慎重に行う。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub, X (Twitter)
* **総合評価**: G2等のレビューサイトには登録なし。GitHubでのStar数は14kを超え、高い注目度を誇る。
* **ポジティブな評価**:
  * 「商用のDeepWikiと同等の機能を、自分のサーバーで無料で使えるのが素晴らしい。」
  * 「Dockerで立ち上げるだけで、複雑なコードの解説が生成されるのは魔法のよう。」
* **ネガティブな評価 / 改善要望**:
  * 「セットアップで躓くことが多い。特にAPIキー周りのエラーが分かりにくい。」
  * 「開発がAsyncReviewに移ってしまったのが残念。」
* **特徴的なユースケース**:
  * 予算の限られたスタートアップでの内部ドキュメント基盤。
  * オフライン環境（エアギャップ環境）での開発補助ツールとしての利用（Ollama利用時）。

## **15. 直近半年のアップデート情報**

GitHubのコミット履歴およびREADMEより抽出。

* **2026-02-11**: プロジェクトのステータスを「メンテナンスモード」に変更し、AsyncReviewへの移行を発表。
* **2026-01-08**: APIのインストール手順とプロジェクト構造のドキュメントを修正。
* **2025-12-20**: Amazon Bedrockのサポートを拡充。
* **2025-12-18**: エンベディングプロバイダーとしてAmazon Bedrockを追加。
* **2025-12-05**: データベース接続エラー時の診断機能を改善。

(出典: [GitHub Repository](https://github.com/AsyncFuncAI/deepwiki-open))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (DeepWiki-Open) | DeepWiki (SaaS) | Mintlify |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | Wiki自動生成 | ◎<br><small>詳細な生成が可能</small> | ◎<br><small>Devin連携が強力</small> | △<br><small>手動作成がメイン</small> |
| **提供形態** | セルフホスト | ◎<br><small>Docker対応</small> | ×<br><small>SaaSのみ</small> | ×<br><small>SaaSのみ</small> |
| **コスト** | 無料利用 | ◎<br><small>完全無料(API別)</small> | ◯<br><small>閲覧は無料</small> | ◯<br><small>無料プランあり</small> |
| **拡張性** | モデル選択 | ◎<br><small>多数のプロバイダー対応</small> | -<br><small>非公開</small> | -<br><small>非公開</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **DeepWiki-Open** | OSSのドキュメント生成ツール | セルフホスト可能でカスタマイズ性が高い。ランニングコストを抑えられる。 | メンテナンスモードであり、セットアップが複雑。 | コスト重視、またはデータを外部に出せない環境。 |
| **DeepWiki (SaaS)** | Devin開発元の公式ツール | セットアップ不要で即座に利用可能。Devinとの連携が強力で品質が高い。 | プライベートリポジトリの利用にはコストがかかる可能性が高い。 | 手間をかけずに高品質なドキュメント生成を行いたい場合。 |
| **Mintlify** | 開発者向けドキュメントプラットフォーム | デザインが美しく、VS Code拡張機能との連携でメンテナンスしやすい。 | AIによる全自動生成機能は限定的（補佐的な役割）。 | 公開用の高品質なAPIドキュメントやマニュアルを作りたい場合。 |

## **17. 総評**

* **総合的な評価**:
  DeepWiki-Openは、商用ツールに匹敵する機能を備えた、非常に野心的なオープンソースプロジェクトである。RAGやDeepResearchなどの先進的な機能を備え、セルフホスト需要に見事に応えている。しかし、開発主体が別プロジェクトへ移行したため、今後の機能拡張やサポートは期待薄となった。
* **推奨されるチームやプロジェクト**:
  * **セキュリティ要件が厳しい組織**: 金融・医療など、SaaS利用が制限される環境。
  * **技術力のあるチーム**: DockerやAPIの設定を自力で解決でき、必要であればコードを修正できるチーム。
* **選択時のポイント**:
  * **将来性**: 長期的な安定利用を求めるなら、メンテナンスが継続されている他ツールや商用版（DeepWiki）を検討すべき。
  * **コスト**: 初期構築の手間を許容できるなら、圧倒的なコストパフォーマンスを発揮する。
