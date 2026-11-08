// Fail when the version files disagree with the root VERSION file.
// make build syncs them (scripts/sync-version.mjs); this is the guard that a
// hand-edit of one file cannot pass the gate.
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const version = readFileSync(new URL("VERSION", root), "utf8").trim();
const targets = ["package.json", "packages/ui/package.json"];

const mismatched = targets.filter((target) => {
  const pkg = JSON.parse(readFileSync(new URL(target, root), "utf8"));
  return pkg.version !== version;
});

if (mismatched.length) {
  for (const target of mismatched) {
    const pkg = JSON.parse(readFileSync(new URL(target, root), "utf8"));
    console.error(`check-version: VERSION is ${version} but ${target} is ${pkg.version}`);
  }
  console.error("check-version: run `node scripts/sync-version.mjs`");
  process.exit(1);
}
console.log(`check-version: VERSION, package.json and packages/ui/package.json all read ${version}`);
