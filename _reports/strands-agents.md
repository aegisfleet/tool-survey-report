---
# 【必須項目】
title: "Strands Agents 調査レポート"
tool_name: "Strands Agents"
tool_reading: "ストランズ エージェンツ"
category: "AI Agent Framework"
developer: "Amazon Web Services"
official_site: "https://strandsagents.com/"
date: "2026-02-04"
last_updated: "2026-02-04"
tags:
  - "AI Agent"
  - "LLM"
  - "Python"
  - "TypeScript"
  - "Open Source"
  - "AWS"
description: "数行のコードでAIエージェントを構築できる、モデル駆動型の軽量かつ柔軟なフレームワーク。"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  starting_price: "無料 (OSS)"
  target_users:
    - "AIエンジニア"
    - "ソフトウェア開発者"
  latest_highlight: "コミュニティ主導のツールパッケージとエージェントビルダーの提供"
  update_frequency: "高"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 78
  base_score: 70
  plus_points:
    - point: 5
      reason: "AWSが支援する信頼性と、OpenAI/Bedrock等の主要モデルへの柔軟な対応"
    - point: 3
      reason: "Pydanticを用いた構造化出力のサポートが強力で、型安全な開発が可能"
    - point: 3
      reason: "数行でエージェントを構築できるシンプルなAPI設計"
  minus_points:
    - point: -3
      reason: "LangChain等の先行ツールに比べるとエコシステムやコミュニティはまだ発展途上"
  summary: "軽量かつ型安全なエージェント開発において有力な選択肢。特にAWS環境との親和性が高いが、プロバイダーに依存しない設計も魅力。"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/strands-agents"
  documentation: "https://strandsagents.com/"
relationships:
  related_tools:
    - "LangChain"
---

## 1. 基本情報

### 概要
Strands Agentsは、AIエージェントを構築・実行するためのオープンソースフレームワークです。「Model-driven approach（モデル駆動型アプローチ）」を掲げ、開発者が意図した通りに動作するエージェントを、最小限のコードで実装することを目指しています。Amazon Web Services (AWS) によって開発・メンテナンスされていますが、特定のモデルプロバイダーにロックインされることなく、OpenAIやAmazon Bedrockなど多様なモデルを利用可能です。

### 主な特徴（キーワード）
- **Model-driven**: モデルの能力を最大限に引き出す設計
- **Provider Agnostic**: OpenAI, Amazon Bedrock, Ollama (via Custom) 等に対応
- **Type Safe**: Pydanticを用いた構造化出力の標準サポート
- **Lightweight**: 必要最小限の依存関係とシンプルなAPI

### 運営元・開発元情報
- **開発元**: Amazon Web Services (AWS)
- **設立年**: 2006年 (AWS)
- **本拠地**: アメリカ合衆国 シアトル

