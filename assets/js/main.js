/**
 * ScrollManager: Centralized scroll event handling
 * Optimizes performance by using a single scroll listener and requestAnimationFrame loop
 */
const ScrollManager = (() => {
  const handlers = new Set();
  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        handlers.forEach((handler) => {
          handler(scrollTop);
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  return {
    register: (handler) => {
      handlers.add(handler);
      if (handlers.size === 1) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
    },
    unregister: (handler) => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        window.removeEventListener('scroll', handleScroll);
      }
    },
  };
})();

/**
 * Initialize all site functionality
 */
function initAll() {
  // Theme toggle (run early to avoid flash)
  initThemeToggle();

  // Mobile navigation toggle
  initMobileNavigation();

  // Navigation dropdown toggle
  initNavigationDropdown();

  // Search functionality
  initSearchFunctionality();

  // Smooth scrolling for anchor links
  initSmoothScrolling();

  // Focus management for accessibility
  initFocusManagement();

  // Report content enhancements
  initReportEnhancements();

  // Initialize accessibility enhancements
  initAccessibilityEnhancements();

  // トップに戻るボタンの初期化
  initBackToTopButton();

  // フィルタのリセット機能の初期化
  initFilterReset();

  // スクロール連動ヘッダーの初期化
  initSmartHeader();

  // Initialize keyboard shortcuts
  initKeyboardShortcuts();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

function toggleMenu(show, navToggle, navMenu, body) {
  navToggle.setAttribute('aria-expanded', show);

  if (show) {
    navMenu.classList.add('active');
    body.style.overflow = 'hidden'; // Lock body scroll
    trapFocus(navMenu);
  } else {
    navMenu.classList.remove('active');
    body.style.overflow = ''; // Unlock body scroll
    removeFocusTrap();
  }
}

// Mobile navigation functionality
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;

  if (navToggle && navMenu) {
    // Toggle menu
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      toggleMenu(!isExpanded, navToggle, navMenu, body);
    });

    // Close mobile menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false, navToggle, navMenu, body);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        toggleMenu(false, navToggle, navMenu, body);
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu(false, navToggle, navMenu, body);
        navToggle.focus();
      }
    });
  }

  // Dropdown functionality
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          otherToggle.parentElement.classList.remove('active');
        }
      });

      // Toggle current dropdown
      toggle.setAttribute('aria-expanded', !isExpanded);
      toggle.parentElement.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdownToggles.forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.parentElement.classList.remove('active');
      });
    }
  });
}

// Navigation dropdown functionality
function initNavigationDropdown() {
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdown = document.querySelector('.nav-dropdown');

  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('active');
      }
    });
  }
}

// Search functionality
function initSearchFunctionality() {
  const searchForms = document.querySelectorAll('.search-form');

  searchForms.forEach((form) => {
    const searchInput = form.querySelector('.search-input, #search-input, #nav-search-input');

    if (searchInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
          // Simple client-side search implementation
          performSearch(searchTerm);
        }
      });

      // Real-time search suggestions (basic implementation)
      // Inject styles once
      injectSearchStyles();

      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const searchTerm = searchInput.value.trim();
          if (searchTerm.length > 2) {
            showSearchSuggestions(searchTerm, searchInput);
          } else {
            hideSearchSuggestions();
          }
        }, 300);
      });
    }
  });
}

// Inject styles for search suggestions
function injectSearchStyles() {
  if (document.getElementById('search-suggestion-styles')) return;

  const style = document.createElement('style');
  style.id = 'search-suggestion-styles';
  style.textContent = `
    .search-suggestion-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      border-bottom: 1px solid #f8f9fa;
    }
    .search-suggestion-item:hover {
      background-color: #f8f9fa;
    }
  `;
  document.head.appendChild(style);
}

// Simple client-side search
function performSearch(searchTerm) {
  // Redirect to home page with search parameter
  const homeUrl = '/';
  const searchUrl = `${homeUrl}?search=${encodeURIComponent(searchTerm)}`;
  window.location.href = searchUrl;
}

