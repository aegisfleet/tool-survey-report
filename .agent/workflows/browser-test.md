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
python3 -c "
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:4000/tool-survey-report/'  # basepathを含める
OUTPUT = '/tmp/screenshot.png'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=OUTPUT)
    print(f'Title: {page.title()}')
    print(f'Screenshot saved: {OUTPUT}')
    browser.close()
"
```

### 2. 特定の要素を確認

要素セレクタを指定して存在確認・テキスト取得を行う:

```bash
// turbo
python3 -c "
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:4000/tool-survey-report/'
SELECTOR = 'h1'  # 確認する要素のセレクタ

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    element = page.query_selector(SELECTOR)
    if element:
        print(f'Found: {element.inner_text()}')
    else:
        print(f'Element not found: {SELECTOR}')
    browser.close()
"
```

### 3. クリック操作

```bash
python3 -c "
from playwright.sync_api import sync_playwright
import time
URL = 'http://127.0.0.1:4000/tool-survey-report/'
CLICK_SELECTOR = '#search-input'  # クリックする要素

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.click(CLICK_SELECTOR)
    time.sleep(1)  # アニメーション待ち
    page.screenshot(path='/tmp/after_click.png')
    browser.close()
"
```

### 4. フォーム入力

```bash
python3 -c "
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:4000/tool-survey-report/'
INPUT_SELECTOR = '#search-input'
INPUT_VALUE = '検索テキスト'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.fill(INPUT_SELECTOR, INPUT_VALUE)
    page.screenshot(path='/tmp/after_input.png')
    browser.close()
"
```

### 5. Jekyllサーバーの停止

テスト完了後、サーバーを停止:

```bash
// turbo
pkill -f "jekyll"
```

## 注意事項

- `headless=True` にするとGUIなしで実行（高速）
- `headless=False` にするとGUIあり（目視確認可能）
- スクリーンショットは `/tmp/` 以下に保存される
- アニメーションがある場合は `time.sleep()` で待機する
- URLは必ず basepath `/tool-survey-report/` を含める