# AGENTS.md

## 概要

エージェントは複数の作業指示を扱う。
基本行動はこのファイルに定義されるが、特定のタスクを行う場合は以下の指示書を参照する。

## タスク指示書一覧

- レポートの作成/更新: [task-report-create-or-update.md](./task-report-create-or-update.md)
- カテゴリ/タグ/関連付けの整理: [task-organizing-category-tags.md](./task-organizing-category-tags.md)

## 新規レポート追加の手順

新規にレポートを追加する場合は、以下の手順に従って作業を行う。

### ステップ1: レポートの作成

1. [task-report-create-or-update.md](./task-report-create-or-update.md) を参照する
2. `templates/template.md` のテンプレートを基にレポートを作成する
3. 調査完了後のチェックリストを確認し、全項目をクリアする

### ステップ2: 関連レポートの整理

1. [task-organizing-category-tags.md](./task-organizing-category-tags.md) を参照する
2. 作成したレポートを「単一レポート中心の作業」の対象として、以下を整理する：
   - カテゴリが標準語彙に従っているか確認
   - タグが正規化リストに従っているか確認・統一
   - 関連レポートとの `relationships` を設定（双方向リンクの整合性を含む）
3. 関連レポートにタグを追加する場合は、**各ツールごとに個別調査**を行い妥当性を確認する
4. 編集前チェックリストを確認し、コミットする

### 注意事項

- レポート作成と関連付け整理は**必ずこの順序**で実行すること
- 関連レポートへの変更は最小限に留め、既存の正確な情報を損なわないこと
- 不明点がある場合は公式情報を優先し、推測での変更は避けること
