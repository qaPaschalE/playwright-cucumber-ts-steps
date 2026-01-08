import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

/**
 * Helper: Tries to perform a touch tap.
 * If the current browser context does not support touch events (e.g., Desktop Chrome),
 * it gracefully falls back to a standard mouse click.
 *
 * @param target - The Playwright Locator to interact with.
 * @returns "tapped" or "clicked (fallback)" based on what occurred.
 */
async function safeTap(target: any) {
  try {
    // Try native touch tap
    await target.tap();
    return "tapped";
  } catch (error: any) {
    if (error.message.includes("does not support tap")) {
      // Fallback for Desktop Contexts
      await target.click();
      return "clicked (fallback)";
    }
    throw error;
  }
}

// ==================================================
// 1. TOUCH INTERACTIONS
// ==================================================

/**
 * Taps on the currently stored (active) element.
 * Uses a "Hybrid Tap" strategy: tries to tap, falls back to click if touch is unsupported.
 *
 * ```gherkin
 * When I tap
 * ```
 */
export const TapStoredElement = Step("I tap", async (page) => {
  const element = getActiveElement(page);
  const action = await safeTap(element);
  console.log(`👆 ${action === "tapped" ? "Tapped" : "Clicked"} stored element`);
});

/**
 * Finds an element by selector and taps it.
 * Uses a "Hybrid Tap" strategy.
 *
 * ```gherkin
 * When I tap element "#menu-toggle"
 * ```
 *
 * @param selector - The CSS selector of the element.
 */
export const TapElementBySelector = Step("I tap element {string}", async (page, selector) => {
  const element = page.locator(selector);
  const action = await safeTap(element);
  console.log(`👆 ${action === "tapped" ? "Tapped" : "Clicked"} element "${selector}"`);
});

/**
 * Taps at specific X, Y coordinates on the screen.
 * Implemented via `mouse.click` which works reliably across both desktop and mobile viewports.
 *
 * ```gherkin
 * When I tap coordinates x:50 y:200
 * ```
 *
 * @param x - The X-coordinate.
 * @param y - The Y-coordinate.
 */
export const TapCoordinates = Step("I tap coordinates x:{int} y:{int}", async (page, x, y) => {
  // page.mouse.click works for both desktop and mobile viewports
  await page.mouse.click(x, y);
  console.log(`👆 Tapped at (${x}, ${y})`);
});

// ==================================================
// 2. VIEWPORT & EMULATION
// ==================================================

/**
 * Resizes the browser window/viewport to specific dimensions.
 *
 * ```gherkin
 * When I resize window to width 375 and height 812
 * ```
 *
 * @param width - The width in pixels.
 * @param height - The height in pixels.
 */
export const ResizeWindow = Step(
  "I resize window to width {int} and height {int}",
  async (page, width, height) => {
    await page.setViewportSize({ width, height });
    console.log(`📱 Resized viewport to ${width}x${height}`);
  }
);

/**
 * Resizes the viewport to match a specific device preset.
 *
 * ```gherkin
 * When I simulate device "iPhone 12"
 * ```
 *
 * @param deviceName - The name of the device. Supported: "iPhone 12", "iPhone SE", "iPad", "Pixel 5", "Samsung Galaxy S8", "Desktop".
 */
export const SimulateDevice = Step("I simulate device {string}", async (page, deviceName) => {
  const devices: Record<string, { width: number; height: number }> = {
    "iPhone 12": { width: 390, height: 844 },
    "iPhone SE": { width: 375, height: 667 },
    iPad: { width: 768, height: 1024 },
    "Pixel 5": { width: 393, height: 851 },
    "Samsung Galaxy S8": { width: 360, height: 740 },
    Desktop: { width: 1920, height: 1080 },
  };

  const size = devices[deviceName];
  if (!size) {
    throw new Error(`❌ Unknown device preset: "${deviceName}".`);
  }

  await page.setViewportSize(size);
  console.log(`📱 Simulated device "${deviceName}" (${size.width}x${size.height})`);
});

// ==================================================
// 3. GEOLOCATION & PERMISSIONS
// ==================================================

/**
 * Sets the geolocation coordinates for the browser context and auto-grants permission.
 *
 * ```gherkin
 * When I set geolocation to lat: 37.7749 long: -122.4194
 * ```
 *
 * @param lat - The latitude (float).
 * @param long - The longitude (float).
 */
export const SetGeolocation = Step(
  "I set geolocation to lat: {float} long: {float}",
  async (page, lat, long) => {
    await page.context().setGeolocation({ latitude: lat, longitude: long });
    await page.context().grantPermissions(["geolocation"]);
    console.log(`🌍 Geolocation set to ${lat}, ${long}`);
  }
);

/**
 * Grants a specific browser permission to the current context.
 *
 * ```gherkin
 * When I grant permission "notifications"
 * ```
 *
 * @param permission - The permission name (e.g., "geolocation", "notifications", "camera").
 */
export const GrantPermission = Step("I grant permission {string}", async (page, permission) => {
  await page.context().grantPermissions([permission]);
  console.log(`🛡️ Granted permission: "${permission}"`);
});
