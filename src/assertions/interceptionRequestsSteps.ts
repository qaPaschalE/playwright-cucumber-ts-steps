import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "../helpers/world";
// import Ajv from "ajv"; // Assuming Ajv is installed (npm install ajv)

// Define a type for the expected structure of lastResponse for consistency
interface LastResponse {
  status: number;
  statusText?: string;
  headers: Record<string, string>; // Headers as a plain object for easy access
  body: string; // Body content as a string
}

// Helper to ensure lastResponse is available and correctly typed
function getValidatedLastResponse(world: CustomWorld): LastResponse {
  const response = world.data.lastResponse;
  if (!response) {
    throw new Error(
      "No API response available in 'this.data.lastResponse'. Make sure a request step was executed."
    );
  }
  // Ensure the structure matches our expected LastResponse interface
  if (
    typeof response.status !== "number" ||
    typeof response.body !== "string" ||
    typeof response.headers !== "object"
  ) {
    throw new Error(
      "Invalid 'lastResponse' structure. Expected properties: status (number), body (string), headers (object)."
    );
  }
  return response as LastResponse;
}

// ===================================================================================
// ASSERTIONS: API RESPONSE STATUS
// ===================================================================================

/**
 * Asserts that the status code of the last API response matches the expected number.
 *
 * ```gherkin
 * Then I should see response status {int}
 * ```
 *
 * @param expectedStatus - The expected HTTP status code (e.g., 200, 404).
 *
 * @example
 * When I make request to "https://api.example.com/data"
 * Then I should see response status 200
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It uses `expect().toBe()` for robust assertion.
 * @category API Response Assertion Steps
 */
export function Then_I_should_see_response_status(this: CustomWorld, expectedStatus: number) {
  const res = getValidatedLastResponse(this);
  expect(res.status).toBe(expectedStatus);
  this.log?.(`✅ Verified response status is ${expectedStatus}.`);
}
Then("I should see response status {int}", Then_I_should_see_response_status);

/**
 * Asserts that the status code of the last API response does NOT match the given number.
 *
 * ```gherkin
 * Then I see response status is not {int}
 * ```
 *
 * @param unexpectedStatus - The HTTP status code that is NOT expected.
 *
 * @example
 * When I make request to "https://api.example.com/data"
 * Then I see response status is not 404
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It uses `expect().not.toBe()` for robust assertion.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_status_is_not(this: CustomWorld, unexpectedStatus: number) {
  const res = getValidatedLastResponse(this);
  expect(res.status).not.toBe(unexpectedStatus);
  this.log?.(`✅ Verified response status is NOT ${unexpectedStatus}.`);
}
Then("I see response status is not {int}", Then_I_see_response_status_is_not);

// ===================================================================================
// ASSERTIONS: API RESPONSE BODY
// ===================================================================================

/**
 * Asserts that the body of the last API response contains the expected text substring.
 *
 * ```gherkin
 * Then I should see response body contains {string}
 * ```
 *
 * @param expectedText - The substring expected to be present in the response body.
 *
 * @example
 * When I make request to "https://api.example.com/users"
 * Then I should see response body contains "John Doe"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It uses `expect().toContain()` for robust assertion.
 * @category API Response Assertion Steps
 */
export function Then_I_should_see_response_body_contains(this: CustomWorld, expectedText: string) {
  const res = getValidatedLastResponse(this);
  expect(res.body).toContain(expectedText);
  this.log?.(`✅ Verified response body contains "${expectedText}".`);
}
// Note: You had two steps "I should see response body contains" and "I see response body contains".
// I've consolidated them to this single export function and will link both When patterns to it.
Then("I should see response body contains {string}", Then_I_should_see_response_body_contains);
Then("I see response body contains {string}", Then_I_should_see_response_body_contains);

