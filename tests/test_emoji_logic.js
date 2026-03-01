const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * tests/test_emoji_logic.js
 * Tests the emoji application logic from home.js.
 * This test uses vm.runInContext() for safer script execution and mocks window.crypto
 * to support the secure random shuffling logic.
 */

// Mock browser environment
const domHtml = `
<div class="home-container">
    <div id="reports-grid">
        <div class="report-card" data-tags="ai,test">
            <div class="meta-item category">AI エージェント</div>
            <div class="report-title"><a href="#">AI Tool</a></div>
        </div>
        <div class="report-card" data-tags="dev">
            <div class="meta-item category">開発者ツール</div>
            <div class="report-title"><a href="#">Dev Tool</a></div>
        </div>
        <div class="report-card" data-tags="infra">
            <div class="meta-item category">インフラ</div>
            <div class="report-title"><a href="#">Infra Tool</a></div>
        </div>
    </div>
    <div id="random-picks-grid">
        <div class="pick-card">
            <div class="pick-category">AI</div>
            <div class="pick-title">AI Pick</div>
        </div>
    </div>
    <select id="category-filter">
        <option value="">すべてのカテゴリ</option>
        <option value="ai">AI エージェント</option>
        <option value="dev">開発者ツール</option>
    </select>
    <!-- dummy elements for script initialization -->
    <input id="report-search">
    <div id="search-clear"></div>
    <select id="tag-filter"></select>
    <div id="tag-filter-clear"></div>
    <div id="category-filter-clear"></div>
    <select id="sort-select"><option value="date-desc"></option></select>
    <div id="no-results"></div>
</div>
`;

// Set up the environment
const homeJsPath = path.resolve(__dirname, '../assets/js/home.js');
const homeJsContent = fs.readFileSync(homeJsPath, 'utf8');

// Function to run the script in a fresh context
function runHomeJs(dom) {
    const script = new vm.Script(homeJsContent);
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
            removeItem: (key) => {}
        },
        // Mocking window.crypto for secure randomness
        crypto: {
            getRandomValues: (array) => {
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.floor(Math.random() * 0xFFFFFFFF);
                }
                return array;
            }
        },
        Uint32Array: Uint32Array,
        URL: dom.window.URL,
        URLSearchParams: dom.window.URLSearchParams,
        history: dom.window.history,
        HTMLElement: dom.window.HTMLElement,
        Event: dom.window.Event,
        CustomEvent: dom.window.CustomEvent,
        NodeList: dom.window.NodeList,
        HTMLCollection: dom.window.HTMLCollection
    });
    
    // Polyfill window object to have a reference to itself
    context.window.crypto = context.crypto;
    
    script.runInContext(context);
}

const { JSDOM } = require('jsdom');

describe('Emoji Logic Tests', () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(domHtml, { url: 'http://localhost' });
        global.document = dom.window.document;
        global.window = dom.window;
        global.navigator = dom.window.navigator;
        
        // Mock categoryEmojiRules or just let the script run with its own constants
        runHomeJs(dom);
        
        // Trigger DOMContentLoaded manually if needed
        const event = dom.window.document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        dom.window.document.dispatchEvent(event);
    });

    test('should apply robot emoji to AI category', () => {
        const aiCard = dom.window.document.querySelector('.report-card');
        const titleLink = aiCard.querySelector('.report-title a');
        expect(titleLink.textContent).toContain('🤖');
        expect(titleLink.textContent).toContain('AI Tool');
    });

    test('should apply wrench emoji to Developer Tools category', () => {
        const devCard = dom.window.document.querySelectorAll('.report-card')[1];
        const titleLink = devCard.querySelector('.report-title a');
        expect(titleLink.textContent).toContain('🔧');
    });

    test('should apply cloud emoji to Infrastructure category', () => {
        const infraCard = dom.window.document.querySelectorAll('.report-card')[2];
        const titleLink = infraCard.querySelector('.report-title a');
        expect(titleLink.textContent).toContain('☁️');
    });

    test('should update category filter options with emojis', () => {
        const aiOption = dom.window.document.querySelector('#category-filter option[value="ai"]');
        expect(aiOption.textContent).toContain('🤖');
    });

    test('should be idempotent (not duplicate emojis)', () => {
        // Run application logic again
        const event = dom.window.document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        dom.window.document.dispatchEvent(event);

        const aiCard = dom.window.document.querySelector('.report-card');
        const titleLink = aiCard.querySelector('.report-title a');
        
        // Only one emoji should be present
        const emojiMatches = titleLink.textContent.match(/🤖/g);
        expect(emojiMatches.length).toBe(1);
    });
});
