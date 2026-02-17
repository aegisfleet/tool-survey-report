---
# === フロントマター ===
# 【必須項目】
title: "Selenium 調査レポート"
tool_name: "Selenium"
tool_reading: "セレニウム"
category: "テスト/QA"
developer: "Software Freedom Conservancy"
official_site: "https://www.selenium.dev/"
date: "2025-10-24"
last_updated: "2026-01-30"
tags:
  - "テスト自動化"
  - "オープンソース"
  - "Webブラウザ"
  - "E2Eテスト"
  - "開発者ツール"
description: "Webブラウザの操作を自動化するためのオープンソースフレームワーク群。主にWebアプリケーションのテストに利用されるが、Webスクレイピングなど定型作業の自動化にも活用される。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
    - "QAエンジニア"
  latest_highlight: "2026年1月にSelenium 4.40.0をリリースし、.NETやJavaの環境設定を近代化"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 8
      reason: "完全にオープンソースであり、ライセンス費用が一切かからない"
    - point: 7
      reason: "Java, Python, C#, JavaScriptなど多くの言語に対応し、ほぼ全てのモダンブラウザをサポートしているため、非常に柔軟性が高い"
    - point: 5
      reason: "20年以上の歴史を持ち、世界中に巨大なコミュニティと豊富なドキュメントが存在するため、問題解決が容易である"
  minus_points:
    - point: -3
      reason: "WebDriverを使いこなすにはプログラミングスキルが必須であり、学習コストが高い"
    - point: -2
      reason: "テスト結果のレポート機能が標準で提供されておらず、別途ライブラリの導入が必要"
  summary: "圧倒的な柔軟性と実績を誇るWeb自動化の標準ツールだが、習得には一定の技術力が求められる"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/SeleniumHQ/selenium"
  documentation: "https://www.selenium.dev/documentation/"
relationships:
  related_tools:
    - "CodeceptJS"
    - "Playwright"
    - "PyTest"
    - "Cypress"
    - "Appium"
    - "Robot Framework"
    - "Cucumber"
    - "Allure Report"
---

# **Selenium 調査レポート**

## **1. 基本情報**

