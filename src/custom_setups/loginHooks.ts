import fs from "fs";
import { When } from "@cucumber/cucumber";
import { resolveSessionPath } from "../helpers/utils/resolveUtils";
import { CustomWorld } from "../helpers/world";

// Step 1: Check and load existing session if valid
When(
  "I login with a session data {string}",
  async function (this: CustomWorld, sessionName: string) {
    const sessionPath = resolveSessionPath(this, sessionName);
    this.data.sessionFile = sessionPath;

    if (fs.existsSync(sessionPath)) {
      try {
        await this.context?.addCookies(
          JSON.parse(fs.readFileSync(sessionPath, "utf-8")).cookies || []
        );
        this.log?.(`✅ Loaded session from ${sessionPath}`);
      } catch (err) {
        this.log?.(`⚠️ Failed to apply session: ${(err as Error).message}`);
      }
    } else {
      this.log?.(`⚠️ Session file not found: ${sessionPath}`);
    }
  }
);

/**
 * @step
 * @description Saves the current browser context (cookies, localStorage, sessionStorage) as a session file.
 * @example
 * When I save session as "my-session"
 */
When(/^I save session as "([^"]+)"$/, async function (this: CustomWorld, sessionName: string) {
  const sessionPath = resolveSessionPath(this, sessionName);

  const cookies = await this.context.cookies();

  const [localStorageData, sessionStorageData]: [
    { origin: string; values: [string, string][] }[],
    { origin: string; values: [string, string][] }[],
  ] = await this.page.evaluate(() => {
    const toPairs = (store: Storage): [string, string][] => Object.entries(store);

    return [
      [{ origin: location.origin, values: toPairs(localStorage) }],
      [{ origin: location.origin, values: toPairs(sessionStorage) }],
    ];
  });

  const sessionData = {
    cookies,
    localStorage: localStorageData,
    sessionStorage: sessionStorageData,
  };

  try {
    fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
    this.log?.(`💾 Saved session as "${sessionName}"`);
  } catch (err) {
    this.log?.(`❌ Failed to save session "${sessionName}": ${(err as Error).message}`);
  }
});

/**
 * @step
 * @description Removes a session file with the given name.
 * @example
 * When I clear session "my-session"
 */
When("I clear session {string}", function (this: CustomWorld, sessionName: string) {
  const sessionPath = resolveSessionPath(this, sessionName);
  if (fs.existsSync(sessionPath)) {
    fs.unlinkSync(sessionPath);
    this.log?.(`🧹 Cleared session: ${sessionPath}`);
  } else {
    this.log?.(`⚠️ Session not found: ${sessionPath}`);
  }
});

/**
 * @step
 * @description Restores cookies, localStorage, and sessionStorage from a session file. Optionally reloads the page.
 * @example
 * When I restore session cookies "my-session"
 * When I restore session cookies "my-session" with reload "false"
 */
When(
  /^I restore session cookies "([^"]+)"(?: with reload "(true|false)")?$/,
  async function (this: CustomWorld, sessionName: string, reload = "true") {
    const sessionPath = resolveSessionPath(this, sessionName);

    if (!fs.existsSync(sessionPath)) {
      this.log?.(`❌ Session file not found: ${sessionPath}`);
      return;
    }

    const sessionData = JSON.parse(fs.readFileSync(sessionPath, "utf-8"));
    const { cookies = [], localStorage = [], sessionStorage = [] } = sessionData;

    try {
      // Clear & set cookies
      if (cookies.length) {
        const existing = await this.context.cookies();
        if (existing.length) await this.context.clearCookies();
        await this.context.addCookies(cookies);
        this.log?.(`🍪 Cookies restored from "${sessionName}"`);
      }

      // Apply storage into page context
      await this.page.goto("about:blank");

      if (localStorage.length > 0) {
        for (const entry of localStorage) {
          await this.page.addInitScript(
            ([origin, values]) => {
              if (window.origin === origin) {
                for (const [key, val] of values) {
                  localStorage.setItem(key, val);
                }
              }
            },
            [entry.origin, entry.values]
          );
        }
        this.log?.("📦 localStorage restored");
      }

      if (sessionStorage.length > 0) {
        for (const entry of sessionStorage) {
          await this.page.addInitScript(
            ([origin, values]) => {
              if (window.origin === origin) {
                for (const [key, val] of values) {
                  sessionStorage.setItem(key, val);
                }
              }
            },
            [entry.origin, entry.values]
          );
        }
        this.log?.("🗄️ sessionStorage restored");
      }

      // Final reload to apply context if requested
      if (reload !== "false") {
        await this.page.reload();
        this.log?.("🔄 Page reloaded to apply restored session");
      }
    } catch (err) {
      this.log?.(`❌ Error restoring session: ${(err as Error).message}`);
    }
  }
);
