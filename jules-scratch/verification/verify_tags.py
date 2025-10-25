
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:8000/reports/coderabbit/")

        # Corrected selector to use 'a.tag-link'
        tag_locator = page.locator("a.tag-link:has-text('自動化')")
        await expect(tag_locator).to_be_visible()

        # Scroll the tag into view before taking the screenshot
        await tag_locator.scroll_into_view_if_needed()

        await page.screenshot(path="jules-scratch/verification/verification.png")
        await browser.close()

asyncio.run(main())
