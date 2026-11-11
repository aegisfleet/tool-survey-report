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
  const reportsCountContainer =
    document.getElementById('reports-count') || document.getElementById('reports-count-container');
  const noResults = document.getElementById('no-results');
  const reportCards = Array.from(document.querySelectorAll('.report-card'));
  const tagElements = document.querySelectorAll('.tag');
  const categoryElements = document.querySelectorAll('.clickable-category');
  const categoryPills = Array.from(document.querySelectorAll('.category-pill'));
  const flagPills = Array.from(document.querySelectorAll('.filter-flag-pill'));
  const activeFiltersBar = document.getElementById('active-filters-bar');
  const activeFiltersSummary = document.getElementById('active-filters-summary');
  const activeFiltersList = document.getElementById('active-filters-list');
  const activeFilterBadge = document.getElementById('active-filter-badge');

  // Filter flags (OSS / Free)
  const filterFlags = {
    oss: false,
    free: false,
  };

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
    reportCards.forEach((card) => {
      const categoryEl = card.querySelector('.meta-item.category');
      if (!categoryEl) return;

      const category = categoryEl.textContent.trim();
      const emoji = getEmojiForCategory(category);

      const titleLink = card.querySelector('.report-title a');
      if (titleLink) {
        const titleTextEl = titleLink.querySelector ? titleLink.querySelector('.tool-title-text') : null;
        if (!titleTextEl) {
          const currentTitle = stripEmoji(titleLink.textContent);
          titleLink.textContent = `${emoji} ${currentTitle}`;
        }
      }
    });
  }

  function updateFlagPillStates() {
    flagPills.forEach((pill) => {
      const flag = pill.dataset.filterFlag;
      const isActive = Boolean(filterFlags[flag]);
      pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      setActiveState(pill, isActive);
    });
  }

  // フィルタ状態を保存する関数
  function saveFilterState() {
    const state = {
      search: heroSearchInput ? heroSearchInput.value : '',
      tag: tagFilter ? tagFilter.value : '',
      category: categoryFilter ? categoryFilter.value : '',
      sort: sortSelect ? sortSelect.value : 'date-desc',
      oss: filterFlags.oss,
      free: filterFlags.free,
    };
    sessionStorage.setItem(FILTER_STATE_KEY, JSON.stringify(state));
  }

  function setValIfPresent(el, val) {
    if (el && val !== undefined && val !== null) el.value = val;
  }

  function applyRestoredState(state) {
    setValIfPresent(heroSearchInput, state.search);
    setValIfPresent(tagFilter, state.tag);
    setValIfPresent(categoryFilter, state.category);
    setValIfPresent(sortSelect, state.sort);
    filterFlags.oss = Boolean(state.oss);
    filterFlags.free = Boolean(state.free);
    updateFlagPillStates();
  }

  // フィルタ状態を復元する関数
  function restoreFilterState() {
    const savedState = sessionStorage.getItem(FILTER_STATE_KEY);
    if (!savedState) return false;
    try {
      applyRestoredState(JSON.parse(savedState));
      return true;
    } catch (e) {
      console.warn('Failed to restore filter state:', e);
      return false;
    }
  }

  function setActiveState(el, isActive) {
    if (isActive) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }

  function isCategoryPillActive(pill, selectedCategory) {
    const catVal =
      pill.dataset.quickCategory !== undefined
        ? pill.dataset.quickCategory.toLowerCase()
        : (pill.dataset.quickValue || '').toLowerCase();
    const type = pill.dataset.quickType;
    if (type === 'all' || catVal === '') {
      return selectedCategory === '';
    }
    return selectedCategory !== '' && catVal === selectedCategory.toLowerCase();
  }

  // Update tag visual states
  function updateTagStates() {
    const selectedTag = tagFilter ? tagFilter.value : '';

    tagElements.forEach((tagElement) => {
      const tagValue = tagElement.dataset.tag;
      setActiveState(tagElement, tagValue === selectedTag && selectedTag !== '');
    });
  }

  // Update category visual states
  function updateCategoryStates() {
    const selectedCategory = categoryFilter ? categoryFilter.value : '';

    categoryElements.forEach((el) => {
      const categoryValue = el.dataset.category;
      setActiveState(el, categoryValue === selectedCategory && selectedCategory !== '');
    });

    // Update quick bar category pills (excluding flag pills)
    categoryPills.forEach((pill) => {
      if (pill.dataset.filterFlag) return;
      setActiveState(pill, isCategoryPillActive(pill, selectedCategory));
    });
  }

  // Facet tag collection and option reconstruction
  function getFacetTagCounts(candidateCards) {
    const counts = new Map();
    candidateCards.forEach((card) => {
      const tags = card.dataset.tags ? card.dataset.tags.split(',').filter(Boolean) : [];
      tags.forEach((rawTag) => {
        const tag = rawTag.trim();
        if (!tag) return;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return counts;
  }

  function updateTagFilterOptions(candidateCards, currentSelectedTag) {
    if (!tagFilter) return currentSelectedTag;
    const tagCounts = getFacetTagCounts(candidateCards);
    const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

    const isSelectedStillValid = Boolean(currentSelectedTag && tagCounts.has(currentSelectedTag));
    const effectiveSelectedTag = isSelectedStillValid ? currentSelectedTag : '';

    // Rebuild options in tagFilter
    tagFilter.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'すべてのタグ';
    tagFilter.appendChild(defaultOpt);

    sortedTags.forEach(([tag, count]) => {
      const opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = `${tag} (${count})`;
      if (tag === effectiveSelectedTag) {
        opt.selected = true;
      }
      tagFilter.appendChild(opt);
    });

    tagFilter.value = effectiveSelectedTag;
    return effectiveSelectedTag;
  }

  // レポート件数を更新する関数
  function updateReportsCount(visibleCount, totalCount, isFilterActive) {
    if (!reportsCountContainer) return;

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

    const hasTagMatch = Boolean(
      card.dataset.tags?.split(',').some((tag) => {
        const hTag = toHiragana(tag.trim().toLowerCase());
        if (hTerm.length <= 1) return hTag === hTerm;
        return allowPartialTags ? hTag.includes(hTerm) : hTag === hTerm;
      }),
    );
    if (hasTagMatch) return true;

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

  function cardMatchesFlags(card, flags) {
    if (flags.oss && card.dataset.isOss !== 'true') return false;
    if (flags.free && card.dataset.hasFreePlan !== 'true') return false;
    return true;
  }

  function cardMatchesTag(card, selectedTag) {
    if (!selectedTag) return true;
    return Boolean(
      card.dataset.tags
        ?.split(',')
        .map((t) => t.trim())
        .includes(selectedTag),
    );
  }

  function cardMatchesCandidateCriteria(card, orGroups, selectedCategory, flags) {
    if (!cardMatchesFlags(card, flags)) return false;
    const matchesSearch = orGroups.length === 0 || orGroups.some((group) => cardMatchesSearchGroup(card, group));
    if (!matchesSearch) return false;
    return !selectedCategory || card.dataset.category === selectedCategory;
  }

  function compareReportCards(a, b, sortBy) {
    switch (sortBy) {
      case 'date-desc':
        return b._timestamp - a._timestamp;
      case 'date-asc':
        return a._timestamp - b._timestamp;
      case 'title-asc':
      case 'name-asc':
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

  function isAnyFilterActive(searchTerm, selectedTag, selectedCategory, flags) {
    return (
      searchTerm !== '' || selectedTag !== '' || selectedCategory !== '' || Boolean(flags.oss) || Boolean(flags.free)
    );
  }

  function createActiveFilterChip(type, labelText) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'active-filter-chip';
    chip.dataset.filterType = type;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'chip-label';
    labelSpan.textContent = labelText;
    chip.appendChild(labelSpan);

    const removeSpan = document.createElement('span');
    removeSpan.className = 'chip-remove';
    removeSpan.setAttribute('aria-hidden', 'true');
    removeSpan.textContent = '✕';
    chip.appendChild(removeSpan);

    return chip;
  }

  function appendChipIfActive(listEl, condition, type, label) {
    if (!condition) return 0;
    listEl.appendChild(createActiveFilterChip(type, label));
    return 1;
  }

  function renderActiveChips(listEl, activeState) {
    listEl.innerHTML = '';
    const displayName = activeState.category ? resolveCategoryDisplayName(activeState.category) : '';
    let count = 0;
    count += appendChipIfActive(listEl, activeState.search, 'search', `キーワード: "${activeState.search}"`);
    count += appendChipIfActive(listEl, activeState.category, 'category', `カテゴリ: ${displayName}`);
    count += appendChipIfActive(listEl, activeState.tag, 'tag', `タグ: ${activeState.tag}`);
    count += appendChipIfActive(listEl, activeState.oss, 'flag-oss', '📦 OSSのみ');
    count += appendChipIfActive(listEl, activeState.free, 'flag-free', '💚 無料枠あり');
    return count;
  }

  function updateActiveFiltersBar(filteredCount, isFilterActive, activeState) {
    if (!activeFiltersBar) return;

    if (!isFilterActive) {
      activeFiltersBar.hidden = true;
      if (activeFilterBadge) activeFilterBadge.hidden = true;
      return;
    }

    activeFiltersBar.hidden = false;
    if (activeFiltersSummary) {
      activeFiltersSummary.textContent = `絞り込み結果: ${filteredCount}件`;
    }

    if (activeFiltersList) {
      const activeCount = renderActiveChips(activeFiltersList, activeState);
      if (activeFilterBadge) {
        activeFilterBadge.hidden = activeCount === 0;
        activeFilterBadge.textContent = String(activeCount);
      }
    }
  }

  function renderCardVisibility(filteredCards, isFilterActive) {
    reportCards.forEach((card) => {
      card.style.display = 'none';
    });

    if (filteredCards.length > 0) {
      filteredCards.forEach((card, index) => {
        card.style.display = isFilterActive || index < currentShowCount ? 'flex' : 'none';
        reportsGrid.appendChild(card);
      });
      noResults.style.display = 'none';
    } else {
      noResults.style.display = 'block';
    }

    const loadMoreContainer = document.getElementById('load-more-container');
    if (loadMoreContainer) {
      loadMoreContainer.style.display = !isFilterActive && filteredCards.length > currentShowCount ? 'flex' : 'none';
    }
  }

  // Filter and sort function
  const filterAndSort = (shouldSave = true, resetCount = true) => {
    if (resetCount) {
      currentShowCount = INITIAL_SHOW_COUNT;
    }

    const rawSearchTerm = (heroSearchInput?.value || '').toLowerCase().trim();
    const searchTerm = toHiragana(rawSearchTerm);
    let selectedTag = tagFilter?.value || '';
    const selectedCategory = categoryFilter?.value || '';
    const sortBy = sortSelect?.value || 'date-desc';
    const orGroups = searchTerm
      .split(/\||\sOR\s/i)
      .map((t) => t.trim())
      .filter(Boolean);

    // Candidates for tag facet: search + category + flags (without tag itself)
    const candidateCardsForTags = reportCards.filter((card) =>
      cardMatchesCandidateCriteria(card, orGroups, selectedCategory, filterFlags),
    );

    // Rebuild tag options based on current facet
    selectedTag = updateTagFilterOptions(candidateCardsForTags, selectedTag);

    // Filter cards matching all criteria (including tag)
    const filteredCards = candidateCardsForTags.filter((card) => cardMatchesTag(card, selectedTag));

    filteredCards.sort((a, b) => compareReportCards(a, b, sortBy));

    const isFilterActive = isAnyFilterActive(searchTerm, selectedTag, selectedCategory, filterFlags);
    renderCardVisibility(filteredCards, isFilterActive);

    // 件数表示を更新
    const visibleCount = isFilterActive ? filteredCards.length : Math.min(currentShowCount, filteredCards.length);
    updateReportsCount(visibleCount, filteredCards.length, isFilterActive);
    updateSearchCountBadge(filteredCards.length, searchTerm);

    // Update active filters bar
    updateActiveFiltersBar(filteredCards.length, isFilterActive, {
      search: (heroSearchInput?.value || '').trim(),
      category: selectedCategory,
      tag: selectedTag,
      oss: filterFlags.oss,
      free: filterFlags.free,
    });

    // Update visual states immediately
    updateTagStates();
    updateCategoryStates();
    updateFlagPillStates();

    // フィルタ状態を保存
    if (shouldSave) {
      saveFilterState();
      updateURL();
    }
  };
  window.filterAndSort = filterAndSort;

  function setOrDeleteUrlParam(url, key, val) {
    if (val) {
      url.searchParams.set(key, val);
    } else {
      url.searchParams.delete(key);
    }
  }

  function resolveCategoryDisplayName(category) {
    const categoryOption = categoryFilter?.querySelector(`option[value="${category}"]`);
    return categoryOption ? stripEmoji(categoryOption.textContent) : category;
  }

  // URLを更新する関数（全検索・フィルタ状態を反映）
  const siteName = homeContainer?.dataset.siteTitle || document.title;
  function updateURL() {
    const url = new URL(window.location);
    const searchTerm = (heroSearchInput?.value || '').trim();
    const tag = tagFilter?.value || '';
    const category = categoryFilter?.value || '';
    const sort = sortSelect?.value || 'date-desc';

    setOrDeleteUrlParam(url, 'q', searchTerm);
    setOrDeleteUrlParam(url, 'tag', tag);
    setOrDeleteUrlParam(url, 'oss', filterFlags.oss ? '1' : '');
    setOrDeleteUrlParam(url, 'free', filterFlags.free ? '1' : '');

    if (category) {
      const originalCategoryName = resolveCategoryDisplayName(category);
      url.searchParams.set('category', originalCategoryName);
      document.title = `${originalCategoryName} | ${siteName}`;
    } else {
      url.searchParams.delete('category');
      document.title = siteName;
    }

    setOrDeleteUrlParam(url, 'sort', sort !== 'date-desc' ? sort : '');
    window.history?.replaceState(null, '', url.toString());
  }

  // URLからフィルタ・検索状態を復元する関数
  function restoreFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let isParamSet = false;

    const assignParam = (el, paramKey, isLower = false) => {
      const val = urlParams.get(paramKey);
      if (val !== null && el) {
        el.value = isLower ? val.toLowerCase() : val;
        isParamSet = true;
      }
    };

    assignParam(heroSearchInput, 'q');
    assignParam(tagFilter, 'tag');
    assignParam(categoryFilter, 'category', true);
    assignParam(sortSelect, 'sort');

    const ossParam = urlParams.get('oss');
    if (ossParam !== null) {
      filterFlags.oss = ossParam === '1' || ossParam === 'true';
      isParamSet = true;
    }
    const freeParam = urlParams.get('free');
    if (freeParam !== null) {
      filterFlags.free = freeParam === '1' || freeParam === 'true';
      isParamSet = true;
    }

    updateFlagPillStates();
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
      heroSearchClear.hidden = false;
      heroSearchClear.classList.add('visible');
    } else {
      heroSearchClear.hidden = true;
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

  // Hero search chips (popular keywords if present)
  heroSearchChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const term = chip.dataset.searchTerm || '';
      if (heroSearchInput) {
        if (heroSearchInput.value.trim() === term) {
          heroSearchInput.value = '';
        } else {
          heroSearchInput.value = term;
        }
      }
      handleSearchChange(true);
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
      const heroSearchSection = document.getElementById('hero-search') || heroSearchInput;
      heroSearchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        heroSearchInput.focus();
      }, 350);
    });
  }

  // Keyboard shortcut: "/" focuses heroSearchInput; Escape blurs it
  function isEditableElement(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(el.isContentEditable);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.activeElement === heroSearchInput) {
        heroSearchInput.blur();
      }
      return;
    }
    if (e.key === '/' && !isEditableElement(document.activeElement)) {
      if (heroSearchInput && document.activeElement !== heroSearchInput) {
        e.preventDefault();
        heroSearchInput.focus();
        heroSearchInput.select();
      }
    }
  });

  // Event listeners for select boxes
  if (tagFilter) {
    tagFilter.addEventListener('change', () => {
      filterAndSort();
    });
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      filterAndSort();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      filterAndSort();
    });
  }

  if (tagFilterClear) {
    tagFilterClear.addEventListener('click', () => {
      tagFilter.value = '';
      filterAndSort();
    });
  }

  if (categoryFilterClear) {
    categoryFilterClear.addEventListener('click', () => {
      categoryFilter.value = '';
      filterAndSort();
    });
  }

  // Quick Category & Flag Pills
  flagPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const flag = pill.dataset.filterFlag;
      if (flag && Object.hasOwn(filterFlags, flag)) {
        filterFlags[flag] = !filterFlags[flag];
        updateFlagPillStates();
        filterAndSort();
        pill.blur();
      }
    });
  });

  function handleCategoryPillClick(pill) {
    const val = pill.dataset.quickCategory !== undefined ? pill.dataset.quickCategory : pill.dataset.quickValue || '';
    const isAll = pill.dataset.quickType === 'all' || val === '';

    if (isAll) {
      if (categoryFilter) categoryFilter.value = '';
    } else if (categoryFilter) {
      const isSame = categoryFilter.value.toLowerCase() === val.toLowerCase();
      categoryFilter.value = isSame ? '' : val;
    }
    filterAndSort();
    pill.blur();
  }

  categoryPills.forEach((pill) => {
    if (pill.dataset.filterFlag) return;
    pill.addEventListener('click', () => handleCategoryPillClick(pill));
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

  function resetAllFilters() {
    if (heroSearchInput) heroSearchInput.value = '';
    if (tagFilter) tagFilter.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (sortSelect) sortSelect.value = 'date-desc';
    filterFlags.oss = false;
    filterFlags.free = false;

    updateFlagPillStates();
    updateHeroSearchClear();
    updateHeroSearchChipStates();
    filterAndSort();
  }

  function handleFilterChipRemoval(type) {
    switch (type) {
      case 'search':
        if (heroSearchInput) heroSearchInput.value = '';
        handleSearchChange(true);
        break;
      case 'category':
        if (categoryFilter) categoryFilter.value = '';
        filterAndSort();
        break;
      case 'tag':
        if (tagFilter) tagFilter.value = '';
        filterAndSort();
        break;
      case 'flag-oss':
        filterFlags.oss = false;
        updateFlagPillStates();
        filterAndSort();
        break;
      case 'flag-free':
        filterFlags.free = false;
        updateFlagPillStates();
        filterAndSort();
        break;
      default:
        break;
    }
  }

  function setupActionButtons() {
    const filterResetAll = document.getElementById('filter-reset-all');
    if (filterResetAll) {
      filterResetAll.addEventListener('click', resetAllFilters);
    }

    const noResultsReset = document.getElementById('no-results-reset');
    if (noResultsReset) {
      noResultsReset.addEventListener('click', resetAllFilters);
    }

    if (activeFiltersList) {
      activeFiltersList.addEventListener('click', (e) => {
        const chip = e.target.closest('.active-filter-chip');
        if (chip?.dataset.filterType) {
          handleFilterChipRemoval(chip.dataset.filterType);
        }
      });
    }

    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const reportsControls = document.getElementById('reports-controls');
    if (mobileFilterToggle && reportsControls) {
      mobileFilterToggle.addEventListener('click', () => {
        const isExpanded = mobileFilterToggle.getAttribute('aria-expanded') === 'true';
        mobileFilterToggle.setAttribute('aria-expanded', !isExpanded);
        reportsControls.classList.toggle('active');
      });
    }

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        currentShowCount += LOAD_MORE_COUNT;
        filterAndSort(false, false);
      });
    }
  }

  setupActionButtons();

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

  function initFilterState() {
    if (restoreFromURL()) {
      updateHeroSearchClear();
      updateHeroSearchChipStates();
      filterAndSort(false);
      scrollToReports();
      return;
    }
    if (restoreFilterState()) {
      updateHeroSearchClear();
      updateHeroSearchChipStates();
    }
    filterAndSort(false);
  }

  initFilterState();

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
  initBlueskySection();
});

