import fs from "fs";
import path from "path";
import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import pixelmatch from "pixelmatch"; // Ensure pixelmatch is installed: npm install pixelmatch
import { PNG } from "pngjs"; // Ensure pngjs is installed: npm install pngjs
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// --- Configuration for Snapshot Directories ---
// It's good practice to make these configurable (e.g., via world.config or env variables)
// For now, keeping them as resolved constants as per your original code.
const SNAPSHOTS_BASE_DIR = path.resolve("e2e/snapshots"); // Base directory for all snapshots
const BASELINE_DIR = path.join(SNAPSHOTS_BASE_DIR, "baseline");
const CURRENT_DIR = path.join(SNAPSHOTS_BASE_DIR, "current");
const DIFF_DIR = path.join(SNAPSHOTS_BASE_DIR, "diff");

// Helper function to generate standardized snapshot paths
function getSnapshotPaths(name: string) {
  // Sanitize the name for use in filenames
  const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return {
    baseline: path.join(BASELINE_DIR, `${safeName}.png`),
    current: path.join(CURRENT_DIR, `${safeName}.png`),
    diff: path.join(DIFF_DIR, `${safeName}.diff.png`),
  };
}

// Helper to ensure all necessary directories exist
function ensureSnapshotDirs() {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });
  fs.mkdirSync(CURRENT_DIR, { recursive: true });
  fs.mkdirSync(DIFF_DIR, { recursive: true });
}

// ===================================================================================
// VISUAL REGRESSION ASSERTIONS: PAGE SNAPSHOTS
// ===================================================================================

/**
 * Asserts that the current page's visual appearance matches a named baseline snapshot.
 * If no baseline exists for the given name, a new one is created from the current page.
 * Differences between current and baseline snapshots are highlighted in a 'diff' image.
 *
 * ```gherkin
 * Then I should see the page matches the snapshot {string}
 * ```
 *
 * @param name - A unique name for the snapshot (e.g., "homepage", "product-details-page").
 *
 * @example
 * Then I should see the page matches the snapshot "homepage"
 *
 * @remarks
 * This is a core step for visual regression testing.
 * 1. Takes a screenshot of the current page and saves it to the `current` directory.
 * 2. If a `baseline` snapshot does not exist, the `current` snapshot is copied to `baseline`,
 * and the test passes (a new baseline is established).
 * 3. If a `baseline` exists, it compares the `current` and `baseline` snapshots pixel by pixel
 * using `pixelmatch`.
 * 4. If a mismatch is detected (more than 0 differing pixels based on `threshold`), a `diff`
 * image is generated, and the test fails.
 *
 * All snapshots (baseline, current, diff) are stored in `e2e/snapshots/`.
 * Adjust `threshold` for sensitivity (0.1 means 10% difference in pixel color is allowed).
 * @category Visual Regression Steps
 */
export async function Then_I_should_see_page_matches_snapshot(this: CustomWorld, name: string) {
  const { page } = this;
  const paths = getSnapshotPaths(name);

  ensureSnapshotDirs(); // Ensure directories exist before taking screenshot

  // Take current screenshot
  await page.screenshot({ path: paths.current, fullPage: true });
  this.log?.(`📸 Captured current snapshot: "${paths.current}".`);

  if (!fs.existsSync(paths.baseline)) {
    // If no baseline exists, create one from the current screenshot
    fs.copyFileSync(paths.current, paths.baseline);
    this.log?.(`✨ Created new baseline snapshot: "${paths.baseline}".`);
    return; // Pass the test if a new baseline was created
  }

  // Load baseline and current images for comparison
  const baselineImg = PNG.sync.read(fs.readFileSync(paths.baseline));
  const currentImg = PNG.sync.read(fs.readFileSync(paths.current));

  // Ensure images have the same dimensions for comparison
  if (baselineImg.width !== currentImg.width || baselineImg.height !== currentImg.height) {
    fs.writeFileSync(
      paths.diff,
      PNG.sync.write(
        new PNG({
          width: Math.max(baselineImg.width, currentImg.width),
          height: Math.max(baselineImg.height, currentImg.height),
        })
      )
    );
    throw new Error(
      `Visual snapshot mismatch for "${name}": Dimensions differ! ` +
        `Baseline: ${baselineImg.width}x${baselineImg.height}, Current: ${currentImg.width}x${currentImg.height}. ` +
        `Diff image generated at "${paths.diff}".`
    );
  }

  const { width, height } = baselineImg;
  const diffImg = new PNG({ width, height });

  // Compare images pixel by pixel
  const pixelDiff = pixelmatch(
    baselineImg.data,
    currentImg.data,
    diffImg.data,
    width,
    height,
    { threshold: 0.1 } // Adjust threshold for sensitivity (0.1 means 10% difference in pixel color is allowed)
  );

  if (pixelDiff > 0) {
    // If differences found, write the diff image
    fs.writeFileSync(paths.diff, PNG.sync.write(diffImg));
    this.log?.(
      `❌ Visual mismatch detected for "${name}". ${pixelDiff} pixels differ. Diff image: "${paths.diff}".`
    );
  }

  // Assert that no pixels differ
  expect(pixelDiff, `Visual snapshot "${name}" mismatch: ${pixelDiff} pixels differ.`).toBe(0);
  this.log?.(`✅ Visual snapshot "${name}" matches baseline (0 pixels differ).`);
}
Then(
  "I should see the page matches the snapshot {string}",
  Then_I_should_see_page_matches_snapshot
);

