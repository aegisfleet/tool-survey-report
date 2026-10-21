const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Mock DOM & environment
class MockElement {
  constructor(tag) {
    this.tagName = tag;
    this.style = {};
    this.children = [];
    this.className = '';
    this.classList = {
      add: (_c) => {},
      remove: (_c) => {},
      contains: () => false,
      toggle: () => {},
    };
    this.dataset = {};
    this.attributes = {};
    this.value = '';
    this.listeners = {};
    this._innerHTML = '';
  }
  setAttribute(k, v) {
    this.attributes[k] = v;
  }
  getAttribute(k) {
    return this.attributes[k];
  }
  get innerHTML() {
    return this._innerHTML || this.children.map((c) => c.innerHTML).join('');
  }
  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
  }
  addEventListener(ev, cb) {
    this.listeners[ev] = cb;
  }
  querySelector() {
    return null;
  }
  querySelectorAll() {
    return [];
  }
  appendChild(child) {
    this.children.push(child);
  }
  focus() {}
}

const container = new MockElement('div');
const input = new MockElement('input');
const resultsList = new MockElement('div');
const loadingEl = new MockElement('div');
const initialEl = new MockElement('div');
const emptyEl = new MockElement('div');
const clearBtn = new MockElement('button');
const countEl = new MockElement('span');

global.window = {
  location: { origin: 'http://localhost' },
  __SITE_BASEURL__: '/tool-survey-report',
};