/**
 * Asserts that the body of the last API response strictly matches the expected string.
 *
 * ```gherkin
 * Then I see response body {string}
 * ```
 *
 * @param expectedBody - The exact string expected to be the response body.
 *
 * @example
 * When I make request to "https://api.example.com/status"
 * Then I see response body "OK"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It performs a strict equality check on the entire response body string.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_body(this: CustomWorld, expectedBody: string) {
  const res = getValidatedLastResponse(this);
  expect(res.body).toBe(expectedBody);
  this.log?.(`✅ Verified response body is exactly "${expectedBody}".`);
}
// Note: You had "I see response body {string}" and "I see response body matches {string}".
// I've consolidated them to this single export function and will link both Then patterns to it.
Then("I see response body {string}", Then_I_see_response_body);
Then("I see response body matches {string}", Then_I_see_response_body);

/**
 * Asserts that the body of the last API response does NOT contain the given substring.
 *
 * ```gherkin
 * Then I see response body does not contain {string}
 * ```
 *
 * @param unexpectedPart - The substring expected NOT to be present in the response body.
 *
 * @example
 * When I make request to "https://api.example.com/error"
 * Then I see response body does not contain "internal server error"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It checks for the absence of the substring within the response body.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_body_does_not_contain(
  this: CustomWorld,
  unexpectedPart: string
) {
  const res = getValidatedLastResponse(this);
  expect(res.body).not.toContain(unexpectedPart);
  this.log?.(`✅ Verified response body does NOT contain "${unexpectedPart}".`);
}
Then("I see response body does not contain {string}", Then_I_see_response_body_does_not_contain);

/**
 * Asserts that the body of the last API response is empty (contains only whitespace or is empty).
 *
 * ```gherkin
 * Then I see response body is empty
 * ```
 *
 * @example
 * When I make request to "https://api.example.com/no-content"
 * Then I see response body is empty
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It trims whitespace and checks if the resulting string is empty.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_body_is_empty(this: CustomWorld) {
  const res = getValidatedLastResponse(this);
  expect(res.body.trim()).toBe("");
  this.log?.(`✅ Verified response body is empty.`);
}
Then("I see response body is empty", Then_I_see_response_body_is_empty);

/**
 * Asserts that the body of the last API response is NOT empty (contains non-whitespace characters).
 *
 * ```gherkin
 * Then I see response body is not empty
 * ```
 *
 * @example
 * When I make request to "https://api.example.com/data"
 * Then I see response body is not empty
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It trims whitespace and checks if the resulting string is not empty.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_body_is_not_empty(this: CustomWorld) {
  const res = getValidatedLastResponse(this);
  expect(res.body.trim()).not.toBe("");
  this.log?.(`✅ Verified response body is not empty.`);
}
Then("I see response body is not empty", Then_I_see_response_body_is_not_empty);

/**
 * Asserts that the body of the last API response is valid JSON.
 *
 * ```gherkin
 * Then I see response body is JSON
 * ```
 *
 * @example
 * When I make request to "https://api.example.com/json-data"
 * Then I see response body is JSON
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It attempts to parse the response body as JSON. If parsing fails, the step fails.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_body_is_JSON(this: CustomWorld) {
  const res = getValidatedLastResponse(this);
  try {
    JSON.parse(res.body);
    this.log?.(`✅ Verified response body is valid JSON.`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Response body is not valid JSON: ${message}`);
  }
}
Then("I see response body is JSON", Then_I_see_response_body_is_JSON);

/**
 * Asserts that the body of the last API response is NOT valid JSON.
 *
 * ```gherkin
 * Then I see response body is not JSON
 * ```
 *
 * @example
 * When I make request to "https://api.example.com/plain-text"
 * Then I see response body is not JSON
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It attempts to parse the response body as JSON and expects the parsing to fail.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_body_is_not_JSON(this: CustomWorld) {
  const res = getValidatedLastResponse(this);
  let isJson = true;
  try {
    JSON.parse(res.body);
  } catch (e) {
    isJson = false;
    e instanceof Error ? e.message : String(e);
  }
  if (isJson) {
    throw new Error(`Expected response body to not be JSON, but it is.`);
  }
  this.log?.(`✅ Verified response body is NOT JSON.`);
}
Then("I see response body is not JSON", Then_I_see_response_body_is_not_JSON);

/**
 * Asserts that the body of the last API response matches the given JSON schema.
 *
 * ```gherkin
 * Then I see response body matches JSON schema {string}
 * ```
 *
 * @param schemaPath - The path to the JSON schema file (e.g., "schemas/responseSchema.js").
 *
 * @example
 * When I make request to "https://api.example.com/users/1"
 * Then I see response body matches JSON schema "schemas/userSchema.js"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It dynamically imports the schema file and uses `ajv` to validate the JSON response body.
 * Ensure `ajv` is installed (`npm install ajv`) and your schema files are accessible.
 * @category API Response Assertion Steps
 */
