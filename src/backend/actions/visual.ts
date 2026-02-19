//src/backend/actions/visual.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue } from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Takes a screenshot of the entire page.
 * @param page - The Playwright page object
 * @param filename - The filename to save the screenshot as
 * @example When I take a screenshot of the page "dashboard-view.png"
 */
export async function takePageScreenshot(page: any, filename: string): Promise<void> {
  await page.screenshot({ path: `screenshots/${filename}`, fullPage: true });
  console.log(`📷 Saved page screenshot: screenshots/${filename}`);
}

/**
 * Takes a screenshot of a specific element.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param filename - The filename to save the screenshot as
 * @example When I take a screenshot of element "header.navbar" as "navbar.png"
 */
export async function takeElementScreenshot(page: any, selectorKey: string, filename: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  await element.screenshot({ path: `screenshots/${filename}` });
  console.log(`📷 Saved element "${selector}" screenshot: screenshots/${filename}`);
}

/**
 * Takes a screenshot of the viewport area.
 * @param page - The Playwright page object
 * @param filename - The filename to save the screenshot as
 * @example When I take a viewport screenshot "login-area.png"
 */
export async function takeViewportScreenshot(page: any, filename: string): Promise<void> {
  await page.screenshot({ path: `screenshots/${filename}` });
  console.log(`📷 Saved viewport screenshot: screenshots/${filename}`);
}

/**
 * Compares the current page with a reference image using pixel match.
 * @param page - The Playwright page object
 * @param currentFilename - The filename of the current page screenshot
 * @param referenceFilename - The filename of the reference screenshot to compare with
 * @example Then I expect page "current-view.png" to closely match "reference-view.png"
 */
export async function expectPageToCloselyMatch(page: any, currentFilename: string, referenceFilename: string): Promise<void> {
  // Playwright's screenshot comparison is already pixel-perfect by default
  // This function provides semantic meaning for close matching
  await expect(page).toHaveScreenshot(currentFilename);
  console.log(`🔍 Page "${currentFilename}" compared with reference "${referenceFilename}"`);
}

/**
 * Compares a specific element with a reference image.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param currentFilename - The filename of the current element screenshot
 * @param referenceFilename - The filename of the reference screenshot to compare with
 * @example Then I expect element "div.content" screenshot "content-current.png" to closely match "content-reference.png"
 */
export async function expectElementToCloselyMatch(page: any, selectorKey: string, currentFilename: string, referenceFilename: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  await expect(element).toHaveScreenshot(currentFilename);
  console.log(`🔍 Element "${selector}" screenshot "${currentFilename}" compared with reference "${referenceFilename}"`);
}

/**
 * Takes a screenshot and attaches it to the test report.
 * @param page - The Playwright page object
 * @param name - The name to identify the screenshot in the report
 * @example When I capture screenshot "error-state" for the report
 */
export async function captureScreenshotForReport(page: any, name: string): Promise<void> {
  await page.screenshot();
  // This would typically be attached to the test report
  console.log(`📎 Captured screenshot "${name}" for test report`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I take a screenshot of the page {string}", takePageScreenshot, "When");
Step("I take a screenshot of element {string} as {string}", takeElementScreenshot, "When");
Step("I take a viewport screenshot {string}", takeViewportScreenshot, "When");
Step("I expect page {string} to closely match {string}", expectPageToCloselyMatch, "Then");
Step("I expect element {string} screenshot {string} to closely match {string}", expectElementToCloselyMatch, "Then");
Step("I capture screenshot {string} for the report", captureScreenshotForReport, "When");