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

  // 13件目以降の読み込み前は <option> が存在しないため、復元したタグを保留する
  let pendingTagSelection = '';

  // 検索対象となる dataset キー（順序は従来どおり）
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

  // 初期SSRカードのメタデータ（ソートキー・検索インデックス）を事前計算
  reportCards.forEach((card) => {
    initCardMetadata(card);
    card._isMaterialized = true;
    card._inGrid = true;
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
      tag: getSelectedTagValue(),
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

  // タグ選択肢が存在するか確認する（13件目以降の読み込み前は存在しない）
  function hasTagOption(value) {
    if (!tagFilter || !value) return false;
    const options = tagFilter.options
      ? Array.from(tagFilter.options)
      : Array.from(tagFilter.querySelectorAll('option'));
    return options.some((option) => option.value === value);
  }

  // 復元したタグを選択状態にする。選択肢が無い場合は読み込み後に適用する
  function setRestoredTag(value) {
    if (!tagFilter) return;
    const tag = value === undefined || value === null ? '' : String(value);
    if (tag === '' || hasTagOption(tag)) {
      tagFilter.value = tag;
      pendingTagSelection = '';
      return;
    }
    pendingTagSelection = tag;
  }

  function getSelectedTagValue() {
    return tagFilter?.value || pendingTagSelection || '';
  }

  function applyRestoredState(state) {
    setValIfPresent(heroSearchInput, state.search);
    setRestoredTag(state.tag);
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

  // 表示中（実体化済み）のタグ要素を取得する
  function getTagElements() {
    if (!reportsGrid) return [];
    return reportsGrid.querySelectorAll('.tag');
  }

  // 表示中（実体化済み）のカテゴリ要素を取得する
  function getCategoryElements() {
    if (!reportsGrid) return [];
    return reportsGrid.querySelectorAll('.clickable-category');
  }

  // Update tag visual states
  function updateTagStates() {
    const selectedTag = tagFilter ? tagFilter.value : '';

    getTagElements().forEach((tagElement) => {
      const tagValue = tagElement.dataset.tag;
      setActiveState(tagElement, tagValue === selectedTag && selectedTag !== '');
    });
  }

  // Update category visual states
  function updateCategoryStates() {
    const selectedCategory = categoryFilter ? categoryFilter.value : '';

    getCategoryElements().forEach((el) => {
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

  function updateTagFilterOptions(candidateCards, currentSelectedTag, keepMissingSelection = false) {
    if (!tagFilter) return { selected: currentSelectedTag, applied: currentSelectedTag };
    const tagCounts = getFacetTagCounts(candidateCards);
    const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

    const isAvailable = Boolean(currentSelectedTag && tagCounts.has(currentSelectedTag));
    const effectiveSelectedTag = isAvailable || keepMissingSelection ? currentSelectedTag : '';

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

    // 13件目以降を読み込む前でも、復元したタグを選択状態として保持する
    if (effectiveSelectedTag && !isAvailable) {
      const pendingOpt = document.createElement('option');
      pendingOpt.value = effectiveSelectedTag;
      pendingOpt.textContent = effectiveSelectedTag;
      pendingOpt.selected = true;
      tagFilter.appendChild(pendingOpt);
    }

    tagFilter.value = effectiveSelectedTag;
    return { selected: effectiveSelectedTag, applied: isAvailable ? effectiveSelectedTag : '' };
  }

  // レポート件数を更新する関数
  let reportsCountTimer = null;
  function updateReportsCount(visibleCount, totalCount, isFilterActive) {
    if (!reportsCountContainer) return;

    clearTimeout(reportsCountTimer);
    reportsCountContainer.style.opacity = '0';
    reportsCountContainer.style.transform = 'translateY(5px)';

    reportsCountTimer = setTimeout(() => {
      if (isFilterActive) {
        reportsCountContainer.textContent = `${totalCount}件のレポートがヒット`;
      } else {
        reportsCountContainer.textContent = `${visibleCount} / ${totalCount}件のレポートを表示中`;
      }
      reportsCountContainer.style.opacity = '1';
      reportsCountContainer.style.transform = 'translateY(0)';
    }, 100);
  }

  // 13件目以降の読み込み中も含めた総レポート件数
  function getReportTotalCount() {
    const total = Number.parseInt(reportsGrid?.dataset.totalReports || '', 10);
    return Number.isFinite(total) ? Math.max(total, reportCards.length) : reportCards.length;
  }

  // dataset の値を検索用に正規化（小文字化＋ひらがな化）する
  function normalizeFieldValue(raw) {
    if (raw === undefined || raw === null) return '';
    return toHiragana(String(raw).toLowerCase());
  }

  // カード1枚分の検索用正規化テキストを生成する
  function buildNormSearchText(card) {
    return TEXT_SEARCH_KEYS.map((key) => normalizeFieldValue(card.dataset[key]))
      .filter(Boolean)
      .join(' ');
  }

  // カードのメタデータ（ソートキー・検索インデックス）を初期化する
  function initCardMetadata(card) {
    card._timestamp = card.dataset.date ? new Date(card.dataset.date).getTime() : 0;
    card._score = Number.parseFloat(card.dataset.score) || 0;
    card._normSearchText = buildNormSearchText(card);
    card._normFieldCache = new Map();
  }

  // dataset の値は後から書き換えられる可能性があるため、
  // 生の値が一致する場合のみキャッシュを再利用する（不一致なら再計算）
  function getNormalizedField(card, key) {
    const raw = card.dataset[key];
    if (!card._normFieldCache) card._normFieldCache = new Map();
    const cached = card._normFieldCache.get(key);
    if (cached && cached.raw === raw) return cached.value;
    const value = raw ? normalizeFieldValue(raw) : '';
    card._normFieldCache.set(key, { raw, value });
    return value;
  }

  // 静的データ（JSON由来で書き換わらないカード）は事前計算済みテキストを利用する
  function getCardSearchText(card) {
    if (card._normSearchTextStatic === true) return card._normSearchText || '';
    return TEXT_SEARCH_KEYS.map((key) => getNormalizedField(card, key))
      .filter(Boolean)
      .join(' ');
  }

  function cardMatchesFields(card, term, allowPartialTags = true) {
    const lowerTerm = term.toLowerCase();
    const hTerm = toHiragana(lowerTerm);
    const searchText = getCardSearchText(card);
    const hasTextMatch = searchText !== '' && searchText.includes(hTerm);
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

  function formatActiveFiltersSummary(isPending, filteredCount) {
    if (isPending) return '絞り込み結果を読み込み中…';
    return `絞り込み結果: ${filteredCount}件`;
  }

  function updateActiveFiltersBar(filteredCount, isFilterActive, activeState, isPending = false) {
    if (!activeFiltersBar) return;

    if (!isFilterActive) {
      activeFiltersBar.hidden = true;
      if (activeFilterBadge) activeFilterBadge.hidden = true;
      return;
    }

    activeFiltersBar.hidden = false;
    if (activeFiltersSummary) {
      activeFiltersSummary.textContent = formatActiveFiltersSummary(isPending, filteredCount);
    }

    if (activeFiltersList) {
      const activeCount = renderActiveChips(activeFiltersList, activeState);
      if (activeFilterBadge) {
        activeFilterBadge.hidden = activeCount === 0;
        activeFilterBadge.textContent = String(activeCount);
      }
    }
  }

  // 「もっと見る」ボタンの表示状態を更新する
  function updateLoadMoreVisibility(isFilterActive, filteredCount) {
    const loadMoreContainer = document.getElementById('load-more-container');
    if (!loadMoreContainer) return;
    // 13件目以降の読み込み中は data-total-reports を母数にして、一瞬消えないようにする
    const totalCount = Math.max(filteredCount, getReportTotalCount());
    loadMoreContainer.style.display = !isFilterActive && totalCount > currentShowCount ? 'flex' : 'none';
  }

  // 表示対象のカードのみ DOM へ実体化して配置する
  function renderCardVisibility(filteredCards, isFilterActive, isHydrating = false) {
    // すでにグリッド内にあるカードだけを非表示にする（未挿入の仮想カードは対象外）
    reportCards.forEach((card) => {
      if (card._inGrid !== false) {
        card.style.display = 'none';
      }
    });

    if (filteredCards.length === 0) {
      // 13件目以降の読み込み中は、未読込カードが該当する可能性があるため
      // 「0件」表示はハイドレーション完了まで出さない
      if (noResults) noResults.style.display = isHydrating ? 'none' : 'block';
      updateLoadMoreVisibility(isFilterActive, 0);
      return;
    }

    const visibleCards = isFilterActive ? filteredCards : filteredCards.slice(0, currentShowCount);

    visibleCards.forEach((card) => {
      if (card._isMaterialized === false) {
        materializeReportCard(card);
      }
      card.style.display = 'flex';
      reportsGrid.appendChild(card);
      card._inGrid = true;
    });

    if (noResults) noResults.style.display = 'none';
    updateLoadMoreVisibility(isFilterActive, filteredCards.length);
  }

  // 件数バッジ・絞り込みサマリを更新する。
  // 13件目以降の読み込み中に0件になっても、未読込カードが該当し得るため確定表示しない。
  function updateResultCounts(filteredCards, isFilterActive, isHydrating, searchTerm, activeState) {
    const isPendingZeroResults = isHydrating && isFilterActive && filteredCards.length === 0;
    const totalReportCount = getReportTotalCount();
    const visibleCount = isFilterActive ? filteredCards.length : Math.min(currentShowCount, filteredCards.length);

    if (!isPendingZeroResults) {
      updateReportsCount(visibleCount, isFilterActive ? filteredCards.length : totalReportCount, isFilterActive);
      updateSearchCountBadge(filteredCards.length, searchTerm);
    }

    updateActiveFiltersBar(filteredCards.length, isFilterActive, activeState, isPendingZeroResults);
  }

  // ============================================
  // オンデマンドDOM生成（Materialization）
  // ============================================

  const MAX_CARD_TAGS = 4;
  const CARD_TEXT_TRUNCATE = 18;
  const SAFE_URL_RE = /^(?:https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i;

  // http(s) またはルート相対パスのみ許可する（javascript: 等の不正スキームを排除）
  function sanitizeUrl(raw) {
    const value = typeof raw === 'string' ? raw.trim() : '';
    return SAFE_URL_RE.test(value) ? value : '';
  }

  // Liquid の truncate フィルタ相当
  function truncateText(text, length) {
    const value = String(text ?? '');
    if (value.length <= length) return value;
    return `${value.slice(0, Math.max(0, length - 3))}...`;
  }

  function createEl(tagName, className) {
    const el = document.createElement(tagName);
    if (className) el.className = className;
    return el;
  }

  function toLowerString(value) {
    if (value === undefined || value === null) return '';
    return String(value).toLowerCase();
  }

  // 検索用のリンク文字列（SSRの data-links と同等）
  function buildLinksSearchText(item) {
    const links = item.links && typeof item.links === 'object' ? item.links : {};
    return [item.official_site, links.github, links.documentation, links.deepwiki, links.codewiki]
      .filter((value) => typeof value === 'string' && value !== '')
      .join(' ')
      .trim()
      .toLowerCase();
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }

  // 2026-09-01 → 2026.09.01
  function formatCardDate(rawDate) {
    const value = String(rawDate ?? '');
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) return value;
    return `${match[1]}.${match[2]}.${match[3]}`;
  }

  function extractCardDomain(item) {
    const source = sanitizeUrl(item.official_site) || sanitizeUrl(item.links?.github);
    if (!source) return '';
    return source
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .split('?')[0];
  }

  function buildScorePopover(item) {
    const summary = String(item.evaluation_summary ?? '').trim();
    const points = (Array.isArray(item.plus_points) ? item.plus_points : [])
      .filter((pt) => pt?.reason)
      .map((pt) => ({ point: pt.point, reason: String(pt.reason).trim() }))
      .filter((pt) => pt.reason !== '' && pt.reason !== '特になし' && pt.reason !== 'なし')
      .slice(0, 2);

    if (!summary && points.length === 0) return null;

    const popover = createEl('div', 'score-preview-popover');
    popover.setAttribute('role', 'tooltip');

    const header = createEl('div', 'popover-header');
    const scoreEl = createEl('span', 'popover-score');
    scoreEl.textContent = `★ ${item.score}点`;
    const titleEl = createEl('span', 'popover-title');
    titleEl.textContent = '評価サマリー';
    header.appendChild(scoreEl);
    header.appendChild(titleEl);
    popover.appendChild(header);

    if (summary) {
      const summaryEl = createEl('p', 'popover-summary');
      summaryEl.textContent = summary;
      popover.appendChild(summaryEl);
    }

    if (points.length > 0) {
      const list = createEl('ul', 'popover-points');
      points.forEach((pt) => {
        const li = createEl('li');
        const pointEl = createEl('span', 'point-plus');
        pointEl.textContent = `+${pt.point}`;
        li.appendChild(pointEl);
        li.appendChild(createTextNode(` ${pt.reason}`));
        list.appendChild(li);
      });
      popover.appendChild(list);
    }

    return popover;
  }

  function buildScoreBadge(item) {
    const rawScore = item.score;
    const score = Number(rawScore);
    const hasScore = rawScore !== null && rawScore !== undefined && rawScore !== '' && Number.isFinite(score);
    if (!hasScore) return null;

    const wrapper = createEl('div', 'score-badge-wrapper');
    const badge = createEl('button', 'card-score-badge');
    badge.type = 'button';
    const srLabel = createEl('span', 'screen-reader-text');
    srLabel.textContent = '総合評価 ';
    badge.appendChild(srLabel);
    badge.appendChild(createTextNode(`★ ${score}点`));
    wrapper.appendChild(badge);

    const popover = buildScorePopover(item);
    if (popover) wrapper.appendChild(popover);

    return wrapper;
  }

  function buildCategoryBadge(item) {
    const category = String(item.category ?? '').trim();
    if (!category || category === '不明') {
      const fallback = createEl('span', 'meta-item category');
      fallback.textContent = '🔹 未分類';
      return fallback;
    }

    const button = createEl('button', 'meta-item category clickable-category');
    button.type = 'button';
    button.dataset.category = category.toLowerCase();
    button.title = `カテゴリ「${category}」で絞り込む`;
    button.textContent = `${getEmojiForCategory(category)} ${category}`;
    return button;
  }

  function buildCardEyebrow(item) {
    const eyebrow = createEl('div', 'report-card-eyebrow');
    const meta = createEl('div', 'report-header-meta');

    const dateEl = createEl('time', 'report-date');
    dateEl.setAttribute('datetime', String(item.last_updated ?? ''));
    dateEl.title = '最終更新日';
    dateEl.textContent = formatCardDate(item.last_updated);
    meta.appendChild(dateEl);

    const scoreBadge = buildScoreBadge(item);
    if (scoreBadge) meta.appendChild(scoreBadge);

    eyebrow.appendChild(meta);
    eyebrow.appendChild(buildCategoryBadge(item));
    return eyebrow;
  }

  function buildCardHeader(item) {
    const header = createEl('div', 'report-card-header');
    const titleEl = createEl('h3', 'report-title');
    const link = createEl('a');
    link.href = sanitizeUrl(item.url) || '#';

    const domain = extractCardDomain(item);
    if (domain) {
      const favicon = createEl('img', 'tool-favicon');
      favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
      favicon.alt = '';
      favicon.width = 22;
      favicon.height = 22;
      favicon.loading = 'lazy';
      link.appendChild(favicon);
    }

    const titleText = createEl('span', 'tool-title-text');
    titleText.textContent = String(item.tool_name || item.title || '');
    link.appendChild(titleText);
    titleEl.appendChild(link);
    header.appendChild(titleEl);

    const reading = String(item.tool_reading ?? '').trim();
    if (reading && reading !== '不明') {
      const readingEl = createEl('span', 'report-tool-reading');
      readingEl.textContent = reading;
      header.appendChild(readingEl);
    }

    return header;
  }

  function createSpecChip(className, label, title) {
    const chip = createEl('span', className);
    chip.textContent = label;
    if (title) chip.title = title;
    return chip;
  }

  function appendAvailabilityChip(specs, isOss, hasFreePlan) {
    if (isOss) {
      specs.appendChild(createSpecChip('spec-chip spec-oss card-oss-badge', '📦 OSS'));
    } else if (hasFreePlan) {
      specs.appendChild(createSpecChip('spec-chip spec-free card-free-badge', '💚 無料枠あり'));
    }
  }

  function appendPriceChip(specs, pricing, isOss, hasFreePlan) {
    const price = String(pricing.starting_price ?? '').trim();
    if (!price || price === '不明') return;
    if (price === '無料' && (isOss || hasFreePlan)) return;

    specs.appendChild(
      createSpecChip('spec-chip spec-price', `💰 ${truncateText(price, CARD_TEXT_TRUNCATE)}`, `最低価格: ${price}`),
    );
  }

  function appendTargetChip(specs, targetUsers) {
    const firstTarget = String(targetUsers[0] ?? '').trim();
    if (!firstTarget || firstTarget === '不明') return;

    specs.appendChild(
      createSpecChip(
        'spec-chip spec-target',
        `🎯 ${truncateText(firstTarget, CARD_TEXT_TRUNCATE)}`,
        `想定利用者: ${targetUsers.join(' / ')}`,
      ),
    );
  }

  function appendDeveloperChip(specs, rawDeveloper) {
    const developer = String(rawDeveloper ?? '').trim();
    if (!developer || developer === '不明') return;

    specs.appendChild(
      createSpecChip(
        'spec-chip spec-developer meta-item developer',
        `🏢 ${truncateText(developer, CARD_TEXT_TRUNCATE)}`,
        `開発元: ${developer}`,
      ),
    );
  }

  function buildQuickSpecs(item) {
    const specs = createEl('div', 'report-quick-specs');
    const pricing = item.pricing && typeof item.pricing === 'object' ? item.pricing : {};
    const isOss = pricing.is_oss === true;
    const hasFreePlan = pricing.has_free_plan === true;

    appendAvailabilityChip(specs, isOss, hasFreePlan);
    appendPriceChip(specs, pricing, isOss, hasFreePlan);
    appendTargetChip(specs, Array.isArray(item.target_users) ? item.target_users : []);
    appendDeveloperChip(specs, item.developer);

    return specs;
  }

  function buildCardDescription(item) {
    const description = String(item.description ?? '');
    if (!description) return null;

    const paragraph = createEl('p', 'report-description');
    const lead = createEl('strong', 'desc-lead');
    const periodIndex = description.indexOf('。');
    if (periodIndex < 0) {
      lead.textContent = description;
      paragraph.appendChild(lead);
      return paragraph;
    }

    lead.textContent = description.slice(0, periodIndex + 1);
    paragraph.appendChild(lead);

    const rest = description.slice(periodIndex + 1);
    if (rest) {
      const restEl = createEl('span', 'desc-rest');
      restEl.textContent = rest;
      paragraph.appendChild(restEl);
    }

    return paragraph;
  }

  function buildCardHighlight(item) {
    const highlight = String(item.latest_highlight ?? '').trim();
    const ignored = ['', '不明', 'なし', '特になし'];
    if (ignored.includes(highlight)) return null;

    const wrapper = createEl('div', 'report-latest-highlight');
    wrapper.title = `最新情報: ${highlight}`;
    const icon = createEl('span', 'highlight-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '📢';
    const content = createEl('span', 'highlight-content');
    content.textContent = highlight;
    wrapper.appendChild(icon);
    wrapper.appendChild(content);
    return wrapper;
  }

  function buildCardTags(item) {
    const tags = (Array.isArray(item.tags) ? item.tags : []).filter(
      (tag) => typeof tag === 'string' && tag.trim() !== '',
    );
    if (tags.length === 0) return null;

    const wrapper = createEl('div', 'report-tags');
    tags.slice(0, MAX_CARD_TAGS).forEach((tag) => {
      const tagEl = createEl('span', 'tag');
      tagEl.dataset.tag = tag;
      tagEl.textContent = tag;
      wrapper.appendChild(tagEl);
    });

    if (tags.length > MAX_CARD_TAGS) {
      const more = createEl('span', 'tag-more');
      more.textContent = `+${tags.length - MAX_CARD_TAGS}`;
      more.title = `その他のタグ: ${tags.slice(MAX_CARD_TAGS, MAX_CARD_TAGS + 20).join(', ')}`;
      wrapper.appendChild(more);
    }

    return wrapper;
  }

  // symbol スプライトは静的文字列のみで構築する（外部入力は含めない）
  const CARD_ICON_MARKUP = {
    official:
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><use href="#icon-card-official"></use></svg>',
    docs: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><use href="#icon-card-docs"></use></svg>',
    github:
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><use href="#icon-card-github"></use></svg>',
    wiki: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><use href="#icon-card-wiki"></use></svg>',
  };

  const CARD_LINK_DEFS = [
    {
      key: 'official',
      className: 'card-link-btn',
      label: '公式',
      title: '公式サイト',
      icon: 'official',
      url: (item) => item.official_site,
    },
    {
      key: 'docs',
      className: 'card-link-btn card-link-docs',
      label: 'Docs',
      title: 'ドキュメント',
      icon: 'docs',
      url: (item) => item.links?.documentation,
    },
    {
      key: 'github',
      className: 'card-link-btn card-link-github',
      label: 'GitHub',
      title: 'GitHub',
      icon: 'github',
      url: (item) => item.links?.github,
    },
    {
      key: 'deepwiki',
      className: 'card-link-btn card-link-deepwiki',
      label: 'DeepWiki',
      title: 'DeepWiki',
      icon: 'wiki',
      url: (item) => item.links?.deepwiki,
    },
    {
      key: 'codewiki',
      className: 'card-link-btn card-link-codewiki',
      label: 'CodeWiki',
      title: 'CodeWiki',
      icon: 'wiki',
      url: (item) => item.links?.codewiki,
    },
  ];

  function buildCardLink(def, url) {
    const link = createEl('a', def.className);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.title = def.title;
    link.setAttribute('aria-label', def.title);
    link.innerHTML = CARD_ICON_MARKUP[def.icon];
    const label = createEl('span');
    label.textContent = def.label;
    link.appendChild(label);
    return link;
  }

  function buildCardFooter(item) {
    const footer = createEl('div', 'report-card-footer');
    const linksWrap = createEl('div', 'report-card-links');

    CARD_LINK_DEFS.forEach((def) => {
      const url = sanitizeUrl(def.url(item));
      if (!url) return;
      linksWrap.appendChild(buildCardLink(def, url));
    });

    footer.appendChild(linksWrap);

    const readMore = createEl('a', 'read-more');
    readMore.href = sanitizeUrl(item.url) || '#';
    readMore.textContent = 'レポートを読む →';
    footer.appendChild(readMore);

    return footer;
  }

  // JSON 1レコードから、子要素を持たない軽量なカードシェルを生成する
  function createVirtualCardShell(item) {
    const pricing = item.pricing && typeof item.pricing === 'object' ? item.pricing : {};
    const targetUsers = Array.isArray(item.target_users) ? item.target_users : [];

    const card = document.createElement('article');
    card.className = 'report-card';
    card.dataset.slug = toLowerString(item.slug);
    card.dataset.tags = Array.isArray(item.tags) ? item.tags.join(',') : '';
    card.dataset.title = toLowerString(item.title || item.tool_name || '');
    card.dataset.toolName = toLowerString(item.tool_name);
    card.dataset.toolReading = String(item.tool_reading ?? '');
    card.dataset.description = toLowerString(item.description);
    card.dataset.latestHighlight = toLowerString(item.latest_highlight);
    card.dataset.links = buildLinksSearchText(item);
    card.dataset.date = String(item.last_updated ?? '');
    card.dataset.category = toLowerString(item.category);
    card.dataset.developer = toLowerString(item.developer);
    card.dataset.targetUsers = toLowerString(targetUsers.join(','));
    card.dataset.isOss = String(pricing.is_oss === true);
    card.dataset.hasFreePlan = String(pricing.has_free_plan === true);
    card.dataset.score = String(item.score ?? 0);

    card._rawReport = item;
    card._isMaterialized = false;
    card._inGrid = false;
    card.style.display = 'none';

    initCardMetadata(card);
    // JSON由来のデータは書き換わらないため、検索テキストを静的にキャッシュする
    card._normSearchTextStatic = true;
    card._normFieldCache = null;

    return card;
  }

  // 未実体化カードを、SSRカードと同一構造のDOMへ展開する
  function materializeReportCard(card) {
    if (card._isMaterialized !== false) return;
    const item = card._rawReport && typeof card._rawReport === 'object' ? card._rawReport : {};

    card.innerHTML = '';
    card.appendChild(buildCardEyebrow(item));
    card.appendChild(buildCardHeader(item));
    card.appendChild(buildQuickSpecs(item));

    const description = buildCardDescription(item);
    if (description) card.appendChild(description);

    const highlight = buildCardHighlight(item);
    if (highlight) card.appendChild(highlight);

    const tags = buildCardTags(item);
    if (tags) card.appendChild(tags);

    card.appendChild(buildCardFooter(item));
    card._isMaterialized = true;
  }

  const SUMMARY_ENDPOINT = `${(window.__SITE_BASEURL__ || '').replace(/\/+$/, '')}/reports-summary.json`;

  // reports-summary.json の取得（search-modal.js と Promise を共有する）
  function fetchReportsSummary() {
    if (window.__REPORTS_SUMMARY_PROMISE__) return window.__REPORTS_SUMMARY_PROMISE__;

    const fetcher = typeof fetch === 'function' ? fetch : window.fetch;
    if (typeof fetcher !== 'function') return Promise.reject(new Error('fetch is unavailable'));

    const promise = fetcher(SUMMARY_ENDPOINT)
      .then((response) => {
        if (response?.ok !== true) {
          throw new Error(`Failed to load reports-summary.json: ${response?.status ?? 'unknown'}`);
        }
        return response.json();
      })
      .catch((error) => {
        window.__REPORTS_SUMMARY_PROMISE__ = null;
        throw error;
      });

    window.__REPORTS_SUMMARY_PROMISE__ = promise;
    return promise;
  }

  function collectKnownReportKeys() {
    const slugs = new Set();
    const names = new Set();
    reportCards.forEach((card) => {
      const slug = toLowerString(card.dataset.slug);
      const name = toLowerString(card.dataset.toolName);
      if (slug) slugs.add(slug);
      if (name) names.add(name);
    });
    return { slugs, names };
  }

  // slug があれば slug で同一性を判定する（同名の別レポートを取りこぼさない）
  function isKnownReport(item, known) {
    const slug = toLowerString(item?.slug);
    if (slug) return known.slugs.has(slug);
    const name = toLowerString(item?.tool_name);
    return Boolean(name && known.names.has(name));
  }

  // JSONレコードのうち未登録のものを軽量シェルとして登録する
  function addVirtualCards(items) {
    if (!Array.isArray(items)) return 0;
    const known = collectKnownReportKeys();
    let added = 0;

    items.forEach((item) => {
      if (!item || typeof item !== 'object' || isKnownReport(item, known)) return;

      const shell = createVirtualCardShell(item);
      const slug = toLowerString(item.slug);
      const name = toLowerString(item.tool_name);
      if (slug) known.slugs.add(slug);
      if (name) known.names.add(name);
      reportCards.push(shell);
      added += 1;
    });

    return added;
  }

  function hasRemainingReports() {
    const total = Number.parseInt(reportsGrid?.dataset.totalReports || '', 10);
    if (!Number.isFinite(total)) return false;
    return total > reportCards.length;
  }

  async function loadRemainingReports() {
    if (!hasRemainingReports()) return 0;
    try {
      const data = await fetchReportsSummary();
      const added = addVirtualCards(data);
      // 読み込み後は総件数を実データに合わせ、保留中のタグ選択を確定させる
      if (reportsGrid) reportsGrid.dataset.totalReports = String(reportCards.length);
      filterAndSort(false, false);
      return added;
    } catch (error) {
      // 取得に失敗しても、実際にDOMにあるカード数へ総件数を合わせてUIの整合性を保つ
      if (reportsGrid) reportsGrid.dataset.totalReports = String(reportCards.length);
      filterAndSort(false, false);
      throw error;
    }
  }

  // Filter and sort function
  const filterAndSort = (shouldSave = true, resetCount = true) => {
    if (resetCount) {
      currentShowCount = INITIAL_SHOW_COUNT;
    }

    const rawSearchTerm = (heroSearchInput?.value || '').toLowerCase().trim();
    const searchTerm = toHiragana(rawSearchTerm);
    const selectedTagValue = getSelectedTagValue();
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

    // Rebuild tag options based on current facet.
    // 13件目以降の読み込み中は、復元したタグがまだ候補に無くても選択状態を保持する
    const keepMissingTag = Boolean(pendingTagSelection) && hasRemainingReports();
    const tagState = updateTagFilterOptions(candidateCardsForTags, selectedTagValue, keepMissingTag);
    pendingTagSelection = tagState.applied ? '' : tagState.selected;

    // Filter cards matching all criteria (including tag)
    const filteredCards = candidateCardsForTags.filter((card) => cardMatchesTag(card, tagState.applied));

    filteredCards.sort((a, b) => compareReportCards(a, b, sortBy));

    const isFilterActive = isAnyFilterActive(searchTerm, tagState.applied, selectedCategory, filterFlags);
    const isHydrating = hasRemainingReports();
    renderCardVisibility(filteredCards, isFilterActive, isHydrating);

    // 件数表示を更新（読み込み中は総件数を先に確定させることでチラつきを防ぐ）
    updateResultCounts(filteredCards, isFilterActive, isHydrating, searchTerm, {
      search: (heroSearchInput?.value || '').trim(),
      category: selectedCategory,
      tag: tagState.applied,
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

  // オンデマンド実体化API（テスト・デバッグ用のフック）
  window.HomeReports = {
    addReports(items) {
      const added = addVirtualCards(items);
      if (added > 0) {
        filterAndSort(false, false);
      }
      return added;
    },
    loadRemainingReports,
    getCards: () => reportCards,
    // テスト用: URL/sessionStorage から復元したタグの適用処理
    restoreTag: setRestoredTag,
  };

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
    const tag = getSelectedTagValue();
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
    assignParam(categoryFilter, 'category', true);
    assignParam(sortSelect, 'sort');

    // タグは <option> が未生成の場合があるため専用の復元処理を使う
    const tagParam = urlParams.get('tag');
    if (tagParam !== null) {
      setRestoredTag(tagParam);
      isParamSet = true;
    }

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
      pendingTagSelection = '';
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
      pendingTagSelection = '';
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
    pendingTagSelection = '';
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
        pendingTagSelection = '';
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

  // 13件目以降をJSONから軽量シェルとして読み込み、表示分のみ実体化する
  loadRemainingReports().catch((error) => {
    console.warn('Failed to hydrate report cards:', error);
  });

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
  // 動的に実体化されたカード内の要素も拾えるよう、グリッドへイベント委譲する
  if (reportsGrid) {
    reportsGrid.addEventListener('click', (e) => {
      const tagElement = e.target.closest?.('.tag');
      if (tagElement) {
        e.preventDefault(); // タップ時のデフォルト動作を防ぐ
        handleTagClick(tagElement);
        return;
      }

      const categoryElement = e.target.closest?.('.clickable-category');
      if (categoryElement) {
        e.preventDefault();
        e.stopPropagation(); // pick-cardのリンク遷移を防ぐ
        handleCategoryClick(categoryElement);
      }
    });
  }

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
    pendingTagSelection = '';

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

// IntersectionObserver でスクロール接近時まで Bluesky ウィジェットの初期化を遅延する
function initBlueskySection() {
  const section = document.getElementById('bluesky-section');
  const canObserve = section && typeof IntersectionObserver === 'function';

  if (!canObserve) {
    setupBlueskySection();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const isApproaching = entries.some((entry) => entry.isIntersecting);
      if (!isApproaching) return;
      observer.disconnect();
      setupBlueskySection();
    },
    { rootMargin: '400px 0px' },
  );

  observer.observe(section);
}

function setupBlueskySection() {
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
