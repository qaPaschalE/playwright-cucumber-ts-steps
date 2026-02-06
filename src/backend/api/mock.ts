import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "./../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Mocks a specific API endpoint with a hardcoded inline JSON response body.
 * Supports fixtures for reusable API endpoints.
 * @example Given I mock the API endpoint "/api/users" with body '{"id": 1, "name": "Fake"}'
 */
export async function mockApiWithInlineJson(
  page: any,
  urlPatternKey: string,
  jsonBody: string
): Promise<void> {
  const endpoints = loadFixture("endpoints.json");
  const urlPattern = getFixtureValue(endpoints, urlPatternKey);

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
 * Supports fixtures for reusable API endpoints and mock files.
 * @example Given I mock the API endpoint "/api/users" with response from "mocks/users.json"
 */
export async function mockApiWithFile(
  page: any,
  urlPatternKey: string,
  filePathKey: string
): Promise<void> {
  const endpoints = loadFixture("endpoints.json");
  const files = loadFixture("files.json");

  const urlPattern = getFixtureValue(endpoints, urlPatternKey);
  const filePath = getFixtureValue(files, filePathKey);

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
 * Supports fixtures for reusable API endpoints.
 * @example Given I mock the API endpoint "/api/broken" with status 500
 */
export async function mockApiStatus(
  page: any,
  urlPatternKey: string,
  statusCode: number
): Promise<void> {
  const endpoints = loadFixture("endpoints.json");
  const urlPattern = getFixtureValue(endpoints, urlPatternKey);

  await page.route(urlPattern, async (route: any) => {
    await route.fulfill({ status: statusCode });
  });
  console.log(`🎭 Mocked ${urlPattern} with status ${statusCode}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I mock the API endpoint {string} with body {string}", mockApiWithInlineJson, "Given");
Step("I mock the API endpoint {string} with response from {string}", mockApiWithFile, "Given");
Step("I mock the API endpoint {string} with status {int}", mockApiStatus, "Given");