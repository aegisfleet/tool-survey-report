const fs = require('node:fs');
const path = require('node:path');

// Mock DOM
class HTMLElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.style = {};
    this.children = [];
    this._innerHTML = '';
    this._textContent = '';
    this.className = '';
    this.classList = {
      add: (c) => {
        this.className += ` ${c}`;
      },
      remove: (c) => {
        this.className = this.className.replace(c, '').trim();
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
  }

  get innerHTML() {
    if (this.children.length > 0) {
      return this.children
        .map((c) => {
          let html = `<${c.tagName.toLowerCase()}`;
          if (c.className) html += ` class="${c.className}"`;
          for (const key in c.attributes) {
            html += ` ${key}="${c.attributes[key]}"`;
          }
          html += '>';
          if (c._textContent) html += c._textContent;
          else if (c.innerHTML) html += c.innerHTML;
          html += `</${c.tagName.toLowerCase()}>`;
          return html;
        })
        .join('');
    }
    return this._innerHTML;
  }
  set innerHTML(val) {
    this._innerHTML = val;
    this.children = []; // Clear children when setting innerHTML
  }

  get textContent() {
    return this._textContent;
  }
  set textContent(val) {
    this._textContent = val;
  }

  appendChild(child) {
    if (child.tagName === 'DOCUMENT_FRAGMENT') {
      this.children.push(...child.children);
      child.children.forEach((c) => {
        c.parentNode = this;
      });
      child.children = [];
    } else {
      this.children.push(child);
      child.parentNode = this;
    }
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
    if (selector === '.search-form') return form; // Return global form for test
    if (this.className.includes(selector.replace('.', ''))) return this;
    return this.parentNode ? this.parentNode.closest(selector) : null;
  }

  querySelector(selector) {
    return this.children.find((c) => c.className?.includes(selector.replace('.', ''))) || null;
  }

  querySelectorAll(_selector) {
    return [];
  }

  getAttribute(name) {
    return this.attributes[name];
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

const form = new HTMLElement('form');
form.className = 'search-form';
const input = new HTMLElement('input');
input.className = 'search-input';
form.appendChild(input);

let createElementCount = 0;

global.document = {
  createElement: (tag) => {
    createElementCount++;
    const el = new HTMLElement(tag);
    if (tag === 'div') el.tagName = 'DIV';
    return el;
  },
  createDocumentFragment: () => {
    const el = new HTMLElement('DOCUMENT_FRAGMENT');
    return el;
  },
  getElementById: (_id) => null,
  querySelector: (selector) => {
    if (selector === '.search-suggestions') {
      return form.children.find((c) => c.className === 'search-suggestions') || null;
    }
    return null;
  },
  querySelectorAll: (_selector) => [],
  head: new HTMLElement('head'),
  body: new HTMLElement('body'),
  documentElement: new HTMLElement('html'),
  addEventListener: () => {},
  readyState: 'complete',
};

global.window = {
  location: { href: '' },
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  requestAnimationFrame: (cb) => cb(),
  announceToScreenReader: () => {},
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
      return arr;
    },
  },
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

global.navigator = {
  clipboard: { writeText: () => Promise.resolve() },
};

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock functions to avoid errors during eval
global.initAll = () => {};
global.initThemeToggle = () => {};
global.initMobileNavigation = () => {};
global.initNavigationDropdown = () => {};
global.initSearchFunctionality = () => {};
global.initSmoothScrolling = () => {};
global.initFocusManagement = () => {};
global.initReportEnhancements = () => {};
global.initAccessibilityEnhancements = () => {};
global.initBackToTopButton = () => {};
global.initFilterReset = () => {};
global.initSmartHeader = () => {};
global.initKeyboardShortcuts = () => {};
global.checkColorContrast = () => {};

// Load the script content
const scriptPath = path.join(__dirname, '../assets/js/main.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const vm = require('node:vm');
const context = vm.createContext(global);

// Execute script
vm.runInContext(scriptContent, context);

// Verification: Ensure showSearchSuggestions is defined
if (typeof showSearchSuggestions !== 'function') {
  console.error('showSearchSuggestions not found!');
  process.exit(1);
}

// Benchmark
console.log('Starting benchmark...');
const iterations = 10000;
const start = process.hrtime();

for (let i = 0; i < iterations; i++) {
  showSearchSuggestions('Jen', input);
}

const end = process.hrtime(start);
const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);

console.log(`Execution time for ${iterations} iterations: ${timeInMs}ms`);
console.log(`createElement calls: ${createElementCount}`);

// Check result
const suggestions = form.children.find((c) => c.className === 'search-suggestions');
if (suggestions) {
  // console.log('Final HTML:', suggestions.innerHTML);
  if (suggestions.innerHTML.includes('Jenkins')) {
    console.log('Result verified: Contains expected content.');
  } else {
    console.log('Result verification FAILED: Content missing.');
  }
} else {
  console.log('Result verification FAILED: Suggestions element missing.');
}
