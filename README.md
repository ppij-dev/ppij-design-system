# ppij-design-system

The public branding and design system for PPIJ (Persatuan Pelajar Indonesia di Jepang).
This repo is the single source of truth for the PPIJ brand, design tokens, and
presentation components. Public, member portal, admin, Pemira, Keycloak, and email
surfaces consume this repo. They do not copy it.

This repo holds brand and presentation only. It holds no application data logic,
no API clients, and no secrets. It is a public repository so any agent or project
can download it without credentials.

## Layout

- `brand/`: logo assets, palette, typography, voice, and usage rules
- `tokens/`: framework free design tokens (`tokens.json` plus CSS variables).
  These values feed React and Astro, Keycloak CSS, and email HTML.
- `packages/ui/`: React presentation components on shadcn/ui and Tailwind CSS v4,
  each with a Storybook story beside it
- Storybook: the human view of the whole system, grouped Public, Portal, Admin

## Install

```sh
npm install ppij-design-system
```

Exports: React components from the package root,
`ppij-design-system/tokens.css`, and `ppij-design-system/tokens.json`.
`npm install ppij-design-system` is the primary route. The fallback is the
tarball attached to the release:

```sh
npm install https://github.com/ppij-dev/ppij-design-system/releases/download/v0.4.1/ppij-design-system-0.4.1.tgz
```

Do not install `github:ppij-dev/ppij-design-system`: that installs the
repository root, which is the private npm workspace, not the package.

A consumer needs two things of its own, both proved by installing a packed
tarball into an app with no credentials:

- **Tailwind CSS v4.** `ppij-design-system/tokens.css` opens with
  `@import "tailwindcss"`, so the app installs `tailwindcss` and
  `@tailwindcss/vite` (or the equivalent PostCSS plugin) and imports the token
  file once. The components' classes are Tailwind utilities; without the plugin
  the token import fails to resolve.
- **The automatic JSX runtime.** Any React 19 app does this already
  (`@vitejs/plugin-react`, or `esbuild: { jsx: "automatic" }`); with the classic
  runtime a page compiles to `React.createElement` and needs `React` in scope.

```tsx
import { PanelCard, PieChart } from "ppij-design-system";
import "ppij-design-system/tokens.css";
import tokens from "ppij-design-system/tokens.json";
```

## View the guideline

The design guideline and every component live in Storybook, published at
https://ppij-dev.github.io/ppij-design-system/

## Consume, never copy

Applications pin a released version of `ppij-design-system`.
Upgrading is a version bump plus a visual check. Copying a component or a token
value into an application is prohibited.

## Work here

Specs live in `openspec/specs/`. Work runs through OpenSpec changes in
`openspec/changes/`. Verify with `scripts/gate.sh`. The gate must be green
before a merge or a release.
