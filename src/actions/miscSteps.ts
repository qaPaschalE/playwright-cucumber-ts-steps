import { When, setDefaultTimeout } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";
import { Locator, devices, BrowserContextOptions } from "@playwright/test";
import dayjs from "dayjs";
import {
  parseClickOptions,
  parseCheckOptions,
  parseFillOptions,
  parseHoverOptions,
  parseUncheckOptions,
} from "../helpers/utils/optionsUtils"; // Assuming this path is correct
import { normalizeDeviceName } from "../helpers/utils/resolveUtils"; // Assuming this path is correct
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// UTILITY ACTIONS: TIMERS
// ===================================================================================

/**
 * Enables fake timers for the current page, fixing the time at the moment this step is executed.
 * This is useful for testing time-dependent UI components without actual time passing.
 *
 * ```gherkin
 * When I use fake timers
 * ```
 *
 * @example
 * When I use fake timers
 * And I go to "/countdown-page"
 * When I advance timers by 1000 milliseconds
 * Then I should see text "9 seconds remaining"
 *
 * @remarks
 * This step uses Playwright's `page.clock.setFixedTime()` to control the browser's internal
 * clock. All subsequent time-related operations (like `setTimeout`, `setInterval`, `Date.now()`)
 * will operate based on this fixed time. Use {@link When_I_advance_timers_by_milliseconds | "When I advance timers by X milliseconds"}
 * or {@link When_I_advance_timers_by_seconds | "When I advance timers by X seconds"} to progress time.
 * To revert, use {@link When_I_use_real_timers | "When I use real timers"}.
 * @category Timer Steps
 */
export async function When_I_use_fake_timers(this: CustomWorld) {
  const initialTime = Date.now();
  await this.page.clock.setFixedTime(initialTime);
  this.fakeTimersActive = true; // Assuming CustomWorld has a fakeTimersActive property
  this.log?.(`⏱️ Fake timers enabled, fixed at ${new Date(initialTime).toISOString()}`);
}
When(/^I use fake timers$/, When_I_use_fake_timers);

/**
 * Restores real timers for the current page, releasing control over the browser's internal clock.
 *
 * ```gherkin
 * When I use real timers
 * ```
 *
 * @example
 * When I use fake timers
 * When I advance timers by 10 seconds
 * When I use real timers
 *
 * @remarks
 * This step uses Playwright's `page.clock.useRealTimers()`. After this step, `setTimeout`, `setInterval`,
 * and other time-related functions will behave normally, using the system's real time.
 * @category Timer Steps
 */
export async function When_I_use_real_timers(this: CustomWorld) {
  // FIX: Use 'as any' to tell TypeScript that this property exists at runtime.
  // This is a common workaround for experimental/plugin-like APIs that aren't fully typed.
  await (this.page.clock as any).useRealTimers();
  this.fakeTimersActive = false;
  this.log?.(`⏱️ Real timers restored.`);
}
When(/^I use real timers$/, When_I_use_real_timers);
export async function When_I_advance_timers_by_milliseconds(this: CustomWorld, ms: number) {
  if (this.fakeTimersActive) {
    // FIX: Use 'as any' for tick()
    await (this.page.clock as any).tick(ms);
    this.log?.(`⏱️ Advanced fake timers by ${ms} milliseconds.`);
  } else {
    this.log?.("⚠️ Real timers are active. `When I advance timers by...` has no effect.");
  }
}
When(/^I advance timers by (\d+) milliseconds$/, When_I_advance_timers_by_milliseconds); // This line remains unchanged

/**
 * Advances fake timers by the given number of seconds. Requires fake timers to be enabled.
 *
 * ```gherkin
 * When I advance timers by {int} seconds
 * ```
 *
 * @param seconds - The number of seconds to advance the fake clock by.
 *
 * @example
 * When I use fake timers
 * When I advance timers by 2 seconds
 *
 * @remarks
 * This step converts seconds to milliseconds and uses Playwright's `page.clock.tick()`.
 * It will only have an effect if {@link When_I_use_fake_timers | "When I use fake timers"}
 * has been called previously. If real timers are active, a warning will be logged.
 * @category Timer Steps
 */
export async function When_I_advance_timers_by_seconds(this: CustomWorld, seconds: number) {
  const ms = seconds * 1000;
  if (this.fakeTimersActive) {
    // FIX: Use 'as any' for tick()
    await (this.page.clock as any).tick(ms);
    this.log?.(`⏱️ Advanced fake timers by ${seconds} seconds.`);
  } else {
    this.log?.("⚠️ Real timers are active. `When I advance timers by...` has no effect.");
  }
}
// This line remains unchanged, as it's just the Cucumber step definition linking to the function
// When(/^I advance timers by (\d+) seconds$/, When_I_advance_timers_by_seconds);
/**
 * Waits for the given number of seconds using `setTimeout`. This is a real-time wait.
 *
 * ```gherkin
 * When I wait {int} second[s]
 * ```
 *
 * @param seconds - The number of seconds to wait.
 *
 * @example
 * When I wait 3 seconds
 *
 * @remarks
 * This step pauses test execution for the specified duration using Node.js `setTimeout`.
 * It's generally preferred to use explicit waits for element conditions (e.g., `toBeVisible`)
 * over arbitrary waits, but this can be useful for debugging or waiting for external factors.
 * @category General Action Steps
 */