// ===================================================================================
// VISUAL REGRESSION: ELEMENT SNAPSHOT CAPTURE & MATCH
// ===================================================================================

/**
 * Captures a visual snapshot of a specific element identified by its selector and saves it under a given alias.
 * This snapshot is saved to the `current` directory and can later be compared against a baseline.
 *
 * ```gherkin
 * Then I capture a snapshot of the element {string} as {string}
 * ```
 *
 * @param selector - The CSS selector of the element to capture.
 * @param alias - A unique alias name for this element snapshot (e.g., "logo-image", "product-card").
 *
 * @example
 * Then I capture a snapshot of the element ".header .logo" as "logo-snapshot"
 * Then I capture a snapshot of the element "#user-profile" as "user-profile-widget"
 *
 * @remarks
 * This step is typically followed by {@link Then_the_snapshot_should_match_baseline | "Then the snapshot {string} should match baseline"}
 * to perform the actual visual comparison.
 * @category Visual Regression Steps
 */
export async function Then_I_capture_element_snapshot_as_alias(
  this: CustomWorld,
  selector: string,
  alias: string
) {
  const elementLocator = this.getScope().locator(selector);
  ensureSnapshotDirs(); // Ensure directories exist
  const pathCurrent = path.join(CURRENT_DIR, `${alias}.png`);

  await elementLocator.screenshot({ path: pathCurrent });
  this.log?.(`📸 Captured snapshot of element "${selector}" saved as "${alias}".`);
}
Then(
  "I capture a snapshot of the element {string} as {string}",
  Then_I_capture_element_snapshot_as_alias
);

/**
 * Asserts that a previously captured named snapshot (of an element) matches its baseline.
 * If no baseline exists, a new one is created from the current snapshot.
 *
 * ```gherkin
 * Then The snapshot {string} should match baseline
 * ```
 *
 * @param alias - The unique alias name of the snapshot (as used in "Then I capture a snapshot...").
 *
 * @example
 * Then I capture a snapshot of the element ".logo" as "logo-snapshot"
 * Then The snapshot "logo-snapshot" should match baseline
 *
 * @remarks
 * This step is designed to be used after a step like
 * {@link Then_I_capture_element_snapshot_as_alias | "Then I capture a snapshot of the element {string} as {string}"}.
 * It performs the same comparison logic as `Then I should see the page matches the snapshot`,
 * but specifically for an element snapshot.
 * All snapshots (baseline, current, diff) are stored in `e2e/snapshots/`.
 * @category Visual Regression Steps
 */
export async function Then_the_snapshot_should_match_baseline(this: CustomWorld, alias: string) {
  const paths = getSnapshotPaths(alias); // Get paths for baseline, current, diff based on alias

  ensureSnapshotDirs(); // Ensure directories exist

  // Check if the current snapshot file actually exists.
  // This is crucial because `Then I capture a snapshot` must have been run first.
  if (!fs.existsSync(paths.current)) {
    throw new Error(
      `Current snapshot file for alias "${alias}" not found at "${paths.current}".` +
        `Ensure "Then I capture a snapshot of the element {string} as {string}" was run successfully before this step.`
    );
  }

  // Load current image
  const currentImg = PNG.sync.read(fs.readFileSync(paths.current));

  let baselineImg: PNG | null = null;
  if (fs.existsSync(paths.baseline)) {
    // Load baseline image if it exists
    baselineImg = PNG.sync.read(fs.readFileSync(paths.baseline));
  }

  if (!baselineImg) {
    // If no baseline exists, create one from the current snapshot
    fs.copyFileSync(paths.current, paths.baseline);
    this.log?.(`✨ Created new baseline for snapshot "${alias}": "${paths.baseline}".`);
    return; // Pass the test if a new baseline was created
  }

  // Ensure images have the same dimensions for comparison
  if (baselineImg.width !== currentImg.width || baselineImg.height !== currentImg.height) {
    fs.writeFileSync(
      paths.diff,
      PNG.sync.write(
        new PNG({
          width: Math.max(baselineImg.width, currentImg.width),
          height: Math.max(baselineImg.height, currentImg.height),
        })
      )
    );
    throw new Error(
      `Visual element snapshot mismatch for "${alias}": Dimensions differ! ` +
        `Baseline: ${baselineImg.width}x${baselineImg.height}, Current: ${currentImg.width}x${currentImg.height}. ` +
        `Diff image generated at "${paths.diff}".`
    );
  }

  const { width, height } = baselineImg;
  const diffImg = new PNG({ width, height });

  // Compare images pixel by pixel
  const pixelDiff = pixelmatch(
    baselineImg.data,
    currentImg.data,
    diffImg.data,
    width,
    height,
    { threshold: 0.1 } // Consistent threshold
  );

  if (pixelDiff > 0) {
    // If differences found, write the diff image
    fs.writeFileSync(paths.diff, PNG.sync.write(diffImg));
    this.log?.(
      `❌ Visual mismatch detected for snapshot "${alias}". ${pixelDiff} pixels differ. Diff image: "${paths.diff}".`
    );
  }

  // Assert that no pixels differ
  expect(
    pixelDiff,
    `Visual element snapshot "${alias}" mismatch: ${pixelDiff} pixels differ.`
  ).toBe(0);
  this.log?.(`✅ Visual element snapshot "${alias}" matches baseline (0 pixels differ).`);
}
Then("The snapshot {string} should match baseline", Then_the_snapshot_should_match_baseline);
