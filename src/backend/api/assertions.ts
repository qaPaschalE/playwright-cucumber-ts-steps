import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { apiState } from "./state";

// =============================
// API ASSERTIONS
// =============================

/**
 * Asserts that the HTTP status code of the last API response matches the expected integer.
 *
 * ```gherkin
 * Then I expect the response status to be 200
 * ```
 *
 * @param statusCode - The expected HTTP status code (e.g., 200, 404, 500).
 */
export const ExpectResponseStatus = Step(
  "I expect the response status to be {int}",
  async (page, statusCode) => {
    const response = apiState.getResponse();
    expect(response.status()).toBe(statusCode);
  }
);

/**
 * Asserts that the body text of the last API response contains a specific substring.
 *
 * ```gherkin
 * Then I expect the response body to contain "success"
 * ```
 *
 * @param text - The text substring to look for in the response body.
 */
export const ExpectResponseBodyContain = Step(
  "I expect the response body to contain {string}",
  async (page, text) => {
    const response = apiState.getResponse();
    const body = await response.text();
    expect(body).toContain(text);
  }
);

/**
 * Asserts that a specific property in the JSON response matches a string value.
 * Supports dot notation for nested properties.
 *
 * ```gherkin
 * Then I expect the response property "user.id" to be "12345"
 * ```
 *
 * @param jsonPath - The dot-notation path to the JSON property (e.g., "data.user.name").
 * @param value - The expected string value of the property.
 */
export const ExpectResponseProperty = Step(
  "I expect the response property {string} to be {string}",
  async (page, jsonPath, value) => {
    const response = apiState.getResponse();
    const json = await response.json();

    // FIX: Added ': string' to the 'i' parameter
    const actualValue = jsonPath.split(".").reduce((o: any, i: string) => o[i], json);

    expect(String(actualValue)).toBe(value);
  }
);
