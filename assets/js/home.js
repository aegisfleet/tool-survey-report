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

// カテゴリに対応する絵文字を取得するヘルパー関数
function getEmojiForCategory(category) {
  if (!category || !window.CATEGORY_EMOJIS) return '🔹';
  const cleanCat = stripEmoji(category);
  return window.CATEGORY_EMOJIS[cleanCat] || '🔹';
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
  const tagFilter = document.getElementById('tag-filter');
  const tagFilterClear = document.getElementById('tag-filter-clear');
  const categoryFilter = document.getElementById('category-filter');
  const categoryFilterClear = document.getElementById('category-filter-clear');
  const sortSelect = document.getElementById('sort-select');
  // Hero search elements
  const heroSearchInput = document.getElementById('hero-search-input');
  const heroSearchClear = document.getElementById('hero-search-clear');
  const heroSearchCountBadge = document.getElementById('hero-search-count-badge');
  const heroSearchChips = Array.from(document.querySelectorAll('.hero-search-chip'));
  const reportsGrid = document.getElementById('reports-grid');
  const reportsCountContainer = document.getElementById('reports-count-container');
  const noResults = document.getElementById('no-results');
  const reportCards = Array.from(document.querySelectorAll('.report-card'));
  const tagElements = document.querySelectorAll('.tag');
  const categoryElements = document.querySelectorAll('.clickable-category');

  // 表示件数の制御用変数
  const INITIAL_SHOW_COUNT = 12;
  const LOAD_MORE_COUNT = 12;
  let currentShowCount = INITIAL_SHOW_COUNT;

  // Pre-calculate sort values to improve performance
  reportCards.forEach((card) => {
    card._timestamp = card.dataset.date ? new Date(card.dataset.date).getTime() : 0;
    card._score = Number.parseFloat(card.dataset.score) || 0;
  });

  // カテゴリ要素およびタイトルに絵文字を適用する関数
  function applyEmojisToCategories() {
    // レポートカード
    reportCards.forEach((card) => {
      const categoryEl = card.querySelector('.meta-item.category');
      if (!categoryEl) return;

      const category = categoryEl.textContent.trim();
      const emoji = getEmojiForCategory(category);

      // タイトルへの絵文字付与
      const titleLink = card.querySelector('.report-title a');
      if (titleLink) {
        // 既存の絵文字や特殊マーク、先頭スペースを一度すべて除去して再付与（べき等性を確保）
        const currentTitle = stripEmoji(titleLink.textContent);
        titleLink.textContent = `${emoji} ${currentTitle}`;
      }
    });
  }

  // フィルタ状態を保存する関数
  function saveFilterState() {
    const state = {
      search: heroSearchInput ? heroSearchInput.value : '',
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
        if (state.search && heroSearchInput) heroSearchInput.value = state.search;
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
    tags.forEach((tag) => {
      allTags.add(tag.trim());
    });
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

    tagElements.forEach((tagElement) => {
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

    categoryElements.forEach((el) => {
      const categoryValue = el.dataset.category;
      if (categoryValue === selectedCategory && selectedCategory !== '') {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  // レポート件数を更新する関数
  function updateReportsCount(visibleCount, totalCount, isFilterActive) {
    if (!reportsCountContainer) return;

    // アニメーションのために一度要素を隠す（オプションだが、プレミアム感のため）
    reportsCountContainer.style.opacity = '0';
    reportsCountContainer.style.transform = 'translateY(5px)';

    setTimeout(() => {
      if (isFilterActive) {
        reportsCountContainer.textContent = `${totalCount}件のレポートがヒット`;
      } else {
        reportsCountContainer.textContent = `${visibleCount} / ${totalCount}件のレポートを表示中`;
      }
      reportsCountContainer.style.opacity = '1';
      reportsCountContainer.style.transform = 'translateY(0)';
    }, 100);
  }

  // Filter and sort function
  const filterAndSort = (shouldSave = true, resetCount = true) => {
    if (resetCount) {
      currentShowCount = INITIAL_SHOW_COUNT;
    }

    const rawSearchTerm = (heroSearchInput?.value || '').toLowerCase().trim();
    const searchTerm = toHiragana(rawSearchTerm);
    const selectedTag = tagFilter?.value || '';
    const selectedCategory = categoryFilter?.value || '';
    const sortBy = sortSelect?.value || 'date-desc';

    const filteredCards = reportCards.filter((card) => {
      const orGroups = searchTerm
        .split(/\||\sOR\s/i)
        .map((t) => t.trim())
        .filter((t) => t);

      // Helper for field matching (localized to filter function)
      const matchesFields = (term, allowPartialTags = true) => {
        const hTerm = toHiragana(term.toLowerCase());
        const nameMatch = card.dataset.toolName && toHiragana(card.dataset.toolName.toLowerCase()).includes(hTerm);
        const readingMatch =
          card.dataset.toolReading && toHiragana(card.dataset.toolReading.toLowerCase()).includes(hTerm);
        const descMatch =
          card.dataset.description && toHiragana(card.dataset.description.toLowerCase()).includes(hTerm);
        const highlightMatch =
          card.dataset.latestHighlight && toHiragana(card.dataset.latestHighlight.toLowerCase()).includes(hTerm);
        const devMatch = card.dataset.developer && toHiragana(card.dataset.developer.toLowerCase()).includes(hTerm);

        // Tag matching: avoid partial matches for short terms in tags to prevent false positives (like "a" matching "tag1")
        const tagsMatch = card.dataset.tags?.split(',').some((tag) => {
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

      // ソート条件に基づくフィルタリング（分離の徹底）
      let matchesSortFilter = true;
      if (sortBy === 'oss') {
        matchesSortFilter = card.dataset.isOss === 'true';
      } else if (sortBy === 'free') {
        matchesSortFilter = card.dataset.isOss !== 'true' && card.dataset.hasFreePlan === 'true';
      }

      return matchesSearch && matchesTag && matchesCategory && matchesSortFilter;
    });

    // Sort cards
    filteredCards.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b._timestamp - a._timestamp;
        case 'date-asc':
          return a._timestamp - b._timestamp;
        case 'title-asc':
          return a.dataset.toolName.localeCompare(b.dataset.toolName);
        case 'score-desc': {
          // スコアが高い順でソート
          return b._score - a._score;
        }
        case 'oss': {
          // OSSを優先し、同じ場合はスコア順でソート
          const getPriority = (card) => (card.dataset.isOss === 'true' ? 1 : 0);
          const priorityDiff = getPriority(b) - getPriority(a);
          if (priorityDiff !== 0) return priorityDiff;
          return b._score - a._score;
        }
        case 'free': {
          // 無料プランあり（非OSS）を優先し、同じ場合はスコア順でソート
          const getPriority = (card) => (card.dataset.hasFreePlan === 'true' && card.dataset.isOss !== 'true' ? 1 : 0);
          const priorityDiff = getPriority(b) - getPriority(a);
          if (priorityDiff !== 0) return priorityDiff;
          return b._score - a._score;
        }
        default:
          return 0;
      }
    });

    // フィルタがアクティブかどうか判定（表示数が減少する可能性のあるソート条件もフィルタとみなす）
    const isFilterActive =
      searchTerm !== '' || selectedTag !== '' || selectedCategory !== '' || sortBy === 'oss' || sortBy === 'free';

    // Hide all cards first
    reportCards.forEach((card) => {
      card.style.display = 'none';
    });

    // Show filtered and sorted cards
    if (filteredCards.length > 0) {
      filteredCards.forEach((card, index) => {
        if (isFilterActive || index < currentShowCount) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
        reportsGrid.appendChild(card); // Re-append to maintain order
      });
      noResults.style.display = 'none';
    } else {
      noResults.style.display = 'block';
    }

    // もっと見るボタンの制御
    const loadMoreContainer = document.getElementById('load-more-container');
    if (loadMoreContainer) {
      if (!isFilterActive && filteredCards.length > currentShowCount) {
        loadMoreContainer.style.display = 'flex';
      } else {
        loadMoreContainer.style.display = 'none';
      }
    }

    // 件数表示を更新
    const visibleCount = isFilterActive ? filteredCards.length : Math.min(currentShowCount, filteredCards.length);
    updateReportsCount(visibleCount, filteredCards.length, isFilterActive);

    // 検索窓の中の件数バッジを更新
    if (heroSearchCountBadge) {
      if (searchTerm === '') {
        heroSearchCountBadge.style.display = 'none';
      } else {
        const count = filteredCards.length;
        heroSearchCountBadge.textContent = count > 0 ? `${count}件` : '0件';
        heroSearchCountBadge.style.display = 'inline-block';

        if (count === 0) {
          heroSearchCountBadge.classList.add('no-matches');
        } else {
          heroSearchCountBadge.classList.remove('no-matches');
        }
      }
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
  window.filterAndSort = filterAndSort;

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

  // ============================================
  // Hero Search: sync & shortcuts
  // ============================================

  // Update hero search clear button visibility
  function updateHeroSearchClear() {
    if (!heroSearchClear) return;
    if (heroSearchInput && heroSearchInput.value.length > 0) {
      heroSearchClear.classList.add('visible');
    } else {
      heroSearchClear.classList.remove('visible');
    }
  }

  // Update hero search chip active states
  function updateHeroSearchChipStates() {
    if (!heroSearchInput) return;
    const currentSearch = heroSearchInput.value.trim();
    heroSearchChips.forEach((chip) => {
      if (chip.dataset.searchTerm === currentSearch && currentSearch !== '') {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // Update search state and trigger filter
  function handleSearchChange() {
    updateHeroSearchClear();
    updateHeroSearchChipStates();
    filterAndSort();
  }

  // Hero search input events
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', handleSearchChange);
  }

  // Hero search clear
  if (heroSearchClear) {
    heroSearchClear.addEventListener('click', () => {
      if (heroSearchInput) heroSearchInput.value = '';
      handleSearchChange();
      heroSearchInput?.focus();
    });
  }

  // Hero search count badge (click to scroll)
  if (heroSearchCountBadge) {
    heroSearchCountBadge.addEventListener('click', () => {
      if (heroSearchInput) heroSearchInput.blur();

      const reportsSection = document.querySelector('.reports-section');
      if (reportsSection) {
        reportsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Hero search chips (popular keywords)
  heroSearchChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const term = chip.dataset.searchTerm || '';
      if (heroSearchInput) {
        // If same term already active, clear it (toggle behavior)
        if (heroSearchInput.value.trim() === term) {
          heroSearchInput.value = '';
        } else {
          heroSearchInput.value = term;
        }
      }
      handleSearchChange();
      // Scroll to reports section for immediate results visibility
      const reportsSection = document.querySelector('.reports-section');
      if (reportsSection) {
        reportsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Keyboard shortcut: "/" to focus hero search
  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is already typing in an input/textarea
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')
    ) {
      // If Escape is pressed inside hero search, blur it
      if (e.key === 'Escape' && activeEl === heroSearchInput) {
        heroSearchInput.blur();
      }
      return;
    }

    if (e.key === '/' && heroSearchInput) {
      e.preventDefault();
      heroSearchInput.focus();
      heroSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Event listeners
  // Event listeners
  tagFilter.addEventListener('change', () => {
    filterAndSort();
  });
  categoryFilter.addEventListener('change', () => {
    filterAndSort();
  });
  sortSelect.addEventListener('change', () => {
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

  // Filter Reset All
  const filterResetAll = document.getElementById('filter-reset-all');
  if (filterResetAll) {
    filterResetAll.addEventListener('click', () => {
      if (heroSearchInput) heroSearchInput.value = '';
      if (tagFilter) tagFilter.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (sortSelect) sortSelect.value = 'date-desc';

      updateHeroSearchClear();
      updateHeroSearchChipStates();
      filterAndSort();
    });
  }

  // もっと見るボタンのクリックイベント
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentShowCount += LOAD_MORE_COUNT;
      filterAndSort(false, false); // 保存せず、カウントもリセットしない
    });
  }

  // Handle URL parameters for tag/category filtering
  const urlParams = new URLSearchParams(window.location.search);
  const tagParam = urlParams.get('tag');
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('q');

  if (searchParam) {
    // URLのクエリパラメータで検索
    if (heroSearchInput) heroSearchInput.value = searchParam;
    updateHeroSearchClear();
    updateHeroSearchChipStates();
    filterAndSort();
  } else if (tagParam || categoryParam) {
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
      updateHeroSearchClear();
      updateHeroSearchChipStates();
      filterAndSort(false); // 復元時は保存しない
    } else {
      // 初期状態でも状態を更新して初期表示を行う
      filterAndSort(false);
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

  // 初期化処理（絵文字適用）
  function initEmojiApplication() {
    applyEmojisToCategories();
  }

  // DOMContentLoadedで実行（すでにDOMContentLoaded内のため即時実行とおなじだが、念のため）
  initEmojiApplication();

  // 画像読み込み完了など、少し遅れてレイアウトが変わる可能性も考慮し、
  // window.onloadのタイミングでも再適用を試みる（既存チェックがあるため安全）
  window.addEventListener('load', initEmojiApplication);

  // ========================================
  // Bluesky Widget
  // ========================================
  const blueskyAccounts = [
    'dailyqiitatrends.bsky.social',
    'dailyzenntrends.bsky.social',
    'dailygithubtrends.bsky.social',
    'dailygenaitrends.bsky.social',
  ];

  const blueskyContainer = document.getElementById('bluesky-widget-container');
  const blueskyAccountBtns = document.querySelectorAll('.bluesky-account-btn');
  const blueskyShuffleBtn = document.getElementById('bluesky-shuffle');

  if (blueskyContainer && blueskyAccountBtns.length > 0) {
    console.log('Bluesky init start');
    // 現在表示中のアカウントハンドル配列
    const activeHandles = [];

    // テーマに応じたウィジェットテーマを返す
    function getBlueskyTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      return currentTheme === 'light' ? 'light' : 'gray';
    }

    // 画面幅に応じたスロット数を返す
    function getSlotCount() {
      const width = window.innerWidth;
      if (width >= 992) return 3;
      if (width >= 768) return 2;
      return 1;
    }

    // ウィジェットの高さを返す
    function getWidgetHeight() {
      return window.innerWidth < 768 ? '400px' : '500px';
    }

    // 配列をシャッフルする（Fisher-Yates）
    function shuffleArray(arr) {
      console.log('shuffleArray called with', arr);
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const j = array[0] % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    // ランダムにN個のアカウントを選択
    function pickRandomHandles(accounts, count) {
      console.log('pickRandomHandles called, count:', count);
      return shuffleArray(accounts).slice(0, count);
    }

    // 全ウィジェットを描画
    function renderBlueskyWidgets(container, buttons, activeList, handles) {
      console.log('renderBlueskyWidgets called with handles:', handles);
      const safeHandles = [...handles];
      activeList.length = 0;
      activeList.push(...safeHandles);
      container.innerHTML = '';

      const theme = getBlueskyTheme();
      const height = getWidgetHeight();

      safeHandles.forEach((handle) => {
        console.log('Appending widget for handle:', handle);
        const widget = document.createElement('bst-widget');
        widget.setAttribute('data-handle', handle);
        widget.setAttribute('data-theme', theme);
        widget.setAttribute('data-width', '100%');
        widget.setAttribute('data-height', height);
        widget.setAttribute('data-lang', 'ja');
        widget.setAttribute('data-ui', '1');
        widget.setAttribute('data-pin', '0');
        widget.setAttribute('data-rp', '0');
        widget.setAttribute('data-thread', '0');
        widget.setAttribute('data-prof', '0');
        container.appendChild(widget);
      });

      // スクリプトを再読み込み
      const existingScripts = document.querySelectorAll('script[data-bluesky-timeline]');
      existingScripts.forEach((s) => {
        s.remove();
      });

      const script = document.createElement('script');
      script.src = `https://blueskytimeline.com/v2/timeline.js?t=${Date.now()}`;
      script.type = 'module';
      script.defer = true;
      script.setAttribute('data-bluesky-timeline', 'true');
      document.body.appendChild(script);

      // ボタンのアクティブ状態を更新
      buttons.forEach((btn) => {
        const handle = btn.getAttribute('data-handle');
        if (activeList.includes(handle)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      console.log('renderBlueskyWidgets finished');
    }

    // 初期表示：スロット数に応じてランダム選択
    const initialCount = getSlotCount();
    console.log('Calling initial render, count:', initialCount);
    renderBlueskyWidgets(
      blueskyContainer,
      blueskyAccountBtns,
      activeHandles,
      pickRandomHandles(blueskyAccounts, initialCount),
    );

    // ボタンクリック：非表示のアカウントをクリックでスワップ
    blueskyAccountBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const handle = this.getAttribute('data-handle');
        if (!handle) return;

        // すでに表示中なら何もしない（外部リンクはそのまま開かれる設計にしたいが
        // preventDefaultしているので、アクティブなら新しいタブで開く）
        if (activeHandles.includes(handle)) {
          window.open(this.href, '_blank');
          return;
        }

        // 非表示のアカウント → 表示中の最後の1つと入れ替え
        const newHandles = [...activeHandles];
        // 最も古い（先頭の）スロットを入れ替え
        newHandles.shift();
        newHandles.push(handle);
        renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, newHandles);
      });
    });

    // シャッフルボタン
    if (blueskyShuffleBtn) {
      blueskyShuffleBtn.addEventListener('click', function () {
        const count = getSlotCount();
        renderBlueskyWidgets(
          blueskyContainer,
          blueskyAccountBtns,
          activeHandles,
          pickRandomHandles(blueskyAccounts, count),
        );
        // アニメーション
        this.style.transform = 'scale(1.1) rotate(180deg)';
        setTimeout(() => {
          this.style.transform = '';
        }, 300);
      });
    }

    // テーマ変更を監視して再描画
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, activeHandles);
          break;
        }
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // ウィンドウリサイズ時にスロット数が変わったら再描画（デバウンス）
    let resizeTimer;
    let prevSlotCount = initialCount;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newCount = getSlotCount();
        if (newCount !== prevSlotCount) {
          prevSlotCount = newCount;
          // スロット数が増えたら追加、減ったらトリム
          if (newCount > activeHandles.length) {
            const inactiveHandles = blueskyAccounts.filter((h) => !activeHandles.includes(h));
            const additional = shuffleArray(inactiveHandles).slice(0, newCount - activeHandles.length);
            renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, [
              ...activeHandles,
              ...additional,
            ]);
          } else if (newCount < activeHandles.length) {
            renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, activeHandles.slice(0, newCount));
          }
        }
      }, 300);
    });
  }
});
