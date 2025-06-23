import { Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: URL
// ===================================================================================

/**
 * Asserts that the current page's full URL exactly matches the expected string.
 *
 * ```gherkin
 * Then I see URL {string}
 * ```
 *
 * @param expectedUrl - The exact URL string expected.
 *
 * @example
 * Then I see URL "https://example.com/dashboard"
 *
 * @remarks
 * This step retrieves the current URL from `this.page.url()` and performs a strict equality check.
 * @category URL Assertion Steps
 */
export async function Then_I_see_URL(this: CustomWorld, expectedUrl: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toBe(expectedUrl);
  this.log?.(`✅ Verified URL is exactly: "${expectedUrl}".`);
}
Then("I see URL {string}", Then_I_see_URL);

/**
 * Asserts that the current page's full URL does NOT match the given string.
 *
 * ```gherkin
 * Then I do not see URL {string}
 * ```
 *
 * @param notExpectedUrl - The URL string that is NOT expected.
 *
 * @example
 * Then I do not see URL "https://example.com/login"
 *
 * @remarks
 * This step retrieves the current URL from `this.page.url()` and performs a strict inequality check.
 * @category URL Assertion Steps
 */
export async function Then_I_do_not_see_URL(this: CustomWorld, notExpectedUrl: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).not.toBe(notExpectedUrl);
  this.log?.(`✅ Verified URL is NOT: "${notExpectedUrl}".`);
}
Then("I do not see URL {string}", Then_I_do_not_see_URL);

/**
 * Asserts that the current page's full URL contains the expected substring.
 *
 * ```gherkin
 * Then I see URL contains {string}
 * ```
 *
 * @param expectedPart - The substring expected to be present in the URL.
 *
 * @example
 * Then I see URL contains "/dashboard"
 *
 * @remarks
 * This step retrieves the current URL from `this.page.url()` and checks if it includes the `expectedPart`.
 * @category URL Assertion Steps
 */
export async function Then_I_see_URL_contains(this: CustomWorld, expectedPart: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(expectedPart);
  this.log?.(`✅ Verified URL contains: "${expectedPart}".`);
}
Then("I see URL contains {string}", Then_I_see_URL_contains);

/**
 * Asserts that the current page's full URL does NOT contain the given substring.
 *
 * ```gherkin
 * Then I do not see URL contains {string}
 * ```
 *
 * @param notExpectedPart - The substring that is NOT expected to be present in the URL.
 *
 * @example
 * Then I do not see URL contains "/login"
 *
 * @remarks
 * This step retrieves the current URL from `this.page.url()` and asserts that it does not include the `notExpectedPart`.
 * @category URL Assertion Steps
 */
export async function Then_I_do_not_see_URL_contains(this: CustomWorld, notExpectedPart: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).not.toContain(notExpectedPart);
  this.log?.(`✅ Verified URL does NOT contain: "${notExpectedPart}".`);
}
Then("I do not see URL contains {string}", Then_I_do_not_see_URL_contains);

// ===================================================================================
// ASSERTIONS: LOCATION PARTS (HREF, PATHNAME, HASH, SEARCH)
// ===================================================================================

/**
 * Asserts that the current `window.location.href` (full URL) matches the expected string.
 * This is an alias for "Then I see URL {string}".
 *
 * ```gherkin
 * Then I see location {string}
 * ```
 *
 * @param expectedHref - The exact `window.location.href` string expected.
 *
 * @example
 * Then I see location "https://example.com/dashboard"
 *
 * @remarks
 * This step executes `window.location.href` in the browser context and compares it strictly.
 * It's functionally identical to {@link Then_I_see_URL | "Then I see URL {string}"}.
 * @category Location Assertion Steps
 */
export async function Then_I_see_location(this: CustomWorld, expectedHref: string) {
  const locationHref = await this.page.evaluate(() => window.location.href);
  expect(locationHref).toBe(expectedHref);
  this.log?.(`✅ Verified location href is exactly: "${expectedHref}".`);
}
Then("I see location {string}", Then_I_see_location);

/**
 * Asserts that the current `window.location.pathname` (path part of URL) matches the expected string.
 *
 * ```gherkin
 * Then I see pathname {string}
 * ```
 *
 * @param expectedPathname - The exact pathname string expected (e.g., "/dashboard").
 *
 * @example
 * Then I see pathname "/dashboard"
 *
 * @remarks
 * This step executes `window.location.pathname` in the browser context and compares it strictly.
 * @category Location Assertion Steps
 */
export async function Then_I_see_pathname(this: CustomWorld, expectedPathname: string) {
  const pathname = await this.page.evaluate(() => window.location.pathname);
  expect(pathname).toBe(expectedPathname);
  this.log?.(`✅ Verified pathname is exactly: "${expectedPathname}".`);
}
Then("I see pathname {string}", Then_I_see_pathname);

/**
 * Asserts that the current `window.location.pathname` contains the expected substring.
 *
 * ```gherkin
 * Then I see pathname contains {string}
 * ```
 *
 * @param expectedPart - The substring expected to be present in the pathname.
 *
 * @example
 * Then I see pathname contains "/settings/"
 *
 * @remarks
 * This step executes `window.location.pathname` in the browser context and checks for substring presence.
 * @category Location Assertion Steps
 */
