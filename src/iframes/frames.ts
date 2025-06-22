import { When } from "@cucumber/cucumber";
// import { expect } from "@playwright/test";
import type { CustomWorld } from "../helpers/world";

When(
  "I find href in iframe {string} and store as {string}",
  async function (this: CustomWorld, iframeSelector: string, key: string) {
    const iframe = this.page.frameLocator(iframeSelector);
    const link = await iframe.locator("a[href]").first();
    const href = await link.getAttribute("href");

    if (!href) throw new Error("No link found in iframe.");
    this.data[key] = href;
  }
);
