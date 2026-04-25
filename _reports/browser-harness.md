---
title: Browser Harness 調査レポート
tool_name: Browser Harness
tool_reading: ブラウザハーネス
category: AIエージェント / ブラウザ自動化
developer: Browser Use Team
official_site: https://browser-use.com/
date: '2026-04-25'
last_updated: '2026-04-25'
tags:
  - オープンソース
  - AIエージェント
  - ブラウザ操作
  - CDP
  - Python
description: LLMにブラウザを完全制御させる、自己修復機能を持つ軽量なCDPハーネス
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - AIエージェント開発者
    - 自動化エンジニア
  latest_highlight: AIエージェントが実行時に自ら関数を書き換える「自己修復機能」を実現
  update_frequency: 高
evaluation:
  score: 83
  base_score: 70
  plus_points:
    - point: 5
      reason: 実行時にAIが自ら機能を補完する自己修復パラダイムの新規性
    - point: 5
      reason: 592行のPythonのみで構成される極小な設計
    - point: 5
      reason: リモートブラウザ環境の提供（無料枠あり）
  minus_points:
    - point: -2
      reason: 新興ツールであり、コミュニティや実績が発展途上
  summary: 既存の抽象化レイヤーを排し、AIエージェントがブラウザと直接CDPで対話する新しいパラダイムを提示している
links:
  github: https://github.com/browser-use/browser-harness
  deepwiki: https://deepwiki.com/browser-use/browser-harness
relationships:
  related_tools:
    - Playwright
    - Selenium
---

# **Browser Harness 調査レポート**

## **1. 基本情報**

