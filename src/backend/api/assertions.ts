import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { apiState } from "./state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the HTTP status code of the last API response matches the expected integer.
 * @example
 * Then I expect the response status to be 200
 * @param statusCode - The expected HTTP status code (e.g., 200, 404, 500).
 */
export async function expectResponseStatus(page: any, statusCode: number): Promise<void> {
  const response = apiState.getResponse();
  expect(response.status()).toBe(statusCode);
}

/**
 * Asserts that the body text of the last API response contains a specific substring.
 * @example
 * Then I expect the response body to contain "success"
 * @param text - The text substring to look for in the response body.
 */
export async function expectResponseBodyContain(page: any, text: string): Promise<void> {
  const response = apiState.getResponse();
  const body = await response.text();
  expect(body).toContain(text);
}

/**
 * Asserts that a specific property in the JSON response matches a string value.
 * Supports dot notation for nested properties.
 * @example
 * Then I expect the response property "user.id" to be "12345"
 * @param jsonPath - The dot-notation path to the JSON property (e.g., "data.user.name").
 * @param value - The expected string value of the property.
 */
export async function expectResponseProperty(
  page: any,
  jsonPath: string,
  value: string
): Promise<void> {
  const response = apiState.getResponse();
  const json = await response.json();
  const actualValue = jsonPath.split(".").reduce((o: any, i: string) => o[i], json);
  expect(String(actualValue)).toBe(value);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect the response status to be {int}", expectResponseStatus);
Step("I expect the response body to contain {string}", expectResponseBodyContain);
Step("I expect the response property {string} to be {string}", expectResponseProperty);
