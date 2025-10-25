# レポート関係性システム - コンテンツ管理者向けガイド

## 概要

このガイドでは、レポート間の関係性をフロントマターで管理し、相互参照リンクを自動生成するシステムの使用方法について説明します。このシステムにより、関連するツールやサービス間の関係性を明確にし、Wikiのような相互参照機能を実現できます。

## フロントマター関係性スキーマ

### 基本構造

各レポートファイルのフロントマターに以下の`relationships`セクションを追加できます：

```yaml
---
title: "ツール名 調査レポート"
tool_name: "ツール名"
# ... 他の既存フィールド

relationships:
  parent: "親レポートのtool_name"
  children:
    - "子レポート1のtool_name"
    - "子レポート2のtool_name"
  related_tools:
    - "関連レポート1のtool_name"
    - "関連レポート2のtool_name"
---
```

### フィールドの説明

#### `parent` (文字列、オプション)

- **用途**: このツールの親となるツールを指定
- **値**: 親レポートの`tool_name`フィールドの値
- **例**: `parent: "GitHub"`

#### `children` (配列、オプション)

- **用途**: このツールの子となるツールのリストを指定
- **値**: 子レポートの`tool_name`フィールドの値の配列
- **例**:

  ```yaml
  children:
    - "GitHub Actions"
    - "GitHub Copilot"
  ```

#### `related_tools` (配列、オプション)

- **用途**: このツールと関連する兄弟ツールのリストを指定
- **値**: 関連レポートの`tool_name`フィールドの値の配列
- **例**:

  ```yaml
  related_tools:
    - "GitLab"
    - "Bitbucket"
  ```

## 関係性の種類と例

### 1. 親子関係 (Parent-Child)

親子関係は、あるツールが別のツールの一部または拡張機能である場合に使用します。

#### 例1: GitHubエコシステム

```yaml
# GitHub (親)
relationships:
  children:
    - "GitHub Actions"
    - "GitHub Copilot"

# GitHub Actions (子)
relationships:
  parent: "GitHub"

# GitHub Copilot (子)
relationships:
  parent: "GitHub"
```

#### 例2: Microsoft製品群

```yaml
# Microsoft 365 (親)
relationships:
  children:
    - "Microsoft Teams"
    - "Microsoft Power Automate"

# Microsoft Teams (子)
relationships:
  parent: "Microsoft 365"
```

### 2. 兄弟関係 (Sibling/Related Tools)

兄弟関係は、同じカテゴリや用途で競合・補完するツール間で使用します。

#### 例1: IDEツール

```yaml
# VS Code
relationships:
  related_tools:
    - "Cursor"
    - "Kiro"

# Cursor
relationships:
  related_tools:
    - "VS Code"
    - "Kiro"

# Kiro
relationships:
  related_tools:
    - "VS Code"
    - "Cursor"
```

#### 例2: CI/CDツール

```yaml
# GitHub Actions
relationships:
  parent: "GitHub"
  related_tools:
    - "GitLab"
    - "Jenkins"

# GitLab
relationships:
  related_tools:
    - "GitHub Actions"
    - "Jenkins"
```

### 3. 複合関係

一つのツールが親子関係と兄弟関係の両方を持つ場合：

```yaml
# GitHub Actions
relationships:
  parent: "GitHub"           # GitHubの子ツール
  related_tools:             # 他のCI/CDツールとの兄弟関係
    - "GitLab"
    - "Jenkins"
    - "CircleCI"
```

## 実装例

### 完全な例: GitHub エコシステム

#### GitHub (github.md)

```yaml
---
title: "GitHub 調査レポート"
tool_name: "GitHub"
category: "バージョン管理"
# ... 他のフィールド
relationships:
  children:
    - "GitHub Actions"
    - "GitHub Copilot"
  related_tools:
    - "GitLab"
---
```

#### GitHub Actions (github-actions.md)

