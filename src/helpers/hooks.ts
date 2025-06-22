import fs from "fs";
import path from "path";
import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  ITestCaseHookParameter,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import * as dotenv from "dotenv";
import { chromium, devices, Browser, BrowserContextOptions } from "playwright";
import { compareSnapshots } from "./compareSnapshots";
import { CustomWorld } from "./world";

// Set to 30 seconds
setDefaultTimeout(30 * 1000);
dotenv.config();

let sharedBrowser: Browser;

BeforeAll(async () => {
  sharedBrowser = await chromium.launch({
    headless: process.env.HEADLESS !== "false",
  });
  console.log("🚀 Launched shared browser for all scenarios");
});

AfterAll(async () => {
  await sharedBrowser?.close();
  console.log("🧹 Closed shared browser after all scenarios");
});

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const params = this.parameters || {};
  const ARTIFACT_DIR = params.artifactDir || process.env.TEST_ARTIFACT_DIR || "test-artifacts";
  const SCREENSHOT_DIR = path.resolve(ARTIFACT_DIR, "screenshots");
  const VIDEO_DIR = path.resolve(ARTIFACT_DIR, "videos");
  const TRACE_DIR = path.resolve(ARTIFACT_DIR, "traces");
  const SESSION_FILE = path.resolve(ARTIFACT_DIR, "auth-cookies", "session.json");

  this.data.artifactDir = ARTIFACT_DIR;
  this.data.screenshotDir = SCREENSHOT_DIR;
  this.data.videoDir = VIDEO_DIR;
  this.data.traceDir = TRACE_DIR;
  this.data.sessionFile = SESSION_FILE;

  // Modes: "false" | "fail" | "all"
  const traceMode = (params.enableTrace || process.env.ENABLE_TRACE || "false").toLowerCase();
  const screenshotMode = (
    params.enableScreenshots ||
    process.env.ENABLE_SCREENSHOTS ||
    "false"
  ).toLowerCase();
  const videoMode = (params.enableVideos || process.env.ENABLE_VIDEOS || "false").toLowerCase();

  this.data.traceMode = traceMode;
  this.data.screenshotMode = screenshotMode;
  this.data.videoMode = videoMode;

  const isMobileTag = scenario.pickle.tags.some((t) => t.name === "@mobile");
  const deviceName =
    params.device || process.env.MOBILE_DEVICE || (isMobileTag ? "iPhone 13 Pro" : null);
  const deviceSettings = deviceName ? devices[deviceName] : undefined;

  if (deviceName && !deviceSettings) {
    throw new Error(`🚫 Invalid MOBILE_DEVICE: "${deviceName}" is not recognized by Playwright.`);
  }

  const isVisualTest =
    params.enableVisualTest ??
    (process.env.ENABLE_VISUAL_TEST === "true" ||
      scenario.pickle.tags.some((t) => t.name === "@visual"));

  this.data.enableVisualTest = isVisualTest;
  if (isVisualTest) process.env.VISUAL_TEST = "true";

  const contextOptions: BrowserContextOptions = {
    ...(videoMode !== "false" ? { recordVideo: { dir: VIDEO_DIR } } : {}),
    ...(deviceSettings || {}),
  };

  if (fs.existsSync(SESSION_FILE)) {
    contextOptions.storageState = SESSION_FILE;
    this.log?.("✅ Reusing session from saved file.");
  }

  const context = await sharedBrowser.newContext(contextOptions);
  const page = await context.newPage();

  this.browser = sharedBrowser;
  this.context = context;
  this.page = page;

  if (traceMode !== "false") {
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
    this.data.tracingStarted = true;
    this.log?.(`🧪 Tracing started (${traceMode})`);
  }

  if (deviceName) this.log?.(`📱 Mobile emulation enabled (${deviceName})`);
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const name = scenario.pickle.name.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  const failed = scenario.result?.status === "FAILED";
  const mode = (value: string | undefined) => value?.toLowerCase();

  const screenshotMode = mode(this.parameters?.enableScreenshots || process.env.ENABLE_SCREENSHOTS);
  const videoMode = mode(this.parameters?.enableVideos || process.env.ENABLE_VIDEOS);
  const traceMode = mode(this.parameters?.enableTrace || process.env.ENABLE_TRACE);

  const shouldSaveScreenshot = screenshotMode === "all" || (screenshotMode === "fail" && failed);
  const shouldSaveVideo = videoMode === "all" || (videoMode === "fail" && failed);
  const shouldSaveTrace = traceMode === "all" || (traceMode === "fail" && failed);

  // 📸 Screenshot
  if (shouldSaveScreenshot && this.page) {
    const screenshotPath = path.join(
      this.data.screenshotDir,
      `${failed ? "failed-" : ""}${name}.png`
    );
    try {
      fs.mkdirSync(this.data.screenshotDir, { recursive: true });
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`🖼️ Screenshot saved: ${screenshotPath}`);
    } catch (err) {
      console.warn("❌ Failed to save screenshot:", err);
    }
  }

  // 🎥 Video
  if (this.page && videoMode !== "false") {
    try {
      const video = this.page.video();
      if (video) {
        const rawPath = await video.path();
        if (fs.existsSync(rawPath)) {
          const finalPath = path.join(this.data.videoDir, `${failed ? "failed-" : ""}${name}.webm`);
          fs.mkdirSync(this.data.videoDir, { recursive: true });
          shouldSaveVideo ? fs.renameSync(rawPath, finalPath) : fs.unlinkSync(rawPath);
          console.log(`${shouldSaveVideo ? "🎥 Video saved" : "🧹 Deleted video"}: ${finalPath}`);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Video error: ${(err as Error).message}`);
    }
  }

  // 🧪 Tracing
  if (this.context && this.data.tracingStarted) {
    const tracePath = path.join(this.data.artifactDir, "traces", `${name}.zip`);
    try {
      fs.mkdirSync(path.dirname(tracePath), { recursive: true });
      await this.context.tracing.stop({ path: tracePath });
      shouldSaveTrace
        ? console.log(`📦 Trace saved: ${tracePath}`)
        : (fs.existsSync(tracePath) && fs.unlinkSync(tracePath),
          console.log(`🧹 Trace discarded: ${tracePath}`));
    } catch (err) {
      console.warn("❌ Trace handling error:", err);
    }
  }

  // 🧪 Visual regression
  if (this.page && this.data.enableVisualTest) {
    const BASELINE_DIR = path.resolve(this.data.artifactDir, "snapshots/baseline");
    const DIFF_DIR = path.resolve(this.data.artifactDir, "snapshots/diff");

    fs.mkdirSync(BASELINE_DIR, { recursive: true });
    fs.mkdirSync(DIFF_DIR, { recursive: true });

    const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
    const actualPath = path.join(DIFF_DIR, `${name}.actual.png`);
    const diffPath = path.join(DIFF_DIR, `${name}.diff.png`);

    await this.page.screenshot({ path: actualPath, fullPage: true });

    if (!fs.existsSync(baselinePath)) {
      fs.copyFileSync(actualPath, baselinePath);
      console.log(`📸 Created baseline image: ${baselinePath}`);
    } else {
      try {
        const diffPixels = compareSnapshots({
          actualPath,
          baselinePath,
          diffPath,
          threshold: 0.1,
        });

        console.log(
          diffPixels > 0
            ? `⚠️ Visual diff found (${diffPixels} pixels): ${diffPath}`
            : "✅ No visual changes detected"
        );
      } catch (err) {
        console.warn("❌ Snapshot comparison failed:", err);
      }
    }
  }

  // Cleanup
  try {
    await this.cleanup(scenario);
  } catch (err) {
    this.log?.("❌ Error during cleanup: " + (err as Error).message);
  }
});