export async function When_I_wait_seconds(seconds: number) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
When(/^I wait (\d+) second[s]?$/, When_I_wait_seconds);

/**
 * Waits for the given number of milliseconds using `setTimeout`. This is a real-time wait.
 *
 * ```gherkin
 * When I wait {int} millisecond[s]
 * ```
 *
 * @param ms - The number of milliseconds to wait.
 *
 * @example
 * When I wait 500 milliseconds
 *
 * @remarks
 * This step pauses test execution for the specified duration using Node.js `setTimeout`.
 * It's generally preferred to use explicit waits for element conditions (e.g., `toBeVisible`)
 * over arbitrary waits, but this can be useful for debugging or waiting for external factors.
 * @category General Action Steps
 */
export async function When_I_wait_milliseconds(this: CustomWorld, ms: number) {
  await new Promise((res) => setTimeout(res, ms));
}
When(/^I wait (\d+) millisecond[s]?$/, When_I_wait_milliseconds);

/**
 * Sets the default step timeout for all subsequent Cucumber steps.
 * This can override the global timeout set in `cucumber.js` configuration.
 *
 * ```gherkin
 * When I set step timeout to {int} ms
 * ```
 *
 * @param timeoutMs - The new default timeout in milliseconds.
 *
 * @example
 * When I set step timeout to 10000 ms
 * And I find element by selector "#slow-loading-element"
 *
 * @remarks
 * This step uses Cucumber's `setDefaultTimeout()` function. It applies to all following
 * steps within the same test run. Use with caution as setting very high timeouts can
 * hide performance issues.
 * @category Configuration Steps
 */
export function When_I_set_step_timeout_to(this: CustomWorld, timeoutMs: number) {
  setDefaultTimeout(timeoutMs);
  this.log?.(`⏱️ Default Cucumber step timeout set to ${timeoutMs}ms`);
}
When("I set step timeout to {int} ms", When_I_set_step_timeout_to);

// ===================================================================================
// UTILITY ACTIONS: EVENTS
// ===================================================================================

/**
 * Triggers a generic DOM event of the given type on the element matching the provided selector.
 *
 * ```gherkin
 * When I trigger {string} event on {string}
 * ```
 *
 * @param eventType - The type of DOM event to trigger (e.g., "change", "input", "focus").
 * @param selector - The CSS selector of the element to trigger the event on.
 *
 * @example
 * When I trigger "change" event on ".my-input"
 *
 * @remarks
 * This step uses Playwright's `locator.evaluate()` to dispatch a new `Event` directly
 * on the DOM element. It can be useful for simulating browser-level events that
 * might not be covered by Playwright's high-level actions (like `fill` for `input` events).
 * @category Event Steps
 */
export async function When_I_trigger_event_on_selector(
  this: CustomWorld,
  eventType: string,
  selector: string
) {
  await this.page.locator(selector).evaluate((el: HTMLElement, type: string) => {
    const event: Event = new Event(type, {
      bubbles: true,
      cancelable: true,
    });
    el.dispatchEvent(event);
  }, eventType);
  this.log?.(`💥 Triggered "${eventType}" event on element with selector "${selector}".`);
}
When(/^I trigger "(.*)" event on "([^"]+)"$/, When_I_trigger_event_on_selector);

/**
 * Triggers a generic DOM event of the given type on the previously selected element.
 *
 * ```gherkin
 * When I trigger event {string}
 * ```
 *
 * @param eventName - The name of the event to dispatch (e.g., "change", "input", "blur").
 *
 * @example
 * When I find element by selector ".my-input"
 * And I trigger event "change"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It uses Playwright's `locator.dispatchEvent()` to dispatch the specified event.
 * @category Event Steps
 */
export async function When_I_trigger_event(this: CustomWorld, eventName: string) {
  if (!this.element) throw new Error("No element selected to trigger event on.");
  await this.element.dispatchEvent(eventName);
  this.log?.(`💥 Triggered "${eventName}" event on selected element.`);
}
When("I trigger event {string}", When_I_trigger_event);

/**
 * Removes focus from the previously selected element.
 *
 * ```gherkin
 * When I blur
 * ```
 *
 * @example
 * When I find element by selector "input[name='username']"
 * And I blur
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It uses `locator.evaluate()` to call the DOM `blur()` method on the element,
 * simulating a loss of focus.
 * @category Event Steps
 */
