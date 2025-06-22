export function checkPeerDependencies(dependencies: string[]) {
  const missing: string[] = [];

  for (const dep of dependencies) {
    try {
      require.resolve(dep);
    } catch {
      missing.push(dep);
    }
  }

  if (missing.length) {
    console.warn(
      `\n❌ Missing peer dependencies: ${missing.join(", ")}` +
        `\nPlease install them in your project:\n\n` +
        `npm install --save-dev ${missing.join(" ")}\n`
    );
  }
}
