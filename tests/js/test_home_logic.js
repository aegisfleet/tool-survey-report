const fs = require('node:fs');
const path = require('node:path');

// Mock DOM
class HTMLElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.style = {};
    this.children = [];
    this._innerHTML = '';
    this.className = '';
    this.classList = {
      add: (c) => {
        if (!this.className.includes(c)) this.className += ` ${c}`;
      },
      remove: (c) => {
        this.className = this.className.replace(new RegExp(`\\b${c}\\b`, 'g'), '').trim();
      },
      contains: (c) => this.className.includes(c),
      toggle: (c) => {
        if (this.classList.contains(c)) this.classList.remove(c);
        else this.classList.add(c);
      },
    };
    this.listeners = {};
    this.parentNode = null;
    this.value = '';
    this.attributes = {};
    this.dataset = {};
  }

  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(val) {
    this._innerHTML = val;
  }
  get textContent() {
    return this._innerHTML.replace(/[<>]/g, '');
  } // Simple text extraction
  set textContent(val) {
    this._innerHTML = val;
  }

  appendChild(child) {
    if (child.parentNode) {
      child.parentNode.children = child.parentNode.children.filter((c) => c !== child);
    }
    this.children.push(child);
    child.parentNode = this;
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.children = this.parentNode.children.filter((c) => c !== this);
      this.parentNode = null;
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  closest(selector) {
    if (this.className.includes(selector.replace('.', ''))) return this;
    return this.parentNode ? this.parentNode.closest(selector) : null;
  }

  querySelector(selector) {
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      return this.children.find((c) => c.className?.includes(className)) || null;
    }
    if (selector.startsWith('#')) {
      // Not implemented for children search by ID in this simple mock
      return null;
    }
    // Tag name search
    return this.children.find((c) => c.tagName && c.tagName.toLowerCase() === selector.toLowerCase()) || null;
  }

  querySelectorAll(selector) {
    if (selector === 'option') {
      return this.children.filter((c) => c.tagName === 'OPTION');
    }
    if (selector === '.pick-card') {
      return this.children.filter((c) => c.className?.includes('pick-card'));
    }
    if (selector === '.report-card') {
      // Search recursively
      let results = [];
      if (this.className?.includes('report-card')) {
        results.push(this);
      }
      for (const child of this.children) {
        results = results.concat(child.querySelectorAll(selector));
      }
      return results;
    }
    return [];
  }

  getAttribute(name) {
    return this.attributes[name];
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  blur() {}
}

// Setup global environment
const windowListeners = {};
const documentListeners = {};

global.window = {
  location: {
    href: 'http://localhost/',
    search: '',
    pathname: '/',
  },
  history: {
    replaceState: (_state, _title, url) => {
      global.window.location.href = url;
    },
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
  addEventListener: (event, callback) => {
    if (!windowListeners[event]) windowListeners[event] = [];
    windowListeners[event].push(callback);
  },
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  requestAnimationFrame: (cb) => {
    cb();
  },
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
      return arr;
    },
  },
};

global.sessionStorage = global.window.sessionStorage;
global.crypto = global.window.crypto;

global.URL = class {
  constructor(url) {
    this.href = url;
    this.searchParams = new URLSearchParams();
  }
  toString() {
    return this.href;
  }
};

global.URLSearchParams = class {
  constructor(search) {
    this.params = {};
    if (search) {
      // Simple parsing
      search
        .replace('?', '')
        .split('&')
        .forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key) this.params[key] = decodeURIComponent(value || '');
        });
    }
  }
  get(key) {
    return this.params[key] || null;
  }
  set(key, value) {
    this.params[key] = value;
  }
  delete(key) {
    delete this.params[key];
  }
  toString() {
    return Object.entries(this.params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
  }
};

// Create mock elements
const searchInput = new HTMLElement('input');
searchInput.attributes.id = 'hero-search-input';
searchInput.value = '';

const tagFilter = new HTMLElement('select');
tagFilter.attributes.id = 'tag-filter';
tagFilter.value = '';

const categoryFilter = new HTMLElement('select');
categoryFilter.attributes.id = 'category-filter';
categoryFilter.value = '';

const sortSelect = new HTMLElement('select');
sortSelect.attributes.id = 'sort-select';
sortSelect.value = 'date-desc';

const reportsGrid = new HTMLElement('div');
reportsGrid.attributes.id = 'reports-grid';

const noResults = new HTMLElement('div');
noResults.attributes.id = 'no-results';
noResults.style.display = 'none';

// Create a report card
function createReportCard(title, tags, category, date, score) {
  const card = new HTMLElement('article');
  card.className = 'report-card';
  card.dataset = {
    toolName: title,
    toolReading: title, // Simplified
    description: `Description for ${title}`,
    latestHighlight: '',
    developer: 'Developer',
    tags: tags.join(','),
    date: date,
    category: category,
    score: score || '0',
    isOss: 'false',
    hasFreePlan: 'false',
  };

  // Add title element for category emoji application
  const titleEl = new HTMLElement('h3');
  titleEl.className = 'report-title';
  const link = new HTMLElement('a');
  link.textContent = title;
  titleEl.appendChild(link);
  card.appendChild(titleEl);

  // Add category element
  const catEl = new HTMLElement('span');
  catEl.className = 'meta-item category';
  catEl.textContent = category;
  card.appendChild(catEl);

  return card;
}

