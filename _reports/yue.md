---
title: YuE 調査レポート
tool_name: YuE
tool_reading: ユエ
category: AI音楽生成
developer: HKUST, M·A·P, Tokenwave.AI, NYU, Stanford, MBZUAI, NOIZ, ACE Studio
official_site: https://map-yue2.github.io/
date: '2026-09-12'
last_updated: '2026-09-12'
tags:
  - AI
  - 生成AI
  - 音楽生成
  - オープンソース
description: テキストプロンプト（歌詞とスタイル）から高品質なボーカルと伴奏を含む音楽を生成するオープンソースの音楽生成AIモデル。
quick_summary:
  has_free_plan: true
  is_oss: true
  starting_price: 無料
  target_users:
    - 開発者
    - 音楽クリエイター
    - AI研究者
  latest_highlight: WildSongBenchでSuno v5/v6に匹敵するフロンティア品質（YuE2）を達成
  update_frequency: 中
evaluation:
  score: 85
  base_score: 70
  plus_points:
    - point: 8
      reason: 商用SaaSに匹敵するフロンティア品質のボーカル・音楽生成が可能
    - point: 4
      reason: オープンソースであり、ローカル環境で無制限に生成可能
    - point: 5
      reason: Symbolic planningによる音楽の細かな編集やカバー生成に対応
  minus_points:
    - point: -2
      reason: 実行には高性能なGPU環境（24GB VRAM等）が必要
  summary: 商用ツールに匹敵する品質と、ホワイトボックスな制御性を併せ持つ強力なオープンソース音楽生成AI。
links:
  github: https://github.com/multimodal-art-projection/YuE
  deepwiki: https://deepwiki.com/multimodal-art-projection/YuE
  codewiki: https://codewiki.google/github.com/multimodal-art-projection/YuE
  documentation: https://github.com/multimodal-art-projection/YuE#readme-ov-file
relationships:
  related_tools:
    - Suno
---

# **YuE 調査レポート**

## **1. 基本情報**

