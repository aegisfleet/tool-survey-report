
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:8000/reports/google-ai-studio/")
        await expect(page).to_have_title("Google AI Studio 調査レポート | ポちのツール情報収集サイト")
        await page.screenshot(path="jules-scratch/verification/verification.png")
        await browser.close()

asyncio.run(main())
