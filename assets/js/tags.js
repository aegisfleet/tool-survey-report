/**
 * assets/js/tags.js
 * タグ一覧ページのインクリメンタル検索。
 * タグ名（ひらがな・カタカナを同一視）でタグカードを絞り込む。
 */

const KATAKANA_HIRAGANA_RE = /[\u30a1-\u30f6]/g;

// カタカナをひらがなへ変換する（検索用）
function toHiragana(str) {
  if (!str) return '';
  return str.replace(KATAKANA_HIRAGANA_RE, (match) => {
    const chr = match.codePointAt(0) - 0x60;
    return String.fromCodePoint(chr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tag-search-input');
  const countEl = document.getElementById('tag-search-count');
  const tagCards = Array.from(document.querySelectorAll('.tag-card'));

  if (!searchInput || tagCards.length === 0) return;

  const normalize = (value) => toHiragana(String(value ?? '').toLowerCase());
  const entries = tagCards.map((card) => ({
    card,
    text: normalize(card.dataset.tagName || card.textContent || ''),
  }));

  function updateTagSearchCount(visibleCount, term) {
    if (!countEl) return;
    countEl.textContent = term === '' ? `${tagCards.length} 個のタグ` : `${visibleCount} / ${tagCards.length} 個のタグ`;
  }

  function filterTags() {
    const term = normalize(searchInput.value.trim());
    let visibleCount = 0;

    entries.forEach(({ card, text }) => {
      const matches = term === '' || text.includes(term);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount += 1;
    });

    updateTagSearchCount(visibleCount, term);
  }

  searchInput.addEventListener('input', filterTags);

  searchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    searchInput.value = '';
    filterTags();
  });

  filterTags();
});