// Basic search suggestions
function showSearchSuggestions(searchTerm, inputElement) {
  // This would typically fetch from an API or search index
  // For now, we'll implement a basic version

  const form = inputElement.closest('.search-form');
  let suggestions = form ? form.querySelector('.search-suggestions') : null;
  const isNew = !suggestions;

  if (isNew) {
    // Create suggestions dropdown
    suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    suggestions.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #dee2e6;
      border-top: none;
      border-radius: 0 0 0.375rem 0.375rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    `;

    // Add event delegation for click handling
    suggestions.addEventListener('click', (e) => {
      const item = e.target.closest('.search-suggestion-item');
      if (item) {
        const suggestion = item.textContent;
        inputElement.value = suggestion;
        performSearch(suggestion);
      }
    });
  }

  // Add some example suggestions (in a real implementation, this would be dynamic)
  const exampleSuggestions = ['Jenkins レポート', 'NotebookLM 調査', 'システム分析'].filter((suggestion) =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (exampleSuggestions.length > 0) {
    // Use DocumentFragment for better performance and security
    const fragment = document.createDocumentFragment();

    exampleSuggestions.forEach((suggestion) => {
      const item = document.createElement('div');
      item.className = 'search-suggestion-item';
      item.setAttribute('data-value', suggestion);
      item.textContent = suggestion;
      fragment.appendChild(item);
    });

    suggestions.innerHTML = '';
    suggestions.appendChild(fragment);

    // Position relative to input if it's new or not yet attached
    if (isNew && form) {
      form.style.position = 'relative';
      form.appendChild(suggestions);
    }
  } else {
    // Remove suggestions if no match and it exists in DOM
    if (!isNew && suggestions.parentNode) {
      suggestions.remove();
    }
  }
}

function hideSearchSuggestions() {
  const existingSuggestions = document.querySelector('.search-suggestions');
  if (existingSuggestions) {
    existingSuggestions.remove();
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });

        // Update focus for accessibility
        targetElement.focus();
        if (document.activeElement !== targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      }
    });
  });
}

// Focus management for accessibility
function initFocusManagement() {
  // Add main content ID if it doesn't exist
  const mainContent = document.querySelector('.main-content');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }

  // Improve focus visibility - detect keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Announce page changes for screen readers
  announcePageChanges();

  // Enhance form accessibility
  enhanceFormAccessibility();
}

// Focus trap for modal/mobile menu
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
  );

  if (focusableElements.length === 0) return;

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });

  firstFocusableElement.focus();
}

function removeFocusTrap() {
  // Remove event listeners (in a real implementation, you'd store references)
  // For now, this is a placeholder
}

// Report content enhancements
function initReportEnhancements() {
  // Add copy buttons to code blocks
  addCopyButtonsToCodeBlocks();

  // Enhance tables with responsive wrapper
  enhanceTablesResponsiveness();

  // Add external link indicators
  markExternalLinks();

  // Initialize table of contents if needed
  applyEmojisToHeadings();
  addAnchorLinksToHeadings();
  generateTableOfContents();
  initReadingTime();
  initScrollProgressBar();
}

/**
 * 読了目安時間の自動計算とメタデータへの挿入
 */
function initReadingTime() {
  const reportContent = document.querySelector('.report-content');
  const container = document.getElementById('report-reading-time');
  if (!reportContent || !container) return;

  const text = reportContent.textContent || '';
  const charCount = text.replace(/\s+/g, '').length;
  // 日本語約500文字/分で算定（最低1分）
  const minutes = Math.max(1, Math.ceil(charCount / 500));

  const textEl = container.querySelector('.reading-time-text');
  if (textEl) {
    textEl.textContent = `読了目安: 約${minutes}分 (${charCount.toLocaleString()}文字)`;
    container.style.display = 'inline-flex';
  }
}

/**
 * ページ最上部のスクロールプログレスバーの初期化
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  ScrollManager.register((scrollTop) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    progressBar.style.width = `${scrollPercent}%`;
  });
}

/**
 * H2 / H3 見出しにホバー表示のパーマリンクアンカーを追加
 */
function addAnchorLinksToHeadings() {
  const reportContent = document.querySelector('.report-content');
  if (!reportContent) return;

  const headings = reportContent.querySelectorAll('h2, h3');
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    if (heading.querySelector('.heading-anchor')) return;

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${heading.id}`;
    anchor.setAttribute('aria-label', `${heading.textContent} へのパーマリンク`);
    anchor.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    `;

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(window.location.href);
      url.hash = heading.id;
      history.pushState(null, null, url.toString());

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
      const targetPosition = heading.offsetTop - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url.toString()).then(() => {
          if (typeof announcePageChanges === 'function') {
            announcePageChanges();
          }
        });
      }
    });

    heading.appendChild(anchor);
  });
}

/**
 * レポートの主要セクション見出しに絵文字を動的に付加する
 */
function applyEmojisToHeadings() {
  const reportContent = document.querySelector('.report-content');
  if (!reportContent) return;

  const emojiMap = {
    // 主要セクション
    基本情報: '📋',
    目的と主な利用シーン: '🎯',
    主要機能: '🛠️',
    '動作原理・システム構成': '🔄',
    '特徴・強み': '💪',
    '弱み・注意点': '⚠️',
    料金プラン: '💰',
    '導入実績・事例': '🏢',
    サポート体制: '📞',
    連携機能: '🔌',
    エコシステムと連携: '🔌',
    ベストプラクティス: '✨',
    セキュリティとコンプライアンス: '🛡️',
    操作性: '🖱️',
    ユーザーの声: '💬',
    直近半年のアップデート情報: '🆙',
    類似ツールとの比較: '⚔️',
    総評: '📝',
    開始手順: '🚀',
    セットアップ: '🚀',
    // トレンドレポート用
    本日のまとめ: '🗒️',
    緊急セキュリティ情報: '🚨',
    'メジャーリリース・新機能': '🚀',
    注目のトレンドツール: '🌟',
    'その他・Tips': '💡',
  };

  const headings = reportContent.querySelectorAll('h2');
  headings.forEach((h) => {
    const text = h.textContent;
    for (const [key, emoji] of Object.entries(emojiMap)) {
      // 絵文字がまだ付いておらず、キーワードが含まれる場合に付与
      if (text.includes(key) && !text.includes(emoji)) {
        // テキストの先頭（番号の前後など）ではなく、見出し全体の先頭に挿入
        h.innerHTML = `${emoji} ${h.innerHTML}`;
        break;
      }
    }
  });
}

function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.textContent = 'コピー';
    button.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    `;

    pre.style.position = 'relative';

    pre.addEventListener('mouseenter', () => {
      button.style.opacity = '1';
    });

    pre.addEventListener('mouseleave', () => {
      button.style.opacity = '0';
    });

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        button.textContent = 'コピー済み!';
        setTimeout(() => {
          button.textContent = 'コピー';
        }, 2000);
      });
    });

    pre.appendChild(button);
  });
}

