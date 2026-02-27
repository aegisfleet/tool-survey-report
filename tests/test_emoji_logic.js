const fs = require('node:fs');
const path = require('node:path');

// Mock DOM - Simplified version for emoji test
class HTMLElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this._innerHTML = '';
    this.className = '';
    this.attributes = {};
    this.dataset = {};
    this.style = {};
  }

  get textContent() {
    return this._innerHTML;
  }
  set textContent(val) {
    this._innerHTML = val;
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
  }

  querySelector(selector) {
    // Handle the specific selector used in the code
    if (selector === '.meta-item.category') {
      return this.children.find((c) => c.className?.includes('category')) || null;
    }

    // Very simple implementation for specific test cases
    if (selector === '.report-title a') {
      const title = this.children.find((c) => c.className?.includes('report-title'));
      if (title) {
        return title.children[0]; // Assuming 'a' is the first child
      }
      return null;
    }

    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      // Simple include check - might be enough for simple selectors
      return this.children.find((c) => c.className?.includes(className)) || null;
    }

    return null;
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

  addEventListener() {}
}

// Setup minimal global environment
global.window = {
  location: { search: '' },
  addEventListener: (event, cb) => {
    if (event === 'load') setTimeout(cb, 0);
  },
  matchMedia: () => ({ matches: false }),
};
global.sessionStorage = { getItem: () => null, setItem: () => {} };
global.URL = class {
  constructor(u) {
    this.href = u;
    this.searchParams = { get: () => null };
  }
};

// Create test cards
const cards = [];

const card1 = new HTMLElement('div');
card1.className = 'report-card';
card1.dataset = { tags: 'tag1' };
const title1 = new HTMLElement('h3');
title1.className = 'report-title';
const link1 = new HTMLElement('a');
link1.textContent = 'Simple Title';
title1.appendChild(link1);
const cat1 = new HTMLElement('span');
cat1.className = 'meta-item category';
cat1.textContent = 'AI';
card1.appendChild(title1);
card1.appendChild(cat1);
cards.push(card1);

const card2 = new HTMLElement('div');
card2.className = 'report-card';
card2.dataset = { tags: 'tag2' };
const title2 = new HTMLElement('h3');
title2.className = 'report-title';
const link2 = new HTMLElement('a');
link2.textContent = '🤖 Emoji Title';
title2.appendChild(link2);
const cat2 = new HTMLElement('span');
cat2.className = 'meta-item category';
cat2.textContent = 'AI';
card2.appendChild(title2);
card2.appendChild(cat2);
cards.push(card2);

// Mock document
global.document = {
  getElementById: () => new HTMLElement('div'),
  querySelector: () => new HTMLElement('div'),
  querySelectorAll: (selector) => {
    if (selector === '.report-card') return cards;
    if (selector === '.pick-card') return [];
    return [];
  },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') setTimeout(cb, 0);
  },
  createElement: (tag) => new HTMLElement(tag),
};

// Load and execute script
const scriptPath = path.join(__dirname, '../assets/js/home.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

console.log('Running emoji logic tests...');

// We need to wait for DOMContentLoaded
try {
  eval(scriptContent);

  // Wait a bit for the event loop
  setTimeout(() => {
    let passed = true;

    // Check Card 1: Should have emoji added
    // AI category maps to 🤖
    if (link1.textContent === '🤖 Simple Title') {
      console.log('Test 1 Passed: Emoji added to simple title');
    } else {
      console.error(`Test 1 Failed: Expected "🤖 Simple Title", got "${link1.textContent}"`);
      passed = false;
    }

    // Check Card 2: Should have emoji normalized (not duplicated)
    // "🤖 Emoji Title" should become "🤖 Emoji Title", not "🤖 🤖 Emoji Title"
    if (link2.textContent === '🤖 Emoji Title') {
      console.log('Test 2 Passed: Emoji not duplicated');
    } else {
      console.error(`Test 2 Failed: Expected "🤖 Emoji Title", got "${link2.textContent}"`);
      passed = false;
    }

    if (passed) {
      console.log('All emoji tests passed!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }, 100);
} catch (e) {
  console.error(e);
  process.exit(1);
}