export async function When_I_blur(this: CustomWorld) {
  if (!this.element) throw new Error("No element selected to blur.");
  await this.element.evaluate((el: HTMLElement) => el.blur());
  this.log?.(`👁️‍🗨️ Blurred selected element.`);
}
When("I blur", When_I_blur);

/**
 * Focuses the previously selected element.
 *
 * ```gherkin
 * When I focus
 * ```
 *
 * @example
 * When I find element by selector "input[name='search']"
 * And I focus
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It uses Playwright's `locator.focus()` to bring the element into focus, simulating
 * a user tabbing to or clicking on the element.
 * @category Event Steps
 */
export async function When_I_focus(this: CustomWorld) {
  if (!this.element) throw new Error("No element selected to focus.");
  await this.element.focus();
  this.log?.(`👁️‍🗨️ Focused selected element.`);
}
When("I focus", When_I_focus);

// ===================================================================================
// UTILITY ACTIONS: DEBUGGING / LOGGING
// ===================================================================================

/**
 * Logs a message to the test output (stdout/console).
 *
 * ```gherkin
 * When I log {string}
 * ```
 *
 * @param message - The string message to log.
 *
 * @example
 * When I log "Test scenario started"
 *
 * @remarks
 * This step is useful for injecting debugging or informative messages directly
 * into the Cucumber test report or console output during test execution.
 * @category Debugging Steps
 */
export async function When_I_log(this: CustomWorld, message: string) {
  this.log(message);
}
When("I log {string}", When_I_log);

/**
 * Triggers a debugger statement, pausing test execution if a debugger is attached.
 *
 * ```gherkin
 * When I debug
 * ```
 *
 * @example
 * When I find element by selector "#problematic-button"
 * And I debug
 * When I click current element
 *
 * @remarks
 * This step is extremely useful for interactive debugging. When executed with a debugger
 * (e.g., VS Code debugger attached to your Node.js process), it will pause execution
 * at this point, allowing you to inspect the browser state, variables, etc.
 * @category Debugging Steps
 */
export async function When_I_debug() {
  debugger; // This will pause execution if a debugger is attached
}
When(/^I debug$/, When_I_debug);

// ===================================================================================
// UTILITY ACTIONS: SCREENSHOT
// ===================================================================================

/**
 * Takes a full-page screenshot of the current page and saves it with the given name.
 * The screenshot will be saved in the `e2e/screenshots/` directory (relative to your project root).
 *
 * ```gherkin
 * When I screenshot {string}
 * ```
 *
 * @param name - The desired filename for the screenshot (without extension).
 *
 * @example
 * When I screenshot "dashboard-view"
 *
 * @remarks
 * This step creates a PNG image. The `fullPage: true` option ensures that the
 * entire scrollable height of the page is captured.
 * @category Screenshot Steps
 */
export async function When_I_screenshot_named(this: CustomWorld, name: string) {
  const screenshotPath = `e2e/screenshots/${name}.png`;
  await this.page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  this.log?.(`📸 Saved screenshot to "${screenshotPath}"`);
}
When(/^I screenshot "(.*)"$/, When_I_screenshot_named);

/**
 * Takes a full-page screenshot of the current page and saves it with a timestamped filename.
 * The screenshot will be saved in the `screenshots/` directory (relative to your project root).
 *
 * ```gherkin
 * When I screenshot
 * ```
 *
 * @example
 * When I screenshot
 *
 * @remarks
 * This step is useful for quick visual debugging or capturing the state of the UI at
 * various points in the test without needing to manually name each file.
 * The filename will be in the format `screenshots/screenshot-TIMESTAMP.png`.
 * @category Screenshot Steps
 */
export async function When_I_screenshot(this: CustomWorld) {
  const screenshotPath = `screenshots/screenshot-${Date.now()}.png`;
  await this.page.screenshot({ path: screenshotPath, fullPage: true });
  this.log?.(`📸 Saved screenshot to "${screenshotPath}"`);
}
When("I screenshot", When_I_screenshot);

// ===================================================================================
// UTILITY ACTIONS: PAGE NAVIGATION
// ===================================================================================

/**
 * Navigates the browser to the given URL or an aliased URL.
 * If a relative path is provided (starts with `/`), it will be prepended with `process.env.BASE_URL`.
 *
 * ```gherkin
 * When I visit {string}
 * ```
 *
 * @param urlOrAlias - The URL to visit, or an alias (prefixed with `@`) pointing to a URL.
 *
 * @example
 * When I visit "/dashboard"
 * When I visit "https://www.example.com"
 * Given I store "https://my.app.com/profile" as "profilePageUrl"
 * When I visit "@profilePageUrl"
 *
 * @remarks
 * This step uses Playwright's `page.goto()`. Ensure `BASE_URL` environment variable is set
 * if you are using relative paths.
 * @category Page Navigation Steps
 */
