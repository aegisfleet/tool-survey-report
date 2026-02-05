---
title: "Vitest 調査レポート"
tool_name: "Vitest"
tool_reading: "ヴィーテスト / ヴァイテスト"
category: "テスティングフレームワーク"
developer: "Vitest Core Team"
official_site: "https://vitest.dev/"
date: "2026-02-06"
last_updated: "2026-02-06"
tags:
  - "Testing"
  - "Vite"
  - "JavaScript"
  - "TypeScript"
description: "Viteネイティブの高速なユニットテストフレームワーク。Jest互換のAPIを持ち、高速なHMRと優れたDXを提供する。"
quick_summary:
  has_free_plan: true
  starting_price: "無料 (OSS)"
  target_users:
    - "Web開発者"
    - "フロントエンドエンジニア"
  latest_highlight: "v4.0.7のリリースによる安定性向上 (2026年2月現在)"
  update_frequency: "高"
evaluation:
  score: 92
  base_score: 70
  plus_points:
    - point: 10
      reason: "Viteベースによる圧倒的な実行速度"
    - point: 5
      reason: "Jest互換で移行が容易"
    - point: 5
      reason: "WatchモードとHMRの快適な開発体験"
    - point: 2
      reason: "活発な開発コミュニティ"
  minus_points: []
  summary: "現代のWeb開発において最適な選択肢の一つ。特にViteを使用しているプロジェクトでは必須級。"
links:
  github: "https://github.com/vitest-dev/vitest"
  documentation: "https://vitest.dev/guide/"
relationships:
  related_tools:
    - "playwright"
    - "cypress"
---

## 1. 基本情報

### 概要
Vitestは、Viteをベースとした次世代のJavaScript/TypeScriptテスティングフレームワークです。Viteの高速なHMR（Hot Module Replacement）機能を活用し、開発者に即座にフィードバックを提供することを目的としています。Jestと高い互換性を持ち、設定レスでTypeScriptやJSXをサポートするなど、モダンなWeb開発に必要な機能を備えています。

### 主要なリンク
- **公式サイト**: https://vitest.dev/
- **ドキュメント**: https://vitest.dev/guide/
- **GitHubリポジトリ**: https://github.com/vitest-dev/vitest

### 開発元・運営元
Vitest Core Teamによって開発・メンテナンスされているオープンソースプロジェクトです。Vue.jsやViteのエコシステムと深く関わっています。

## 2. 機能調査

### 主な機能
- **Viteネイティブ**: Viteの設定（`vite.config.ts`）を共有し、変換パイプラインを統一できます。
- **Jest互換API**: `describe`, `it`, `expect` など、JestでおなじみのAPIを提供しており、移行が容易です。
- **スマートWatchモード**: 依存関係グラフを解析し、変更に関連するテストのみを高速に再実行します。
- **In-source Testing**: ソースコードファイル内に直接テストを記述できる機能を提供します（Rustのテスト機能に類似）。
- **Vitest UI**: ブラウザベースのGUIでテスト結果を可視化し、インタラクティブにデバッグ可能です。
- **スナップショットテスト**: Jest互換のスナップショットテストをサポートしています。
- **ネイティブコードカバレッジ**: v8またはistanbulを使用した高速なコードカバレッジ計測が可能です。
- **ベンチマーク**: `bench` 関数を使用して、関数のパフォーマンス計測（ベンチマーク）を行うことができます。

## 3. 料金・プラン調査

Vitestは完全なオープンソースソフトウェア（MITライセンス）であり、無料で使用できます。

| プラン名 | 料金 | 対象 | 機能 |
| :--- | :--- | :--- | :--- |
| **OSS** | **無料** | 全ユーザー | 全機能利用可能 |

## 4. 開始手順・セットアップ調査

### 前提条件
- Node.js (バージョン18以上推奨)
- npm, yarn, pnpm, bun などのパッケージマネージャ

### インストール
プロジェクトに開発依存関係として追加します。

```bash
npm install -D vitest
```

### 初期設定
`package.json` にテストスクリプトを追加します。

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

### Hello World
テストファイル（例: `sum.test.ts`）を作成します。

