---
title: "Fluorite Game Engine 調査レポート"
tool_name: "Fluorite Game Engine"
tool_reading: "フローライト"
category: "モバイル開発"
developer: "Toyota Connected North America"
official_site: "https://fluorite.game/"
date: "2026-02-10"
last_updated: "2026-02-10"
tags:
  - "モバイル開発"
  - "ゲームエンジン"
  - "Flutter"
  - "ECS"
  - "3D"
description: "Flutterと完全に統合された初のコンソールグレードゲームエンジン。C++製ECSコアとGoogle Filamentレンダラーを採用。"

quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料 (推定)"
  target_users:
    - "Flutter開発者"
    - "ゲーム開発者"
  latest_highlight: "公式サイトにてプレビュー情報公開 (Coming Soon)"
  update_frequency: "不明"

evaluation:
  score: 75
  base_score: 70
  plus_points:
    - point: 5
      reason: "Flutterとの完全統合という独自の強み"
    - point: 3
      reason: "Toyota Connectedによる開発という信頼性"
  minus_points:
    - point: -3
      reason: "現時点で詳細ドキュメントやリポジトリが未公開"
  summary: "Flutterで本格的な3Dゲームを開発できる可能性を秘めた期待のエンジン。現在はプレビュー段階。"

links:
  documentation: "https://fluorite.game/"

relationships:
  related_tools:
    - "Flutter"
---

# **Fluorite Game Engine 調査レポート**

## **1. 基本情報**

