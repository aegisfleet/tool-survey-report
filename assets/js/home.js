/**
 * assets/js/home.js
 * Handles the logic for the home page, including filtering, sorting, and random picks.
 * Originally extracted from an inline script in _layouts/home.html.
 */

// フィルタ状態をsessionStorageに保存するキー
const FILTER_STATE_KEY = 'homeFilterState';

// Optimization: Regex constants pulled out of loops/repeated functions
const STRIP_EMOJI_RE = /^[\p{Emoji}\uFE00-\uFE0F\u200D\u200C\s]+/u;
const KATAKANA_HIRAGANA_RE = /[\u30a1-\u30f6]/g;

// カテゴリごとの絵文字マッピングルール（上から順にマッチしたものが適用される）
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

// カテゴリに対応する絵文字を取得するヘルパー関数（キーワード部分一致）
function getEmojiForCategory(category) {
  if (!category) return '🔹';
  const lowerCat = category.toLowerCase();

  for (const rule of categoryEmojiRules) {
    if (rule.keywords.some((kw) => lowerCat.includes(kw))) {
      return rule.emoji;
    }
  }
  return '🔹';
}

// 既存の絵文字や特殊マーク、先頭スペースを除去するヘルパー関数
function stripEmoji(text) {
  return text.replace(STRIP_EMOJI_RE, '').trim();
}

