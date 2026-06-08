/**
 * assets/js/trending.js
 * Handles the logic for the trending page, including search filtering.
 * Follows the search experience of the home page.
 */

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
  const heroSearchInput = document.getElementById('hero-search-input');
  const heroSearchClear = document.getElementById('hero-search-clear');
  const heroSearchChips = Array.from(document.querySelectorAll('.hero-search-chip'));
  const reportsGrid = document.getElementById('reports-grid');
  const reportsCountContainer = document.getElementById('reports-count-container');
  const noResults = document.getElementById('no-results');
  const reportCards = Array.from(document.querySelectorAll('.report-card'));

  // カテゴリ要素およびタイトルに絵文字を適用する関数
  function applyEmojisToCategories() {
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

  // レポート件数を更新する関数
  function updateReportsCount(count, isFilterActive) {
    if (!reportsCountContainer) return;

    // アニメーションのために一度要素を隠す
    reportsCountContainer.style.opacity = '0';
    reportsCountContainer.style.transform = 'translateY(5px)';

    setTimeout(() => {
      if (isFilterActive) {
        reportsCountContainer.textContent = `${count}件のトレンドがヒット`;
      } else {
        reportsCountContainer.textContent = `全 ${count}件のトレンドを表示中`;
      }
      reportsCountContainer.style.opacity = '1';
      reportsCountContainer.style.transform = 'translateY(0)';
    }, 100);
  }

  // Filter function
  const filterReports = () => {
    const rawSearchTerm = (heroSearchInput?.value || '').toLowerCase().trim();
    const searchTerm = toHiragana(rawSearchTerm);

    const filteredCards = reportCards.filter((card) => {
      const orGroups = searchTerm
        .split(/\||\sOR\s/i)
        .map((t) => t.trim())
        .filter((t) => t);

      // Helper for field matching
      const matchesFields = (term, allowPartialTags = true) => {
        const hTerm = toHiragana(term.toLowerCase());
        const titleMatch = card.dataset.title && toHiragana(card.dataset.title.toLowerCase()).includes(hTerm);
        const descMatch =
          card.dataset.description && toHiragana(card.dataset.description.toLowerCase()).includes(hTerm);

        // Tag matching
        const tagsMatch = card.dataset.tags?.split(',').some((tag) => {
          const hTag = toHiragana(tag.trim().toLowerCase());
          if (hTerm.length <= 1) return hTag === hTerm; // Single char must be exact
          return allowPartialTags ? hTag.includes(hTerm) : hTag === hTerm;
        });

        // Category matching
        const catMatch = card.dataset.category && toHiragana(card.dataset.category.toLowerCase()).includes(hTerm);

        return titleMatch || descMatch || tagsMatch || catMatch;
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

      return matchesSearch;
    });

    const isFilterActive = searchTerm !== '';

    // Hide/Show cards
    reportCards.forEach((card) => {
      if (filteredCards.includes(card)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Toggle no results message
    if (filteredCards.length > 0) {
      if (noResults) noResults.style.display = 'none';
    } else {
      if (noResults) noResults.style.display = 'block';
    }

    // 件数表示を更新
    updateReportsCount(filteredCards.length, isFilterActive);
  };

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
    filterReports();
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
      // Scroll to grid for immediate results visibility
      if (reportsGrid) {
        reportsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Keyboard shortcut: "/" to focus hero search
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')
    ) {
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

  // Initial state setup
  applyEmojisToCategories();
  filterReports();
});