function initBlueskySection() {
  const blueskyAccounts = [
    'dailyqiitatrends.bsky.social',
    'dailyzenntrends.bsky.social',
    'dailygithubtrends.bsky.social',
    'dailygenaitrends.bsky.social',
  ];

  const blueskyContainer = document.getElementById('bluesky-widget-container');
  const blueskyAccountBtns = document.querySelectorAll('.bluesky-account-btn');
  const blueskyShuffleBtn = document.getElementById('bluesky-shuffle');

  if (!blueskyContainer || blueskyAccountBtns.length === 0) return;

  const activeHandles = [];

  function getBlueskyTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    return currentTheme === 'light' ? 'light' : 'gray';
  }

  function getSlotCount() {
    const width = window.innerWidth;
    if (width >= 992) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  function getWidgetHeight() {
    return window.innerWidth < 768 ? '400px' : '500px';
  }

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const j = array[0] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function pickRandomHandles(accounts, count) {
    return shuffleArray(accounts).slice(0, count);
  }

  function renderBlueskyWidgets(container, buttons, activeList, handles) {
    const safeHandles = [...handles];
    activeList.length = 0;
    activeList.push(...safeHandles);
    container.innerHTML = '';

    const theme = getBlueskyTheme();
    const height = getWidgetHeight();

    safeHandles.forEach((handle) => {
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

    buttons.forEach((btn) => {
      const handle = btn.dataset.handle;
      if (activeList.includes(handle)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  const initialCount = getSlotCount();
  renderBlueskyWidgets(
    blueskyContainer,
    blueskyAccountBtns,
    activeHandles,
    pickRandomHandles(blueskyAccounts, initialCount),
  );

  blueskyAccountBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const handle = this.dataset.handle;
      if (!handle) return;

      if (activeHandles.includes(handle)) {
        window.open(this.href, '_blank');
        return;
      }

      const newHandles = [...activeHandles];
      newHandles.shift();
      newHandles.push(handle);
      renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, newHandles);
    });
  });

  if (blueskyShuffleBtn) {
    blueskyShuffleBtn.addEventListener('click', function () {
      const count = getSlotCount();
      renderBlueskyWidgets(
        blueskyContainer,
        blueskyAccountBtns,
        activeHandles,
        pickRandomHandles(blueskyAccounts, count),
      );
      this.style.transform = 'scale(1.1) rotate(180deg)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
    });
  }

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

  let resizeTimer;
  let prevSlotCount = initialCount;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCount = getSlotCount();
      if (newCount !== prevSlotCount) {
        prevSlotCount = newCount;
        if (newCount > activeHandles.length) {
          const inactiveHandles = blueskyAccounts.filter((h) => !activeHandles.includes(h));
          const additional = shuffleArray(inactiveHandles).slice(0, newCount - activeHandles.length);
          renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, [...activeHandles, ...additional]);
        } else if (newCount < activeHandles.length) {
          renderBlueskyWidgets(blueskyContainer, blueskyAccountBtns, activeHandles, activeHandles.slice(0, newCount));
        }
      }
    }, 300);
  });
}
