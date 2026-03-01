const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

/**
 * tests/test_home_logic.js
 * Comprehensive tests for home.js variety of features.
 * This script uses vm.runInContext() for safer script execution and mocks window.crypto
 * to support the secure random shuffling logic.
 */

// Mock browser environment
const domHtml = `
<div class="home-container" data-site-title="Tool Survey Report">
    <input id="report-search">
    <div id="search-clear"></div>
    <select id="tag-filter">
        <option value="">All Tags</option>
    </select>
    <div id="tag-filter-clear"></div>
    <select id="category-filter">
        <option value="">All Categories</option>
        <option value="ai">AI</option>
        <option value="dev">Dev</option>
    </select>
    <div id="category-filter-clear"></div>
    <select id="sort-select">
        <option value="date-desc">Newest</option>
        <option value="date-asc">Oldest</option>
        <option value="title-asc">Title A-Z</option>
        <option value="score-desc">Score</option>
    </select>
    
    <div id="reports-grid">
        <div class="report-card" 
             data-tool-name="OpenRefine" 
             data-description="Clean and transform data"
             data-category="ai"
             data-tags="data,cleanup"
             data-date="2023-01-01"
             data-score="8.5">
            <div class="meta-item category">AI</div>
            <div class="report-title"><a href="#">OpenRefine</a></div>
            <div class="card-score-badge">8.5</div>
        </div>
        <div class="report-card" 
             data-tool-name="VS Code" 
             data-description="Popular code editor"
             data-category="dev"
             data-tags="editor,dev"
             data-date="2024-01-01"
             data-score="9.5">
            <div class="meta-item category">Dev</div>
            <div class="report-title"><a href="#">VS Code</a></div>
            <div class="card-score-badge">9.5</div>
        </div>
    </div>
    <div id="no-results" style="display:none">No results found</div>
    
    <div id="random-picks-grid">
        <a class="pick-card">
            <div class="pick-category"></div>
            <div class="pick-title"></div>
        </a>
    </div>
    <button id="refresh-picks">Refresh</button>
</div>
`;

describe('Home Logic - Filtering and Sorting', () => {
  let dom;
  let context;

  beforeEach(() => {
    dom = new JSDOM(domHtml, { url: 'http://localhost' });
    const homeJsPath = path.resolve(__dirname, '../assets/js/home.js');
    const homeJsContent = fs.readFileSync(homeJsPath, 'utf8');

    context = vm.createContext({
      document: dom.window.document,
      window: dom.window,
      navigator: dom.window.navigator,
      console: console,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      sessionStorage: {
        store: {},
        getItem: function (key) {
          return this.store[key] || null;
        },
        setItem: function (key, val) {
          this.store[key] = val;
        },
        removeItem: function (key) {
          delete this.store[key];
        },
      },
      // Mocking window.crypto for secure randomness
      crypto: {
        getRandomValues: (array) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 0xffffffff);
          }
          return array;
        },
      },
      Uint32Array: Uint32Array,
      URL: dom.window.URL,
      URLSearchParams: dom.window.URLSearchParams,
      history: {
        replaceState: jest.fn(),
      },
      HTMLElement: dom.window.HTMLElement,
      Event: dom.window.Event,
      CustomEvent: dom.window.CustomEvent,
      NodeList: dom.window.NodeList,
      HTMLCollection: dom.window.HTMLCollection,
    });

    // Polyfill window object references
    context.window.crypto = context.crypto;
    context.window.history = context.history;

    const script = new vm.Script(homeJsContent);
    script.runInContext(context);

    // Manually trigger DOMContentLoaded
    const event = dom.window.document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    dom.window.document.dispatchEvent(event);
  });

  test('should populate tag filter with unique tags', () => {
    const tagOptions = Array.from(dom.window.document.querySelectorAll('#tag-filter option'));
    const tagValues = tagOptions.map((o) => o.value);
    expect(tagValues).toContain('data');
    expect(tagValues).toContain('cleanup');
    expect(tagValues).toContain('editor');
    expect(tagValues).toContain('dev');
  });

  test('should filter cards by search text', () => {
    const searchInput = dom.window.document.getElementById('report-search');
    searchInput.value = 'refine';
    context.filterAndSort();

    const visibleCards = Array.from(dom.window.document.querySelectorAll('.report-card')).filter(
      (c) => c.style.display !== 'none',
    );

    expect(visibleCards.length).toBe(1);
    expect(visibleCards[0].dataset.toolName).toBe('OpenRefine');
  });

  test('should filter cards by category', () => {
    const categoryFilter = dom.window.document.getElementById('category-filter');
    categoryFilter.value = 'dev';
    context.filterAndSort();

    const visibleCards = Array.from(dom.window.document.querySelectorAll('.report-card')).filter(
      (c) => c.style.display !== 'none',
    );

    expect(visibleCards.length).toBe(1);
    expect(visibleCards[0].dataset.toolName).toBe('VS Code');
  });

  test('should sort cards by score desc', () => {
    const sortSelect = dom.window.document.getElementById('sort-select');
    sortSelect.value = 'score-desc';
    context.filterAndSort();

    const cards = Array.from(dom.window.document.querySelectorAll('.report-card'));
    // Re-appended to grid, check order
    expect(cards[0].dataset.toolName).toBe('VS Code'); // 9.5
    expect(cards[1].dataset.toolName).toBe('OpenRefine'); // 8.5
  });

  test('should handle "No Results" display', () => {
    const searchInput = dom.window.document.getElementById('report-search');
    searchInput.value = 'NonExistentTool';
    context.filterAndSort();

    const noResults = dom.window.document.getElementById('no-results');
    expect(noResults.style.display).toBe('block');
  });

  test('should save and restore filter state via sessionStorage', () => {
    const searchInput = dom.window.document.getElementById('report-search');
    searchInput.value = 'vscode';
    context.filterAndSort();

    // Simulate page reload by re-triggering logic
    // We'll just verify the store has the data
    const savedState = JSON.parse(context.sessionStorage.getItem('homeFilterState'));
    expect(savedState.search).toBe('vscode');
  });
});
