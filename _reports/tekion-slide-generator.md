---
title: TEKION Slide Generator 調査レポート
tool_name: TEKION Slide Generator
tool_reading: テキオンスライドジェネレーター
category: スライド/プレゼンテーション
developer: TEKION Group
official_site: https://github.com/rsensui2/tekion-slide-generator
date: '2026-07-23'
last_updated: '2026-07-23'
tags:
  - オープンソース
  - 生成AI
  - 画像生成
description: Markdownから高品質な16:9 2Kスライドを自動生成しPPTX/PDFに出力するツール
quick_summary:
  has_free_plan: false
  is_oss: true
  starting_price: 無料（オープンソース）
  target_users:
    - 開発者
    - 営業担当者
    - 登壇者
  latest_highlight: OpenAI GPT-image-2対応やVisual/Balancedスタイル等を追加したv4をリリース
  update_frequency: 高
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 5
      reason: Markdownからの完全自動化と高品質な画像出力（2K・16:9対応）
    - point: 4
      reason: OpenAI/Gemini対応やブランドデザイン・スタイルの柔軟な制御性
    - point: 4
      reason: 日本語の精度が非常に高く、ロゴ等のピクセル忠実度も徹底
    - point: 2
      reason: Claude Code Skillとして組み込み可能でCLIからシームレスに利用可能
  minus_points:
    - point: -0.0
      reason: 現状特段の大きなデメリットはなし（利用にはAPIキーが必要）
  summary: 高品質かつ配付・提案用レベルのプレゼンスライドを高速で自動生成できる先進的オープンソースツール
links:
  github: https://github.com/rsensui2/tekion-slide-generator
  deepwiki: https://deepwiki.com/rsensui2/tekion-slide-generator
  codewiki: https://codewiki.google/github.com/rsensui2/tekion-slide-generator
relationships:
  related_tools:
    - Canva
    - Gamma
    - Gemini
    - ChatGPT
---

# **TEKION Slide Generator 調査レポート**

## **1. 基本情報**

