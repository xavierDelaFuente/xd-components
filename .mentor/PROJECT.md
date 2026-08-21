# PROJECT — xd-components

**Type**: Component library (monorepo, per-component npm packages)
**Status**: Modules 1–8 (Button family) complete and published. Expanding scope 2026-08-20: versioning infra + four new components (Image, Layout, Input, Form) + a shared design-tokens package (`@asnewyla/tokens`). Plan reviewed and revised same day — fixed an Input/Form accessibility contradiction, locked in controlled-vs-uncontrolled, defined the tokens dependency model, and added `Stack`/`Group` presets to Layout. See Phases 9–14 and Architecture Decisions.
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
| Version strategy | ~~Lockstep~~ → **Independent per-package versioning via Changesets** (superseded 2026-08-20) | Lockstep was fine while every package depended on `button`. Adding `Image`/`Layout` (zero dependency on the Button family) breaks that: lockstep would force version bumps on unrelated packages, which is real noise for consumers and misleading changelogs. Changesets computes correct per-package bumps, including transitive bumps for genuine dependents. Switching now, before the divergent packages exist, not after. |
| npm scope | `@asnewyla` (personal npm username), not `@xd` or `@xd-components` | `@xd` (2 chars) was already taken by someone else on npm — discovered when it wouldn't appear as a selectable scope while creating a granular access token. `@xd-components` was verified available but would have meant reverting the earlier `@xd-components`→`@xd` rename across the whole codebase. User chose the personal scope: zero setup (always exists, no org to create), at the cost of not matching the "XD" branding used elsewhere (GitHub repo, Storybook title). Renamed 2026-08-20, ~66 occurrences across 20 files via a single mechanical find-replace, verified zero `@xd/` references remained before republishing. |
| Publishing auth | Granular access token with "Bypass 2FA" enabled, via `npm config set //registry.npmjs.org/:_authToken` | The account has 2FA required for publish; a live OTP prompt doesn't work through a non-interactive tool shell (no real TTY), same reason a password can't be typed into one either. `npm login`'s browser flow authenticates for read/whoami but not for publish under this account's security policy. |
| `pnpm publish` vs `npm publish` for internal deps | Any package with a `workspace:*` dependency must use `pnpm publish`, not plain `npm publish` | Verified via `pnpm pack` + tarball inspection: `pnpm publish` rewrites `workspace:*` → the real resolved version (`0.1.0`) before publishing; plain `npm publish` doesn't understand the pnpm-specific `workspace:` protocol at all and would publish a broken, unresolvable dependency spec. Only `@asnewyla/unstyled-button` (no internal deps) was safe to `npm publish` directly. |
| Primitive/styled split scope | Only for components with real interactive behavior to separate from presentation | The existing "unstyled primitive under every styled component" rule was written for `Button`. `Image` and `Layout` render no interaction state (no hover/press/focus) — one component, no split. Note: "no primitive split" is not "no state" — `Image`'s `fallback` prop still needs internal `useState` to catch `onError`; the split is about behavior/presentation separation, not statelessness. `Input` has real interactive behavior (focus, typing, keyboard) — it gets the split, same as `Button`: `@asnewyla/unstyled-input` + `@asnewyla/input`. |
| CSS token prefix | Stays `--xd-*`, not renamed to `--asnewyla-*` | It's a stable design-language namespace, conceptually separate from the npm scope — plenty of real projects have an npm org name that differs from their CSS token prefix. Renaming touches every component's CSS for no functional gain. |
| Layout shape | One package `@asnewyla/layout`, one generic `Layout` component (`direction: 'vertical' \| 'horizontal'`, `gap`/`align`/`justify`/`wrap`), plus `Stack` and `Group` exported as thin (~2-line) preset wrappers over it — `Stack` = vertical, `Group` = horizontal | Revised 2026-08-20. `<Layout direction="horizontal" gap="md">` reads worse at the call site than `<Group gap="md">`, and `Layout` will be among the most-written components in the whole library. Presets cost nothing (no duplicated logic, no extra package) and match prior art (Mantine, Chakra) plus the `Group`/`Stack` naming the user recalled from Atlas. |
| Input state model | Uncontrolled by default — the DOM input owns its value (`defaultValue` supported); optional `value`/`onChange` props for consumers who want to control it | Decided 2026-08-20, deliberately before Module 13's first test, since it determines the whole `Input`/`Form` API. Matches native `<input>` behavior and keeps `Form` from becoming a state manager: `Form` reads values through the field-registration context (element refs), validating on blur/submit, rather than lifting state itself. |
| Error display (Input + Form) | **Both**, not either: `Input` keeps its own inline error, linked via `aria-describedby`. `Form` additionally renders an error summary listing all invalid fields, each entry a link to its field's `id`, with `role="alert"` and focus moved to the summary on failed submit | Corrects a real contradiction in the original Module 13/14 wording — "`aria-describedby` → error message" (13) and "displays combined errors rather than per-field" (14) describe two incompatible designs, and only one of them is accessible on its own. WCAG 3.3.1 requires the error be identified at the field; a summary-only pattern (GOV.UK style) is a *complement*, not a substitute — a screen-reader user who tabs directly to the invalid field would otherwise hear nothing. The user's original ask ("show errors together, not per field") is satisfied by the summary; it does not replace the per-field message. |
| Form validation scope | `Form` owns real validation (not just error display) — user's explicit call, overriding the initially-recommended presentational-only design | Deliberately small rule vocabulary: `required`, `pattern`, `minLength`/`maxLength`, `min`/`max` (numeric), custom sync validator function. Explicitly **not** attempting async validation, field arrays, or conditional schemas — that's react-hook-form/zod territory, out of scope for a v0.x component library. |
| Form↔Input context ownership | Lives in `@asnewyla/input`, not `@asnewyla/form` | Same reasoning as `Button`/`ButtonGroup` (see Group context ownership, above) — keeps the dependency one-directional (`form` → `input`, never the reverse). `Input` registers itself into a context that `Form`'s provider populates. Consequence: `input` and `form` (Modules 13/14) ship together in the same release — publishing `input@0.1.0` alone risks discovering the context's shape is wrong only once `form` is actually built against it, which is an avoidable `0.2.0`. |
| Design tokens package | `@asnewyla/tokens` (renamed 2026-08-20 from the tentative `@asnewyla/styleguide`) | "Design tokens" is the established term for this (W3C Design Tokens Community Group); "styleguide" in practice means the documentation site, which is already Storybook's role here — cheaper to rename now than after first publish. Centralizes color/spacing/typography/radius tokens that today only exist as ad-hoc fallback values inside `Button.css`. Ships as `@asnewyla/tokens/tokens.css`, same subpath-export pattern as `@asnewyla/button/styles.css`. |
| Tokens dependency model | Soft dependency: every component's CSS keeps its own hardcoded fallback (`var(--xd-color-primary, #0d9488)`); no component's `package.json` declares a dependency on `@asnewyla/tokens`. Importing `@asnewyla/tokens/tokens.css` overrides the whole set at once; importing nothing still yields a working default | This is the model `Button.css` already uses today, made explicit and load-bearing rather than incidental. The alternative — a hard dependency via `@import` inside published CSS — is fragile: resolving `@import` with a bare package specifier depends on the consumer's bundler/tooling and fails under several common setups (plain `<link>`, some Vite configs). |

