// e2e/step_definitions/common/mouseSteps.ts
import { When } from "@cucumber/cucumber";
// import { parseHoverOptions } from "../helpers/utils/optionsUtils";
import { CustomWorld } from "../helpers/world";

// 🧭 SCROLLING
//

When(/^I scroll "([^"]+)" into view$/, async function (this: any, selector: string) {
  await this.page.locator(selector).scrollIntoViewIfNeeded();
});

When(
  /^I scroll "([^"]+)" to position x:(\d+) y:(\d+)$/,
  async function (this: any, selector: string, x: string, y: string) {
    await this.page.locator(selector).evaluate(
      (el: Element, x: string, y: string) => {
        el.scrollTo(parseInt(x), parseInt(y));
      },
      x,
      y
    );
  }
);

When(/^I scroll to coordinates x:(\d+) y:(\d+)$/, async function (this: any, x: string, y: string) {
  await this.page.evaluate(
    (x: string, y: string) => {
      window.scrollTo(parseInt(x), parseInt(y));
    },
    x,
    y
  );
});

When(
  /^I scroll window to position top:(\d+) left:(\d+)$/,
  async function (this: any, top: string, left: string) {
    await this.page.evaluate(
      (top: string, left: string) => {
        window.scrollTo({
          top: parseInt(top),
          left: parseInt(left),
          behavior: "smooth",
        });
      },
      top,
      left
    );
  }
);
When('I scroll to "{word}"', async function (this: CustomWorld, direction: string) {
  const validDirections = ["top", "bottom", "left", "right"];
  if (!validDirections.includes(direction)) {
    throw new Error(
      `Invalid scroll direction "${direction}". Must be one of: ${validDirections.join(", ")}.`
    );
  }

  await this.page.evaluate((dir) => {
    const scrollOptions: ScrollToOptions = {
      behavior: "smooth",
    };

    switch (dir) {
      case "top":
        scrollOptions.top = 0;
        break;
      case "bottom":
        scrollOptions.top = document.body.scrollHeight;
        break;
      case "left":
        scrollOptions.left = 0;
        break;
      case "right":
        scrollOptions.left = document.body.scrollWidth;
        break;
    }

    window.scrollTo(scrollOptions);
  }, direction);

  this.log?.(`🖱️ Scrolled to "${direction}"`);
  await this.page.waitForTimeout(500); // allow scroll to complete
});
When("I hover over the element {string}", async function (this: CustomWorld, selector: string) {
  const element = this.getScope().locator(selector);
  await element.hover();
  this.element = element;
  this.log?.(`🖱️ Hovered: ${selector}`);
});

When(
  "I move mouse to coordinates {int}, {int}",
  async function (this: CustomWorld, x: number, y: number) {
    await this.page.mouse.move(x, y);
    this.log?.(`🧭 Mouse moved to (${x}, ${y})`);
  }
);