* **ツール名**: YuE
* **ツールの読み方**: ユエ
* **開発元**: HKUST, M·A·P, Tokenwave.AI, NYU, Stanford, MBZUAI, NOIZ, ACE Studio
* **公式サイト**: [https://map-yue2.github.io/](https://map-yue2.github.io/)
* **関連リンク**:
  * GitHub: [https://github.com/multimodal-art-projection/YuE](https://github.com/multimodal-art-projection/YuE)
  * ドキュメント: [https://github.com/multimodal-art-projection/YuE#readme-ov-file](https://github.com/multimodal-art-projection/YuE#readme-ov-file)
* **カテゴリ**: AI音声/音楽生成
* **概要**: テキストプロンプト（歌詞とスタイル）から、高品質なボーカルと伴奏を含む完全な音楽を生成するオープンソースのAIモデル。商用サービスに匹敵するフロンティア品質の音楽生成をローカル環境で実現する。

## **2. 目的と主な利用シーン**

* **解決する課題**: 商用音楽生成AIの利用制限やブラックボックス性を解消し、ローカル環境で完全に制御可能な高品質音楽生成基盤を提供する。
* **想定利用者**:
  * AI・音楽技術の研究者や開発者
  * 高度な音楽クリエイター
  * インディーゲーム開発者
* **利用シーン**:
  * 高品質なオリジナル楽曲・ボーカル曲の生成
  * 既存楽曲のメロディやコード進行を保持したまま別ジャンルへのカバー（アレンジ）生成
  * Agentを用いたインタラクティブな音楽編集（歌詞やコードの修正、楽器の変更など）

## **3. 主要機能**

* **フルソング生成**: 歌詞とジャンル・ムード等のテキストプロンプトを指定するだけで、ボーカルと伴奏が融合した楽曲を生成できる。
* **Symbolic Planning（シンボリックプランニング）**: 最終的な音声を生成する前に、メロディとコード進行の設計図（ABC譜）を明示的に生成し、ユーザーやAgentが編集可能にする。
* **ゼロショットカバー生成**: 元のボーカルメロディを保持しつつ、新しいスタイルやジャンルの伴奏に合わせて楽曲を再解釈・カバー生成できる。
* **エージェントによる対話的編集（Agentic Editing）**: 提供されている`yue2-music`スキルを用いることで、AIエージェントと対話しながらコード進行やテンポ、歌詞、ジャンルを調整できる。
* **MERT2/SheetSage2連携**: 音楽理解モデル（MERT2）や音声からの採譜モデル（SheetSage2）を統合し、音声から楽譜への変換や分析を行える。

## **4. 動作原理・システム構成**

* **アーキテクチャ**: ローカル実行型のAIモデル構成（PyTorchベース）。
* **主要コンポーネントとデータフロー**:
  * 歌詞とスタイルプロンプトがAR-NAR Mixture-of-Transformersバックボーンに入力される。
  * **Score & Semantic Tokens生成**: バックボーンが自己回帰的（AR）に楽譜（Score）と意味的音楽トークン（Semantic Tokens）を生成。
  * **Acoustic Latents生成**: Flow Matchingを用いて音響潜在変数（Acoustic Latents）を生成。
  * **Audio Decoding**: VAE（Variational Autoencoder）が音響潜在変数をデコードし、48kHzステレオの非量子化オーディオを出力する。
* **特筆すべき要素技術**:
  * **AR-NAR Mixture-of-Transformers**: 生成の計画（楽譜）と具体化（音声）を1つのバックボーンに統合。
  * **Flow Matching**: 高品質な音声波形生成を実現。

## **5. 開始手順・セットアップ**

* **前提条件**:
  * OS: Linux推奨
  * ランタイム: Python 3.12
  * 必要なハードウェア: NVIDIA GPU (BF16サポート、VRAM 24GB以上)
* **インストール/導入**:

  ```bash
  git clone https://github.com/multimodal-art-projection/YuE.git
  cd YuE
  python3.12 -m venv .venv
  source .venv/bin/activate
  python -m pip install --upgrade pip
  python -m pip install .
  ```

* **初期設定**:
  * 初回実行時にHugging Faceからモデルファイル（YuE2-3B等）が自動的にダウンロードされる。
* **クイックスタート**:
  ```bash
  python examples/generate.py --output outputs/first-song
  ```

## **6. 特徴・強み (Pros)**

* **オープンソースでフロンティア品質**: 完全なオープンソースでありながら、ベンチマーク（WildSongBench）においてSuno v5/v6に匹敵する品質を実現。
* **ホワイトボックス的な制御性**: 音楽生成の過程でABC譜を明示的に扱うため、コード進行やメロディラインをユーザーが直接編集できる。ブラックボックスな一発生成になりがちな他のAIと大きく異なる。
* **カバー生成と編集の自由度**: 既存の楽曲構造を維持しつつ、全く新しいジャンルへのカバー（Zero-shot Cover）や対話的なアレンジが可能。

## **7. 弱み・注意点 (Cons)**

* **高いハードウェア要件**: ローカルで実行するには24GB以上のVRAMを持つNVIDIA GPUが必要であり、一般的なPCでの動作は難しい。
* **環境構築のハードル**: SaaSのようにブラウザで簡単に利用できるわけではなく、Pythonやコマンドライン操作、GPU環境構築の知識が要求される。
* **ライセンス制約**: コードはApache 2.0だが、モデルウェイトはCC BY-NC 4.0（非商用利用のみ）である点に注意が必要。

## **8. 料金プラン**

| プラン名 | 料金 | 主な特徴 |
|---------|------|---------|
| **オープンソース** | 無料 | GitHubからコードとHugging Faceからモデルをダウンロードして利用可能。 |

* **課金体系**: 完全無料（動作環境のクラウドGPUコストなどは自費）。
* **無料トライアル**: なし。

## **9. 導入実績・事例**

* **導入企業**: AIモデルの性質上、特定の企業での商用導入事例は公開されていない。
* **導入事例**:
  * AIエージェントに`yue2-music`スキルを組み込み、自律的に音楽を編曲・再解釈させる活用事例。
  * WildSongBenchによる音楽生成品質の評価研究で活用されている。
* **対象業界**: 音楽AI研究機関、オープンソースコミュニティ、個人クリエイター。

## **10. サポート体制**

* **ドキュメント**: GitHubのREADMEおよび`docs`ディレクトリ内に詳細なガイドが用意されている。
* **コミュニティ**: Discordコミュニティが存在し、情報交換やサポートが行われている。
* **公式サポート**: GitHub Issuesでのバグ報告や、メール（gezhang@umich.edu）での問い合わせに対応。

## **11. エコシステムと連携**

### **11.1 API・外部サービス連携**

* **API**: `yue2`パッケージとしてPython APIが提供されており、スクリプトから`YuE2Pipeline`を呼び出すことが可能。
* **外部サービス連携**:
  * **Hugging Face**: モデルウェイト（YuE2-3B, YuE2-Vae, SheetSage2など）のダウンロード連携。
  * **AIエージェントプラットフォーム**: `yue2-music skill`を使用し、自律型AIに音楽生成スキルを付与できる。

### **11.2 技術スタックとの相性**

| 技術スタック | 相性 | メリット・推奨理由 | 懸念点・注意点 |
|:---|:---:|:---|:---|
| **Python** | ◎ | 公式APIがPythonベースで提供 | Python 3.12環境の構築が必要 |
| **PyTorch** | ◎ | モデルのベースフレームワーク | VRAM 24GB以上のGPU環境が必要 |
| **Hugging Face** | ◎ | モデルの取得・管理がシームレス | 初回ダウンロード時に大容量の通信が発生 |

## **12. セキュリティとコンプライアンス**

* **認証**: ローカル実行モデルのため、独自の認証メカニズムは不要。
* **データ管理**: データはすべてユーザーのローカル環境または実行環境に保存される。
* **準拠規格**: オープンソースプロジェクトのため、特定の認証（SOC2等）は取得していない。

## **13. 操作性 (UI/UX) と学習コスト**

* **UI/UX**: CUI（コマンドライン）およびPythonスクリプト経由での操作となるため、GUIベースのツールに比べると取っ付きにくさはある。
* **学習コスト**: Python環境の構築やHugging Faceの利用経験があれば容易だが、セットアップ経験がないユーザーにとっては学習コストが高い。

## **14. ベストプラクティス**

* **効果的な活用法 (Modern Practices)**:
  * **カバー生成でのcot指定**: カバー曲を生成する際は、`cot="melody"`設定を使用し、コード記号のない楽譜を提供することで、新しいスタイルに合わせて伴奏を柔軟に適応させる。
  * **Symbolic Planningの活用**: 最終的な音声生成（`cot="off"`）を行うのではなく、一度`plan()`でABC譜を書き出し、エージェントや手動で編集してからレンダリングを行う手法が推奨される。
* **陥りやすい罠 (Antipatterns)**:
  * **VRAM不足環境での実行**: 24GB未満のGPUで無理に実行しようとすると、メモリ不足（OOM）で失敗する。
  * **商用利用の誤認**: モデルウェイトがCC BY-NC 4.0であるため、生成した音楽を無断で商用利用することはライセンス違反となる。

## **15. ユーザーの声（レビュー分析）**

* **調査対象**: GitHub Discussions, Discord, X(Twitter)
* **総合評価**: レビューサイトでのスコアは存在しないが、技術コミュニティでの評価は非常に高い。
* **ポジティブな評価**:
  * 「オープンソースでここまでのボーカル曲が作れるようになったのは驚異的」
  * 「中間出力として楽譜（ABC譜）が出るため、プロンプトガチャにならず意図した修正が効く」
* **ネガティブな評価 / 改善要望**:
  * 「要求スペックが高すぎて、個人の一般的なゲーミングPCでは動かせない」
  * 「ライセンスがCC BY-NC 4.0なので、商用プロダクトに組み込めないのが惜しい」
* **特徴的なユースケース**:
  * AIエージェントと組み合わせて、対話形式で既存の曲をジャズ風などにアレンジさせていく実験的プロジェクト。

## **16. 直近半年のアップデート情報**

* **2026-09-12**: YuE2リリース。Suno v5/v6に匹敵する品質を実現し、Symbolic Planningやゼロショットカバー機能を追加。

(出典: [YuE GitHub Releases](https://github.com/multimodal-art-projection/YuE/releases))

## **17. 類似ツールとの比較**

### **17.1 機能比較表 (星取表)**

| 機能カテゴリ | 機能項目 | 本ツール (YuE) | Suno | ElevenLabs |
|:---:|:---|:---:|:---:|:---:|
| **基本機能** | ボーカル生成品質 | ◎<br><small>商用SaaSに匹敵</small> | ◎<br><small>高品質・自然</small> | ◯<br><small>音楽生成機能あり</small> |
| **制御性** | 楽譜レベルの編集 | ◎<br><small>ABC譜を介した細かな編集可能</small> | ×<br><small>生成後の手動編集は不可</small> | ×<br><small>非対応</small> |
| **利用形態** | ローカル実行 | ◎<br><small>GPU環境で無制限実行</small> | ×<br><small>クラウドSaaSのみ</small> | ×<br><small>クラウドSaaSのみ</small> |
| **非機能要件** | オープンソース | ◎<br><small>コードはApache 2.0</small> | ×<br><small>プロプライエタリ</small> | ×<br><small>プロプライエタリ</small> |

### **17.2 詳細比較**

| ツール名 | 特徴 | 強み | 弱み | 選択肢となるケース |
|---------|------|------|------|------------------|
| **本ツール** | OSS音楽生成基盤 | 中間楽譜の編集による高い制御性、OSSであること | 高スペックGPU必須、モデルが非商用ライセンス | 研究開発、ローカルで細かく楽曲をコントロール・アレンジしたい場合。 |
| **Suno** | クラウド型音楽SaaS | 初心者でも直感的で非常に簡単に高品質な曲が作れる | 細かなメロディやコード進行の指定が難しい | 手軽に素早く完成された楽曲が欲しい場合。 |
| **ElevenLabs** | 総合音声AI | 音声合成の品質が最高峰、効果音も生成可 | 音楽生成はまだ発展途上 | ナレーションやセリフを含む総合的な音声コンテンツ制作。 |

## **18. 総評**

* **総合的な評価**:
  YuE（特にYuE2）は、オープンソースの音楽生成AIにおいて画期的なマイルストーンとなるモデルである。商用の最先端サービスに匹敵する品質を達成しつつ、「Symbolic Planning」を導入したことで、AI任せのブラックボックス生成から、クリエイターが介入・編集可能なホワイトボックス生成への道を拓いた点が高く評価できる。
* **推奨されるチームやプロジェクト**:
  * **AI・音楽研究チーム**: 生成プロセスを詳細に分析し、新しいAI音楽アプリケーションのプロトタイプを開発するプロジェクト。
  * **高度な音楽クリエイター**: 単なるプロンプト入力にとどまらず、ABC譜の段階で和音やメロディを修正し、出力結果をコントロールしたいユーザー。
* **選択時のポイント**:
  * ローカルでの実行環境（24GB VRAM以上のGPU）が確保できるかどうかが第一関門となる。
  * 生成結果に対して細かい制御（コード進行の変更やカバー）を行いたい場合はYuEが適しているが、手軽さを求める場合はSuno等のSaaSが推奨される。
  * モデルウェイトが非商用ライセンスであるため、ビジネス用途での利用には注意が必要。
