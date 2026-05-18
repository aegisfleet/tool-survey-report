const n = 1000;
const cards = Array.from({length: n}).map((_, i) => ({ id: i }));
const webcrypto = require('crypto').webcrypto;

function bench1() {
  const start = performance.now();
  for (let iter = 0; iter < 100; iter++) {
    const shuffled = [...cards]
      .sort(() => {
        const array = new Uint32Array(1);
        webcrypto.getRandomValues(array);
        return array[0] / 0xffffffff - 0.5;
      })
      .slice(0, 4);
  }
  return performance.now() - start;
}

function bench2() {
  const start = performance.now();
  for (let iter = 0; iter < 100; iter++) {
    const sortValues = new Uint32Array(cards.length);
    webcrypto.getRandomValues(sortValues);
    const shuffled = [...cards]
      .map((card, idx) => ({...card, _sortVal: sortValues[idx]}))
      .sort((a, b) => a._sortVal - b._sortVal)
      .slice(0, 4);
  }
  return performance.now() - start;
}

console.log("Bench 1 (crypto inside sort):", bench1(), "ms");
console.log("Bench 2 (crypto bulk + map):", bench2(), "ms");
