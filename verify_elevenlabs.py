
import asyncio
from playwright.async_api import async_playwright, expect

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        target_url = "http://localhost:8000/reports/elevenlabs/"

        print(f"Navigating to {target_url}")
        response = await page.goto(target_url)

        if response.status == 404:
            print("404 at first attempt, trying with baseurl prefix...")
            target_url = "http://localhost:8000/tool-survey-report/reports/elevenlabs/"
            print(f"Navigating to {target_url}")
            await page.goto(target_url)

        # Check title
        await expect(page).to_have_title("ElevenLabs 調査レポート | ポちのツール情報収集サイト")

        # Check specific elements - using .first to avoid strict mode violation
        await expect(page.get_by_role("heading", name="ElevenLabs 調査レポート").first).to_be_visible()

        # Check category text - targeting specific class to avoid ambiguity
        # "カテゴリ: AI" matches the report-category div
        await expect(page.locator(".report-category").filter(has_text="カテゴリ: AI")).to_be_visible()

        # Check date
        await expect(page.get_by_text("2025-11-29")).to_be_visible()

        # Check Tags
        await expect(page.get_by_text("音声合成", exact=False).first).to_be_visible()
        await expect(page.get_by_text("Voice Cloning", exact=False).first).to_be_visible()

        # Take screenshot
        await page.screenshot(path="verification_elevenlabs.png", full_page=True)
        print("Verification successful, screenshot saved.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
