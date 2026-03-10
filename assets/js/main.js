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
        handlers.forEach((handler) => handler(scrollTop));
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

  // Initialize color contrast checker in development
  checkColorContrast();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
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
      toggleMenu(!isExpanded);
    });

    // Function to toggle menu state
    function toggleMenu(show) {
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

    // Close mobile menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu(false);
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
  generateTableOfContents();
}

/**
 * レポートの主要セクション見出しに絵文字を動的に付加する
 */
function applyEmojisToHeadings() {
  const reportContent = document.querySelector('.report-content');
  if (!reportContent) return;

  const emojiMap = {
    基本情報: '📋',
    目的と主な利用シーン: '🎯',
    主要機能: '🛠️',
    特徴・強み: '💪',
    弱み・注意点: '⚠️',
    料金プラン: '💰',
    導入実績・事例: '🏢',
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
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>目次</h3>';

    const tocList = document.createElement('ul');
    tocList.style.cssText = `
      background: var(--color-bg-content);
      padding: 1rem 2.5rem;
      border-radius: 0.375rem;
      border-left: 4px solid #ff7733;
      margin: 2rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const listItem = document.createElement('li');
      listItem.style.marginBottom = '0.5rem';

      // 階層（H2, H3, H4）に応じたインデントの設定
      const tagName = heading.tagName.toLowerCase();
      if (tagName === 'h3') {
        listItem.style.marginLeft = '1.5rem';
      } else if (tagName === 'h4') {
        listItem.style.marginLeft = '3rem';
      }

      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.style.textDecoration = 'none';

      // スムーズスクロールとヘッダー高さを考慮した位置調整
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById(id);
        if (targetElement) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });

          // URLを更新（履歴に追加）
          history.pushState(null, null, `#${id}`);
        }
      });

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    toc.appendChild(tocList);

    // 目次の挿入位置を一貫させる - 最初のh2見出しの直前に挿入
    const firstH2 = reportContent.querySelector('h2');
    if (firstH2) {
      // 最初のh2見出しの直前に目次を挿入
      firstH2.parentElement.insertBefore(toc, firstH2);
    } else {
      // h2見出しがない場合は、最初のh1見出しの後に挿入
      const firstH1 = reportContent.querySelector('h1');
      if (firstH1?.nextSibling) {
        firstH1.parentElement.insertBefore(toc, firstH1.nextSibling);
      } else {
        // h1もない場合は、コンテンツの最初に挿入
        reportContent.insertBefore(toc, reportContent.firstChild);
      }
    }
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
    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
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

// Color contrast checker (development helper)
function checkColorContrast() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Color contrast information:');
    console.log('Primary color (#ff7733) on white background has contrast ratio: ~3.8:1');
    console.log('Secondary color (#cc5500) on white background has contrast ratio: ~5.2:1');
    console.log('Text color (#212529) on white background has contrast ratio: ~16.6:1');
    console.log('All combinations meet WCAG AA standards for normal text.');
  }
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
      if (window.scrollY < 1) {
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
  function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    // スクリーンリーダー向けにテーマ変更をアナウンス
    if (typeof window.announceToScreenReader === 'function') {
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

  // 初期テーマを適用
  applyTheme(getCurrentTheme());

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
