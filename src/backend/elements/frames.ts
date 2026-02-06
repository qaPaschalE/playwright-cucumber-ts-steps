//src/backend/elements/frames.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue, } from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Clicks an element located inside a specific `<iframe>`.
 * Supports fixtures for reusable selectors.
 * @example When I click "selectors.paymentSubmitButton" inside frame "selectors.paymentIframe"
 */
export async function clickInsideFrame(
  page: any,
  elementSelectorKey: string,
  frameSelectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");

  const elementSelector = getFixtureValue(selectors, elementSelectorKey);
  const frameSelector = getFixtureValue(selectors, frameSelectorKey);

  const frame = page.frameLocator(frameSelector);
  await frame.locator(elementSelector).click();
  console.log(`🖼️ Clicked "${elementSelector}" inside frame "${frameSelector}".`);
}

/**
 * Fills an input field located inside a specific `<iframe>`.
 * Supports fixtures for reusable selectors and values.
 * @example When I fill "selectors.cardNumberInput" inside frame "selectors.checkoutFrame" with "values.cardNumber"
 */
export async function fillInsideFrame(
  page: any,
  elementSelectorKey: string,
  frameSelectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const elementSelector = getFixtureValue(selectors, elementSelectorKey);
  const frameSelector = getFixtureValue(selectors, frameSelectorKey);
  const value = getFixtureValue(values, valueKey);

  const frame = page.frameLocator(frameSelector);
  await frame.locator(elementSelector).fill(value);
  console.log(`🖼️ Filled "${elementSelector}" inside frame "${frameSelector}" with value.`);
}

/**
 * Asserts that an element inside a specific `<iframe>` contains the expected text.
 * Supports fixtures for reusable selectors and text.
 * Uses Playwright's web-first assertions for automatic retries.
 * @example Then I expect "selectors.successMessage" inside frame "selectors.uploadFrame" to have text "texts.uploadComplete"
 */
export async function expectTextInsideFrame(
  page: any,
  elementSelectorKey: string,
  frameSelectorKey: string,
  textKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const texts = loadFixture("texts.json");

  const elementSelector = getFixtureValue(selectors, elementSelectorKey);
  const frameSelector = getFixtureValue(selectors, frameSelectorKey);
  const text = getFixtureValue(texts, textKey);

  const frame = page.frameLocator(frameSelector);
  const locator = frame.locator(elementSelector);
  await expect(locator).toContainText(text);
  console.log(`✅ Frame "${frameSelector}" element "${elementSelector}" contains "${text}".`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I click {string} inside frame {string}", clickInsideFrame, "When");
Step("I fill {string} inside frame {string} with {string}", fillInsideFrame, "When");
Step("I expect {string} inside frame {string} to have text {string}", expectTextInsideFrame, "Then");