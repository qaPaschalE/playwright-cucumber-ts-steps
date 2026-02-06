//src/backend/api/assertions.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { apiState } from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the HTTP status code of the last API response matches the expected integer.
 * @example Then I expect the response status to be 200
 */
export async function expectResponseStatus(page: any, statusCode: number): Promise<void> {
  const response = apiState.getResponse();
  if (!response) throw new Error("❌ No API response found. Did you forget to make a request?");
  expect(response.status()).toBe(statusCode);
  console.log(`✅ Response status is ${statusCode}`);
}

/**
 * Asserts that the body text of the last API response contains a specific substring.
 * Supports fixtures for reusable substrings.
 * @example Then I expect the response body to contain "success"
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
 * Asserts that a specific property in the JSON response matches a string value.
 * Supports dot notation for nested properties and fixtures for reusable keys/values.
 * @example Then I expect the response property "user.id" to be "12345"
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

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect the response status to be {int}", expectResponseStatus, "Then");
Step("I expect the response body to contain {string}", expectResponseBodyContain, "Then");
Step("I expect the response property {string} to be {string}", expectResponseProperty, "Then");