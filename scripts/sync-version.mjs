// Keep the shipped version equal to the root VERSION file.
//
// VERSION is the single source of truth for the release number. This copies it
// into the two package.json files that carry a version — packages/ui (the
// published package) and the private workspace root — so `npm pack` and
// `npm publish` cannot drift from VERSION the way 0.1.0/0.3.0 did.
// scripts/check-version.mjs fails the test stage when the three disagree.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const targets = ["package.json", "packages/ui/package.json"];

const version = readFileSync(new URL("VERSION", root), "utf8").trim();
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`sync-version: VERSION does not look like a semver: ${JSON.stringify(version)}`);
  process.exit(1);
}

let changed = 0;
for (const target of targets) {
  const file = new URL(target, root);
  const source = readFileSync(file, "utf8");
  const match = source.match(/^(\s*)"version":\s*"([^"]*)"/m);
  if (!match) {
    console.error(`sync-version: no top-level version field in ${target}`);
    process.exit(1);
  }
  if (match[2] === version) {
    console.log(`sync-version: ${target} already at ${version}`);
    continue;
  }
  writeFileSync(file, source.replace(/^(\s*)"version":\s*"[^"]*"/m, `$1"version": "${version}"`));
  console.log(`sync-version: ${target} ${match[2]} -> ${version}`);
  changed += 1;
}
console.log(`sync-version: VERSION ${version}; ${changed} file(s) updated`);
