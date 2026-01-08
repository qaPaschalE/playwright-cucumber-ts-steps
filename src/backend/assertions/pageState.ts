import { expect } from "@playwright/test";
import { Step } from "../../core/registry";

/**
 * @module BrowserAssertions
 */

/**
 * Asserts that the current browser URL contains a specific substring.
 * Useful for verifying redirection to a general area (e.g., a dashboard).
 * * @example
 * ```gherkin
 * Then I expect the url to contain "dashboard"
 * ```
 * * @param part - The substring to search for in the URL.
 */
export const ExpectUrlToContain = Step(
  "I expect the url to contain {string}",
  async (page, part) => {
    await expect(page).toHaveURL(new RegExp(part));
    console.log(`✅ URL contains "${part}"`);
  }
);

/**
 * Asserts that the current browser URL exactly matches the provided string.
 * * @example
 * ```gherkin
 * Then I expect the url to be "[https://example.com/login](https://example.com/login)"
 * ```
 * * @param url - The expected full URL.
 */
export const ExpectUrlToBe = Step("I expect the url to be {string}", async (page, url) => {
  await expect(page).toHaveURL(url);
  console.log(`✅ URL is "${url}"`);
});

/**
 * Asserts that the page's `<title>` tag contains a specific substring.
 * * @example
 * ```gherkin
 * Then I expect the title to contain "Welcome"
 * ```
 * * @param part - The substring expected within the page title.
 */
export const ExpectTitleToContain = Step(
  "I expect the title to contain {string}",
  async (page, part) => {
    await expect(page).toHaveTitle(new RegExp(part));
    console.log(`✅ Title contains "${part}"`);
  }
);

/**
 * Asserts that the page's `<title>` tag exactly matches the provided string.
 * * @example
 * ```gherkin
 * Then I expect the title to be "My Application - Home"
 * ```
 * * @param title - The expected full page title.
 */
export const ExpectTitleToBe = Step("I expect the title to be {string}", async (page, title) => {
  await expect(page).toHaveTitle(title);
  console.log(`✅ Title is "${title}"`);
});
