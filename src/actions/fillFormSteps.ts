import fs from "fs";
import path from "path";
import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { resolveLoginValue } from "../helpers/utils/resolveUtils";
import type { CustomWorld } from "../helpers/world";

/* 
    * This file contains the step definitions for filling out forms in Playwright.
    * It supports various actions like filling inputs, clicking buttons, checking checkboxes,
    * uploading files, and handling requests.
    * Feature: User login with hybrid form and API session

  Background:
    Given I open the application homepage

  Scenario: Login as Admin via UI and save session
    When I fill the following "Login" form data:
      | Target                         | Value                  |
      | input[placeholder='email']     | test@email.com         |
      | input[placeholder='password']  | @adminPassword         |
      | input[type='checkbox']         | check                  |
      | select[name='role']            | select                 |
      | button:has-text("Sign In")     | click                  |
      | .dashboard-header              | assert:visible         |
      | .user-role                     | assert:text:Admin      |
    Then I save session as "sessionAdmin.json"

  Scenario: Restore session and assert dashboard
    Given I restore session cookies "sessionAdmin.json" with reload
    Then .user-role should contain text "Admin"

  Scenario: Login via API request and inject session
    When I fill the following "Login" form data:
      | Target                         | Value                                        |
      | request:POST:/api/auth/login:adminLogin.json |                               |
      | set:localStorage:auth_token    | @lastApiResponse.token                       |
      | wait                           | wait:1000                                    |
      | reload                         |                                              |
      | .dashboard-header              | assert:visible                               |
    Then I save session as "apiSessionAdmin.json"

  Scenario: Upload, drag, and assert form
    When I fill the following "Profile" form data:
      | Target                        | Value                             |
      | input[type='file']           | upload:fixtures/profile-pic.jpg   |
      | div.upload-target            | drag:.upload-preview              |
      | .upload-success              | assert:visible                    |

  Scenario: Login as reviewer and save session for approval flows
    When I fill the following "Login" form data:
      | Target                             | Value                          |
      | input[placeholder='email']         | reviewer@email.com             |
      | input[placeholder='password']      | REVIEWER_PASS                  |
      | button:has-text("Login")           | click                          |
      | .user-role                         | assert:text:Reviewer           |
    Then I save session as "sessionReviewer.json"

    */
// Explicitly type each row
type ActionRow = {
  Target: string;
  Value: string;
  PayloadDir?: string;
  SaveAs?: string;
};

When(
  "I fill the following {string} form data:",
  async function (this: CustomWorld, _formName: string, dataTable) {
    // const scope = this.frame ?? this.page;
    const rows = dataTable.hashes() as ActionRow[];

    for (const row of rows) {
      const target = row.Target.trim();
      const rawValue = row.Value.trim();
      const locator = this.getLocator(target);
      const value = resolveLoginValue(rawValue, this);

      // ✅ Assertions
      if (rawValue.startsWith("assert:")) {
        const [, type, expected] = rawValue.split(":");

        if (type === "visible") {
          await expect(locator).toBeVisible();
        } else if (type === "text") {
          await expect(locator).toHaveText(expected ?? "", {
            useInnerText: true,
          });
        } else if (type === "value") {
          await expect(locator).toHaveValue(expected ?? "");
        } else {
          throw new Error(`❌ Unknown assertion: ${type}`);
        }

        continue;
      }

      // ✅ UI interactions
      if (rawValue === "click") {
        await locator.click();
        continue;
      }

      if (rawValue === "check") {
        await locator.check();
        continue;
      }

      if (rawValue === "uncheck") {
        await locator.uncheck();
        continue;
      }

      if (rawValue === "select") {
        await locator.selectOption({ index: 0 });
        continue;
      }

      // ✅ File upload
      if (rawValue.startsWith("upload:")) {
        const filePath = rawValue.split("upload:")[1].trim();
        const resolvedPath = path.resolve(filePath);
        if (!fs.existsSync(resolvedPath)) throw new Error(`File not found: ${filePath}`);
        await locator.setInputFiles(resolvedPath);
        continue;
      }

      // ✅ Drag and drop
      if (rawValue.startsWith("drag:")) {
        const targetSelector = rawValue.split("drag:")[1].trim();
        const targetLocator = this.getLocator(targetSelector);
        await locator.dragTo(targetLocator);
        continue;
      }

      // ✅ Local/sessionStorage
      if (rawValue.startsWith("set:localStorage:")) {
        const [, , key] = rawValue.split(":");
        if (typeof key !== "string" || !key) {
          throw new Error("Local storage key must be a non-empty string");
        }
        await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value ?? ""]);
        continue;
      }

      if (rawValue.startsWith("set:sessionStorage:")) {
        const [, , key] = rawValue.split(":");
        if (typeof key !== "string" || key === undefined) {
          throw new Error("Session storage key must be a string");
        }
        await this.page.evaluate(
          (args: string[]) => {
            const [k, v] = args;
            sessionStorage.setItem(k, v);
          },
          [key, value ?? ""]
        );
        continue;
      }

      // ✅ Wait
      if (rawValue.startsWith("wait:")) {
        const [, timeMs] = rawValue.split(":");
        const waitTime = Number(timeMs);
        if (!isNaN(waitTime)) {
          await this.page.waitForTimeout(waitTime);
        }
        continue;
      }

      // ✅ Reload
      if (rawValue === "reload") {
        await this.page.reload();
        continue;
      }

      // ✅ Request handling
      if (rawValue.startsWith("request:")) {
        const [, method, url, file] = rawValue.replace("request:", "").split(":");

        const payloadDir = row.PayloadDir || this.parameters?.payloadDir || "payload";
        const filePath = path.resolve(payloadDir, file);

        if (!fs.existsSync(filePath)) {
          throw new Error(`Payload file not found: ${filePath}`);
        }

        const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const response = await this.page.request[
          method.toLowerCase() as "post" | "put" | "patch" | "get"
        ](url, {
          data: payload,
        });

        const responseBody = await response.json();
        this.data.lastApiResponse = responseBody;
        this.data.lastStatusCode = response.status();

        if (row.SaveAs) {
          this.data[row.SaveAs] = responseBody;
        }

        continue;
      }

      // ✅ Default: fill
      if (value !== undefined) {
        await locator.fill(String(value));
      }
    }
  }
);
