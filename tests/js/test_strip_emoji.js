const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Mock minimal environment for home.js to load
global.window = {
  location: { search: '' },
  addEventListener: () => {},
  crypto: {
    getRandomValues: (arr) => arr,
  },
};
global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
};
global.sessionStorage = { getItem: () => null, setItem: () => {} };
global.history = { replaceState: () => {} };

// Load and execute script
const scriptPath = path.join(__dirname, '../../assets/js/home.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const context = vm.createContext(global);
vm.runInContext(scriptContent, context);

const stripEmoji = context.stripEmoji;

const testCases = [
  { input: '🤖 Title', expected: 'Title', desc: 'Single leading emoji' },
  { input: '🤖✨ Title', expected: 'Title', desc: 'Multiple leading emojis' },
  { input: '  🤖  Title', expected: 'Title', desc: 'Leading spaces and emoji' },
  { input: 'Title', expected: 'Title', desc: 'No emoji' },
  { input: 'Title 🤖', expected: 'Title 🤖', desc: 'Emoji at the end (should NOT be stripped by regex, but trim() might affect trailing spaces)' },
  { input: '🤖', expected: '', desc: 'Only emoji' },
  { input: '   ', expected: '', desc: 'Only spaces' },
  { input: 'A 🤖 B', expected: 'A 🤖 B', desc: 'Emoji in the middle' },
  { input: '⌨️ AI coding', expected: 'AI coding', desc: 'Emoji with variation selector' },
  { input: '👨‍👩‍👧‍👦 Family', expected: 'Family', desc: 'Complex ZWJ emoji at start' },
  { input: '  Title  ', expected: 'Title', desc: 'Just spaces (trim test)' },
  { input: '🔹 Blue diamond', expected: 'Blue diamond', desc: 'Special mark at start' },
];

console.log('Running stripEmoji tests...');
let passedCount = 0;
let failedCount = 0;

for (const { input, expected, desc } of testCases) {
  const result = stripEmoji(input);
  if (result === expected) {
    console.log(`✅ PASS: ${desc} ("${input}" -> "${result}")`);
    passedCount++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    console.error(`   Input:    "${input}"`);
    console.error(`   Expected: "${expected}"`);
    console.error(`   Actual:   "${result}"`);
    failedCount++;
  }
}

console.log(`\nTests finished: ${passedCount} passed, ${failedCount} failed.`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
