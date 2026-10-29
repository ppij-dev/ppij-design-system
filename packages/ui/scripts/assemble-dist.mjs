// Copy the token files beside the compiled components so the three package
// exports (root, tokens.css, tokens.json) all resolve from dist.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync(new URL("../dist", import.meta.url), { recursive: true });
copyFileSync(new URL("../../../tokens/tokens.css", import.meta.url), new URL("../dist/tokens.css", import.meta.url));
copyFileSync(new URL("../../../tokens/tokens.json", import.meta.url), new URL("../dist/tokens.json", import.meta.url));
mkdirSync(new URL("../dist/components", import.meta.url), { recursive: true });
copyFileSync(new URL("../src/components/member-card.css", import.meta.url), new URL("../dist/components/member-card.css", import.meta.url));
console.log("assemble-dist: tokens and member-card.css copied to dist");
