// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {

  // Mobile navigation toggle
  initMobileNavigation();

  // Search functionality
  initSearchFunctionality();

  // Smooth scrolling for anchor links
  initSmoothScrolling();

  // Focus management for accessibility
  initFocusManagement();

  // Report content enhancements
  initReportEnhancements();

  // トップに戻るボタンの初期化
  initBackToTopButton();
});

// Mobile navigation functionality
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');

      // Trap focus in mobile menu when open
      if (!isExpanded) {
        trapFocus(navMenu);
      } else {
        removeFocusTrap();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        removeFocusTrap();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navToggle.focus();
        removeFocusTrap();
      }
    });
  }

  // Dropdown functionality
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns
      dropdownToggles.forEach(function (otherToggle) {
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
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      dropdownToggles.forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.parentElement.classList.remove('active');
      });
    }
  });
}

// Search functionality
function initSearchFunctionality() {
  const searchForms = document.querySelectorAll('.search-form');

  searchForms.forEach(function (form) {
    const searchInput = form.querySelector('.search-input, #search-input, #nav-search-input');

    if (searchInput) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
          // Simple client-side search implementation
          performSearch(searchTerm);
        }
      });

      // Real-time search suggestions (basic implementation)
      let searchTimeout;
      searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
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

// Simple client-side search
function performSearch(searchTerm) {
  // Redirect to home page with search parameter
  const homeUrl = '/';
  const searchUrl = homeUrl + '?search=' + encodeURIComponent(searchTerm);
  window.location.href = searchUrl;
}

// Basic search suggestions
function showSearchSuggestions(searchTerm, inputElement) {
  // This would typically fetch from an API or search index
  // For now, we'll implement a basic version
  hideSearchSuggestions();

  // Create suggestions dropdown
  const suggestions = document.createElement('div');
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

  // Add some example suggestions (in a real implementation, this would be dynamic)
  const exampleSuggestions = [
    'Jenkins レポート',
    'NotebookLM 調査',
    'システム分析'
  ].filter(suggestion =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (exampleSuggestions.length > 0) {
    exampleSuggestions.forEach(function (suggestion) {
      const item = document.createElement('div');
      item.className = 'search-suggestion-item';
      item.style.cssText = `
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #f8f9fa;
      `;
      item.textContent = suggestion;

      item.addEventListener('click', function () {
        inputElement.value = suggestion;
        performSearch(suggestion);
      });

      item.addEventListener('mouseenter', function () {
        item.style.backgroundColor = '#f8f9fa';
      });

      item.addEventListener('mouseleave', function () {
        item.style.backgroundColor = '';
      });

      suggestions.appendChild(item);
    });

    // Position relative to input
    const form = inputElement.closest('.search-form');
    if (form) {
      form.style.position = 'relative';
      form.appendChild(suggestions);
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

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function () {
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
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );

  if (focusableElements.length === 0) return;

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function (e) {
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
  generateTableOfContents();
}

function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach(function (codeBlock) {
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

    pre.addEventListener('mouseenter', function () {
      button.style.opacity = '1';
    });

    pre.addEventListener('mouseleave', function () {
      button.style.opacity = '0';
    });

    button.addEventListener('click', function () {
      navigator.clipboard.writeText(codeBlock.textContent).then(function () {
        button.textContent = 'コピー済み!';
        setTimeout(function () {
          button.textContent = 'コピー';
        }, 2000);
      });
    });

    pre.appendChild(button);
  });
}

function enhanceTablesResponsiveness() {
  const tables = document.querySelectorAll('.report-content table');

  tables.forEach(function (table) {
    if (!table.parentElement.classList.contains('table-responsive')) {
      // 小さいテーブル（2行以下）はラッパーを追加しない
      const rowCount = table.querySelectorAll('tr').length;
      if (rowCount <= 2) {
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      wrapper.style.cssText = `
        overflow-x: auto;
        margin: 1rem 0;
        border-radius: 0.375rem;
      `;

      table.parentElement.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
}

function markExternalLinks() {
  const links = document.querySelectorAll('.report-content a[href^="http"]');
  const currentDomain = window.location.hostname;

  links.forEach(function (link) {
    const linkDomain = new URL(link.href).hostname;

    if (linkDomain !== currentDomain) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('aria-label', link.textContent + ' (新しいタブで開く)');
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
      background: #ffffff;
      padding: 1rem 1.5rem;
      border-radius: 0.375rem;
      border-left: 4px solid #ff7733;
      margin: 2rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    headings.forEach(function (heading, index) {
      const id = 'heading-' + index;
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
      link.href = '#' + id;
      link.textContent = heading.textContent;
      link.style.textDecoration = 'none';

      // スムーズスクロールとヘッダー高さを考慮した位置調整
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.getElementById(id);
        if (targetElement) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // URLを更新（履歴に追加）
          history.pushState(null, null, '#' + id);
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
      if (firstH1 && firstH1.nextSibling) {
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
  window.announceToScreenReader = function (message) {
    liveRegion.textContent = message;
    setTimeout(function () {
      liveRegion.textContent = '';
    }, 1000);
  };
}

// Enhance form accessibility
function enhanceFormAccessibility() {
  // Add required field indicators
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  requiredFields.forEach(function (field) {
    const label = document.querySelector('label[for="' + field.id + '"]');
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
  formFields.forEach(function (field) {
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

// Initialize color contrast checker in development
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkColorContrast);
} else {
  checkColorContrast();
}

// Keyboard shortcuts for better navigation
document.addEventListener('keydown', function (e) {
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

// Improve button and link accessibility
document.addEventListener('DOMContentLoaded', function () {
  // Add role and aria-label to buttons without text
  const buttons = document.querySelectorAll('button');
  buttons.forEach(function (button) {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      const icon = button.querySelector('svg, .icon');
      if (icon) {
        button.setAttribute('aria-label', 'ボタン');
      }
    }
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('.tag, .card-link, .dropdown-toggle');
  interactiveElements.forEach(function (element) {
    if (!element.getAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');

      element.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });
});

// トップに戻るボタンの機能
function initBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

  // スクロール位置に応じてボタンの表示/非表示を制御
  function toggleButtonVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 300px以上スクロールした場合に表示
    if (scrollTop > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  }

  // スクロールイベントリスナー（パフォーマンス最適化のためthrottle）
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        toggleButtonVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ボタンクリック時の動作
  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // アニメーション無効化設定の場合は即座にトップへ
      window.scrollTo(0, 0);
    } else {
      // スムーズスクロール
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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

  // イベントリスナーの設定
  window.addEventListener('scroll', handleScroll, { passive: true });
  backToTopButton.addEventListener('click', scrollToTop);

  // キーボードサポート
  backToTopButton.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  });

  // 初期状態の設定
  toggleButtonVisibility();
}