export async function Then_I_see_pathname_contains(this: CustomWorld, expectedPart: string) {
  const pathname = await this.page.evaluate(() => window.location.pathname);
  expect(pathname).toContain(expectedPart);
  this.log?.(`✅ Verified pathname contains: "${expectedPart}".`);
}
Then("I see pathname contains {string}", Then_I_see_pathname_contains);

/**
 * Asserts that the current `window.location.hash` (fragment identifier) matches the expected string.
 *
 * ```gherkin
 * Then I see hash {string}
 * ```
 *
 * @param expectedHash - The exact hash string expected (e.g., "#section-1").
 *
 * @example
 * Then I see hash "#section"
 *
 * @remarks
 * This step executes `window.location.hash` in the browser context and compares it strictly.
 * @category Location Assertion Steps
 */
export async function Then_I_see_hash(this: CustomWorld, expectedHash: string) {
  const hash = await this.page.evaluate(() => window.location.hash);
  expect(hash).toBe(expectedHash);
  this.log?.(`✅ Verified hash is exactly: "${expectedHash}".`);
}
Then("I see hash {string}", Then_I_see_hash);

/**
 * Asserts that the current `window.location.hash` contains the expected substring.
 *
 * ```gherkin
 * Then I see hash contains {string}
 * ```
 *
 * @param expectedPart - The substring expected to be present in the hash.
 *
 * @example
 * Then I see hash contains "details"
 *
 * @remarks
 * This step executes `window.location.hash` in the browser context and checks for substring presence.
 * @category Location Assertion Steps
 */
export async function Then_I_see_hash_contains(this: CustomWorld, expectedPart: string) {
  const hash = await this.page.evaluate(() => window.location.hash);
  expect(hash).toContain(expectedPart);
  this.log?.(`✅ Verified hash contains: "${expectedPart}".`);
}
Then("I see hash contains {string}", Then_I_see_hash_contains);

/**
 * Asserts that the current `window.location.search` (query string) matches the expected string.
 *
 * ```gherkin
 * Then I see search {string}
 * ```
 *
 * @param expectedSearch - The exact search string expected (e.g., "?q=test&page=1").
 *
 * @example
 * Then I see search "?q=test"
 *
 * @remarks
 * This step executes `window.location.search` in the browser context and compares it strictly.
 * @category Location Assertion Steps
 */
export async function Then_I_see_search(this: CustomWorld, expectedSearch: string) {
  const search = await this.page.evaluate(() => window.location.search);
  expect(search).toBe(expectedSearch);
  this.log?.(`✅ Verified search is exactly: "${expectedSearch}".`);
}
Then("I see search {string}", Then_I_see_search);

/**
 * Asserts that the current `window.location.search` contains the expected substring.
 *
 * ```gherkin
 * Then I see search contains {string}
 * ```
 *
 * @param expectedPart - The substring expected to be present in the search query.
 *
 * @example
 * Then I see search contains "q=test"
 *
 * @remarks
 * This step executes `window.location.search` in the browser context and checks for substring presence.
 * @category Location Assertion Steps
 */
export async function Then_I_see_search_contains(this: CustomWorld, expectedPart: string) {
  const search = await this.page.evaluate(() => window.location.search);
  expect(search).toContain(expectedPart);
  this.log?.(`✅ Verified search contains: "${expectedPart}".`);
}
Then("I see search contains {string}", Then_I_see_search_contains);

/**
 * Asserts that multiple parts of the current `window.location` object match expected values from a data table.
 *
 * ```gherkin
 * Then I see location
 * | key      | value                |
 * | pathname | /dashboard           |
 * | hash     | #section             |
 * ```
 *
 * @param table - A Cucumber DataTable with `key` and `value` columns, where `key` is a `window.location` property (e.g., "pathname", "hash", "origin").
 *
 * @example
 * Then I see location
 * | key        | value                |
 * | pathname   | /profile             |
 * | protocol   | https:               |
 * | hostname   | myapp.com            |
 *
 * @remarks
 * This step retrieves various `window.location` properties as an object and then iterates
 * through the data table, asserting that each specified `key` has its corresponding `value`.
 * This allows for flexible and combined assertions on the URL components.
 * @category Location Assertion Steps
 */
export async function Then_I_see_location_parts(this: CustomWorld, table: DataTable) {
  const location = await this.page.evaluate(() => ({
    href: window.location.href,
    origin: window.location.origin,
    protocol: window.location.protocol,
    host: window.location.host,
    hostname: window.location.hostname,
    port: window.location.port,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  }));

  for (const [key, expected] of table.rows()) {
    const actual = location[key as keyof typeof location];
    expect(
      actual,
      `Location part "${key}" mismatch: Expected "${expected}", but got "${actual}".`
    ).toBe(expected);
    this.log?.(`✅ Verified location part "${key}" is "${expected}".`);
  }
}
Then("I see location", Then_I_see_location_parts);