export async function Then_I_see_response_body_matches_JSON_schema_path(
  this: CustomWorld,
  schemaPath: string
) {
  const res = getValidatedLastResponse(this);
  const body = res.body; // Body is already a string from getValidatedLastResponse

  // Dynamically import Ajv and the schema
  const AjvModule = await import("ajv");
  const Ajv = AjvModule.default || AjvModule; // Handle potential default export differences
  const ajv = new Ajv();

  // Dynamically import the schema, handling both CommonJS and ES Module exports
  let schema: object;
  try {
    const schemaModule = await import(schemaPath);
    schema = schemaModule.default || schemaModule;
  } catch (error) {
    throw new Error(`Failed to load JSON schema from "${schemaPath}": ${(error as Error).message}`);
  }

  const validate = ajv.compile(schema);
  let parsedBody: any;
  try {
    parsedBody = JSON.parse(body);
  } catch (e) {
    throw new Error(
      `Response body is not valid JSON and cannot be validated against schema: ${(e as Error).message}`
    );
  }

  const valid = validate(parsedBody);
  if (!valid) {
    throw new Error(`Response body does not match schema: ${ajv.errorsText(validate.errors)}`);
  }
  this.log?.(`✅ Verified response body matches JSON schema from "${schemaPath}".`);
}
Then(
  "I see response body matches JSON schema {string}",
  Then_I_see_response_body_matches_JSON_schema_path
);

/**
 * Asserts that the body of the last API response matches the given JSON schema object directly provided in the step.
 *
 * ```gherkin
 * Then I see response body matches JSON schema:
 * """
 * { "type": "object", "properties": { "id": { "type": "number" } } }
 * """
 * ```
 *
 * @param schema - The JSON schema object (provided as a Cucumber DocString).
 *
 * @example
 * When I make request to "https://api.example.com/users/latest"
 * Then I see response body matches JSON schema:
 * """
 * {
 * "type": "object",
 * "properties": {
 * "id": { "type": "number" },
 * "name": { "type": "string" }
 * },
 * "required": ["id", "name"]
 * }
 * """
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It expects the schema as a direct JSON string (DocString) in the Gherkin step.
 * Uses `ajv` to validate the JSON response body against this inline schema.
 * Ensure `ajv` is installed (`npm install ajv`).
 * @category API Response Assertion Steps
 */
export async function Then_I_see_response_body_matches_JSON_schema_object(
  this: CustomWorld,
  schemaString: string
) {
  const res = getValidatedLastResponse(this);
  const body = res.body;

  const AjvModule = await import("ajv");
  const Ajv = AjvModule.default || AjvModule;
  const ajv = new Ajv();

  let schema: object;
  try {
    schema = JSON.parse(schemaString);
  } catch (e) {
    throw new Error(
      `Failed to parse inline JSON schema: ${(e as Error).message}. Ensure it is valid JSON.`
    );
  }

  const validate = ajv.compile(schema);
  let parsedBody: any;
  try {
    parsedBody = JSON.parse(body);
  } catch (e) {
    throw new Error(
      `Response body is not valid JSON and cannot be validated against inline schema: ${(e as Error).message}`
    );
  }

  const valid = validate(parsedBody);
  if (!valid) {
    throw new Error(
      `Response body does not match inline schema: ${ajv.errorsText(validate.errors)}`
    );
  }
  this.log?.(`✅ Verified response body matches inline JSON schema.`);
}
Then(
  "I see response body matches JSON schema",
  Then_I_see_response_body_matches_JSON_schema_object
);

// ===================================================================================
// ASSERTIONS: API RESPONSE HEADERS
// ===================================================================================

