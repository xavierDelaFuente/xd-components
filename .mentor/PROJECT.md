# PROJECT — xd-components

**Type**: Component library (monorepo, per-component npm packages)
**Status**: Modules 1–14 complete (Button family, `tokens`, `image`, `layout`, `unstyled-input`, `input`, `form`). `Card` (15) and a CSS-Grid primitive (16) planned, deliberately unspecified until kickoff.
**Live docs**: https://xavierdelafuente.github.io/xd-components/
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
| Lint/Format | Biome (`biome lint`) — no ESLint/Prettier in this repo |
| Build | tsup (ESM + CJS + d.ts) |
| Styling | Plain CSS (hand-namespaced classes, e.g. `.xd-button`) + `data-*` attributes |
| Docs | Storybook |
| CI | GitHub Actions |
| Deploy | GitHub Pages (Storybook) |

Versions in `package.json` are the source of truth.

---

## Architecture Decisions

| Decision | Choice | Why |
|---|---|---|
| Repo shape | Monorepo | Independently publishable packages, shared tooling |
| Public API | One npm package per component, no barrel | Consumers install only what they use |
| Internal deps | `workspace:*` | Local changes visible without relink |
| Primitive/styled split | Unstyled primitive under any component with real interactive behavior (focus/hover/press/typing) — `unstyled-button`/`button`, `unstyled-input`/`input`. Non-interactive components (`Image`, `Layout`) are one component, no split. | Behavior separable from presentation only where there's behavior to separate; "no split" isn't "no state" (`Image`'s fallback still needs `useState`). |
| State exposure | Render props on primitives with a children slot (`UnstyledButton`); `data-*` attributes on void elements (`UnstyledInput`, no children slot to render into) | Consumer controls rendering from internal state where a slot exists |
| Styling hook | `data-*` attributes, not class-name state | Visible in DevTools, stable for tests |
| CSS scoping | Plain CSS, hand-namespaced classes, not CSS Modules | tsup's CSS Modules support is broken/experimental; revisit only on a build-tool migration |
| CSS distribution | Every styled package exports `./styles.css` as an explicit subpath, `sideEffects: ["*.css"]` | tsup doesn't inject CSS into the JS bundle; without an explicit subpath export the import 404s under strict `exports` resolution, and `sideEffects: false` lets bundlers tree-shake it away entirely |
| CSS token prefix | `--xd-*`, independent of the npm scope | Stable design-language namespace; plenty of real projects diverge here |
| Tokens dependency model | Soft dependency — every component's CSS keeps its own hardcoded fallback (`var(--xd-color-primary, #0d9488)`); no `package.json` declares a dependency on `@asnewyla/tokens` | A hard dependency via `@import` in published CSS is fragile across bundlers; soft dependency degrades to a working default with zero setup |
| Cross-family context ownership | A context consumed by a family of components lives in that family's base package (`ButtonGroupContext` in `@asnewyla/button`; `FormFieldContext` in `@asnewyla/input`), not in the consuming package | Keeps the dependency graph one-directional, avoids circular workspace deps |
| Context-consumption weight | Consume an ancestor context directly when the surface is small (`Button`/`ButtonGroupContext`: 3 keys, one-line `??` fallback); split into a dedicated wrapper component once it's heavier (`FormFieldInput` wraps `Input`: required `name`, six rule props, a registration effect, ref-merging, blur composition) | Match structure to weight, not to shape — a pattern that fits a light case doesn't automatically fit a heavier one |
| `FormFieldInput` package | Ships from `@asnewyla/form`, importing `Input`/`FormFieldContext`/`useFormFieldContext` from `@asnewyla/input` as an external dependency | It's a `Form`-consuming component (registers into `FormFieldContext`, calls `validateField`) more than an `Input`-family one; a form consumer imports `Form` and `FormFieldInput` from one package |
| Input value model | Uncontrolled by default (native `defaultValue`), optional `value`/`onChange` for controlled use | Matches native `<input>`; keeps `Form` from becoming a state manager |
| Form value collection | `new FormData(form).entries()` at submit, per-field at blur — not ref-walking, not a duplicated React state tree | `FormFieldInput` already puts a native `name` on the input, so `FormData` is the correct primitive. Consequence (accepted, tested): an unregistered `<input name>` inside a `Form` still contributes its value to `onSubmit` even without `FormFieldInput` |
| Error display | Both: inline per-field error on `Input` (`aria-describedby`) and a `Form`-level error summary (`role="alert"`, links to each field's `id`, focus moves to the summary on failed submit) | WCAG 3.3.1 requires the error identified at the field; a summary is a complement, not a substitute |
| Form validation scope | `required`, `pattern`, `minLength`/`maxLength`, `min`/`max`, one custom sync validator | Async validation, field arrays, conditional schemas are out of scope for a v0.x component library |
| Versioning | Independent per-package via Changesets (`access: "public"`) | Packages have divergent dependency graphs (`Image`/`Layout` don't depend on `Button`); lockstep would force noisy, misleading bumps on unrelated packages |
| npm scope | `@asnewyla` (personal npm username) | `@xd` was already taken; `@xd-components` was available but not worth reverting the existing `@xd` naming across the codebase |
| Publishing | `pnpm publish`, never plain `npm publish`, for any package with a `workspace:*` dependency; personal-account granular token with "Bypass 2FA" for non-interactive publish | `npm publish` doesn't resolve the `workspace:` protocol; a live OTP prompt has no TTY in a non-interactive shell |
| License | MIT, `LICENSE` file copied into every package directory | npm only includes `LICENSE` in a published tarball when it physically exists inside that package's own directory |
| Storybook | v10.5.10 via official `init`, not `@storybook/addon-essentials` | That addon has been empty since Storybook 9 |

---

## Constraints

- Every package must be independently installable and buildable.
- No cross-package imports except through published entry points.
- Peer deps on React; never bundle it.
- Any CI job running `test`, `type-check`, or `storybook:build` must run `build` first — `workspace:*` deps resolve through the consumed package's `dist/`, which is gitignored.
- Every component module ships its own Storybook stories as part of that module's scope, not a later catch-up pass.
- Any PR that changes a published package's behavior includes a changeset (`pnpm changeset`) before merge.
- Whenever an implementation's behavior in an edge case is uncertain and gets accepted rather than changed (a native HTML attribute silently blocking an action, a framework default overriding an expectation, etc.), add a dedicated test that locks in that exact behavior — not just a comment explaining it inside another test. The test suite is the contract for what the library actually does, quirks included, not only its intended features.

---

## Packages

**Button family** — `@asnewyla/unstyled-button` (primitive: polymorphic `as`, `forwardRef`, render props `{isHovered,isPressed,isFocused,isFocusVisible,isDisabled}`); `@asnewyla/button` (variants/sizes/icon slots, styled, resolves `variant`/`size`/`disabled` via `prop ?? group?.x ?? default`); `@asnewyla/icon-button` (composes `Button` via `Omit<ButtonProps,...>`, mandatory `aria-label`, no `as`); `@asnewyla/button-group` (`role="group"`, propagates `variant`/`size`/`disabled` through `ButtonGroupContext`, which lives in `@asnewyla/button`).

**`@asnewyla/tokens`** — Color/spacing/radius/typography scales as `--xd-*` custom properties. CSS-only package (`tsup` entry is the bare CSS file, no JS/d.ts). Spacing/radius/typography in `rem`; `radius-full` (`9999px`, a pill trick value) and `border-width`/`focus-ring` (fixed-pixel accents) are the deliberate `px` exceptions. Consumed as a soft dependency everywhere (see Architecture Decisions).

**`@asnewyla/image`** — Non-interactive, no primitive split. `alt` required at the type level, no default. `fit`/`radius` drive `data-*`-mapped tokens; `aspectRatio` is a raw CSS value via inline `style`. Fallback tracked as a `hasErrored` boolean, not a copy of `src` — reset via a `useEffect` keyed on `src`.

**`@asnewyla/layout`** — `Layout` (`direction`/`gap`/`align`/`justify`/`wrap` as `data-*`-mapped tokens) plus `Stack`/`Group` as thin wrappers that spread props first and force `direction` last, so the fixed axis can't be overridden even by bypassing the type system.

**`@asnewyla/unstyled-input` + `@asnewyla/input`** — Uncontrolled by default. State exposed via `data-focused`/`data-invalid`/`data-disabled`, not render props (void element, no children slot). `InputProps` derives from `UnstyledInputProps`, not raw `InputHTMLAttributes`. `invalid` is derived from `!!error`, not a separate prop. `@asnewyla/input` also exports `FormFieldContext`/`FormFieldProvider`/`useFormFieldContext` (see Cross-family context ownership) — `Input` itself has zero knowledge of `Form`.

**`@asnewyla/form`** — `Form` (renders `<form>`, owns validation, provides `FormFieldContext`; internals split into `validation.ts` — pure `validateValue`, no React — and `useFieldRegistry.ts` — the field `Map`/`errors` state and register/unregister/validate) and `FormFieldInput` (wraps `Input`: `name` + rule props + registration effect + ref-merging + blur-triggered validation; no-ops gracefully with no `FormFieldProvider` ancestor — native attributes like `required`/`pattern` still reach the DOM either way). See Form value collection and `FormFieldInput` package decisions.
Open: the error-summary UI (see Error display), Storybook stories, release-readiness files (`LICENSE`/`README`/dry-run tarball).

**Planned** — `@asnewyla/card` (media+body surface, wraps `@asnewyla/image`; boundary and prop shape open until kickoff). Grid (CSS-Grid layout primitive complementary to `Layout`; package placement — inside `@asnewyla/layout` vs. standalone — open until `Card` exists as a concrete consumer).

---

## Next

- Changeset covering: `@asnewyla/input`, `@asnewyla/form`, `@asnewyla/unstyled-input` (first publish, all three); `patch` for `unstyled-button`/`image` (restProps-ordering fix); `minor` for `@asnewyla/tokens` (new token categories, radius `px`→`rem`); `patch` for `@asnewyla/button` (now consumes the new tokens).
- `@asnewyla/form`: error summary, Storybook stories, release-readiness files.
- `Card` (15) / Grid (16) — not started.

---

## Patterns Established Here

Referenced by later phases; do not re-derive.

- **Render props on primitives with a children slot** — `{isHovered,isPressed,isFocused,isFocusVisible,isDisabled}`. Callbacks only allow side effects, not conditional rendering.
- **`isFocusVisible` vs `isFocused`** — ring shows only on keyboard focus.
- **`data-*` for state** — set with `|| undefined` so falsy states leave no attribute.
- **`OverridableProps<T, Own>`** — shared polymorphic prop type, lives in each package's `utils/types.ts`; only for packages that expose `as` polymorphism.
- **Compose via `Omit<XProps, 'k'> & { ownFields }`, not hand-duplicated props** — a blocklist of what's disallowed, not an allowlist of what's forwarded, so future upstream props reach the wrapper with no maintenance.
- **`prop ?? group?.x ?? default` precedence** — test this directly in the package that owns the logic, not only through the downstream consumer.
- **`role="group"` on a `div`, not `<fieldset>`** — `<fieldset>` carries unwanted default browser chrome for a toolbar; the a11y lint is a deliberate `biome-ignore`, not an oversight.
- **Untyped `StoryObj` for render-only compound-demo stories** — `StoryObj<typeof meta>` forces `args` even for stories that only use `render`; type those specific exports as plain `StoryObj`.
- **Changeset before merge** — any PR changing a published package's behavior runs `pnpm changeset` before merge. Release is separate: `pnpm version-packages` then `pnpm release`.
- **Leading-underscore custom properties (`--_bg`, `--_bg-hover`, `--_fg`, ...) are private/computed, never tokens** — a `--xd-*` token is a stored value; `--_bg-hover` is `color-mix()` derived fresh from `--_bg`. Don't tokenize these — overriding the source token already produces a correctly-shaded derived state.
- **Bare CSS `entry` in tsup for CSS-only packages** — `entry: ['src/tokens.css']` builds straight to `dist/tokens.css`, no dummy JS import needed. Only for packages with genuinely no JS to ship.
- **"Reset state on prop change" effects need a `biome-ignore` for `useExhaustiveDependencies`** — e.g. `useEffect(() => setHasErrored(false), [src])`. The linter doesn't read `src` in the callback body and treats the dependency as extraneous; the suggested "fix" would silently break the reset.
- **Track a boolean flag, not a copy of the prop, when a fallback needs to reset on prop change** — avoids "stuck on stale fallback" bugs from manually syncing a copied value.
- **`forwardRef(Inner) as <T,>(...) => ReactElement` only when `Inner` itself is generic** — i.e. only components with a polymorphic `as` prop (`UnstyledButton`, `Button`). Every non-polymorphic component uses plain `forwardRef(Inner)`; the two coexisting forms are correct, not inconsistent.
- **`*Props` composition: `type X = Omit<Base, 'k'> & { ownFields }`, not `interface X extends Omit<Base, 'k'>`** — always `ComponentPropsWithoutRef`, never bare `ComponentProps`, when deriving from a `forwardRef` component (bare `ComponentProps` retains `RefAttributes`, duplicating `ref`). The polymorphic pair (`UnstyledButton`/`Button`) is the deliberate exception, driven by the `as`-prop machinery.
- **Storybook demos use `Layout`/`Stack`/`Group`, not raw flex divs** — a story file reaching for a raw div is a signal something's wrong with `Layout`'s API. Exception: `Tokens.stories.tsx`, since `tokens` sits upstream of `layout`.
- **`{...restProps}` position matters, differently for values vs. event handlers** — for a plain value never meant to be overridden, spread `{...rest}` first, the protected value after. For an event handler the component owns internal behavior through, reordering alone can't work — destructure the handler explicitly and compose both inside one internal handler (`onFocus?.(e)` called from `handleFocus`). Every primitive with internal state driven by a native event needs this from the start.
- **`tsup`'s `dts` build type-checks every file under `src/`, not just what's reachable from the entry point** — an unimported scratch file with type errors breaks the whole package's build. Keep genuinely-scratch exploration outside `src/`.
- **Token units: `rem` for anything that should scale with text-size preference, `px` only for deliberate fixed-pixel exceptions** (`radius-full`'s pill trick value; `border-width`/`focus-ring` hairline accents). Document the `px` exception in a comment next to the token, or it reads as a forgotten conversion.
- **A context provider with local state must memoize both its callbacks (`useCallback`) and the value object (`useMemo`)** — otherwise a consumer whose effect depends on the whole object thrashes on every unrelated state change, wiping state written earlier in the same tick. The consumer's effect should also depend on the specific callbacks it needs, not the whole context object. Every context that manages its own state needs this from the start.
- **Split a context-consuming concern into a wrapper component once it stops being a one-line `??` fallback** — same underlying rule as direct consumption ("plain component, no-op gracefully without the ancestor context"), different structural choice based on the weight of what the context adds, not the shape of the problem.

---

## Open Questions

- Is `tsdown` (tsup's actively-maintained successor) worth migrating to? Would likely fix CSS Modules support; not urgent.
- `unstyled-input` as a fully separate npm package doubles the package count for every future interactive primitive under the no-barrel rule. Not reconsidering yet — worth a harder look once a third interactive primitive shows up.
- Should `changesets/action` (automated "Version Packages" PR bot) be wired into CI, or is manual `pnpm changeset version` fine for a single-contributor repo? If yes: needs `permissions: contents: write, pull-requests: write`, an `NPM_TOKEN` secret, and removal of the manual `release` script in the same change.
