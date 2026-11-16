/**
 * assets/js/categories.js
 * カテゴリ一覧ページのインクリメンタル検索。
 * カテゴリ名（ひらがな・カタカナを同一視）でカテゴリカードを絞り込む。
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
  const searchInput = document.getElementById('category-search-input');
  const countEl = document.getElementById('category-search-count');
  const categoryCards = Array.from(document.querySelectorAll('.category-card'));

  if (!searchInput || categoryCards.length === 0) return;

  const normalize = (value) => toHiragana(String(value ?? '').toLowerCase());
  const entries = categoryCards.map((card) => ({
    card,
    text: normalize(card.dataset.categoryName || card.textContent || ''),
  }));

  function updateCategorySearchCount(visibleCount, term) {
    if (!countEl) return;
    countEl.textContent =
      term === '' ? `${categoryCards.length} 個のカテゴリ` : `${visibleCount} / ${categoryCards.length} 個のカテゴリ`;
  }

  function filterCategories() {
    const term = normalize(searchInput.value.trim());
    let visibleCount = 0;

    entries.forEach(({ card, text }) => {
      const matches = term === '' || text.includes(term);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount += 1;
    });

    updateCategorySearchCount(visibleCount, term);
  }

  searchInput.addEventListener('input', filterCategories);

  searchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    searchInput.value = '';
    filterCategories();
  });

  filterCategories();
});
