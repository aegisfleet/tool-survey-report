---
title: Core AI Models 調査レポート
tool_name: Core AI Models
tool_reading: コア エーアイ モデルズ
category: AI開発ライブラリ
developer: Apple
official_site: https://github.com/apple/coreai-models
date: '2026-06-14'
last_updated: '2026-06-14'
tags:
  - オープンソース
  - Swift
  - Python
description: Model export recipes, Python primitives, and Swift runtime utilities for on-device AI
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - iOS/macOSエンジニア
  latest_highlight: 'Fix Gemma stop tokens: read additional EOS from tokenizer config'
  update_frequency: 高
evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: Appleの公式ライブラリであり、iOS/macOSのオンデバイスAIに最適化されている
    - point: 5
      reason: オープンソースであり活発な開発が行われている
  minus_points:
    - point: 0
      reason: 特になし
  summary: AppleのエコシステムでオンデバイスAIを統合する上で非常に有用なツール。
links:
  github: https://github.com/apple/coreai-models
  deepwiki: https://deepwiki.com/apple/coreai-models
relationships: null
---

# **Core AI Models 調査レポート**

## **1. 基本情報**

* **ツール名**: Core AI Models
* **ツールの読み方**: コア エーアイ モデルズ
* **開発元**: Apple
* **公式サイト**: [https://github.com/apple/coreai-models](https://github.com/apple/coreai-models)
* **関連リンク**:
  * GitHub: [https://github.com/apple/coreai-models](https://github.com/apple/coreai-models)
* **カテゴリ**: AI開発ライブラリ
* **概要**: Model export recipes, Python primitives, and Swift runtime utilities for building on-device AI with Core AI. It allows developers to run machine learning models on Apple devices.

## **2. 目的と主な利用シーン**

* **解決する課題**: オープンソースのAIモデルをAppleデバイス（iOS、macOS）で効率的にオンデバイス実行するための変換や最適化、統合を行う。
* **想定利用者**: iOS/macOSアプリ開発者、AIエンジニア
* **利用シーン**:
  * Hugging Face上のオープンソースモデルをCore AIフォーマットにエクスポートする
  * PyTorchを用いてカスタムのCore AIモデルを作成する
  * Swiftを使用して、iOS/macOSアプリ内にAIモデルを組み込む

## **3. 主要機能**

* **Model export**: Hugging FaceなどのオープンソースモデルをCore AIフォーマットに変換するレシピの提供。
* **Reusable primitives**: PyTorchで独自のCore AIモデルを構築するための再利用可能なPythonモジュール。
* **Runtime utilities**: macOSおよびiOS上でモデルを実行するための、Core AIフレームワーク上に構築されたSwiftパッケージ。
* **Skills**: コーディングエージェント（Claude Code、Codex CLI、Gemini CLI等）がCore AIを効果的に活用できるようにするためのプラグイン機能。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * macOS and iOS 27.0+
  * Xcode 27.0+
* **インストール/導入**:

  ```bash
  # uvのインストール
  brew install uv
  # もしくは
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

* **クイックスタート**:

  ```bash
  # リポジトリのクローンとモデルの確認
  git clone https://github.com/apple/coreai-models.git && cd coreai-models
  uv run coreai.model.registry --list-models
  ```

## **5. 特徴・強み (Pros)**

* Appleシリコン上でPyTorchモデルを展開・実行するための包括的なワークフロー（coreai-torch等によるエクスポートからSwiftランタイムでの実行まで）。
* iOSやmacOSで実行可能なオンデバイスAIモデルの開発に最適化されている。
* コーディングエージェント（Claude, Codex, Gemini）に対応したプラグインが提供されている。

## **6. 弱み・注意点 (Cons)**

* macOSおよびiOS 27.0+、Xcode 27.0+という非常に最新の環境が要求される。
* Appleのエコシステム（Core AI）に依存しており、他プラットフォーム（Android, Windows）への展開には不向き。
* 日本語に関する特段のドキュメントやサポートはない（標準的なOSSと同様）。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **無料プラン** | 無料 | BSD 3-Clause Licenseの下でオープンソースとして利用可能 |

* **課金体系**: 完全無料（オープンソース）
* **無料トライアル**: なし（常に無料）

## **8. 導入実績・事例**

* **導入企業**: Apple（公式プロジェクト）
* **導入事例**: 公開事例なし。ただし、Appleプラットフォーム向けのアプリ開発において、オンデバイスAI機能の統合基盤としての利用が想定される。
* **対象業界**: ソフトウェア開発、モバイルアプリ開発

## **9. サポート体制**

* **ドキュメント**: GitHub上のREADME.mdやソースコード内のコメント。
* **コミュニティ**: 現在はプルリクエストの受け付けを一時停止しているが、コミュニティからのフィードバックは歓迎している。
* **公式サポート**: GitHub Issues を通じたバグ報告や機能リクエストの受け付け。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: SwiftパッケージおよびPythonモジュールとして提供。
* **外部サービス連携**: Hugging Faceからのモデルエクスポート、Claude Code / Codex CLI / Gemini CLI等のコーディングエージェントとの連携プラグイン。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Swift (iOS/macOS)** | ◎ | 公式にSwiftパッケージが提供されており、シームレスに統合可能 | 動作環境が最新のOS/Xcodeに限定される |
| **Python (PyTorch)** | ◎ | モデルのオーサリングやエクスポート用ツールが提供されている | 実行は最終的にAppleのランタイムに依存 |
| **Android / Windows** | × | 非対応 | Core AIはAppleのフレームワークであるため動作しない |

## **11. セキュリティとコンプライアンス**

* **認証**: 特になし（ライブラリとしての提供のため）。
* **データ管理**: オンデバイスで実行されるため、データが外部サーバーに送信されずプライバシーが保たれる。
* **準拠規格**: 公式サイトでは公開されていない。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CLIツールおよびライブラリとしてのAPI提供。UIは持たない。
* **学習コスト**: Core AIやPyTorch、Swiftの知識が必要。また、モデル変換等のエコシステムに慣れるための学習曲線がある。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 提供されているコーディングエージェント用Skills（`working-with-coreai`, `model-authoring`, `model-compression-exploration`）を利用して、モデルの圧縮やエクスポートをシステム的に探索・構築する。
* **陥りやすい罠 (Antipatterns)**:
  * 動作環境（macOS/iOS 27.0+）を満たしていない古いデバイスや環境での開発や実行を試みること。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: G2、Capterra、ITreviewにレビューの登録なし（開発者向けOSSライブラリのため）。
* **総合評価**: 不明
* **ポジティブな評価**:
  * (レビューサイトでの評価は見つからず)
* **ネガティブな評価 / 改善要望**:
  * (レビューサイトでの評価は見つからず)
* **特徴的なユースケース**:
  * (レビューサイトでの評価は見つからず)

## **15. 直近半年のアップデート情報**

* **2026-06-14**: Fix Gemma stop tokens: read additional EOS from tokenizer config
* **2026-06-13**: Whisper export traced with dynamic shapes
* **2026-06-13**: rename export backend from MLIR to CoreAI

(出典: [GitHub Commits](https://github.com/apple/coreai-models/commits/main/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | ツールA | ツールB | ツールC |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | 機能1 | ◎<br><small>補足説明</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> |
| **カテゴリ特定** | 機能2 | ◯<br><small>補足説明</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> |
| **エンタープライズ** | SSO | -<br><small>該当なし</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> |
| **非機能要件** | 日本語対応 | △<br><small>ドキュメントは英語中心</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> | -<br><small>比較対象なし</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | Appleデバイス向けのAIモデル統合・変換ツール | オンデバイス実行に最適化 | 対応環境が限定的 | AppleプラットフォームでAIを活用する場合 |
| **ツールA** | 比較対象なし | - | - | - |
| **ツールB** | 比較対象なし | - | - | - |
| **ツールC** | 比較対象なし | - | - | - |

## **17. 総評**

* **総合的な評価**:
  * Apple製デバイス上で効率的にAIモデル（LLMや画像生成等）をオンデバイス実行するための不可欠な開発者向けエコシステムです。オープンソースモデルとの互換性を提供しており、強力な基盤となります。
* **推奨されるチームやプロジェクト**:
  * 最新のiOSやmacOS上で高度なAI機能を提供するアプリケーションを開発しているチーム。
* **選択時のポイント**:
  * 環境要件（macOS/iOS 27.0+）を満たせるかどうか、クロスプラットフォーム展開が不要かどうかを確認した上で導入を決定するべきです。