global.document = {
  createElement: (tag) => new MockElement(tag),
  createDocumentFragment: () => new MockElement('fragment'),
  getElementById: (id) => {
    switch (id) {
      case 'search-modal-container':
        return container;
      case 'search-modal-backdrop':
        return new MockElement('div');
      case 'search-modal-input':
        return input;
      case 'search-modal-clear':
        return clearBtn;
      case 'search-modal-close':
        return new MockElement('button');
      case 'search-modal-loading':
        return loadingEl;
      case 'search-modal-initial':
        return initialEl;
      case 'search-modal-results':
        return resultsList;
      case 'search-modal-empty':
        return emptyEl;
      case 'search-modal-count':
        return countEl;
      case 'global-search-trigger':
        return new MockElement('button');
      default:
        return null;
    }
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};

// Mock fetch to return WSL sample data
const mockData = [
  {
    tool_name: 'WSL',
    tool_reading: 'ダブルエスエル / ウィンドウズ サブシステム フォー リナックス',
    category: 'OS/プラットフォーム',
    tags: ['開発者ツール', 'Linux', 'Windows', 'Microsoft'],
    description: 'Windows上でLinux環境をシームレスに実行できる機能',
    official_site: 'https://learn.microsoft.com/windows/wsl/',
    links: {
      github: 'https://github.com/microsoft/WSL',
      deepwiki: 'https://deepwiki.com/microsoft/WSL',
      codewiki: 'https://codewiki.google/github.com/microsoft/WSL',
      documentation: 'https://learn.microsoft.com/windows/wsl/',
    },
    slug: 'wsl',
    score: 88,
  },
  {
    tool_name: 'Docker',
    tool_reading: 'ドッカー',
    category: '開発ツール',
    tags: ['コンテナ', '仮想化'],
    description: 'コンテナ仮想化プラットフォーム',
    official_site: 'https://www.docker.com/',
    links: {
      github: 'https://github.com/docker/cli',
    },
    slug: 'docker',
    score: 90,
  },
  {
    tool_name: 'Claude Code',
    tool_reading: 'クロード コード',
    category: '自律型コーディングエージェント',
    tags: ['AI', 'エージェント', 'コーディング支援'],
    description: 'Anthropicが提供する自律型コーディングツール',
    official_site: 'https://claude.ai/code',
    links: {
      github: 'https://github.com/anthropics/claude-code',
    },
    slug: 'claude-code',
    score: 92,
  },
];

global.fetch = async () => ({
  ok: true,
  json: async () => mockData,
});

const scriptContent = fs.readFileSync(path.join(__dirname, '../../assets/js/search-modal.js'), 'utf8');

// Run script
const context = vm.createContext(global);
vm.runInContext(scriptContent, context);

// Test load & search
async function testSearchModal() {
  console.log('Testing search-modal.js...');

  // Trigger DOMContentLoaded
  // Search modal sets up listeners, let's test executeSearch by feeding input
  // Since search-modal is IIFE, let's test if search works via input input event
  // Let's inspect if initSearchModal ran
  const inputHandler = input.listeners.input;
  if (!inputHandler) {
    console.error('Input event handler not found!');
    process.exit(1);
  }

  // 1. Search full GitHub URL
  input.value = 'https://github.com/microsoft/WSL';
  await inputHandler({ target: input });
  // Wait microtasks
  await new Promise((r) => setTimeout(r, 50));

  if (!resultsList.innerHTML.includes('WSL')) {
    console.error('Failed: Full URL did not match WSL');
    process.exit(1);
  }
  console.log('Passed: Full GitHub URL matched WSL');

  // 2. Search scheme-less URL
  input.value = 'github.com/microsoft/WSL';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (!resultsList.innerHTML.includes('WSL')) {
    console.error('Failed: Scheme-less URL did not match WSL');
    process.exit(1);
  }
  console.log('Passed: Scheme-less URL matched WSL');

  // 3. Search repo path
  input.value = 'microsoft/WSL';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (!resultsList.innerHTML.includes('WSL')) {
    console.error('Failed: Repo path did not match WSL');
    process.exit(1);
  }
  console.log('Passed: Repo path matched WSL');

  // 4. Search unrelated url
  input.value = 'https://github.com/unknown/repo';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (resultsList.innerHTML.includes('WSL')) {
    console.error('Failed: Unrelated repo unexpectedly matched WSL');
    process.exit(1);
  }
  console.log('Passed: Unrelated URL did not match');

  // 5. Search Katakana for Claude Code ('クロード')
  input.value = 'クロード';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (!resultsList.innerHTML.includes('Claude Code')) {
    console.error('Failed: Katakana "クロード" did not match Claude Code');
    process.exit(1);
  }
  if (!resultsList.innerHTML.includes('search-modal-item-reading') || !resultsList.innerHTML.includes('コード)')) {
    console.error('Failed: Claude Code result should include phonetic reading');
    process.exit(1);
  }
  if (!resultsList.innerHTML.includes('<mark>クロード</mark>')) {
    console.error('Failed: Katakana "クロード" should be highlighted');
    process.exit(1);
  }
  console.log('Passed: Katakana "クロード" matched Claude Code with highlighted reading');

  // 6. Search Katakana for Docker ('ドッカー')
  input.value = 'ドッカー';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (!resultsList.innerHTML.includes('Docker')) {
    console.error('Failed: Katakana "ドッカー" did not match Docker');
    process.exit(1);
  }
  console.log('Passed: Katakana "ドッカー" matched Docker');

  // 7. Search Katakana for WSL ('ダブルエスエル')
  input.value = 'ダブルエスエル';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (!resultsList.innerHTML.includes('WSL')) {
    console.error('Failed: Katakana "ダブルエスエル" did not match WSL');
    process.exit(1);
  }
  console.log('Passed: Katakana "ダブルエスエル" matched WSL');

  // 8. Search Hiragana for Claude Code ('くろーど')
  input.value = 'くろーど';
  await inputHandler({ target: input });
  await new Promise((r) => setTimeout(r, 50));
  if (!resultsList.innerHTML.includes('Claude Code')) {
    console.error('Failed: Hiragana "くろーど" did not match Claude Code');
    process.exit(1);
  }
  if (!resultsList.innerHTML.includes('<mark>クロード</mark>')) {
    console.error('Failed: Hiragana search "くろーど" should highlight Katakana "クロード"');
    process.exit(1);
  }
  console.log('Passed: Hiragana "くろーど" matched Claude Code with cross-script highlight');

  console.log('All search-modal tests passed!');
}

testSearchModal().catch((err) => {
  console.error('Error during test:', err);
  process.exit(1);
});
