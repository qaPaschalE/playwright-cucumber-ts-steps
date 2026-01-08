import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";

/**
 * @module NetworkMocking
 */

/**
 * Mocks a specific API endpoint with a hardcoded inline JSON response body.
 * * @example
 * ```gherkin
 * Given I mock the API endpoint "/api/users" with body '{"id": 1, "name": "Fake"}'
 * ```
 * * @param urlPattern - The URL or glob pattern to intercept.
 * @param jsonBody - The raw JSON string to return as the response.
 */
export const MockApiWithInlineJson = Step(
  "I mock the API endpoint {string} with body {string}",
  async (page, urlPattern, jsonBody) => {
    await page.route(urlPattern, async (route) => {
      const json = JSON.parse(jsonBody);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(json),
      });
    });
    console.log(`🎭 Mocked ${urlPattern} with inline JSON`);
  }
);

/**
 * Mocks an API endpoint using the contents of a local JSON file.
 * * @example
 * ```gherkin
 * Given I mock the API endpoint "/api/users" with response from "mocks/users.json"
 * ```
 * * @param urlPattern - The URL pattern to intercept.
 * @param filePath - Path to the JSON file relative to the project root.
 */
export const MockApiWithFile = Step(
  "I mock the API endpoint {string} with response from {string}",
  async (page, urlPattern, filePath) => {
    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`❌ Mock file not found at: ${fullPath}`);
    }

    const bodyContent = fs.readFileSync(fullPath, "utf8");

    await page.route(urlPattern, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: bodyContent,
      });
    });
    console.log(`🎭 Mocked ${urlPattern} with file: ${filePath}`);
  }
);

/**
 * Mocks an API endpoint to return a specific HTTP status code only.
 * Useful for simulating server errors like 500 or 404.
 * * @example
 * ```gherkin
 * Given I mock the API endpoint "/api/broken" with status 500
 * ```
 * * @param urlPattern - The URL pattern to intercept.
 * @param statusCode - The HTTP status code to return.
 */
export const MockApiStatus = Step(
  "I mock the API endpoint {string} with status {int}",
  async (page, urlPattern, statusCode) => {
    await page.route(urlPattern, async (route) => {
      await route.fulfill({ status: statusCode });
    });
    console.log(`🎭 Mocked ${urlPattern} with status ${statusCode}`);
  }
);
