// e2e/step_definitions/common/scrollSteps.ts
import { When } from "@cucumber/cucumber";

When("I scroll into view", async function () {
  const element = this.element;
  if (!element) throw new Error("No element selected");
  await element.scrollIntoViewIfNeeded();
  this.log("Scrolled selected element into view");
});

When("I scroll to position {int} {int}", async function (x: number, y: number) {
  await this.page.evaluate(([x, y]: [number, number]) => window.scrollTo(x, y), [x, y]);
  this.log(`Scrolled window to position: ${x}, ${y}`);
});

When("I scroll window to position {int} {int}", async function (x: number, y: number) {
  await this.page.evaluate(([x, y]: [number, number]) => window.scrollTo(x, y), [x, y]);
  this.log(`Window scrolled to: ${x}, ${y}`);
});

When("I scroll window to x {int} and y {int}", async function (x: number, y: number) {
  await this.page.evaluate(([x, y]: [number, number]) => window.scrollTo(x, y), [x, y]);
  this.log(`Window scrolled to coordinates: (${x}, ${y})`);
});
