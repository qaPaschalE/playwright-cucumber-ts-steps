//src/backend/api/requests.ts
import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";
import { apiState } from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Performs a standard HTTP GET request and stores the response in the global API state.
 * Supports fixtures for reusable API endpoints.
 * @example When I make a GET request to "users.list"
 */
export async function makeGetRequest(page: any, urlKey: string): Promise<void> {
  const endpoints = loadFixture("endpoints.json");
  const url = getFixtureValue(endpoints, urlKey);

  const response = await page.request.get(url);
  apiState.setResponse(response);
  console.log(`GET ${url} - Status: ${response.status()}`);
}

/**
 * Performs a standard HTTP DELETE request and stores the response in the global API state.
 * Supports fixtures for reusable API endpoints.
 * @example When I make a DELETE request to "users.delete"
 */
export async function makeDeleteRequest(page: any, urlKey: string): Promise<void> {
  const endpoints = loadFixture("endpoints.json");
  const url = getFixtureValue(endpoints, urlKey);

  const response = await page.request.delete(url);
  apiState.setResponse(response);
  console.log(`DELETE ${url} - Status: ${response.status()}`);
}

/**
 * Performs an HTTP POST request using a Gherkin Data Table as the JSON payload.
 * @example When I make a POST request to "users.create" with data
 * | name | John |
 * | job  | Dev  |
 */
export async function makePostRequestWithTable(
  page: any,
  urlKey: string,
  tableData: string[][]
): Promise<void> {
  if (!tableData) throw new Error("This step requires a Data Table.");

  const endpoints = loadFixture("endpoints.json");
  const url = getFixtureValue(endpoints, urlKey);

  const payload = tableData.reduce((acc: any, row: string[]) => {
    acc[row[0]] = row[1];
    return acc;
  }, {});

  const response = await page.request.post(url, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  apiState.setResponse(response);
  console.log(`POST ${url} (Table) - Status: ${response.status()}`);
}

/**
 * Performs an HTTP POST request using the contents of a local JSON file as the payload.
 * Supports fixtures for reusable API endpoints and payloads.
 * @example When I make a POST request to "users.create" with payload from "user.newUser"
 */
export async function makePostRequestWithFile(
  page: any,
  urlKey: string,
  filePathKey: string
): Promise<void> {
  const endpoints = loadFixture("endpoints.json");
  const files = loadFixture("files.json");

  const url = getFixtureValue(endpoints, urlKey);
  const filePath = getFixtureValue(files, filePathKey);

  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ Payload file not found at: ${fullPath}`);
  }

  const fileContent = fs.readFileSync(fullPath, "utf8");
  const payload = JSON.parse(fileContent);

  const response = await page.request.post(url, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  apiState.setResponse(response);
  console.log(`POST ${url} (File: ${filePath}) - Status: ${response.status()}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I make a GET request to {string}", makeGetRequest, "When");
Step("I make a DELETE request to {string}", makeDeleteRequest, "When");
Step("I make a POST request to {string} with data", makePostRequestWithTable, "When");
Step("I make a POST request to {string} with payload from {string}", makePostRequestWithFile, "When");