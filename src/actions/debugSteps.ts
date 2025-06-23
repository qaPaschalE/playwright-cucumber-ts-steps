// e2e/step_definitions/common/actions/debugSteps.ts
import { When } from "@cucumber/cucumber";

/**
 * Pauses the test execution for debugging with a custom message.
 *
 * ```gherkin
 * When I debug with message {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I debug with message "Check login form"
 * ```
 * @category Debug Steps
 */
export async function When_I_debug_with_message(this: any, message: string) {
  await this.page.pause();
  this.log?.(`Paused test for debugging: ${message}`);
}
When("I debug with message {string}", When_I_debug_with_message);
