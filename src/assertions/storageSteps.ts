import fs from "fs";
import path from "path";
import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test"; // Import expect for assertions
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: LOCAL STORAGE
// ===================================================================================

/**
 * Asserts that a Local Storage item with the given key exists for the current page's origin.
 *
 * ```gherkin
 * Then I see local storage item {string}
 * ```
 *
 * @param key - The key of the Local Storage item expected to exist.
 *
 * @example
 * Then I see local storage item "token"
 *
 * @remarks
 * This step executes `localStorage.getItem(key)` in the browser's context.
 * It asserts that the returned value is not `null`, indicating the item exists.
 * @category Storage Assertion Steps
 */
export async function Then_I_see_local_storage_item(this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
  expect(value, `Local storage item "${key}" should exist but was not found.`).not.toBeNull();
  this.log?.(`✅ Verified local storage item "${key}" exists.`);
}
Then("I see local storage item {string}", Then_I_see_local_storage_item);

/**
 * Asserts that a Local Storage item with the given key does NOT exist for the current page's origin.
 *
 * ```gherkin
 * Then I do not see local storage item {string}
 * ```
 *
 * @param key - The key of the Local Storage item expected NOT to exist.
 *
 * @example
 * Then I do not see local storage item "oldFeatureFlag"
 *
 * @remarks
 * This step executes `localStorage.getItem(key)` in the browser's context.
 * It asserts that the returned value is strictly `null`, indicating the item does not exist.
 * @category Storage Assertion Steps
 */
export async function Then_I_do_not_see_local_storage_item(this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
  expect(
    value,
    `Expected localStorage["${key}"] to be null, but it exists with value "${value}".`
  ).toBeNull();
  this.log?.(`✅ Verified local storage item "${key}" does NOT exist.`);
}
Then("I do not see local storage item {string}", Then_I_do_not_see_local_storage_item);

/**
 * Asserts that a Local Storage item with the given key exactly equals the expected value.
 *
 * ```gherkin
 * Then I see local storage item {string} equals {string}
 * ```
 *
 * @param key - The key of the Local Storage item.
 * @param expectedValue - The exact value the item is expected to have.
 *
 * @example
 * Then I see local storage item "token" equals "abc123"
 *
 * @remarks
 * This step executes `localStorage.getItem(key)` in the browser's context.
 * It asserts strict equality between the retrieved value and `expectedValue`.
 * @category Storage Assertion Steps
 */
export async function Then_I_see_local_storage_item_equals(
  this: CustomWorld,
  key: string,
  expectedValue: string
) {
  const actualValue = await this.page.evaluate((k) => localStorage.getItem(k), key);
  expect(
    actualValue,
    `Expected localStorage["${key}"] to be "${expectedValue}", but got "${actualValue}".`
  ).toBe(expectedValue);
  this.log?.(`✅ Verified local storage item "${key}" equals "${expectedValue}".`);
}
Then("I see local storage item {string} equals {string}", Then_I_see_local_storage_item_equals);

/**
 * Asserts that a Local Storage item with the given key contains the expected substring.
 *
 * ```gherkin
 * Then I see local storage item {string} contains {string}
 * ```
 *
 * @param key - The key of the Local Storage item.
 * @param part - The substring expected to be contained within the item's value.
 *
 * @example
 * Then I see local storage item "userSession" contains "loggedIn"
 *
 * @remarks
 * This step executes `localStorage.getItem(key)` in the browser's context.
 * It asserts that the retrieved value (if not null) includes the `part` substring.
 * @category Storage Assertion Steps
 */
export async function Then_I_see_local_storage_item_contains(
  this: CustomWorld,
  key: string,
  part: string
) {
  const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
  expect(
    value,
    `Local storage item "${key}" not found or is null. Expected to contain "${part}".`
  ).not.toBeNull();
  expect(value, `localStorage["${key}"] ("${value}") does not contain "${part}".`).toContain(part);
  this.log?.(`✅ Verified local storage item "${key}" contains "${part}".`);
}
Then("I see local storage item {string} contains {string}", Then_I_see_local_storage_item_contains);

