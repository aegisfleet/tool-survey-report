---
title: design.md 調査レポート
tool_name: design.md
tool_reading: デザインマークダウン
category: デザインツール
developer: Google Labs
official_site: https://github.com/google-labs-code/design.md
date: '2026-05-02'
last_updated: '2026-05-02'
tags:
  - オープンソース
  - コーディング支援
  - AI
  - エージェント
  - 開発者ツール
description: AIエージェントにデザインシステムを永続的かつ構造的に理解させるためのフォーマット仕様です。
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - デザイナー
    - AIエージェント
  latest_highlight: CLIによるlint、diff、exportに対応
  update_frequency: 中
evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: AIエージェントに特化した独自のアプローチを提供
    - point: 5
      reason: W3C Design Token Format互換の拡張性
  minus_points:
    - point: 0
      reason: 特になし
  summary: AI時代のコーディングエージェントに不可欠なデザインシステム共有フォーマットとして高い可能性を秘めている
links:
  github: https://github.com/google-labs-code/design.md
  deepwiki: https://deepwiki.com/google-labs-code/design.md
  codewiki: https://codewiki.google/github.com/google-labs-code/design.md
relationships:
  parent: Google Stitch
---

# **design.md 調査レポート**

## **1. 基本情報**

* **ツール名**: design.md
* **ツールの読み方**: デザインマークダウン
* **開発元**: Google Labs
* **公式サイト**: [https://github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md)
* **関連リンク**:
  * GitHub: [https://github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md)
* **カテゴリ**: デザインツール
* **概要**: AIコーディングエージェントに対してビジュアルアイデンティティやデザインシステムを記述・伝達するためのフォーマット仕様です。機械可読なデザイントークンと人間向けの設計理由を組み合わせて定義します。

## **2. 目的と主な利用シーン**

* **解決する課題**: AIエージェントにコードを生成させる際、プロジェクト固有のカラーパレット、タイポグラフィ、コンポーネント設計などのデザインシステムを正確に理解させることが難しい課題を解決します。
* **想定利用者**: フロントエンド開発者、UI/UXデザイナー、AIコーディングエージェントを活用する開発チーム
* **利用シーン**:
  * AIコーディングエージェント（Jules, Cursor, GitHub Copilotなど）を使用したUIコンポーネントの自動生成
  * チーム内でのデザインシステムの仕様共有と管理
  * デザインシステムに基づく静的解析（Linting）や変更検知（Diff）

## **3. 主要機能**

* **ハイブリッドフォーマット**: YAMLフロントマター（機械可読なデザイントークン）とMarkdown（人間可読な設計理由）を一つのファイルに統合して記述します。
* **CLIツール提供**: `@google/design.md`パッケージとしてCLIを提供し、lint、diff、exportなどの操作が可能です。
* **Linting機能**: トークン参照の解決エラー、WCAGコントラスト要件違反、セクション順序の違反などを自動検出します。
* **Diff機能**: 2つの`design.md`ファイル間でのトークンレベルの変更やリグレッションを検出します。
* **Export機能**: 定義されたトークンをTailwindのテーマ設定やDTCG（W3C Design Token Format）など他の形式へエクスポートできます。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js環境（CLIツール利用時）
* **インストール/導入**:

  ```bash
  # CLIツールのインストール
  npm install @google/design.md
  ```

* **初期設定**:
  プロジェクトのルートに `DESIGN.md` ファイルを作成し、YAMLフロントマターでトークンを定義します。

* **クイックスタート**:
  ```bash
  # 作成したDESIGN.mdをリントする
  npx @google/design.md lint DESIGN.md
  ```

## **5. 特徴・強み (Pros)**

* AIエージェントが理解しやすい構造化されたデータ（YAML）と、人間が理解しやすい文脈（Markdown）を両立させている点
* TailwindやW3C Design Token Formatなど、既存のエコシステムとの相互運用性が考慮されている点
* CLIツールにより、CI/CDパイプラインに組み込んでデザインシステムの品質（コントラスト比など）を自動検証できる点

## **6. 弱み・注意点 (Cons)**

* 現在はアルファ版（version: alpha）であり、仕様やCLIツールが今後変更される可能性がある点
* AIエージェント側がこのフォーマットを明示的にサポート・理解するようプロンプト等で誘導する必要がある点
* 日本語のドキュメントやサポートが現状では限られている点

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース** | 無料 | Apache-2.0ライセンスの下で全ての機能が利用可能 |

* **課金体系**: 完全無料（オープンソース）
* **無料トライアル**: 該当なし

## **8. 導入実績・事例**

* **導入企業**: Google社内のプロジェクトや、オープンソースコミュニティでの試験的な導入が進められています。
* **導入事例**: AIを用いたコード生成ツール（Google Stitch等）でのデザインプロンプト入力の標準化として活用されています。
* **対象業界**: ソフトウェア開発、特にAI駆動開発を推進している企業

## **9. サポート体制**

* **ドキュメント**: GitHubリポジトリ内の `docs/spec.md` に詳細な仕様が公開されています。
* **コミュニティ**: GitHub IssuesやDiscussionsを通じてコミュニティのフィードバックを受け付けています。
* **公式サポート**: オープンソースプロジェクトのため、公式なSLAを伴うサポートはありません。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Node.jsライブラリとしてProgrammatic API（`import { lint } from '@google/design.md/linter';`）が提供されています。
* **外部サービス連携**: Tailwind CSS（エクスポート対応）、W3C Design Tokens Community Group (DTCG) フォーマット対応

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Tailwind CSS** | ◎ | CLIからTailwindテーマとして直接エクスポート可能 | 特になし |
| **Node.js / npm** | ◎ | CLIツールやAPIがnpmパッケージとして提供されている | 特になし |
| **AIコーディングエージェント** | ◯ | 本ツールの主要なターゲット | エージェントによっては明示的にファイルを読み込ませる指示が必要 |
| **Figma / 既存デザインツール** | △ | DTCG経由での連携が想定されるが、直接的なプラグイン等は現状未提供 | 既存ツールからのエクスポートパイプラインの構築が必要 |

## **11. セキュリティとコンプライアンス**

* **認証**: オープンソースのフォーマット及びCLIツールであるため、独自の認証機能は持ちません。
* **データ管理**: データはローカルの `DESIGN.md` ファイルとして管理されます。
* **準拠規格**: アクセシビリティの観点で、CLIツールのlint機能がWCAG AA基準のコントラスト比チェック（4.5:1）をサポートしています。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CLIツールとして提供されており、JSON形式での出力にも対応しているため、他のスクリプトとの連携が容易です。
* **学習コスト**: YAMLとMarkdownの基礎知識があれば記述は容易です。独自のトークンスキーマ（colors, typography, spacing等）のルールを覚える必要がありますが、仕様はシンプルです。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * プロジェクトのルートに `DESIGN.md` を配置し、AIエージェントへのシステムプロンプト内で「デザインの実装時は必ずDESIGN.mdの仕様に従うこと」と指示する。
  * CIパイプラインに `npx @google/design.md lint` を組み込み、デザインの不整合やコントラスト比違反を自動検知する。
* **陥りやすい罠 (Antipatterns)**:
  * YAMLフロントマターで定義したトークン名と、Markdownの本文で説明しているトークン名に乖離が生じること。（Lintツールを活用して防ぐ）
  * AIエージェントにファイルを渡すだけで自動的に理解されると思い込むこと。（仕様を適切にパースできるエージェントであるか確認が必要）

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHubのスター数やX(Twitter)の技術者の反応
* **総合評価**: GitHubで10.9k以上のスターを獲得しており、非常に高い注目を集めています。
* **ポジティブな評価**:
  * AI時代に合わせた「機械と人間の両方に読みやすい」デザインシステムフォーマットというアプローチが斬新であると評価されています。
  * Lint機能によるWCAGコントラストチェックが実用的であるという声があります。
* **ネガティブな評価 / 改善要望**:
  * まだアルファ版であり、実稼働環境での大規模な適用には仕様の安定化を待つ必要があるとの見方があります。
* **特徴的なユースケース**:
  * LLMにフロントエンドコンポーネントを生成させる際の「幻覚（Hallucination）」を防ぎ、ブランドガイドラインに沿ったUIを安定して出力させるためのガードレールとしての活用。

## **15. 直近半年のアップデート情報**

* **2026-04-21**: `v0.1.0` リリース (初期リリース版パッケージング)

(出典: [GitHub Releases](https://github.com/google-labs-code/design.md/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | design.md | Tailwind CSS | W3C DTCG | Figma |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | デザインシステム定義 | ◯<br><small>Markdown+YAML</small> | ◯<br><small>JavaScript/JSON</small> | ◯<br><small>JSON</small> | ◎<br><small>GUIベース</small> |
| **カテゴリ特定** | AIエージェントへの最適化 | ◎<br><small>AI理解に特化</small> | △<br><small>設定が複雑になりがち</small> | △<br><small>人間には読みにくい</small> | ×<br><small>直接的には不可</small> |
| **エンタープライズ** | 静的解析・Linting | ◯<br><small>専用CLIあり</small> | △<br><small>プラグインが必要</small> | ◯<br><small>サードパーティツール</small> | ◯<br><small>プラグインで対応</small> |
| **非機能要件** | エクスポート機能 | ◯<br><small>Tailwind/DTCGへ出力</small> | -<br><small>-</small> | -<br><small>-</small> | ◯<br><small>プラグイン経由</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **design.md** | AIと人間の双方に向けたハイブリッドなデザイン仕様フォーマット。 | AIが文脈を理解しやすい。CI連携が容易。 | アルファ版であるため仕様変更の可能性がある。 | AIを活用したコード生成を多用するプロジェクト。 |
| **Tailwind CSS** | ユーティリティファーストのCSSフレームワーク。 | デファクトスタンダードでありエコシステムが巨大。 | 設定ファイル（tailwind.config.js）だけでは設計の「意図」を伝えにくい。 | 従来型のWeb開発や、すでにTailwindを採用している場合。 |
| **W3C DTCG** | デザイントークンの標準フォーマット。 | ツール間の互換性が高い。 | JSON形式のため人間が直接読み書きするには不向き。 | 大規模組織で複数のデザインツールやプラットフォームを跨ぐ場合。 |

## **17. 総評**

* **総合的な評価**:
  design.mdは、急速に普及するAIコーディングアシスタントに対して、プロジェクトのデザインシステムを正確に伝達するという新たな課題に対するGoogleからの強力な提案です。機械可読なYAMLと人間可読なMarkdownを組み合わせた手法は非常に理にかなっています。
* **推奨されるチームやプロジェクト**:
  AI駆動開発（Cursor, Windsurf, GitHub Copilotなど）を積極的に導入しており、生成されるUIのスタイル一貫性に課題を感じているフロントエンドチームに強く推奨されます。
* **選択時のポイント**:
  既存のデザインシステム（Figma等）からdesign.mdへの変換フローをどう構築するかが導入の鍵となります。まずは小規模なプロジェクトやプロトタイピングの段階から、Tailwindへのエクスポート機能と併用して導入を検討するのが良いでしょう。