### 関連リンク
- [公式サイト](https://strandsagents.com/)
- [GitHubリポジトリ](https://github.com/strands-agents)
- [PyPI - strands-agents](https://pypi.org/project/strands-agents/)

## 2. 機能調査

### 主要機能リスト

1. **マルチモデルサポート**
   - OpenAI (GPT-4o等) や Amazon Bedrock (Claude, Titan等) を統一的なインターフェースで利用可能。
   - カスタムモデルプロバイダーの実装も容易。

2. **ツール（Function Calling）統合**
   - Pythonのデコレータ (`@tool`) を使って、関数を簡単にエージェントのツールとして登録可能。
   - 外部API呼び出しやファイル操作などをエージェントに実行させることができる。
   - `strands-agents-tools` パッケージにより、コミュニティ製のツールも利用可能。

3. **構造化出力 (Structured Output)**
   - Pydanticモデルを定義することで、エージェントからの応答を特定のJSONスキーマに従ったオブジェクトとして受け取ることが可能。
   - 型安全性が保証され、後続の処理プログラムとの連携がスムーズになる。

4. **会話・セッション管理**
   - `SlidingWindowConversationManager` などにより、会話履歴の管理やコンテキストウィンドウの制御を自動化。
   - `SessionManager` を用いた状態の永続化にも対応。

5. **開発支援ツール**
   - `strands-agents-builder`: エージェント自身を使ってエージェントを構築する支援ツールを提供。

### 利用シーン
- **チャットボット開発**: 文脈を理解し、ツールを使って回答する高度なチャットボット。
- **データ抽出・加工**: 非構造化テキストから特定のデータを抽出し、構造化データとして保存するタスク。
- **自動化エージェント**: ユーザーの指示に基づいてAPIを操作し、業務を代行するエージェント。

## 3. 料金・プラン調査

Strands Agents 自体はオープンソースソフトウェア（Apache License 2.0を想定）であり、**無料**で利用できます。
ただし、エージェントが利用するLLM（大規模言語モデル）のAPI利用料が別途発生します。

| プラン | 料金 | 対象 | 備考 |
|:---|:---|:---|:---|
| **OSS Library** | **無料** | 全ユーザー | ライブラリ本体の利用は無料。商用利用も可（ライセンス準拠）。 |

**発生する可能性のある外部コスト:**
- **OpenAI API**: モデルのトークン使用量に応じた従量課金。
- **Amazon Bedrock**: モデルの推論時間やトークン数に応じたAWS利用料。

## 4. 開始手順・セットアップ調査

### 前提条件
- **OS**: クロスプラットフォーム (Windows, macOS, Linux)
- **ランタイム**: Python 3.10 以上
- **APIキー**: OpenAI API Key または AWS Credentials (Bedrock利用時)

### インストール手順

pipを使用してパッケージをインストールします。

```bash
# 基本パッケージ
pip install strands-agents

# ツール群とビルダー（オプション）
pip install strands-agents-tools strands-agents-builder
```

### 初期設定
環境変数にAPIキーを設定するか、コード内で直接指定します。

```bash
export OPENAI_API_KEY="sk-..."
```

### Hello World (Python)

OpenAIのモデルを使用した最もシンプルなエージェントの例です。

```python
from strands_agents.agent import Agent
from strands_agents.models.openai import OpenAIModel

# モデルの初期化
model = OpenAIModel(model_id="gpt-4o")

# エージェントの作成
agent = Agent(model=model)

# エージェントの実行
response = agent("こんにちは、Strands Agentsについて教えてください。")
print(response)
```

## 5. ユーザーレビュー分析

Strands Agentsは比較的新しいフレームワークであるため、G2やCapterraなどの大手レビューサイトにはまだ掲載がありません。
GitHubや技術コミュニティでの反応に基づくと、以下の点が評価されています。

- **ポジティブ評価**:
  - 「APIが直感的で、LangChainよりも学習コストが低い」
  - 「AWS Bedrockとの統合がスムーズで、AWSユーザーにとって使いやすい」
  - 「Pydanticとの親和性が高く、型安全なコードが書きやすい」

- **ネガティブ評価・課題**:
  - 「ドキュメントやサンプルがまだ少ない」
  - 「エコシステムの広さではLangChainに及ばない」
  - 「破壊的変更が入る可能性がある（開発初期段階のため）」

## 6. 競合分析

| 機能 | Strands Agents | LangChain | AutoGen |
|:---|:---:|:---:|:---:|
| **学習コスト** | **◎** (低) | △ (高) | ◯ (中) |
| **エコシステム** | △ | **◎** | ◯ |
| **マルチエージェント** | ◯ | ◯ | **◎** |
| **AWS統合** | **◎** | ◯ | ◯ |
| **構造化出力** | **◎** | ◯ | △ |

### 詳細比較

- **vs LangChain**:
  LangChainは圧倒的な機能と連携数を誇りますが、その分複雑で抽象度が高く、学習コストが高いという課題があります。Strands Agentsはより「Pythonic」でシンプルなAPIを提供し、必要な機能（ツール実行、履歴管理）に絞って実装されているため、軽量なエージェントを素早く作りたい場合に適しています。

- **vs AutoGen**:
  AutoGenはマルチエージェント間の会話や協調動作に特化しています。Strands Agentsもマルチエージェントをサポートしていますが、どちらかというと単体エージェントの構築や、AWSリソースとの連携に強みがあります。

## 7. 最新情報の収集

公式ドキュメントおよびGitHubリポジトリに基づく直近の動向です。

- **2025年 (最新)**:
  - **コミュニティツールの拡充**: `strands-agents-tools` パッケージにより、ファイルシステム操作やWeb検索などのツールが容易に導入可能に。
  - **エージェントビルダーの公開**: 自然言語でエージェントを生成できる `strands-agents-builder` の提供。
  - **ドキュメントの整備**: PythonおよびTypeScript向けのAPIリファレンスが拡充。

## 8. ツール評価の算出

**スコア: 78 / 100**

- **基準点**: 70
- **加点**:
  - **機能の充実度 (+5)**: シンプルながらも実用的な機能（ツール、構造化出力、履歴管理）が揃っている。AWS支援による信頼性。
  - **コストパフォーマンス (+3)**: オープンソースで無料。軽量でリソース効率が良い。
- **減点**:
  - **ユーザー評価・実績 (0)**: 新興ツールのため実績はこれから。ただし期待値は高い。
  - **エコシステム (0)**: 競合と比較すると連携ライブラリ数は少ないが、標準的なPythonツールが使えるため大きなマイナスではない。

## 10. エコシステムと連携調査

### 技術スタックとの相性

| 技術 | 相性 | 説明 |
|:---|:---:|:---|
| **Python** | **◎** | メインのSDK。Pydantic等の標準的なエコシステムと完全に統合。 |
| **TypeScript** | **◯** | TypeScript向けのSDKも提供されており、Web開発者も利用可能。 |
| **Amazon Bedrock** | **◎** | ファーストクラスサポート。AWS認証やモデル切替がスムーズ。 |
| **OpenAI** | **◎** | 標準サポート。APIキーのみで即座に利用可能。 |

### SDK情報
- **Python SDK**: `strands-agents` (PyPI)
- **TypeScript SDK**: `strands-agents` (npm)

## 11. ベストプラクティス調査

- **Pydanticによる型定義**:
  構造化出力を利用する際は、必ずPydanticモデルでスキーマを定義し、型安全性を確保することが推奨されます。これにより、LLMの出力揺れを防ぎ、アプリケーションの堅牢性が向上します。

- **ツールのモジュール化**:
  エージェントが使用するツールは、独立した関数として定義し、`@tool` デコレータで修飾するスタイルが推奨されます。ツールを別ファイルに切り出すことで、テストや再利用が容易になります。

- **環境変数の管理**:
  APIキーなどの機密情報は、コードにハードコードせず、`.env` ファイルや環境変数を通じて管理することが強く推奨されます。

## 12. 関連ツールの更新 (双方向性)

今回の調査で、Strands AgentsがLangChainの有力な代替・競合となりうることが確認されました。
既存の `_reports/langchain.md` において、競合リストや比較表の更新を検討する余地がありますが、現時点ではStrands Agentsの知名度がまだ限定的であるため、即時の更新は行わず、今後の普及状況をモニタリングします。