* **ツール名**: Fluorite Game Engine (フローライト ゲームエンジン)
* **ツールの読み方**: フローライト
* **開発元**: Toyota Connected North America
* **公式サイト**: [https://fluorite.game/](https://fluorite.game/)
* **関連リンク**:
  * ドキュメント: [公式サイト参照](https://fluorite.game/) (Coming Soon)
* **カテゴリ**: ゲームエンジン / Flutterパッケージ
* **概要**: Flutterと完全に統合された初のコンソールグレードゲームエンジン。C++で書かれた高性能なECS（Entity-Component-System）コアを持ちながら、Dartでゲームロジックを記述できる。レンダリングにはGoogleのFilamentを採用し、Vulkanなどの最新APIに対応している。

## **2. 目的と主な利用シーン**

* **解決する課題**:
  * Flutterアプリ内での本格的な3D表現の実現
  * Dart言語による高パフォーマンスなゲーム開発
  * ゲームロジックとUI（Flutter Widget）のシームレスな連携
* **想定利用者**:
  * Flutterエンジニア
  * モバイルゲーム開発者
  * 組み込み機器（車載など）での3D UI開発者
* **利用シーン**:
  * モバイル向けの3Dゲーム開発
  * Flutterアプリへのリッチな3Dコンテンツの組み込み
  * 3D空間と2D UIが密接に連携するインタラクティブなアプリケーション

## **3. 主要機能**

* **High-performance ECS core**: C++で記述されたデータ指向のECSアーキテクチャにより、低スペックなハードウェアでも高いパフォーマンスを発揮。Dart APIを通じて操作可能。
* **Model-defined touch trigger zones**: Blender等の3Dツールで「クリック可能なゾーン」を定義し、特定のイベントをトリガーできる機能。3D空間内のUI作成を簡素化する。
* **Console-grade 3D Rendering**: GoogleのFilamentレンダラーを搭載。Vulkan対応、物理ベースレンダリング（PBR）、ポストプロセスエフェクト、カスタムシェーダーをサポート。
* **Hot Reload**: Flutter/Dartのホットリロード機能をサポート。シーンの変更を数フレーム以内に反映し、高速なイテレーションが可能。
* **Flutter Integration**: `FluoriteView`ウィジェットを使用して、複数の3DビューをFlutter UI内に配置可能。ゲームエンティティとUIウィジェット間で状態を共有できる。

## **4. 開始手順・セットアップ**

* **現状**: 公式サイトには「More coming soon...」とあり、詳細なセットアップ手順やインストール方法は未公開。
* **予想される手順**:
  * `pubspec.yaml` にパッケージを追加
  * Flutterプロジェクト内で `FluoriteView` を配置
  * Blender等で作成したアセットをインポート

## **5. 特徴・強み (Pros)**

* **Flutterとの完全統合**: 既存のFlutterエコシステム（Dart言語、DevTools、Widgetシステム）をそのまま活用できる。
* **高性能なレンダリング**: Filament採用により、モバイルでもコンソール級のグラフィックスを実現。
* **開発効率**: ホットリロード対応により、試行錯誤のサイクルを高速化できる。
* **UIとの連携**: 3DシーンとFlutter UI（2D）の連携が容易で、複雑なインタラクションを実現しやすい。

## **6. 弱み・注意点 (Cons)**

* **情報不足**: 現時点（2026年2月）では詳細なドキュメントや実績が公開されていない。
* **コミュニティの規模**: UnityやGodot、Flameに比べると、登場したばかりでありコミュニティや知見が少ないと予想される。
* **成熟度**: "More coming soon" の段階であり、プロダクション利用には検証が必要。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **不明** | - | 公式サイトに記載なし |

* **補足**: Toyota Connectedによる開発であり、Flutterパッケージとして公開される場合、オープンソース（無料）である可能性が高いが、現時点では未確定。

## **8. 導入実績・事例**

* **導入企業**: Toyota Connected North America (開発元)
* **導入事例**: 公開事例なし (Coming Soon)
* **対象業界**: ゲーム業界、自動車業界（HMIツールとしての利用の可能性）

## **9. サポート体制**

* **ドキュメント**: 公式サイトに記載予定だが、現在は未公開。
* **コミュニティ**: 不明。
* **公式サポート**: 不明。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: Dart APIを提供し、C++コアと通信。
* **Blender連携**: 3Dモデル内でのタッチゾーン定義など、DCCツールとの連携機能あり。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Flutter** | ◎ | 完全統合されており、Widgetとして利用可能 | - |
| **Dart** | ◎ | ゲームロジックをDartで記述可能 | - |
| **Blender** | ◯ | タッチゾーン定義などで連携機能あり | - |

## **11. セキュリティとコンプライアンス**

* **情報なし**: 現時点ではセキュリティやコンプライアンスに関する公開情報はない。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: Flutter開発者にとっては馴染み深いWidgetベースの構築が可能と予想される。
* **学習コスト**: ECS（Entity-Component-System）アーキテクチャの理解が必要だが、Flutter/Dartの知識があれば参入しやすい。

## **13. ベストプラクティス**

* **Modern Practices**:
  * UIはFlutter Widget、3DロジックはFluoriteのECSで管理し、状態共有機能を活用する。
  * ホットリロードを活用して、シーン構築のトライアンドエラーを高速に行う。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: 公式サイトおよび公開情報
* **総合評価**: 評価なし (未リリース/プレビュー段階のため)
* **コメント**: 現時点で一般ユーザーによるレビューは存在しない。

## **15. 直近半年のアップデート情報**

* **2026-02-10**: 調査日現在、公式サイトにてプレビュー情報公開中。"More coming soon..." のステータス。

(出典: [公式サイト](https://fluorite.game/))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | Fluorite | Flame | Unity | Godot |
|:---:|:---|:---:|:---:|:---:|:---:|
| **コア機能** | 3D対応 | ◎<br><small>Filament採用</small> | △<br><small>2D主体</small> | ◎<br><small>業界標準</small> | ◎<br><small>3D強化中</small> |
| **開発環境** | Flutter統合 | ◎<br><small>完全統合</small> | ◎<br><small>完全統合</small> | △<br><small>Embed可能だが重い</small> | △<br><small>Embed可能だが重い</small> |
| **言語** | Dart対応 | ◎ | ◎ | ×<br><small>C#</small> | ×<br><small>GDScript/C#</small> |
| **レンダリング** | グラフィックス | ◎<br><small>Console-grade</small> | ◯<br><small>2D中心</small> | ◎<br><small>最高峰</small> | ◯<br><small>標準的</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **Fluorite** | Flutter統合の3Dエンジン | Flutter内での高品質3D、Dartで完結 | 実績・情報の少なさ | Flutterアプリで本格的な3D表現が必要な場合 |
| **Flame** | Flutter製2Dエンジン | 豊富なコンポーネント、軽量、実績あり | 3D機能は限定的 | 2Dゲームやシンプルな3D要素の場合 |
| **Unity** | 業界標準3Dエンジン | 圧倒的な機能とエコシステム | Flutter統合は複雑、容量が大きい | 大規模な3Dゲーム開発 |

## **17. 総評**

* **総合的な評価**:
  * Flutterエコシステム待望の「本格的な3Dゲームエンジン」として非常に期待度が高い。C++コアによるパフォーマンスとDartによる生産性のバランス、Google Filamentによる描画品質は魅力的である。ただし、現時点では情報が限定的であり、実際の開発体験や安定性は未知数。
* **推奨されるチームやプロジェクト**:
  * Flutterでの開発スキルを持つチーム
  * モバイルアプリの一部として高品質な3D体験を組み込みたいプロジェクト
* **選択時のポイント**:
  * 正式リリースやドキュメントの公開を待ってから検証することを推奨。Flutterで「Unityを使うほどではないが、Flameでは物足りない」という3Dニーズに合致する可能性がある。
