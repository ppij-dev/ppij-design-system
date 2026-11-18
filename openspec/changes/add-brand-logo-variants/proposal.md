# Add the brand logo guideline and SVG variants

## Why

The only logo in the repository is one PNG (`brand/ppij-logo.png`). The AD/ART 2027-2028 proposal from Biro Pendataan adds an inverted colorway, a horizontal lockup with Futura text, and dark-ground rules. Documents (including a PDF for the national board) need stable URLs to cite, and the guideline and files must outlive any one person's machine.

## Scope

Host the guideline page and its vector files from the repository and the published Storybook site, and mention it in the design system.

- `brand/logo/brand-ppi-jepang.html`: the guideline page (not named `index.html`, because Storybook skips files with that name when it copies `staticDirs`) (self-contained: inline SVG, one script, Google Fonts links). Has an "Unduh PDF" link and a print stylesheet.
- `brand/logo/brand-ppi-jepang.pdf`: PDF copy, built by `scripts/build-brand-pdf.sh` from the page.
- Eleven SVGs in `brand/logo/`, named by the page's own terms: `ppij-{vertical,horizontal,horizontal-full}-{primary,inverse-black,inverse-white}.svg`, `ppij-emblem-red.svg`, `ppij-emblem-white.svg`.
- `packages/ui/.storybook/main.ts` adds `brand/logo` to `staticDirs`, so Pages serves it under `/brand/logo/`.
- `scripts/check-brand-logo.test.mjs`, part of `npm test`: the page and the SVG files stay aligned.
- Mentions: the Brand docs page embeds the guideline and states its status, the Logo docs page links it, and `README.md` and `brand/README.md` point to it.

Out of scope: changing the existing Logo rules (no inversion) and the UI red `#C8102E`. The Logo page keeps them and says the inversion is a proposal until Kongres approves it.

## Acceptance

- WHEN the Storybook build runs THEN `storybook-static/brand/logo/` SHALL contain `brand-ppi-jepang.html`, the PDF, and all eleven SVG files.
- WHEN `npm test` runs THEN it SHALL fail if a file name, path data, or ink on the page differs from the SVG files, or if a file contains anything but paths.
- No font file SHALL be added to the repository.
- Every page that mentions the inverted variants SHALL state that they are proposed and that the Primer logo applies to official documents until Kongres approves them.
