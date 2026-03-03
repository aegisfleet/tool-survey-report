const iterations = 1000000;
const katakana = 'カタカナテストアイウエオカキクケコサシスセソタチツテト';

function toHiraganaBaseline(str) {
  if (!str) return '';
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

const KATAKANA_REGEX = /[\u30a1-\u30f6]/g;
function toHiraganaOptimized(str) {
  if (!str) return '';
  return str.replace(KATAKANA_REGEX, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

console.log('Running benchmark...');

// Warm up
for (let i = 0; i < 10000; i++) {
  toHiraganaBaseline(katakana);
  toHiraganaOptimized(katakana);
}

const startBaseline = process.hrtime();
for (let i = 0; i < iterations; i++) {
  toHiraganaBaseline(katakana);
}
const endBaseline = process.hrtime(startBaseline);
const timeBaseline = (endBaseline[0] * 1000 + endBaseline[1] / 1e6).toFixed(2);

const startOptimized = process.hrtime();
for (let i = 0; i < iterations; i++) {
  toHiraganaOptimized(katakana);
}
const endOptimized = process.hrtime(startOptimized);
const timeOptimized = (endOptimized[0] * 1000 + endOptimized[1] / 1e6).toFixed(2);

console.log(`Baseline (regex literal inside): ${timeBaseline}ms for ${iterations} iterations`);
console.log(`Optimized (regex pulled out): ${timeOptimized}ms for ${iterations} iterations`);

const improvement = (((timeBaseline - timeOptimized) / timeBaseline) * 100).toFixed(2);
console.log(`Improvement: ${improvement}%`);
