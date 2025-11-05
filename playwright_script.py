
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:8000/reports/lilysai/")
        await expect(page).to_have_title("LilysAI 調査レポート | ポちのツール情報収集サイト")
        await expect(page.locator("h1.report-title")).to_have_text("LilysAI 調査レポート")

        # Verify the update log dates
        update_section = page.locator("h2:has-text('13. 直近半年のアップデート情報') + ul")
        await expect(update_section.locator("li:first-child")).to_contain_text("2024年7月")

        await page.screenshot(path="lilysai_verification.png")
        await browser.close()

asyncio.run(main())
