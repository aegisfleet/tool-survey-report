---
title: Hermes Agent 調査レポート
tool_name: Hermes Agent
tool_reading: エルメスエージェント / ハーメスエージェント
category: 汎用AIエージェント
developer: Nous Research
official_site: https://hermes-agent.nousresearch.com
date: '2026-04-10'
last_updated: '2026-06-04'
tags:
  - オープンソース
  - エージェント
  - 自動化
description: 自己改善ループを備え、時間とともに成長し、サーバー上で動作してタスクを自律的に実行するAIエージェント。
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - 研究者
  latest_highlight: v0.15.2にてMacOS/Windows/Linux対応のデスクトップアプリがリリースされ、Nous Portalのサブスクリプション(Free/Plus/Super/Ultra)が導入されました。
  update_frequency: 高
evaluation:
  score: 80
  base_score: 70
  plus_points:
    - point: 5
      reason: 高度な自律性と自己改善能力を持つ。
    - point: 3
      reason: オープンソースであり、セルフホストが可能。
    - point: 2
      reason: 豊富なプラットフォーム連携が可能。
  minus_points:
    - point: 0
      reason: 特になし
  summary: 自己改善能力と多様な連携が魅力的なOSSエージェント。
links:
  github: https://github.com/NousResearch/hermes-agent
  deepwiki: https://deepwiki.com/NousResearch/hermes-agent
  codewiki: https://codewiki.google/github.com/NousResearch/hermes-agent
  documentation: https://hermes-agent.nousresearch.com/docs/
relationships:
  related_tools:
    - OpenHands
---

# **Hermes Agent 調査レポート**

## **1. 基本情報**