function enhanceTablesResponsiveness() {
  const tables = document.querySelectorAll('.report-content table');

  // Shared scroll check logic
  const checkScroll = (wrapper) => {
    // Use cached values if available, otherwise read from DOM
    const scrollWidth = wrapper._scrollWidth || wrapper.scrollWidth;
    const clientWidth = wrapper._clientWidth || wrapper.clientWidth;
    const scrollLeft = wrapper.scrollLeft;

    const isScrollable = scrollWidth > clientWidth;
    // Check if scrolled to the end (approximate for cross-browser safety)
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;

    // Only write to DOM if state needs to change
    const hasClass = wrapper.classList.contains('has-scroll');
    const shouldHaveClass = isScrollable && !isAtEnd;

    if (shouldHaveClass && !hasClass) {
      wrapper.classList.add('has-scroll');
    } else if (!shouldHaveClass && hasClass) {
      wrapper.classList.remove('has-scroll');
    }
  };

  // Single ResizeObserver for all tables
  const resizeObserver = new ResizeObserver((entries) => {
    const wrappersToUpdate = new Set();
    for (const entry of entries) {
      let wrapper = null;
      if (entry.target.classList.contains('table-responsive')) {
        wrapper = entry.target;
      } else if (
        entry.target.tagName === 'TABLE' &&
        entry.target.parentElement?.classList.contains('table-responsive')
      ) {
        wrapper = entry.target.parentElement;
      }

      if (wrapper) {
        wrappersToUpdate.add(wrapper);
      }
    }

    for (const wrapper of wrappersToUpdate) {
      // Update cache
      wrapper._scrollWidth = wrapper.scrollWidth;
      wrapper._clientWidth = wrapper.clientWidth;
      checkScroll(wrapper);
    }
  });

  tables.forEach((table) => {
    // 1. セルの内容をdata-label属性にセット（カード表示用）
    const thead = table.querySelector('thead');
    if (thead) {
      const headers = Array.from(thead.querySelectorAll('th')).map((th) => th.textContent.trim());
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
          if (headers[index]) {
            cell.setAttribute('data-label', headers[index]);
          }
        });
      });
    }

    // 2. 特定のキーワード（料金、比較など）が見つかった場合にカード形式クラスを付与
    let shouldBeCards = false;
    const keywords = ['料金', 'プラン', '比較', '価格'];

    // 直前の見出しを確認
    let prev = table.previousElementSibling;
    while (prev && !['H2', 'H3', 'H4'].includes(prev.tagName)) {
      prev = prev.previousElementSibling;
    }

    if (prev) {
      const headingText = prev.textContent;
      if (keywords.some((k) => headingText.includes(k))) {
        shouldBeCards = true;
      }
    }

    if (shouldBeCards) {
      table.classList.add('table-as-cards');
    }

    // 3. レスポンシブラッパーでラップ
    if (!table.parentElement.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      if (shouldBeCards) {
        wrapper.classList.add('responsive-cards-wrapper');
      }

      table.parentElement.insertBefore(wrapper, table);
      wrapper.appendChild(table);

      // Initial check
      checkScroll(wrapper);

      // Observe resize on wrapper AND table (to catch content size changes)
      resizeObserver.observe(wrapper);
      resizeObserver.observe(table);

      // Throttled scroll listener
      let ticking = false;
      wrapper.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              checkScroll(wrapper);
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    }
  });
}

