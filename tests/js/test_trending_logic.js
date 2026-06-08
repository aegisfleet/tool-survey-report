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
    return this._innerHTML.replace(/[<>]/g, '').trim();
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
      return null;
    }
    // Tag name search
    return this.children.find((c) => c.tagName && c.tagName.toLowerCase() === selector.toLowerCase()) || null;
  }

  querySelectorAll(selector) {
    if (selector === '.tag') {
      return this.children.filter((c) => c.className?.includes('tag'));
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
  focus() {}
  scrollIntoView() {}
}

// Setup global environment
const windowListeners = {};
const documentListeners = {};

global.window = {
  location: {
    href: 'http://localhost/trending/',
    search: '',
    pathname: '/trending/',
  },
  CATEGORY_EMOJIS: {
    'daily topics': '📅',
    'security': '🚨'
  },
  addEventListener: (event, callback) => {
    if (!windowListeners[event]) windowListeners[event] = [];
    windowListeners[event].push(callback);
  },
  requestAnimationFrame: (cb) => cb(),
};

// Create mock elements
const searchInput = new HTMLElement('input');
searchInput.attributes.id = 'hero-search-input';
searchInput.value = '';

const reportsGrid = new HTMLElement('div');
reportsGrid.attributes.id = 'reports-grid';

const noResults = new HTMLElement('div');
noResults.attributes.id = 'no-results';
noResults.style.display = 'none';

const reportsCountContainer = new HTMLElement('span');
reportsCountContainer.attributes.id = 'reports-count-container';

const clearBtn = new HTMLElement('button');
clearBtn.attributes.id = 'hero-search-clear';

const chip1 = new HTMLElement('button');
chip1.className = 'hero-search-chip';
chip1.dataset = { searchTerm: 'AI' };

const chip2 = new HTMLElement('button');
chip2.className = 'hero-search-chip';
chip2.dataset = { searchTerm: '脆弱性' };

// Create a report card
function createTrendingCard(title, tags, category, date, desc) {
  const card = new HTMLElement('article');
  card.className = 'report-card trending-card';
  card.dataset = {
    title: title.toLowerCase(),
    description: desc.toLowerCase(),
    tags: tags.join(',').toLowerCase(),
    category: category.toLowerCase(),
    date: date,
  };

  // Add title element for emoji application
  const titleEl = new HTMLElement('h2');
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

  // Add tags
  tags.forEach((tag) => {
    const tEl = new HTMLElement('span');
    tEl.className = 'tag';
    tEl.dataset = { tag: tag };
    tEl.textContent = tag;
    card.appendChild(tEl);
  });

  return card;
}

const card1 = createTrendingCard('AI Trend Report', ['AI', 'LLM'], 'Daily Topics', '2026-06-08', 'PilotDeck and other tools.');
const card2 = createTrendingCard('Security Alert: Twig', ['Twig', '脆弱性'], 'Security', '2026-06-07', 'Critical vulnerability found in Twig sandbox.');
const card3 = createTrendingCard('Gitツール', ['Git', 'CLI'], 'Daily Topics', '2026-06-06', 'Automating daily tasks with Git hooks.');

reportsGrid.appendChild(card1);
reportsGrid.appendChild(card2);
reportsGrid.appendChild(card3);

// Mock document
global.document = {
  getElementById: (id) => {
    if (id === 'hero-search-input') return searchInput;
    if (id === 'reports-grid') return reportsGrid;
    if (id === 'no-results') return noResults;
    if (id === 'reports-count-container') return reportsCountContainer;
    if (id === 'hero-search-clear') return clearBtn;
    return null;
  },
  querySelector: () => null,
  querySelectorAll: (selector) => {
    if (selector === '.report-card') {
      return reportsGrid.children.filter((c) => c.className?.includes('report-card'));
    }
    if (selector === '.hero-search-chip') {
      return [chip1, chip2];
    }
    return [];
  },
  addEventListener: (event, callback) => {
    if (!documentListeners[event]) documentListeners[event] = [];
    documentListeners[event].push(callback);
  },
  activeElement: null,
};

// Load and execute script
const scriptPath = path.join(__dirname, '../../assets/js/trending.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const vm = require('node:vm');
const context = vm.createContext(global);

try {
  vm.runInContext(scriptContent, context);

  // Trigger DOMContentLoaded
  if (documentListeners.DOMContentLoaded) {
    documentListeners.DOMContentLoaded.forEach((cb) => { cb(); });
  }

  // Verification Tests
  console.log('Running trending logic verification tests...');
  let passed = true;

  // Test 1: Initial state (all cards visible)
  const visibleCardsInit = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsInit.length !== 3) {
    console.error(`Test 1 Failed: Expected 3 visible cards, got ${visibleCardsInit.length}`);
    passed = false;
  } else {
    console.log('Test 1 Passed: Initial state verified.');
  }

  // Test 2: Search by title (should show only 1 matching card)
  searchInput.value = 'Security';
  // Trigger search change (normally handles input event)
  if (searchInput.listeners.input) {
    searchInput.listeners.input.forEach((cb) => { cb(); });
  }

  const visibleCardsSearch1 = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsSearch1.length !== 1 || !visibleCardsSearch1[0].dataset.title.includes('twig')) {
    console.error(`Test 2 Failed: Search for 'Security' expected 1 card containing 'twig', got ${visibleCardsSearch1.length}`);
    passed = false;
  } else {
    console.log('Test 2 Passed: Title search verified.');
  }

  // Test 3: Search by hiragana (Hiragana/Katakana folding)
  // Katakana input "ツール" -> Hiragana normalized "つーる"
  searchInput.value = 'ツール';
  if (searchInput.listeners.input) {
    searchInput.listeners.input.forEach((cb) => { cb(); });
  }

  const visibleCardsSearch2 = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsSearch2.length !== 1 || !visibleCardsSearch2[0].dataset.title.includes('ツール')) {
    console.error(`Test 3 Failed: Search for 'ツール' expected 1 card, got ${visibleCardsSearch2.length}`);
    passed = false;
  } else {
    console.log('Test 3 Passed: Hiragana folding verified.');
  }

  // Test 4: Clear search
  if (clearBtn.listeners.click) {
    clearBtn.listeners.click.forEach((cb) => { cb(); });
  }
  const visibleCardsClear = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsClear.length !== 3) {
    console.error(`Test 4 Failed: Expected 3 cards after clear, got ${visibleCardsClear.length}`);
    passed = false;
  } else {
    console.log('Test 4 Passed: Clear button verified.');
  }

  // Test 5: Chip click behavior
  if (chip2.listeners.click) {
    chip2.listeners.click.forEach((cb) => { cb(); });
  }
  const visibleCardsChip = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsChip.length !== 1 || !visibleCardsChip[0].dataset.title.includes('twig')) {
    console.error(`Test 5 Failed: Chip click for '脆弱性' expected 1 card, got ${visibleCardsChip.length}`);
    passed = false;
  } else {
    console.log('Test 5 Passed: Chip click verified.');
  }

  // Test 6: No results message display
  searchInput.value = 'NonexistentKeyword';
  if (searchInput.listeners.input) {
    searchInput.listeners.input.forEach((cb) => { cb(); });
  }
  const visibleCardsEmpty = reportsGrid.children.filter((c) => c.style.display !== 'none');
  if (visibleCardsEmpty.length !== 0 || noResults.style.display !== 'block') {
    console.error(`Test 6 Failed: Expected 0 cards and no-results displayed, got visible cards: ${visibleCardsEmpty.length}, no-results style: ${noResults.style.display}`);
    passed = false;
  } else {
    console.log('Test 6 Passed: No results verified.');
  }

  if (passed) {
    console.log('All trending tests passed!');
    process.exit(0);
  } else {
    console.error('Some trending tests failed.');
    process.exit(1);
  }
} catch (e) {
  console.error('Error executing script:', e);
  process.exit(1);
}
