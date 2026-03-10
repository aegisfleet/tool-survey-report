
const categoryEmojiRules = [
    { keywords: ['ai', 'エージェント', '機械学習', 'ml', '生成'], emoji: '🤖' },
    { keywords: ['テスト', 'qa', '品質'], emoji: '🧪' },
    { keywords: ['開発者ツール', 'ide', 'エディタ', 'バージョン管理', 'git', 'フック', '開発ツール'], emoji: '🔧' },
    { keywords: ['インフラ', 'クラウド', 'ci/cd', 'devops', '構成管理', '仮想化'], emoji: '☁️' },
    { keywords: ['支出', '会計', '経理'], emoji: '💰' },
    { keywords: ['作図', 'ダイアグラム'], emoji: '📐' },
    { keywords: ['教育', '学習'], emoji: '🎓' },
    { keywords: ['web', 'フレームワーク', 'cms', 'cdn'], emoji: '🌐' },
    { keywords: ['モバイル', 'オペレーティングシステム'], emoji: '📱' },
    { keywords: ['ワークフロー', '自動化'], emoji: '⚡' },
    { keywords: ['デザイン', '動画', 'メディア'], emoji: '🎨' },
    { keywords: ['プロジェクト管理', 'ドキュメント', 'ナレッジ', '議事録'], emoji: '📋' },
    { keywords: ['監視', 'セキュリティ', '認証', '脅威', '依存関係'], emoji: '🛡️' },
    { keywords: ['bi', '広告', '顧客', 'マーケットプレイス', 'saas', '分析', '検索'], emoji: '📊' },
    { keywords: ['勤怠', '人事', '労務'], emoji: '🏢' },
    { keywords: ['ふるさと納税', '互換'], emoji: '🔹' },
  ];

function getEmojiForCategoryOriginal(category) {
    if (!category) return '🔹';
    const lowerCat = category.toLowerCase();

    for (const rule of categoryEmojiRules) {
      if (rule.keywords.some((kw) => lowerCat.includes(kw))) {
        return rule.emoji;
      }
    }
    return '🔹';
}

const memo = new Map();
function getEmojiForCategoryMemoized(category) {
    if (!category) return '🔹';
    if (memo.has(category)) return memo.get(category);
    const lowerCat = category.toLowerCase();
    let result = '🔹';
    for (const rule of categoryEmojiRules) {
      if (rule.keywords.some((kw) => lowerCat.includes(kw))) {
        result = rule.emoji;
        break;
      }
    }
    memo.set(category, result);
    return result;
}

const categories = ['AIコーディング支援', 'テスト/QA', '開発者ツール', 'インフラ', '生成AI', 'Webフレームワーク', 'その他', 'AI検索エンジン'];
const testData = [];
for (let i = 0; i < 100000; i++) {
    testData.push(categories[i % categories.length]);
}

// Warmup
for (let i = 0; i < 1000; i++) {
    getEmojiForCategoryOriginal(testData[i]);
    getEmojiForCategoryMemoized(testData[i]);
}

console.time('original');
for (const cat of testData) {
    getEmojiForCategoryOriginal(cat);
}
console.timeEnd('original');

memo.clear();
console.time('memoized');
for (const cat of testData) {
    getEmojiForCategoryMemoized(cat);
}
console.timeEnd('memoized');