* **ツール名**: Browser Harness
* **ツールの読み方**: ブラウザハーネス
* **開発元**: Browser Use Team
* **公式サイト**: [https://browser-use.com/](https://browser-use.com/)
* **関連リンク**:
  * GitHub: [https://github.com/browser-use/browser-harness](https://github.com/browser-use/browser-harness)
  * DeepWiki: [https://deepwiki.com/browser-use/browser-harness](https://deepwiki.com/browser-use/browser-harness)
  * レビューサイト: (G2/Capterra等の情報なし)
* **カテゴリ**: AIエージェント / ブラウザ自動化
* **概要**: LLM（大規模言語モデル）にブラウザを完全制御させるために設計された、極めてシンプルで自己修復機能を持つChrome DevTools Protocol (CDP) ベースのオープンソースハーネス。

## **2. 目的と主な利用シーン**

* **解決する課題**: 既存のブラウザ操作自動化ツールやAIエージェント向けのラッパー（PlaywrightのMCP等）が、ブラウザの詳細な状態を隠蔽してしまうことによるAIの文脈喪失や、想定外のUI変更によるサイレントな失敗（クリックしたつもりが機能していない等）を解決する。
* **想定利用者**:
  * AIコーディングエージェント（Claude Code、Codex等）を利用する開発者
  * ブラウザ操作の自動化スクリプト・AIエージェント開発者
  * RPAエンジニア
* **利用シーン**:
  * AIエージェントによるGitHubリポジトリの操作・設定自動化
  * 複雑なWebフォームの入力やデータのスクレイピング
  * リモートブラウザでのヘッドレスな自動化やテスト
  * ゲームのプレイや絵を描くなどの高度なブラウザ操作（デモ用途）

## **3. 主要機能**

* **CDP直接通信**: 中間フレームワークを挟まず、WebSocketを介してChrome DevTools Protocol (CDP) と直接通信する。
* **自己修復機能（Self-Healing）**: 実行中に必要な機能（例：ファイルアップロード関数）が欠けていることにAIが気付くと、AI自身が`helpers.py`を書き換えて機能を実装し、タスクを継続する。
* **最小限の構成**: わずか約592行のPythonコード（`install.md`, `SKILL.md`, `run.py`, `helpers.py`, `admin.py`, `daemon.py`など）で構成される。
* **スキルシステム**: ドメイン固有の操作やフローを記憶する`domain-skills`ディレクトリを持ち、AIが発見した知見を自らファイル（スキル）として保存・再利用する。
* **リモートブラウザサポート**: クラウド上のブラウザ（cloud.browser-use.com）に接続可能。プロキシやCAPTCHA回避機能が組み込まれている。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Python環境
  * Google Chromeブラウザ
  * Claude CodeやCodexなどのLLMエージェント
* **インストール/導入**:
  Claude Code等に以下のプロンプトを直接渡すだけでエージェント自身がセットアップを行う：
  ```text
  Set up https://github.com/browser-use/browser-harness for me.

  Read `install.md` first to install and connect this repo to my real browser. Then read `SKILL.md` for normal usage. Always read `helpers.py` because that is where the functions are. When you open a setup or verification tab, activate it so I can see the active browser tab. After it is installed, open this repository in my browser and, if I am logged in to GitHub, ask me whether you should star it for me as a quick demo that the interaction works — only click the star if I say yes. If I am not logged in, just go to browser-use.com.
  ```
* **初期設定**:
  * 指定されたURLを開き、リモートデバッグ（Remote debugging）のチェックボックスをオンにしてブラウザとの接続を許可する。

## **5. 特徴・強み (Pros)**

* **高い柔軟性と適応力**: 事前に用意された関数（レシピやレール）に縛られず、AIが必要に応じて生のDOM操作やCDPのコマンドを自ら実装できる。
* **状態の正確な把握**: 生のブラウザ機能を利用するため、「ボタンが実際に押されたか」「画面がどう変化したか」といった文脈をAIが正確に把握できる。
* **メンテナンスコストの削減**: 対象サイトのUIが変更されても、AIがその場で判断して操作方法やコードを修正するため、人間がスクリプトを保守する手間が省ける。
* **軽量性**: PlaywrightやPuppeteerのような巨大なフレームワークに依存しないため、軽量で動作が速い。

## **6. 弱み・注意点 (Cons)**

* **高いLLM性能への依存**: 自己修復やDOM操作などの高度な推論を要求するため、Claude 3.5 Sonnet以上の極めて優秀なモデルでないと真価を発揮しない可能性が高い。
* **セキュリティ・ガバナンスの懸念**: AIが勝手にコードを書き換えたり、ブラウザの全権限を持って操作したりするため、予期せぬ破壊的変更（意図しない購入やデータ削除）を防ぐ仕組みや監視が必要。
* **日本語ドキュメントの不足**: 公式のドキュメントやリポジトリは基本的に英語であり、日本語でのサポートやコミュニティはまだ形成されていない。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース (ローカル)** | 無料 | GitHubからコードを取得してローカル環境のChromeで実行。 |
| **リモートブラウザ (Free tier)** | 無料 | 3つの同時実行ブラウザ、プロキシ、CAPTCHA解決。クレジットカード不要。 |

* **課金体系**: リモートブラウザのより大規模な利用については、[cloud.browser-use.com](https://cloud.browser-use.com/new-api-key)でのAPIキー発行・管理となる（有料プランの詳細は未公開・要確認）。

## **8. 導入実績・事例**

* **導入企業**: 新規プロジェクトのため、具体的な企業導入事例はまだ公開されていない。
* **導入事例 (デモ用途)**:
  * ブラウザ上でAIがチェスエンジン（Stockfish）をプレイ。
  * ブラウザ上のテトリスで世界記録レベルのプレイを実現。
  * JavaScriptを用いてキャンバス上にハートを描画するタスクの完了。
* **対象業界**: 自動化エンジニアリング、AIエージェント研究開発分野。

## **9. サポート体制**

* **ドキュメント**: GitHubリポジトリの `README.md`, `install.md`, `SKILL.md` および公式ブログの記事が中心。
* **コミュニティ**: GitHubのIssueやPull Request、X (Twitter) やHacker Newsでの議論が行われている。
* **公式サポート**: オープンソースベースであり、公式なエンタープライズ向けサポート窓口は現状明記されていない。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: リモートブラウザ用のAPI（cloud.browser-use.com）が提供されている。
* **外部サービス連携**: Claude Code、Codexといったコーディング用AIエージェントとの組み合わせが前提となっている。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | ハーネス自体がPythonで書かれている。 | 実行環境の用意が必要。 |
| **Claude Code / Codex** | ◎ | 推奨されるLLMエージェントであり、プロンプト例も用意されている。 | 従量課金のAPIコスト。 |
| **Chrome / Chromium** | ◎ | CDPを直接叩くため、Chrome系ブラウザとの親和性が極めて高い。 | 他のブラウザ（FirefoxやSafari）は非対応。 |

## **11. セキュリティとコンプライアンス**

* **認証**: リモートブラウザサービスではAPIキーによる認証。
* **データ管理**: ローカル環境で使用する場合は、すべての処理・データはローカルブラウザ内に留まる。リモートブラウザを利用する場合は、クラウド経由で処理が行われる。
* **準拠規格**: 公式サイト等でISO27001やSOC2などのセキュリティ認証に関する記載はない。利用時のガバナンスはユーザーの責任となる。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: GUIは存在せず、AIエージェントに対する自然言語プロンプトがUIとなる。エージェントが全てを裏で処理する体験（UX）を提供する。
* **学習コスト**: AIに任せるため、ユーザー自身がツールを「操作」する学習コストはほぼゼロ。ただし、AIが正しく動くように監視し、エラー時に適切なプロンプトで誘導する「AIハンドリング」のスキルが求められる。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 人間がスキルファイル（`domain-skills/`）を手動で書くのではなく、AIエージェントにブラウザを操作させ、非自明なパターンをAI自身にスキルとして記録させる。
  * リモートブラウザ機能を利用して、バックグラウンドでの自律的なクローリングやタスク実行環境を構築する。
* **陥りやすい罠 (Antipatterns)**:
  * AIの動きを完全に信頼し放置すること。特に本番環境や支払い情報を扱うサイトでの無監視実行はセキュリティ・金銭的リスクが伴う。
  * `helpers.py`などのコードを人間が過度に先回りして書き直してしまうこと（AIの「自己修復」パラダイムと相反する）。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: Hacker News, X (Twitter)
* **総合評価**: レビューサイトのスコアはなし（G2/Capterra等には未掲載）。
* **ポジティブな評価**:
  * 「Playwright等のラッパーで生じる『AIがクリックしたつもりが実際には動いていない』というサイレントエラーを防げる点が革新的。」（Hacker Newsより要約）
  * 「AI自身が必要な関数をDOMのAPIを使って書き足すという体験が魔法のようだった。」（開発者の声）
* **ネガティブな評価 / 改善要望**:
  * プロジェクトが新しいため、長期的な安定性や大規模プロジェクトでの運用実績に対する懸念。
  * セキュリティに対する不安（「AIにブラウザの全権限を渡すことのリスク」に対する言及）。

## **15. 直近半年のアップデート情報**

* **2026-04-17**: Hacker Newsにてプロジェクトの公開およびコンセプト（自己修復型CDPハーネス）の発表。

(出典: [Hacker News](https://news.ycombinator.com/item?id=47890841))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Browser Harness | Browser Use CLI | Playwright / Puppeteer | Selenium |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | ブラウザ制御 | ◎<br><small>CDP直接</small> | ◎<br><small>高度なラッパー</small> | ◯<br><small>フレームワーク経由</small> | ◯<br><small>WebDriver経由</small> |
| **AI親和性** | 自己修復 | ◎<br><small>AIがコード改修</small> | ◯<br><small>AI用抽象化</small> | △<br><small>別途構築が必要</small> | ×<br><small>なし</small> |
| **アーキテクチャ** | 抽象化レイヤー | ◎<br><small>極めて薄い</small> | △<br><small>厚い</small> | △<br><small>厚い</small> | △<br><small>厚い</small> |
| **リモート** | クラウドブラウザ | ◯<br><small>標準連携</small> | ◯<br><small>標準連携</small> | △<br><small>サードパーティ要</small> | △<br><small>サードパーティ要</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Browser Harness** | AIが直接CDPを叩く自己修復型ハーネス | 抽象化による文脈喪失がない。未知のタスクに適応可能。 | 非常に優秀なLLMが必要。制御が難しい。 | AIエージェントに自律的にブラウザ上の未知のタスクを解決させたい場合。 |
| **Browser Use CLI** | AI向けの高度なブラウザ操作ラッパー | 定義済みの安全な操作セットを提供。 | 想定外のUI変更時に対応しきれない（サイレントエラー）場合がある。 | 決まったパターンのタスクをAIにある程度安全に実行させたい場合。 |
| **Playwright / Puppeteer** | 従来のブラウザ自動化・テストフレームワーク | 堅牢で高速。ドキュメントやコミュニティが豊富。 | スクリプトの保守コストが高い。UI変更に弱い。 | プログラムによる決定論的なテストやスクレイピングを行う場合。 |

## **17. 総評**

* **総合的な評価**:
  Browser Harnessは、従来の「人間がAIのためのラッパー（操作の抽象化レイヤー）を用意する」というアプローチを否定し、「AIにブラウザの生の操作権限（CDP）を与え、足りないものはAI自身に作らせる」という**自己修復パラダイム**を提唱する非常に野心的なプロジェクトである。わずか約600行のコードで実現されており、AI（特にLLM）の推論・コーディング能力の向上を前提とした次世代のブラウザ自動化の形を示している。
* **推奨されるチームやプロジェクト**:
  * 最新のLLM（Claude 3.5 SonnetやGPT-4クラス以上）を活用した、自律型エージェントの開発チーム。
  * 頻繁に変更されるWebサイトの操作を自動化したい（従来のスクリプトでは保守が追いつかない）RPAプロジェクト。
* **選択時のポイント**:
  確実性や決定論的な動作が求められる従来型のテスト用途にはPlaywright等が向くが、人間のように「画面を見てその場で考え、新しい操作方法を試行錯誤する」ような柔軟性が求められるタスクにおいて、Browser Harnessは強力な選択肢となる。導入にあたっては、AIの動作を監視・制限するセキュリティポリシーの策定が必須となる。