export async function When_I_visit(this: CustomWorld, urlOrAlias: string) {
  let url = urlOrAlias;

  if (url.startsWith("@")) {
    const alias = url.substring(1);
    url = this.data[alias];
    if (!url) throw new Error(`Alias "@${alias}" not found in test data.`);
    this.log?.(`🔗 Resolved alias "@${alias}" to URL: "${url}"`);
  }

  if (url.startsWith("/")) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl)
      throw new Error("BASE_URL environment variable is not defined. Cannot visit relative URL.");
    // Ensure no double slashes if BASE_URL already ends with one
    url = `${baseUrl.replace(/\/+$/, "")}${url}`;
  }

  this.log?.(`🌍 Navigating to: "${url}"`);
  await this.page.goto(url);
}
When("I visit {string}", When_I_visit);

/**
 * Reloads the current page.
 *
 * ```gherkin
 * When I reload the page
 * ```
 *
 * @example
 * When I reload the page
 *
 * @remarks
 * This step is equivalent to hitting the browser's reload button.
 * It uses Playwright's `page.reload()`.
 * @category Page Navigation Steps
 */
export async function When_I_reload_the_page(this: CustomWorld) {
  await this.page.reload();
  this.log?.(`🔄 Reloaded the current page.`);
}
When("I reload the page", When_I_reload_the_page);

/**
 * Navigates back in the browser's history.
 *
 * ```gherkin
 * When I go back
 * ```
 *
 * @example
 * Given I visit "/page1"
 * And I visit "/page2"
 * When I go back
 * Then I should be on "/page1"
 *
 * @remarks
 * This step is equivalent to hitting the browser's back button.
 * It uses Playwright's `page.goBack()`.
 * @category Page Navigation Steps
 */
export async function When_I_go_back(this: CustomWorld) {
  await this.page.goBack();
  this.log?.(`⬅️ Navigated back in browser history.`);
}
When("I go back", When_I_go_back);

/**
 * Navigates forward in the browser's history.
 *
 * ```gherkin
 * When I go forward
 * ```
 *
 * @example
 * Given I visit "/page1"
 * And I visit "/page2"
 * When I go back
 * When I go forward
 * Then I should be on "/page2"
 *
 * @remarks
 * This step is equivalent to hitting the browser's forward button.
 * It uses Playwright's `page.goForward()`.
 * @category Page Navigation Steps
 */
export async function When_I_go_forward(this: CustomWorld) {
  await this.page.goForward();
  this.log?.(`➡️ Navigated forward in browser history.`);
}
When("I go forward", When_I_go_forward);

/**
 * Pauses the test execution in debug mode.
 * This is useful for inspecting the browser state interactively during test runs.
 *
 * ```gherkin
 * When I pause
 * ```
 *
 * @example
 * When I perform an action
 * And I pause
 * Then I assert something visually
 *
 * @remarks
 * When running tests in debug mode (e.g., with `npx playwright test --debug`),
 * this step will open Playwright's inspector, allowing you to step through
 * actions, inspect elements, and troubleshoot. The test will resume when you
 * continue from the inspector.
 * @category Debugging Steps
 */
export async function When_I_pause(this: CustomWorld) {
  await this.page.pause();
  this.log?.(`⏸️ Test paused. Use Playwright Inspector to continue.`);
}
When("I pause", When_I_pause);

// ===================================================================================
// UTILITY ACTIONS: DATE/TIME ALIASING
// ===================================================================================

const validDateUnits = [
  "second",
  "seconds",
  "minute",
  "minutes",
  "hour",
  "hours",
  "day",
  "days",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
];

/**
 * Stores a new date calculated by offsetting an existing aliased date by a given amount and unit.
 *
 * ```gherkin
 * When I store {string} {int} {word} {word} as "{word}"
 * ```
 *
 * @param baseAlias - The alias of an existing date string in `this.data` (e.g., "today").
 * @param amount - The numerical amount to offset by (e.g., 2, 5).
 * @param unit - The unit of time (e.g., "days", "months", "hours").
 * @param direction - Whether to offset "before" or "after" the base date.
 * @param newAlias - The alias under which to store the newly calculated date.
 *
 * @example
 * Given I store "2024-01-15" as "invoiceDate"
 * When I store "invoiceDate" 30 days after as "dueDate"
 * Then the value of alias "dueDate" should be "2024-02-14"
 *
 * @remarks
 * This step uses the `dayjs` library for date manipulation. The `baseAlias` must
 * point to a valid date string that `dayjs` can parse. The `unit` must be one of:
 * "second", "minute", "hour", "day", "week", "month", "year" (plural forms also supported).
 * The new date is stored in `this.data` in "YYYY-MM-DD" format.
 * @category Data Manipulation Steps
 */
