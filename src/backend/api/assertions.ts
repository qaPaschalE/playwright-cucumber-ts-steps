//src/backend/api/assertions.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { apiState } from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
import { setVariable, getVariable } from "../utils/state";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the HTTP status code of the last API response matches the expected integer.
 * @example Then I pw expect the response status to be 200
 */
export async function expectResponseStatus(page: any, statusCode: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");
  expect(String(response.status())).toBe(String(statusCode));
  console.log(`✅ Response status is ${statusCode}`);
}

/**
 * Asserts that the HTTP status code of the last API response is successful (2xx).
 * @example Then I pw expect the response status to be successful
 */
export async function expectResponseStatusSuccess(_page: any): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");
  const status = response.status();
  expect(status).toBeGreaterThanOrEqual(200);
  expect(status).toBeLessThan(300);
  console.log(`✅ Response status ${status} is successful`);
}

/**
 * Asserts that the body text of the last API response contains a specific substring.
 * Supports fixtures for reusable substrings.
 * @example Then I pw expect the response body to contain "success"
 */
export async function expectResponseBodyContain(page: any, textKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const texts = loadFixture("responses.json");
  const text = getFixtureValue(texts, textKey);

  const body = await response.text();
  expect(body).toContain(text);
  console.log(`✅ Response body contains "${text}"`);
}

/**
 * Asserts that the body text of the last API response does NOT contain a specific substring.
 * @example Then I pw expect the response body to not contain "error"
 */
export async function expectResponseBodyNotContain(page: any, textKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const texts = loadFixture("responses.json");
  const text = getFixtureValue(texts, textKey);

  const body = await response.text();
  expect(body).not.toContain(text);
  console.log(`✅ Response body does not contain "${text}"`);
}

/**
 * Asserts that the body text of the last API response equals a specific string.
 * @example Then I pw expect the response body to equal "OK"
 */
export async function expectResponseBodyEqual(page: any, textKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const texts = loadFixture("responses.json");
  const text = getFixtureValue(texts, textKey);

  const body = await response.text();
  expect(body).toBe(text);
  console.log(`✅ Response body equals "${text}"`);
}

/**
 * Asserts that a specific property in the JSON response matches a string value.
 * Supports dot notation for nested properties and fixtures for reusable keys/values.
 * @example Then I pw expect the response property "user.id" to be "12345"
 */
export async function expectResponseProperty(
  page: any,
  jsonPathKey: string,
  valueKey: string
): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const values = loadFixture("values.json");

  const jsonPath = getFixtureValue(paths, jsonPathKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const json = await response.json();
  const actualValue = jsonPath.split(".").reduce((o: any, i: string) => o[i], json);

  expect(String(actualValue)).toBe(expectedValue);
  console.log(`✅ Response property "${jsonPath}" is "${expectedValue}"`);
}

/**
 * Stores a response property value in the variable store for later use.
 * @example When I pw store response property "user.id" value as "userId"
 */
export async function storeResponseProperty(page: any, jsonPathKey: string, alias: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o[i], json);
  
  setVariable(page, alias, value);
  console.log(`💾 Stored response property "${jsonPath}" = "${value}" as @${alias}`);
}

/**
 * Asserts that a response property exists in the JSON response.
 * @example Then I pw expect response property "user.email" to exist
 */
export async function expectResponsePropertyExists(page: any, jsonPathKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(value).toBeDefined();
  console.log(`✅ Response property "${jsonPath}" exists`);
}

/**
 * Asserts that a response property does NOT exist in the JSON response.
 * @example Then I pw expect response property "user.deletedAt" to not exist
 */
export async function expectResponsePropertyNotExists(page: any, jsonPathKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(value).toBeUndefined();
  console.log(`✅ Response property "${jsonPath}" does not exist`);
}

/**
 * Asserts that a response property is null.
 * @example Then I pw expect response property "user.deletedAt" to be null
 */
export async function expectResponsePropertyBeNull(page: any, jsonPathKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(value).toBeNull();
  console.log(`✅ Response property "${jsonPath}" is null`);
}

/**
 * Asserts that a response property is not null.
 * @example Then I pw expect response property "user.id" to not be null
 */
export async function expectResponsePropertyNotNull(page: any, jsonPathKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(value).not.toBeNull();
  console.log(`✅ Response property "${jsonPath}" is not null`);
}

/**
 * Asserts that a response property contains a substring.
 * @example Then I pw expect response property "user.email" to contain "@example.com"
 */
export async function expectResponsePropertyContains(page: any, jsonPathKey: string, substring: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(String(value)).toContain(substring);
  console.log(`✅ Response property "${jsonPath}" contains "${substring}"`);
}

/**
 * Asserts that a response array property has a specific length.
 * @example Then I pw expect response property "users" array length to be 10
 */
export async function expectResponseArrayLength(page: any, jsonPathKey: string, expectedLength: number): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(Array.isArray(value)).toBe(true);
  expect(value.length).toBe(expectedLength);
  console.log(`✅ Response property "${jsonPath}" array length is ${expectedLength}`);
}

/**
 * Asserts that a response array property is not empty.
 * @example Then I pw expect response property "users" array to not be empty
 */
export async function expectResponseArrayNotEmpty(page: any, jsonPathKey: string): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");

  const paths = loadFixture("paths.json");
  const jsonPath = getFixtureValue(paths, jsonPathKey);

  const json = await response.json();
  const value = jsonPath.split(".").reduce((o: any, i: string) => o && i in o ? o[i] : undefined, json);

  expect(Array.isArray(value)).toBe(true);
  expect(value.length).toBeGreaterThan(0);
  console.log(`✅ Response property "${jsonPath}" array is not empty`);
}

/**
 * Fills an input field with a previously stored value.
 * @example When I pw fill "#userId" with stored value "userId"
 */
export async function fillWithStoredValue(page: any, selector: string, alias: string): Promise<void> {
  const value = getVariable(page, alias);
  if (value === undefined) {
    throw new Error(`❌ No stored value found for alias "@${alias}"`);
  }
  await page.fill(selector, String(value));
  console.log(`✍️ Filled "${selector}" with stored value @${alias} = "${value}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I pw expect the response status to be {string}", expectResponseStatus, "Then");
Step("I pw expect the response status to be successful", expectResponseStatusSuccess, "Then");
Step("I pw expect the response body to contain {string}", expectResponseBodyContain, "Then");
Step("I pw expect the response body to not contain {string}", expectResponseBodyNotContain, "Then");
Step("I pw expect the response body to equal {string}", expectResponseBodyEqual, "Then");
Step("I pw expect the response property {string} to be {string}", expectResponseProperty, "Then");
Step("I pw store response property {string} value as {string}", storeResponseProperty, "When");
Step("I pw expect response property {string} to exist", expectResponsePropertyExists, "Then");
Step("I pw expect response property {string} to not exist", expectResponsePropertyNotExists, "Then");
Step("I pw expect response property {string} to be null", expectResponsePropertyBeNull, "Then");
Step("I pw expect response property {string} to not be null", expectResponsePropertyNotNull, "Then");
Step("I pw expect response property {string} to contain {string}", expectResponsePropertyContains, "Then");
Step("I pw expect response property {string} array length to be {int}", expectResponseArrayLength, "Then");
Step("I pw expect response property {string} array to not be empty", expectResponseArrayNotEmpty, "Then");
Step("I pw fill {string} with stored value {string}", fillWithStoredValue, "When");