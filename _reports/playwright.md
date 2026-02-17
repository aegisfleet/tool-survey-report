---
# === フロントマター ===
# 【必須項目】
title: "Playwright 調査レポート"
tool_name: "Playwright"
tool_reading: "プレイライト"
category: "テスト/QA"
developer: "Microsoft"
official_site: "https://playwright.dev/"
date: "2025-10-18"
last_updated: "2026-01-28"
tags:
  - "テスト自動化"
  - "E2Eテスト"
  - "ブラウザテスト"
  - "オープンソース"
  - "JavaScript"
  - "Python"
  - "Java"
  - "Node.js"
  - "AI"
  - "エージェント"
description: "Microsoftが開発する、最新のWebアプリ向けエンドツーエンドテスト自動化フレームワーク。AIエージェント機能や強力なデバッグツールを備え、単一APIで全主要ブラウザに対応する。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "Web開発者"
    - "QAエンジニア"
  latest_highlight: "2026年1月にAIエージェント向けCLIモード(v1.58)を追加"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 92
  base_score: 70
  plus_points:
    - point: 10
      reason: "自動待機機能、強力なデバッグツール（Trace Viewer）、クロスブラウザ対応など、機能が非常に豊富でテストの安定性が高い。"
    - point: 7
      reason: "Playwright Test AgentsやCLIスキルなど、AI時代に対応した先進的な機能をいち早く取り入れている。"
    - point: 5
      reason: "公式ドキュメントが非常に充実しており、Codegen機能など初学者でも学習を始めやすい。"
    - point: 5
      reason: "Microsoftによる活発な開発が続いており、月次でのアップデートで常に最新技術に対応している。"
    - point: 5
      reason: "完全無料のオープンソースでありながら、有料ツールに匹敵、あるいは凌駕する機能を持つ。"
  minus_points:
    - point: -3
      reason: "公式ドキュメントやツールUIは英語のみで、日本語ネイティブのサポートは提供されていない。"
    - point: -2
      reason: "高機能ゆえにAPIが膨大で、全機能を使いこなすには一定の学習コストが必要。"
  summary: "AI時代のテスト自動化におけるデファクトスタンダード。機能、安定性、将来性の全てにおいてトップクラスの評価。"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/microsoft/playwright"
  documentation: "https://playwright.dev/docs/intro"
relationships:
  parent: ""
  children:
    - "Playwright Test Agents"
    - "Playwright CLI"
  related_tools:
    - "CodeceptJS"
    - "Cypress"
    - "Selenium"
    - "Puppeteer"
    - "Appium"
    - "Robot Framework"
    - "Cucumber"
    - "Allure Report"
---

# **Playwright 調査レポート**

## **1. 基本情報**

