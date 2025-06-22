import fs from "fs";
import path from "path";
import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import type { CustomWorld } from "../helpers/world";

const BASELINE_DIR = path.resolve("e2e/snapshots/baseline");
const CURRENT_DIR = path.resolve("e2e/snapshots/current");
const DIFF_DIR = path.resolve("e2e/snapshots/diff");

function getSnapshotPaths(name: string) {
  const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return {
    baseline: path.join(BASELINE_DIR, `${safeName}.png`),
    current: path.join(CURRENT_DIR, `${safeName}.png`),
    diff: path.join(DIFF_DIR, `${safeName}.diff.png`),
  };
}

Then(
  "I should see the page matches the snapshot {string}",
  async function (this: CustomWorld, name: string) {
    const { page } = this;
    const paths = getSnapshotPaths(name);

    fs.mkdirSync(BASELINE_DIR, { recursive: true });
    fs.mkdirSync(CURRENT_DIR, { recursive: true });
    fs.mkdirSync(DIFF_DIR, { recursive: true });

    await page.screenshot({ path: paths.current, fullPage: true });

    if (!fs.existsSync(paths.baseline)) {
      fs.copyFileSync(paths.current, paths.baseline);
      this.log?.(`📸 Created baseline snapshot: ${paths.baseline}`);
      return;
    }

    const baseline = PNG.sync.read(fs.readFileSync(paths.baseline));
    const current = PNG.sync.read(fs.readFileSync(paths.current));
    const { width, height } = baseline;

    const diff = new PNG({ width, height });
    const pixelDiff = pixelmatch(baseline.data, current.data, diff.data, width, height, {
      threshold: 0.1,
    });

    if (pixelDiff > 0) {
      fs.writeFileSync(paths.diff, PNG.sync.write(diff));
      this.log?.(`❌ Visual mismatch detected, diff: ${paths.diff}`);
    }

    expect(pixelDiff, "Pixels that differ").toBe(0);
  }
);

Then(
  "I capture a snapshot of the element {string} as {string}",
  async function (this: CustomWorld, selector: string, alias: string) {
    const element = this.getScope().locator(selector);
    const pathCurrent = path.join(CURRENT_DIR, `${alias}.png`);
    fs.mkdirSync(CURRENT_DIR, { recursive: true });
    await element.screenshot({ path: pathCurrent });
    this.log?.(`📸 Snapshot for ${selector} saved as ${alias}`);
  }
);

Then(
  "The snapshot {string} should match baseline",
  async function (this: CustomWorld, alias: string) {
    const paths = getSnapshotPaths(alias);
    const current = PNG.sync.read(fs.readFileSync(paths.current));
    const baseline = fs.existsSync(paths.baseline)
      ? PNG.sync.read(fs.readFileSync(paths.baseline))
      : null;

    if (!baseline) {
      fs.copyFileSync(paths.current, paths.baseline);
      this.log?.(`📸 Created new baseline for ${alias}`);
      return;
    }

    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const pixelDiff = pixelmatch(baseline.data, current.data, diff.data, width, height, {
      threshold: 0.1,
    });

    if (pixelDiff > 0) {
      fs.writeFileSync(paths.diff, PNG.sync.write(diff));
      this.log?.(`⚠️ Snapshot mismatch: ${alias}`);
    }

    expect(pixelDiff).toBe(0);
  }
);
