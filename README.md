# ポちのツール情報自動収集サイト

AIエージェントを用いてツールの情報を収集して公開するサイトです。

## 概要

このサイトは、**GoogleのJulesエージェント**が実施したツール調査レポートを効率的に公開・共有するためのプラットフォームです。各ツールの機能、特徴、使用方法を詳細に調査し、その結果をMarkdown形式のレポートとして作成・公開しています。これらのレポートは、ツールの内容把握と目的に応じた最適なツールの比較検討に役立てることを目的としています。Jekyll静的サイトジェネレーターを使用して自動的にWebサイトとして公開されます。

## 主な機能

- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **SEO最適化**: メタタグ、構造化データ、サイトマップ自動生成  
- **レポート管理**: Jekyllコレクション機能による体系的な整理
- **タグ機能**: カテゴリー別のレポート分類・フィルタリング
- **検索機能**: レポート内容の全文検索
- **ナビゲーション**: 直感的なレポート間移動と関連レポート表示
- **アクセシビリティ**: WCAG準拠のアクセシブルなデザイン

## プロジェクト構成

```bash
.
├── _config.yml          # Jekyll設定ファイル
├── _layouts/            # レイアウトテンプレート
│   ├── default.html     # ベースレイアウト
│   ├── report.html      # レポート専用レイアウト
│   └── home.html        # ホームページレイアウト
├── _includes/           # 再利用可能なコンポーネント
│   ├── header.html      # ヘッダー
│   ├── footer.html      # フッター
│   └── navigation.html  # ナビゲーション
├── _reports/            # レポートファイル（Markdownコレクション）
├── _sass/               # Sassスタイルシート
├── assets/              # CSS、JavaScript、画像ファイル
├── reports/             # レポート一覧ページ
├── tags/                # タグ一覧ページ
├── Gemfile              # Ruby依存関係
└── README.md            # このファイル
```

## ローカル開発環境のセットアップ

### 前提条件

- Ruby 2.7以上
- Bundler gem
- Git

### インストール手順

1. **リポジトリのクローン**

   ```bash
   git clone <repository-url>
   cd tool-survey-report
   ```

2. **依存関係のインストール**

   ```bash
   bundle install
   ```

3. **ローカルサーバーの起動**

   ```bash
   bundle exec jekyll serve
   ```

4. **ブラウザでアクセス**

   ```text
   http://localhost:4000
   ```

### 開発用コマンド

- **開発サーバー起動（自動リロード付き）**

  ```bash
  bundle exec jekyll serve --livereload
  ```

- **ドラフトモードで起動**

  ```bash
  bundle exec jekyll serve --drafts
  ```

- **本番環境用ビルド**

  ```bash
  bundle exec jekyll build
  ```

- **設定変更を監視して起動**

  ```bash
  bundle exec jekyll serve --watch
  ```

## レポートの作成方法

### 1. 新しいレポートファイルの作成

`_reports/` ディレクトリに新しいMarkdownファイルを作成します：

```bash
touch _reports/tool-name.md
```

### 2. フロントマターの設定

ファイルの先頭にYAMLフロントマターを追加：

```yaml
---
title: "[ツール名] 調査レポート"
tool_name: "ツール名"
category: "カテゴリ名"
developer: "開発元企業名"
official_site: "公式サイトURL"
date: "YYYY-MM-DD"
tags:
  - "タグ1"
  - "タグ2"
  - "タグ3"
description: "ツールの概要を1-2行で簡潔に記述"
---
```

### 3. コンテンツの記述

フロントマターの後にMarkdown形式でレポート内容を記述：

```markdown
# ツール名 調査レポート

## 1. 基本情報
- ツール名: 
- 開発元: 
- 公式サイト: 
- カテゴリ: 

## 2. 概要
ツールの概要説明

## 3. 主要機能
- 機能1
- 機能2

## 4. 総評
調査結果のまとめ
```

## 動作確認方法

### 基本的な動作確認

1. **サイトの起動確認**

   ```bash
   bundle exec jekyll serve
   ```

   エラーなく起動し、`http://localhost:4000` でアクセスできることを確認

2. **機能確認**
   - ホームページでレポート一覧が表示される
   - 個別レポートページが正常に表示される
   - ナビゲーション・検索機能が動作する
   - タグフィルタリングが機能する

3. **レスポンシブデザイン確認**
   - ブラウザの開発者ツールでモバイル表示を確認
   - 異なる画面サイズで適切に表示される

### トラブルシューティング

**よくある問題と解決方法：**

- **Bundlerエラー**: `bundle install` を再実行
- **ポート競合**: `bundle exec jekyll serve --port 4001` で別ポートを使用
- **キャッシュ問題**: `bundle exec jekyll clean` でキャッシュをクリア
- **依存関係エラー**: `bundle update` で依存関係を更新

## 技術仕様

### 使用技術

- **Jekyll**: 静的サイトジェネレーター
- **Sass**: CSSプリプロセッサー
- **JavaScript**: インタラクティブ機能
- **Liquid**: テンプレートエンジン

### 主要プラグイン

- `jekyll-feed`: RSSフィード生成
- `jekyll-sitemap`: サイトマップ自動生成
- `jekyll-seo-tag`: SEOメタタグ自動生成

### ブラウザサポート

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## デプロイ

### GitHub Pages

1. GitHubリポジトリにプッシュ
2. Settings > Pages でソースブランチを設定
3. 自動的にビルド・デプロイされる

### その他のホスティング

`_site/` ディレクトリの内容を任意のWebサーバーにアップロード

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
