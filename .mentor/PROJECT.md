# PROJECT — xd-components

**Type**: Component library (monorepo, per-component npm packages)
**Status**: Module 3 of 8
**Repo**: https://github.com/xavierDelaFuente/xd-components
**Local**: ~/Repos/2026/xd-components

---

## Stack

| Layer | Choice |
|---|---|
| Language | TypeScript, strict |
| Framework | React 18 |
| Packages | pnpm workspaces |
| Test | Vitest + Testing Library + jsdom |
| Build | tsup (ESM + CJS + d.ts) |
| Styling | Plain CSS (hand-namespaced classes, e.g. `.xd-button`) + `data-*` attributes — see Architecture Decisions |
| Docs | Storybook |
| CI | GitHub Actions |
| Deploy | GitHub Pages (Storybook) |

Versions in `package.json` are the source of truth — check there, not here.

---

## Architecture Decisions

| Decision | Choice | Why |
|---|---|---|
| Repo shape | Monorepo | Four independently publishable packages |
| Public API | One npm package per component, **no barrel** | Consumers install only what they use |
| Internal deps | `workspace:*` | Local changes visible without relink |
| Base layer | Unstyled primitive under every styled component | Behavior separable from presentation |
| State exposure | Render props on primitives | Consumer controls rendering from internal state |
| Styling hook | `data-*` attributes, not class-name state | Visible in DevTools, stable for tests |
| CSS scoping | Plain CSS, hand-namespaced classes (`.xd-button`), not CSS Modules | `esbuild-css-modules-plugin` (only viable option found) produces broken dist paths and non-functional class hashing under `tsup`; tsup's own CSS support is documented experimental. Revisit if tooling improves or the project migrates to `tsdown`. |
| CI timing | Before first feature commit | Quality gate from commit one |

---

## Constraints

- Every package must be independently installable and buildable.
- No cross-package imports except through published entry points.
- Peer deps on React; never bundle it.
- Any CI job that runs `test` or `type-check` must run `build` first. Internal `workspace:*` deps resolve through the consumed package's `dist/` (correct — mirrors real publish consumption), and `dist/` is gitignored, so a fresh checkout has none until something builds it. Bit `@xd/button` on 2026-08-20; will hit `icon-button`/`button-group` too.

---

## Phases

- [x] **1 — Scaffold** · pnpm workspaces, TS strict, Vitest, tsup, ESLint/Prettier, Actions, branch protection
- [x] **2 — UnstyledButton** · polymorphic `as`, forwardRef, render props, interaction state, 11 tests
- [x] **3 — Button** · variants, sizes, icon slots, `as`/forwardRef parity, styling
- [ ] **4 — IconButton** · composition over Button, mandatory `aria-label`
- [ ] **5 — ButtonGroup** · Context prop inheritance with per-child override
- [ ] **6 — Storybook** · centralised stories, a11y addon
- [ ] **7 — Build & publish** · verify dist output, npm publish flow
- [ ] **8 — Deploy** · Storybook to GitHub Pages via Actions

---

## Current State

**Done**
- Monorepo scaffold; all root scripts working (`test`, `type-check`, `lint`, `build`)
- CI: four parallel jobs, branch protection on `main` (PR + 1 approval + 4 checks)
- `@xd/unstyled-button` complete — 12 tests, built via TDD
- `@xd/button` complete — 17 tests, built via TDD: variants, sizes, icon slots (with `aria-hidden` wrappers), `onClick` pass-through, polymorphic `as`, `forwardRef`, styled via plain namespaced CSS (`.xd-button`, minimal palette, light/dark via `prefers-color-scheme`)

**In progress**
- Module 3 functionally done. Not yet visually verified in a browser — no Storybook/demo app exists yet (that's Module 6).

**Next**
- Module 4: IconButton, composing `Button`.

---

## Patterns Established Here

Referenced by later phases; do not re-derive.

- **Render props** — `UnstyledButton` exposes `{ isHovered, isPressed, isFocused, isFocusVisible, isDisabled }`. Chosen over callback props because callbacks only allow side effects, not conditional rendering.
- **`isFocusVisible` vs `isFocused`** — ring shows only on keyboard focus. Mouse users already know where they clicked.
- **`data-*` for state** — set with `|| undefined` so false-y states leave no attribute.
- **`OverridableProps<T, Own>`** — shared polymorphic prop type, lives in each package's `utils/types.ts`.

---

## Open Questions

- Duplicate `OverridableProps` per package, or extract a `@xd/types` package? Currently duplicated — revisit at Module 5.
- Does `ButtonGroup` create a circular dependency (`button` reads its context, `button-group` imports `button` types)? Resolve before starting Module 5.
- Publish all four packages at v0.1.0 together, or version independently from the start?
- Is `tsdown` (tsup's actively-maintained successor) worth migrating to? Would likely fix CSS Modules support; touches every package's build config. Not urgent — revisit at Module 7 (Build & Publish) or if tsup's pace keeps slowing.

---

**Updated**: after Module 3
