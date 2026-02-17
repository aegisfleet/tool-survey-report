---
# === フロントマター ===
# 【必須項目】
title: "Biome 調査レポート"
tool_name: "Biome"
tool_reading: "バイオーム"
category: "開発者ツール"
developer: "Biome Developers"
official_site: "https://biomejs.dev/"
date: "2026-02-17"
last_updated: "2026-02-17"
tags:
  - "開発者ツール"
  - "コード品質"
  - "Formatter"
  - "Linter"
  - "Rust"
  - "Web開発"
  - "高速化"
description: "Prettier互換のフォーマッターと高機能なリンターを統合した、Rust製の高速なWeb開発向けツールチェーン。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "Webプロジェクト"
  latest_highlight: "2026年2月にv2.4をリリース。Playwright対応ルールの強化など。"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 10
      reason: "Rust製による圧倒的なパフォーマンス（Prettierの約25倍〜35倍）。"
    - point: 5
      reason: "フォーマッターとリンターが統合されており、セットアップが容易。"
    - point: 3
      reason: "Prettierと97%の互換性があり、移行がスムーズ。"
  minus_points:
    - point: -3
      reason: "ESLintに比べるとプラグインエコシステムがまだ発展途上。"
  summary: "パフォーマンスとDX（開発者体験）を最優先するプロジェクトに最適。ESLint/Prettierからの置き換え候補として有力。"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/biomejs/biome"
  documentation: "https://biomejs.dev/guides/getting-started/"
  # deepwiki: "" # GitHub URL is standard format so likely exists but not verified yet.
relationships:
  # parent: ""
  # children: []
  related_tools: [] # No reports for Prettier/ESLint exist yet.
---

# **Biome 調査レポート**

## **1. 基本情報**

