import { setWorldConstructor, World, ITestCaseHookParameter } from "@cucumber/cucumber";
import { Browser, Page, BrowserContext, Locator, FrameLocator, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import { chromium } from "playwright";

dotenv.config();

const isHeadless = process.env.HEADLESS !== "false";
const slowMo = process.env.SLOWMO ? Number(process.env.SLOWMO) : 0;

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

  data: Record<string, any> = {};
  logs: string[] = [];
  testName?: string;

  config: TestConfig = {
    enableScreenshots: true,
    enableVisualTest: false,
    artifactDir: "test-artifacts",
  };

  async init(testInfo?: ITestCaseHookParameter) {
    const isMobile = testInfo?.pickle.tags.some((tag) => tag.name === "@mobile");
    const device = isMobile ? devices["Pixel 5"] : undefined;

    this.browser = await chromium.launch({ headless: isHeadless, slowMo });

    this.context = await this.browser.newContext({
      ...(device || {}),
      recordVideo: { dir: `${this.config.artifactDir}/videos` },
    });

    this.page = await this.context.newPage();
    this.testName = testInfo?.pickle.name;
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
    testInfo?.result?.status === "FAILED";

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