export async function When_I_store_date_offset(
  this: CustomWorld,
  baseAlias: string,
  amount: number,
  unit: string,
  direction: string, // "before" or "after"
  newAlias: string
) {
  const baseDateRaw = this.data?.[baseAlias];
  if (!baseDateRaw) throw new Error(`Alias "${baseAlias}" not found in test data.`);
  if (!validDateUnits.includes(unit)) {
    throw new Error(`Invalid unit "${unit}". Valid units are: ${validDateUnits.join(", ")}.`);
  }
  if (!["before", "after"].includes(direction)) {
    throw new Error(`Invalid direction "${direction}". Must be "before" or "after".`);
  }

  const baseDate = dayjs(baseDateRaw);
  if (!baseDate.isValid()) {
    throw new Error(`Value for alias "${baseAlias}" ("${baseDateRaw}") is not a valid date.`);
  }

  const result = baseDate[direction === "before" ? "subtract" : "add"](
    amount,
    unit as dayjs.ManipulateType
  );
  const formatted = result.format("YYYY-MM-DD");

  this.data[newAlias] = formatted;
  this.log?.(
    `📅 Stored ${amount} ${unit} ${direction} "${baseAlias}" as "@${newAlias}" = "${formatted}"`
  );
}
When('I store {string} {int} {word} {word} as "{word}"', When_I_store_date_offset);

// ===================================================================================
// UTILITY ACTIONS: IFRAME
// ===================================================================================

/**
 * Switches the current Playwright context to an iframe located by a CSS selector.
 * The step waits for the iframe's `body` element to be visible before proceeding.
 *
 * ```gherkin
 * When I switch to iframe with selector {string}
 * ```
 *
 * @param selector - The CSS selector for the iframe element (e.g., "#my-iframe", "iframe[name='chatFrame']").
 *
 * @example
 * When I switch to iframe with selector "#payment-form-iframe"
 * And I find element by placeholder text "Card Number"
 * And I type "1234..."
 *
 * @remarks
 * Once inside an iframe, all subsequent element finding and interaction steps will
 * target elements within that iframe. To exit the iframe context, use
 * {@link When_I_exit_iframe | "When I exit iframe"}.
 * @category IFrame Steps
 */
export async function When_I_switch_to_iframe_with_selector(this: CustomWorld, selector: string) {
  const frameLocator = this.page.frameLocator(selector);
  // Wait for an element inside the iframe to ensure it's loaded and ready
  await frameLocator.locator("body").waitFor({ state: "visible", timeout: 10000 });
  this.frame = frameLocator; // Store the frame locator in CustomWorld context
  this.log?.(`🪟 Switched to iframe with selector: "${selector}".`);
}
When("I switch to iframe with selector {string}", When_I_switch_to_iframe_with_selector);

/**
 * Switches the current Playwright context to an iframe located by its title attribute.
 *
 * ```gherkin
 * When I switch to iframe with title {string}
 * ```
 *
 * @param title - The title of the iframe to switch to.
 *
 * @example
 * When I switch to iframe with title "My Iframe"
 * And I find element by label text "Card Holder"
 *
 * @remarks
 * This step iterates through all frames on the page to find one whose title matches
 * (case-insensitively, partially matched with `includes`). Once found, subsequent
 * element operations will target elements within this iframe. To exit, use
 * {@link When_I_exit_iframe | "When I exit iframe"}.
 * @category IFrame Steps
 */
export async function When_I_switch_to_iframe_with_title(this: CustomWorld, title: string) {
  // Find the frame by title first to ensure it exists before creating locator
  const frames = this.page.frames();
  const foundFrame = await Promise.race(
    frames.map(async (f) => {
      const frameTitle = await f.title();
      return frameTitle.includes(title) ? f : null;
    })
  );

  if (!foundFrame) throw new Error(`No iframe with title "${title}" found.`);

  // Playwright recommends using frameLocator for interacting with iframes,
  // even if found via frame object.
  this.frame = this.page.frameLocator(`iframe[title*="${title}"]`);
  this.log?.(`🪟 Switched to iframe titled: "${title}".`);
}
When("I switch to iframe with title {string}", When_I_switch_to_iframe_with_title);

/**
 * Switches the current Playwright context to an iframe located by a CSS selector,
 * and then waits for specific text to become visible inside that iframe.
 *
 * ```gherkin
 * When I switch to iframe with selector {string} and wait for text {string}
 * ```
 *
 * @param selector - The CSS selector for the iframe element.
 * @param expectedText - The text string to wait for inside the iframe.
 *
 * @example
 * When I switch to iframe with selector "#dynamic-content-iframe" and wait for text "Content Loaded"
 *
 * @remarks
 * This step combines switching into an iframe with a wait condition, which is
 * useful for dynamic iframe content. The `expectedText` must be present
 * and visible inside the iframe. To exit the iframe context, use
 * {@link When_I_exit_iframe | "When I exit iframe"}.
 * @category IFrame Steps
 */
export async function When_I_switch_to_iframe_with_selector_and_wait_for_text(
  this: CustomWorld,
  selector: string,
  expectedText: string
) {
  const frameLocator = this.page.frameLocator(selector);
  // Wait for the specific text inside the iframe
  await frameLocator.locator(`text=${expectedText}`).waitFor({ timeout: 10000 });
  this.frame = frameLocator;
  this.log?.(
    `🪟 Switched to iframe with selector: "${selector}", and waited for text: "${expectedText}".`
  );
}
When(
  "I switch to iframe with selector {string} and wait for text {string}",
  When_I_switch_to_iframe_with_selector_and_wait_for_text
);