// Helper function to convert Katakana to Hiragana
function toHiragana(str) {
  if (!str) return '';
  return str.replace(KATAKANA_HIRAGANA_RE, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const homeContainer = document.querySelector('.home-container');
  const searchInput = document.getElementById('report-search');
  const searchClear = document.getElementById('search-clear');
  const tagFilter = document.getElementById('tag-filter');
  const tagFilterClear = document.getElementById('tag-filter-clear');
  const categoryFilter = document.getElementById('category-filter');
  const categoryFilterClear = document.getElementById('category-filter-clear');
  const sortSelect = document.getElementById('sort-select');
  const interestChips = Array.from(document.querySelectorAll('.interest-chip'));
  const interestReset = document.getElementById('interest-reset');
  const reportsGrid = document.getElementById('reports-grid');
  const noResults = document.getElementById('no-results');
  const reportCards = Array.from(document.querySelectorAll('.report-card'));

  // カテゴリ要素およびタイトルに絵文字を適用する関数
  function applyEmojisToCategories() {
    // レポートカード
    document.querySelectorAll('.report-card').forEach((card) => {
      const categoryEl = card.querySelector('.meta-item.category');
      if (!categoryEl) return;

      const category = categoryEl.textContent.trim();
      const emoji = getEmojiForCategory(category);

      // カテゴリ表示への絵文字付与
      categoryEl.setAttribute('data-emoji', emoji);

      // タイトルへの絵文字付与
      const titleLink = card.querySelector('.report-title a');
      if (titleLink) {
        // 既存の絵文字や特殊マーク、先頭スペースを一度すべて除去して再付与（べき等性を確保）
        const currentTitle = stripEmoji(titleLink.textContent);
        titleLink.textContent = `${emoji} ${currentTitle}`;
      }
    });

    // ピックアップカード
    document.querySelectorAll('.pick-card').forEach((card) => {
      const categoryEl = card.querySelector('.pick-category');
      if (!categoryEl) return;

      // data-category または テキストから取得
      const displayCategory = categoryEl.textContent.trim();
      const emoji = getEmojiForCategory(displayCategory);

      // カテゴリ表示への絵文字付与
      categoryEl.setAttribute('data-emoji', emoji);

      // タイトルへの絵文字付与
      const titleEl = card.querySelector('.pick-title');
      if (titleEl) {
        // 既存の絵文字や特殊マーク、先頭スペースを一度すべて除去して再付与（べき等性を確保）
        const currentTitle = stripEmoji(titleEl.textContent);
        titleEl.textContent = `${emoji} ${currentTitle}`;
      }
    });
  }

  // カテゴリフィルタのオプションに絵文字を追加する関数
  function updateCategoryFilterOptions() {
    const options = categoryFilter.querySelectorAll('option');
    options.forEach((option) => {
      if (option.value === '') return; // "すべてのカテゴリ" はスキップ
      const category = stripEmoji(categoryFilter.querySelector(`option[value="${option.value}"]`).textContent); // 既存絵文字を除去して判定
      const emoji = getEmojiForCategory(category);

      // 常に最新の絵文字で上書き（キーワードルール変更に対応するため）
      option.textContent = `${emoji} ${category}`;
    });
  }

  // フィルタ状態を保存する関数
  function saveFilterState() {
    const state = {
      search: searchInput.value,
      tag: tagFilter.value,
      category: categoryFilter.value,
      sort: sortSelect.value,
    };
    sessionStorage.setItem(FILTER_STATE_KEY, JSON.stringify(state));
  }

  // フィルタ状態を復元する関数
  function restoreFilterState() {
    const savedState = sessionStorage.getItem(FILTER_STATE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.search) searchInput.value = state.search;
        if (state.tag) tagFilter.value = state.tag;
        if (state.category) categoryFilter.value = state.category;
        if (state.sort) sortSelect.value = state.sort;
        return true;
      } catch (e) {
        console.warn('Failed to restore filter state:', e);
      }
    }
    return false;
  }

  // Populate tag filter options
  const allTags = new Set();
  reportCards.forEach((card) => {
    const tags = card.dataset.tags.split(',').filter((tag) => tag.trim());
    tags.forEach((tag) => allTags.add(tag.trim()));
  });

  Array.from(allTags)
    .sort()
    .forEach((tag) => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagFilter.appendChild(option);
    });

  // Update tag visual states
  function updateTagStates() {
    const selectedTag = tagFilter.value;
    const allTagElements = document.querySelectorAll('.tag');

    allTagElements.forEach((tagElement) => {
      const tagValue = tagElement.dataset.tag;
      if (tagValue === selectedTag && selectedTag !== '') {
        tagElement.classList.add('active');
      } else {
        tagElement.classList.remove('active');
      }
    });
  }

  // Update category visual states
  function updateCategoryStates() {
    const selectedCategory = categoryFilter.value;
    const allCategoryElements = document.querySelectorAll('.clickable-category');

    allCategoryElements.forEach((el) => {
      const categoryValue = el.dataset.category;
      if (categoryValue === selectedCategory && selectedCategory !== '') {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  // Filter and sort function
  window.filterAndSort = (shouldSave = true) => {
    const rawSearchTerm = searchInput.value.toLowerCase().trim();
    const searchTerm = toHiragana(rawSearchTerm);
    const selectedTag = tagFilter.value;
    const selectedCategory = categoryFilter.value;
    const sortBy = sortSelect.value;

    const filteredCards = reportCards.filter((card) => {
      const orGroups = searchTerm
        .split(/\||\sOR\s/i)
        .map((t) => t.trim())
        .filter((t) => t);

      // Helper for field matching (localized to filter function)
      const matchesFields = (term, allowPartialTags = true) => {
        const hTerm = toHiragana(term.toLowerCase());
        const nameMatch = card.dataset.toolName && toHiragana(card.dataset.toolName.toLowerCase()).includes(hTerm);
        const readingMatch = card.dataset.toolReading && toHiragana(card.dataset.toolReading.toLowerCase()).includes(hTerm);
        const descMatch = card.dataset.description && toHiragana(card.dataset.description.toLowerCase()).includes(hTerm);
        const highlightMatch = card.dataset.latestHighlight && toHiragana(card.dataset.latestHighlight.toLowerCase()).includes(hTerm);
        const devMatch = card.dataset.developer && toHiragana(card.dataset.developer.toLowerCase()).includes(hTerm);
        
        // Tag matching: avoid partial matches for short terms in tags to prevent false positives (like "a" matching "tag1")
        const tagsMatch = card.dataset.tags && card.dataset.tags.split(',').some(tag => {
          const hTag = toHiragana(tag.trim().toLowerCase());
          if (hTerm.length <= 1) return hTag === hTerm; // Single char must be exact
          return allowPartialTags ? hTag.includes(hTerm) : hTag === hTerm;
        });

        return nameMatch || readingMatch || descMatch || highlightMatch || devMatch || tagsMatch;
      };

      const matchesSearch =
        orGroups.length === 0 ||
        orGroups.some((group) => {
          // 1. Try whole phrase match first
          if (matchesFields(group)) return true;

          // 2. Fallback to AND terms if multiple words
          const andTerms = group.split(/\s+/).filter((t) => t);
          if (andTerms.length <= 1) return false;

          return andTerms.every((term) => matchesFields(term, false)); // Stricter tag match for individual terms
        });

      const matchesTag =
        !selectedTag ||
        card.dataset.tags
          .split(',')
          .map((t) => t.trim())
          .includes(selectedTag);
      const matchesCategory = !selectedCategory || card.dataset.category === selectedCategory;
      
      return matchesSearch && matchesTag && matchesCategory;
    });

    // Sort cards
    filteredCards.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.dataset.date) - new Date(a.dataset.date);
        case 'date-asc':
          return new Date(a.dataset.date) - new Date(b.dataset.date);
        case 'title-asc':
          return a.dataset.toolName.localeCompare(b.dataset.toolName);
        case 'score-desc': {
          // スコアが高い順でソート（スコアがない場合は0として扱う）
          const scoreA = Number.parseFloat(a.dataset.score) || 0;
          const scoreB = Number.parseFloat(b.dataset.score) || 0;
          return scoreB - scoreA;
        }
        case 'oss-free': {
          // OSS > 無料プラン > その他の順でソート
          const getPriority = (card) => {
            if (card.dataset.isOss === 'true') return 2;
            if (card.dataset.hasFreePlan === 'true') return 1;
            return 0;
          };
          const priorityDiff = getPriority(b) - getPriority(a);
          // 同じ優先度の場合はスコアでソート
          if (priorityDiff !== 0) return priorityDiff;
          return (Number.parseFloat(b.dataset.score) || 0) - (Number.parseFloat(a.dataset.score) || 0);
        }
        default:
          return 0;
      }
    });

    // Hide all cards first
    reportCards.forEach((card) => (card.style.display = 'none'));

    // Show filtered and sorted cards
    if (filteredCards.length > 0) {
      filteredCards.forEach((card) => {
        card.style.display = 'block';
        reportsGrid.appendChild(card); // Re-append to maintain order
      });
      noResults.style.display = 'none';
    } else {
      noResults.style.display = 'block';
    }

    // Update visual states immediately
    updateTagStates();
    updateCategoryStates();

    // フィルタ状態を保存
    if (shouldSave) {
      saveFilterState();
    }

    // URLを更新（カテゴリフィルタの状態を反映）
    if (shouldSave) {
      updateURL(selectedCategory);
    }
  };

  // URLを更新する関数（カテゴリフィルタの状態を反映）
  const siteName = homeContainer?.dataset.siteTitle || document.title;
  function updateURL(category) {
    const url = new URL(window.location);

    if (category) {
      // カテゴリ名を元の表記で取得（セレクトボックスのオプションテキストから）
      const categoryOption = categoryFilter.querySelector(`option[value="${category}"]`);
      // 絵文字が含まれている可能性があるので除去するか、元の値を使うロジックが必要だが
      // ここでは simple に category value (slug) を使うわけにいかないので、
      // option text から絵文字を除去して取得する
      let originalCategoryName = category;
      if (categoryOption) {
        originalCategoryName = stripEmoji(categoryOption.textContent);
      }

      url.searchParams.set('category', originalCategoryName);

      // ページタイトルを更新
      document.title = `${originalCategoryName} | ${siteName}`;
    } else {
      url.searchParams.delete('category');

      // ページタイトルをサイト名に戻す
      document.title = siteName;
    }

    // タグパラメータは削除（カテゴリと併用しない設計）
    url.searchParams.delete('tag');

    // URLを更新（ブラウザ履歴にはreplaceで上書き）
    history.replaceState(null, '', url.toString());
  }

  // Event listeners
  searchInput.addEventListener('input', () => {
    filterAndSort();
  });
  tagFilter.addEventListener('change', () => {
    filterAndSort();
  });
  categoryFilter.addEventListener('change', () => {
    filterAndSort();
  });
  sortSelect.addEventListener('change', () => {
    filterAndSort();
  });

  interestChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const suggestedSearch = chip.dataset.interestSearch || '';
      const suggestedTag = chip.dataset.interestTag || '';
      const suggestedSort = chip.dataset.interestSort || 'date-desc';

      searchInput.value = suggestedSearch;
      tagFilter.value = suggestedTag;
      categoryFilter.value = '';
      sortSelect.value = suggestedSort;

      filterAndSort();
    });
  });

  if (interestReset) {
    interestReset.addEventListener('click', () => {
      searchInput.value = '';
      tagFilter.value = '';
      categoryFilter.value = '';
      sortSelect.value = 'date-desc';
      filterAndSort();
    });
  }

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    filterAndSort();
  });

  tagFilterClear.addEventListener('click', () => {
    tagFilter.value = '';
    filterAndSort();
  });

  categoryFilterClear.addEventListener('click', () => {
    categoryFilter.value = '';
    filterAndSort();
  });

  // Handle URL parameters for tag/category filtering
  const urlParams = new URLSearchParams(window.location.search);
  const tagParam = urlParams.get('tag');
  const categoryParam = urlParams.get('category');

  if (tagParam || categoryParam) {
    // URLパラメータがある場合は優先
    if (tagParam) tagFilter.value = tagParam;
    if (categoryParam) {
      // URLパラメータは元のカテゴリ名でエンコードされているので、
      // ドロップダウン値（小文字）に変換して設定
      categoryFilter.value = categoryParam.toLowerCase();
    }
    filterAndSort();
  } else {
    // URLパラメータがない場合はsessionStorageから復元を試みる
    const restored = restoreFilterState();
    if (restored) {
      filterAndSort(false); // 復元時は保存しない
    } else {
      // 初期状態でも状態を更新
      updateTagStates();
      updateCategoryStates();
    }
  }

  // ブラウザバック/フォワード時にフィルタ状態を復元
  window.addEventListener('pageshow', (event) => {
    // bfcacheから復元された場合（event.persisted === true）
    if (event.persisted) {
      const restored = restoreFilterState();
      if (restored) {
        filterAndSort(false); // 復元時は保存しない
      }
    }
  });

  // Tag/Category click functionality
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
      e.preventDefault(); // タップ時のデフォルト動作を防ぐ
      handleTagClick(e.target);
    } else if (e.target.closest('.clickable-category')) {
      const categoryElement = e.target.closest('.clickable-category');
      e.preventDefault();
      e.stopPropagation(); // pick-cardのリンク遷移を防ぐ
      handleCategoryClick(categoryElement);
    }
  });

  // カテゴリクリック処理
  function handleCategoryClick(categoryElement) {
    const categoryValue = categoryElement.dataset.category;

    if (categoryFilter.value === categoryValue) {
      categoryFilter.value = '';
    } else {
      categoryFilter.value = categoryValue;
    }

    filterAndSort();
    categoryElement.blur();
  }

  // タグクリック処理を共通化
  function handleTagClick(tagElement) {
    const tagValue = tagElement.dataset.tag;

    // 同じタグが既に選択されている場合はフィルタを解除
    if (tagFilter.value === tagValue) {
      tagFilter.value = '';
    } else {
      tagFilter.value = tagValue;
    }

    filterAndSort();

    // タップ後すぐにアクティブ状態をクリア（スマートフォン対応）
    tagElement.blur();

    // 一時的にアクティブクラスを削除して再適用（視覚的フィードバック）
    setTimeout(() => {
      updateTagStates();
    }, 50);
  }

  // ランダムピックアップのシャッフル処理
  function shuffleRandomPicks() {
    const picksGrid = document.getElementById('random-picks-grid');
    if (!picksGrid) return;

    const pickCards = Array.from(picksGrid.querySelectorAll('.pick-card'));
    const allReportCards = Array.from(document.querySelectorAll('.report-card'));

    if (allReportCards.length <= 4) return;

    // すべてのレポートからランダムに4つ選択（スコアと無料プラン情報も取得）
    const shuffled = allReportCards
      .map((card) => ({
        url: card.querySelector('a')?.href || '#',
        // タイトルから既存の絵文字を除去して取得
        title: stripEmoji(card.querySelector('.report-title a')?.textContent || '') || 'Unknown',
        category: card.querySelector('.meta-item.category')?.textContent?.trim() || '',
        score: card.querySelector('.card-score-badge')?.textContent?.trim() || '',
        hasFreePlan: !!card.querySelector('.card-free-badge'),
        isOss: card.dataset.isOss === 'true',
      }))
      .sort(() => {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] / 0xffffffff - 0.5;
      })
      .slice(0, 4);

    // ピックカードを更新
    pickCards.forEach((card, index) => {
      if (shuffled[index]) {
        card.href = shuffled[index].url;

        // カテゴリと絵文字の決定
        const category = shuffled[index].category;
        const emoji = getEmojiForCategory(category);

        // タイトル設定（絵文字付き）
        card.querySelector('.pick-title').textContent = `${emoji} ${shuffled[index].title}`;

        // カテゴリ設定
        const pc = card.querySelector('.pick-category');
        pc.textContent = category;
        pc.dataset.category = (category || '').toLowerCase();
        pc.setAttribute('data-emoji', emoji);

        // メタコンテナを取得または作成
        let metaContainer = card.querySelector('.pick-meta');
        if (!metaContainer) {
          metaContainer = document.createElement('div');
          metaContainer.className = 'pick-meta';
          card.appendChild(metaContainer);
        }

        // メタコンテナを一旦クリアして再描画
        metaContainer.innerHTML = '';

        // OSS バッジを最優先
        if (shuffled[index].isOss) {
          const ossBadge = document.createElement('span');
          ossBadge.className = 'pick-oss-badge';
          ossBadge.textContent = 'OSS';
          metaContainer.appendChild(ossBadge);
        }
        // OSSでない場合にのみ無料プランバッジ
        else if (shuffled[index].hasFreePlan) {
          const freeBadge = document.createElement('span');
          freeBadge.className = 'pick-free-badge';
          freeBadge.textContent = '💚 無料プランあり';
          metaContainer.appendChild(freeBadge);
        }

        // スコアバッジを追加
        if (shuffled[index].score) {
          const scoreEl = document.createElement('span');
          scoreEl.className = 'pick-score';
          scoreEl.textContent = shuffled[index].score;
          metaContainer.appendChild(scoreEl);
        }
      }
    });
    // シャッフル後に現在のフィルタ状態に合わせてアクティブ表示を更新
    updateCategoryStates();
  }

  // ページロード時にランダムシャッフル
  shuffleRandomPicks();

  // 初期化処理（絵文字適用とフィルタ更新）
  function initEmojiApplication() {
    applyEmojisToCategories();
    updateCategoryFilterOptions();
  }

  // DOMContentLoadedで実行（すでにDOMContentLoaded内のため即時実行とおなじだが、念のため）
  initEmojiApplication();

  // 画像読み込み完了など、少し遅れてレイアウトが変わる可能性も考慮し、
  // window.onloadのタイミングでも再適用を試みる（既存チェックがあるため安全）
  window.addEventListener('load', initEmojiApplication);

  // リフレッシュボタンのクリックイベント
  const refreshBtn = document.getElementById('refresh-picks');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      shuffleRandomPicks();
      // ボタンを一瞬回転させるアニメーション
      this.style.transform = 'scale(1.1) rotate(180deg)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
    });
  }
});
