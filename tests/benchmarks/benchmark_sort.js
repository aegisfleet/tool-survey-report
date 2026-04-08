const fs = require('node:fs');
const path = require('node:path');

// Mock DOM
class HTMLElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.style = {};
    this.children = [];
    this._innerHTML = '';
    this.className = '';
    this.dataset = {};
    this.attributes = {};
  }
  get textContent() { return this._innerHTML; }
  set textContent(val) { this._innerHTML = val; }
  appendChild(child) {
    if (child.parentNode) {
      child.parentNode.children = child.parentNode.children.filter((c) => c !== child);
    }
    this.children.push(child);
    child.parentNode = this;
  }
  querySelectorAll(selector) {
    if (selector === 'option') return this.children.filter(c => c.tagName === 'OPTION');
    if (selector === '.report-card') return this.children.filter(c => c.className.includes('report-card'));
    return [];
  }
  querySelector(selector) {
    if (selector === '.meta-item.category') return this.children.find(c => c.className === 'meta-item category');
    if (selector === '.report-title a') return this.children.find(c => c.tagName === 'H3')?.children.find(c => c.tagName === 'A');
    if (selector === '.pick-category') return this.children.find(c => c.className === 'pick-category');
    if (selector === '.pick-title') return this.children.find(c => c.className === 'pick-title');
    return null;
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  blur() {}
  addEventListener() {}
}

const reportCards = [];
for (let i = 0; i < 500; i++) {
  const card = new HTMLElement('article');
  card.className = 'report-card';
  const date = new Date(2020 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28))
    .toISOString().split('T')[0];
  card.dataset = {
    date: date,
    toolName: `Tool ${i}`,
    score: (Math.random() * 100).toFixed(1),
    isOss: Math.random() > 0.5 ? 'true' : 'false',
    hasFreePlan: Math.random() > 0.5 ? 'true' : 'false',
    tags: 'tag1,tag2',
    category: 'Category'
  };

  const titleH3 = new HTMLElement('h3');
  titleH3.className = 'report-title';
  const titleA = new HTMLElement('a');
  titleA.textContent = `Tool ${i}`;
  titleH3.appendChild(titleA);
  card.appendChild(titleH3);

  const catSpan = new HTMLElement('span');
  catSpan.className = 'meta-item category';
  catSpan.textContent = 'Category';
  card.appendChild(catSpan);

  reportCards.push(card);
}

const sortSelect = new HTMLElement('select');
sortSelect.value = 'date-desc';

const searchInput = new HTMLElement('input');
searchInput.value = '';

const tagFilter = new HTMLElement('select');
tagFilter.value = '';

const categoryFilter = new HTMLElement('select');
categoryFilter.value = '';

const reportsGrid = new HTMLElement('div');
const noResults = new HTMLElement('div');

global.document = {
  addEventListener: (ev, cb) => {
    if (ev === 'DOMContentLoaded') setTimeout(cb, 0);
  },
  querySelector: (selector) => {
    if (selector === '.home-container') return new HTMLElement('div');
    if (selector === '#reports-grid') return reportsGrid;
    if (selector === '#no-results') return noResults;
    return null;
  },
  getElementById: (id) => {
    if (id === 'sort-select') return sortSelect;
    if (id === 'report-search') return searchInput;
    if (id === 'tag-filter') return tagFilter;
    if (id === 'category-filter') return categoryFilter;
    if (id === 'reports-grid') return reportsGrid;
    if (id === 'no-results') return noResults;
    if (id === 'search-clear') return new HTMLElement('button');
    if (id === 'tag-filter-clear') return new HTMLElement('button');
    if (id === 'category-filter-clear') return new HTMLElement('button');
    if (id === 'refresh-picks') return new HTMLElement('button');
    if (id === 'random-picks-grid') return new HTMLElement('div');
    return null;
  },
  querySelectorAll: (selector) => {
    if (selector === '.report-card') return reportCards;
    if (selector === '.pick-card') return [];
    if (selector === '.interest-chip') return [];
    return [];
  },
  createElement: (tag) => new HTMLElement(tag),
  title: 'Test',
};

global.window = {
  addEventListener: () => {},
  sessionStorage: { getItem: () => null, setItem: () => {} },
  location: { search: '', href: '' },
  history: { replaceState: () => {} },
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
      return arr;
    },
  },
};

global.sessionStorage = global.window.sessionStorage;
global.URL = class { constructor(u) { this.searchParams = { set: () => {}, delete: () => {} }; this.href = u; } toString() { return this.href; } };

const scriptPath = path.join(__dirname, '../../assets/js/home.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const vm = require('node:vm');
const context = vm.createContext(global);
vm.runInContext(scriptContent, context);

// We need to wait for DOMContentLoaded to finish or call it manually
setTimeout(() => {
  if (typeof global.window.filterAndSort !== 'function') {
      console.error('filterAndSort not found on window');
      process.exit(1);
  }

  console.log('Starting benchmark for filterAndSort with 500 cards...');
  const iterations = 1000;
  const start = process.hrtime();

  for (let i = 0; i < iterations; i++) {
    global.window.filterAndSort(false);
  }

  const end = process.hrtime(start);
  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);

  console.log(`Execution time for ${iterations} iterations: ${timeInMs}ms`);
  console.log(`Average time per call: ${(timeInMs / iterations).toFixed(4)}ms`);
}, 100);