/**
 * Exits the current iframe context, returning the Playwright context to the main page.
 * All subsequent element finding and interaction steps will operate on the main page.
 *
 * ```gherkin
 * When I exit iframe
 * ```
 *
 * @example
 * When I switch to iframe with selector "#my-iframe"
 * And I fill "my data"
 * When I exit iframe
 * And I click "Main Page Button"
 *
 * @remarks
 * This step is crucial for navigating back to the main document after interacting
 * with elements inside an iframe. It sets `this.frame` back to `undefined` (or the main page locator).
 * @category IFrame Steps
 */
export function When_I_exit_iframe(this: CustomWorld) {
  this.exitIframe(); // Assuming CustomWorld has an exitIframe method
  this.log?.(`🪟 Exited iframe context, now interacting with the main page.`);
}
When("I exit iframe", When_I_exit_iframe);

// ===================================================================================
// UTILITY ACTIONS: REUSABLE ACTIONS ON STORED ELEMENTS
// ===================================================================================

// Helper functions (keep these outside the exports or as internal helpers)
function toOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

async function getReadableLabel(el: Locator): Promise<string> {
  try {
    const tag = await el.evaluate((el) => el.tagName.toLowerCase());
    return tag === "input" ? await el.inputValue() : (await el.innerText()).trim();
  } catch {
    return "(unknown)";
  }
}

// Helper to get a subset of elements (first, last, random, or specific nth for action)
async function getElementsSubset(
  world: CustomWorld,
  mode: string,
  count: number
): Promise<Locator[]> {
  const total = await world.elements?.count();
  if (!total || total < 1) throw new Error("No elements stored in 'this.elements' collection.");
  if (count > total) throw new Error(`Cannot get ${count} elements, only ${total} available.`);

  switch (mode) {
    case "first":
      return Array.from({ length: count }, (_, i) => world.elements!.nth(i));
    case "last":
      return Array.from({ length: count }, (_, i) => world.elements!.nth(total - count + i));
    case "random":
      // Generate unique random indices
      const indices = new Set<number>();
      while (indices.size < count) {
        indices.add(Math.floor(Math.random() * total));
      }
      return Array.from(indices).map((i) => world.elements!.nth(i));
    case "nth": // Used specifically by the "I (action) the Nth element" step
      if (count < 1) throw new Error(`Invalid Nth element index: ${count}. Must be 1 or greater.`);
      if (count > total)
        throw new Error(`Cannot get ${toOrdinal(count)} element, only ${total} available.`);
      return [world.elements!.nth(count - 1)]; // Return as array for consistent loop below
    default:
      throw new Error(`Unsupported subset mode: "${mode}".`);
  }
}

// Define the supported actions and their display names for logging
type LocatorAction = "click" | "hover" | "check" | "uncheck" | "focus" | "blur" | "fill";

const actionDisplayNames: Record<LocatorAction, string> = {
  click: "Clicked",
  hover: "Hovered",
  check: "Checked",
  uncheck: "Unchecked",
  focus: "Focused",
  blur: "Blurred",
  fill: "Filled",
};

// Define the functions that perform the Playwright actions on a locator
const locatorActions: Record<LocatorAction, (el: Locator, table?: DataTable) => Promise<void>> = {
  click: (el, table) => el.click(parseClickOptions(table)),
  hover: (el, table) => el.hover(parseHoverOptions(table)),
  check: (el, table) => el.check(parseCheckOptions(table)),
  uncheck: (el, table) => el.uncheck(parseUncheckOptions(table)),
  focus: (el) => el.focus(),
  blur: (el) => el.evaluate((e: HTMLElement) => e.blur()),
  fill: (el, table) => el.fill("", parseFillOptions(table)), // This `fill` is generic. If you need to fill with a specific value from the step,
  // you'll need to pass it as an argument to the actionFn in the step definition.
  // For now, it's just clearing.
};

/**
 * Performs a specified action (e.g., click, hover, check, uncheck, focus, blur)
 * on a subset of the previously stored elements (first N, last N, or random N).
 *
 * ```gherkin
 * When I {word} the {word} {int}
 * ```
 *
 * @param action - The action to perform (e.g., "click", "hover", "check", "uncheck", "focus", "blur", "fill").
 * @param mode - The selection mode: "first", "last", or "random".
 * @param count - The number of elements to apply the action to.
 * @param table - (Optional) A Cucumber DataTable for action-specific options (e.g., `ClickOptions`).
 *
 * @example
 * Given I find elements by selector ".item-checkbox"
 * When I check the first 2
 * When I hover the last 3
 *
 * @remarks
 * This step requires that `this.elements` (a Playwright `Locator` that points to multiple
 * elements) has been populated by a preceding step (e.g., `When I find elements by selector`).
 * The `action` must be one of the supported actions. The `count` specifies how many of
 * the matched elements to target.
 * @category Multi-Element Action Steps
 */
