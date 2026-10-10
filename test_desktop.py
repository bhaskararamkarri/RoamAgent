from playwright.sync_api import sync_playwright

def run_desktop():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        page.on("console", lambda m: print(f"CONSOLE: {m.text}"))
        page.on("response", lambda r: print(f"RESP: {r.url} -> {r.status}"))

        page.goto("http://127.0.0.1:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)

        chip = page.locator("button:has-text('Vizag to Hitech City tomorrow by 9 AM')").first
        chip.click()

        page.wait_for_timeout(5000)
        page.screenshot(path="docs/desktop_debug.png", full_page=True)
        print("Desktop debug screenshot saved to docs/desktop_debug.png")
        browser.close()

if __name__ == "__main__":
    run_desktop()
