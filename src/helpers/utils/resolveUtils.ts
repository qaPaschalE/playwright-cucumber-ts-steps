// src/helpers/utils/resolveUtils.ts
import fs from "fs";
import path from "path";
import { devices } from "@playwright/test";
import type { CustomWorld } from "../world";
// Dynamic resolver
export function resolveValue(input: string): string {
  // Uppercase = environment variable (e.g. TEST_USER)
  if (/^[A-Z0-9_]+$/.test(input)) {
    const envVal = process.env[input];
    if (!envVal) {
      throw new Error(`Environment variable ${input} not found.`);
    }
    return envVal;
  }

  // Dot = JSON reference (e.g. userData.email)
  if (input.includes(".")) {
    const [fileName, fieldName] = input.split(".");
    const jsonPath = path.resolve("e2e/support/helper/test-data", `${fileName}.json`);
    if (fs.existsSync(jsonPath)) {
      const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      const value = json[fieldName];
      if (value !== undefined) return value;
      throw new Error(`Field "${fieldName}" not found in ${fileName}.json`);
    }
  }

  // Default to hardcoded value
  return input;
}

export function resolveLoginValue(raw: string, world: CustomWorld): string | undefined {
  // ✅ Alias: @aliasName
  if (raw.startsWith("@")) {
    return world.data[raw.slice(1)];
  }

  // ✅ JSON: user.json:key
  if (raw.includes(".json:")) {
    const [filename, key] = raw.split(".json:");
    const filePath = path.resolve("test-data", `${filename}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON fixture not found: ${filename}.json`);
    }
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return fileData[key];
  }

  // ✅ Fallback to raw value
  return raw;
}
// Determine session name from email or username
export function deriveSessionName(emailOrUser: string, fallback = "default"): string {
  if (!emailOrUser) return `${fallback}User`;

  const base = emailOrUser.includes("@") ? emailOrUser.split("@")[0] : emailOrUser;

  return `${base}User`;
}

export function resolveSessionPath(world: CustomWorld, name: string) {
  const dir = path.resolve(world.data.artifactDir || "test-artifacts", "auth-cookies");
  fs.mkdirSync(dir, { recursive: true });
  return path.resolve(dir, name.endsWith(".json") ? name : `${name}.json`);
}
export function normalizeDeviceName(name: string): string {
  return (
    Object.keys(devices).find(
      (device) =>
        device.toLowerCase().replace(/\s+/g, "") === name.toLowerCase().replace(/[-_\s]+/g, "")
    ) || ""
  );
}
