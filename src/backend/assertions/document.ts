//src/backend/assertions/document.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the document title equals the expected value.
 * Supports fixtures for reusable title values.
 * @example Then I see document title "My Website - Home"
 */
export async function expectDocumentTitle(
  page: any,
  titleKey: string
): Promise<void> {
  const titles = loadFixture("titles.json");
  const expectedTitle = getFixtureValue(titles, titleKey);

  await expect(page).toHaveTitle(expectedTitle);
  console.log(`✅ Document title is "${expectedTitle}"`);
}

/**
 * Asserts that the document title contains the expected substring.
 * Supports fixtures for reusable title values.
 * @example Then I see document title contains "Website"
 */
export async function expectDocumentTitleContains(
  page: any,
  titleKey: string
): Promise<void> {
  const titles = loadFixture("titles.json");
  const expectedTitle = getFixtureValue(titles, titleKey);

  const actualTitle = await page.title();
  if (!actualTitle.includes(expectedTitle)) {
    throw new Error(`Document title "${actualTitle}" does not contain "${expectedTitle}"`);
  }
  console.log(`✅ Document title contains "${expectedTitle}"`);
}

/**
 * Asserts that the current URL equals the expected value.
 * Supports fixtures for reusable URL values.
 * @example Then I see URL "https://example.com/dashboard"
 */
export async function expectUrl(
  page: any,
  urlKey: string
): Promise<void> {
  const urls = loadFixture("urls.json");
  const expectedUrl = getFixtureValue(urls, urlKey);

  await expect(page).toHaveURL(expectedUrl);
  console.log(`✅ Current URL is "${expectedUrl}"`);
}

/**
 * Asserts that the current URL contains the expected substring.
 * Supports fixtures for reusable URL values.
 * @example Then I see URL contains "dashboard"
 */
export async function expectUrlContains(
  page: any,
  urlPartKey: string
): Promise<void> {
  const urls = loadFixture("urls.json");
  const urlPart = getFixtureValue(urls, urlPartKey);

  const currentUrl = page.url();
  if (!currentUrl.includes(urlPart)) {
    throw new Error(`Current URL "${currentUrl}" does not contain "${urlPart}"`);
  }
  console.log(`✅ Current URL contains "${urlPart}"`);
}

/**
 * Asserts that the current pathname equals the expected value.
 * Supports fixtures for reusable pathname values.
 * @example Then I see pathname "/dashboard"
 */
export async function expectPathname(
  page: any,
  pathnameKey: string
): Promise<void> {
  const paths = loadFixture("paths.json");
  const expectedPath = getFixtureValue(paths, pathnameKey);

  const currentPath = new URL(page.url()).pathname;
  if (currentPath !== expectedPath) {
    throw new Error(`Current pathname "${currentPath}" does not equal "${expectedPath}"`);
  }
  console.log(`✅ Current pathname is "${expectedPath}"`);
}

/**
 * Asserts that the current pathname contains the expected substring.
 * Supports fixtures for reusable pathname values.
 * @example Then I see pathname contains "dashboard"
 */
export async function expectPathnameContains(
  page: any,
  pathnamePartKey: string
): Promise<void> {
  const paths = loadFixture("paths.json");
  const pathnamePart = getFixtureValue(paths, pathnamePartKey);

  const currentPath = new URL(page.url()).pathname;
  if (!currentPath.includes(pathnamePart)) {
    throw new Error(`Current pathname "${currentPath}" does not contain "${pathnamePart}"`);
  }
  console.log(`✅ Current pathname contains "${pathnamePart}"`);
}

/**
 * Asserts that the current hash equals the expected value.
 * Supports fixtures for reusable hash values.
 * @example Then I see hash "#section1"
 */
export async function expectHash(
  page: any,
  hashKey: string
): Promise<void> {
  const hashes = loadFixture("hashes.json");
  const expectedHash = getFixtureValue(hashes, hashKey);

  const currentHash = new URL(page.url()).hash;
  if (currentHash !== expectedHash) {
    throw new Error(`Current hash "${currentHash}" does not equal "${expectedHash}"`);
  }
  console.log(`✅ Current hash is "${expectedHash}"`);
}

/**
 * Asserts that the current hash contains the expected substring.
 * Supports fixtures for reusable hash values.
 * @example Then I see hash contains "section"
 */
export async function expectHashContains(
  page: any,
  hashPartKey: string
): Promise<void> {
  const hashes = loadFixture("hashes.json");
  const hashPart = getFixtureValue(hashes, hashPartKey);

  const currentHash = new URL(page.url()).hash;
  if (!currentHash.includes(hashPart)) {
    throw new Error(`Current hash "${currentHash}" does not contain "${hashPart}"`);
  }
  console.log(`✅ Current hash contains "${hashPart}"`);
}

/**
 * Asserts that the current search parameters contain the expected substring.
 * Supports fixtures for reusable search values.
 * @example Then I see search contains "query=test"
 */
export async function expectSearchContains(
  page: any,
  searchPartKey: string
): Promise<void> {
  const searches = loadFixture("searches.json");
  const searchPart = getFixtureValue(searches, searchPartKey);

  const currentSearch = new URL(page.url()).search;
  if (!currentSearch.includes(searchPart)) {
    throw new Error(`Current search "${currentSearch}" does not contain "${searchPart}"`);
  }
  console.log(`✅ Current search contains "${searchPart}"`);
}

/**
 * Asserts that the current location equals the expected value.
 * Supports fixtures for reusable location values.
 * @example Then I see location "https://example.com/dashboard#top"
 */
export async function expectLocation(
  page: any,
  locationKey: string
): Promise<void> {
  const locations = loadFixture("locations.json");
  const expectedLocation = getFixtureValue(locations, locationKey);

  const currentLocation = page.url();
  if (currentLocation !== expectedLocation) {
    throw new Error(`Current location "${currentLocation}" does not equal "${expectedLocation}"`);
  }
  console.log(`✅ Current location is "${expectedLocation}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I see document title {string}", expectDocumentTitle, "Then");
Step("I see document title contains {string}", expectDocumentTitleContains, "Then");
Step("I see URL {string}", expectUrl, "Then");
Step("I see URL contains {string}", expectUrlContains, "Then");
Step("I see pathname {string}", expectPathname, "Then");
Step("I see pathname contains {string}", expectPathnameContains, "Then");
Step("I see hash {string}", expectHash, "Then");
Step("I see hash contains {string}", expectHashContains, "Then");
Step("I see search contains {string}", expectSearchContains, "Then");
Step("I see location {string}", expectLocation, "Then");