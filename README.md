# xd-components

Modular React component library. Monorepo of independently publishable
packages (`@asnewyla/*`), managed with pnpm workspaces.

## Packages

- `@asnewyla/unstyled-button` — unstyled, accessible button primitive
- `@asnewyla/button` — styled button (variants, sizes, icons)
- `@asnewyla/icon-button` — icon-only button
- `@asnewyla/button-group` — composable group with Context API
- `@asnewyla/tokens` — design tokens (color, spacing, radius, typography) as CSS custom properties
- `@asnewyla/image` — image display with aspect ratio, object-fit, token-based rounding, and a load-error fallback

## Scripts

```bash
pnpm install
pnpm type-check
pnpm build
pnpm test
pnpm lint
pnpm format
pnpm storybook        # local dev server, http://localhost:6006
pnpm storybook:build  # static build, deployed to GitHub Pages on push to main
```

## Releasing

Versioning is per-package via [Changesets](https://github.com/changesets/changesets),
not lockstep. Any PR that changes a published package's behavior needs a
changeset:

```bash
pnpm changeset         # interactive: pick package(s), bump type, summary
                        # commit the generated .changeset/*.md alongside the code change
pnpm version-packages   # consumes pending changesets, bumps versions, writes CHANGELOGs
pnpm release            # pnpm build && changeset publish
```
