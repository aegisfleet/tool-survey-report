/**
 * assets/js/search-modal.js
 * Global Command-Palette Search Modal for all pages.
 * Loads reports-summary.json on demand and provides real-time keyboard-first search.
 */

(() => {
  // Regex helpers
  const STRIP_EMOJI_RE = /^[\p{Extended_Pictographic}\uFE00-\uFE0F\u200D\u200C\s]+/u;
  const KATAKANA_HIRAGANA_RE = /[\u30a1-\u30f6]/g;
  const HIRAGANA_KATAKANA_RE = /[\u3041-\u3096]/g;

  function toHiragana(str) {
    if (!str) return '';
    return str.replace(KATAKANA_HIRAGANA_RE, (match) => {
      const chr = match.codePointAt(0) - 0x60;
      return String.fromCodePoint(chr);
    });
  }

  function toKatakana(str) {
    if (!str) return '';
    return str.replace(HIRAGANA_KATAKANA_RE, (match) => {
      const chr = match.codePointAt(0) + 0x60;
      return String.fromCodePoint(chr);
    });
  }

  function stripEmoji(text) {
    if (!text) return '';
    return text.replace(STRIP_EMOJI_RE, '').trim();
  }

  function normalizeText(text) {
    if (!text) return '';
    return toHiragana(String(text).toLowerCase().trim());
  }

  function normalizeUrl(url) {
    if (!url) return '';
    return String(url)
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');
  }

  function getCategoryEmoji(category) {
    if (!category) return '🔹';
    const emojis = window.CATEGORY_EMOJIS || {};
    if (emojis[category]) return emojis[category];
    const cleanCat = stripEmoji(category);
    return emojis[cleanCat] || '🔹';
  }

  function resolveUrl(itemUrl) {
    if (!itemUrl || typeof itemUrl !== 'string') return '#';
    try {
      const parsed = new URL(itemUrl, window.location.origin);
      if (parsed.origin === window.location.origin) {
        return parsed.pathname + parsed.search + parsed.hash;
      }
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.href;
      }
      return '#';
    } catch {
      if (itemUrl.startsWith('/') && !itemUrl.startsWith('//')) {
        return itemUrl;
      }
      return '#';
    }
  }

  function safeNavigate(rawUrl) {
    const url = resolveUrl(rawUrl);
    if (url && url !== '#') {
      window.location.assign(url);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildTokenVariants(tokens) {
    const tokenSet = new Set();
    tokens.forEach((t) => {
      const trimmed = t.trim();
      if (!trimmed) return;
      tokenSet.add(trimmed);
      const hira = toHiragana(trimmed);
      if (hira) tokenSet.add(hira);
      const kata = toKatakana(trimmed);
      if (kata) tokenSet.add(kata);
    });
    return Array.from(tokenSet)
      .filter((t) => t.length > 0)
      .sort((a, b) => b.length - a.length);
  }

  function highlightWithRegex(text, regex) {
    let lastIndex = 0;
    let result = '';
    let match = regex.exec(text);

    while (match !== null) {
      if (match.index > lastIndex) {
        result += escapeHtml(text.slice(lastIndex, match.index));
      }
      result += `<mark>${escapeHtml(match[0])}</mark>`;
      lastIndex = regex.lastIndex;
      match = regex.exec(text);
    }
    if (lastIndex < text.length) {
      result += escapeHtml(text.slice(lastIndex));
    }
    return result;
  }

  function highlightMatches(text, queryTokens) {
    if (!text) return '';
    if (!queryTokens || queryTokens.length === 0) return escapeHtml(text);

    const validTokens = buildTokenVariants(queryTokens);
    if (validTokens.length === 0) return escapeHtml(text);

    try {
      const pattern = validTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const regex = new RegExp(`(${pattern})`, 'gi');
      return highlightWithRegex(text, regex);
    } catch {
      return escapeHtml(text);
    }
  }

  // State
  let reportsData = null;
  let isLoading = false;
  let isOpen = false;
  let currentResults = [];
  let selectedIndex = -1;
  let previousActiveElement = null;

  // DOM Elements
  let container;
  let backdrop;
  let input;
  let clearBtn;
  let closeBtn;
  let loadingEl;
  let initialEl;
  let resultsList;
  let emptyEl;
  let countEl;
  let triggerBtn;

  function initElements() {
    container = document.getElementById('search-modal-container');
    if (!container) return false;

    backdrop = document.getElementById('search-modal-backdrop');
    input = document.getElementById('search-modal-input');
    clearBtn = document.getElementById('search-modal-clear');
    closeBtn = document.getElementById('search-modal-close');
    loadingEl = document.getElementById('search-modal-loading');
    initialEl = document.getElementById('search-modal-initial');
    resultsList = document.getElementById('search-modal-results');
    emptyEl = document.getElementById('search-modal-empty');
    countEl = document.getElementById('search-modal-count');
    triggerBtn = document.getElementById('global-search-trigger');

    return true;
  }

  function extractLinkList(item) {
    const linkList = [];
    if (item.official_site) linkList.push(item.official_site);
    if (item.links && typeof item.links === 'object') {
      Object.values(item.links).forEach((v) => {
        if (typeof v === 'string') linkList.push(v);
      });
    }
    return linkList.map((u) => normalizeUrl(u)).filter(Boolean);
  }

  function buildNormalizedReportItem(item) {
    return {
      ...item,
      _normName: normalizeText(item.tool_name),
      _normReading: normalizeText(item.tool_reading),
      _normCat: normalizeText(item.category),
      _normTags: Array.isArray(item.tags) ? item.tags.map((t) => normalizeText(t)).join(' ') : '',
      _normDesc: normalizeText(item.description),
      _normSlug: normalizeText(item.slug),
      _normDev: normalizeText(item.developer),
      _normLinks: extractLinkList(item),
      _normGithub: item.links?.github ? normalizeUrl(item.links.github) : '',
      _scoreNum: typeof item.score === 'number' ? item.score : 0,
    };
  }

  function finishLoadingState() {
    isLoading = false;
    if (loadingEl) loadingEl.style.display = 'none';
    if (input && input.value.trim().length > 0) {
      executeSearch(input.value);
    } else if (initialEl) {
      initialEl.style.display = 'block';
    }
  }

  // Fetch search data once
  async function loadData() {
    if (reportsData !== null || isLoading) return;
    isLoading = true;

    if (loadingEl) loadingEl.style.display = 'flex';
    if (initialEl) initialEl.style.display = 'none';

    try {
      const baseUrl = window.__SITE_BASEURL__ || '/tool-survey-report';
      const endpoint = `${baseUrl.replace(/\/+$/, '')}/reports-summary.json`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const rawItems = Array.isArray(data) ? data : [];
      reportsData = rawItems.map(buildNormalizedReportItem);
    } catch (err) {
      console.error('Failed to load search index:', err);
      reportsData = [];
    } finally {
      finishLoadingState();
    }
  }

  function scoreTextMatch(fieldText, token) {
    if (!fieldText) return 0;
    if (fieldText === token) return 200;
    if (fieldText.startsWith(token)) return 120;
    if (fieldText.includes(token)) return 80;
    return 0;
  }

  function scoreLinkMatch(item, normToken) {
    if (!normToken) return 0;
    const isGithubMatch =
      item._normGithub &&
      (item._normGithub === normToken || (normToken.length > 3 && item._normGithub.endsWith(`/${normToken}`)));
    if (isGithubMatch) return 250;
    if (item._normLinks?.includes(normToken)) return 200;
    if (normToken.length >= 3 && item._normLinks?.some((l) => l.includes(normToken))) return 70;
    return 0;
  }

  function scoreTokenForItem(item, token) {
    let score = scoreTextMatch(item._normName, token) + scoreTextMatch(item._normReading, token);
    if (item._normSlug.includes(token)) score += 60;
    if (item._normTags.includes(token)) score += 50;
    if (item._normCat.includes(token)) score += 30;
    if (item._normDev?.includes(token)) score += 30;
    if (item._normDesc.includes(token)) score += 10;
    score += scoreLinkMatch(item, normalizeUrl(token));
    return score;
  }

  function scoreItemAgainstTokens(item, tokens) {
    let relevance = 0;
    for (const token of tokens) {
      const tokenScore = scoreTokenForItem(item, token);
      if (tokenScore === 0) return -1;
      relevance += tokenScore;
    }
    return relevance + item._scoreNum * 0.1;
  }

  function resetEmptyQueryView() {
    currentResults = [];
    selectedIndex = -1;
    if (initialEl) initialEl.style.display = 'block';
    if (resultsList) {
      resultsList.style.display = 'none';
      resultsList.innerHTML = '';
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (countEl) countEl.textContent = '';
    if (clearBtn) clearBtn.style.display = 'none';
  }

  // Perform filtering & scoring
  function executeSearch(query) {
    const rawQuery = query.trim();
    if (!rawQuery) {
      resetEmptyQueryView();
      return;
    }

    if (clearBtn) clearBtn.style.display = 'flex';
    if (initialEl) initialEl.style.display = 'none';

    if (!reportsData) {
      loadData();
      return;
    }

    const tokens = rawQuery
      .split(/\s+/)
      .map((t) => normalizeText(t))
      .filter((t) => t.length > 0);

    const scoredItems = [];
    for (const item of reportsData) {
      const totalScore = scoreItemAgainstTokens(item, tokens);
      if (totalScore >= 0) {
        scoredItems.push({ item, score: totalScore });
      }
    }

    scoredItems.sort((a, b) => b.score - a.score);
    currentResults = scoredItems.slice(0, 25).map((x) => x.item);
    selectedIndex = currentResults.length > 0 ? 0 : -1;

    renderResults(rawQuery);
  }

  function buildResultItemElement(tool, index, queryTokens) {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.setAttribute('id', `search-result-${index}`);
    li.className = index === selectedIndex ? 'search-modal-item is-selected' : 'search-modal-item';
    li.dataset.index = String(index);

    const emoji = getCategoryEmoji(tool.category);
    const url = resolveUrl(tool.url);
    const highlightedName = highlightMatches(tool.tool_name, queryTokens);
    const highlightedDesc = highlightMatches(tool.description, queryTokens);

    const hasDistinctReading =
      Boolean(tool.tool_reading?.trim()) && normalizeText(tool.tool_reading) !== normalizeText(tool.tool_name);
    const readingHtml = hasDistinctReading
      ? `<span class="search-modal-item-reading">(${highlightMatches(tool.tool_reading, queryTokens)})</span>`
      : '';

    const tagsHtml = Array.isArray(tool.tags)
      ? tool.tags
          .slice(0, 3)
          .map((tag) => `<span class="search-modal-item-tag">${highlightMatches(tag, queryTokens)}</span>`)
          .join('')
      : '';

    const scoreHtml =
      typeof tool.score === 'number' ? `<span class="search-modal-item-score">★ ${tool.score}</span>` : '';
    const descHtml = tool.description ? `<p class="search-modal-item-desc">${highlightedDesc}</p>` : '';
    const tagsBlockHtml = tagsHtml ? `<div class="search-modal-item-tags">${tagsHtml}</div>` : '';

    li.innerHTML = `
        <span class="search-modal-item-emoji">${emoji}</span>
        <div class="search-modal-item-content">
          <div class="search-modal-item-header">
            <h4 class="search-modal-item-title">${highlightedName}${readingHtml}</h4>
            <span class="search-modal-item-category">${escapeHtml(tool.category || '')}</span>
            ${scoreHtml}
          </div>
          ${descHtml}
          ${tagsBlockHtml}
        </div>
        <span class="search-modal-item-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      `;

    li.addEventListener('click', () => {
      safeNavigate(url);
    });

    li.addEventListener('mouseenter', () => {
      updateSelectedIndex(index);
    });

    return li;
  }

  // Render search results
  function renderResults(query) {
    if (!resultsList || !emptyEl || !countEl) return;

    if (currentResults.length === 0) {
      resultsList.style.display = 'none';
      resultsList.innerHTML = '';
      emptyEl.style.display = 'block';
      countEl.textContent = '0 件';
      return;
    }

    emptyEl.style.display = 'none';
    resultsList.style.display = 'flex';
    countEl.textContent = `${currentResults.length} 件`;

    const queryTokens = query
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const fragment = document.createDocumentFragment();
    currentResults.forEach((tool, index) => {
      fragment.appendChild(buildResultItemElement(tool, index, queryTokens));
    });

    resultsList.innerHTML = '';
    resultsList.appendChild(fragment);
  }

  function updateSelectedIndex(newIndex) {
    if (!resultsList || currentResults.length === 0) return;
    selectedIndex = newIndex;

    const items = resultsList.querySelectorAll('.search-modal-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  function focusInput() {
    if (!input) return;
    input.focus();
    try {
      input.setSelectionRange(input.value.length, input.value.length);
    } catch {}
  }

  // Open / Close modal
  function openModal() {
    if (isOpen || !initElements()) return;
    isOpen = true;
    previousActiveElement = document.activeElement;

    container.style.display = 'flex';
    // Trigger animation next frame
    requestAnimationFrame(() => {
      container.classList.add('is-active');
      container.setAttribute('aria-hidden', 'false');
      focusInput();
    });

    document.body.style.overflow = 'hidden';

    // Start loading data if not loaded
    loadData();

    if (input) {
      input.value = '';
    }
    executeSearch('');

    // Ensure focus is reliably set after browser click cycle completes
    focusInput();
    setTimeout(focusInput, 30);
    setTimeout(focusInput, 80);
    setTimeout(focusInput, 150);
  }

  function closeModal() {
    if (!isOpen || !container) return;
    isOpen = false;

    container.classList.remove('is-active');
    container.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      container.style.display = 'none';
      document.body.style.overflow = '';
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }, 200);
  }

  function stepSelectedIndex(delta) {
    const count = currentResults.length;
    if (count > 0) {
      updateSelectedIndex((selectedIndex + delta + count) % count);
    }
  }

  function activateSelectedResult() {
    const count = currentResults.length;
    const isValid = selectedIndex >= 0 && selectedIndex < count;
    const target = isValid ? currentResults[selectedIndex] : currentResults[0];
    if (target) {
      safeNavigate(target.url);
    }
  }

  function handleInputKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      stepSelectedIndex(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      stepSelectedIndex(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activateSelectedResult();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  }

  function handleModalTabTrap(e) {
    if (!container) return;
    const focusable = container.querySelectorAll(
      'input, button:not([style*="display: none"]), [tabindex]:not([tabindex="-1"])',
    );
    const visible = Array.from(focusable).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === input);
    if (visible.length === 0) return;

    const first = visible[0];
    const last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function isEditableElement(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(el.isContentEditable);
  }

  function isShortcutKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') return true;
    if (document.getElementById('hero-search-input')) return false;
    return e.key === '/' && !isEditableElement(document.activeElement);
  }

  function toggleModal() {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }

  function handleGlobalKeydown(e) {
    if (isOpen && e.key === 'Escape') {
      closeModal();
      return;
    }
    if (isOpen && e.key === 'Tab') {
      handleModalTabTrap(e);
    }
    if (isShortcutKey(e)) {
      e.preventDefault();
      toggleModal();
    }
  }

  function setupEventListeners() {
    if (!initElements()) return;

    // Trigger button
    if (triggerBtn) {
      // Prevent button from stealing focus on mouse click
      triggerBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }

    // Backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) {
          input.value = '';
          input.focus();
          executeSearch('');
        }
      });
    }

    // Input events
    if (input) {
      input.addEventListener('input', (e) => {
        executeSearch(e.target.value);
      });
      input.addEventListener('keydown', handleInputKeydown);
    }

    // Quick tag chips in initial view
    const quickTagsContainer = document.getElementById('search-modal-quick-tags');
    if (quickTagsContainer) {
      quickTagsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.search-modal-tag-chip');
        if (chip?.dataset.term && input) {
          input.value = chip.dataset.term;
          input.focus();
          executeSearch(chip.dataset.term);
        }
      });
    }

    // Global keyboard shortcuts: Cmd+K / Ctrl+K / '/' and focus trap
    document.addEventListener('keydown', handleGlobalKeydown);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEventListeners);
  } else {
    setupEventListeners();
  }

  // Expose global controller
  window.SearchModal = {
    open: openModal,
    close: closeModal,
  };
})();