const card1 = createReportCard('ToolA', ['tag1', 'tag2'], 'Development', '2023-01-01', '80');
const card2 = createReportCard('Tool B', ['tag2', 'tag3'], 'Design', '2023-02-01', '90');
const card3 = createReportCard('Tool C', ['tag1'], 'Development', '2023-03-01', '70');

reportsGrid.appendChild(card1);
reportsGrid.appendChild(card2);
reportsGrid.appendChild(card3);

// 制限件数テストのためにさらに12枚のカードを追加（合計15枚）
for (let i = 0; i < 12; i++) {
  const card = createReportCard(
    `Extra Tool ${i}`,
    ['tag1'],
    'Development',
    `2023-04-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
    '60',
  );
  reportsGrid.appendChild(card);
}

// Mock buttons and containers for new features
const loadMoreBtn = new HTMLElement('button');
loadMoreBtn.attributes.id = 'load-more-btn';
const loadMoreContainer = new HTMLElement('div');
loadMoreContainer.attributes.id = 'load-more-container';
const reportsCountContainer = new HTMLElement('span');
reportsCountContainer.attributes.id = 'reports-count-container';

// Mock document
global.document = {
  getElementById: (id) => {
    if (id === 'hero-search-input' || id === 'report-search') return searchInput;
    if (id === 'tag-filter') return tagFilter;
    if (id === 'category-filter') return categoryFilter;
    if (id === 'sort-select') return sortSelect;
    if (id === 'reports-grid') return reportsGrid;
    if (id === 'no-results') return noResults;
    if (id === 'load-more-btn') return loadMoreBtn;
    if (id === 'load-more-container') return loadMoreContainer;
    if (id === 'reports-count-container') return reportsCountContainer;
    if (id === 'hero-search-clear' || id === 'search-clear') return new HTMLElement('button');
    if (id === 'tag-filter-clear') return new HTMLElement('button');
    if (id === 'category-filter-clear') return new HTMLElement('button');
    if (id === 'refresh-picks') return new HTMLElement('button');
    if (id === 'random-picks-grid') return new HTMLElement('div');
    return null;
  },
  querySelector: (selector) => {
    if (selector === '.home-container') return new HTMLElement('div');
    return null;
  },
  querySelectorAll: (selector) => {
    if (selector === '.report-card') {
      return reportsGrid.children.filter((c) => c.className?.includes('report-card'));
    }
    if (selector === '.tag') return [];
    if (selector === '.clickable-category') return [];
    if (selector === '.pick-card') return [];
    return [];
  },
  addEventListener: (event, callback) => {
    if (!documentListeners[event]) documentListeners[event] = [];
    documentListeners[event].push(callback);
  },
  createElement: (tag) => new HTMLElement(tag),
  title: 'Test Site',
};

// Load and execute script
const scriptPath = path.join(__dirname, '../../assets/js/home.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const vm = require('node:vm');
const context = vm.createContext(global);

try {
  vm.runInContext(scriptContent, context);

  // Trigger DOMContentLoaded
  if (documentListeners.DOMContentLoaded) {
    documentListeners.DOMContentLoaded.forEach((cb) => {
      cb();
    });
  }

  // Verification Tests
  console.log('Running verification tests...');
  let passed = true;

  // Test 1: Initial state (15 cards total, but limited to 12 visible, 3 hidden)
  const visibleCardsInit = reportsGrid.children.filter((c) => c.style.display !== 'none');
  const hiddenCardsInit = reportsGrid.children.filter((c) => c.style.display === 'none');
  if (visibleCardsInit.length !== 12 || hiddenCardsInit.length !== 3) {
    console.error(
      `Test 1 Failed: Expected 12 visible and 3 hidden cards initially, got ${visibleCardsInit.length} visible, ${hiddenCardsInit.length} hidden`,
    );
    passed = false;
  } else if (loadMoreContainer.style.display !== 'flex') {
    console.error('Test 1 Failed: Load More container is not displayed.');
    passed = false;
  } else {
    console.log('Test 1 Passed: Initial state (limited display and load more button) correct.');
  }

  // Test 2: Search filter (should show only 1 matching card, all other cards hidden, no load more button)
  searchInput.value = 'ToolA';
  window.filterAndSort(false, true);

  const visibleCardsSearch = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsSearch.length !== 1 || visibleCardsSearch[0].dataset.toolName !== 'ToolA') {
    console.error('Test 2 Failed: Search filter failed.');
    passed = false;
  } else if (loadMoreContainer.style.display !== 'none') {
    console.error('Test 2 Failed: Load More button should be hidden during filtering.');
    passed = false;
  } else {
    console.log('Test 2 Passed: Search filter correct.');
  }

  // Reset search
  searchInput.value = '';
  window.filterAndSort(false, true);

  // Test 3: Tag filter
  tagFilter.value = 'tag3';
  window.filterAndSort(false, true);

  const visibleCardsTag = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsTag.length !== 1 || visibleCardsTag[0].dataset.toolName !== 'Tool B') {
    console.error(
      `Test 3 Failed: Tag filter failed. Expected Tool B, got ${visibleCardsTag[0]?.dataset?.toolName || 'none'}`,
    );
    passed = false;
  } else {
    console.log('Test 3 Passed: Tag filter correct.');
  }

  // Test 4: Category filter (Development category has 14 cards, should show all 14, no load more button)
  tagFilter.value = '';
  categoryFilter.value = 'Development';
  window.filterAndSort(false, true);

  const visibleCardsCat = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsCat.length !== 14) {
    console.error(`Test 4 Failed: Category filter failed. Expected 14 cards, got ${visibleCardsCat.length}`);
    passed = false;
  } else if (loadMoreContainer.style.display !== 'none') {
    console.error('Test 4 Failed: Load More button should be hidden during filtering.');
    passed = false;
  } else {
    console.log('Test 4 Passed: Category filter correct.');
  }

  // Test 5: Sorting (Date Desc) - Default
  categoryFilter.value = '';
  sortSelect.value = 'date-desc';
  window.filterAndSort(false, true);

  // Order of cards in grid should be sorted, showing 12 visible
  const cardsDateDesc = reportsGrid.children.filter((c) => c.style.display !== 'none');
  let isSorted = true;
  for (let i = 0; i < cardsDateDesc.length - 1; i++) {
    const date1 = new Date(cardsDateDesc[i].dataset.date).getTime();
    const date2 = new Date(cardsDateDesc[i + 1].dataset.date).getTime();
    if (date1 < date2) {
      isSorted = false;
      break;
    }
  }

  if (isSorted && cardsDateDesc.length === 12) {
    console.log('Test 5 Passed: Sort date-desc correct.');
  } else {
    console.error(`Test 5 Failed: Sort date-desc failed. Visible count: ${cardsDateDesc.length}`);
    console.log(cardsDateDesc.map((c) => `${c.dataset.toolName} (${c.dataset.date})`));
    passed = false;
  }

  // Test 6: Verify limits reset
  window.filterAndSort(false, true);
  const visibleCards6 = reportsGrid.children.filter((c) => c.style.display !== 'none');
  const hiddenCards6 = reportsGrid.children.filter((c) => c.style.display === 'none');
  if (visibleCards6.length !== 12 || hiddenCards6.length !== 3) {
    console.error(
      `Test 6 Failed: Count limit failed. Visible: ${visibleCards6.length}, Hidden: ${hiddenCards6.length}`,
    );
    passed = false;
  } else if (loadMoreContainer.style.display !== 'flex') {
    console.error('Test 6 Failed: Load More container is not displayed.');
    passed = false;
  } else {
    console.log('Test 6 Passed: Reset count limits correct.');
  }

  // Test 7: Load More button click behavior
  if (loadMoreBtn.listeners.click) {
    loadMoreBtn.listeners.click.forEach((cb) => {
      cb();
    });
  }

  const visibleCards7 = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCards7.length !== 15) {
    console.error(`Test 7 Failed: Load More failed to show all cards. Visible: ${visibleCards7.length}`);
    passed = false;
  } else if (loadMoreContainer.style.display !== 'none') {
    console.error('Test 7 Failed: Load More container still displayed.');
    passed = false;
  } else {
    console.log('Test 7 Passed: Load More click loaded all cards and hid the button.');
  }

  // Test 8: Filter activation and button suppression
  searchInput.value = 'Extra Tool';
  window.filterAndSort(false, true);

  const visibleCards8 = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCards8.length !== 12) {
    console.error(`Test 8 Failed: Filter did not show all matching cards. Visible: ${visibleCards8.length}`);
    passed = false;
  } else if (loadMoreContainer.style.display !== 'none') {
    console.error('Test 8 Failed: Load More container should be hidden when filter is active.');
    passed = false;
  } else {
    console.log('Test 8 Passed: Filter shows all matching cards and hides button.');
  }

  // Search filter post-clear
  searchInput.value = '';
  window.filterAndSort(false, true);
  const visibleCards8Post = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCards8Post.length !== 12 || loadMoreContainer.style.display !== 'flex') {
    console.error(
      `Test 8 Post-Clear Failed: Should return to limit. Visible: ${visibleCards8Post.length}, Button: ${loadMoreContainer.style.display}`,
    );
    passed = false;
  } else {
    console.log('Test 8 Post-Clear Passed: Reset successfully to limit.');
  }

  if (passed) {
    console.log('All tests passed!');
    process.exit(0);
  } else {
    console.error('Some tests failed.');
    process.exit(1);
  }
} catch (e) {
  console.error('Error executing script:', e);
  process.exit(1);
}