export async function When_I_perform_action_on_subset_of_elements(
  this: CustomWorld,
  action: string,
  mode: string,
  count: number,
  table?: DataTable
) {
  const elements = await getElementsSubset(this, mode, count);
  const actionFn = locatorActions[action as LocatorAction];

  if (!actionFn) throw new Error(`Unsupported action: "${action}".`);

  for (const el of elements) {
    const label = await getReadableLabel(el);
    await actionFn(el, table);
    this.log?.(`✅ ${actionDisplayNames[action as LocatorAction] || action} element: "${label}".`);
  }
}
When(/^I (\w+) the (first|last|random) (\d+)$/, When_I_perform_action_on_subset_of_elements);

/**
 * Performs a specified action (e.g., click, hover, check, uncheck, focus, blur)
 * on the Nth element of the previously stored elements collection.
 *
 * ```gherkin
 * When I {word} the {int}(?:st|nd|rd|th) element
 * ```
 *
 * @param action - The action to perform (e.g., "click", "hover", "check", "uncheck", "focus", "blur", "fill").
 * @param nth - The 1-based index of the element to target (e.g., 1 for 1st, 2 for 2nd).
 * @param table - (Optional) A Cucumber DataTable for action-specific options.
 *
 * @example
 * Given I find elements by selector ".product-card"
 * When I click the 2nd element
 * When I fill the 1st element
 *
 * @remarks
 * This step requires that `this.elements` has been populated by a preceding step.
 * It targets a single element at a specific 1-based ordinal position within that collection.
 * The `action` must be one of the supported actions.
 * @category Multi-Element Action Steps
 */
export async function When_I_perform_action_on_nth_element(
  this: CustomWorld,
  action: string,
  nth: number,
  table?: DataTable
) {
  // Use "nth" mode with getElementsSubset to correctly fetch a single element
  const elements = await getElementsSubset(this, "nth", nth); // This will return an array with one element
  const targetElement = elements[0]; // Get the single element

  const actionFn = locatorActions[action as LocatorAction];
  if (!actionFn) throw new Error(`Unsupported action: "${action}".`);

  const label = await getReadableLabel(targetElement);
  await actionFn(targetElement, table);
  this.log?.(
    `✅ ${actionDisplayNames[action as LocatorAction] || action} the ${toOrdinal(nth)} element: "${label}".`
  );
}
When(/^I (\w+) the (\d+)(?:st|nd|rd|th) element$/, When_I_perform_action_on_nth_element);

/**
 * Presses a specific key on the previously selected element.
 *
 * ```gherkin
 * When I press key {string}
 * ```
 *
 * @param key - The key to press (e.g., "Enter", "Escape", "ArrowDown", "Tab").
 *
 * @example
 * When I find element by selector "input[name='email']"
 * And I type "my query"
 * When I press key "Enter"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It first focuses the element and then simulates a key press.
 * This is useful for triggering keyboard shortcuts or submitting forms via "Enter".
 * @category Keyboard Interaction Steps
 */
export async function When_I_press_key(this: CustomWorld, key: string) {
  if (!this.element) throw new Error("No element selected to press key on.");

  await this.element.focus();
  await this.page.waitForTimeout(50); // Small buffer to ensure focus
  await this.element.press(key);
  this.log?.(`🎹 Pressed key "{${key}}" on selected element.`);
}
When("I press key {string}", When_I_press_key);

// ===================================================================================
// UTILITY ACTIONS: VIEWPORT
// ===================================================================================

/**
 * Sets the browser viewport to emulate a specific Playwright device profile and orientation.
 * This will close the current browser context and open a new one with the specified device settings.
 *
 * ```gherkin
 * When I set viewport to {string}
 * When I set viewport to {string} and {string}
 * ```
 *
 * @param deviceInput - The name of the Playwright device (e.g., "iPhone 12", "iPad", "Desktop Chrome").
 * @param orientation - (Optional) The orientation, either "landscape" or "portrait" (default if not specified).
 *
 * @example
 * When I set viewport to "iPhone 12"
 * When I set viewport to "iPad" and "landscape"
 *
 * @remarks
 * This step creates a *new* browser context and page, so any previous page state or
 * setup (like routes, localStorage) will be reset.
 * The `deviceInput` is normalized to match Playwright's `devices` object keys.
 * @category Browser Context Steps
 */
