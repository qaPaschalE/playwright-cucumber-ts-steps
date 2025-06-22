// e2e/step_definitions/common/actions/inputSteps.ts
// import fs from "fs";
// import path from "path";
import { When } from "@cucumber/cucumber";
import { evaluateFaker } from "../helpers/utils/fakerUtils";
import {
  parseCheckOptions,
  parseFillOptions,
  parseSelectOptions,
} from "../helpers/utils/optionsUtils";
import { CustomWorld } from "../helpers/world";

When("I check", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  await this.element?.check(options);
  this.log?.("✅ Checked stored checkbox");
});

When("I uncheck", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  await this.element?.uncheck(options);
  this.log?.("✅ Unchecked stored checkbox");
});

When("I check input", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  if (!this.element) throw new Error("No input selected");
  await this.element.check(options);
});

When("I uncheck input", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  if (!this.element) throw new Error("No input selected");
  await this.element.uncheck(options);
});

// const DEFAULT_PAYLOAD_DIR = "payload";

const typeStep = async function (this: CustomWorld, textOrAlias: string, ...rest: any[]) {
  if (!this.element) throw new Error("No element selected");

  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseFillOptions(maybeTable) : {};
  const text = textOrAlias.startsWith("@")
    ? (this.data[textOrAlias.slice(1)] ??
      (() => {
        throw new Error(`No value found for alias "${textOrAlias}"`);
      })())
    : evaluateFaker(textOrAlias);

  await this.element.fill("");
  await this.element.fill(text, options);
  this.data.lastTyped = text;
  this.log?.(`⌨️ Typed "${text}" into selected element`);
};

When("I type {string}", typeStep);
When("I type stored {string}", typeStep);
When("I type random {string}", typeStep);

When(
  "I set value {string}",
  async function (this: CustomWorld, valueOrAlias: string, ...rest: any[]) {
    if (!this.element) throw new Error("No element selected");

    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseFillOptions(maybeTable) : {};
    const value = valueOrAlias.startsWith("@")
      ? (this.data[valueOrAlias.slice(1)] ??
        (() => {
          throw new Error(`No value found for alias "${valueOrAlias}"`);
        })())
      : evaluateFaker(valueOrAlias);

    await this.element.fill(value, options);
    this.data.lastValueSet = value;
    this.log?.(`📝 Set value to "${value}"`);
  }
);

When("I clear", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element selected");
  await this.element.fill("");
  this.log?.("🧼 Cleared value of selected element");
});

When("I submit", async function (this: CustomWorld) {
  // const maybeTable = rest[0];
  const form = this.element ?? this.page.locator("form");
  await form.evaluate((f: HTMLFormElement) => f.submit());
  this.log?.("📨 Submitted form");
});

When(
  "I select option {string}",
  async function (this: CustomWorld, option: string, ...rest: any[]) {
    if (!this.element) throw new Error("No select element stored");
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseSelectOptions(maybeTable) : {};
    await this.element.selectOption({ label: option }, options);
    this.log?.(`🔽 Selected option "${option}"`);
  }
);

When(
  "I select file {string}",
  async function (this: CustomWorld, filePath: string, ...rest: any[]) {
    if (!this.element) throw new Error("No file input selected");
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseSelectOptions(maybeTable) : {};
    await this.element.setInputFiles(filePath, options);
    this.log?.(`📁 Set input file to "${filePath}"`);
  }
);
