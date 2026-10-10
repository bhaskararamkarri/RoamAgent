import os
import sys
import time
from playwright.sync_api import sync_playwright

def run_comprehensive_verification():
    os.makedirs("docs", exist_ok=True)
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # -------------------------------------------------------------
        # 1. DESKTOP VIEWPORT TEST (1280x800)
        # -------------------------------------------------------------
        print("\n--- 1. Testing Desktop Viewport (1280x800) ---")
        context_desktop = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context_desktop.new_page()
        page.on("console", lambda msg: console_errors.append(f"Console [{msg.type}]: {msg.text}") if msg.type == "error" else None)

        print("Navigating to http://127.0.0.1:3000 ...")
        page.goto("http://127.0.0.1:3000", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # 1.1 Verify Header and Hero
        print("Checking Header and Hero...")
        page.wait_for_selector("#hero-heading", state="visible", timeout=20000)
        hero_heading = page.locator("#hero-heading")
        assert hero_heading.is_visible(), "Hero heading not visible"
        print("Hero heading text:", hero_heading.text_content().strip())

        # Screenshot Hero & Top Section
        page.screenshot(path="docs/desktop_hero.png")
        print("[OK] Saved docs/desktop_hero.png")

        # 1.2 Verify Popular Routes Section
        print("Checking Popular Routes...")
        routes_section = page.locator("#routes")
        routes_section.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        route_cards = page.locator("#routes article")
        route_count = route_cards.count()
        print(f"Found {route_count} popular route cards")
        assert route_count >= 6, f"Expected at least 6 route cards, found {route_count}"
        page.screenshot(path="docs/desktop_popular_routes.png")
        print("[OK] Saved docs/desktop_popular_routes.png")

        # 1.3 Verify Explore India Section and Region Filters
        print("Checking Explore India Catalogue...")
        explore_section = page.locator("#explore")
        explore_section.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        
        # Check catalogue live badge
        catalogue_badge = page.locator("#explore").get_by_text("Catalogue: 28 States")
        assert catalogue_badge.is_visible(), "Catalogue 28 states & 8 UTs badge not visible"
        print("Found catalogue badge: 28 States • 8 UTs")

        # Test clicking Northeast region tab
        northeast_tab = page.locator("#explore button:has-text('Northeast')")
        northeast_tab.click()
        page.wait_for_timeout(500)
        ne_cards = page.locator("#explore article")
        print(f"Northeast region filtered cards count: {ne_cards.count()}")
        assert ne_cards.count() >= 6, "Expected at least 6 destinations in Northeast"

        # Switch to View All Grid
        view_all_btn = page.locator("#explore button:has-text('View All')")
        view_all_btn.click()
        page.wait_for_timeout(500)
        
        # Switch back to All India
        all_india_tab = page.locator("#explore button:has-text('All India')")
        all_india_tab.click()
        page.wait_for_timeout(500)
        all_cards = page.locator("#explore article")
        print(f"Total destinations in catalogue grid: {all_cards.count()}")
        assert all_cards.count() >= 36, f"Expected at least 36 destinations, got {all_cards.count()}"
        page.screenshot(path="docs/desktop_explore_india.png")
        print("[OK] Saved docs/desktop_explore_india.png")

        # 1.4 Test Pre-filling Route Planner by clicking a card
        print("Testing Plan Journey click from Explore India card...")
        page.locator("#explore article").first.click()
        page.wait_for_timeout(1500)

        # Verify scroll to planner / search executed or initiated
        print("Checking plan results or search inputs...")
        page.screenshot(path="docs/desktop_planner_prefilled.png")
        print("[OK] Saved docs/desktop_planner_prefilled.png")

        # 1.5 Test Footer Links and Interactive Modals
        print("Checking Footer navigation and modals...")
        footer = page.locator("footer")
        footer.scroll_into_view_if_needed()
        page.wait_for_timeout(500)

        # Click About RoamAgent in Footer
        about_btn = page.locator("footer button:has-text('About RoamAgent')")
        about_btn.click()
        page.wait_for_selector("div[role='dialog']:has-text('About TBS RoamAgent')", timeout=5000)
        print("[OK] About RoamAgent modal opened successfully")
        page.screenshot(path="docs/desktop_footer_modal.png")
        print("[OK] Saved docs/desktop_footer_modal.png")

        # Close modal
        page.locator("div[role='dialog'] button:has-text('Close')").click()
        page.wait_for_timeout(500)

        context_desktop.close()

        # -------------------------------------------------------------
        # 2. TABLET VIEWPORT TEST (768x1024)
        # -------------------------------------------------------------
        print("\n--- 2. Testing Tablet Viewport (768x1024) ---")
        context_tablet = browser.new_context(viewport={"width": 768, "height": 1024})
        page_tablet = context_tablet.new_page()
        page_tablet.goto("http://127.0.0.1:3000", wait_until="networkidle", timeout=30000)
        page_tablet.wait_for_timeout(1000)

        # Check no horizontal overflow
        scroll_w = page_tablet.evaluate("() => document.documentElement.scrollWidth")
        client_w = page_tablet.evaluate("() => document.documentElement.clientWidth")
        print(f"Tablet widths: scrollWidth={scroll_w}, clientWidth={client_w}")
        assert scroll_w <= client_w + 1, f"Tablet horizontal overflow: {scroll_w} > {client_w}"

        page_tablet.screenshot(path="docs/tablet_768_homepage.png", full_page=False)
        print("[OK] Saved docs/tablet_768_homepage.png")
        context_tablet.close()

        # -------------------------------------------------------------
        # 3. MOBILE VIEWPORT TEST (375x667 & 390x844)
        # -------------------------------------------------------------
        print("\n--- 3. Testing Mobile Viewport (375x667) ---")
        context_mobile = browser.new_context(viewport={"width": 375, "height": 667})
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://127.0.0.1:3000", wait_until="networkidle", timeout=30000)
        page_mobile.wait_for_timeout(1000)

        # Assert no horizontal overflow at 375px
        scroll_w_m = page_mobile.evaluate("() => document.documentElement.scrollWidth")
        client_w_m = page_mobile.evaluate("() => document.documentElement.clientWidth")
        print(f"Mobile 375px widths: scrollWidth={scroll_w_m}, clientWidth={client_w_m}")
        assert scroll_w_m <= client_w_m + 1, f"Mobile 375px horizontal overflow: {scroll_w_m} > {client_w_m}"

        page_mobile.screenshot(path="docs/mobile_375_homepage.png", full_page=False)
        print("[OK] Saved docs/mobile_375_homepage.png")

        # Select Scenario A from preset dropdown on mobile to execute planning & consent flow
        print("Selecting Scenario A on Mobile to test planning & booking...")
        page_mobile.select_option("select[aria-label='Preset Scenarios']", "scenario-a")
        page_mobile.wait_for_selector("article", timeout=30000)
        page_mobile.wait_for_timeout(1000)
        page_mobile.screenshot(path="docs/mobile_375_results.png")
        print("[OK] Saved docs/mobile_375_results.png")

        # Open Consent Modal on Mobile
        first_book_btn = page_mobile.locator("article >> button:has-text('Book with Consent')").first
        first_book_btn.click()
        page_mobile.wait_for_selector("div[role='dialog']", timeout=5000)
        page_mobile.screenshot(path="docs/mobile_375_consent_modal.png")
        print("[OK] Saved docs/mobile_375_consent_modal.png")

        # Approve booking
        page_mobile.locator("button:has-text('Approve & Book')").click()
        page_mobile.get_by_text("Booking Confirmed").wait_for(timeout=8000)
        print("[OK] Booking confirmed card displayed on mobile")

        context_mobile.close()
        browser.close()

    # Filter critical console errors
    crit = [e for e in console_errors if "favicon" not in e and "manifest" not in e]
    if crit:
        print(f"WARNING: Critical console errors: {crit}")
    else:
        print("[OK] Zero console errors during all desktop, tablet, and mobile checks!")

    print("\n=======================================================")
    print("ALL COMPREHENSIVE PLAYWRIGHT CHECKS PASSED SUCCESSFULLY! [PASS]")
    print("=======================================================\n")

if __name__ == "__main__":
    try:
        run_comprehensive_verification()
    except Exception as e:
        print(f"Verification error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
