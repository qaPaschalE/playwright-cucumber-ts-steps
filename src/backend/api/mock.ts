import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Mocks a specific API endpoint with a hardcoded inline JSON response body.
 * @example
 * Given I mock the API endpoint "/api/users" with body '{"id": 1, "name": "Fake"}'
 * @param urlPattern - The URL or glob pattern to intercept.
 * @param jsonBody - The raw JSON string to return as the response.
 */
export async function mockApiWithInlineJson(
  page: any,
  urlPattern: string,
  jsonBody: string
): Promise<void> {
  await page.route(urlPattern, async (route: any) => {
    const json = JSON.parse(jsonBody);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(json),
    });
  });
  console.log(`🎭 Mocked ${urlPattern} with inline JSON`);
}

/**
 * Mocks an API endpoint using the contents of a local JSON file.
 * @example
 * Given I mock the API endpoint "/api/users" with response from "mocks/users.json"
 * @param urlPattern - The URL pattern to intercept.
 * @param filePath - Path to the JSON file relative to the project root.
 */
export async function mockApiWithFile(
  page: any,
  urlPattern: string,
  filePath: string
): Promise<void> {
  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ Mock file not found at: ${fullPath}`);
  }

  const bodyContent = fs.readFileSync(fullPath, "utf8");

  await page.route(urlPattern, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: bodyContent,
    });
  });
  console.log(`🎭 Mocked ${urlPattern} with file: ${filePath}`);
}

/**
 * Mocks an API endpoint to return a specific HTTP status code only.
 * Useful for simulating server errors like 500 or 404.
 * @example
 * Given I mock the API endpoint "/api/broken" with status 500
 * @param urlPattern - The URL pattern to intercept.
 * @param statusCode - The HTTP status code to return.
 */
export async function mockApiStatus(
  page: any,
  urlPattern: string,
  statusCode: number
): Promise<void> {
  await page.route(urlPattern, async (route: any) => {
    await route.fulfill({ status: statusCode });
  });
  console.log(`🎭 Mocked ${urlPattern} with status ${statusCode}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I mock the API endpoint {string} with body {string}", mockApiWithInlineJson);
Step("I mock the API endpoint {string} with response from {string}", mockApiWithFile);
Step("I mock the API endpoint {string} with status {int}", mockApiStatus);