* **ツール名**: Hermes Agent
* **ツールの読み方**: エルメスエージェント / ハーメスエージェント
* **開発元**: Nous Research
* **公式サイト**: [https://hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com)
* **関連リンク**:
  * GitHub: [https://github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
  * ドキュメント: [https://hermes-agent.nousresearch.com/docs/](https://hermes-agent.nousresearch.com/docs/)
* **カテゴリ**: 自律型AIエージェント
* **概要**: Nous Researchによって開発された、時間とともに成長し、自律的にタスクを実行するAIエージェント。サーバー上に常駐し、学習ループを備えているため、使用されるほどに賢くなります。

## **2. 目的と主な利用シーン**

* **解決する課題**: 特定の開発環境やツールに縛られず、様々なプラットフォームからアクセス可能な自律的なAIアシスタントを構築すること。
* **想定利用者**: 開発者、研究者、自動化を求めるユーザー
* **利用シーン**:
  * 定期的なタスクの自動化（スケジュールによるレポート作成やバックアップなど）。
  * 複数プラットフォームをまたぐ会話の継続とアシスト。
  * サーバー上での自律的なスクリプト実行や問題解決。

## **3. 主要機能**

* **自己改善学習ループ**: エージェント自身が経験からスキルを作成し、使用中にそれらを改善し続ける。バックグラウンドでのスキル自律整理機能も搭載。
* **マルチプラットフォーム対応**: Telegram, Discord, Slack, WhatsApp, Signal, Email, WeChat, iMessage, Google Chat, Microsoft Teams, CLIなど20以上のプラットフォームで利用可能。
* **Kanbanマルチエージェント基盤**: タスクの自動分解や複数ワーカーへの割り当て、リトライ等を管理する耐久性のあるボード機能。
* **デスクトップアプリ**: macOS, Windows, Linuxにネイティブ対応したデスクトップアプリケーションが提供され、ローカル環境での利用が容易になりました。
* **ローカルWebダッシュボード & 高度なTUI**: インタラクティブなTUI（React/Ink製）やWebブラウザからエージェントとやり取り・管理ができる。
* **メモリ機能**: セッションをまたいだFTS5によるクロスセッションの記憶の検索・再呼び出し、ユーザーモデリング。
* **スケジュール自動化**: 定期的なバックアップ、監査、日次レポート作成などをスケジュール（Cron）で実行可能。
* **分離されたサンドボックス環境**: Local, Docker, SSH, Singularity, Modal、Daytonaなどのバックエンドで動作可能。
* **ウェブ・ブラウザコントロール**: ウェブ検索、ブラウザの自動化、画像生成やTTS（Text-to-Speech）などに対応。

## **4. 開始手順・セットアップ**

* **前提条件**:
  * macOS 12+, Windows 10/11, 任意のLinuxディストリビューション、WSL2、Android (Termux)。
* **インストール/導入**:
  * **デスクトップアプリの場合**: 公式サイトの[ダウンロードページ](https://hermes-agent.nousresearch.com/desktop#downloads)からOSに合わせたインストーラー（dmg/exe）をダウンロードして実行。
  * **CLI (Linux, macOS, WSL2, Termux)**:
    ```bash
    curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
    ```
  * **CLI (Windows PowerShell)**: ネイティブWindows環境でもWSLなしで動作します。
    ```powershell
    iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
    ```

* **初期設定**:
  * インストール後に以下のコマンドで設定を開始。
  * `hermes setup` （フルセットアップウィザード）
  * `hermes setup --portal` （Nous Portalを利用する場合、OAuthでログインしツールゲートウェイを有効化）
* **クイックスタート**:
  * `hermes` （インタラクティブCLIで会話を開始）
  * `hermes gateway` （Telegramなどのプラットフォーム向けにゲートウェイを起動）

## **5. 特徴・強み (Pros)**

* スキルの自己生成と学習機能があり、使い込むほどパーソナライズされ最適化される。
* Kanbanを用いたマルチエージェントシステムにより、複雑なタスクの並行処理や自動分割が可能。
* ノートPCなどのローカル端末に依存せず、クラウドやサーバー上に展開しやすい。
* 20以上のコミュニケーションプラットフォームとの統合が標準で可能。
* MCP (Model Context Protocol) 統合やプラグインシステムによる高い拡張性を持つ。

## **6. 弱み・注意点 (Cons)**

* セットアップや自前ホスティングに関する技術的な知識がある程度必要（ただし、デスクトップ版のリリースにより導入ハードルは大きく下がっています）。
* 日本語対応はUIやドキュメントでは限定的であり、英語ベースの操作が中心となる。

## **7. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **OSS版 (Bring Your Own Keys)** | 無料 | ソフトウェア自体は無料で利用可能。API利用料やサーバー費用はユーザーが負担。 |
| **Nous Portal: Free** | 無料 | Hermes Agentを利用するためのNous Portalの無料ティア。 |
| **Nous Portal: Plus** | 有料 | Hermes Agentの利用クレジット、300以上のモデルへのアクセス、組み込みツール（Web検索、画像生成など）の利用が含まれる。 |
| **Nous Portal: Super** | 有料 | Plusプランの上位ティア。 |
| **Nous Portal: Ultra** | 有料 | 最上位ティア。 |

* **課金体系**: ソフトウェア自体は無料（MITライセンス）。自身のAPIキーを使用することも、Nous Portalサブスクリプションに加入してすべての機能（300+モデル、Web検索、画像生成、TTS、クラウドブラウザなど）を1つのサブスクリプションでカバーすることも可能です。

## **8. 導入実績・事例**

* **導入企業**: オープンソースツールのため特定の企業名公開は少ない。
* **導入事例**: AIや開発者コミュニティで、個人のアシスタントや開発ワークフローの自動化に利用。
* **対象業界**: ソフトウェア開発、研究、ITインフラストラクチャ。

## **9. サポート体制**

* **ドキュメント**: 公式サイトに充実したドキュメント（[https://hermes-agent.nousresearch.com/docs/](https://hermes-agent.nousresearch.com/docs/)）あり。
* **コミュニティ**: 活発なDiscordコミュニティ（[https://discord.gg/NousResearch](https://discord.gg/NousResearch)）が存在する。
* **公式サポート**: コミュニティベースのサポートが中心。GitHubでのIssue対応。

## **10. エコシステムと連携**

### **10.1 API・外部サービス連携**

* **API**: MCP (Model Context Protocol) を通じて任意のサーバーと連携可能。
* **外部サービス連携**: Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, Home Assistant, WeChat, iMessage, Google Chat, Microsoft Teamsなど、20以上のプラットフォームをサポート。

### **10.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | ツールの拡張やスキル作成がPythonで行われる | 特になし |
| **Docker** | ◎ | サンドボックス化された環境で安全に動作可能 | コンテナ運用の基礎知識が必要 |
| **WSL2** | ◯ | Windows環境でも問題なく動作可能 | ネイティブなWindowsでは動作しない |

## **11. セキュリティとコンプライアンス**

* **認証**: デバイスペアリング、コマンド承認（Command approval）機能あり。
* **データ管理**: コンテナによる分離、名前空間の分離（Namespace isolation）をサポート。
* **準拠規格**: オープンソースのため、各ユーザーの運用環境に依存。

## **12. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: ターミナルUI (TUI) により、マルチライン編集やスラッシュコマンドによる補完が可能で、開発者にとっては使いやすい。
* **学習コスト**: AIエージェントの基本概念や、サーバーホスティング、ターミナル操作に関する知識が必要なため、中程度以上の学習コストがある。

## **13. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * VPSやクラウド上のVMにデプロイし、TelegramやDiscord経由でいつでもどこでもアクセスできるように構成する。
  * 頻繁に実行するタスクは`hermes skills`として保存し、自動化ループに組み込む。
* **陥りやすい罠 (Antipatterns)**:
  * ローカルのラップトップのみで実行すると、エージェントの常駐機能やスケジュール機能が十分に活かせない。

## **14. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub (Star: 46.8k)
* **総合評価**: 非常に高い支持（GitHubスター数から推測）
* **ポジティブな評価**:
  * サーバーで常駐してどこからでもアクセスできる点が画期的。
  * オープンソースでセルフホストできる柔軟性が高い。
* **ネガティブな評価 / 改善要望**:
  * 初期設定が初心者にとってはやや複雑。
* **特徴的なユースケース**:
  * $5のVPSにデプロイし、スマートフォンのTelegramからクラウドインフラの操作やコード作成を指示する。

## **15. 直近半年のアップデート情報**

* **2026-05-29**: v0.15.2 リリース。macOS、Windows、Linux向けのデスクトップアプリがリリース。Windowsネイティブでの動作サポート、Nous Portalとの統合（`hermes setup --portal`）によるAPIキー管理の簡素化が追加されました。
* **2026-05-29**: v0.15.1 リリース。ダッシュボードのループバックモードでのリロードループ修正、MCPやDockerのバグフィックスを実施。
* **2026-05-28**: v0.15.0 "The Velocity Release" リリース。Kanbanマルチエージェント基盤の大幅拡張、Cold-startのパフォーマンス向上、TUIセッションオーケストレーター、新しい画像生成プロバイダーなどを追加。
* **2026-05-16**: v0.14.0 "The Foundation Release" リリース。Grokネイティブ対応、Microsoft Teamsエンドツーエンド連携、X (Twitter) 検索ツール等を追加。
* **2026-05-07**: v0.13.0 "The Tenacity Release" リリース。Kanbanマルチエージェントボード機能の拡充やGoogle Chat対応などを追加。
* **2026-04-30**: v0.12.0 "The Curator Release" リリース。バックグラウンドでのスキル自律整理機能、新しい推論プロバイダ等の追加。
* **2026-04-23**: v0.11.0 "The Interface Release" リリース。React/InkによるTUI刷新、QQBot対応、プラグインシステムの拡張。
* **2026-04-13**: v0.9.0 "The everywhere release" リリース。ローカルWebダッシュボード追加、Termux(Android)対応、iMessage、WeChat対応など。
* **2026-04-08**: Hermes Agent v0.8.0 リリース。バックグラウンドプロセスの自動通知、モデルのライブ切り替え等に対応。

(出典: [GitHub Releases](https://github.com/NousResearch/hermes-agent/releases) )

## **16. 類似ツールとの比較**

### **16.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール | OpenHands | ツールB | ツールC |
|:---:|:---|:---:|:---:|:---:|:---:|
| **基本機能** | 常駐・自律動作 | ◎<br><small>サーバー常駐に最適化</small> | ◯<br><small>標準的なエージェント動作</small> | - | - |
| **拡張機能** | 自己学習スキル | ◎<br><small>スキル自動生成と学習</small> | △<br><small>プロンプトによる指示</small> | - | - |
| **連携** | メッセージング連携 | ◎<br><small>Discord, Telegram等多数</small> | △<br><small>API連携中心</small> | - | - |
| **非機能要件** | セルフホスト | ◎<br><small>オープンソース、Docker等</small> | ◎<br><small>オープンソース</small> | - | - |

### **16.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | サーバー常駐・マルチプラットフォーム対応の自律学習エージェント | Discord等のUI統合が容易、学習ループ | 初心者にはセットアップがやや複雑 | 常にアクセス可能なAIアシスタントをサーバーに置きたい場合 |
| **OpenHands** | ソフトウェア開発に特化したオープンソースエージェント | コード修正やIssue解決が得意 | チャットツール連携は主目的ではない | コーディング作業を完全に自動化したい場合 |

## **17. 総評**

* **総合的な評価**:
  * 単なるコーディングアシスタントにとどまらず、ユーザーの行動を学習し、どこからでもアクセスできる個人用AIコンシェルジュとして非常に優れています。オープンソースでありながら、46.8kという膨大なGitHubスターを集めていることからも、その期待の高さが伺えます。
* **推奨されるチームやプロジェクト**:
  * 自動化を推進したい開発チーム、研究者、最新のAIエージェント機能をいち早く試したいエンジニア。
* **選択時のポイント**:
  * ターミナルやIDEに限定せず、TelegramやDiscordなど日常的なコミュニケーションツールからシームレスにAIエージェントにタスクを依頼したい場合に強力な選択肢となります。
