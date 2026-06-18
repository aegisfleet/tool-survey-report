---
description: ブラウザでWebページを動作確認する
---

# ブラウザ動作確認ワークフロー

WSL環境やその他のヘッドレス環境では、Playwrightを使用したブラウザスクリプト `scripts/browser_test.py` を使用して動作確認を行います。

## 前提条件

### 1. 依存関係のインストール
Playwrightがインストールされていない場合は、以下のコマンドでインストールします。
```bash
pnpm dlx playwright install chromium
```

### 2. Jekyllサーバーの起動
テスト前に、検証用のJekyllサーバーを別ターミナルまたはバックグラウンドで起動します。
```bash
bundle exec jekyll serve --port 4000 --host 127.0.0.1
```
※ポートがすでに使われている場合は `--port 4001` のように別ポートを指定します。

### 3. 重要: URLのベースパスについて
このプロジェクトではbaseURLに `/tool-survey-report/` が設定されているため、ローカルでのアクセスURLは以下となります。
- **ホーム画面**: `http://127.0.0.1:4000/tool-survey-report/`

> [!WARNING]
> `http://127.0.0.1:4000/` では404エラーになるため、必ず末尾に `/tool-survey-report/` を付与してください。

---

## 実行時の重要ルール

> [!IMPORTANT]
> **1. PYTHONPATHの指定**
> `scripts/browser_test.py` を実行する際は、インポートエラーを防ぐため、必ず `PYTHONPATH=.` をプレフィックスとして指定するか、`-m` フラグを使用してください。
>
> **2. ローカルIP制限の回避 (--allow-internal-ips)**
> セキュリティのためのSSRF制限により、デフォルトではローカルIP（`127.0.0.1`等）へのアクセスがブロックされます。ローカルサーバーに対してテストを行う場合は、必ず **`--allow-internal-ips`** フラグを付与してください。

> [!TIP]
> **3. ブラウザのログとエラーの確認**
> テスト実行時、ブラウザのコンソールログ（`console`）や JavaScript の例外エラー（`pageerror`）が自動的にターミナルへ出力されます。画面が正しく表示されない場合のデバッグに活用してください。

---

## 使用方法（コマンド例）

### 1. ページを開いてスクリーンショットを取得
```bash
PYTHONPATH=. python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --allow-internal-ips --action screenshot --output "screenshot.png"
```

### 2. 特定の要素を確認（存在確認）
指定した要素がページ上に存在するかチェックします。
```bash
PYTHONPATH=. python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --allow-internal-ips --action check --selector ".hero-search"
```

### 3. ダークモードで確認
テーマ設定は `document.documentElement` (`<html>` 要素) の `data-theme="dark"` 属性に適用されます。`--dark-mode` オプションでダークモード状態でのスクリーンショットを取得できます。
```bash
PYTHONPATH=. python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --allow-internal-ips --dark-mode --action screenshot --output "dark_mode.png"
```

### 4. モバイル表示で確認
```bash
PYTHONPATH=. python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --allow-internal-ips --mobile --action screenshot --output "mobile.png"
```

### 5. クリック操作のシミュレーション
特定の要素をクリックした後の状態を確認します。
```bash
PYTHONPATH=. python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --allow-internal-ips --action click --selector ".search-chip:first-child" --output "after_click.png"
```

### 6. テキスト入力のシミュレーション
```bash
PYTHONPATH=. python3 scripts/browser_test.py --url "http://127.0.0.1:4000/tool-survey-report/" --allow-internal-ips --action input --selector "#hero-search-input" --input-text "Playwright" --output "after_input.png"
```

### 7. Jekyllサーバーの停止
テスト完了後、バックグラウンドのサーバーを停止します。
```bash
pkill -f "jekyll"
```

---

## 主なオプション一覧

- `--url`: ターゲットURL (必須)
- `--action`: 実行アクション (`screenshot` (default), `check`, `text`, `click`, `input`)
- `--selector`: ターゲット要素のCSSセレクタ
- `--output`: スクリーンショット保存パス
- `--input-text`: 入力テキスト (`input`アクション用)
- `--wait`: 待機時間 (秒)
- `--dark-mode`: ダークモードを有効化 (`<html>` と `<body>` の両方に `data-theme="dark"` を設定します)
- `--mobile`: モバイルビューポート (375x667) で実行
- `--full-page`: フルページスクリーンショットを撮影
- `--show-browser`: ブラウザGUIを表示 (デフォルトはヘッドレス)
- `--allow-internal-ips`: ローカルIP (127.0.0.1など) へのアクセスを許可 (ローカルテスト時に必須)