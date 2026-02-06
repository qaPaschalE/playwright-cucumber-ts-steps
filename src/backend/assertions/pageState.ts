//src/backend/assertions/pageState.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the current browser URL contains a specific substring.
 * Supports fixtures for reusable URL parts.
 * @example Then I expect the url to contain "dashboard"
 */
export async function expectUrlToContain(page: any, partKey: string): Promise<void> {
  const urls = loadFixture("urls.json");
  const part = getFixtureValue(urls, partKey);

  await expect(page).toHaveURL(new RegExp(part));
  console.log(`✅ URL contains "${part}"`);
}

/**
 * Asserts that the current browser URL exactly matches the provided string.
 * Supports fixtures for reusable URLs.
 * @example Then I expect the url to be "app.dashboardUrl"
 */
export async function expectUrlToBe(page: any, urlKey: string): Promise<void> {
  const urls = loadFixture("urls.json");
  const url = getFixtureValue(urls, urlKey);

  await expect(page).toHaveURL(url);
  console.log(`✅ URL is "${url}"`);
}

/**
 * Asserts that the page's `<title>` tag contains a specific substring.
 * Supports fixtures for reusable title parts.
 * @example Then I expect the title to contain "Welcome"
 */
export async function expectTitleToContain(page: any, partKey: string): Promise<void> {
  const titles = loadFixture("titles.json");
  const part = getFixtureValue(titles, partKey);

  await expect(page).toHaveTitle(new RegExp(part));
  console.log(`✅ Title contains "${part}"`);
}

/**
 * Asserts that the page's `<title>` tag exactly matches the provided string.
 * Supports fixtures for reusable titles.
 * @example Then I expect the title to be "app.homeTitle"
 */
export async function expectTitleToBe(page: any, titleKey: string): Promise<void> {
  const titles = loadFixture("titles.json");
  const title = getFixtureValue(titles, titleKey);

  await expect(page).toHaveTitle(title);
  console.log(`✅ Title is "${title}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect the url to contain {string}", expectUrlToContain, "Then");
Step("I expect the url to be {string}", expectUrlToBe, "Then");
Step("I expect the title to contain {string}", expectTitleToContain, "Then");
Step("I expect the title to be {string}", expectTitleToBe, "Then");