import sys
from playwright.sync_api import sync_playwright

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.on('console', lambda msg: print(f'CONSOLE [{msg.type}]: {msg.text}', flush=True))
        page.on('pageerror', lambda err: print(f'PAGEERROR: {err}', flush=True))
        
        print('Navigating to home page...', flush=True)
        page.goto('http://127.0.0.1:4000/tool-survey-report/')
        
        print('Testing hero search...', flush=True)
        page.fill('#hero-search-input', 'https://github.com/microsoft/WSL')
        page.wait_for_timeout(500)
        
        visible_cards = page.query_selector_all('article.report-card:not([style*="display: none"])')
        print(f'Home visible cards count: {len(visible_cards)}', flush=True)
        assert len(visible_cards) == 1, f'Expected 1 visible card, got {len(visible_cards)}'
        
        card_name = visible_cards[0].get_attribute('data-tool-name')
        print(f'Home visible card tool name: {card_name}', flush=True)
        assert card_name == 'wsl', f'Expected wsl, got {card_name}'
        print('PASS: Home URL search works perfectly!', flush=True)

        print('Testing modal search...', flush=True)
        page.click('#hero-search-clear')
        page.click('#global-search-trigger')
        page.wait_for_selector('#search-modal-container.is-active')
        print('Modal opened successfully.', flush=True)
        
        # Wait a bit for initial data fetch if needed
        page.wait_for_timeout(500)
        
        print('Typing into search modal input...', flush=True)
        page.fill('#search-modal-input', 'https://github.com/microsoft/WSL')
        
        print('Waiting for modal results...', flush=True)
        page.wait_for_selector('#search-modal-results .search-modal-item', timeout=10000)
        
        modal_items = page.query_selector_all('#search-modal-results .search-modal-item')
        print(f'Modal results count: {len(modal_items)}', flush=True)
        assert len(modal_items) >= 1, f'Expected at least 1 modal result, got {len(modal_items)}'
        
        modal_title = modal_items[0].query_selector('.search-modal-item-title').inner_text()
        print(f'Modal first result title: {modal_title}', flush=True)
        assert 'WSL' in modal_title, f'Expected WSL in modal result, got {modal_title}'
        print('PASS: Modal URL search works perfectly!', flush=True)
        
        page.screenshot(path='/home/poti/work/tool-survey-report/.agent/screenshot_modal_verified.png')
        browser.close()

    print('ALL BROWSER TESTS PASSED SUCCESSFULLY!', flush=True)

if __name__ == '__main__':
    run_test()
