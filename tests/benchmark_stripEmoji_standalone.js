const iterations = 1000000;
const text = '🤖 🧪 🔧 Tool Name';

function stripEmojiBaseline(text) {
  return text.replace(/^[\p{Emoji}\uFE00-\uFE0F\u200D\u200C\s]+/u, '').trim();
}

const STRIP_EMOJI_RE = /^[\p{Emoji}\uFE00-\uFE0F\u200D\u200C\s]+/u;
function stripEmojiOptimized(text) {
  return text.replace(STRIP_EMOJI_RE, '').trim();
}

console.log('Running benchmark for stripEmoji...');

// Warm up
for (let i = 0; i < 10000; i++) {
  stripEmojiBaseline(text);
  stripEmojiOptimized(text);
}

const startBaseline = process.hrtime();
for (let i = 0; i < iterations; i++) {
  stripEmojiBaseline(text);
}
const endBaseline = process.hrtime(startBaseline);
const timeBaseline = (endBaseline[0] * 1000 + endBaseline[1] / 1e6).toFixed(2);

const startOptimized = process.hrtime();
for (let i = 0; i < iterations; i++) {
  stripEmojiOptimized(text);
}
const endOptimized = process.hrtime(startOptimized);
const timeOptimized = (endOptimized[0] * 1000 + endOptimized[1] / 1e6).toFixed(2);

console.log(`Baseline (regex literal inside): ${timeBaseline}ms for ${iterations} iterations`);
console.log(`Optimized (regex pulled out): ${timeOptimized}ms for ${iterations} iterations`);

const improvement = (((timeBaseline - timeOptimized) / timeBaseline) * 100).toFixed(2);
console.log(`Improvement: ${improvement}%`);
