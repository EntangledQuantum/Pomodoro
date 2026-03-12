from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:4173")

        # Click Skip for now
        page.get_by_text("Skip for now (Local only mode)").click()

        # Wait for the app to load
        expect(page.get_by_role("heading", name="Zen Focus").first).to_be_visible()

        # Add a project
        page.get_by_title("Add Project").click()
        page.get_by_placeholder("Project name...").fill("My First Project")
        # Click the checkmark button
        page.locator(".flex > button").first.click()

        # Add a task
        page.get_by_title("Add Task").click()
        page.get_by_placeholder("What needs to be done?").fill("My First Task")
        page.get_by_text("Add Task", exact=True).click()

        # Check initial timer
        initial_time = page.locator(".text-8xl").inner_text()
        print(f"Initial time: {initial_time}")

        # Take an initial screenshot
        page.screenshot(path="screenshot_debug.png")

        # Timer is automatically started in this app (shows "Pause")
        # Wait for a few seconds to let it tick down
        print("Waiting for timer to tick...")
        time.sleep(3)

        # Check new timer
        new_time = page.locator(".text-8xl").inner_text()
        print(f"New time: {new_time}")

        if initial_time == new_time:
            print("ERROR: Timer did not tick down.")
        else:
            print("SUCCESS: Timer is ticking down.")

        # Capture the final required screenshot showing the working app
        page.screenshot(path="screenshot.png")

        browser.close()

if __name__ == "__main__":
    run()