function markExternalLinks() {
  const links = document.querySelectorAll('.report-content a[href^="http"]');
  const currentDomain = window.location.hostname;

  links.forEach((link) => {
    const linkDomain = new URL(link.href).hostname;

    if (linkDomain !== currentDomain) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('aria-label', `${link.textContent} (新しいタブで開く)`);
    }
  });
}

function generateTableOfContents() {
  const reportContent = document.querySelector('.report-content');
  const headings = reportContent ? reportContent.querySelectorAll('h2, h3, h4') : [];

  if (headings.length > 3) {
    // --------------------------------------------------
    // 1. インライン目次の生成
    // --------------------------------------------------
    const toc = document.createElement('nav');
    toc.className = 'table-of-contents';
    toc.setAttribute('aria-label', '目次');

    const tocHeader = document.createElement('div');
    tocHeader.className = 'toc-header';
    tocHeader.innerHTML = `
      <h3 class="toc-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: text-bottom;">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        目次
      </h3>
      <button type="button" class="toc-toggle-btn" aria-expanded="true" aria-label="目次を折りたたむ">
        <svg class="toc-toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    `;

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    // --------------------------------------------------
    // 2. フローティング目次のHTML構造生成
    // --------------------------------------------------
    const floatingWrapper = document.createElement('div');
    floatingWrapper.className = 'floating-toc-wrapper';

    // PC用追従サイドパネル
    const desktopToc = document.createElement('nav');
    desktopToc.className = 'floating-toc-desktop';
    desktopToc.setAttribute('aria-label', 'フローティング目次 (デスクトップ)');
    desktopToc.innerHTML = `
      <div class="floating-toc-header">
        <span class="floating-toc-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          目次
        </span>
        <button type="button" class="floating-toc-toggle-btn" aria-expanded="true" aria-label="フローティング目次を折りたたむ">
          <svg class="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    `;
    const desktopList = document.createElement('ul');
    desktopList.className = 'floating-toc-list';
    desktopToc.appendChild(desktopList);

    // モバイル用FAB & ドロワー
    const mobileToc = document.createElement('div');
    mobileToc.className = 'floating-toc-mobile';

    const fabBtn = document.createElement('button');
    fabBtn.type = 'button';
    fabBtn.className = 'floating-toc-fab';
    fabBtn.setAttribute('aria-label', '目次を開く');
    fabBtn.setAttribute('aria-expanded', 'false');
    fabBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
      <span>目次</span>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'floating-toc-overlay';

    const drawer = document.createElement('nav');
    drawer.className = 'floating-toc-drawer';
    drawer.setAttribute('aria-label', '目次 (モバイル)');
    drawer.innerHTML = `
      <div class="drawer-header">
        <span class="drawer-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          目次
        </span>
        <button type="button" class="drawer-close-btn" aria-label="閉じる">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
    const mobileList = document.createElement('ul');
    mobileList.className = 'drawer-toc-list';
    drawer.appendChild(mobileList);

    mobileToc.appendChild(fabBtn);
    mobileToc.appendChild(overlay);
    mobileToc.appendChild(drawer);

    floatingWrapper.appendChild(desktopToc);
    floatingWrapper.appendChild(mobileToc);

    // スムーズスクロール共通ハンドラ
    const createScrollHandler = (targetId, closeMobileDrawer = false) => (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        history.pushState(null, null, `#${targetId}`);

        if (closeMobileDrawer) {
          closeDrawer();
        }
      }
    };

    // --------------------------------------------------
    // 3. 見出し要素のループ処理とリスト構築
    // --------------------------------------------------
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      const id = heading.id;
      const tagLower = heading.tagName.toLowerCase();

      // クローンテキストの生成
      const clone = heading.cloneNode(true);
      const anchorEl = clone.querySelector('.heading-anchor');
      if (anchorEl) anchorEl.remove();
      const titleText = clone.textContent.trim();

      // A) インライン目次項目
      const listItem = document.createElement('li');
      listItem.className = `toc-item toc-level-${tagLower}`;
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = titleText;
      link.addEventListener('click', createScrollHandler(id));
      listItem.appendChild(link);
      tocList.appendChild(listItem);

      // B) デスクトップ用フローティング目次項目
      const dtItem = document.createElement('li');
      dtItem.className = `floating-toc-item toc-level-${tagLower}`;
      const dtLink = document.createElement('a');
      dtLink.href = `#${id}`;
      dtLink.textContent = titleText;
      dtLink.addEventListener('click', createScrollHandler(id));
      dtItem.appendChild(dtLink);
      desktopList.appendChild(dtItem);

      // C) モバイル用ドロワー目次項目
      const mobItem = document.createElement('li');
      mobItem.className = `drawer-toc-item toc-level-${tagLower}`;
      const mobLink = document.createElement('a');
      mobLink.href = `#${id}`;
      mobLink.textContent = titleText;
      mobLink.addEventListener('click', createScrollHandler(id, true));
      mobItem.appendChild(mobLink);
      mobileList.appendChild(mobItem);
    });

    toc.appendChild(tocHeader);
    toc.appendChild(tocList);

    // --------------------------------------------------
    // 4. イベントハンドラ & モバイルドロワー開閉制御
    // --------------------------------------------------
    // インライン目次のトグルボタン処理
    const toggleBtn = tocHeader.querySelector('.toc-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        toggleBtn.setAttribute('aria-label', isExpanded ? '目次を展開する' : '目次を折りたたむ');
        tocList.classList.toggle('collapsed', isExpanded);
      });
    }

    // デスクトップフローティング目次のトグルボタン処理
    const desktopToggleBtn = desktopToc.querySelector('.floating-toc-toggle-btn');
    if (desktopToggleBtn) {
      desktopToggleBtn.addEventListener('click', () => {
        const isExpanded = desktopToggleBtn.getAttribute('aria-expanded') === 'true';
        desktopToggleBtn.setAttribute('aria-expanded', !isExpanded);
        desktopToggleBtn.setAttribute('aria-label', isExpanded ? '目次を展開する' : '目次を折りたたむ');
        desktopList.classList.toggle('collapsed', isExpanded);
      });
    }

    // モバイルドロワー開閉関数
    const openDrawer = () => {
      mobileToc.classList.add('is-open');
      fabBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      mobileToc.classList.remove('is-open');
      fabBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    fabBtn.addEventListener('click', () => {
      if (mobileToc.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);
    const closeBtn = drawer.querySelector('.drawer-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileToc.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // --------------------------------------------------
    // 5. ScrollSpy & 表示タイミング制御
    // --------------------------------------------------
    const allTocLinks = [
      ...tocList.querySelectorAll('a'),
      ...desktopList.querySelectorAll('a'),
      ...mobileList.querySelectorAll('a'),
    ];

    ScrollManager.register((scrollTop) => {
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
      let currentId = '';

      headings.forEach((heading) => {
        const top = heading.offsetTop - headerHeight - 40;
        if (scrollTop >= top) {
          currentId = heading.id;
        }
      });

      allTocLinks.forEach((link) => {
        if (currentId && link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // インライン目次または一定位置（300px）をスクロールしたらフローティング目次を表示
      const inlineToc = document.querySelector('.table-of-contents');
      const triggerThreshold = inlineToc ? (inlineToc.offsetTop + inlineToc.offsetHeight) : 300;
      if (scrollTop > triggerThreshold) {
        floatingWrapper.classList.add('is-visible');
      } else {
        floatingWrapper.classList.remove('is-visible');
      }
    });

    // --------------------------------------------------
    // 6. DOM要素への挿入
    // --------------------------------------------------
    // インライン目次の挿入
    const firstH2 = reportContent.querySelector('h2');
    if (firstH2) {
      firstH2.parentElement.insertBefore(toc, firstH2);
    } else {
      const firstH1 = reportContent.querySelector('h1');
      if (firstH1?.nextSibling) {
        firstH1.parentElement.insertBefore(toc, firstH1.nextSibling);
      } else {
        reportContent.insertBefore(toc, reportContent.firstChild);
      }
    }

    // フローティング目次を body 直下に追加 (Stacking Contextを最上位に維持)
    document.body.appendChild(floatingWrapper);
  }
}

// Announce page changes for screen readers
function announcePageChanges() {
  // Create live region for announcements
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'live-region';
  document.body.appendChild(liveRegion);

  // Function to announce messages
  window.announceToScreenReader = (message) => {
    liveRegion.textContent = message;
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  };
}

// Enhance form accessibility
function enhanceFormAccessibility() {
  // Add required field indicators
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  requiredFields.forEach((field) => {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label && !label.querySelector('.required-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'required-indicator';
      indicator.textContent = ' *';
      indicator.setAttribute('aria-label', '必須項目');
      indicator.style.color = '#dc3545';
      label.appendChild(indicator);
    }
  });

  // Add error message containers
  const formFields = document.querySelectorAll('input, select, textarea');
  formFields.forEach((field) => {
    if (!field.nextElementSibling?.classList.contains('error-message')) {
      const errorContainer = document.createElement('div');
      errorContainer.className = 'error-message';
      errorContainer.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
      `;
      errorContainer.setAttribute('role', 'alert');
      field.parentElement.insertBefore(errorContainer, field.nextSibling);
    }
  });
}

// Keyboard shortcuts for better navigation
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt + M: Focus main content
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        announceToScreenReader('メインコンテンツにフォーカスしました');
      }
    }

    // Alt + N: Focus navigation
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      const navigation = document.querySelector('.main-navigation');
      if (navigation) {
        const firstLink = navigation.querySelector('a, button');
        if (firstLink) {
          firstLink.focus();
          announceToScreenReader('ナビゲーションにフォーカスしました');
        }
      }
    }

    // Alt + S: Focus search
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-input, #search-input');
      if (searchInput) {
        searchInput.focus();
        announceToScreenReader('検索フィールドにフォーカスしました');
      }
    }
  });
}

// トップに戻るボタンの機能
function initBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

  // イベントリスナーの設定
  ScrollManager.register((scrollTop) => updateBackToTopButtonVisibility(backToTopButton, scrollTop));
  backToTopButton.addEventListener('click', scrollToTop);

  // キーボードサポート
  backToTopButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  });

  // 初期状態の設定
  updateBackToTopButtonVisibility(backToTopButton);
}

/**
 * トップに戻るボタンの表示/非表示を制御する
 * @param {HTMLElement} backToTopButton - 対象のボタン要素
 * @param {number} [scrollTop] - 現在のスクロール位置
 */
function updateBackToTopButtonVisibility(backToTopButton, scrollTop) {
  if (!backToTopButton) return;

  if (scrollTop === undefined) {
    scrollTop = window.scrollY || document.documentElement.scrollTop;
  }

  // 300px以上スクロールした場合に表示
  if (scrollTop > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
}

/**
 * ページトップまでスムーズにスクロールする
 */
function scrollToTop() {
  // すでにスクロール中なら何もしない
  if (isScrollingToTop) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 既存のタイマーをクリア
  if (activeScrollInterval) clearInterval(activeScrollInterval);
  if (activeScrollTimeout) clearTimeout(activeScrollTimeout);

  // スマートヘッダーとの干渉を防止
  isScrollingToTop = true;

  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.remove('header-hidden');
    // トランジションを一時的に無効化して即時適用
    header.style.transition = 'none';

    // レイアウト再計算を強制
    void header.offsetHeight;
  }

  if (prefersReducedMotion) {
    window.scrollTo(0, 0);
    isScrollingToTop = false;
    if (header) header.style.transition = '';
  } else {
    // DOM更新が確実に適用されてからスクロール開始
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    // Safety check & Cleanup
    activeScrollInterval = setInterval(() => {
      // トップに到達したかチェック
      if ((window.scrollY || document.documentElement.scrollTop) < 1) {
        isScrollingToTop = false;
        if (header) header.style.transition = '';
        if (activeScrollInterval) {
          clearInterval(activeScrollInterval);
          activeScrollInterval = null;
        }
        if (activeScrollTimeout) {
          clearTimeout(activeScrollTimeout);
          activeScrollTimeout = null;
        }
      }
    }, 100);

    // Force reset after 2 seconds
    activeScrollTimeout = setTimeout(() => {
      isScrollingToTop = false;
      if (header) header.style.transition = '';
      if (activeScrollInterval) {
        clearInterval(activeScrollInterval);
        activeScrollInterval = null;
      }
      activeScrollTimeout = null;
    }, 2000);
  }

  // フォーカスをページトップの適切な要素に移動
  const skipLink = document.querySelector('.skip-link');
  const mainHeading = document.querySelector('h1');
  const mainContent = document.getElementById('main-content');

  if (skipLink) {
    skipLink.focus();
  } else if (mainHeading) {
    mainHeading.setAttribute('tabindex', '-1');
    mainHeading.focus();
  } else if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  }

  // スクリーンリーダーへの通知
  if (window.announceToScreenReader) {
    window.announceToScreenReader('ページの先頭に戻りました');
  }
}
/**
 * サイトタイトルやホームボタンをクリックした際にフィルタをリセットする
 */
function initFilterReset() {
  const resetLinks = document.querySelectorAll('.reset-filter-link');
  const FILTER_STATE_KEY = 'homeFilterState';

  resetLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // フィルタ状態を保存しているsessionStorageをクリア
      sessionStorage.removeItem(FILTER_STATE_KEY);

      const searchInput = document.getElementById('report-search');
      const tagFilter = document.getElementById('tag-filter');
      const categoryFilter = document.getElementById('category-filter');
      const sortSelect = document.getElementById('sort-select');

      // ホーム画面にいる場合
      if (searchInput || tagFilter || categoryFilter || sortSelect) {
        // UI上の値をすべて初期値にリセット
        if (searchInput) searchInput.value = '';
        if (tagFilter) tagFilter.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (sortSelect) sortSelect.value = 'date-desc'; // 初期値（新しい順）

        // assets/js/home.js 内で定義されている filterAndSort 関数があれば実行（画面更新）
        if (typeof window.filterAndSort === 'function') {
          // sessionStorageのクリアを反映させるため、URLパラメータの影響も排除
          if (window.location.search) {
            // URLにパラメータがある場合は、クリーンな状態でリダイレクト
            e.preventDefault();
            window.location.href = window.location.pathname;
            return;
          }
          window.filterAndSort(false);
        }
      }
    });
  });
}

// テーマ切替機能
function initThemeToggle() {
  const STORAGE_KEY = 'theme-preference';

  // 保存されたテーマ設定を取得
  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  // テーマ設定を保存
  function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // システム設定を取得
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // 現在のテーマを取得（優先順位: 保存済み > システム設定）
  function getCurrentTheme() {
    const stored = getStoredTheme();
    if (stored) {
      return stored;
    }
    return getSystemTheme();
  }

  // テーマを適用
  function applyTheme(theme, announce = true) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    // スクリーンリーダー向けにテーマ変更をアナウンス（初期化時は行わない）
    if (announce && typeof window.announceToScreenReader === 'function') {
      const message = theme === 'dark' ? 'ダークモードに切り替えました' : 'ライトモードに切り替えました';
      window.announceToScreenReader(message);
    }
  }

  // テーマを切り替え
  function toggleTheme() {
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    applyTheme(next);
  }

  // 初期テーマを適用（アナウンスはスキップ）
  applyTheme(getCurrentTheme(), false);

  // テーマ切替ボタンのイベントリスナー
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  themeToggleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  // システム設定の変更を監視（ユーザーが手動設定していない場合のみ反映）
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // 手動設定がない場合のみシステム設定に追従
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Improve button and link accessibility
 */
function initAccessibilityEnhancements() {
  // Add role and aria-label to buttons without text
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      const icon = button.querySelector('svg, .icon');
      if (icon) {
        button.setAttribute('aria-label', 'ボタン');
      }
    }
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('.tag, .card-link, .dropdown-toggle');
  interactiveElements.forEach((element) => {
    if (!element.getAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });
}

// Global variable to track scroll state
let isScrollingToTop = false;
let activeScrollInterval = null;
let activeScrollTimeout = null;

// Smart Header functionality
function initSmartHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollTop = 0;
  const delta = 10;
  const headerHeight = header.offsetHeight;

  function handleSmartHeaderScroll(scrollTop) {
    // Skip logic immediately during auto-scroll to top
    if (isScrollingToTop) return;

    // Ignore bounce scrolling
    if (scrollTop < 0) return;

    // Check if scroll is significant
    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    // Scroll Down -> Hide
    // Scroll Up -> Show
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollTop = scrollTop;
  }

  ScrollManager.register(handleSmartHeaderScroll);
}
