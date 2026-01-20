# 🎭 Playwright Cucumber TS Steps

[![NPM](https://nodei.co/npm/playwright-cucumber-ts-steps.png?downloads=true&downloadRank=true&stars=true&height=3)](https://nodei.co/npm/playwright-cucumber-ts-steps/)

<table align="center" style="margin-bottom:30px;"><tr><td align="center" width="9999" heigth="9999" >
 <img src="https://github.com/qaPaschalE/k6-cucumber-steps/blob/main/assets/paschal%20logo%20(2).png?raw=true" alt="paschal Logo" style="margin-top:25px;" align="center"/>
</td></tr></table>

[![npm version](https://img.shields.io/npm/v/playwright-cucumber-ts-steps?style=flat-square&color=blue)](https://www.npmjs.com/package/playwright-cucumber-ts-steps)
[![Downloads](https://img.shields.io/npm/dm/playwright-cucumber-ts-steps?style=flat-square)](https://www.npmjs.com/package/playwright-cucumber-ts-steps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-blueviolet?style=flat-square&logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/qaPaschalE/playwright-cucumber-ts-steps)](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/stargazers)

> A collection of reusable Playwright step definitions for Cucumber in TypeScript, designed to streamline end-to-end testing across web, API, and mobile applications.

> **Note:** This package is designed for advanced Cucumber+Playwright+TypeScript setups. For basic Playwright usage, see the [official Playwright docs](https://playwright.dev/).

**The "Low-Code" BDD Framework for Playwright.**

Write powerful end-to-end tests in plain English using Gherkin syntax, without managing complex glue code. `playwright-cucumber-ts-steps` provides a pre-built library of robust steps for UI, API, and Authentication testing, running natively inside Playwright.

---

## 🚀 Features

- **Zero Boilerplate:** Install and start writing `.feature` files immediately.
- **Hybrid Testing:** Mix **UI**, **API**, and **Database** steps in a single scenario.
- **Smart Auth:** Login once, save the session, and reuse it across thousands of tests.
- **Native Performance:** Runs purely on Playwright (no heavy Cucumber-JS wrapper), giving you Parallelism, Tracing, and Retries out of the box.
- **Tag Filtering:** Run specific tests like `@smoke` or `@regression` easily.
- **Auto-Reporting:** Built-in helper for HTML and Slack reports with **screenshots on failure**.

---

## 📦 Installation

```bash
npm install playwright-cucumber-ts-steps @playwright/test
```

or

```bash
yarn add playwright-cucumber-ts-steps @playwright/test
```

```bash
npx playwright install
```

## 📘 Step Definition Documentation

👉 [View Steps Documentation](https://qapaschale.github.io/playwright-cucumber-ts-steps/) and [examples](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/tree/main/examples).

---

## ⚡ Quick Start Guide

### 1. Configure Playwright

Update `playwright.config.ts` to use the built-in reporting helper.

```typescript
import { defineConfig } from "@playwright/test";
import { getReporters } from "playwright-cucumber-ts-steps";

export default defineConfig({
  testDir: "./tests",
  // Sets up HTML report + Console list automatically
  reporter: getReporters({ on: ["html"] }),
  use: {
    // We handle screenshots manually in the runner,
    // but this is good as a backup
    screenshot: "only-on-failure",
  },
});
```

### 2. Create the Runner

Create a file at `tests/bdd.spec.ts`. This is the entry point.

```typescript
import { runTests } from "playwright-cucumber-ts-steps";

// Runs all feature files in the 'features' folder
runTests("features/*.feature");
```

### 3. Write Your Feature

Create `features/login.feature`:

```gherkin
Feature: User Authentication

  @smoke
  Scenario: Successful Login
    Given I visit "[https://the-internet.herokuapp.com/login](https://the-internet.herokuapp.com/login)"
    When I fill "#username" with "tomsmith"
    And I fill "#password" with "SuperSecretPassword!"
    And I click "button[type='submit']"
    Then I expect "#flash" to contain text "You logged into a secure area!"

```

### 4. Run Tests

```bash
npx playwright test
```

---

## 🏷️ Tag Filtering (New!)

We support a **Friendly Syntax** for filtering tests via the `TAGS` environment variable.

| Logic   | Symbol | Example          | Description                                      |
| ------- | ------ | ---------------- | ------------------------------------------------ |
| **AND** | `,`    | `@login,@signup` | Run tests that have `@login` **AND** `@signup`.  |
|         |
| **MIX** | `,`    | `@a,@b, @c`      | Run tests with (`@a` AND `@b`) **OR** just `@c`. |

**Usage:**

```bash
# Run only smoke tests
TAGS='@smoke' npx playwright test
OR
npx playwright test -g "@smoke"

# Run smoke tests that are also critical
TAGS='@smoke,@critical' npx playwright test
OR
npx playwright test -g "@smoke|@critical"

```

_(On Windows PowerShell, use `$env:TAGS="@smoke"; npx playwright test`)_

**In your Test Runner (`tests/bdd.spec.ts`):**

```typescript
import { runTests } from "playwright-cucumber-ts-steps";

// OPTION 1: Run Everything
// runTests('features/*.feature');

// OPTION 2: Run only Smoke tests
runTests("features/*.feature", { tags: "@smoke" });
```

---

## 💡 Various Usage Examples

### 1. API Testing (Backend Validation)

You can validate your backend directly without opening a browser, or mix it with UI tests.

```gherkin
Feature: User API

  @api
  Scenario: Create and Verify User
    When I make a POST request to "[https://reqres.in/api/users](https://reqres.in/api/users)" with body '{"name": "Morpheus", "job": "Leader"}'
    Then I expect the response status to be 201
    And I expect the response property "name" to be "Morpheus"

```

### 2. Advanced Elements (Iframes & Uploads)

Handling complex HTML elements is built-in.

```gherkin
Feature: File Upload and Iframes

  Scenario: Upload Document inside Iframe
    Given I visit "[https://example.com/upload](https://example.com/upload)"
    # Switch context to the iframe
    When I upload file "data/resume.pdf" to "#file-input" inside frame "#upload-iframe"
    And I click "#submit-btn" inside frame "#upload-iframe"
    Then I expect "div.success" inside frame "#upload-iframe" to be visible

```

### 3. The "Login Once" Pattern (Authentication)

Speed up your suite by 10x. Login once, save the cookies, and reuse them.

**Step 1: Create a Setup Feature (`features/setup.feature`)**

```gherkin
Feature: Setup

  @setup
  Scenario: Admin Login
    Given I visit "/login"
    When I fill "#user" with "admin"
    And I fill "#pass" with "1234"
    And I click "#login-btn"
    And I expect "#dashboard" to be visible
    # Saves session to ./auth/admin.json
    And I save the browser state to "admin.json"

```

**Step 2: Use in Daily Tests (`features/admin.feature`)**

```gherkin
Feature: Admin Panel

  Scenario: Check Reports
    # Loads cookies instantly - No login UI needed!
    Given I load the browser state from "admin.json"
    When I visit "/admin/reports"
    Then I expect "h1" to have text "Weekly Reports"

```

### 4. Data Tables (Forms)

Fill out entire forms in a single step using a Data Table. You can type, click, check, or assert visibility in one go.

```gherkin
Scenario: Registration
  When I fill the following "Registration" form data:
    | #first-name | John           |
    | #last-name  | Doe            |
    | #email      | john@test.com  |
    | #newsletter | check          |
    | #submit-btn | click          |
    | .success    | assert:visible |
```

### 5. API Testing (Tables & Files)

Validate your backend directly. You can send payloads via Tables or JSON Files.

#### Option A: Data Table Payload

```gherkin
Scenario: Create User (Table)
  When I make a POST request to "[https://reqres.in/api/users](https://reqres.in/api/users)" with data:
    | name | Neo        |
    | job  | The Chosen |
  Then I expect the response status to be 201
  And I expect the response property "name" to be "Neo"
```

#### Option B: File Payload

```gherkin
Scenario: Create User (File)
  # Reads from 'data/user.json' in your project root
  When I make a POST request to "/api/users" with payload from "data/user.json"
  Then I expect the response status to be 201
```

### 6. Network Mocking

Simulate backend responses to test UI behavior without relying on real APIs.

```gherkin
Scenario: Mocking User Profile
  # Intercept calls to /api/user/1 and return fake data
  Given I mock the API endpoint "*/**/api/user/1" with body '{"name": "Mocked User"}'

  # When the UI calls the API, it gets our fake data
  When I visit "/profile"
  Then I expect "#username-display" to have text "Mocked User"

```

### 7. Database Testing (Adapter Pattern)

You can validate database states by injecting your own DB driver into the runner.

**1. In your `bdd.spec.ts`:**

```typescript
import { runTests } from "playwright-cucumber-ts-steps";
import pg from "pg"; // Your driver (pg, mysql, mongo, etc)

// wrapper function
const queryDb = async (query: string) => {
  const client = new pg.Client(process.env.DB_URL);
  await client.connect();
  const res = await client.query(query);
  await client.end();
  return res.rows; // Must return an array of objects
};

runTests("features/*.feature", { dbQuery: queryDb });
```

**2. In your `Feature file`:**

```gherkin
Scenario: Create User
  When I run the database query "INSERT INTO users (name) VALUES ('Bob')"
  Then I expect the database to return 1 record
  And I expect the first database record to contain:
    | name | Bob |
```

---

## 📖 Step Glossary (Cheat Sheet)

### 🖱️ Actions

| Step             | Usage Example                          |
| ---------------- | -------------------------------------- |
| **Visit**        | `I visit "https://google.com"`         |
| **Click**        | `I click "#submit-btn"`                |
| **Force Click**  | `I force click "#hidden-btn"`          |
| **Double Click** | `I double click ".icon"`               |
| **Fill Input**   | `I fill "#email" with "user@test.com"` |
| **Press Key**    | `I press "Enter"` (or "Tab", "Escape") |
| **Wait**         | `I wait for 2000 milliseconds`         |
| **Reload**       | `I reload the page`                    |
| **Go Back**      | `I go back`                            |

### ✅ Assertions

| Step             | Usage Example                                                  |
| ---------------- | -------------------------------------------------------------- |
| **Visibility**   | `I expect "#modal" to be visible`                              |
| **Hidden**       | `I expect "#loader" to be hidden`                              |
| **Exact Text**   | `I expect "#header" to have text "Welcome"`                    |
| **Partial Text** | `I expect ".error" to contain text "Failed"`                   |
| **Input Value**  | `I expect "#username" to have value "admin"`                   |
| **Exact URL**    | `I expect the url to be "https://site.com/home"`               |
| **Partial URL**  | `I expect the url to contain "/dashboard"`                     |
| **Title**        | `I expect the title to contain "Home Page"`                    |
| **Attribute**    | `I expect "img" to have attribute "src" with value "logo.png"` |
| **Screenshot**   | `I expect the page screenshot to match "home.png"`             |

### 🧩 Forms & Elements

| Step                  | Usage Example                                  |
| --------------------- | ---------------------------------------------- |
| **Select (Dropdown)** | `I select option "Canada" from "#country"`     |
| **Check Box**         | `I check "#terms-checkbox"`                    |
| **Uncheck**           | `I uncheck "#newsletter"`                      |
| **Upload File**       | `I upload file "data.csv" to "#upload"`        |
| **Handle Alert**      | `I accept the next dialog`                     |
| **Frame Click**       | `I click "#btn" inside frame "#payment-frame"` |

### 🌐 API

| Step             | Usage Example                                                 |
| ---------------- | ------------------------------------------------------------- |
| **GET**          | `I make a GET request to "/api/users"`                        |
| **DELETE**       | `I make a DELETE request to "/api/users/1"`                   |
| **POST**         | `I make a POST request to "/api/login" with body '{"u":"1"}'` |
| **Status Check** | `I expect the response status to be 200`                      |
| **JSON Check**   | `I expect the response property "data.id" to be "99"`         |

---

## 🛠️ Extending (Custom Steps)

Need a step that isn't included? You can easily register your own in your spec file.

```typescript
// tests/bdd.spec.ts
import { runTests, Step } from "playwright-cucumber-ts-steps";

// 1. Define custom step
Step("I scroll to the bottom of the page", async (page) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

// 2. Run tests
runTests("features/*.feature");
```

Then use it in your feature:

```gherkin
Scenario: Scroll Test
  Given I visit "[https://infinite-scroll.com](https://infinite-scroll.com)"
  When I scroll to the bottom of the page

```

---

## 📘 Step Definition Documentation


### **When** I click



```gherkin
When I click
```

---

### **When** I click on element {string}



```gherkin
When I click on element {string}
```

---

### **When** I click on button {string}



```gherkin
When I click on button {string}
```

---

### **When** I click on link {string}



```gherkin
When I click on link {string}
```

---

### **When** I click on label {string}



```gherkin
When I click on label {string}
```

---

### **When** I click on text {string}



```gherkin
When I click on text {string}
```

---

### **When** I click on exact text {string}



```gherkin
When I click on exact text {string}
```

---

### **When** I click on selector ([^]+)



```gherkin
When I click on selector ([^]+)
```

---

### **When** I click all



```gherkin
When I click all
```

---

### **When** I double click



```gherkin
When I double click
```

---

### **When** I double click on text {string}



```gherkin
When I double click on text {string}
```

---

### **When** I double click position {int} {int}



```gherkin
When I double click position {int} {int}
```

---

### **When** I right click



```gherkin
When I right click
```

---

### **When** I right click on text {string}



```gherkin
When I right click on text {string}
```

---

### **When** I right click position {int} {int}



```gherkin
When I right click position {int} {int}
```

---

### **When** I click on ({int})(?:st|nd|rd|th) element ([^]+)



```gherkin
When I click on ({int})(?:st|nd|rd|th) element ([^]+)
```

---

### **When** I click on ({int})(?:st|nd|rd|th) selector ([^]+)



```gherkin
When I click on ({int})(?:st|nd|rd|th) selector ([^]+)
```

---

### **When** I find element by selector {string}



```gherkin
When I find element by selector {string}
```

---

### **When** I find element by text {string}



```gherkin
When I find element by text {string}
```

---

### **When** I find element by title {string}



```gherkin
When I find element by title {string}
```

---

### **When** I find element by testid {string}



```gherkin
When I find element by testid {string}
```

---

### **When** I find element by role {string}



```gherkin
When I find element by role {string}
```

---

### **When** I find element by placeholder text {string}



```gherkin
When I find element by placeholder text {string}
```

---

### **When** I find element by label text {string}



```gherkin
When I find element by label text {string}
```

---

### **When** I find element by alt text {string}



```gherkin
When I find element by alt text {string}
```

---

### **When** I find link by text {string}



```gherkin
When I find link by text {string}
```

---

### **When** I find heading by text {string}



```gherkin
When I find heading by text {string}
```

---

### **When** I find element by name {string}



```gherkin
When I find element by name {string}
```

---

### **When** I find elements by selector {string}



```gherkin
When I find elements by selector {string}
```

---

### **When** I find headings by text {string}



```gherkin
When I find headings by text {string}
```

---

### **When** I find buttons by text {string}



```gherkin
When I find buttons by text {string}
```

---

### **When** I get first element



```gherkin
When I get first element
```

---

### **When** I get last element



```gherkin
When I get last element
```

---

### **When** I get ({int})(?:st|nd|rd|th) element



```gherkin
When I get ({int})(?:st|nd|rd|th) element
```

---

### **When** I get focused element



```gherkin
When I get focused element
```

---

### **When** I find input by ID {string}



```gherkin
When I find input by ID {string}
```

---

### **When** I find input by name {string}



```gherkin
When I find input by name {string}
```

---

### **When** I find input by placeholder text {string}



```gherkin
When I find input by placeholder text {string}
```

---

### **When** I find input by display value {string}



```gherkin
When I find input by display value {string}
```

---

### **When** I find textarea by label text {string}



```gherkin
When I find textarea by label text {string}
```

---

### **When** I store element text as {string}



```gherkin
When I store element text as {string}
```

---

### **When** I fill the following {string} form data



```gherkin
When I fill the following {string} form data
```

---

### **When** I fill the following {string} test form data



```gherkin
When I fill the following {string} test form data
```

---

### **When** I switch to frame {string}



```gherkin
When I switch to frame {string}
```

---

### **When** I find element {string} in frame {string}



```gherkin
When I find element {string} in frame {string}
```

---

### **When** I switch to new tab



```gherkin
When I switch to new tab
```

---

### **When** I type {string}



```gherkin
When I type {string}
```

---

### **When** I type stored {string}



```gherkin
When I type stored {string}
```

---

### **When** I slowly type {string}



```gherkin
When I slowly type {string}
```

---

### **When** I set value {string}



```gherkin
When I set value {string}
```

---

### **When** I clear



```gherkin
When I clear
```

---

### **When** I press {string}



```gherkin
When I press {string}
```

---

### **When** I check



```gherkin
When I check
```

---

### **When** I uncheck



```gherkin
When I uncheck
```

---

### **When** I check input



```gherkin
When I check input
```

---

### **When** I uncheck input



```gherkin
When I uncheck input
```

---

### **When** I (check|uncheck) ({int})(?:st|nd|rd|th) selector ([^]+)



```gherkin
When I (check|uncheck) ({int})(?:st|nd|rd|th) selector ([^]+)
```

---

### **When** I select option {string}



```gherkin
When I select option {string}
```

---

### **When** I submit



```gherkin
When I submit
```

---

### **When** I select file {string}



```gherkin
When I select file {string}
```

---

### **When** I upload file {string}



```gherkin
When I upload file {string}
```

---

### **When** I click {string}



```gherkin
When I click {string}
```

---

### **When** I force click {string}



```gherkin
When I force click {string}
```

---

### **When** I fill {string} with {string}



```gherkin
When I fill {string} with {string}
```

---

### **When** I press {string}



```gherkin
When I press {string}
```

---

### **When** I wait for {int} milliseconds



```gherkin
When I wait for {int} milliseconds
```

---

### **When** I press key {string}



```gherkin
When I press key {string}
```

---

### **When** I press key {string} on element



```gherkin
When I press key {string} on element
```

---

### **When** I press keys {string}



```gherkin
When I press keys {string}
```

---

### **When** I press shortcut {string}



```gherkin
When I press shortcut {string}
```

---

### **When** I hold down key {string}



```gherkin
When I hold down key {string}
```

---

### **When** I release key {string}



```gherkin
When I release key {string}
```

---

### **When** I wait for {int} milliseconds



```gherkin
When I wait for {int} milliseconds
```

---

### **When** I wait for {int} seconds



```gherkin
When I wait for {int} seconds
```

---

### **When** I pause



```gherkin
When I pause
```

---

### **When** I debug



```gherkin
When I debug
```

---

### **When** I log {string}



```gherkin
When I log {string}
```

---

### **When** I focus



```gherkin
When I focus
```

---

### **When** I blur



```gherkin
When I blur
```

---

### **When** I set cookie {string} to {string}



```gherkin
When I set cookie {string} to {string}
```

---

### **When** I clear all cookies



```gherkin
When I clear all cookies
```

---

### **When** I set local storage item {string} to {string}



```gherkin
When I set local storage item {string} to {string}
```

---

### **When** I get local storage item {string}



```gherkin
When I get local storage item {string}
```

---

### **When** I clear local storage



```gherkin
When I clear local storage
```

---

### **When** I set session storage item {string} to {string}



```gherkin
When I set session storage item {string} to {string}
```

---

### **When** I clear session storage



```gherkin
When I clear session storage
```

---

### **When** I tap



```gherkin
When I tap
```

---

### **When** I tap element {string}



```gherkin
When I tap element {string}
```

---

### **When** I tap coordinates x:{int} y:{int}



```gherkin
When I tap coordinates x:{int} y:{int}
```

---

### **When** I resize window to width {int} and height {int}



```gherkin
When I resize window to width {int} and height {int}
```

---

### **When** I simulate device {string}



```gherkin
When I simulate device {string}
```

---

### **When** I set geolocation to lat: {float} long: {float}



```gherkin
When I set geolocation to lat: {float} long: {float}
```

---

### **When** I grant permission {string}



```gherkin
When I grant permission {string}
```

---

### **When** I scroll {string} into view



```gherkin
When I scroll {string} into view
```

---

### **When** I scroll {string} to position x:{int} y:{int}



```gherkin
When I scroll {string} to position x:{int} y:{int}
```

---

### **When** I scroll to coordinates x:{int} y:{int}



```gherkin
When I scroll to coordinates x:{int} y:{int}
```

---

### **When** I scroll mouse window to position top:{int} left:{int}



```gherkin
When I scroll mouse window to position top:{int} left:{int}
```

---

### **When** I scroll to {string}



```gherkin
When I scroll to {string}
```

---

### **When** I hover over the element {string}



```gherkin
When I hover over the element {string}
```

---

### **When** I move mouse to coordinates {int}, {int}



```gherkin
When I move mouse to coordinates {int}, {int}
```

---

### **When** I hover on ({int})(?:st|nd|rd|th) element ([^]+)



```gherkin
When I hover on ({int})(?:st|nd|rd|th) element ([^]+)
```

---

### **When** I hover on ({int})(?:st|nd|rd|th) selector ([^]+)



```gherkin
When I hover on ({int})(?:st|nd|rd|th) selector ([^]+)
```

---

### **When** I visit {string}



```gherkin
When I visit {string}
```

---

### **When** I reload the page



```gherkin
When I reload the page
```

---

### **When** I go back



```gherkin
When I go back
```

---

### **When** I go forward



```gherkin
When I go forward
```

---

### **When** I navigate to {string}



```gherkin
When I navigate to {string}
```

---

### **When** I wait for network idle



```gherkin
When I wait for network idle
```

---

### **When** I wait for load state {string}



```gherkin
When I wait for load state {string}
```

---

### **When** I wait for element to be visible



```gherkin
When I wait for element to be visible
```

---

### **When** I wait for element to be hidden



```gherkin
When I wait for element to be hidden
```

---

### **When** I wait for URL to contain {string}



```gherkin
When I wait for URL to contain {string}
```

---

### **When** I expect the response status to be {int}



```gherkin
When I expect the response status to be {int}
```

---

### **When** I expect the response body to contain {string}



```gherkin
When I expect the response body to contain {string}
```

---

### **When** I expect the response property {string} to be {string}



```gherkin
When I expect the response property {string} to be {string}
```

---

### **When** I mock the API endpoint {string} with body {string}



```gherkin
When I mock the API endpoint {string} with body {string}
```

---

### **When** I mock the API endpoint {string} with response from {string}



```gherkin
When I mock the API endpoint {string} with response from {string}
```

---

### **When** I mock the API endpoint {string} with status {int}



```gherkin
When I mock the API endpoint {string} with status {int}
```

---

### **When** I intercept URL ([^]+) and stub body:?



```gherkin
When I intercept URL ([^]+) and stub body:?
```

---

### **When** I intercept URL {string} and stub body {string}



```gherkin
When I intercept URL {string} and stub body {string}
```

---

### **When** I intercept URL {string}



```gherkin
When I intercept URL {string}
```

---

### **When** I make request to {string}



```gherkin
When I make request to {string}
```

---

### **When** I make a POST request to ([^]+) with JSON body:?



```gherkin
When I make a POST request to ([^]+) with JSON body:?
```

---

### **When** I make a {word} request to {string}



```gherkin
When I make a {word} request to {string}
```

---

### **When** I make a GET request to {string}



```gherkin
When I make a GET request to {string}
```

---

### **When** I make a DELETE request to {string}



```gherkin
When I make a DELETE request to {string}
```

---

### **When** I make a POST request to {string} with data



```gherkin
When I make a POST request to {string} with data
```

---

### **When** I make a POST request to {string} with payload from {string}



```gherkin
When I make a POST request to {string} with payload from {string}
```

---

### **When** I expect the url to contain {string}



```gherkin
When I expect the url to contain {string}
```

---

### **When** I expect the url to be {string}



```gherkin
When I expect the url to be {string}
```

---

### **When** I expect the title to contain {string}



```gherkin
When I expect the title to contain {string}
```

---

### **When** I expect the title to be {string}



```gherkin
When I expect the title to be {string}
```

---

### **When** I expect {string} to have text {string}



```gherkin
When I expect {string} to have text {string}
```

---

### **When** I expect {string} to contain text {string}



```gherkin
When I expect {string} to contain text {string}
```

---

### **When** I expect {string} to have value {string}



```gherkin
When I expect {string} to have value {string}
```

---

### **When** I expect {string} to have attribute {string} with value {string}



```gherkin
When I expect {string} to have attribute {string} with value {string}
```

---

### **When** I expect element to be visible



```gherkin
When I expect element to be visible
```

---

### **When** I expect {string} to be visible



```gherkin
When I expect {string} to be visible
```

---

### **When** I expect element to be hidden



```gherkin
When I expect element to be hidden
```

---

### **When** I expect element to be enabled



```gherkin
When I expect element to be enabled
```

---

### **When** I expect element to be disabled



```gherkin
When I expect element to be disabled
```

---

### **When** I expect element to have text {string}



```gherkin
When I expect element to have text {string}
```

---

### **When** I expect element to contain text {string}



```gherkin
When I expect element to contain text {string}
```

---

### **When** I expect element to have value {string}



```gherkin
When I expect element to have value {string}
```

---

### **When** I expect element to have attribute {string}



```gherkin
When I expect element to have attribute {string}
```

---

### **When** I expect element to have attribute {string} with value {string}



```gherkin
When I expect element to have attribute {string} with value {string}
```

---

### **When** I expect the page screenshot to match {string}



```gherkin
When I expect the page screenshot to match {string}
```

---

### **When** I expect the element screenshot to match {string}



```gherkin
When I expect the element screenshot to match {string}
```

---

### **When** I save the browser state to {string}



```gherkin
When I save the browser state to {string}
```

---

### **When** I load the browser state from {string}



```gherkin
When I load the browser state from {string}
```

---

### **When** I run the database query {string}



```gherkin
When I run the database query {string}
```

---

### **When** I expect the database to return {int} record(s)



```gherkin
When I expect the database to return {int} record(s)
```

---

### **When** I expect the database to return no records



```gherkin
When I expect the database to return no records
```

---

### **When** I expect the first database record to contain



```gherkin
When I expect the first database record to contain
```

---

### **When** I expect database row {int} to contain



```gherkin
When I expect database row {int} to contain
```

---

### **When** I expect all database records to contain



```gherkin
When I expect all database records to contain
```

---

### **When** I expect database column {string} to exist



```gherkin
When I expect database column {string} to exist
```

---

### **When** I expect database column {string} to contain {string}



```gherkin
When I expect database column {string} to contain {string}
```

---

### **When** I expect database column {string} to be of type {string}



```gherkin
When I expect database column {string} to be of type {string}
```

---

### **When** I accept the next dialog



```gherkin
When I accept the next dialog
```

---

### **When** I dismiss the next dialog



```gherkin
When I dismiss the next dialog
```

---

### **When** I type {string} into the next prompt and accept



```gherkin
When I type {string} into the next prompt and accept
```

---

### **When** I select option {string} from {string}



```gherkin
When I select option {string} from {string}
```

---

### **When** I check {string}



```gherkin
When I check {string}
```

---

### **When** I uncheck {string}



```gherkin
When I uncheck {string}
```

---

### **When** I upload file {string} to {string}



```gherkin
When I upload file {string} to {string}
```

---

### **When** I click {string} inside frame {string}



```gherkin
When I click {string} inside frame {string}
```

---

### **When** I fill {string} inside frame {string} with {string}



```gherkin
When I fill {string} inside frame {string} with {string}
```

---

### **When** I expect {string} inside frame {string} to have text {string}



```gherkin
When I expect {string} inside frame {string} to have text {string}
```

---



## 📄 License

MIT © 2024
