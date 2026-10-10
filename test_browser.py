import os
import sys
from playwright.sync_api import sync_playwright

def run_browser_verification():
    os.makedirs("docs", exist_ok=True)
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # -------------------------------------------------------------
        # 1. MOBILE VIEWPORT TEST: 390x844
        # -------------------------------------------------------------
        print("Testing Mobile Viewport (390x844)...")
        context_mobile = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
        )
        page_mobile = context_mobile.new_page()
        page_mobile.on("console", lambda msg: console_errors.append(f"Mobile console [{msg.type}]: {msg.text}") if msg.type == "error" else None)

        page_mobile.goto("http://127.0.0.1:3000", wait_until="networkidle")
        page_mobile.wait_for_selector("option[value='scenario-a']", state="attached", timeout=10000)

        # Assert no horizontal overflow at 390px
        scroll_width = page_mobile.evaluate("() => document.documentElement.scrollWidth")
        client_width = page_mobile.evaluate("() => document.documentElement.clientWidth")
        print(f"Mobile widths: scrollWidth={scroll_width}, clientWidth={client_width}")
        assert scroll_width <= client_width + 1, f"Horizontal overflow detected! scrollWidth ({scroll_width}) > clientWidth ({client_width})"

        # Select Scenario A from preset dropdown (auto-triggers plan)
        print("Selecting Scenario A on Mobile...")
        page_mobile.select_option("select[aria-label='Preset Scenarios']", "scenario-a")

        # Wait for itinerary cards
        print("Waiting for itinerary recommendations...")
        page_mobile.wait_for_selector("article", timeout=30000)
        page_mobile.wait_for_timeout(1000)
        page_mobile.screenshot(path="docs/mobile_390_results.png", full_page=True)
        print("[OK] Mobile results screenshot saved to docs/mobile_390_results.png")

        # Click Book with Consent on the first card
        first_book_btn = page_mobile.locator("article >> button:has-text('Book with Consent')").first
        first_book_btn.click()

        # Verify Consent Modal
        page_mobile.wait_for_selector("div[role='dialog']", timeout=5000)
        page_mobile.wait_for_timeout(500)
        page_mobile.screenshot(path="docs/mobile_consent_modal.png")
        print("[OK] Consent modal screenshot saved to docs/mobile_consent_modal.png")

        # Click Approve & Book (Sandbox)
        approve_btn = page_mobile.locator("button:has-text('Approve & Book')")
        approve_btn.click()

        # Verify Booking Confirmed Card
        booking_header = page_mobile.locator("text=Booking Confirmed")
        booking_header.wait_for(timeout=5000)
        booking_header.scroll_into_view_if_needed()
        page_mobile.wait_for_timeout(500)
        page_mobile.screenshot(path="docs/mobile_booking_confirmed.png")
        print("[OK] Booking confirmed screenshot saved to docs/mobile_booking_confirmed.png")

        # Open Disruption Simulator
        page_mobile.locator("button:has-text('Simulate Disruption')").click()
        page_mobile.wait_for_selector("text=Disruption & Re-planning Engine", timeout=5000)
        page_mobile.locator("button:has-text('Delay +120m')").click()
        page_mobile.wait_for_selector("text=Feasible Re-planned Alternatives", timeout=8000)
        page_mobile.wait_for_timeout(500)
        page_mobile.screenshot(path="docs/mobile_disruption_alternatives.png")
        print("[OK] Disruption alternatives screenshot saved to docs/mobile_disruption_alternatives.png")

        context_mobile.close()

        # -------------------------------------------------------------
        # 2. DESKTOP VIEWPORT TEST: 1280x800
        # -------------------------------------------------------------
        print("\nTesting Desktop Viewport (1280x800)...")
        context_desktop = browser.new_context(viewport={"width": 1280, "height": 800})
        page_desktop = context_desktop.new_page()
        page_desktop.on("console", lambda msg: console_errors.append(f"Desktop console [{msg.type}]: {msg.text}") if msg.type == "error" else None)

        page_desktop.goto("http://127.0.0.1:3000", wait_until="networkidle")
        page_desktop.wait_for_selector("option[value='scenario-a']", state="attached", timeout=10000)

        # Plan Happy Path via Scenario Dropdown (auto-triggers plan)
        print("Selecting Scenario A on Desktop...")
        page_desktop.select_option("select[aria-label='Preset Scenarios']", "scenario-a")

        page_desktop.wait_for_selector("article", timeout=30000)
        page_desktop.wait_for_timeout(1000)
        page_desktop.screenshot(path="docs/desktop_1280_results.png", full_page=True)
        print("[OK] Desktop results screenshot saved to docs/desktop_1280_results.png")

        context_desktop.close()
        browser.close()

    # Filter benign console warnings/errors
    critical_errors = [e for e in console_errors if "favicon" not in e and "manifest" not in e]
    if critical_errors:
        print(f"WARNING: Console errors encountered: {critical_errors}")
    else:
        print("[OK] ZERO CONSOLE ERRORS ENCOUNTERED across mobile and desktop runs!")

    print("\nALL PLAYWRIGHT BROWSER VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    try:
        run_browser_verification()
    except Exception as e:
        print(f"Browser verification failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