* **ツール名**: Playwright
* **ツールの読み方**: プレイライト
* **開発元**: Microsoft
* **公式サイト**: [https://playwright.dev/](https://playwright.dev/)
* **関連リンク**:
  * GitHub: [https://github.com/microsoft/playwright](https://github.com/microsoft/playwright)
  * ドキュメント: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
* **カテゴリ**: テスト/QA
* **概要**: Playwrightは、最新のWebアプリケーション向けの高速で信頼性の高いエンドツーエンド（E2E）テストを可能にするオープンソースのフレームワークです。単一のAPIでChromium、Firefox、WebKitを操作でき、AIによるテスト生成・修復機能や強力なデバッグツールを備えています。

## **2. 目的と主な利用シーン**

* **解決する課題**: 手動テストの工数削減、不安定なテスト（Flaky Test）の排除、クロスブラウザおよびモバイルWebでの品質保証。
* **想定利用者**: Web開発者、QAエンジニア、SDET（Software Development Engineer in Test）
* **利用シーン**:
  * WebアプリケーションのE2Eテスト自動化
  * 複数ブラウザ（Chrome, Firefox, Safari）およびモバイルビューでの動作検証
  * CI/CDパイプラインでの回帰テスト実行
  * AIエージェントを活用したテストコードの自動生成と修復

## **3. 主要機能**

* **クロスブラウザ・クロスプラットフォーム**: Chromium (Chrome, Edge), Firefox, WebKit (Safari) をWindows, Linux, macOS上で単一APIにより操作可能。
* **Playwright Test Agents**: 「Planner（計画）」「Generator（生成）」「Healer（修復）」の3つのAIエージェントが連携し、自然言語からテストを作成・保守する機能（v1.56〜）。
* **Speedboard**: HTMLレポート内でテスト実行速度を可視化し、ボトルネックとなっているテストケースやステップを特定する機能（v1.57〜）。
* **Chrome for Testing**: テスト実行に最適化された専用のChromeビルドをデフォルトで使用し、再現性と安定性を向上（v1.57〜）。
* **自動待機 (Auto-wait)**: 要素が操作可能になるまで自動的に待機するため、`sleep`などの人工的な待機処理が不要で、非常に安定したテストを実現。
* **強力なデバッグツール**:
  * **Trace Viewer**: 実行時のスクリーンキャスト、DOMスナップショット、ネットワークログなどを時系列で記録・再生。
  * **Codegen**: ブラウザ操作を記録してテストコードを自動生成。
  * **UI Mode**: タイムトラベルデバッグやウォッチモードを備えたインタラクティブなテスト実行環境。
* **テストの分離と並列実行**: テストごとに独立したブラウザコンテキスト（Cookieやローカルストレージも分離）を作成し、高速かつ安全な並列実行が可能。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Node.js (v18以上推奨)
* **インストール/導入**:
  ```bash
  npm init playwright@latest
  # 質問に答えるだけで設定ファイルやサンプルテストが生成される
  ```
* **初期設定**:
  * `playwright.config.ts` で対象ブラウザやベースURLなどを設定。
* **クイックスタート**:
  ```bash
  # テストの実行
  npx playwright test
  # レポートの表示
  npx playwright show-report
  ```

## **5. 特徴・強み (Pros)**

* **圧倒的なテスト安定性**: 自動待機機能とWeb-Firstアサーションにより、非同期処理の多いモダンなSPAでも安定して動作します。
* **先進的なAI機能**: エージェント機能やCLIのAIスキル対応など、生成AIを活用したテスト効率化に積極的に取り組んでいます。
* **開発者体験 (DX) の良さ**: VS Code拡張機能との統合が素晴らしく、エディタ上でテスト実行、デバッグ、コード生成が完結します。
* **高速な実行速度**: ブラウザコンテキストによる軽量な隔離と、並列実行のネイティブサポートにより、大規模なテストスイートも高速に完了します。

## **6. 弱み・注意点 (Cons)**

* **日本語リソース**: 公式ドキュメントは英語のみであり、日本語の技術記事も増えてはいるものの、Seleniumなどの古参ツールに比べるとまだ少なめです。
* **学習曲線**: 機能が非常に豊富であるため、基本的な使い方だけでなく、Trace ViewerやConfig設定などを使いこなすまでには学習が必要です。
* **更新頻度**: 頻繁にアップデートが行われるため、破壊的変更や推奨APIの変更に追従する必要があります（ただし、移行ガイドは充実しています）。

## **7. 料金プラン**

PlaywrightはApache-2.0ライセンスのオープンソースソフトウェアであり、商用・非商用問わず完全に無料です。

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース** | 無料 | 全機能利用可能 |

* **課金体系**: なし
* **無料トライアル**: なし（常に無料）

## **8. 導入実績・事例**

* **導入企業**: Microsoft (Bing, VS Code, Outlook), Disney+ Hotstar, Adobe, ING, React Navigationなど。
* **導入事例**: 大規模な回帰テストの時間を数時間から数共に短縮した事例や、不安定なテスト（Flaky tests）を劇的に削減した事例が多数報告されています。
* **対象業界**: Webサービス、SaaS、エンタープライズシステムなど全般。

## **9. サポート体制**

* **ドキュメント**: [公式ドキュメント](https://playwright.dev/)は非常に詳細で、サンプルコードも豊富です。
* **コミュニティ**: [Discord](https://aka.ms/playwright/discord)が非常に活発です。
* **公式サポート**: GitHub Issuesでのバグ報告対応は迅速ですが、有償のテクニカルサポートプランはありません。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: TypeScript/JavaScript, Python, Java, .NET向けのSDKを提供。
* **外部サービス連携**:
  * **CI/CD**: GitHub Actions, Jenkins, CircleCI, Azure Pipelinesなど主要ツールと簡単に連携可能。
  * **Docker**: 公式のDockerイメージが提供されており、コンテナ環境での実行も容易。
  * **AI/MCP**: Playwright CLIを通じて、ClaudeなどのAIエージェントから操作可能。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Node.js (TS/JS)** | ◎ | ファーストクラスサポート。機能が最も充実。 | 特になし。 |
| **Python** | ◯ | 同期/非同期APIを選択可能。Pytestプラグインあり。 | 一部機能（Component Testingなど）が遅れて実装される場合あり。 |
| **Java** | ◯ | JUnitなどの既存エコシステムと統合可能。 | JS版に比べるとドキュメントや例が少なめ。 |
| **.NET (C#)** | ◯ | NUnit/MSTestと統合可能。 | 同上。 |

## **11. セキュリティとコンプライアンス**

* **認証**: HTTP認証、OAuth、Cookieベースの認証など、Webアプリのあらゆる認証フローを自動化可能。認証状態を保存して再利用する機能もあります。
* **データ管理**: テストデータや認証情報はローカルまたはCI環境で管理され、外部送信は行われません。
* **準拠規格**: ツール自体は特定の認証を取得していませんが、エンタープライズレベルのセキュリティ要件を満たす環境で広く利用されています。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: UI ModeやTrace Viewerのインターフェースはモダンで直感的であり、開発者が欲しい情報にすぐにアクセスできるよう設計されています。
* **学習コスト**: Codegenを使えばコードを書かずにテストを作成開始できるため、初期導入のハードルは低いです。高度な機能を使いこなすにはドキュメントの読み込みが必要です。

## **13. ベストプラクティス**

* **Web-First Assertionsの使用**: `expect(locator).toBeVisible()` のように、自動リトライ機能を持つアサーションを使用することで、Flakyなテストを防ぐ。
* **Locatorsの推奨**: CSSやXPathではなく、ユーザーから見える属性（Role, Text, Label）を使用する `getByRole`, `getByText` などを優先する。
* **Page Object Model (POM) の採用**: テストコードの再利用性と保守性を高めるため、ページごとの操作をクラスにカプセル化する。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2, GitHub, X (Twitter)
* **総合評価**: 4.8/5.0 (G2)
* **ポジティブな評価**:
  * 「Seleniumからの移行で、テストの実行時間が半分以下になり、安定性が劇的に向上した。」
  * 「Trace Viewerのおかげで、CIで失敗したテストの原因調査が一瞬で終わるようになった。」
  * 「AIエージェント機能（Test Agents）は、テスト作成の未来を感じさせる。定型作業がさらに減りそう。」
* **ネガティブな評価 / 改善要望**:
  * 「機能が多すぎて、ドキュメントのどこを見れば良いか迷うことがある。」
  * 「Safari (WebKit) のレンダリングが、実機のSafariと微妙に異なる挙動をすることが稀にある。」
* **特徴的なユースケース**:
  * ビジュアルリグレッションテスト（画像比較）の基盤としての利用。
  * スクレイピングツールとしての利用（undetectedな操作が得意なため）。

## **15. 直近半年のアップデート情報**

* **2026-01-23 (v1.58)**: AIエージェント向けのCLIモード（token-efficient）とスキルセットを追加。タイムライン表示の改善。
* **2025-11-25 (v1.57)**: HTMLレポートにテスト実行速度を分析する「Speedboard」を追加。「Chrome for Testing」への移行。
* **2025-10-06 (v1.56)**: 自律型テストエージェント機能「Playwright Agents (Planner/Generator/Healer)」を導入。
* **2025-08-20 (v1.55)**: Codegenが `toBeVisible()` アサーションを自動生成可能に。
* **2025-07-10 (v1.54)**: Cookieのパーティショニング（CHIPS）に対応。

(出典: [Playwright GitHub Releases](https://github.com/microsoft/playwright/releases))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Playwright | Cypress | Selenium |
|:---:|:---|:---:|:---:|:---:|
| **基本性能** | 実行速度・安定性 | ◎ | ◯ | △ |
| **ブラウザ** | クロスブラウザ | ◎<br><small>全エンジン対応</small> | ◯<br><small>一部制限あり</small> | ◎<br><small>実機含め最強</small> |
| **AI機能** | エージェント/修復 | ◎<br><small>標準搭載 (v1.56~)</small> | △<br><small>プラグイン等</small> | △<br><small>サードパーティ製</small> |
| **並列実行** | 並列化 | ◎<br><small>無料・簡単</small> | △<br><small>有料プラン推奨</small> | ◯<br><small>Grid構築が必要</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Playwright** | Microsoft製。高速・安定・AI対応。 | 自動待機による安定性、Trace Viewer、AIエージェント機能。 | 日本語情報の絶対量はまだSeleniumに劣る。 | モダンなWebアプリのテスト自動化における第一選択肢。 |
| **Cypress** | フロントエンド開発者向け。 | セットアップが簡単で、デバッグ体験が良い。 | 複数タブ操作やiframe制限など、アーキテクチャ上の制約がある。 | フロントエンドエンジニアが開発フローの中でテストを書く場合。 |
| **Selenium** | 業界標準の老舗ツール。 | 言語・ブラウザ・プラットフォームの対応幅が広い。 | 環境構築が大変で、テストが不安定になりがち。 | レガシーシステムの保守や、特定の実機環境でのテストが必須な場合。 |

## **17. 総評**

* **総合的な評価**:
  Playwrightは、Webテスト自動化フレームワークとして現在最もバランスが取れており、機能・性能・将来性の全ての面で優れています。特にv1.56以降のAIエージェント機能の統合により、単なる自動化ツールから「自律的な品質保証パートナー」へと進化しつつあります。
* **推奨されるチームやプロジェクト**:
  新規にE2Eテストを導入する全てのプロジェクト、およびSeleniumやCypressでのテストの不安定さやメンテナンスコストに課題を感じているチームに強く推奨します。
* **選択時のポイント**:
  無料で利用できるオープンソースでありながら、商用ツール顔負けの機能（特にAI機能とデバッグ機能）を持っているため、コストパフォーマンスは最強です。