* **ツール名**: Selenium
* **ツールの読み方**: セレニウム
* **開発元**: Software Freedom Conservancy
* **公式サイト**: [https://www.selenium.dev/](https://www.selenium.dev/)
* **関連リンク**:
  * GitHub: [https://github.com/SeleniumHQ/selenium](https://github.com/SeleniumHQ/selenium)
  * ドキュメント: [https://www.selenium.dev/documentation/](https://www.selenium.dev/documentation/)
  * レビューサイト: [G2](https://www.g2.com/products/selenium-hq/reviews)
* **カテゴリ**: テスト/QA
* **概要**: Webブラウザの操作を自動化するためのオープンソースのフレームワーク群。主にWebアプリケーションの機能テストや回帰テストの自動化に利用されるが、WebスクレイピングなどWebベースの定型作業の自動化にも広く活用される。

## **2. 目的と主な利用シーン**

* **解決する課題**: 手動で行われる反復的なブラウザ操作を自動化することで、テストの工数削減、ヒューマンエラーの防止、テストカバレッジの向上を実現する。
* **想定利用者**: 開発者、QAエンジニア、テスト自動化エンジニア
* **利用シーン**:
  * WebアプリケーションのUIテスト、E2E（エンドツーエンド）テスト
  * Chrome, Firefox, Safari, Edgeなど複数のブラウザでのクロスブラウザテスト
  * CI/CDパイプラインに組み込んだ継続的な回帰テストの実行
  * Webサイトからのデータ収集（Webスクレイピング）
  * フォーム入力やファイルアップロードなどの定型作業の自動化

## **3. 主要機能**

* **Selenium WebDriver**: W3C標準のプロトコルを通じて、ブラウザを直接操作するためのAPI。Java, Python, C#, Ruby, JavaScriptなど、様々なプログラミング言語でテストスクリプトを記述できる。
* **Selenium IDE**: Chrome、Firefox、Edgeのアドオンとして提供されるテスト作成・実行ツール。ユーザーのブラウザ操作を記録・再生することで、簡単にテストケースを作成できる。
* **Selenium Grid**: 複数のマシンやOS、ブラウザの組み合わせでテストを並列実行するためのシステム。大規模なテストを高速に実行できる。
* **Selenium Manager**: WebDriverの管理を自動化する機能。テスト実行に必要なブラウザドライバを自動で検出し、ダウンロード・設定を行う。
* **BiDi (Bidirectional) API**: WebSocketを利用した双方向通信により、ログの取得やネットワークイベントの傍受など、より高度なブラウザ操作を可能にする（開発進行中）。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Java, Python, Node.jsなどの言語ランタイムがインストールされていること。
  * テスト対象となるWebブラウザ（Chrome, Firefoxなど）がインストールされていること。
* **インストール/導入**:
  ```bash
  # Pythonの場合
  pip install selenium

  # Node.jsの場合
  npm install selenium-webdriver
  ```
* **初期設定**:
  * Selenium Managerが組み込まれているため、個別にChromeDriverなどをダウンロード・配置する必要は基本的になくなった（自動管理される）。
* **クイックスタート**:
  * 以下はPythonでの簡単なスクリプト例：
  ```python
  from selenium import webdriver

  driver = webdriver.Chrome()
  driver.get("https://www.selenium.dev/selenium/web/web-form.html")

  title = driver.title
  driver.implicitly_wait(0.5)

  text_box = driver.find_element(by="name", value="my-text")
  submit_button = driver.find_element(by="css selector", value="button")

  text_box.send_keys("Selenium")
  submit_button.click()

  message = driver.find_element(by="id", value="message")
  text = message.text

  driver.quit()
  ```

## **5. 特徴・強み (Pros)**

* **オープンソースで無料**: ライセンス費用が不要で、誰でも自由に利用・拡張できる。
* **多言語・マルチブラウザ対応**: Java, Python, C#, Ruby, JavaScriptなど、多くの主要なプログラミング言語に対応し、ほぼ全てのモダンブラウザをサポートしている。
* **巨大なコミュニティと豊富な情報**: 20年以上の長い歴史を持ち、世界中に巨大なユーザーコミュニティが存在するため、学習リソースやトラブルシューティングの情報が豊富にある。
* **高い拡張性と柔軟性**: TestNGやJUnit, Pytestなどのテストフレームワーク、JenkinsやGitHub ActionsなどのCI/CDツールと容易に連携でき、柔軟なテスト環境を構築できる。
* **W3C標準準拠**: Web標準技術として策定されているため、ブラウザベンダーによるサポートが手厚く、長期的な安定性が期待できる。

## **6. 弱み・注意点 (Cons)**

* **高い学習コスト**: WebDriverを使いこなすにはプログラミングスキルが必須であり、フレームワークの構築には相応の学習コストがかかる。
* **不安定なテストの可能性**: ページの読み込みタイミングや非同期処理によってテストが失敗することがあり（Flaky Test）、安定したテストの作成には待機処理などの工夫が必要。
* **レポート機能の不足**: テスト結果のレポート機能が標準で提供されておらず、Allure Reportなどのサードパーティ製ライブラリを導入する必要がある。
* **環境構築の手間**: Selenium Gridを用いた並列実行環境の構築・運用は複雑になりがちである。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース** | 無料 | 全ての機能が無料で利用可能。商用サポートは提供されていない。 |

* **課金体系**: なし
* **無料トライアル**: なし (常に無料)

## **8. 導入実績・事例**

* **導入企業**: Google, Netflix, Salesforce, IBMなど多数。
* **導入事例**: 世界中の多くのテクノロジー企業でWebアプリケーションのテスト自動化の標準ツールとして広く採用されている。
* **対象業界**: Web開発を行う全業界。

## **9. サポート体制**

* **ドキュメント**: [公式サイト](https://www.selenium.dev/documentation/)に詳細なドキュメントが整備されている（多言語対応）。
* **コミュニティ**: [Slackチャンネル](https://www.selenium.dev/support/#Chat)や[Google Groups](https://groups.google.com/g/selenium-users)などで活発な情報交換が行われており、問題解決の助けを得やすい。
* **公式サポート**: 商用サポートは提供されていないが、コミュニティベースでのサポートが充実している。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Selenium WebDriver APIとして各言語向けに提供されている。
* **外部サービス連携**:
  * **テストフレームワーク**: TestNG, JUnit (Java), pytest (Python), NUnit (C#) など。
  * **CI/CDツール**: Jenkins, GitHub Actions, GitLab CI, CircleCI など。
  * **クラウドテスト環境**: BrowserStack, Sauce Labs, LambdaTest などの商用サービス。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Java (Spring Boot)** | ◎ | 歴史的に最もサポートが厚く、実績が豊富。 | 特になし。 |
| **Python (Django/FastAPI)** | ◎ | データサイエンスや自動化の文脈で人気が高く、ライブラリも充実。 | 特になし。 |
| **C# (.NET)** | ◯ | Visual Studioとの親和性が高く、企業システムでの採用が多い。 | 特になし。 |
| **JavaScript/TypeScript** | ◯ | フロントエンドと同じ言語で記述可能。 | JS界隈ではPlaywrightやCypressの人気が高まっている。 |
| **Ruby (Rails)** | ◯ | Capybaraなどのラッパーを通じて利用されることが多い。 | 特になし。 |

## **11. セキュリティとコンプライアンス**

* **認証**: Selenium自体に認証機能はない。実行環境のセキュリティ設定に依存する。
* **データ管理**: ローカルマシンまたは管理下の環境でデータを処理し、外部に保存しない（クラウドサービス利用時を除く）。
* **準拠規格**: ツール自体は特定の認証を取得していないが、W3C標準に準拠している。Selenium Gridを公開する場合は適切なセキュリティ対策が必要。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Selenium IDEはGUIで直感的だが、WebDriverはコードベースであり、開発環境（IDE）の使い勝手に依存する。
* **学習コスト**: プログラミング言語の知識、HTML/CSS/DOMの理解、テストフレームワークの知識が必要となり、学習コストは比較的高め。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **Page Object Model (POM)**: ページごとの操作や要素をクラスとして定義し、テストコードのメンテナンス性を高めるデザインパターンを採用する。
  * **Explicit Waits (明示的な待機)**: `Thread.sleep()` などの固定待機ではなく、`WebDriverWait` を使用して、要素が表示されるまで待機するように実装し、Flaky Testを防ぐ。
  * **Selenium Managerの活用**: ブラウザドライバの手動管理をやめ、Selenium Managerによる自動管理に任せる。
* **陥りやすい罠 (Antipatterns)**:
  * **固定時間の待機**: テストの実行時間を無駄に長くし、不安定さの原因となる。
  * **複雑なXPathの多用**: ページの構造変化に弱く、メンテナンスコストが増大する。IDやCSSセレクタ、データ属性を優先する。
  * **ブラウザインスタンスの使い回し**: テスト間の依存関係を生み、原因特定を困難にする。テストごとにクリーンな状態で開始する。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: TrustRadius, G2, Capterra (既存レポート情報および一般的評価に基づく)
* **総合評価**: 8.3/10 (TrustRadius) - 業界標準としての地位は揺るぎない。
* **ポジティブな評価**:
  * 「多様なプログラミング言語をサポートしている点が素晴らしい。開発チームは好みの言語でテストを記述できる」
  * 「定型的なタスクやデータ入力作業を自動化することで、大幅な時間短縮と工数削減を実現できた」
  * 「オープンソースで無料であるにも関わらず、機能が非常に豊富で、ほとんどのユースケースに対応できる」
* **ネガティブな評価 / 改善要望**:
  * 「テスト実行が遅く感じることがある。特に大規模なテストスイートではパフォーマンスが課題になる」
  * 「テストの失敗原因を特定するのが難しい場合がある（Flaky Test）。」
  * 「セットアップや環境構築、特にGridの構築には専門的な知識が必要。」
* **特徴的なユースケース**:
  * E2Eテストだけでなく、Webサイトのスクリーンショットを定期的に取得してレイアウト崩れを検知する、といった運用監視タスクにも利用されている。

## **15. 直近半年のアップデート情報**

* **2026-01-18**: **Selenium 4.40.0 リリース**
  * .NETのEnvironmentManagerの近代化、JavaのアサーションライブラリのAssertJへの移行など、内部構造の近代化が行われた。
* **2025-12-06**: **Selenium 4.39.0 リリース**
  * Grid UIのテーマ統合とステータス表示改善。Python版BiDiで多くのエミュレーションコマンド（ロケール、ユーザーエージェント等）が追加された。
* **2025-10-25**: **Selenium 4.38.0 リリース**
  * JavaでのJSpecifyアノテーション追加によるNull安全性向上。Python BiDiでのタイムゾーンオーバーライド機能追加。
* **2025-10-18**: **Selenium 4.37.0 リリース**
  * Python 3.14のサポート開始と3.9のサポート終了。.NET版BiDiでのエミュレーションモジュール追加。
* **2025-10-02**: **Selenium 4.36.0 リリース**
  * .NETでのWebExtensionモジュールサポート。Python BiDiでのdownloadEndイベント追加。
* **2025-08-12**: **Selenium 4.35.0 リリース**
  * Python BiDi Scriptモジュールに高レベルAPIを追加。

(出典: [GitHub Releases](https://github.com/SeleniumHQ/selenium/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Selenium | Playwright | Cypress |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | マルチブラウザ対応 | ◎<br><small>主要ブラウザ網羅</small> | ◎<br><small>全主要エンジン対応</small> | ◯<br><small>主要ブラウザ対応</small> |
| **基本機能** | 多言語サポート | ◎<br><small>Java, Py, JS, C#, Ruby</small> | ◯<br><small>JS/TS, Py, Java, .NET</small> | △<br><small>JS/TSのみ</small> |
| **信頼性** | 自動待機 (Auto-wait) | △<br><small>実装が必要</small> | ◎<br><small>標準で強力</small> | ◎<br><small>標準で強力</small> |
| **開発体験** | デバッグ・トレース | △<br><small>ログ中心</small> | ◎<br><small>UIモード、Trace Viewer</small> | ◎<br><small>タイムトラベルデバッグ</small> |
| **速度** | 実行速度 | ◯<br><small>標準的</small> | ◎<br><small>高速</small> | ◎<br><small>高速（アーキテクチャによる）</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Selenium** | W3C標準のWeb自動化デファクトスタンダード。 | 圧倒的な実績、コミュニティ、言語サポートの広さ。非常に柔軟。 | 環境構築や学習コストが高め。テストが不安定になりやすい。 | 既存のJava/Python資産を活用したい場合。厳密なクロスブラウザテストが必要な場合。 |
| **Playwright** | Microsoft製。モダンWebのテストに最適化されている。 | 高速で安定性が高い。自動待機やトレース機能が強力。 | 歴史が比較的浅いが、急速に普及中。 | 新規プロジェクトでE2Eテストを導入する場合。不安定なテストに悩みたくない場合。 |
| **Cypress** | フロントエンド開発者向けのオールインワンテストツール。 | セットアップが容易。デバッグ体験が優れている。 | 言語がJS/TSに限定される。ブラウザ外の操作に制約がある。 | フロントエンド開発者が主体となってテストを書く場合。SPAのテスト。 |

## **17. 総評**

* **総合的な評価**:
  * Seleniumは、Webテスト自動化の「共通言語」として確固たる地位を築いている。Playwrightなどのモダンな競合ツールの台頭により、「とりあえずSelenium」という一択の状況ではなくなりつつあるが、その対応範囲の広さ、エコシステムの巨大さ、そしてW3C標準であるという事実は、長期的なプロジェクトにおいて大きな安心材料となる。
* **推奨されるチームやプロジェクト**:
  * JavaやC#、Rubyなどでバックエンドを開発しており、同じ言語でE2Eテストを記述したいチーム。
  * 非常に複雑なブラウザ操作や、レガシーなシステムを含む広範な環境でのテストが必要なプロジェクト。
  * 豊富なナレッジベースや既存のプラグインエコシステムを活用したい場合。
* **選択時のポイント**:
  * 「開発スピードとモダンなDX（開発者体験）」を最優先するならPlaywrightやCypressが有力な候補となる。一方、「言語統一」「最大級の互換性」「標準技術への準拠」を重視する場合、Seleniumは依然として最良の選択肢である。