---

## Constraints

- Every package must be independently installable and buildable.
- No cross-package imports except through published entry points.
- Peer deps on React; never bundle it.
- Any CI job that runs `test`, `type-check`, or `storybook:build` must run `build` first. Internal `workspace:*` deps resolve through the consumed package's `dist/` (correct — mirrors real publish consumption), and `dist/` is gitignored, so a fresh checkout has none until something builds it. Bit `test-lint-build.yml` (2026-08-20) and `deploy-storybook.yml` (2026-08-20, separately, since it lives on its own branch history) — both fixed. Check for this specifically in any new workflow.
- Every new component module (11 onward) includes its own Storybook stories as part of that module's scope — not a separate catch-up docs phase. Modules 2–5 shipped without stories and Module 6 back-filled all of them at once; decided 2026-08-20 not to repeat that pattern, since an undocumented gap that isn't written down anywhere tends to stay undone.

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
- [x] **9 — Versioning infra** · Changesets installed (`@changesets/cli` as a root devDependency) and configured (`.changeset/config.json`: `access: "public"`, `baseBranch: "main"`, `updateInternalDependencies: "patch"`). Root scripts: `changeset` (add one), `version-packages` (`changeset version`), `release` now `pnpm build && changeset publish` — the old `pnpm -r publish` is gone, one publish path only. `changesets/action` (automated "Version Packages" PR bot) deliberately not wired yet — still an Open Question for a single-contributor repo.
- [x] **10 — `@asnewyla/tokens`** · Color/spacing/radius/typography scales as CSS custom properties under `--xd-*`, values copied 1:1 from `Button.css`'s existing hardcoded fallbacks (colors incl. dark-mode overrides; spacing/radius/font-size/weight/line-height newly named as a scale). Spacing uses `xs`/`sm`/`md`/`lg`/`xl`/`2xl`, not numeric indices — matches the radius scale's naming, changed after user review (numeric names carry no size information on their own). No JS — `tsup` bundles the bare `src/tokens.css` entry directly (tsup supports CSS-only entries; no dummy JS import needed). Storybook: `Foundations/Tokens` docs page (Colors/Spacing/Radius/Typography stories) + `preview.tsx` now imports `@asnewyla/tokens/tokens.css` globally. `Button.css` migrated for real (not just a comment): `gap`, `border-radius`, `font-weight`, `line-height`, and every size variant's `padding`/`font-size` now read `var(--xd-*, <original literal>)` instead of a bare literal — the fallback keeps standalone `Button` pixel-identical, but a consumer overriding a token now genuinely changes rendering (verified via `getComputedStyle` in a Playwright script: overriding `--xd-radius-md`/`--xd-space-md` measurably changed the rendered button, baseline unchanged). Deliberately left un-tokenized, as different categories entirely outside Phase 10's scope (color/spacing/typography/radius): the `color-mix()` hover/active percentages and `--_bg`/`--_bg-hover`/`--_bg-active`/`--_fg` (private, computed-per-instance, not stored values — see Patterns Established Here), `transition` duration/easing (motion), disabled `opacity` (state), focus outline width/offset (border/focus), and the icon slot's 14/16/20px sizes (intrinsic icon dimensions, don't map onto the spacing scale). Verified with Playwright screenshots of every existing Button/IconButton/ButtonGroup story — pixel-identical to before, zero console errors.
- [x] **11 — `@asnewyla/image`** · 13 tests, built via TDD. Non-interactive, no primitive split — one `forwardRef`'d component wrapping a plain `<img>`, no `as` polymorphism (unlike `Button`, always renders an `<img>`). `alt` required at the TS level (no `?`, no default). `fit` (`cover`/`contain`/`fill`/`none`/`scale-down`, defaults `cover`) and `radius` (`sm`/`md`/`lg`/`full`, no default = square corners) drive `data-fit`/`data-radius` attributes mapped to CSS, `radius` reading `@asnewyla/tokens` the same soft-dependency way `Button` does. `aspectRatio` is a raw CSS value passed straight to inline `style` (freeform, not an enum — doesn't fit the `data-*` pattern). Fallback: tracks only a `hasErrored` boolean (not the src itself) so a later `src` prop change is retried fresh rather than staying stuck on a stale fallback — `useEffect` resets it on `src` change, needed a `biome-ignore` (the effect doesn't read `src` in its body, only depends on it, which `useExhaustiveDependencies` doesn't recognize as intentional). Verified in a real browser (not just jsdom `fireEvent.error`): Storybook's `BrokenWithFallback` story genuinely 404s an image and visibly swaps to the fallback.
- [ ] **12 — `@asnewyla/layout`** · Non-interactive, no primitive split. One package exporting the generic `Layout` component (`direction`/`gap`/`align`/`justify`/`wrap`, mapped to the tokens package's spacing scale) plus `Stack` and `Group` as thin preset wrappers (see Architecture Decisions — Layout shape). Plus Storybook stories for `Layout`, `Stack`, and `Group`.
- [ ] **13 — `@asnewyla/unstyled-input` + `@asnewyla/input`** · Primitive/styled split, same shape as `UnstyledButton`/`Button`. Uncontrolled by default with optional `value`/`onChange` (see Input state model). Render props for interaction state (`isFocused`, `isFocusVisible`, `isInvalid`, `isDisabled`). Label association (`htmlFor`/`id` or `aria-labelledby`), `aria-invalid`, `aria-describedby` → own inline error message (see Error display). Exports the field-registration context that `@asnewyla/form` will provide into. Plus Storybook stories. Ships together with Module 14, not published alone (see Form↔Input context ownership).
- [ ] **14 — `@asnewyla/form`** · Wraps `Input` children, owns real validation (see Form validation scope). Renders an error summary in addition to (not instead of) each `Input`'s own inline error — `role="alert"`, links to each invalid field's `id`, receives focus on failed submit (see Error display). Context lives in `@asnewyla/input` (see Form↔Input context ownership). Plus Storybook stories. Ships together with Module 13.

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
- Module 9 (Changesets) merged into `main` 2026-08-20.
- Module 10 (`@asnewyla/tokens`) merged into `main` 2026-08-20 (PR #14, also tokenized `Button.css`'s remaining magic numbers beyond colors — see Module 10 entry).
- Module 11 (`@asnewyla/image`) built via TDD (13 tests) on `feature/image`, not yet merged — see below.

**In progress**
- Nothing on the Button family — Modules 1–8 complete, merged into `main`, and actually live (both Storybook and the npm packages).
- Scope expanded 2026-08-20: Modules 9–14 planned (Changesets, `tokens`, `image`, `layout`, `input`, `form`). Plan reviewed same day (see Architecture Decisions for the resulting rows). Modules 9–10 merged; Module 11 done on `feature/image`, pending commit/merge.

**Next**
- Commit and merge `feature/image` (Module 11).
- Module 12: `@asnewyla/layout`.
- When Module 13 starts: write the Input state model (uncontrolled + optional `value`/`onChange`) into the first test before anything else — it's the decision the rest of the module's API hangs off of.

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
- **Changeset before merging** — any PR that changes a published package's behavior runs `pnpm changeset` before merge (interactive: pick affected package(s), bump type, one-line summary), committing the generated `.changeset/*.md` file alongside the code change. Release is a separate, deliberate step: `pnpm version-packages` (bumps versions + writes changelogs from the accumulated changesets) then `pnpm release` (`pnpm build && changeset publish`). A code change with no changeset just never ships a version bump — the gap surfaces at `pnpm changeset status`, not silently.
- **Leading-underscore custom properties (`--_bg`, `--_bg-hover`, `--_fg`, ...) are private/computed, never tokens** — a `--xd-*` token is a stored design value a consumer can look up and override; `--_bg-hover` is `color-mix(in srgb, var(--_bg) 88%, black)` — computed fresh from whatever `--_bg` currently resolves to (itself a token-or-fallback). This means overriding `--xd-color-primary` automatically produces a correctly-shaded hover/pressed state with no separate `--xd-color-primary-hover` token needed. Don't tokenize these; don't confuse "many CSS custom properties" with "many tokens" — two different categories living side by side in the same file.
- **`tsup` accepts a bare CSS file as `entry`** — for a CSS-only package (`@asnewyla/tokens`), `entry: ['src/tokens.css']` in `tsup.config.ts` builds straight to `dist/tokens.css` with no JS/`dts` output and no dummy `index.ts` that only exists to `import './tokens.css'`. Different from `@asnewyla/button`, where the CSS rides along with a real JS entry — use the bare-CSS-entry form only when the package genuinely has no JS to ship.
- **"Reset state on prop change" effects need a `biome-ignore` for `useExhaustiveDependencies`** — `@asnewyla/image` resets its error state when `src` changes: `useEffect(() => { setHasErrored(false); }, [src])`. The rule doesn't read `src` inside the callback body, only in the dependency array, and Biome's exhaustive-deps check treats that as "extra" and offers to remove it — which would silently break the reset. This is a legitimate, common React pattern the linter doesn't model; ignore it deliberately, don't apply the suggested fix. Same category as the `role="group"` false positive above.
- **Track a boolean flag, not a copy of the prop, when a fallback needs to reset on prop change** — `Image` stores `hasErrored: boolean`, not `currentSrc: string`, and computes the rendered src as `hasErrored && fallback ? fallback : src` each render. Holding a copy of `src` in state instead would require manually syncing it on every `src` change, and is an easy source of "stuck on the old fallback" bugs; deriving from the prop plus one boolean flag doesn't have that failure mode.

---

## Open Questions

- ~~Duplicate `OverridableProps` per package, or extract a `@asnewyla/types` package?~~ Resolved (implicitly): `icon-button` didn't need it at all, so only 2 of 3 packages duplicate it so far. Keep deferring — not worth extracting for one shared type.
- ~~Does `ButtonGroup` create a circular dependency?~~ Resolved 2026-08-20: group context lives in `@asnewyla/button`, not `@asnewyla/button-group`. See Architecture Decisions.
- ~~Publish all four packages at v0.1.0 together, or version independently from the start?~~ Resolved 2026-08-20, then superseded same day: lockstep → independent versioning via Changesets, once `Image`/`Layout` made lockstep's downside concrete. See Architecture Decisions.
- Is `tsdown` (tsup's actively-maintained successor) worth migrating to? Would likely fix CSS Modules support; touches every package's build config. Not urgent — no longer blocking anything now that Module 7 is done; revisit opportunistically.
- `unstyled-input` as a fully separate npm package (matching `unstyled-button`) is real scaling cost — every future interactive component doubles the package count under the "no barrel" rule. Not reconsidering for `input` (consistency wins for now), but worth a harder look once a third interactive primitive shows up.
- ~~`@asnewyla/styleguide` package name — `tokens` is an equally valid and possibly more conventional alternative?~~ Resolved 2026-08-20: renamed to `@asnewyla/tokens`. See Architecture Decisions.
- Should `changesets/action` (auto-opens a "Version Packages" PR on merge) be wired into CI now, or is manual `pnpm changeset version` fine for a single-contributor project? Deferred to Module 9 itself — if yes, needs `permissions: contents: write, pull-requests: write`, an `NPM_TOKEN` secret, and removal of the manual `release` script in the same PR (see Phase 9).
- Module 10 left several magic-number categories un-tokenized in `Button.css` (`color-mix()` hover/active percentages, transition duration/easing, disabled opacity, focus outline width/offset, icon pixel sizes) because they don't fit color/spacing/typography/radius. `Image`/`Input`/`Form` will likely want some of these (focus ring, disabled state, transition timing) too — worth deciding then whether to formalize new token categories (e.g. `--xd-motion-*`, `--xd-focus-ring-*`) or keep them component-local. Not blocking; revisit when a second component actually needs one of these.

---

**Updated**: 2026-08-20, after scope-expansion plan review — Input/Form error-display contradiction fixed, controlled/uncontrolled decided, tokens dependency model defined, Layout gained `Stack`/`Group` presets, `styleguide` renamed to `tokens`. Modules 9–14 planned, pending implementation.
