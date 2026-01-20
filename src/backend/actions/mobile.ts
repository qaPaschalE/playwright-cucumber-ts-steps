import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

// ==================================================
// HELPER FUNCTIONS
// ==================================================

/**
 * Helper: Tries to perform a touch tap.
 * If the current browser context does not support touch events (e.g., Desktop Chrome),
 * it gracefully falls back to a standard mouse click.
 * @param target - The Playwright Locator to interact with.
 * @returns "tapped" or "clicked (fallback)" based on what occurred.
 */
async function safeTap(target: any): Promise<string> {
  try {
    await target.tap();
    return "tapped";
  } catch (error: any) {
    if (error.message.includes("does not support tap")) {
      await target.click();
      return "clicked (fallback)";
    }
    throw error;
  }
}

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Taps on the currently stored (active) element.
 * Uses a "Hybrid Tap" strategy: tries to tap, falls back to click if touch is unsupported.
 * @example
 * When I tap
 */
export async function tapStoredElement(page: any): Promise<void> {
  const element = getActiveElement(page);
  const action = await safeTap(element);
  console.log(`👆 ${action === "tapped" ? "Tapped" : "Clicked"} stored element`);
}

/**
 * Finds an element by selector and taps it.
 * @example
 * When I tap element "#menu-toggle"
 * @param selector - The CSS selector of the element.
 */
export async function tapElementBySelector(page: any, selector: string): Promise<void> {
  const element = page.locator(selector);
  const action = await safeTap(element);
  console.log(`👆 ${action === "tapped" ? "Tapped" : "Clicked"} element "${selector}"`);
}

/**
 * Taps at specific X, Y coordinates on the screen.
 * @example
 * When I tap coordinates x:50 y:200
 * @param x - The X-coordinate.
 * @param y - The Y-coordinate.
 */
export async function tapCoordinates(page: any, x: number, y: number): Promise<void> {
  await page.mouse.click(x, y);
  console.log(`👆 Tapped at (${x}, ${y})`);
}

/**
 * Resizes the browser window/viewport to specific dimensions.
 * @example
 * When I resize window to width 375 and height 812
 * @param width - The width in pixels.
 * @param height - The height in pixels.
 */
export async function resizeWindow(page: any, width: number, height: number): Promise<void> {
  await page.setViewportSize({ width, height });
  console.log(`📱 Resized viewport to ${width}x${height}`);
}

/**
 * Resizes the viewport to match a specific device preset.
 * @example
 * When I simulate device "iPhone 12"
 * @param deviceName - The name of the device. Supported: "iPhone 12", "iPhone SE", "iPad", "Pixel 5", "Samsung Galaxy S8", "Desktop".
 */
export async function simulateDevice(page: any, deviceName: string): Promise<void> {
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
}

/**
 * Sets the geolocation coordinates for the browser context and auto-grants permission.
 * @example
 * When I set geolocation to lat: 37.7749 long: -122.4194
 * @param lat - The latitude (float).
 * @param long - The longitude (float).
 */
export async function setGeolocation(page: any, lat: number, long: number): Promise<void> {
  await page.context().setGeolocation({ latitude: lat, longitude: long });
  await page.context().grantPermissions(["geolocation"]);
  console.log(`🌍 Geolocation set to ${lat}, ${long}`);
}

/**
 * Grants a specific browser permission to the current context.
 * @example
 * When I grant permission "notifications"
 * @param permission - The permission name (e.g., "geolocation", "notifications", "camera").
 */
export async function grantPermission(page: any, permission: string): Promise<void> {
  await page.context().grantPermissions([permission]);
  console.log(`🛡️ Granted permission: "${permission}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I tap", tapStoredElement);
Step("I tap element {string}", tapElementBySelector);
Step("I tap coordinates x:{int} y:{int}", tapCoordinates);
Step("I resize window to width {int} and height {int}", resizeWindow);
Step("I simulate device {string}", simulateDevice);
Step("I set geolocation to lat: {float} long: {float}", setGeolocation);
Step("I grant permission {string}", grantPermission);