// ===================================================================================
// ASSERTIONS: SESSION STORAGE
// ===================================================================================

/**
 * Asserts that a Session Storage item with the given key exists for the current page's origin.
 *
 * ```gherkin
 * Then I see session storage item {string}
 * ```
 *
 * @param key - The key of the Session Storage item expected to exist.
 *
 * @example
 * Then I see session storage item "sessionId"
 *
 * @remarks
 * This step executes `sessionStorage.getItem(key)` in the browser's context.
 * It asserts that the returned value is not `null`, indicating the item exists.
 * @category Storage Assertion Steps
 */
export async function Then_I_see_session_storage_item(this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  expect(value, `Session storage item "${key}" should exist but was not found.`).not.toBeNull();
  this.log?.(`✅ Verified session storage item "${key}" exists.`);
}
Then("I see session storage item {string}", Then_I_see_session_storage_item);

/**
 * Asserts that a Session Storage item with the given key does NOT exist for the current page's origin.
 *
 * ```gherkin
 * Then I do not see session storage item {string}
 * ```
 *
 * @param key - The key of the Session Storage item expected NOT to exist.
 *
 * @example
 * Then I do not see session storage item "tempData"
 *
 * @remarks
 * This step executes `sessionStorage.getItem(key)` in the browser's context.
 * It asserts that the returned value is strictly `null`, indicating the item does not exist.
 * @category Storage Assertion Steps
 */
export async function Then_I_do_not_see_session_storage_item(this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  expect(
    value,
    `Expected sessionStorage["${key}"] to be null, but it exists with value "${value}".`
  ).toBeNull();
  this.log?.(`✅ Verified session storage item "${key}" does NOT exist.`);
}
Then("I do not see session storage item {string}", Then_I_do_not_see_session_storage_item);

/**
 * Asserts that a Session Storage item with the given key exactly equals the expected value.
 *
 * ```gherkin
 * Then I see session storage item {string} equals {string}
 * ```
 *
 * @param key - The key of the Session Storage item.
 * @param expectedValue - The exact value the item is expected to have.
 *
 * @example
 * Then I see session storage item "sessionId" equals "xyz789"
 *
 * @remarks
 * This step executes `sessionStorage.getItem(key)` in the browser's context.
 * It asserts strict equality between the retrieved value and `expectedValue`.
 * @category Storage Assertion Steps
 */
export async function Then_I_see_session_storage_item_equals(
  this: CustomWorld,
  key: string,
  expectedValue: string
) {
  const actualValue = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  expect(
    actualValue,
    `Expected sessionStorage["${key}"] to be "${expectedValue}", but got "${actualValue}".`
  ).toBe(expectedValue);
  this.log?.(`✅ Verified session storage item "${key}" equals "${expectedValue}".`);
}
Then("I see session storage item {string} equals {string}", Then_I_see_session_storage_item_equals);

/**
 * Asserts that a Session Storage item with the given key contains the expected substring.
 *
 * ```gherkin
 * Then I see session storage item {string} contains {string}
 * ```
 *
 * @param key - The key of the Session Storage item.
 * @param part - The substring expected to be contained within the item's value.
 *
 * @example
 * Then I see session storage item "userState" contains "authenticated"
 *
 * @remarks
 * This step executes `sessionStorage.getItem(key)` in the browser's context.
 * It asserts that the retrieved value (if not null) includes the `part` substring.
 * @category Storage Assertion Steps
 */
export async function Then_I_see_session_storage_item_contains(
  this: CustomWorld,
  key: string,
  part: string
) {
  const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  expect(
    value,
    `Session storage item "${key}" not found or is null. Expected to contain "${part}".`
  ).not.toBeNull();
  expect(value, `sessionStorage["${key}"] ("${value}") does not contain "${part}".`).toContain(
    part
  );
  this.log?.(`✅ Verified session storage item "${key}" contains "${part}".`);
}
Then(
  "I see session storage item {string} contains {string}",
  Then_I_see_session_storage_item_contains
);
