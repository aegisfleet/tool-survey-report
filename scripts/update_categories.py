import os
import re
import glob

# マッピング定義
# "旧カテゴリ（絵文字あり・なし共通）" : "新カテゴリ"
category_map = {
    # 統合
    'リンター/フォーマッタ': 'コード品質/静的解析',
    'コード品質': 'コード品質/静的解析',
    'AIコードエディタ': 'AIコーディング支援',
    'AI検索エンジン': 'AI検索/ブラウザ拡張',
    'AIブラウザ拡張機能': 'AI検索/ブラウザ拡張',
    '開発者生産性分析': 'プロジェクト管理/生産性',
    'プロジェクト管理': 'プロジェクト管理/生産性',
    'API/仕様管理': 'ドキュメント/ナレッジ',
    'ナレッジ管理': 'ドキュメント/ナレッジ',
    'セキュリティ・コンプライアンス': 'セキュリティ/解析',
    'セキュリティテスト': 'セキュリティ/解析',
    'セキュリティ': 'セキュリティ/解析',
    'RPAツール': 'ワークフロー自動化',
    'ビジネスツール': 'ビジネス/業務ツール',
    'コミュニケーション': 'ビジネス/業務ツール',
    'EC/決済': 'ビジネス/業務ツール',
    '人事労務': 'ビジネス/業務ツール',
    '顧客管理': 'ビジネス/業務ツール',
    '勤怠管理': 'ビジネス/業務ツール',
    '開発者ツール': '開発ユーティリティ',
    'Developer Tools': '開発ユーティリティ',
    '開発ツール': '開発ユーティリティ',
    '生成AI': 'AIチャット/アシスタント',

    # テスト/QAの分割（デフォルトは "テスト生成/品質QA" とし、E2E/ブラウザ系は後で処理）
    'テスト/QA': 'テスト生成/品質QA',
    'テスト管理': 'テスト生成/品質QA',

    # 自律型AIエージェントの分割（デフォルトは汎用AIとし、キーワードで判定）
    '自律型AIエージェント': '汎用AIエージェント',
    'AIエージェント / ブラウザ自動化': 'ブラウザ操作エージェント',
    'AIエージェント': '汎用AIエージェント',
    'AIエージェントフレームワーク': 'AIエージェント基盤',
}

# 既存の有効な新カテゴリ（これらに該当する場合は絵文字削除のみ行う）
valid_categories = [
    'AIコーディング支援', 'コード品質/静的解析', 'AI検索/ブラウザ拡張', 'コーディングエージェント',
    'ブラウザ操作エージェント', '汎用AIエージェント', 'AIチャット/アシスタント', 'AIエージェント基盤',
    'LLMプラットフォーム', 'MCPサーバー/基盤', 'AI開発ライブラリ', 'ターミナル/シェル',
    '開発ユーティリティ', 'OS/プラットフォーム', '言語ランタイム/実行環境', 'ビルドツール/ランタイム',
    'パッケージ管理', 'プロジェクト管理/生産性', '開発ライフサイクル管理', 'セキュリティ/解析',
    'ドキュメント/ナレッジ', 'IDE/エディタ', 'Webフレームワーク', 'モバイル開発', 'バージョン管理',
    'E2E/ブラウザテスト', 'テスト生成/品質QA', '構成管理', 'インフラ/クラウド', '監視/可観測性',
    'CDN/セキュリティ', 'ビジネス/業務ツール', 'ワークフロー自動化', 'データ分析', 'デザインツール',
    '動画/メディア', 'その他'
]

def clean_emoji(text):
    # 先頭の絵文字とスペースを削除して、純粋なカテゴリ名を取り出す
    match = re.search(r'([A-Za-z0-9ァ-ヶー一-龠ぁ-ん/・]+.*)$', text)
    if match:
        return match.group(1).strip()
    return text.strip()

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # category行の抽出
    match = re.search(r'^category:\s*(.*?)$', content, re.MULTILINE)
    if not match:
        return False
    
    old_cat_raw = match.group(1).strip().strip('"').strip("'")
    old_cat_clean = clean_emoji(old_cat_raw)

    new_cat = old_cat_clean

    # マッピングの適用
    if old_cat_clean in category_map:
        new_cat = category_map[old_cat_clean]
    
    # ヒューリスティックな分割ルール
    if old_cat_clean in ['自律型AIエージェント', 'AIエージェント']:
        # コーディングかブラウザか汎用か判定
        if re.search(r'(コーディング|コード生成|エディタ|開発支援|ソフトウェアエンジニア|SWE|Devin|プログラム)', content, re.IGNORECASE):
            new_cat = 'コーディングエージェント'
        elif re.search(r'(ブラウザ|スクレイピング|UI操作|Web操作|Stagehand|Playwright)', content, re.IGNORECASE):
            new_cat = 'ブラウザ操作エージェント'
        else:
            new_cat = '汎用AIエージェント'
    
    if old_cat_clean == 'テスト/QA':
        if re.search(r'(E2E|ブラウザテスト|Playwright|Cypress|Selenium|Puppeteer)', content, re.IGNORECASE):
            new_cat = 'E2E/ブラウザテスト'
        else:
            new_cat = 'テスト生成/品質QA'

    if old_cat_clean == '開発ユーティリティ':
        if re.search(r'(ターミナル|シェル|コマンド|Terminal|Shell|CLI)', content, re.IGNORECASE):
            new_cat = 'ターミナル/シェル'
        else:
            new_cat = '開発ユーティリティ'

    if new_cat not in valid_categories:
        print(f"Warning: {new_cat} is not a valid new category. Derived from {old_cat_clean} in {filepath}")
        # fallback
        new_cat = old_cat_clean if old_cat_clean in valid_categories else 'その他'

    if new_cat != old_cat_raw:
        # YAMLのフォーマットを保つため、元の値全体を置換する。クオートがなかった場合も考慮
        new_content = re.sub(r'^category:\s*.*?$', f'category: "{new_cat}"', content, flags=re.MULTILINE)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    files = glob.glob('_reports/*.md')
    updated = 0
    for f in files:
        if process_file(f):
            updated += 1
            print(f"Updated: {f}")
    
    print(f"Total updated files: {updated}")

if __name__ == '__main__':
    main()
