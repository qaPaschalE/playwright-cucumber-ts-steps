// e2e/step_definitions/common/actions/debugSteps.ts
import { When } from "@cucumber/cucumber";

When("I debug with message {string}", async function (message: string) {
  await this.page.pause();
  this.log(`Paused test for debugging: ${message}`);
});
