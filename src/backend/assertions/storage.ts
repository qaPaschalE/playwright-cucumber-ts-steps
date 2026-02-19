//src/backend/assertions/storage.ts
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that a cookie exists and has the expected value.
 * Supports fixtures for reusable cookie names and values.
 * @example Then I see cookie "session_id" has value "abc123"
 */
export async function expectCookieHasValue(
  page: any,
  cookieNameKey: string,
  valueKey: string
): Promise<void> {
  const cookies = loadFixture("cookies.json");
  const values = loadFixture("values.json");

  const cookieName = getFixtureValue(cookies, cookieNameKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const cookie = await page.context().cookies([page.url()]);
  const foundCookie = cookie.find((c: any) => c.name === cookieName);

  if (!foundCookie) {
    throw new Error(`Cookie "${cookieName}" does not exist`);
  }

  if (foundCookie.value !== expectedValue) {
    throw new Error(`Cookie "${cookieName}" has value "${foundCookie.value}", expected "${expectedValue}"`);
  }

  console.log(`✅ Cookie "${cookieName}" has value "${expectedValue}"`);
}

/**
 * Asserts that a cookie exists and contains the expected substring.
 * Supports fixtures for reusable cookie names and values.
 * @example Then I see cookie "session_id" contains value "abc"
 */
export async function expectCookieContainsValue(
  page: any,
  cookieNameKey: string,
  valueKey: string
): Promise<void> {
  const cookies = loadFixture("cookies.json");
  const values = loadFixture("values.json");

  const cookieName = getFixtureValue(cookies, cookieNameKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const cookie = await page.context().cookies([page.url()]);
  const foundCookie = cookie.find((c: any) => c.name === cookieName);

  if (!foundCookie) {
    throw new Error(`Cookie "${cookieName}" does not exist`);
  }

  if (!foundCookie.value.includes(expectedValue)) {
    throw new Error(`Cookie "${cookieName}" value "${foundCookie.value}" does not contain "${expectedValue}"`);
  }

  console.log(`✅ Cookie "${cookieName}" contains value "${expectedValue}"`);
}

/**
 * Asserts that a cookie does not exist.
 * Supports fixtures for reusable cookie names.
 * @example Then I do not see cookie "old_session"
 */
export async function expectCookieDoesNotExist(
  page: any,
  cookieNameKey: string
): Promise<void> {
  const cookies = loadFixture("cookies.json");
  const cookieName = getFixtureValue(cookies, cookieNameKey);

  const cookie = await page.context().cookies([page.url()]);
  const foundCookie = cookie.find((c: any) => c.name === cookieName);

  if (foundCookie) {
    throw new Error(`Cookie "${cookieName}" exists but was expected not to`);
  }

  console.log(`✅ Cookie "${cookieName}" does not exist`);
}

/**
 * Asserts that a local storage item exists and has the expected value.
 * Supports fixtures for reusable storage keys and values.
 * @example Then I see local storage item "user_prefs" equals "dark_theme"
 */
export async function expectLocalStorageItemEquals(
  page: any,
  keyKey: string,
  valueKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const values = loadFixture("values.json");

  const storageKey = getFixtureValue(keys, keyKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const actualValue = await page.evaluate((key: string) => localStorage.getItem(key), storageKey);

  if (actualValue === null) {
    throw new Error(`Local storage item "${storageKey}" does not exist`);
  }

  if (actualValue !== expectedValue) {
    throw new Error(`Local storage item "${storageKey}" has value "${actualValue}", expected "${expectedValue}"`);
  }

  console.log(`✅ Local storage item "${storageKey}" equals "${expectedValue}"`);
}

/**
 * Asserts that a local storage item exists and contains the expected substring.
 * Supports fixtures for reusable storage keys and values.
 * @example Then I see local storage item "user_prefs" contains "theme"
 */
export async function expectLocalStorageItemContains(
  page: any,
  keyKey: string,
  valueKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const values = loadFixture("values.json");

  const storageKey = getFixtureValue(keys, keyKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const actualValue = await page.evaluate((key: string) => localStorage.getItem(key), storageKey);

  if (actualValue === null) {
    throw new Error(`Local storage item "${storageKey}" does not exist`);
  }

  if (!actualValue.includes(expectedValue)) {
    throw new Error(`Local storage item "${storageKey}" value "${actualValue}" does not contain "${expectedValue}"`);
  }

  console.log(`✅ Local storage item "${storageKey}" contains "${expectedValue}"`);
}

/**
 * Asserts that a local storage item exists.
 * Supports fixtures for reusable storage keys.
 * @example Then I see local storage item "user_id"
 */
export async function expectLocalStorageItem(
  page: any,
  keyKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const storageKey = getFixtureValue(keys, keyKey);

  const actualValue = await page.evaluate((key: string) => localStorage.getItem(key), storageKey);

  if (actualValue === null) {
    throw new Error(`Local storage item "${storageKey}" does not exist`);
  }

  console.log(`✅ Local storage item "${storageKey}" exists with value "${actualValue}"`);
}

/**
 * Asserts that a local storage item does not exist.
 * Supports fixtures for reusable storage keys.
 * @example Then I do not see local storage item "old_data"
 */
export async function expectLocalStorageItemDoesNotExist(
  page: any,
  keyKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const storageKey = getFixtureValue(keys, keyKey);

  const actualValue = await page.evaluate((key: string) => localStorage.getItem(key), storageKey);

  if (actualValue !== null) {
    throw new Error(`Local storage item "${storageKey}" exists but was expected not to`);
  }

  console.log(`✅ Local storage item "${storageKey}" does not exist`);
}

/**
 * Asserts that a session storage item exists and has the expected value.
 * Supports fixtures for reusable storage keys and values.
 * @example Then I see session storage item "temp_data" equals "abc123"
 */
export async function expectSessionStorageItemEquals(
  page: any,
  keyKey: string,
  valueKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const values = loadFixture("values.json");

  const storageKey = getFixtureValue(keys, keyKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const actualValue = await page.evaluate((key: string) => sessionStorage.getItem(key), storageKey);

  if (actualValue === null) {
    throw new Error(`Session storage item "${storageKey}" does not exist`);
  }

  if (actualValue !== expectedValue) {
    throw new Error(`Session storage item "${storageKey}" has value "${actualValue}", expected "${expectedValue}"`);
  }

  console.log(`✅ Session storage item "${storageKey}" equals "${expectedValue}"`);
}

/**
 * Asserts that a session storage item exists and contains the expected substring.
 * Supports fixtures for reusable storage keys and values.
 * @example Then I see session storage item "temp_data" contains "abc"
 */
export async function expectSessionStorageItemContains(
  page: any,
  keyKey: string,
  valueKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const values = loadFixture("values.json");

  const storageKey = getFixtureValue(keys, keyKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const actualValue = await page.evaluate((key: string) => sessionStorage.getItem(key), storageKey);

  if (actualValue === null) {
    throw new Error(`Session storage item "${storageKey}" does not exist`);
  }

  if (!actualValue.includes(expectedValue)) {
    throw new Error(`Session storage item "${storageKey}" value "${actualValue}" does not contain "${expectedValue}"`);
  }

  console.log(`✅ Session storage item "${storageKey}" contains "${expectedValue}"`);
}

/**
 * Asserts that a session storage item exists.
 * Supports fixtures for reusable storage keys.
 * @example Then I see session storage item "temp_token"
 */
export async function expectSessionStorageItem(
  page: any,
  keyKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const storageKey = getFixtureValue(keys, keyKey);

  const actualValue = await page.evaluate((key: string) => sessionStorage.getItem(key), storageKey);

  if (actualValue === null) {
    throw new Error(`Session storage item "${storageKey}" does not exist`);
  }

  console.log(`✅ Session storage item "${storageKey}" exists with value "${actualValue}"`);
}

/**
 * Asserts that a session storage item does not exist.
 * Supports fixtures for reusable storage keys.
 * @example Then I do not see session storage item "expired_token"
 */
export async function expectSessionStorageItemDoesNotExist(
  page: any,
  keyKey: string
): Promise<void> {
  const keys = loadFixture("keys.json");
  const storageKey = getFixtureValue(keys, keyKey);

  const actualValue = await page.evaluate((key: string) => sessionStorage.getItem(key), storageKey);

  if (actualValue !== null) {
    throw new Error(`Session storage item "${storageKey}" exists but was expected not to`);
  }

  console.log(`✅ Session storage item "${storageKey}" does not exist`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I see cookie {string} has value {string}", expectCookieHasValue, "Then");
Step("I see cookie {string} contains value {string}", expectCookieContainsValue, "Then");
Step("I do not see cookie {string}", expectCookieDoesNotExist, "Then");
Step("I see local storage item {string} equals {string}", expectLocalStorageItemEquals, "Then");
Step("I see local storage item {string} contains {string}", expectLocalStorageItemContains, "Then");
Step("I see local storage item {string}", expectLocalStorageItem, "Then");
Step("I do not see local storage item {string}", expectLocalStorageItemDoesNotExist, "Then");
Step("I see session storage item {string} equals {string}", expectSessionStorageItemEquals, "Then");
Step("I see session storage item {string} contains {string}", expectSessionStorageItemContains, "Then");
Step("I see session storage item {string}", expectSessionStorageItem, "Then");
Step("I do not see session storage item {string}", expectSessionStorageItemDoesNotExist, "Then");