//sessionUtils.ts
import fs from "fs";
import path from "path";
import { BrowserContext } from "playwright";

export async function injectStorage(world: any, type: string, key: string, value: string) {
  const page = world.page;

  if (type === "localStorage") {
    await page.evaluate(([k, v]: [string, string]) => localStorage.setItem(k, v), [key, value]);
  } else if (type === "sessionStorage") {
    await page.evaluate(([k, v]: [string, string]) => sessionStorage.setItem(k, v), [key, value]);
  } else if (type === "cookie") {
    await page.context.addCookies([
      {
        name: key,
        value,
        domain: new URL(page.url()).hostname,
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "Lax",
      },
    ]);
  }
}

export async function saveSessionData(context: BrowserContext, file: string) {
  const storageState = await context.storageState();
  const outDir = "test-artifacts/auth-cookies";
  const outPath = path.resolve(outDir, file);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(storageState, null, 2));
  console.log(`💾 Saved session to ${outPath}`);
}
