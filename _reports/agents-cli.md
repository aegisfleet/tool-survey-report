---
# === フロントマター ===
# 【必須項目】
title: "agents-cli 調査レポート"
tool_name: "agents-cli"
tool_reading: "エージェンツ・シーエルアイ"
category: "AIエージェント基盤"
developer: "Google"
official_site: "https://google.github.io/agents-cli/"
date: "2026-04-25"
last_updated: "2026-04-25"
tags:
  - "AI"
  - "エージェント"
  - "オープンソース"
  - "開発者ツール"
  - "CLI"
description: "AIコーディングエージェントにGoogle CloudでのADKエージェント構築・デプロイ機能を追加するCLIツール"

# 【クイックサマリー】ホーム画面のカード表示用
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: "無料"
  target_users:
    - "開発者"
  latest_highlight: "コーディングエージェントにAgent RuntimeやCloud Runへのデプロイ機能を付与"
  update_frequency: "中"

# 【ツール評価】100点満点、基準点70点からの加減算方式
evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: "お気に入りのコーディングエージェント（Gemini CLI, Claude Codeなど）にGoogle Cloud向けのスキルを追加できる"
    - point: 5
      reason: "開発から評価、デプロイメントまでCLIで一貫して行える"
  minus_points:
    - point: 0
      reason: "特筆すべき減点なし"
  summary: "既存のAIコーディングアシスタントを活用してGoogle Cloud向けのエンタープライズ対応エージェントを構築する強力な補助ツール"

# 【任意項目】該当するもののみ記載
links:
  github: "https://github.com/google/agents-cli"
  deepwiki: "https://deepwiki.com/google/agents-cli"
relationships:
  parent: "Gemini Enterprise Agent Platform"
---

# **agents-cli 調査レポート**

## **1. 基本情報**