export async function When_I_set_viewport_to_device(
  this: CustomWorld,
  deviceInput: string,
  orientation?: string
) {
  const normalizedDevice = normalizeDeviceName(deviceInput);
  if (!normalizedDevice) {
    throw new Error(
      `🚫 Unknown device name: "${deviceInput}". Check Playwright 'devices' for valid names.`
    );
  }

  const baseDevice = devices[normalizedDevice];
  if (!baseDevice) {
    throw new Error(`🚫 Playwright device not found for normalized name: "${normalizedDevice}".`);
  }

  const isLandscape = orientation?.toLowerCase() === "landscape";
  const deviceSettings: BrowserContextOptions = isLandscape
    ? (baseDevice as any).landscape // Use Playwright's built-in landscape config if available
      ? (baseDevice as any).landscape
      : {
          // Otherwise, manually adjust for landscape
          ...baseDevice,
          isMobile: true, // Assuming mobile devices for landscape adjustment
          viewport: {
            width: baseDevice.viewport.height, // Swap width and height for landscape
            height: baseDevice.viewport.width,
          },
        }
    : baseDevice; // Use base device settings for portrait or non-mobile

  // Close current context and page before creating a new one
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();

  this.context = await this.browser.newContext(deviceSettings);
  this.page = await this.context.newPage();

  this.log?.(`📱 Set viewport to ${normalizedDevice}${isLandscape ? " in landscape" : ""}.`);
}
When(/^I set viewport to "([^"]+)"(?: and "([^"]+)")?$/, When_I_set_viewport_to_device);

/**
 * Sets the viewport to the given width and height in pixels.
 * This will close the current browser context and open a new one with the specified dimensions.
 *
 * ```gherkin
 * When I set viewport to {int}px by {int}px
 * ```
 *
 * @param width - The desired viewport width in pixels.
 * @param height - The desired viewport height in pixels.
 *
 * @example
 * When I set viewport to 1280px by 720px
 *
 * @remarks
 * This step creates a *new* browser context and page, so any previous page state or
 * setup (like routes, localStorage) will be reset.
 * @category Browser Context Steps
 */
export async function When_I_set_viewport_to_dimensions(
  this: CustomWorld,
  width: number,
  height: number
) {
  // Close current context and page before creating a new one
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();

  // Recreate new context with the desired viewport
  this.context = await this.browser.newContext({
    viewport: { width, height },
  });

  this.page = await this.context.newPage();

  this.log?.(`🖥️ Set viewport to ${width}px by ${height}px.`);
}
When("I set viewport to {int}px by {int}px", When_I_set_viewport_to_dimensions);

// ===================================================================================
// UTILITY ACTIONS: DYNAMIC PLAYWRIGHT CONFIG SETTERS (FOR PAGE-ONLY CONFIG)
// ===================================================================================

/**
 * Sets a specific Playwright page configuration property to the given value.
 * This can be used to dynamically change page-level settings during a test.
 *
 * ```gherkin
 * When I set Playwright config {word} to {string}
 * ```
 *
 * @param key - The name of the Playwright `Page` property to set (e.g., "userAgent", "defaultTimeout").
 * @param value - The string value to set the property to. Note: All values are treated as strings.
 *
 * @example
 * When I set Playwright config "userAgent" to "MyCustomAgent"
 *
 * @remarks
 * This step directly assigns a value to a property on the `this.page` object.
 * It's important to know which properties are settable and what their expected
 * types are. Using incorrect keys or values may lead to unexpected behavior or errors.
 * Not all Playwright page properties are designed to be set this way after page creation.
 * @category Configuration Steps
 */
export async function When_I_set_playwright_page_config_key(
  this: CustomWorld,
  key: string,
  value: string
) {
  // Directly assign property. Using 'as any' to bypass strict type checking,
  // but be cautious as not all page properties are meant to be set this way dynamically.
  (this.page as any)[key] = value;
  this.log?.(`⚙️ Set Playwright page config "${key}" to "${value}".`);
}
When('I set Playwright config "{word}" to {string}', When_I_set_playwright_page_config_key);

/**
 * Sets multiple Playwright page configuration properties using a data table.
 *
 * ```gherkin
 * When I set Playwright config
 * | key        | value      |
 * | userAgent  | MyAgent    |
 * | defaultTimeout | 5000     |
 * ```
 *
 * @param table - A Cucumber DataTable with two columns: `key` (the property name)
 * and `value` (the string value to set).
 *
 * @example
 * When I set Playwright config
 * | key        | value      |
 * | userAgent  | TestBot    |
 * | defaultTimeout | 10000    |
 *
 * @remarks
 * Similar to the single-key version, this step dynamically assigns values to
 * properties on the `this.page` object. All values from the data table are
 * treated as strings. Use with caution, understanding which properties can
 * be dynamically set.
 * @category Configuration Steps
 */
export async function When_I_set_playwright_page_config_from_table(
  this: CustomWorld,
  table: DataTable
) {
  for (const [key, value] of table.rows()) {
    (this.page as any)[key] = value; // Direct assignment with 'as any'
    this.log?.(`⚙️ Set Playwright page config "${key}" to "${value}".`);
  }
}
When("I set Playwright config", When_I_set_playwright_page_config_from_table);
