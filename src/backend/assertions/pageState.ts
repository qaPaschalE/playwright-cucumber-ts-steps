import { expect } from "@playwright/test";
import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the current browser URL contains a specific substring.
 * Useful for verifying redirection to a general area (e.g., a dashboard).
 * @example
 * Then I expect the url to contain "dashboard"
 * @param part - The substring to search for in the URL.
 */
export async function expectUrlToContain(page: any, part: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(part));
  console.log(`✅ URL contains "${part}"`);
}

/**
 * Asserts that the current browser URL exactly matches the provided string.
 * @example
 * Then I expect the url to be "https://example.com/login"
 * @param url - The expected full URL.
 */
export async function expectUrlToBe(page: any, url: string): Promise<void> {
  await expect(page).toHaveURL(url);
  console.log(`✅ URL is "${url}"`);
}

/**
 * Asserts that the page's `<title>` tag contains a specific substring.
 * @example
 * Then I expect the title to contain "Welcome"
 * @param part - The substring expected within the page title.
 */
export async function expectTitleToContain(page: any, part: string): Promise<void> {
  await expect(page).toHaveTitle(new RegExp(part));
  console.log(`✅ Title contains "${part}"`);
}

/**
 * Asserts that the page's `<title>` tag exactly matches the provided string.
 * @example
 * Then I expect the title to be "My Application - Home"
 * @param title - The expected full page title.
 */
export async function expectTitleToBe(page: any, title: string): Promise<void> {
  await expect(page).toHaveTitle(title);
  console.log(`✅ Title is "${title}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect the url to contain {string}", expectUrlToContain);
Step("I expect the url to be {string}", expectUrlToBe);
Step("I expect the title to contain {string}", expectTitleToContain);
Step("I expect the title to be {string}", expectTitleToBe);