* **ツール名**: agents-cli
* **ツールの読み方**: エージェンツ・シーエルアイ
* **開発元**: Google
* **公式サイト**: [https://google.github.io/agents-cli/](https://google.github.io/agents-cli/)
* **関連リンク**:
  * GitHub: [https://github.com/google/agents-cli](https://github.com/google/agents-cli)
* **カテゴリ**: AIエージェント基盤
* **概要**: agents-cliは、Gemini CLIやClaude Code、Codexなどの既存のコーディングアシスタントに、Google Cloud上でエンタープライズレベルのAIエージェントを構築・スケーリング・デプロイするためのスキルを提供するCLIツールです。

## **2. 目的と主な利用シーン**

* **解決する課題**: 開発者がGoogle CloudやAgent Development Kit (ADK)の各サービス・CLIを個別に学習することなく、普段使っているコーディングエージェントのスキルを拡張して効率的にクラウドネイティブなAIエージェントを構築できるようにします。
* **想定利用者**: AIエージェントの開発者、ソフトウェアエンジニア
* **利用シーン**:
  * AIコーディングアシスタントを用いたADK（Agent Development Kit）ベースのエージェントの新規プロジェクトの構築（スキャフォールディング）
  * エージェントのローカル環境での評価・比較
  * Agent RuntimeやCloud Run、GKEなどのGoogle Cloud環境へのデプロイメントパイプラインの構築

## **3. 主要機能**

* **Agent Skillsの提供**: コーディングエージェントにモデル選択、ADK Python APIの使い方、評価方法、Google Cloudへのデプロイ方法などの知識を注入します。
* **プロジェクトのスキャフォールディング**: `agents-cli scaffold` コマンドを使用して、新しいエージェントプロジェクトの雛形を作成したり、既存プロジェクトにデプロイメント機能やCI/CD機能を追加できます。
* **エージェントの評価（Eval）**: `agents-cli eval run` や `agents-cli eval compare` を用いて、エージェントの評価セットを実行したり、結果を比較検証できます。
* **Google Cloudへのデプロイ**: `agents-cli deploy` を使ってCloud RunやGKE、Agent Runtimeへのデプロイを自動化します。
* **インフラストラクチャ・プロビジョニング**: CI/CDインフラやデータストアインフラ（RAG用）のセットアップを自動化するコマンドを提供します。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * Python 3.11以上
  * uv
  * Node.js
* **インストール/導入**:

  ```bash
  # CLIとスキルのインストール
  uvx google-agents-cli setup

  # もしくはスキルのみをインストール（コーディングエージェント側で設定）
  npx skills add google/agents-cli
  ```

* **初期設定**:
  ローカルでの開発（作成、実行、評価）にはAI Studio APIキーが利用可能。クラウドデプロイにはGoogle Cloudのプロジェクトと認証が必要です。
* **クイックスタート**:
  Gemini CLIやClaude Codeなどのコーディングエージェントを起動し、「agents-cliを使って、冗長なテキストを短く技術的な内容に圧縮するエージェントを構築して」のように指示します。

## **5. 特徴・強み (Pros)**

* AIコーディングエージェントそのものを置き換えるのではなく、既存のアシスタント（Gemini CLI, Claude Codeなど）を強化してGoogle Cloudエコシステムに特化させられる点。
* Google Cloudが提供するAgent RuntimeやADK（Agent Development Kit）の利用を極めて簡略化し、インフラ学習コストを下げられます。
* コマンド自体もスタンドアロンで使用可能であり、コーディングエージェントがなくても利用できる柔軟性。

## **6. 弱み・注意点 (Cons)**

* Python、uv、Node.jsなど複数のツール依存があり、環境構築に多少の手間がかかる可能性があります。
* 基本的にGoogle Cloud（Gemini Enterprise Agent Platform等）へデプロイするためのツールであるため、AWSやAzureへのデプロイ用途には向きません。
* ドキュメントは英語が主体であり、日本語対応は十分ではありません。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **無料** | 無料 | CLIおよびスキルの利用自体はオープンソースであり無料（※裏で動くGoogle CloudリソースやGemini APIの利用には別途課金が発生します） |

* **課金体系**: クラウドインフラ利用およびLLM APIコールの従量課金

## **8. 導入実績・事例**

* **導入事例**: 公開事例なし。ただし、Google CloudやGeminiを活用したエンタープライズエージェント構築分野での利用が想定されています。

## **9. サポート体制**

* **ドキュメント**: [公式ドキュメント](https://google.github.io/agents-cli/)
* **コミュニティ**: GitHub Issuesを活用したバグ報告や機能要望のコミュニティ
* **公式サポート**: GitHub Issues経由での対応や、フィードバック用メールアドレス（agents-cli@google.com）が用意されています。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: 内部的にはGoogle Cloud APIs（Cloud Run, GKE, Cloud Trace等）およびGemini APIを利用します。
* **外部サービス連携**: Gemini CLI, Claude Code, Codex などの主要AIコーディングアシスタントとシームレスに連携。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | ベースとなるADKの主要言語。公式に完全にサポートされている | 特になし |
| **Google Cloud (Cloud Run / GKE)** | ◎ | 公式デプロイメントターゲット | 他のクラウド（AWS/Azure）へのデプロイは非推奨 |

## **11. セキュリティとコンプライアンス**

* **データ管理**: インフラはユーザー自身のGoogle Cloudプロジェクト内にデプロイされ、リソースの管理責任はユーザーに帰属します。
* **準拠規格**: （CLIツール自体の直接的な規格というより、デプロイ先のGoogle Cloudのコンプライアンス基準に依存します）

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: 一般的なコマンドラインインターフェースとして動作し、コーディングエージェントからの直接利用を想定しているため、人間が複雑な引数を覚える負担は大きく軽減されます。
* **学習コスト**: ADKやGoogle Cloudの仕様を学ぶ必要がなく、プロンプトで指示するだけで開発が進められるため、クラウド構築の学習コストは低く抑えられます。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * 既存のプロジェクトに対して `agents-cli scaffold enhance` コマンドを実行し、CI/CDやデプロイ機能、RAG構成を後から安全に追加する。
  * クラウドデプロイ前に、`agents-cli eval run` を活用してローカルでのエージェント評価を徹底する。
* **陥りやすい罠 (Antipatterns)**:
  * エージェントデプロイ時に必要なGoogle Cloudの権限やプロジェクト設定が不足していると、CLIやコーディングアシスタント側でエラーとなり解決が難航することがあります。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub
* **総合評価**: GitHubスター数 900以上 (2026年時点)
* **ポジティブな評価**:
  * コーディングエージェントに直接スキルを追加できる仕組みが斬新で便利。
  * Google Cloudへのエージェントデプロイが劇的に簡単になる。
* **ネガティブな評価 / 改善要望**:
  * 初期リリース段階（プレビュー）のため、機能やサポート面での発展途上な部分がある。

## **15. 直近半年のアップデート情報**

* （公式GitHub ReleasesやCHANGELOGに基づく最新情報が随時更新されます。プロジェクト自体が新しいツールのため、リリースノート等はリポジトリ上で確認してください。）

(出典: [GitHubリポジトリ](https://github.com/google/agents-cli))

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | agents-cli | Copilot CLI | AWS Copilot |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | クラウドデプロイ自動化 | ◎<br><small>Google Cloudのエージェント専用</small> | ×<br><small>非対応</small> | ◎<br><small>AWSコンテナ向け</small> |
| **カテゴリ特定** | AIアシスタントへのスキル提供 | ◎<br><small>専用スキル追加に対応</small> | ×<br><small>非対応</small> | ×<br><small>非対応</small> |
| **カテゴリ特定** | エージェント評価(Eval)の統合 | ◯<br><small>コマンドで実行可</small> | ×<br><small>非対応</small> | ×<br><small>非対応</small> |
| **非機能要件** | 日本語対応 | △<br><small>ドキュメントは英語主体</small> | ◯<br><small>一部日本語対応</small> | ◯<br><small>公式ドキュメントが豊富</small> |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **agents-cli** | AIアシスタントにGCPの知識を付与するCLI | 既存のコーディングAIを拡張しGCP特化にできる | 対象がGoogle CloudベースのADKエージェントに限定される | GCPで本格的なエージェントを構築したい場合 |
| **AWS Copilot CLI** | AWSコンテナアプリ用デプロイCLI | ECSやApp Runnerへのデプロイが非常に簡単 | AIエージェント開発特化の機能はない | AWS上で通常のコンテナアプリを動かす場合 |

## **17. 総評**

* **総合的な評価**:
  agents-cliは、LLMを用いたエージェント開発において、インフラやデプロイ周りの煩雑な作業を普段使いのAIコーディングアシスタントに丸投げできるようにする非常に優れたユーティリティです。
* **推奨されるチームやプロジェクト**:
  Google Cloudを基盤とし、GeminiモデルやADK（Agent Development Kit）を用いたエンタープライズグレードのAIエージェントを開発しているチーム。
* **選択時のポイント**:
  ゼロからエージェント基盤を構築するよりも、GCPのエコシステム（Agent Runtime, Cloud Run, Cloud Trace）を活用して素早く本番稼働させたいケースに最適です。