* **ツール名**: TEKION Slide Generator
* **ツールの読み方**: テキオンスライドジェネレーター
* **開発元**: TEKION Group
* **公式サイト**: [https://github.com/rsensui2/tekion-slide-generator](https://github.com/rsensui2/tekion-slide-generator)
* **関連リンク**:
  * GitHub: [https://github.com/rsensui2/tekion-slide-generator](https://github.com/rsensui2/tekion-slide-generator)
  * DeepWiki: [https://deepwiki.com/rsensui2/tekion-slide-generator](https://deepwiki.com/rsensui2/tekion-slide-generator)
  * CodeWiki: [https://codewiki.google/github.com/rsensui2/tekion-slide-generator](https://codewiki.google/github.com/rsensui2/tekion-slide-generator)
* **カテゴリ**: スライド/プレゼンテーション
* **概要**: Markdownを書くだけでOpenAI GPT-image-2やGemini 3.1 FlashなどのAIモデルを活用し、高品質な16:9 2Kスライドを自動で並列生成するツール。出力は画像だけでなくPPTXやPDF形式まで一気通貫で対応する。

## **2. 目的と主な利用シーン**

* **解決する課題**: プレゼンテーション資料作成におけるデザインの手間を省き、「Markdownを投げ込めばプロがデザインしたような資料が出てくる」完全自動化と実用レベルの品質の実現。
* **想定利用者**: 開発者、AIエンジニア、営業担当者、登壇者
* **利用シーン**:
  * 開発したプロジェクトやツールの技術プレゼン資料の作成
  * 顧客向けの提案書・営業資料（Balancedスタイル）の作成
  * カンファレンスや勉強会等での登壇資料（Visualスタイル）の作成

## **3. 主要機能**

* **Markdownからのスライド生成**: Markdownテキストを解析し、各スライドのプロンプトを自動生成して並列で画像生成を行う。
* **マルチプロバイダ対応**: OpenAIのGPT-image-2とGoogle Gemini 3.1 Flash Imageの両方に対応し、用途に応じて切り替えが可能。
* **スタイル制御**: 用途に合わせて、情報密度の高い営業資料向け「Balanced」と、ビジュアル主体の登壇向け「Visual」の2つのスタイルから選べ、スライドごとの個別指定もできる。
* **ブランドガイドライン対応**: 指定したロゴ画像のピクセル単位での忠実な配置や、自社カラーパレット・フォントルールに沿った出力が可能。
* **参考画像の適用強化**: 各スライドに対し最大16枚の参考画像（人物、商品、ブランドビジュアル等）をマップ化して渡し、柔軟な描画を制御できる。
* **PPTX/PDF出力**: 生成した2K解像度の画像群を自動でPPTXファイルやPDFファイルとしてパッケージ化する。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: ローカルで動作するCLIベースのPythonアプリケーションであり、Claude Code Skillとしても利用可能な構成。
* **主要コンポーネントとデータフロー**:
  * 入力されたMarkdownファイルをサブエージェントが並列分析し、JSON形式でスライドの構成とプロンプト計画（`slides_plan.json`）を作成する。
  * プロンプト計画を基に、Jinja2テンプレートを介してプロンプト（指示書）を生成する。
  * プロバイダ抽象レイヤ（`providers/registry.py`等）を通じてOpenAI APIやGemini APIを呼び出し、並列で画像を生成する。
  * 最終的にpython-pptxやPillowを用いて画像群をPPTX・PDFファイルに埋め込み出力する。
* **特筆すべき要素技術**:
  * プロバイダ抽象レイヤの実装により、基盤モデル（GPT-image-2 / Gemini 3.1 Flash）の切り替えや新規追加が容易。
  * Claude Code Skillとの統合（`--dangerously-skip-permissions`で大量並列実行をサポート）。
  * OpenAI `/images/edits` を用いた最大16枚の参考画像の同時配置機能。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * Python環境
  * 依存パッケージ: Pillow, python-pptx, requests, Jinja2
  * OpenAI APIキー (GPT-image-2用) または Google Gemini APIキー
* **インストール/導入**:

  ```bash
  # リポジトリ取得
  git clone https://github.com/rsensui2/tekion-slide-generator.git
  cd tekion-slide-generator

  # 依存インストール
  pip install Pillow python-pptx requests Jinja2
  ```

* **初期設定**:
  * `.env.local` ファイル（ホームディレクトリまたはプロジェクト直下）にAPIキーを設定する。

  ```bash
  echo "OPENAI_API_KEY=sk-..." >> ~/.claude/.env.local
  ```

* **クイックスタート**:
  * Claude Code Skillとしてインストールし、会話ベースで生成を開始する。

  ```bash
  cp -r . ~/.claude/skills/tekion-slide-generator-v4/
  claude --dangerously-skip-permissions
  # Claudeにて「スライドを作って」と発話して開始
  ```

## **6. 特徴・強み (Pros)**

* **生成品質の高さ**: 解像度2K(2752×1536)、ネイティブ16:9比率での出力に対応し、日本語テキストにおける誤字や切れがない完璧レベルの精度を誇る。
* **ブランド一貫性の徹底**: プロジェクト固有の`design_guidelines.md`によるトーンや配色制御に加え、ロゴ画像等の指定エリアへのピクセル単位で忠実な色保全・再配置が可能。
* **生成速度と並列化**: 15〜16枚のスライドを約5〜7分で並列生成可能であり、大規模なプレゼン資料も素早く完成できる。
* **柔軟なカスタマイズ性**: CLI引数やJinja2テンプレートにより、プロバイダ、画質設定、スタイル、背景透明度などを細かく制御可能。

## **7. 弱み・注意点 (Cons)**

* **APIコストの発生**: 利用するモデル（OpenAI等）に応じたAPIの従量課金コストが発生する（16枚で目安$2-4程度）。
* **CLI・開発者向けの色合いが強い**: 完全なGUIアプリではなく、PythonスクリプトやClaude Codeの対話UIを利用するため、非エンジニア単独での初期導入には若干のハードルがある。
* **日本語対応状況**: ツール自体は日本語を含む多言語をサポートし、生成時の日本語精度の高さを売りにしているが、ドキュメントの大部分も日本語で提供されている。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース版** | 無料 | GitHubで公開されており誰でも利用可能。ただし実行にあたるAPIの利用料は自己負担。 |

* **課金体系**: ツールの利用自体は無料。使用するAI APIの従量課金。
* **無料トライアル**: Google Gemini APIなどの無料枠を使用可能。

## **9. 導入実績・事例**

* **導入企業**: オープンソースとして公開されたばかりのため、具体的な企業事例は公開されていない。
* **導入事例**: 開発元であるTEKION Groupにおいて、本ツールのドキュメントや紹介スライドの生成に自己活用（ドッグフーディング）されている。
* **対象業界**: IT、ソフトウェア開発、営業など幅広くプレゼン資料が求められる業界。

## **10. サポート体制**

* **ドキュメント**: GitHubのREADMEや`docs/`配下に、設計思想からカスタマイズ手順までの解説が豊富に存在する。
* **コミュニティ**: GitHub上のIssueやPull Requestを通じて開発・議論が行われている。
* **公式サポート**: 公式の有償サポート窓口はなく、オープンソースコミュニティによるサポートが主体。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: 本ツール自体はローカル動作のスクリプトであるが、各種AI APIプロバイダ（OpenAI API, Google Gemini API）に依存している。
* **外部サービス連携**: Claude CodeのSkillとしてシームレスに連携可能。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | ツールの基盤言語であり、直接のコード修正や拡張が容易 | 特になし |
| **Claude Code** | ◎ | Skillとして組み込むことで自然言語による操作が可能 | 権限スキップフラグ(`--dangerously-skip-permissions`)の管理に注意 |

## **12. セキュリティとコンプライアンス**

* **認証**: 利用する各種APIキーを通じたプロバイダ側の認証に依存。
* **データ管理**: データは実行環境（ローカルPCやコンテナ）で処理され、AIプロバイダとの間で通信される。APIキーは`.env.local`などローカル環境変数で管理する仕様となっている。
* **準拠規格**: オープンソースソフトウェアであり、特定のセキュリティ認証は取得していない。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 基本的な操作はCLIコマンドの実行か、Claude Codeとの対話インターフェースによって行われる。GUIはないが、自動化により手動デザインの手間が省けるためUXは高い。
* **学習コスト**: 環境構築やコマンド・オプションの理解など、エンジニアであれば容易だが、一般的なビジネスユーザーには初期設定の学習コストがある。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * Claude Code Skillとして登録し、コンパニオンスキルで対話的にデザイン設定の初期化(`design_guidelines.md`生成)を行うことで効率よくブランドの統一を図る。
  * `Visual`スタイルと`Balanced`スタイルをスライドごとにJSONで混在させ、緩急をつけたプレゼン資料を構成する。
* **陥りやすい罠 (Antipatterns)**:
  * プロンプトテンプレートの不用意な変更。ロゴの白抜き指示や配置ルールの破損につながり、品質低下を招く恐れがある。
  * Claude Codeを安全でない設定のまま他のプロジェクトでも使用し続けること（本ツール専用の権限スキップモードの適切な使い分けが必要）。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: 公式GitHubリポジトリ
* **総合評価**: Star数が付いており、開発者の関心を集めている（G2等のレビューサイトには登録なし）。
* **ポジティブな評価**:
  * 「Markdownから全自動でクライアント提案品質のスライドが生成できるのが画期的」
  * 「ロゴ画像の色・形の完全保持や、日本語フォントが崩れない点が非常に実用的」
* **ネガティブな評価 / 改善要望**:
  * 開発初期段階のため、特定の環境下での実行エラーやGUIがないことに対する要望が予測される。
* **特徴的なユースケース**:
  * エンジニアがコードやアーキテクチャの解説資料を、Markdownで書いた仕様書から直接スライドに変換して登壇する使い方。

## **16. 直近半年のアップデート情報**

* **2026-04-24**: v4の初期リリース。OpenAI GPT-image-2へのデフォルト対応（Provider抽象レイヤ追加）、Visual/Balancedの2スタイル切替機能の実装、16:9ネイティブ対応およびロゴ保全ルールの強化。
* **2026-03**: v3-flashリリース。Gemini 3.1 Flash Imageによる高速生成、Thinking制御やグラウンディング機能への対応。
* **2026-02**: v2リリース。デザインガイドライン概念の導入、プロジェクト固有カラー・トーンの反映機能追加。

(出典: [GitHub Releases / README更新履歴](https://github.com/rsensui2/tekion-slide-generator) など)

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | Canva | Gamma | Gemini | ChatGPT |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **基本機能** | スライド生成の自動化 | ◎<br><small>Markdownから一気通貫</small> | △<br><small>一部自動だがGUI手動操作が主</small> | ◯<br><small>AIによる生成可能</small> | △<br><small>直接スライドファイルは生成不可</small> | △<br><small>直接スライドファイルは生成不可</small> |
| **カスタマイズ** | ブランドの個別制御 | ◎<br><small>プロンプト・ガイドラインで完全制御</small> | ◯<br><small>ブランドキットあり</small> | ◯<br><small>テンプレで対応可能</small> | △<br><small>プロンプトで指示</small> | △<br><small>プロンプトで指示</small> |
| **品質** | 日本語・ロゴ正確性 | ◎<br><small>ピクセル単位精度で保全</small> | ◯<br><small>手動配置のため正確</small> | ◯<br><small>標準フォント対応</small> | ◯<br><small>モデル性能による</small> | ◯<br><small>モデル性能による</small> |
| **エンタープライズ** | API・CLIからの自動化 | ◎<br><small>CLIツールとして特化</small> | ×<br><small>GUI主体</small> | △<br><small>限定的</small> | ◎<br><small>API完備</small> | ◎<br><small>API完備</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | エンジニア向けCLIベースのスライド自動生成ツール | 自動化レベルが高く、品質とブランド保全に特化 | GUIが存在せず導入に知識が必要 | 大量のスライドをMarkdownから全自動かつ高画質で生成したいエンジニアやチーム |
| **Canva** | 世界最大のオンラインデザインプラットフォーム | 豊富なテンプレート、直感的なGUI、コラボ機能 | 全自動化の機能は弱くAPIからの制御が難しい | デザイン初心者からプロまで、手動で高品質なデザインを調整したい場合 |
| **Gamma** | AIを活用したドキュメント・プレゼン作成ツール | テキストを入力するだけで高速に美しいスライドを生成 | 細かいレイアウトやブランドのピクセル単位の制御が難しい | 営業や企画担当者がプロンプトベースで手軽に見栄えの良い資料を作りたい場合 |
| **Gemini** | Googleのマルチモーダル基盤モデル | 画像・テキスト理解と生成能力が高い | スライド形式(PPTX等)での直接出力機能を持たない | 対話を通じてスライドの内容構成やアイデアを練りたい場合 |
| **ChatGPT** | OpenAIが提供する汎用AIチャットボット | 強力なテキスト推論とDALL-E等での画像生成 | 同じくスライドファイル(PPTX等)への直接完全パッケージングは苦手 | アイデア出しからテキスト草案作成、単発の画像生成を行いたい場合 |

## **18. 総評**

* **総合的な評価**:
  * TEKION Slide Generator v4は、既存の「AIによるスライド生成」ツールが抱えていた、テキストの崩れやブランドロゴの変形、低解像度といった実用上の課題を、緻密なプロンプトエンジニアリングとプロバイダ抽象化により克服した非常に優れたツールである。
* **推奨されるチームやプロジェクト**:
  * エンジニアリングチーム、開発者向けプロダクトのマーケティングチーム、および、日常的にMarkdownでドキュメントを管理しつつ、そこから迅速にプレゼン資料を自動出力したい技術力の高い組織に推奨される。
* **選択時のポイント**:
  * GUIによる細かな手動デザイン調整を重視する場合はCanvaなどが有利だが、ブランドルールを定めた上で「テキストから一気通貫で配付可能品質のスライドを得たい」という自動化と生産性を重視する用途においては、本ツールが最有力候補となる。