* **ツール名**: Biome
* **ツールの読み方**: バイオーム
* **開発元**: Biome Developers (コミュニティ主導)
* **公式サイト**: [https://biomejs.dev/](https://biomejs.dev/)
* **関連リンク**:
  * GitHub: [https://github.com/biomejs/biome](https://github.com/biomejs/biome)
  * ドキュメント: [https://biomejs.dev/guides/getting-started/](https://biomejs.dev/guides/getting-started/)
* **カテゴリ**: 開発者ツール
* **概要**: Biomeは、Webプロジェクトの健全性を維持するための高速なツールチェーンです。Rustで構築されており、JavaScript, TypeScript, JSX, JSON, CSS, GraphQLのフォーマッターとリンターを単一のツールとして提供します。PrettierやESLintの代替として設計されており、圧倒的なパフォーマンスと設定の簡素さを特徴としています。

## **2. 目的と主な利用シーン**

* **解決する課題**: 既存のJS製ツール（Prettier, ESLint）のパフォーマンス問題（遅さ）や、複雑な設定管理の負担を軽減すること。CI/CDパイプラインの高速化。
* **想定利用者**: Webフロントエンド開発者、バックエンド開発者（Node.js）、フルスタックエンジニア。
* **利用シーン**:
  * 大規模なコードベースの高速なフォーマットとリント
  * CI/CDパイプラインでのコード品質チェックの高速化
  * 新規プロジェクトでの迅速なツールチェーンのセットアップ（設定ファイルがシンプル）
  * VS Codeなどのエディタでのリアルタイムなコード修正

## **3. 主要機能**

* **高速フォーマッター**: Prettierと97%の互換性を持ちながら、約35倍の速度で動作するフォーマッター。不完全なコード（シンタックスエラーがある状態）でもフォーマット可能。
* **高性能リンター**: 190以上のルールを内蔵し、ESLintやTypeScript ESLintからのルールも多数ポートされている。エラーメッセージが詳細で、修正方法も提示される。
* **import文の整理 (Organize Imports)**: import文のソートや不要なimportの削除を高速に行う機能。
* **CLI & LSP統合**: CLIだけでなく、LSP（Language Server Protocol）をネイティブサポートしており、VS Codeなどのエディタで快適に動作する。
* **統合コマンド**: `biome check` コマンド一つで、フォーマット、リント、import整理を一括で実行できる。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js環境（npm, yarn, pnpm, bunなど）
  * またはRust環境（cargo）
* **インストール/導入**:
  ```bash
  # npmの場合
  npm install --save-dev --save-exact @biomejs/biome
  ```
* **初期設定**:
  ```bash
  # 設定ファイル（biome.json）の生成
  npx @biomejs/biome init
  ```
* **クイックスタート**:
  ```bash
  # フォーマット、リント、import整理を一括実行
  npx @biomejs/biome check --write ./src
  ```

## **5. 特徴・強み (Pros)**

* **圧倒的な速度**: Rust製であるため、従来のJS製ツールと比較して桁違いに高速。大規模プロジェクトでのCI時間を大幅に短縮できる。
* **オールインワン**: フォーマッターとリンターが統合されており、ツールの依存関係や設定がシンプルになる。
* **Prettier互換**: Prettierとの互換性が高く、移行コストが低い。
* **詳細なエラーメッセージ**: エラーの原因と修正方法が具体的に示され、開発者体験（DX）が良い。

## **6. 弱み・注意点 (Cons)**

* **エコシステムの成熟度**: ESLintと比較すると、プラグインやカスタムルールのエコシステムはまだ発展途上。特定のフレームワーク特有のルールが不足している場合がある。
* **型チェック機能なし**: TypeScriptの型チェック機能は持っていないため、別途 `tsc` などが必要。
* **新しいツール**: 歴史が浅いため、枯れていない部分やドキュメントが不足している部分がある可能性。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---|---|---|
| **OSS** | 無料 | すべての機能を無料で利用可能（MIT / Apache 2.0 ライセンス）。 |

* **課金体系**: 完全無料のオープンソースソフトウェア。
* **企業向けサポート**: GitHub SponsorsやOpen Collectiveを通じたスポンサーシップ、およびEnterprise Supportプログラムがある。

## **8. 導入実績・事例**

* **導入企業**: AWS, Google, Microsoft, Discord, Vercel, Shopifyなど、世界的なテック企業で採用されている。
* **導入事例**: 大規模なモノレポでのCI時間短縮や、開発環境のレスポンス向上を目的に導入が進んでいる。
* **対象業界**: Web開発を行うあらゆる業界。

## **9. サポート体制**

* **ドキュメント**: 公式サイトに詳細なドキュメントがある（英語、日本語翻訳もあり）。
* **コミュニティ**: DiscordサーバーやGitHub Discussionsが活発。
* **公式サポート**: Enterprise向けの商用サポートプログラムが存在する。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: LSPを提供しており、VS Code, IntelliJ, Neovimなどの主要エディタと連携可能。
* **外部サービス連携**: GitHub ActionsなどのCIツールと容易に連携可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **JavaScript / TypeScript** | ◎ | ファーストクラスサポート。非常に高速。 | 特になし |
| **React / JSX** | ◎ | React向けの推奨ルールセットがあり、相性が良い。 | 特になし |
| **Vue / Svelte / Astro** | ◯ | v2.3以降で実験的サポートが追加され、v2.4でHTMLフォーマッタが刷新されるなど強化中。 | まだ発展途上の部分もあるため、検証が必要。 |
| **CSS / GraphQL** | ◯ | サポートされているが、JS/TSほど成熟していない可能性。 | 特になし |

## **11. セキュリティとコンプライアンス**

* **認証**: ツール自体に認証機能はない（ローカル/CIツール）。
* **データ管理**: コードはローカルまたはCI環境で処理され、外部サーバーに送信されることはない。
* **準拠規格**: MITおよびApache 2.0ライセンスで提供され、商用利用も安心。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CLIは直感的で、エラーメッセージも親切。設定ファイルもJSON形式でシンプル。
* **学習コスト**: PrettierやESLintの経験があれば、ほぼ学習コストなしで移行できる。設定項目も整理されている。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * ESLintとPrettierを完全に置き換えて、`biome check` コマンドに一本化する。
  * CIパイプラインに `biome ci` を組み込み、高速なチェックを実現する。
  * エディタの「保存時にフォーマット」機能にBiomeを設定する。
* **陥りやすい罠 (Antipatterns)**:
  * ESLintとBiomeを併用する場合、ルールが競合しないように注意が必要（基本的には移行が推奨される）。
  * 型チェック機能はないため、`tsc --noEmit` をCIから削除しないこと。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub, Reddit, X (Twitter)
* **総合評価**: 非常に高い。特に速度に対する評価が圧倒的。
* **ポジティブな評価**:
  * 「Prettierより25倍速いというのは伊達じゃない。CIが爆速になった。」
  * 「ESLintの設定地獄から解放された。設定がシンプルで素晴らしい。」
  * 「エラーメッセージが分かりやすく、どこを直せばいいかすぐわかる。」
* **ネガティブな評価 / 改善要望**:
  * 「まだESLintの全プラグインを代替できていない。特定のルールが足りない。」
  * 「VueやSvelteのサポートがまだ完全ではない（改善中）。」
  * 「新しいツールなので、長期的なメンテナンスが続くか不安（ただしスポンサーは増えている）。」

## **15. 直近半年のアップデート情報**

* **2026-02-16 (v2.4.2)**: パッチリリース。バグ修正。
* **2026-02-12 (v2.4.0)**: マイナーリリース。Playwright向けの新しいリンタールール (`noConditionalExpect`, `noPlaywrightElementHandle` 等) の追加。`useImportType` の改善など。
* **2026-01-29 (v2.3.15)**: パッチリリース。`noNestedPromises` ルールなどの追加。
* **2026-01-24 (v2.3.14)**: パッチリリース。バグ修正。
* **2026-01-13 (v2.3.11)**: パッチリリース。Vue関連のルール (`useVueValidTemplateRoot` 等) の追加。
* **2026-01-07 (v2.3.9)**: パッチリリース。`noScriptUrl`, `useAwaitThenable` 等のルール追加。
* **2025-11-25 (v2.3.0)**: マイナーリリース。`baseUrl` のサポート、`init` コマンドの強化、CSS Modules / Tailwind CSS 対応の強化など。

(出典: [GitHub Releases](https://github.com/biomejs/biome/releases), [CHANGELOG.md](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (Biome) | Prettier | ESLint |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | フォーマット | ◎<br><small>超高速</small> | ◯<br><small>標準的</small> | △<br><small>可能だが遅い</small> |
| **基本機能** | リント | ◯<br><small>主要ルール網羅</small> | × | ◎<br><small>最大のエコシステム</small> |
| **パフォーマンス** | 実行速度 | ◎<br><small>Rust製</small> | △<br><small>JS製</small> | △<br><small>JS製</small> |
| **言語対応** | CSS/HTML等 | ◯<br><small>対応</small> | ◎<br><small>広範に対応</small> | △<br><small>プラグインで対応</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Biome** | 高速なオールインワンツールチェーン | 圧倒的な速度、設定の簡素さ、フォーマッターとリンターの統合 | エコシステムの規模がESLintに劣る | パフォーマンスを重視し、標準的なルールセットで十分な場合 |
| **Prettier** | 業界標準のコードフォーマッター | 圧倒的な普及率、膨大な言語サポート、エディタ統合の豊富さ | リント機能はない、大規模プロジェクトでは遅くなる場合がある | 既に導入済みで不満がない場合、Biome未対応言語を使う場合 |
| **ESLint** | 最も強力なJavaScriptリンター | 巨大なプラグインエコシステム、カスタマイズ性の高さ | 設定が複雑になりがち、フォーマット機能はPrettierに譲る傾向、速度 | 独自の厳格なルールや特定のフレームワーク専用ルールが必須な場合 |

## **17. 総評**

* **総合的な評価**:
  Biomeは、Web開発におけるフォーマットとリントの体験を根本から変えるポテンシャルを持ったツールです。Rustによる圧倒的なパフォーマンスと、ゼロコンフィグを目指す簡便さは、開発者のストレスを大幅に軽減します。ESLintのすべてのルールをカバーしているわけではありませんが、主要なルールは網羅されており、多くのプロジェクトにとって現実的な代替手段となります。
* **推奨されるチームやプロジェクト**:
  * CI/CDの実行時間を短縮したいプロジェクト
  * 新規に立ち上げるWebプロジェクト
  * ESLint/Prettierの設定管理に疲弊しているチーム
  * 大規模なモノレポ構成のプロジェクト
* **選択時のポイント**:
  まずは既存のプロジェクトで試験的に導入し、必要なルールが不足していないかを確認することをお勧めします。Prettierとの互換性が高いため、フォーマッターとしての置き換えは容易です。リンターとしても十分機能しますが、特定のプラグインに強く依存している場合は、ESLintとの併用や段階的な移行を検討してください。