```yaml
---
title: "GitHub Actions 調査レポート"
tool_name: "GitHub Actions"
category: "CI/CD"
# ... 他のフィールド
relationships:
  parent: "GitHub"
  related_tools:
    - "GitLab"
    - "Jenkins"
---
```

#### GitHub Copilot (github-copilot.md)

```yaml
---
title: "GitHub Copilot 調査レポート"
tool_name: "GitHub Copilot"
category: "AIコーディング支援"
# ... 他のフィールド
relationships:
  parent: "GitHub"
  related_tools:
    - "GitLab Duo"
    - "Cursor"
    - "Kiro"
---
```

## 表示される関係性セクション

関係性が定義されたレポートでは、以下のような「関連ツール」セクションが自動生成されます：

```text
関連レポート

親レポート
├─ GitHub

子レポート
├─ GitHub Actions
└─ GitHub Copilot

関連レポート
├─ GitLab
├─ Bitbucket
└─ Azure DevOps
```

各ツール名はクリック可能なリンクとなり、対応するレポートページに遷移できます。

## トラブルシューティング

### よくある問題と解決方法

#### 1. 関係性が表示されない

**症状**: フロントマターに関係性を定義したが、レポートページに関連ツールセクションが表示されない

**原因と解決方法**:

- **tool_nameの不一致**: 参照している`tool_name`が実際のレポートファイルの`tool_name`と一致していない
  - 解決方法: 参照先レポートの`tool_name`フィールドを確認し、正確な値を使用する
- **YAMLの構文エラー**: フロントマターのYAML構文が正しくない
  - 解決方法: YAMLの構文を確認し、インデントやクォートを修正する

#### 2. 存在しないツールへの参照

**症状**: 関係性で参照しているツールのレポートが存在しない

**解決方法**:

- 参照先のレポートファイルが`_reports/`ディレクトリに存在することを確認
- 参照先レポートの`tool_name`フィールドが正しく設定されていることを確認

#### 3. 双方向の関係性が一致しない

**症状**: AがBを子として定義しているが、BがAを親として定義していない

**解決方法**:

- 関係性は双方向で定義することを推奨
- 親子関係の場合、親側で`children`に追加し、子側で`parent`を設定
- 兄弟関係の場合、両方のツールで相互に`related_tools`に追加

#### 4. 循環参照

**症状**: A→B→A のような循環する親子関係が発生

**解決方法**:

- 親子関係では循環参照は避ける
- 相互に関連するツールの場合は`related_tools`を使用

### デバッグのヒント

1. **tool_nameの確認**

   ```bash
   # 全レポートのtool_nameを確認
   grep -r "tool_name:" _reports/
   ```

2. **YAML構文の検証**
   - オンラインYAMLバリデーターを使用してフロントマターの構文を確認

3. **関係性の可視化**
   - 複雑な関係性を図で描いて整理することを推奨

## ベストプラクティス

### 1. 命名規則

- `tool_name`は一意で分かりやすい名前を使用
- スペースや特殊文字は避け、必要に応じてハイフンを使用
- 例: `"GitHub Actions"`, `"Microsoft Teams"`, `"VS Code"`

### 2. 関係性の設計

- **親子関係**: 明確な包含関係がある場合のみ使用
- **兄弟関係**: 同じカテゴリや競合関係にあるツール間で使用
- **過度な関係性は避ける**: 本当に関連性の高いツールのみを関係性に含める

### 3. メンテナンス

- 新しいレポートを追加する際は、既存の関連ツールとの関係性も更新
- 定期的に関係性の整合性をチェック
- 廃止されたツールの関係性は削除

### 4. ドキュメント化

- 複雑な関係性がある場合は、コメントで説明を追加
- チーム内で関係性の定義基準を共有

## 更新履歴

- 2025-10-26: 初版作成
- システムの基本的な使用方法とトラブルシューティングガイドを追加