/**
 * Asserts that a specific header in the last API response strictly equals an expected value.
 *
 * ```gherkin
 * Then I see response header {string} equals {string}
 * ```
 *
 * @param headerName - The name of the header (case-insensitive, e.g., "Content-Type").
 * @param expectedValue - The exact expected value of the header.
 *
 * @example
 * When I make request to "https://api.example.com/data"
 * Then I see response header "content-type" equals "application/json"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It retrieves the header value and performs a strict equality check.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_header_equals(
  this: CustomWorld,
  headerName: string,
  expectedValue: string
) {
  const res = getValidatedLastResponse(this);
  const headerValue = res.headers[headerName.toLowerCase()]; // Access from plain object
  expect(
    headerValue,
    `Expected header "${headerName}" to be "${expectedValue}", but got "${headerValue}".`
  ).toBe(expectedValue);
  this.log?.(`✅ Verified response header "${headerName}" equals "${expectedValue}".`);
}
Then("I see response header {string} equals {string}", Then_I_see_response_header_equals);

/**
 * Asserts that a specific header in the last API response contains a given substring.
 *
 * ```gherkin
 * Then I see response header {string} contains {string}
 * ```
 *
 * @param headerName - The name of the header (case-insensitive, e.g., "Set-Cookie").
 * @param expectedPart - The substring expected to be contained within the header's value.
 *
 * @example
 * When I make request to "https://api.example.com/login"
 * Then I see response header "set-cookie" contains "session_id"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It retrieves the header value and checks if it includes the `expectedPart`.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_header_contains(
  this: CustomWorld,
  headerName: string,
  expectedPart: string
) {
  const res = getValidatedLastResponse(this);
  const headerValue = res.headers[headerName.toLowerCase()]; // Access from plain object
  expect(
    headerValue,
    `Header "${headerName}" not found or is empty. Expected to contain "${expectedPart}".`
  ).toBeDefined(); // Ensure header exists before checking content
  expect(
    headerValue,
    `Expected header "${headerName}" to contain "${expectedPart}", but got "${headerValue}".`
  ).toContain(expectedPart);
  this.log?.(`✅ Verified response header "${headerName}" contains "${expectedPart}".`);
}
Then("I see response header {string} contains {string}", Then_I_see_response_header_contains);

/**
 * Asserts that a specific header in the last API response does NOT contain a given substring.
 *
 * ```gherkin
 * Then I see response header {string} does not contain {string}
 * ```
 *
 * @param headerName - The name of the header (case-insensitive).
 * @param unexpectedPart - The substring expected NOT to be present within the header's value.
 *
 * @example
 * When I make request to "https://api.example.com/no-cache"
 * Then I see response header "cache-control" does not contain "no-store"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It retrieves the header value and asserts that it does not include the `unexpectedPart`.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_header_does_not_contain(
  this: CustomWorld,
  headerName: string,
  unexpectedPart: string
) {
  const res = getValidatedLastResponse(this);
  const headerValue = res.headers[headerName.toLowerCase()]; // Access from plain object
  if (headerValue !== undefined) {
    // Only check if header exists
    expect(
      headerValue,
      `Expected header "${headerName}" to NOT contain "${unexpectedPart}", but it does.`
    ).not.toContain(unexpectedPart);
  }
  this.log?.(`✅ Verified response header "${headerName}" does NOT contain "${unexpectedPart}".`);
}
Then(
  "I see response header {string} does not contain {string}",
  Then_I_see_response_header_does_not_contain
);

/**
 * Asserts that a specific header in the last API response does NOT strictly equal a given value.
 *
 * ```gherkin
 * Then I see response header {string} does not equal {string}
 * ```
 *
 * @param headerName - The name of the header (case-insensitive).
 * @param unexpectedValue - The value that is NOT expected for the header.
 *
 * @example
 * When I make request to "https://api.example.com/html-page"
 * Then I see response header "content-type" does not equal "application/json"
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It retrieves the header value and asserts that it does not strictly match `unexpectedValue`.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_header_does_not_equal(
  this: CustomWorld,
  headerName: string,
  unexpectedValue: string
) {
  const res = getValidatedLastResponse(this);
  const headerValue = res.headers[headerName.toLowerCase()]; // Access from plain object
  expect(
    headerValue,
    `Expected header "${headerName}" to NOT be "${unexpectedValue}", but it is.`
  ).not.toBe(unexpectedValue);
  this.log?.(`✅ Verified response header "${headerName}" does NOT equal "${unexpectedValue}".`);
}
Then(
  "I see response header {string} does not equal {string}",
  Then_I_see_response_header_does_not_equal
);

/**
 * Asserts that a specific header in the last API response exists (is present).
 *
 * ```gherkin
 * Then I see response header {string} exists
 * ```
 *
 * @param headerName - The name of the header expected to exist.
 *
 * @example
 * When I make request to "https://api.example.com/data"
 * Then I see response header "content-length" exists
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It checks if the header value is defined (not `undefined` or `null`).
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_header_exists(this: CustomWorld, headerName: string) {
  const res = getValidatedLastResponse(this);
  const headerValue = res.headers[headerName.toLowerCase()]; // Access from plain object
  expect(headerValue, `Header "${headerName}" should exist but was not found.`).toBeDefined();
  this.log?.(`✅ Verified response header "${headerName}" exists.`);
}
Then("I see response header {string} exists", Then_I_see_response_header_exists);

/**
 * Asserts that a specific header in the last API response does NOT exist (is not present).
 *
 * ```gherkin
 * Then I see response header {string} does not exist
 * ```
 *
 * @param headerName - The name of the header expected NOT to exist.
 *
 * @example
 * When I make request to "https://api.example.com/simple"
 * Then I see response header "x-powered-by" does not exist
 *
 * @remarks
 * This step requires a preceding step that stores the API response in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * It checks if the header value is `undefined` or `null`.
 * @category API Response Assertion Steps
 */
export function Then_I_see_response_header_does_not_exist(this: CustomWorld, headerName: string) {
  const res = getValidatedLastResponse(this);
  const headerValue = res.headers[headerName.toLowerCase()]; // Access from plain object
  expect(headerValue, `Header "${headerName}" should NOT exist but was found.`).toBeUndefined();
  this.log?.(`✅ Verified response header "${headerName}" does NOT exist.`);
}
Then("I see response header {string} does not exist", Then_I_see_response_header_does_not_exist);
