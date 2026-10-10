from playwright.sync_api import sync_playwright

def inspect():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844})
        
        page.on("console", lambda m: print(f"CONSOLE: {m.text}"))
        page.on("pageerror", lambda e: print(f"ERROR: {e}"))
        page.on("response", lambda r: print(f"RESP: {r.url} -> {r.status}"))

        page.goto("http://127.0.0.1:3000")
        page.wait_for_timeout(1000)

        page.select_option("select[aria-label='Preset Scenarios']", "scenario-a")
        page.wait_for_timeout(3000)

        page.screenshot(path="docs/inspect_after_scenario.png")
        print("Inspect screenshot saved to docs/inspect_after_scenario.png")
        browser.close()

if __name__ == "__main__":
    inspect()
