import { setWorldConstructor, World, ITestCaseHookParameter } from "@cucumber/cucumber";
import { Browser, Page, BrowserContext, Locator, FrameLocator, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import { chromium } from "playwright";

dotenv.config();

const isHeadless = process.env.HEADLESS !== "false";
const slowMo = process.env.SLOWMO ? Number(process.env.SLOWMO) : 0;

// Define a minimal interface for the clock object you expect
// This is to help TypeScript understand the shape of context.clock
interface PlaywrightClock {
  setFixedTime(time: number | Date): Promise<void>;
  tick(ms: number): Promise<void>;
  restore(): Promise<void>;
}

// If you need to extend the Clock type, do it via module augmentation with compatible types.
// Otherwise, do not redeclare the 'clock' property to avoid type conflicts.
// Remove the BrowserContext augmentation for 'clock' to resolve the type error.

export interface TestConfig {
  enableScreenshots: boolean;
  enableVisualTest: boolean;
  artifactDir: string;
}

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  elements?: Locator;
  element?: Locator;
  frame?: FrameLocator;
  currentLocator?: Locator;

  data: Record<string, any> = {};
  logs: string[] = [];
  testName?: string;

  fakeTimersActive: boolean;

  config: TestConfig = {
    enableScreenshots: true,
    enableVisualTest: false,
    artifactDir: "test-artifacts",
  };

  constructor(options: import("@cucumber/cucumber").IWorldOptions) {
    super(options);
    this.fakeTimersActive = false;
  }

  async init(testInfo?: ITestCaseHookParameter) {
    const info =
      testInfo ?? ((this as any).parameters?.testInfo as ITestCaseHookParameter | undefined);
    const isMobile = info?.pickle.tags.some((tag) => tag.name === "@mobile");
    const device = isMobile ? devices["Pixel 5"] : undefined;

    this.browser = await chromium.launch({ headless: isHeadless, slowMo });

    this.context = await this.browser.newContext({
      ...(device || {}),
      recordVideo: { dir: `${this.config.artifactDir}/videos` },
    });

    // Important: Initialize clock mocking *before* navigating or interacting with the page
    // if you intend to use page.clock. This typically involves addInitScript.
    // However, the context.clock API does not usually require an init script for its methods.
    // If you explicitly loaded a mocking library, you'd do it here.
    // For just context.clock methods, they should be available.

    this.page = await this.context.newPage();
    this.testName = info?.pickle.name;
    this.log(`🧪 Initialized context${isMobile ? " (mobile)" : ""}`);
  }

  /**
   * Returns the current interaction scope: either the main page or active frame.
   */
  getScope(): Page | FrameLocator {
    return this.frame ?? this.page;
  }

  /**
   * Returns a Locator scoped to the current iframe or page.
   */
  getLocator(selector: string): Locator {
    return this.getScope().locator(selector);
  }

  exitIframe() {
    this.frame = undefined;
    this.log("⬅️ Exited iframe, scope is now main page");
  }

  log = (message: string) => {
    this.logs.push(message);
    console.log(`[LOG] ${message}`);
  };

  async cleanup(testInfo?: ITestCaseHookParameter) {
    try {
      await this.page?.close();
    } catch (err) {
      this.log(`⚠️ Error closing page: ${(err as Error).message}`);
    }

    try {
      await this.context?.close();
    } catch (err) {
      this.log(`⚠️ Error closing context: ${(err as Error).message}`);
    }
  }
}

setWorldConstructor(CustomWorld);
