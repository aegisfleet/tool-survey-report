# 調査レポートサイト

ツールの調査レポートを自動公開するJekyllサイトです。

## 概要

このプロジェクトは、調査レポートを効率的に公開・共有するためのJekyll静的サイトジェネレーターベースのWebサイトです。レポートをMarkdown形式で作成し、自動的にWebサイトとして公開できます。

## 主な機能

- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **SEO最適化**: メタタグ、構造化データ、サイトマップ自動生成
- **レポート管理**: コレクション機能によるレポートの整理
- **タグ機能**: カテゴリー別のレポート分類
- **検索機能**: レポートの検索とフィルタリング
- **ナビゲーション**: レポート間の移動、関連レポート表示
- **多言語対応**: 日本語・英語コンテンツサポート

## プロジェクト構成

```
.
├── _config.yml          # Jekyll設定ファイル
├── _layouts/            # レイアウトテンプレート
│   ├── default.html     # ベースレイアウト
│   └── report.html      # レポート専用レイアウト
├── _includes/           # 再利用可能なコンポーネント
│   ├── header.html      # ヘッダー
│   ├── footer.html      # フッター
│   └── navigation.html  # ナビゲーション
├── _reports/            # レポートファイル（Markdownコレクション）
├── assets/              # CSS、JavaScript、画像ファイル
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

   ```
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
touch _reports/sample-report.md
```

### 2. フロントマターの設定

ファイルの先頭にYAMLフロントマターを追加：

```yaml
---
title: "サンプルレポート"
date: 2024-01-15
author: "調査チーム"
tags: ["技術調査", "ツール評価"]
description: "このレポートの概要説明"
---
```

### 3. コンテンツの記述

フロントマターの後にMarkdown形式でコンテンツを記述：

```markdown
## 概要

レポートの内容をここに記述します。

## 調査結果

- 項目1
- 項目2
- 項目3

## まとめ

調査結果のまとめを記述します。
```

## 動作確認方法

### 基本的な動作確認

1. **サイトの起動確認**

   ```bash
   bundle exec jekyll serve
   ```

   エラーなく起動し、`http://localhost:4000` でアクセスできることを確認

2. **レポート表示確認**
   - ホームページ（`/`）でレポート一覧が表示される
   - 個別レポートページ（`/reports/レポート名/`）が正常に表示される
   - ナビゲーションが正常に動作する

3. **レスポンシブデザイン確認**
   - ブラウザの開発者ツールでモバイル表示を確認
   - 異なる画面サイズで適切に表示される

### トラブルシューティング

**よくある問題と解決方法：**

- **Bundlerエラー**: `bundle install` を再実行
- **ポート競合**: `bundle exec jekyll serve --port 4001` で別ポートを使用
- **キャッシュ問題**: `bundle exec jekyll clean` でキャッシュをクリア
- **依存関係エラー**: `bundle update` で依存関係を更新

## デプロイ

### GitHub Pages

1. GitHubリポジトリにプッシュ
2. Settings > Pages でソースブランチを設定
3. 自動的にビルド・デプロイされる

### その他のホスティング

`_site/` ディレクトリの内容を任意のWebサーバーにアップロード

## 貢献

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
