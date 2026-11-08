# ppij-design-system

PPIJ presentation components on React 19, Tailwind CSS v4 and shadcn/ui on
Radix, with the framework-free token layer beside them. Public, member portal,
admin, Pemira, Keycloak and email surfaces consume this package; it holds no
application data logic, no API clients and no secrets.

```sh
npm install ppij-design-system
```

`npm install ppij-design-system` is the primary route. The fallback is the
tarball attached to the release:

```sh
npm install https://github.com/ppij-dev/ppij-design-system/releases/download/v0.4.0/ppij-design-system-0.4.0.tgz
```

Do not install `github:ppij-dev/ppij-design-system`: that installs the
repository root, which is the private npm workspace, not this package.

## Exports

- `ppij-design-system` — the React components from the package root
- `ppij-design-system/tokens.css` — the token layer, plus Tailwind's own import
- `ppij-design-system/tokens.json` — the same values, framework free

## Consumer setup

Two things are the consuming app's:

- **Tailwind CSS v4.** `tokens.css` opens with `@import "tailwindcss"`, so
  install `tailwindcss` and `@tailwindcss/vite` (or the equivalent PostCSS
  plugin) and import the token file once. The component classes are Tailwind
  utilities; without the plugin the token import cannot resolve.
- **The automatic JSX runtime**, as in any React 19 app
  (`@vitejs/plugin-react`, or `esbuild: { jsx: "automatic" }`).

```tsx
import { AdminTopBar, MapCard, PanelCard, PieChart } from "ppij-design-system";
import "ppij-design-system/tokens.css";
import tokens from "ppij-design-system/tokens.json";
```

The component guidelines and every component story live in the Storybook Docs
pages at https://ppij-dev.github.io/ppij-design-system/.
