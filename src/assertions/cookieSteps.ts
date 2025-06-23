import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test"; // Import expect for more robust assertions where applicable
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: COOKIES
// ===================================================================================

/**
 * Asserts that a cookie with the given name exists in the browser context.
 *
 * ```gherkin
 * Then I see cookie {string}
 * ```
 *
 * @param cookieName - The name of the cookie expected to exist.
 *
 * @example
 * Then I see cookie "session_id"
 *
 * @remarks
 * This step retrieves all cookies from the current Playwright browser context
 * and checks if a cookie with `cookieName` is present.
 * @category Cookie Assertion Steps
 */
export async function Then_I_see_cookie(this: CustomWorld, cookieName: string) {
  const cookies = await this.context.cookies();
  const cookie = cookies.find((c) => c.name === cookieName);

  // Using Playwright's expect for better assertion messages and retries (if configured)
  expect(cookie, `Cookie "${cookieName}" should exist but was not found.`).toBeDefined();
  this.log?.(`✅ Verified cookie "${cookieName}" exists.`);
}
Then("I see cookie {string}", Then_I_see_cookie);

/**
 * Asserts that a cookie with the given name does NOT exist in the browser context.
 *
 * ```gherkin
 * Then I do not see cookie {string}
 * ```
 *
 * @param cookieName - The name of the cookie expected NOT to exist.
 *
 * @example
 * Then I do not see cookie "expired_token"
 *
 * @remarks
 * This step retrieves all cookies from the current Playwright browser context
 * and asserts that no cookie with `cookieName` is present.
 * @category Cookie Assertion Steps
 */
export async function Then_I_do_not_see_cookie(this: CustomWorld, cookieName: string) {
  const cookies = await this.context.cookies();
  const cookie = cookies.find((c) => c.name === cookieName);

  // Using Playwright's expect for better assertion messages and retries
  expect(cookie, `Cookie "${cookieName}" should NOT exist but was found.`).toBeUndefined();
  this.log?.(`✅ Verified cookie "${cookieName}" does not exist.`);
}
Then("I do not see cookie {string}", Then_I_do_not_see_cookie);

/**
 * Asserts that a cookie with the given name exists and has an exact expected value.
 *
 * ```gherkin
 * Then I see cookie {string} has value {string}
 * ```
 *
 * @param cookieName - The name of the cookie to check.
 * @param expectedValue - The exact value the cookie is expected to have.
 *
 * @example
 * Then I see cookie "sessionId" has value "abc123"
 *
 * @remarks
 * This step finds the cookie by name and then asserts that its `value` property
 * strictly matches `expectedValue`.
 * @category Cookie Assertion Steps
 */
export async function Then_I_see_cookie_has_value(
  this: CustomWorld,
  cookieName: string,
  expectedValue: string
) {
  const cookies = await this.context.cookies();
  const cookie = cookies.find((c) => c.name === cookieName);

  expect(cookie, `Cookie "${cookieName}" not found.`).toBeDefined();
  expect(
    cookie?.value,
    `Expected cookie "${cookieName}" to have value "${expectedValue}", but got "${cookie?.value}".`
  ).toBe(expectedValue);
  this.log?.(`✅ Verified cookie "${cookieName}" has value "${expectedValue}".`);
}
Then("I see cookie {string} has value {string}", Then_I_see_cookie_has_value);

/**
 * Asserts that a cookie with the given name exists and its value contains a specific substring.
 *
 * ```gherkin
 * Then I see cookie {string} contains value {string}
 * ```
 *
 * @param cookieName - The name of the cookie to check.
 * @param valuePart - The substring expected to be present within the cookie's value.
 *
 * @example
 * Then I see cookie "token" contains value "auth_type"
 *
 * @remarks
 * This step finds the cookie by name and then asserts that its `value` property
 * includes the `valuePart` string. Useful for tokens or complex cookie values.
 * @category Cookie Assertion Steps
 */
export async function Then_I_see_cookie_contains_value(
  this: CustomWorld,
  cookieName: string,
  valuePart: string
) {
  const cookies = await this.context.cookies();
  const cookie = cookies.find((c) => c.name === cookieName);

  expect(cookie, `Cookie "${cookieName}" not found.`).toBeDefined();
  expect(
    cookie?.value,
    `Expected cookie "${cookieName}" to contain "${valuePart}", but got "${cookie?.value}".`
  ).toContain(valuePart);
  this.log?.(`✅ Verified cookie "${cookieName}" contains value "${valuePart}".`);
}
Then("I see cookie {string} contains value {string}", Then_I_see_cookie_contains_value);