```ts
import { expect, test } from 'vitest'

function sum(a, b) {
  return a + b
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

実行コマンド:
```bash
npm test
```

## 5. ユーザーレビュー分析

オープンソースのデベロッパーツールであるため、G2やCapterraなどのBtoBレビューサイトよりも、GitHubや開発者コミュニティでの評価が主要な指標となります。

| プラットフォーム | 評価 | 分析 |
| :--- | :--- | :--- |
| **GitHub Stars** | 非常に高い | 非常に多くのスターを獲得しており、注目度が高い。 |
| **State of JS** | 高い満足度 | State of JSなどの調査で高い満足度と利用意向を記録している。 |

**ユーザーの声（要約）:**
- **ポジティブ**: 「Jestよりも圧倒的に速い」「設定がViteと共有できて楽」「Watchモードが快適」。
- **ネガティブ**: 「Jestの高度な機能（一部のモックなど）と完全互換ではない場合がある」「大規模プロジェクトでのメモリ使用量」。

## 6. 競合分析

最も主要な競合であるJestと比較します。

### 機能比較表

| 機能 | Vitest | Jest | 備考 |
| :--- | :---: | :---: | :--- |
| **実行速度** | ◎ | △ | VitestはViteベースで高速 |
| **設定の容易さ** | ◎ | ◯ | VitestはVite設定を共有可能 |
| **TypeScript対応** | ◎ | △ | Vitestは標準対応、Jestは要`ts-jest`等 |
| **ESM対応** | ◎ | △ | Vitestはネイティブサポート |
| **ブラウザモード** | ◯ | △ | Vitestは実験的サポートあり |
| **ドキュメント** | ◯ | ◎ | Jestは歴史が長く情報量が多い |

### 詳細比較
- **Jest**: 長年のスタンダードであり、豊富なプラグインと情報量が強み。Viteを使用しないプロジェクトや、レガシーな構成のプロジェクトでは引き続き有力な選択肢。
- **Vitest**: Viteを使用しているプロジェクトでは、設定の共有や速度面で圧倒的なメリットがある。新規プロジェクトやモダンなスタックではVitestが選ばれる傾向にある。

## 7. 最新情報の収集

**v4系 (2026年時点)**
- **パフォーマンス向上**: 実行エンジンと依存関係解析の最適化。
- **Browser Modeの安定化**: ブラウザ環境でのコンポーネントテスト機能の強化。
- **Typecheckの統合**: テスト実行と同時に型チェックを行う機能の改善。

## 8. ツール評価の算出

**総合スコア: 92/100**

- **基準点**: 70点
- **加点項目**:
  - 機能の充実度 (+10): 高速な実行、Watchモード、UI、ベンチマークなど機能豊富。
  - コストパフォーマンス (+5): 無料で高機能。
  - 活発な開発 (+5): 頻繁なアップデートとコミュニティの活発さ。
  - ユーザー評価 (+2): 開発者からの支持が厚い。
- **減点項目**: なし

## 10. エコシステムと連携調査

### 技術スタックとの相性

| 技術 | 相性 | 説明 |
| :--- | :---: | :--- |
| **Vite** | ◎ | ベストマッチ。設定を共有でき、導入が最も容易。 |
| **React** | ◎ | 公式テンプレート等で推奨されている。 |
| **Vue** | ◎ | Vue公式のエコシステムの一部として扱われることが多い。 |
| **Svelte** | ◎ | SvelteKitなどで標準的に利用可能。 |
| **Node.js** | ◯ | バックエンドロジックのテストにも利用可能。 |

### API・外部サービス連携
- **GitHub Actions**: CIでの実行が容易。
- **VS Code**: 公式拡張機能により、エディタ上でテスト実行・デバッグが可能。

## 11. ベストプラクティス調査

- **Modern Practices**:
  - `vite.config.ts` でテスト設定を管理し、ビルド設定と統一する。
  - **In-source Testing**を活用し、実装のすぐそばにテストを配置して凝集度を高める（小規模なユニットテスト）。
  - CIでは `--run` フラグを使用してWatchモードを無効化する。
- **Anti-patterns**:
  - Jest用の複雑なグローバル設定や変換を無理にVitestに持ち込む（Vitestの標準機能で代替できないか検討する）。

## 12. 関連ツールの更新 (双方向性)

- `playwright.md`, `cypress.md` との整合性を確認（これらは主にE2Eテストツールであり、ユニットテストのVitestとは住み分けが可能）。
