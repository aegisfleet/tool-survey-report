---
description: ブラウザでWebページを動作確認する
---

# ブラウザ動作確認ワークフロー

WSL環境ではAntigravityの`browser_subagent`が動作しないため、Playwrightを使用してブラウザ操作を行う。

## 前提条件

### Jekyllサーバーの起動

ブラウザテスト前に、Jekyllサーバーを起動する必要がある。

```bash
bundle exec jekyll server &
```

サーバー起動後、約3-5秒待機してからアクセスする。

### 重要: URLについて

このプロジェクトではbaseURLに `/tool-survey-report/` が設定されているため、ローカルでのアクセスURLは以下となる:

- **ホーム画面**: `http://127.0.0.1:4000/tool-survey-report/`

❌ `http://127.0.0.1:4000/` では404になるので注意。

## 使用方法

### 1. ページを開いてスクリーンショットを取得

```bash
// turbo
python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --action screenshot --output "/tmp/screenshot.png"
```

### 2. 特定の要素を確認

要素セレクタを指定して存在確認を行う:

```bash
// turbo
python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --action check --selector "h1"
```

### 3. ダークモードで確認

```bash
// turbo
python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --action screenshot --output "/tmp/dark_mode.png" --dark-mode
```

### 4. モバイル表示で確認

```bash
// turbo
python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --action screenshot --output "/tmp/mobile.png" --mobile
```

### 5. クリック操作

```bash
python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --action click --selector "#search-input" --output "/tmp/after_click.png"
```

### 6. フォーム入力

```bash
python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --action input --selector "#search-input" --input-text "検索テキスト" --output "/tmp/after_input.png"
```

### 7. Jekyllサーバーの停止

テスト完了後、サーバーを停止:

```bash
// turbo
pkill -f "jekyll"
```

## オプション一覧

- `--url`: ターゲットURL (必須)
- `--action`: 実行アクション (`screenshot` (default), `check`, `text`, `click`, `input`)
- `--selector`: ターゲット要素のCSSセレクタ
- `--output`: スクリーンショット保存パス
- `--input-text`: 入力テキスト (`input`アクション用)
- `--wait`: 待機時間 (秒)
- `--dark-mode`: ダークモードを有効化
- `--mobile`: モバイルビューポートで実行
- `--full-page`: フルページスクリーンショットを撮影
- `--show-browser`: ブラウザGUIを表示 (デフォルトはヘッドレス)