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
  requestAnimationFrame: (cb) => cb(),
};

global.sessionStorage = global.window.sessionStorage;

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
searchInput.attributes.id = 'report-search';
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

const card1 = createReportCard('Tool A', ['tag1', 'tag2'], 'Development', '2023-01-01', '80');
const card2 = createReportCard('Tool B', ['tag2', 'tag3'], 'Design', '2023-02-01', '90');
const card3 = createReportCard('Tool C', ['tag1'], 'Development', '2023-03-01', '70');

reportsGrid.appendChild(card1);
reportsGrid.appendChild(card2);
reportsGrid.appendChild(card3);

// Mock document
global.document = {
  getElementById: (id) => {
    if (id === 'report-search') return searchInput;
    if (id === 'tag-filter') return tagFilter;
    if (id === 'category-filter') return categoryFilter;
    if (id === 'sort-select') return sortSelect;
    if (id === 'reports-grid') return reportsGrid;
    if (id === 'no-results') return noResults;
    if (id === 'search-clear') return new HTMLElement('button');
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
    if (selector === '.report-card') return [card1, card2, card3];
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
const scriptPath = path.join(__dirname, '../assets/js/home.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

try {
  eval(scriptContent);

  // Trigger DOMContentLoaded
  if (documentListeners.DOMContentLoaded) {
    documentListeners.DOMContentLoaded.forEach((cb) => cb());
  }

  // Verification Tests
  console.log('Running verification tests...');
  let passed = true;

  // Test 1: Initial state (all cards visible)
  if (reportsGrid.children.length !== 3) {
    console.error(`Test 1 Failed: Expected 3 cards initially, got ${reportsGrid.children.length}`);
    passed = false;
  } else {
    console.log('Test 1 Passed: Initial state correct.');
  }

  // Test 2: Search filter
  searchInput.value = 'Tool A';
  window.filterAndSort(false);

  const visibleCardsSearch = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsSearch.length !== 1 || visibleCardsSearch[0].dataset.toolName !== 'Tool A') {
    console.error('Test 2 Failed: Search filter failed.');
    passed = false;
  } else {
    console.log('Test 2 Passed: Search filter correct.');
  }

  // Reset search
  searchInput.value = '';
  window.filterAndSort(false);

  // Test 3: Tag filter
  tagFilter.value = 'tag3';
  window.filterAndSort(false);

  const visibleCardsTag = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsTag.length !== 1 || visibleCardsTag[0].dataset.toolName !== 'Tool B') {
    console.error(
      `Test 3 Failed: Tag filter failed. Expected Tool B, got ${visibleCardsTag[0]?.dataset?.toolName || 'none'}`,
    );
    passed = false;
  } else {
    console.log('Test 3 Passed: Tag filter correct.');
  }

  // Test 4: Category filter
  tagFilter.value = '';
  categoryFilter.value = 'Development'; // Note: In real app this might be lowercase depending on option value

  // We need to make sure the card category matches exactly or logic handles it.
  // In script: card.dataset.category === selectedCategory
  // Mock data has 'Development'. Let's set filter to 'Development'.

  window.filterAndSort(false);

  const visibleCardsCat = reportsGrid.children.filter((c) => c.style.display !== 'none');
  // Should be Tool A and Tool C
  if (visibleCardsCat.length !== 2) {
    console.error(`Test 4 Failed: Category filter failed. Expected 2 cards, got ${visibleCardsCat.length}`);
    passed = false;
  } else {
    console.log('Test 4 Passed: Category filter correct.');
  }

  // Test 5: Sorting (Date Desc) - Default
  categoryFilter.value = '';
  sortSelect.value = 'date-desc';
  window.filterAndSort(false);

  // Order should be: Tool C (Mar), Tool B (Feb), Tool A (Jan)
  const cardsDateDesc = reportsGrid.children;
  if (
    cardsDateDesc[0].dataset.toolName === 'Tool C' &&
    cardsDateDesc[1].dataset.toolName === 'Tool B' &&
    cardsDateDesc[2].dataset.toolName === 'Tool A'
  ) {
    console.log('Test 5 Passed: Sort date-desc correct.');
  } else {
    console.error('Test 5 Failed: Sort date-desc failed.');
    console.log(cardsDateDesc.map((c) => c.dataset.toolName));
    passed = false;
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
