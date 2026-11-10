/**
 * assets/js/home.js
 * Handles the logic for the home page, including filtering, sorting, and random picks.
 * Originally extracted from an inline script in _layouts/home.html.
 */

// フィルタ状態をsessionStorageに保存するキー
const FILTER_STATE_KEY = 'homeFilterState';

// Optimization: Regex constants pulled out of loops/repeated functions
const STRIP_EMOJI_RE = /^[\p{Extended_Pictographic}\uFE00-\uFE0F\u200D\u200C\s]+/u;
const KATAKANA_HIRAGANA_RE = /[\u30a1-\u30f6]/g;

// カテゴリに対応する絵文字を取得するヘルパー関数
function getEmojiForCategory(category) {
  if (!category || !window.CATEGORY_EMOJIS) return '🔹';
  if (window.CATEGORY_EMOJIS[category]) return window.CATEGORY_EMOJIS[category];
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
    const chr = match.codePointAt(0) - 0x60;
    return String.fromCodePoint(chr);
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
  const categoryPills = Array.from(document.querySelectorAll('.category-pill'));

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

      // タイトルへの絵文字付与（新レイアウトでファビコン・専用テキスト要素がある場合はDOM構造を保持）
      const titleLink = card.querySelector('.report-title a');
      if (titleLink) {
        const titleTextEl = titleLink.querySelector ? titleLink.querySelector('.tool-title-text') : null;
        if (!titleTextEl) {
          // 既存の絵文字や特殊マーク、先頭スペースを一度すべて除去して再付与（べき等性を確保）
          const currentTitle = stripEmoji(titleLink.textContent);
          titleLink.textContent = `${emoji} ${currentTitle}`;
        }
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
    .sort((a, b) => a.localeCompare(b))
    .forEach((tag) => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagFilter.appendChild(option);
    });

  function setActiveState(el, isActive) {
    if (isActive) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }

  function isCategoryPillActive(pill, selectedCategory, currentSort) {
    const type = pill.dataset.quickType;
    const val = pill.dataset.quickValue || '';
    if (type === 'all') {
      const isSpecialSort = currentSort === 'oss' || currentSort === 'free' || currentSort === 'score-desc';
      return selectedCategory === '' && !isSpecialSort;
    }
    if (type === 'category') {
      return val !== '' && selectedCategory === val;
    }
    if (type === 'sort') {
      return selectedCategory === '' && currentSort === val;
    }
    return false;
  }

  // Update tag visual states
  function updateTagStates() {
    const selectedTag = tagFilter.value;

    tagElements.forEach((tagElement) => {
      const tagValue = tagElement.dataset.tag;
      setActiveState(tagElement, tagValue === selectedTag && selectedTag !== '');
    });
  }

  // Update category visual states
  function updateCategoryStates() {
    const selectedCategory = categoryFilter.value;
    const currentSort = sortSelect ? sortSelect.value : 'date-desc';

    categoryElements.forEach((el) => {
      const categoryValue = el.dataset.category;
      setActiveState(el, categoryValue === selectedCategory && selectedCategory !== '');
    });

    // Update quick bar pills
    categoryPills.forEach((pill) => {
      setActiveState(pill, isCategoryPillActive(pill, selectedCategory, currentSort));
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

  const TEXT_SEARCH_KEYS = [
    'toolName',
    'title',
    'category',
    'toolReading',
    'description',
    'latestHighlight',
    'developer',
    'targetUsers',
  ];

  function cardMatchesFields(card, term, allowPartialTags = true) {
    const lowerTerm = term.toLowerCase();
    const hTerm = toHiragana(lowerTerm);
    const hasTextMatch = TEXT_SEARCH_KEYS.some(
      (key) => card.dataset[key] && toHiragana(card.dataset[key].toLowerCase()).includes(hTerm),
    );
    if (hasTextMatch) return true;

    // Tag matching: avoid partial matches for short terms in tags to prevent false positives (like "a" matching "tag1")
    const hasTagMatch = Boolean(
      card.dataset.tags?.split(',').some((tag) => {
        const hTag = toHiragana(tag.trim().toLowerCase());
        if (hTerm.length <= 1) return hTag === hTerm;
        return allowPartialTags ? hTag.includes(hTerm) : hTag === hTerm;
      }),
    );
    if (hasTagMatch) return true;

    // Link matching: match URL, scheme-stripped URL, or repository paths
    const cleanTerm = lowerTerm.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const links = card.dataset.links;
    return Boolean(links) && (links.includes(lowerTerm) || (cleanTerm.length >= 3 && links.includes(cleanTerm)));
  }

  function cardMatchesSearchGroup(card, group) {
    if (cardMatchesFields(card, group)) return true;
    const andTerms = group.split(/\s+/).filter(Boolean);
    if (andTerms.length <= 1) return false;
    return andTerms.every((term) => cardMatchesFields(card, term, false));
  }

  function cardMatchesSortFilter(card, sortBy) {
    if (sortBy === 'oss') return card.dataset.isOss === 'true';
    if (sortBy === 'free') return card.dataset.isOss !== 'true' && card.dataset.hasFreePlan === 'true';
    return true;
  }

  function cardMatchesAllCriteria(card, orGroups, selectedTag, selectedCategory, sortBy) {
    const matchesSearch = orGroups.length === 0 || orGroups.some((group) => cardMatchesSearchGroup(card, group));
    if (!matchesSearch) return false;

    const matchesTag =
      !selectedTag ||
      card.dataset.tags
        .split(',')
        .map((t) => t.trim())
        .includes(selectedTag);
    const matchesCategory = !selectedCategory || card.dataset.category === selectedCategory;
    return matchesTag && matchesCategory && cardMatchesSortFilter(card, sortBy);
  }

  function compareReportCards(a, b, sortBy) {
    switch (sortBy) {
      case 'date-desc':
        return b._timestamp - a._timestamp;
      case 'date-asc':
        return a._timestamp - b._timestamp;
      case 'title-asc':
        return a.dataset.toolName.localeCompare(b.dataset.toolName);
      case 'score-desc':
        return b._score - a._score;
      case 'oss': {
        const priorityDiff = (b.dataset.isOss === 'true' ? 1 : 0) - (a.dataset.isOss === 'true' ? 1 : 0);
        return priorityDiff !== 0 ? priorityDiff : b._score - a._score;
      }
      case 'free': {
        const getFreePriority = (c) => (c.dataset.hasFreePlan === 'true' && c.dataset.isOss !== 'true' ? 1 : 0);
        const priorityDiff = getFreePriority(b) - getFreePriority(a);
        return priorityDiff !== 0 ? priorityDiff : b._score - a._score;
      }
      default:
        return 0;
    }
  }

  function updateSearchCountBadge(count, searchTerm) {
    if (!heroSearchCountBadge) return;
    if (searchTerm === '') {
      heroSearchCountBadge.style.display = 'none';
      return;
    }
    heroSearchCountBadge.textContent = count > 0 ? `${count}件` : '0件';
    heroSearchCountBadge.style.display = 'inline-block';
    if (count === 0) {
      heroSearchCountBadge.classList.add('no-matches');
    } else {
      heroSearchCountBadge.classList.remove('no-matches');
    }
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
    const orGroups = searchTerm
      .split(/\||\sOR\s/i)
      .map((t) => t.trim())
      .filter(Boolean);

    const filteredCards = reportCards.filter((card) =>
      cardMatchesAllCriteria(card, orGroups, selectedTag, selectedCategory, sortBy),
    );

    filteredCards.sort((a, b) => compareReportCards(a, b, sortBy));

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
        card.style.display = isFilterActive || index < currentShowCount ? 'flex' : 'none';
        reportsGrid.appendChild(card); // Re-append to maintain order
      });
      noResults.style.display = 'none';
    } else {
      noResults.style.display = 'block';
    }

    // もっと見るボタンの制御
    const loadMoreContainer = document.getElementById('load-more-container');
    if (loadMoreContainer) {
      loadMoreContainer.style.display = !isFilterActive && filteredCards.length > currentShowCount ? 'flex' : 'none';
    }

    // 件数表示を更新
    const visibleCount = isFilterActive ? filteredCards.length : Math.min(currentShowCount, filteredCards.length);
    updateReportsCount(visibleCount, filteredCards.length, isFilterActive);
    updateSearchCountBadge(filteredCards.length, searchTerm);

    // Update visual states immediately
    updateTagStates();
    updateCategoryStates();

    // フィルタ状態を保存
    if (shouldSave) {
      saveFilterState();
      updateURL();
    }
  };
  window.filterAndSort = filterAndSort;

  // URLを更新する関数（全検索・フィルタ状態を反映）
  const siteName = homeContainer?.dataset.siteTitle || document.title;
  function updateURL() {
    const url = new URL(window.location);
    const searchTerm = (heroSearchInput?.value || '').trim();
    const tag = tagFilter?.value || '';
    const category = categoryFilter?.value || '';
    const sort = sortSelect?.value || 'date-desc';

    if (searchTerm) {
      url.searchParams.set('q', searchTerm);
    } else {
      url.searchParams.delete('q');
    }

    if (tag) {
      url.searchParams.set('tag', tag);
    } else {
      url.searchParams.delete('tag');
    }

    if (category) {
      const categoryOption = categoryFilter?.querySelector(`option[value="${category}"]`);
      let originalCategoryName = category;
      if (categoryOption) {
        originalCategoryName = stripEmoji(categoryOption.textContent);
      }
      url.searchParams.set('category', originalCategoryName);
      document.title = `${originalCategoryName} | ${siteName}`;
    } else {
      url.searchParams.delete('category');
      document.title = siteName;
    }

    if (sort && sort !== 'date-desc') {
      url.searchParams.set('sort', sort);
    } else {
      url.searchParams.delete('sort');
    }

    window.history?.replaceState(null, '', url.toString());
  }

  // URLからフィルタ・検索状態を復元する関数
  function restoreFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('q');
    const tagParam = urlParams.get('tag');
    const categoryParam = urlParams.get('category');
    const sortParam = urlParams.get('sort');

    let isParamSet = false;

    if (searchParam !== null) {
      if (heroSearchInput) heroSearchInput.value = searchParam;
      isParamSet = true;
    }
    if (tagParam !== null && tagFilter) {
      tagFilter.value = tagParam;
      isParamSet = true;
    }
    if (categoryParam !== null && categoryFilter) {
      categoryFilter.value = categoryParam.toLowerCase();
      isParamSet = true;
    }
    if (sortParam !== null && sortSelect) {
      sortSelect.value = sortParam;
      isParamSet = true;
    }

    return isParamSet;
  }

  // popstate イベントの登録（ブラウザの「戻る/進む」に対応）
  window.addEventListener('popstate', () => {
    restoreFromURL();
    updateHeroSearchClear();
    updateHeroSearchChipStates();
    filterAndSort(false, true);
  });

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

  // Update search state and trigger filter with debounce
  let searchDebounceTimer = null;
  function handleSearchChange(immediate = false) {
    updateHeroSearchClear();
    updateHeroSearchChipStates();
    clearTimeout(searchDebounceTimer);
    if (immediate) {
      filterAndSort();
    } else {
      searchDebounceTimer = setTimeout(() => {
        filterAndSort();
      }, 250);
    }
  }

  // Hero search input events
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', () => handleSearchChange(false));
  }

  // Hero search clear
  if (heroSearchClear) {
    heroSearchClear.addEventListener('click', () => {
      if (heroSearchInput) heroSearchInput.value = '';
      handleSearchChange(true);
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
      handleSearchChange(true);
      // Scroll to reports section for immediate results visibility
      const reportsSection = document.querySelector('.reports-section');
      if (reportsSection) {
        reportsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hero shortcut search click
  const heroShortcutSearch = document.getElementById('hero-shortcut-search');
  if (heroShortcutSearch && heroSearchInput) {
    heroShortcutSearch.addEventListener('click', (e) => {
      e.preventDefault();
      const heroSearchSection = document.getElementById('hero-search');
      if (heroSearchSection) {
        heroSearchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        heroSearchInput.focus();
      }, 350);
    });
  }

  // Keyboard shortcut: Escape blurs heroSearchInput; global search modal handles "/" and "Cmd+K"
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (activeEl === heroSearchInput && e.key === 'Escape') {
      heroSearchInput.blur();
    }
  });

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

  // Quick Category & Sort Pills
  function applyQuickPillSelection(type, val) {
    if (type === 'all') {
      if (categoryFilter) categoryFilter.value = '';
      const isSpecialSort =
        sortSelect && (sortSelect.value === 'oss' || sortSelect.value === 'free' || sortSelect.value === 'score-desc');
      if (isSpecialSort) {
        sortSelect.value = 'date-desc';
      }
      return;
    }
    if (type === 'category' && categoryFilter) {
      categoryFilter.value = categoryFilter.value === val ? '' : val;
      return;
    }
    if (type === 'sort' && sortSelect) {
      if (categoryFilter) categoryFilter.value = '';
      sortSelect.value = sortSelect.value === val ? 'date-desc' : val;
    }
  }

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      applyQuickPillSelection(pill.dataset.quickType, pill.dataset.quickValue || '');
      filterAndSort();
      pill.blur();
    });
  });

  // Hide broken favicons gracefully without inline HTML event handlers
  if (reportsGrid) {
    reportsGrid.addEventListener(
      'error',
      (e) => {
        if (e.target?.classList?.contains('tool-favicon')) {
          e.target.style.display = 'none';
        }
      },
      true,
    );
  }

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

  // No Results Reset Button
  const noResultsReset = document.getElementById('no-results-reset');
  if (noResultsReset) {
    noResultsReset.addEventListener('click', () => {
      if (heroSearchInput) heroSearchInput.value = '';
      if (tagFilter) tagFilter.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (sortSelect) sortSelect.value = 'date-desc';

      updateHeroSearchClear();
      updateHeroSearchChipStates();
      filterAndSort();
    });
  }

  // Mobile Filter Toggle Button
  const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  const reportsControls = document.getElementById('reports-controls');
  if (mobileFilterToggle && reportsControls) {
    mobileFilterToggle.addEventListener('click', () => {
      const isExpanded = mobileFilterToggle.getAttribute('aria-expanded') === 'true';
      mobileFilterToggle.setAttribute('aria-expanded', !isExpanded);
      reportsControls.classList.toggle('active');
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

  // URLパラメータがある場合にレポートセクションへスクロールする関数
  function scrollToReports() {
    const reportsSection = document.querySelector('.reports-section');
    if (reportsSection) {
      requestAnimationFrame(() => {
        const offset = 80; // ヘッダー分のオフセット
        const top = reportsSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    }
  }

  // Handle URL parameters or SessionStorage
  const hasURLParams = restoreFromURL();
  if (hasURLParams) {
    updateHeroSearchClear();
    updateHeroSearchChipStates();
    filterAndSort(false);
    scrollToReports();
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
      const currentTheme = document.documentElement.dataset.theme;
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
        widget.dataset.handle = handle;
        widget.dataset.theme = theme;
        widget.dataset.width = '100%';
        widget.dataset.height = height;
        widget.dataset.lang = 'ja';
        widget.dataset.ui = '1';
        widget.dataset.pin = '0';
        widget.dataset.rp = '0';
        widget.dataset.thread = '0';
        widget.dataset.prof = '0';
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
      script.dataset.blueskyTimeline = 'true';
      document.body.appendChild(script);

      // ボタンのアクティブ状態を更新
      buttons.forEach((btn) => {
        const handle = btn.dataset.handle;
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
        const handle = this.dataset.handle;
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
