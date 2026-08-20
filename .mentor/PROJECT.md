# PROJECT — xd-components

**Type**: Component library (monorepo, per-component npm packages)
**Status**: All 8 modules complete, including a real `npm publish`. Nothing planned or deferred remains.
**Live docs**: https://xavierdelafuente.github.io/xd-components/
**Live packages**: `@asnewyla/unstyled-button`, `@asnewyla/button`, `@asnewyla/icon-button`, `@asnewyla/button-group` — all `0.1.0`, all on the public npm registry
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
| Lint/Format | Biome (`biome lint`) — replaced ESLint + Prettier via a separate `build/biome` branch merged into `main` before Module 4 |
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
| Storybook version | v10.5.10 official `init`, not the doc's `addon-essentials` | `@storybook/addon-essentials` has been empty since Storybook 9 and won't be published again (verified against npm registry). Used `npx storybook@latest init --yes --type react --builder vite --package-manager pnpm --features docs a11y` instead of hand-assembling config. |
| CSS distribution | `@asnewyla/button` exports `./styles.css` subpath, `sideEffects: ["*.css"]` | The CSS is a separate file from the JS bundle (tsup doesn't inject at runtime); without an explicit export subpath, `import '@asnewyla/button/styles.css'` 404s under strict `exports` resolution, and `sideEffects: false` would let bundlers tree-shake the import away entirely. Not Storybook-specific — any real consumer hits this. |
| CI timing | Before first feature commit | Quality gate from commit one |
| Group context ownership | Lives in `@asnewyla/button`, not `@asnewyla/button-group` | Avoids a circular workspace dependency — the doc's original design had `button` import `useButtonGroup` from `button-group` while `button-group` imports `Button`'s types from `button`. Keeping the context inside `button` (consumed internally, exported for `ButtonGroup` to use as `Provider`) keeps the dependency one-directional. |
| License | MIT | User's explicit choice (2026-08-20) over Apache-2.0 or staying private. `LICENSE` copied into each package directory — npm only auto-includes a `LICENSE` file in a published tarball when it physically exists inside that package's own directory, not the monorepo root. |
| Version strategy | Lockstep (all four packages bump together), not independent per-package versions | Packages are tightly coupled (3 of 4 depend on `@asnewyla/button`); library is pre-1.0 with a single contributor. Independent versioning needs real tooling (Changesets) to track cleanly — not worth the overhead yet. Revisit if the library matures and packages start evolving at genuinely different paces. |
| npm scope | `@asnewyla` (personal npm username), not `@xd` or `@xd-components` | `@xd` (2 chars) was already taken by someone else on npm — discovered when it wouldn't appear as a selectable scope while creating a granular access token. `@xd-components` was verified available but would have meant reverting the earlier `@xd-components`→`@xd` rename across the whole codebase. User chose the personal scope: zero setup (always exists, no org to create), at the cost of not matching the "XD" branding used elsewhere (GitHub repo, Storybook title). Renamed 2026-08-20, ~66 occurrences across 20 files via a single mechanical find-replace, verified zero `@xd/` references remained before republishing. |
| Publishing auth | Granular access token with "Bypass 2FA" enabled, via `npm config set //registry.npmjs.org/:_authToken` | The account has 2FA required for publish; a live OTP prompt doesn't work through a non-interactive tool shell (no real TTY), same reason a password can't be typed into one either. `npm login`'s browser flow authenticates for read/whoami but not for publish under this account's security policy. |
| `pnpm publish` vs `npm publish` for internal deps | Any package with a `workspace:*` dependency must use `pnpm publish`, not plain `npm publish` | Verified via `pnpm pack` + tarball inspection: `pnpm publish` rewrites `workspace:*` → the real resolved version (`0.1.0`) before publishing; plain `npm publish` doesn't understand the pnpm-specific `workspace:` protocol at all and would publish a broken, unresolvable dependency spec. Only `@asnewyla/unstyled-button` (no internal deps) was safe to `npm publish` directly. |

---

## Constraints

- Every package must be independently installable and buildable.
- No cross-package imports except through published entry points.
- Peer deps on React; never bundle it.
- Any CI job that runs `test`, `type-check`, or `storybook:build` must run `build` first. Internal `workspace:*` deps resolve through the consumed package's `dist/` (correct — mirrors real publish consumption), and `dist/` is gitignored, so a fresh checkout has none until something builds it. Bit `test-lint-build.yml` (2026-08-20) and `deploy-storybook.yml` (2026-08-20, separately, since it lives on its own branch history) — both fixed. Check for this specifically in any new workflow.

---

## Phases

- [x] **1 — Scaffold** · pnpm workspaces, TS strict, Vitest, tsup, ESLint/Prettier, Actions, branch protection
- [x] **2 — UnstyledButton** · polymorphic `as`, forwardRef, render props, interaction state, 11 tests
- [x] **3 — Button** · variants, sizes, icon slots, `as`/forwardRef parity, styling
- [x] **4 — IconButton** · composition over Button, mandatory `aria-label`
- [x] **5 — ButtonGroup** · Context prop inheritance with per-child override
- [x] **6 — Storybook** · centralised stories, a11y addon
- [x] **7 — Build & publish** · verify dist output, npm publish flow — all four packages actually published to the public npm registry at `0.1.0` under `@asnewyla/*` (2026-08-20)
- [x] **8 — Deploy** · Storybook to GitHub Pages via Actions — live at https://xavierdelafuente.github.io/xd-components/, verified (HTTP 200, real story index, correct relative asset paths under the `/xd-components/` subpath)

---

## Current State

**Done**
- Monorepo scaffold; all root scripts working (`test`, `type-check`, `lint`, `build`)
- CI: four parallel jobs, branch protection on `main` (PR + 1 approval + 4 checks)
- `@asnewyla/unstyled-button` complete — 12 tests, built via TDD
- `@asnewyla/button` complete — 17 tests, built via TDD: variants, sizes, icon slots (with `aria-hidden` wrappers), `onClick` pass-through, polymorphic `as`, `forwardRef`, styled via plain namespaced CSS (`.xd-button`, minimal palette, light/dark via `prefers-color-scheme`)
- `@asnewyla/icon-button` complete — 8 tests, built via TDD: mandatory `aria-label`, icon-only (no visible text), `forwardRef`, `IconButtonProps` extends `Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon' | 'as'>` rather than duplicating individual props
- `@asnewyla/button` now also has 19 tests (was 17) — added direct unit tests for its own group-context resolution logic (`ButtonGroupProvider` wired directly, no `button-group` dependency needed)
- `@asnewyla/button-group` complete — 8 tests, built via TDD: `role="group"` wrapper, `variant`/`size`/`disabled` propagate via context, individual override on all three, `forwardRef`. Group context lives inside `@asnewyla/button` (see Architecture Decisions) to avoid a circular workspace dependency.
- Storybook set up (v10.5.10, official `init`) with stories for `Button`, `IconButton`, `ButtonGroup` — first real visual verification of Modules 3–5. Fixed a real `@asnewyla/button` packaging gap along the way (CSS unreachable by consumers — see Architecture Decisions).
- `.github/workflows/deploy-storybook.yml` restored and fixed (was missing/untracked all session, never committed) — needed the same `pnpm build`-before-`test` fix as `test-lint-build.yml`.
- Module 7: all four packages verified `npm publish --dry-run` clean (correct tarball contents, no missing files). Added `LICENSE` (MIT, root + copied into each package), per-package `README.md`, `repository`/`license`/`publishConfig.access` fields, and a root `release` script (`pnpm build && pnpm -r publish`). Lockstep versioning decided (see Architecture Decisions).
- Module 8: GitHub Pages enabled (Source: GitHub Actions), `deploy-storybook.yml` ran successfully, live at https://xavierdelafuente.github.io/xd-components/. Added `workflow_dispatch` trigger for on-demand redeploys without needing a new commit.
- Real `npm publish` completed 2026-08-20: all four packages live at `0.1.0` under `@asnewyla/*` (scope renamed from `@xd`, which turned out to be already taken — see Architecture Decisions). Verified independently post-publish via `npm view` for each package (not just trusting the CLI's success output) — `icon-button` briefly 404'd due to registry read-propagation lag, confirmed genuine via the "cannot publish over existing version" error on a deliberate retry.

**In progress**
- Nothing — all 8 planned modules complete, merged into `main`, and actually live (both Storybook and the npm packages).

**Next**
- Nothing planned. This is a natural session-close point.

---

## Patterns Established Here

Referenced by later phases; do not re-derive.

- **Render props** — `UnstyledButton` exposes `{ isHovered, isPressed, isFocused, isFocusVisible, isDisabled }`. Chosen over callback props because callbacks only allow side effects, not conditional rendering.
- **`isFocusVisible` vs `isFocused`** — ring shows only on keyboard focus. Mouse users already know where they clicked.
- **`data-*` for state** — set with `|| undefined` so false-y states leave no attribute.
- **`OverridableProps<T, Own>`** — shared polymorphic prop type, lives in each package's `utils/types.ts`. Only used by packages that need `as` polymorphism (`unstyled-button`, `button`) — `icon-button` doesn't expose `as`, so it has no need for this type.
- **Compose via `Omit<XProps, '...'> & { ownFields }`, not hand-duplicated props** — `IconButtonProps` extends `Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon' | 'as'>` instead of retyping `variant`/`size`/`disabled`/`onClick` itself. A blocklist of what's disallowed, not an allowlist of what's forwarded — future `Button` props reach `IconButton` with no maintenance here.
- **`prop ?? group?.x ?? default` precedence** — `Button` resolves `variant`/`size`/`disabled` from its own explicit prop first, then `useButtonGroupContext()`, then a hardcoded default. Test this directly in the package that owns the logic (`@asnewyla/button`), not only through the downstream consumer (`@asnewyla/button-group`) — a regression here would otherwise only surface one package away.
- **`role="group"` on a `div`, not `<fieldset>`** — Biome's `useSemanticElements` a11y rule suggests `<fieldset>`; suppressed with a `biome-ignore` because `<fieldset>` is for form-control groupings and carries unwanted default browser chrome for a button toolbar. `role="group"` is itself a correct WAI-ARIA pattern here.
- **Untyped `StoryObj` for render-only compound-demo stories** — `StoryObj<typeof meta>` requires `args` whenever the component has required props (`IconButton.icon`/`label`, `ButtonGroup.children`), even for stories that only use `render` and never touch `args`. Type those specific exports as plain `StoryObj`, keep the meta-bound `Story` alias only for stories that genuinely use `args`.

---

## Open Questions

- ~~Duplicate `OverridableProps` per package, or extract a `@asnewyla/types` package?~~ Resolved (implicitly): `icon-button` didn't need it at all, so only 2 of 3 packages duplicate it so far. Keep deferring — not worth extracting for one shared type.
- ~~Does `ButtonGroup` create a circular dependency?~~ Resolved 2026-08-20: group context lives in `@asnewyla/button`, not `@asnewyla/button-group`. See Architecture Decisions.
- ~~Publish all four packages at v0.1.0 together, or version independently from the start?~~ Resolved 2026-08-20: lockstep. See Architecture Decisions.
- Is `tsdown` (tsup's actively-maintained successor) worth migrating to? Would likely fix CSS Modules support; touches every package's build config. Not urgent — no longer blocking anything now that Module 7 is done; revisit opportunistically.

---

**Updated**: after real `npm publish` (all 8 modules complete, packages live)
