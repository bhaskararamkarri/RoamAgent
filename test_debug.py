import os
import sys
from playwright.sync_api import sync_playwright

def run_debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844})
        
        page.on("console", lambda m: print(f"CONSOLE [{m.type}]: {m.text}"))
        page.on("response", lambda r: print(f"RESP: {r.url} -> {r.status}"))

        page.goto("http://127.0.0.1:3000", wait_until="networkidle")
        page.wait_for_timeout(500)

        # Fill textarea
        textarea = page.locator("textarea")
        textarea.fill("Vizag to Hitech City tomorrow by 9 AM for 2 people with budget 5000")
        page.locator("button:has-text('Plan Trip')").click()

        print("Waiting for articles to appear...")
        page.wait_for_selector("article", timeout=20000)
        print("Articles appeared!")
        page.screenshot(path="docs/debug_results.png", full_page=True)
        print("Screenshot saved to docs/debug_results.png")
        browser.close()

if __name__ == "__main__":
    run_debug()
