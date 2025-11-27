import asyncio
import os
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Access the page explicitly pointing to index.html
        url = "http://localhost:8000/reports/microsoft-365-copilot/index.html"
        print(f"Navigating to {url}")
        response = await page.goto(url)
        print(f"Status: {response.status}")

        # Verify title - Updated based on _config.yml
        await expect(page).to_have_title("Microsoft 365 Copilot 調査レポート | ポちのツール情報収集サイト")

        # Take screenshot
        output_path = os.path.abspath("copilot_verification.png")
        print(f"Saving screenshot to: {output_path}")
        await page.screenshot(path=output_path, full_page=True)
        print("Verification successful, screenshot saved.")

        if os.path.exists(output_path):
            print(f"File exists at {output_path}, size: {os.path.getsize(output_path)}")
        else:
            print(f"File DOES NOT exist at {output_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
