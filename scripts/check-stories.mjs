// Fail if a component source file has no matching .stories.tsx beside it,
// or if a story file has no interactive Controls (a `Playground` story and
// `argTypes`). Controls are a must for every component, see AGENTS.md.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../packages/ui/src/components", import.meta.url).pathname;
const files = readdirSync(dir);
const missing = files
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .filter((f) => !files.includes(f.replace(/\.tsx$/, ".stories.tsx")));
if (missing.length) {
  console.error("check-stories: components without stories:", missing.join(", "));
  process.exit(1);
}

const noControls = files
  .filter((f) => f.endsWith(".stories.tsx"))
  // Page demos with no component source (no props to control) are exempt.
  .filter((f) => files.includes(f.replace(/\.stories\.tsx$/, ".tsx")))
  .filter((f) => {
    const src = readFileSync(join(dir, f), "utf8");
    return !/export const Playground\b/.test(src) || !/\bargTypes\s*:/.test(src);
  });
if (noControls.length) {
  console.error(
    "check-stories: stories without Controls (need a `Playground` story and `argTypes`):",
    noControls.join(", "),
  );
  process.exit(1);
}
console.log("check-stories: every component has a story with Controls");
