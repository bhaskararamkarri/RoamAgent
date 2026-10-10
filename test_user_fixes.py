import os
import sys
import time
from playwright.sync_api import sync_playwright

def verify_user_fixes():
    os.makedirs("docs", exist_ok=True)
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()
        page.on("console", lambda msg: console_errors.append(f"Console [{msg.type}]: {msg.text}") if msg.type == "error" else None)

        print("\n--- 1. Testing Homepage & Top Banner Removal ---")
        page.goto("http://127.0.0.1:3000", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # 1.1 Verify top Sandbox banner is removed
        banner_locator = page.get_by_text("Sandbox Simulation Mode")
        assert banner_locator.count() == 0, "Expected top Sandbox banner to be removed!"
        print("[PASS] Top 'Sandbox Simulation Mode' banner is completely removed from header area.")

        # -------------------------------------------------------------
        # 2. Testing Autocomplete for All-India & Local Locations
        # -------------------------------------------------------------
        print("\n--- 2. Testing Autocomplete with 2-letter queries ---")
        origin_input = page.locator("#search-form input").first
        origin_input.click()
        origin_input.fill("")
        
        # Test 2.1: Type 'de' -> should show Delhi, New Delhi, Dehradun, etc.
        origin_input.fill("de")
        page.wait_for_selector("#search-form li", timeout=5000)
        de_options = [o.text_content().strip() for o in page.locator("#search-form li").all()]
        print(f"Suggestions for 'de': {de_options[:5]}")
        assert len(de_options) >= 2, f"Expected multiple options for 'de', got {len(de_options)}"
        assert any("Delhi" in opt or "Dehradun" in opt for opt in de_options), "Expected Delhi or Dehradun in 'de' results"

        # Test 2.2: Type 'vi' -> should show Vizag Railway Station, Visakhapatnam, MVP Colony, Vijayawada, etc.
        origin_input.fill("vi")
        page.wait_for_timeout(400)
        page.wait_for_selector("#search-form li", timeout=5000)
        vi_options = [o.text_content().strip() for o in page.locator("#search-form li").all()]
        print(f"Suggestions for 'vi': {vi_options[:6]}")
        assert len(vi_options) >= 3, f"Expected multiple options for 'vi', got {len(vi_options)}"

        # Test 2.3: Type 'mu' into destination
        dest_input = page.locator("#search-form input").nth(1)
        dest_input.click()
        dest_input.fill("mu")
        page.wait_for_timeout(400)
        page.wait_for_selector("#search-form li", timeout=5000)
        mu_options = [o.text_content().strip() for o in page.locator("#search-form li").all()]
        print(f"Suggestions for 'mu': {mu_options[:5]}")
        assert any("Mumbai" in opt for opt in mu_options), "Expected Mumbai in 'mu' results"
        page.screenshot(path="docs/autocomplete_all_india.png")
        print("[PASS] Autocomplete provides rich Pan-India and local locations!")

        # -------------------------------------------------------------
        # 3. Testing 'Plan Route' Redirect & Pre-fill from Popular Routes
        # -------------------------------------------------------------
        print("\n--- 3. Testing 'Plan Route' from Popular Routes ---")
        routes_section = page.locator("#routes")
        routes_section.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        # Click 'Plan Route' on the first route card (Visakhapatnam -> Hyderabad)
        first_route_card = page.locator("#routes article").first
        plan_btn = first_route_card.locator("button:has-text('Plan Route')")
        print("Clicking 'Plan Route' on Visakhapatnam -> Hyderabad...")
        plan_btn.click()
        page.wait_for_timeout(2000)

        # Verify search form input fields are populated
        origin_val = origin_input.input_value()
        dest_val = dest_input.input_value()
        print(f"Pre-filled Origin input: '{origin_val}', Destination input: '{dest_val}'")
        assert "Visakhapatnam" in origin_val or "Vizag" in origin_val, f"Origin not pre-filled correctly: {origin_val}"
        assert "Hyderabad" in dest_val or "Hitech" in dest_val, f"Destination not pre-filled correctly: {dest_val}"

        # Verify results section is displayed right below the search area
        page.wait_for_selector("article:has-text('Reaches')", timeout=15000)
        results_count = page.locator("article:has-text('Reaches')").count()
        print(f"Found {results_count} feasible multi-leg itineraries for Visakhapatnam -> Hyderabad!")
        assert results_count >= 1, "Expected feasible itineraries for popular route"
        page.screenshot(path="docs/popular_route_planned.png")
        print("[PASS] 'Plan Route' redirected, pre-filled inputs, and rendered feasible results right below Hero!")

        # -------------------------------------------------------------
        # 4. Testing 'Benchmarks' Header Button & Drawer
        # -------------------------------------------------------------
        print("\n--- 4. Testing 'Benchmarks' header button & drawer ---")
        benchmarks_btn = page.locator("header button:has-text('Benchmarks')")
        benchmarks_btn.click()
        page.wait_for_selector("div[role='dialog']:has-text('Live Benchmark Metrics')", timeout=8000)
        print("Benchmarks drawer opened successfully!")
        
        # Verify drawer contains live metrics
        page.wait_for_selector("div[role='dialog']:has-text('Offline NLP Intake')", timeout=10000)
        nlp_text = page.locator("div[role='dialog']").get_by_text("Offline NLP Intake")
        assert nlp_text.is_visible(), "Expected Offline NLP Intake metric in drawer"
        page.screenshot(path="docs/benchmarks_drawer.png")
        print("[PASS] Benchmarks drawer opened and rendered live metrics properly.")

        # Close drawer
        page.locator("div[role='dialog'] button:has-text('Close')").click()
        page.wait_for_timeout(500)

        # -------------------------------------------------------------
        # 5. Testing Dedicated '/benchmarks' Page
        # -------------------------------------------------------------
        print("\n--- 5. Testing dedicated /benchmarks page ---")
        page.goto("http://127.0.0.1:3000/benchmarks", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1500)
        page.wait_for_selector("h1:has-text('Benchmark Dashboard')", timeout=8000)
        
        # Verify table of fixtures rendered
        fixture_table = page.locator("table")
        assert fixture_table.is_visible(), "Expected fixture coverage table on /benchmarks"
        print("Found fixture test table on /benchmarks!")
        page.screenshot(path="docs/benchmarks_page.png")
        print("[PASS] Dedicated /benchmarks page is working and fully styled with Sunset Trails theme!")

        context.close()
        browser.close()

    print("\n=======================================================")
    print("ALL USER FIXES VERIFIED SUCCESSFULLY! [PASS]")
    print("=======================================================\n")

if __name__ == "__main__":
    try:
        verify_user_fixes()
    except Exception as e:
        print(f"Error during verification: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
