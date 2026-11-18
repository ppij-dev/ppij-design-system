// Keeps brand/logo/brand-ppi-jepang.html and the SVG files in the same folder aligned:
// same file names, same path data, same inks, nothing but paths in the SVGs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "brand", "logo");
const html = readFileSync(join(dir, "brand-ppi-jepang.html"), "utf8");

// path data on the page, by id
const paths = {};
for (const m of html.matchAll(/<path id="(p-[a-z-]+)"([^>]*?)\sd="([^"]+)"/g)) paths[m[1]] = m[3];

// the page's own ink table, parsed from the script so the test cannot drift from it
const ink = {};
const inkBlock = html.match(/var INK = \{([\s\S]*?)\};/)[1];
for (const m of inkBlock.matchAll(/'([a-z-]+)': \['(#[0-9a-f]{6})', '(#[0-9a-f]{6})'/g)) ink[m[1]] = [m[2], m[3]];

const FILE = { stacked: "vertical", side: "horizontal", "side-full": "horizontal-full" };
const PARTS = {
  stacked: ["p-emblem", "p-word"],
  side: ["p-emblem", "p-side"],
  "side-full": ["p-emblem", "p-full-name", "p-full-desc"],
};

function expected() {
  const out = {};
  for (const [layout, parts] of Object.entries(PARTS)) {
    for (const [variant, [emblemInk, textInk]] of Object.entries(ink)) {
      out[`ppij-${FILE[layout]}-${variant}.svg`] = parts.map((p, i) => [i === 0 ? emblemInk : textInk, paths[p]]);
    }
  }
  out["ppij-emblem-red.svg"] = [[ink.primary[0], paths["p-emblem"]]];
  out["ppij-emblem-white.svg"] = [[ink["inverse-white"][0], paths["p-emblem"]]];
  return out;
}

test("the page defines every path it exports", () => {
  for (const id of ["p-emblem", "p-word", "p-side", "p-full-name", "p-full-desc"]) {
    assert.ok(paths[id] && paths[id].length > 100, `missing path ${id} in brand-ppi-jepang.html`);
  }
  assert.deepEqual(Object.keys(ink).sort(), ["inverse-black", "inverse-white", "primary"]);
});

test("the folder holds exactly the files the page lists", () => {
  const onDisk = readdirSync(dir).filter((f) => f.endsWith(".svg")).sort();
  assert.deepEqual(onDisk, Object.keys(expected()).sort());
});

test("each SVG carries the page's path data and inks", () => {
  for (const [name, parts] of Object.entries(expected())) {
    const svg = readFileSync(join(dir, name), "utf8");
    const found = [...svg.matchAll(/<path fill="(#[0-9a-f]{6})"[^>]*? d="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    assert.deepEqual(found, parts, `${name} differs from brand-ppi-jepang.html`);
    assert.ok(!/<script|<image|<foreignObject|href=|onload/i.test(svg), `${name} must contain only paths`);
  }
});

test("a PDF copy sits beside the page", () => {
  assert.ok(existsSync(join(dir, "brand-ppi-jepang.pdf")), "run scripts/build-brand-pdf.sh");
});
