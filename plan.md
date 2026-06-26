1. **アップデート情報の更新**
   - `_reports/magicpod.md` を編集して、`15. 直近半年のアップデート情報` の先頭に以下の情報を追加する。
     - 2026-06-09: クラウドブラウザテストの実行エンジンとして「Playwright」の正式サポートを開始。
     - 2026-06-09: AIエージェントがWebサイトを自動巡回して品質問題を検出するWebサイト品質チェックツール「SiteRover（サイトローバー）」の提供を開始。
     - 2026-04-07: AIエージェントがテスト失敗の原因を自動で分析・報告する「失敗分析」機能をリリース。
   - 既存の履歴はそのまま保持する。
   - `出典` のURLを `https://magicpod.com/news/` に修正する。
2. **フロントマターの更新**
   - `last_updated` を "2026-06-26" に更新する。
   - `quick_summary.latest_highlight` を "2026年6月にブラウザテストエンジンでPlaywrightを正式サポートし、Webサイト品質チェックツール「SiteRover」を提供開始" に更新する。
   - `relationships.related_tools` から `_reports` に存在しない `ネムラナイ` を削除する。
3. **主要機能・連携の更新**
   - `3. 主要機能` に、AIエージェントによる「失敗分析」機能と「SiteRover（品質チェック）」機能のリストを追加する。
   - `10.1 API・外部サービス連携` に、実行環境として「Playwright」を追記する。
4. **競合比較の最新化**
   - `_reports/magicpod.md` の `16.1 機能比較表` の `テスト設計・マネージド` の行について、MagicPodの評価を `×` から `△` に変更し、`<small>一部AI支援あり</small>` に更新する。
   - `_reports/autify.md`、`_reports/mabl.md` について、それぞれの `relationships.related_tools` から存在しない `ネムラナイ` を削除する。また `_reports/selenium.md` 等で関連性が双方向であることを確認済みであり、すでに MagicPod が記載されているため、これ以上関連レポートに変更を加えない。
5. **変更の検証 (Verification)**
   - `read_file` ツールを用いて `_reports/magicpod.md`、`_reports/autify.md`、`_reports/mabl.md` の内容を確認し、変更とフォーマットが正しく適用されているか確認する。
6. **リンクチェック**
   - `PYTHONPATH=. uv run scripts/check_links.py _reports/magicpod.md --browser` を実行し、リンクエラーがないか確認する。
7. **プレコミットステップ**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
8. **コミットと提出**
   - 修正をコミットし、提出する。
