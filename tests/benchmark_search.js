const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

/**
 * tests/benchmark_search.js
 * Benchmarks the search and filter logic in home.js.
 * This script uses vm.runInContext() for safer script execution and mocks window.crypto
 * to support the secure random shuffling logic.
 */

const NUM_ITEMS = 500;
const SEARCH_ITERATIONS = 100;

// Generate large dummy data
function generateHtml(count) {
  let cards = '';
  for (let i = 0; i < count; i++) {
    cards += `
        <div class="report-card" 
             data-tool-name="Tool ${i}" 
             data-tool-reading="つーる ${i}"
             data-description="Description for tool ${i}. Features AI and automation."
             data-category="ai"
             data-tags="ai,ml,tool${i}"
             data-date="2024-01-01"
             data-score="${(i % 10).toFixed(1)}">
            <div class="meta-item category">AI</div>
            <div class="report-title"><a href="#">Tool ${i}</a></div>
            <div class="card-score-badge">${(i % 10).toFixed(1)}</div>
        </div>`;
  }

  return `
    <div class="home-container">
        <input id="report-search">
        <div id="search-clear"></div>
        <select id="tag-filter"><option value=""></option></select>
        <div id="tag-filter-clear"></div>
        <select id="category-filter"><option value=""></option></select>
        <div id="category-filter-clear"></div>
        <select id="sort-select">
            <option value="date-desc">Newest</option>
            <option value="score-desc">Score</option>
        </select>
        <div id="reports-grid">${cards}</div>
        <div id="no-results" style="display:none">No results</div>
        <div id="random-picks-grid"></div>
    </div>
    `;
}

const domHtml = generateHtml(NUM_ITEMS);
const dom = new JSDOM(domHtml);
const homeJsPath = path.resolve(__dirname, '../assets/js/home.js');
const homeJsContent = fs.readFileSync(homeJsPath, 'utf8');

// Create context for vm
const context = vm.createContext({
  document: dom.window.document,
  window: dom.window,
  navigator: dom.window.navigator,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  sessionStorage: {
    getItem: (key) => null,
    setItem: (key, val) => {},
    removeItem: (key) => {},
  },
  // Mocking window.crypto
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
  history: dom.window.history,
  HTMLElement: dom.window.HTMLElement,
  Event: dom.window.Event,
  CustomEvent: dom.window.CustomEvent,
  NodeList: dom.window.NodeList,
  HTMLCollection: dom.window.HTMLCollection,
});

// Polyfill window object
context.window.crypto = context.crypto;

const script = new vm.Script(homeJsContent);
script.runInContext(context);

// Manually trigger DOMContentLoaded
const event = dom.window.document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
dom.window.document.dispatchEvent(event);

const searchInput = dom.window.document.getElementById('report-search');

console.log(`Benchmarking search logic with ${NUM_ITEMS} items over ${SEARCH_ITERATIONS} iterations...`);

const start = Date.now();
for (let i = 0; i < SEARCH_ITERATIONS; i++) {
  searchInput.value = `tool ${i % NUM_ITEMS}`;
  // Directly call the filter function exposed to global/window scope
  context.filterAndSort(false);
}
const end = Date.now();

const totalTime = end - start;
const avgTime = totalTime / SEARCH_ITERATIONS;

console.log(`Total time: ${totalTime}ms`);
console.log(`Average search time: ${avgTime.toFixed(2)}ms per search`);

if (avgTime > 50) {
  console.warn('Performance Warning: Search logic is taking longer than 50ms per iteration.');
} else {
  console.log('Performance OK.');
}
