/**
 * assets/js/search-modal.js
 * Global Command-Palette Search Modal for all pages.
 * Loads reports-summary.json on demand and provides real-time keyboard-first search.
 */

(() => {
  // Regex helpers
  const STRIP_EMOJI_RE = /^[\p{Extended_Pictographic}\uFE00-\uFE0F\u200D\u200C\s]+/u;
  const KATAKANA_HIRAGANA_RE = /[\u30a1-\u30f6]/g;

  function toHiragana(str) {
    if (!str) return '';
    return str.replace(KATAKANA_HIRAGANA_RE, (match) => {
      const chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
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
    if (!itemUrl) return '#';
    try {
      const parsed = new URL(itemUrl, window.location.origin);
      return parsed.pathname;
    } catch {
      return itemUrl;
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

  function highlightMatches(text, queryTokens) {
    if (!text) return '';
    const escaped = escapeHtml(text);
    if (!queryTokens || queryTokens.length === 0) return escaped;

    // Build regex of escaped tokens
    const validTokens = queryTokens.filter((t) => t.length > 0);
    if (validTokens.length === 0) return escaped;

    try {
      const pattern = validTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const regex = new RegExp(`(${pattern})`, 'gi');
      return escaped.replace(regex, '<mark>$1</mark>');
    } catch {
      return escaped;
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

  // Fetch search data once
  async function loadData() {
    if (reportsData !== null || isLoading) return;
    isLoading = true;

    if (loadingEl) loadingEl.style.display = 'flex';
    if (initialEl) initialEl.style.display = 'none';

    try {
      // Endpoint is at /reports-summary.json with baseUrl consideration
      const baseUrl = window.__SITE_BASEURL__ || '/tool-survey-report';
      const endpoint = `${baseUrl.replace(/\/+$/, '')}/reports-summary.json`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Pre-compute normalized search indices for maximum performance
      reportsData = (Array.isArray(data) ? data : []).map((item) => {
        const normName = normalizeText(item.tool_name);
        const normCat = normalizeText(item.category);
        const normTags = Array.isArray(item.tags) ? item.tags.map((t) => normalizeText(t)).join(' ') : '';
        const normDesc = normalizeText(item.description);
        const normSlug = normalizeText(item.slug);

        const linkList = [];
        if (item.official_site) linkList.push(item.official_site);
        if (item.links && typeof item.links === 'object') {
          Object.values(item.links).forEach((v) => {
            if (typeof v === 'string') linkList.push(v);
          });
        }
        const normLinks = linkList.map((u) => normalizeUrl(u)).filter(Boolean);
        const normGithub = item.links?.github ? normalizeUrl(item.links.github) : '';

        return {
          ...item,
          _normName: normName,
          _normCat: normCat,
          _normTags: normTags,
          _normDesc: normDesc,
          _normSlug: normSlug,
          _normLinks: normLinks,
          _normGithub: normGithub,
          _scoreNum: typeof item.score === 'number' ? item.score : 0,
        };
      });
    } catch (err) {
      console.error('Failed to load search index:', err);
      reportsData = [];
    } finally {
      isLoading = false;
      if (loadingEl) loadingEl.style.display = 'none';
      if (input && input.value.trim().length > 0) {
        executeSearch(input.value);
      } else if (initialEl) {
        initialEl.style.display = 'block';
      }
    }
  }

  // Perform filtering & scoring
  function executeSearch(query) {
    const rawQuery = query.trim();
    if (!rawQuery) {
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
      return;
    }

    if (clearBtn) clearBtn.style.display = 'flex';
    if (initialEl) initialEl.style.display = 'none';

    if (!reportsData) {
      loadData();
      return;
    }

    // Split into tokens
    const tokens = rawQuery
      .split(/\s+/)
      .map((t) => normalizeText(t))
      .filter((t) => t.length > 0);

    const scoredItems = [];

    for (let i = 0; i < reportsData.length; i++) {
      const item = reportsData[i];
      let matchesAll = true;
      let relevance = 0;

      for (let j = 0; j < tokens.length; j++) {
        const token = tokens[j];
        let tokenMatch = false;

        // Exact / prefix match on name
        if (item._normName === token) {
          relevance += 200;
          tokenMatch = true;
        } else if (item._normName.startsWith(token)) {
          relevance += 120;
          tokenMatch = true;
        } else if (item._normName.includes(token)) {
          relevance += 80;
          tokenMatch = true;
        }

        // Match on slug
        if (item._normSlug.includes(token)) {
          relevance += 60;
          tokenMatch = true;
        }

        // Match on tags
        if (item._normTags.includes(token)) {
          relevance += 50;
          tokenMatch = true;
        }

        // Match on category
        if (item._normCat.includes(token)) {
          relevance += 30;
          tokenMatch = true;
        }

        // Match on description
        if (item._normDesc.includes(token)) {
          relevance += 10;
          tokenMatch = true;
        }

        // Match on GitHub URL / Links
        const normToken = normalizeUrl(token);
        if (
          item._normGithub &&
          (item._normGithub === normToken || (normToken.length > 3 && item._normGithub.endsWith(`/${normToken}`)))
        ) {
          relevance += 250;
          tokenMatch = true;
        } else if (item._normLinks?.some((l) => l === normToken)) {
          relevance += 200;
          tokenMatch = true;
        } else if (normToken.length >= 3 && item._normLinks?.some((l) => l.includes(normToken))) {
          relevance += 70;
          tokenMatch = true;
        }

        if (!tokenMatch) {
          matchesAll = false;
          break;
        }
      }

      if (matchesAll) {
        // Boost slightly by evaluation score
        const totalScore = relevance + item._scoreNum * 0.1;
        scoredItems.push({ item, score: totalScore });
      }
    }

    // Sort by relevance desc
    scoredItems.sort((a, b) => b.score - a.score);

    // Limit to top 25 results
    currentResults = scoredItems.slice(0, 25).map((x) => x.item);
    selectedIndex = currentResults.length > 0 ? 0 : -1;

    renderResults(rawQuery);
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
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('id', `search-result-${index}`);
      li.className = `search-modal-item ${index === selectedIndex ? 'is-selected' : ''}`;
      li.dataset.index = String(index);

      const emoji = getCategoryEmoji(tool.category);
      const url = resolveUrl(tool.url);
      const highlightedName = highlightMatches(tool.tool_name, queryTokens);
      const highlightedDesc = highlightMatches(tool.description, queryTokens);

      const tagsHtml = Array.isArray(tool.tags)
        ? tool.tags
            .slice(0, 3)
            .map((tag) => `<span class="search-modal-item-tag">${highlightMatches(tag, queryTokens)}</span>`)
            .join('')
        : '';

      const scoreHtml =
        typeof tool.score === 'number' ? `<span class="search-modal-item-score">★ ${tool.score}</span>` : '';

      li.innerHTML = `
        <span class="search-modal-item-emoji">${emoji}</span>
        <div class="search-modal-item-content">
          <div class="search-modal-item-header">
            <h4 class="search-modal-item-title">${highlightedName}</h4>
            <span class="search-modal-item-category">${escapeHtml(tool.category || '')}</span>
            ${scoreHtml}
          </div>
          ${tool.description ? `<p class="search-modal-item-desc">${highlightedDesc}</p>` : ''}
          ${tagsHtml ? `<div class="search-modal-item-tags">${tagsHtml}</div>` : ''}
        </div>
        <span class="search-modal-item-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      `;

      // Click to navigate
      li.addEventListener('click', () => {
        window.location.href = url;
      });

      // Hover to select
      li.addEventListener('mouseenter', () => {
        updateSelectedIndex(index);
      });

      fragment.appendChild(li);
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

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentResults.length > 0) {
            const next = (selectedIndex + 1) % currentResults.length;
            updateSelectedIndex(next);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentResults.length > 0) {
            const prev = (selectedIndex - 1 + currentResults.length) % currentResults.length;
            updateSelectedIndex(prev);
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
            const target = currentResults[selectedIndex];
            window.location.href = resolveUrl(target.url);
          } else if (currentResults.length > 0) {
            window.location.href = resolveUrl(currentResults[0].url);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
        }
      });
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
    document.addEventListener('keydown', (e) => {
      // If modal is open, handle Escape and Tab trap
      if (isOpen) {
        if (e.key === 'Escape') {
          closeModal();
          return;
        }

        if (e.key === 'Tab' && container) {
          const focusable = container.querySelectorAll(
            'input, button:not([style*="display: none"]), [tabindex]:not([tabindex="-1"])',
          );
          const visible = Array.from(focusable).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === input,
          );
          if (visible.length > 0) {
            const first = visible[0];
            const last = visible[visible.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
              return;
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
              return;
            }
          }
        }
      }

      // Check if user is typing in form element
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable);

      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      const isSlash = e.key === '/' && !isInputFocused;

      if (isCmdK || isSlash) {
        // Prevent default browser/page behavior
        e.preventDefault();
        if (isOpen) {
          closeModal();
        } else {
          openModal();
        }
      }
    });
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
