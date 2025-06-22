import fs from "fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export function compareSnapshots({
  actualPath,
  baselinePath,
  diffPath,
  threshold = 0.1,
}: {
  actualPath: string;
  baselinePath: string;
  diffPath: string;
  threshold?: number;
}): number {
  const actual = PNG.sync.read(fs.readFileSync(actualPath));
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));

  if (actual.width !== baseline.width || actual.height !== baseline.height) {
    throw new Error("Snapshot size mismatch");
  }

  const diff = new PNG({ width: actual.width, height: actual.height });
  const numDiffPixels = pixelmatch(
    actual.data,
    baseline.data,
    diff.data,
    actual.width,
    actual.height,
    { threshold }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return numDiffPixels;
}
