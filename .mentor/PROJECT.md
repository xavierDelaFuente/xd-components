# PROJECT — xd-components

**Type**: Component library (monorepo, per-component npm packages)
**Status**: Modules 1–16 complete (Button family, `tokens`, `image`, `layout`, `unstyled-input`, `input`, `form`, `card`, `Grid` folded into `@asnewyla/layout`). See Next for the prioritized roadmap of planned modules.
**Live packages**: all 11 published on the public npm registry — `unstyled-button`/`button` at `0.2.0`, `icon-button`/`button-group` at `0.1.1`; `tokens`/`image`/`unstyled-input`/`input` at `0.2.0`; `layout` at `0.3.0` (Grid); `form` at `0.2.1` (error summary styles); `card` at `0.2.0`. Verified via a direct `npm publish` retry (rejected with "cannot publish over previously published version") — see the `npm view` read-path-lag Pattern.
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
| Native vs. custom validation | `<form noValidate>` — `Form`'s own JS validation is the only validation that runs; the browser's native constraint validation (triggered by the real `required`/`pattern`/etc. attributes `FormFieldInput` sets) is disabled | Without `noValidate`, native validation blocks the `submit` event entirely on an invalid required field, before `handleSubmit` ever runs — `required`/`pattern`/etc. still need to be real HTML attributes (for the "used outside a `Form`, native validation still works" contract), but the browser's own enforcement of them has to be turned off for `Form`'s validation and error summary to be the thing that actually runs |
| `Card` image prop shape | `image?: Omit<ImageProps, 'radius'>`, spread onto an internal `Image` | Full `Image` flexibility (`fit`, `aspectRatio`, `fallback`, native `<img>` attributes) for free, matching the `Omit`-blocklist composition convention already used for `IconButton`→`Button` — a hand-picked minimal subset would need its own follow-up the first time a consumer needed `fit` or `aspectRatio`. `radius` is the one exclusion: `Card`'s own `radius` has to govern the outer shape (including the image's top corners), so a separately configurable image `radius` would just create a way to fight it |
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

**Button family** — `@asnewyla/unstyled-button` (primitive: polymorphic `as`, `forwardRef`, render props `{isHovered,isPressed,isFocused,isFocusVisible,isDisabled}` — `isFocusVisible`/`data-focus-visible` is implemented (`e.target.matches(':focus-visible')`) but deliberately untested: confirmed via a throwaway probe that jsdom's `:focus-visible` matches `true` for both a Tab-focus and a plain `.focus()`/click-triggered focus, so it can't distinguish keyboard from mouse here — a test would either be unwritable or falsely reassuring); `@asnewyla/button` (variants/sizes/icon slots, styled, resolves `variant`/`size`/`disabled` via `prop ?? group?.x ?? default`); `@asnewyla/icon-button` (composes `Button` via `Omit<ButtonProps,...>`, mandatory `aria-label`, no `as`); `@asnewyla/button-group` (`role="group"`, propagates `variant`/`size`/`disabled` through `ButtonGroupContext`, which lives in `@asnewyla/button`).

**`@asnewyla/tokens`** — Color/spacing/radius/typography scales as `--xd-*` custom properties. CSS-only package (`tsup` entry is the bare CSS file, no JS/d.ts). Spacing/radius/typography in `rem`; `radius-full` (`9999px`, a pill trick value) and `border-width`/`focus-ring` (fixed-pixel accents) are the deliberate `px` exceptions. Consumed as a soft dependency everywhere (see Architecture Decisions).

**`@asnewyla/image`** — Non-interactive, no primitive split. `alt` required at the type level, no default. `fit`/`radius` drive `data-*`-mapped tokens; `aspectRatio` is a raw CSS value via inline `style`. Fallback tracked as a `hasErrored` boolean, not a copy of `src` — reset via a `useEffect` keyed on `src`.

**`@asnewyla/layout`** — `Layout` (`direction`/`gap`/`align`/`justify`/`wrap` as `data-*`-mapped tokens) plus `Stack`/`Group` as thin wrappers that spread props first and force `direction` last, so the fixed axis can't be overridden even by bypassing the type system.

**`@asnewyla/unstyled-input` + `@asnewyla/input`** — Uncontrolled by default. State exposed via `data-focused`/`data-invalid`/`data-disabled`, not render props (void element, no children slot). `InputProps` derives from `UnstyledInputProps`, not raw `InputHTMLAttributes`. `invalid` is derived from `!!error`, not a separate prop. `@asnewyla/input` also exports `FormFieldContext`/`FormFieldProvider`/`useFormFieldContext` (see Cross-family context ownership) — `Input` itself has zero knowledge of `Form`.

**`@asnewyla/form`** — `Form` (renders `<form noValidate>`, owns validation, provides `FormFieldContext`; internals split into `validation.ts` — pure `validateValue`, no React — `useFieldRegistry.ts` — the field `Map`/`errors` state, register/unregister/validate, and `invalidFields()` for the summary — and `FormErrorSummary.tsx`/`.css`, the summary UI itself, split out to match the `validation.ts`/`useFieldRegistry.ts` file-per-concern convention) and `FormFieldInput` (wraps `Input`: `name` + rule props + registration effect + ref-merging + blur-triggered validation; no-ops gracefully with no `FormFieldProvider` ancestor — native attributes like `required`/`pattern` still reach the DOM either way). Field-level markup still comes entirely from `@asnewyla/input`'s stylesheet, but `Form` now also ships its own CSS for the error summary (destructive-colored border/heading/links, `--xd-color-destructive` token) — a consumer needs to import both. See Form value collection, `FormFieldInput` package, and native validation vs. custom validation decisions. `LICENSE`/`README.md`/Storybook stories in place — see Release readiness below for what's still open.

**`@asnewyla/card`** — Shipped, live at `0.2.0` (22/22 tests, build/type-check/lint clean, verified in a real browser via Playwright screenshots). Own package, non-interactive, no primitive split (same category as `Image`/`Layout`). `CardProps = ComponentPropsWithoutRef<'div'> & { children (required), image?: Omit<ImageProps, 'radius'>, padding?: 'sm'|'md'|'lg' (defaults 'md'), radius?: 'sm'|'md'|'lg'|'full' (no default, square corners) }` — spreads native div props (`className` merged with `.xd-card`, not replaced; other rest props like `id`/`aria-label` pass through), matching the `ButtonGroup`/`Layout` composition convention. No `variant`/border-vs-shadow prop for v0.x — a single fixed surface treatment until a second real use case demands more, same "wait for the second consumer" bar Module 10 used for tokens.

`Card.css`: padding and the full-bleed image negation both read from one private `--_padding` custom property per `data-padding` value (`--_bg`/`--_bg-hover`-style private, not a token) — the image negates `--_padding` via a matching negative margin to reach the card's edges, then `overflow: hidden` + the card's own `border-radius` clips it, so no separate image-radius handling is needed at all. Verified via Playwright: image renders full-bleed and correctly clipped to the card's rounded corners; a naive "image width should equal the card's outer `getBoundingClientRect` width" check was off by exactly the border width (2px) — expected, since the image fills to the *inside* edge of the border, not underneath it; confirmed correct visually, not a bug.

Two implementation gaps found and fixed along the way: (1) first pass had `padding` typed required despite a runtime default, a hand-rolled `image` shape instead of `Omit<ImageProps, 'radius'>`, and a `radius` union missing `'full'` — all passed `vitest` (which doesn't type-check) but failed `tsc`/`tsup`'s dts step. (2) `CardProps` didn't accept `style`/`className`/any native div attributes at all, unlike every other non-polymorphic component in this codebase — fixed via the same `ComponentPropsWithoutRef<'div'>` composition every sibling package already uses. Storybook stories (`storybook/Card.stories.tsx`: `Default`, `WithImage`, `PaddingSizes`, `RadiusSizes`) use inline SVG data URIs for the demo image, not a network URL — matches `Image.stories.tsx`'s existing convention and is why the first `WithImage` screenshot came back blank (an external `picsum.photos` URL, no network access in this environment). `LICENSE`/`README.md` added, dry-run tarball verified (11 files), changeset added. Release-ready — just needs merging and shipping through the normal `changeset version` + `changeset publish` flow.

**Grid** — Done. Folds into `@asnewyla/layout` as a fourth export, not a standalone package — matches the `Stack`/`Group` precedent (closely related "arrange these children" primitives sharing one package, same soft dependency on the gap token scale) over a literal reading of "one package per component," which was written to avoid forcing unwanted deps, not to split apart things this closely related. `GridProps`: `columns?: number | string` (a number renders `repeat(N, 1fr)`; a string passes straight through as `grid-template-columns` — a freeform escape hatch via inline `style`, same pattern as `Image`'s `aspectRatio`, not a `data-*` attribute since the value space isn't a finite enum), `gap?: 'sm'|'md'|'lg'` (reuses `Layout`'s existing gap scale/tokens exactly), `align?`/`justify?: 'start'|'center'|'end'` (map to `align-items`/`justify-items`, not `align-content`/`justify-content` — track-distribution alignment deferred until a real need shows up), plus the rest of native `<div>` props via `Omit<HTMLAttributes<HTMLDivElement>, 'className'|'children'>`, matching `Layout`'s own composition exactly (its direct sibling in the same file). `data-testid` defaults to `'grid'`, matching `Layout`/`Stack`/`Group`. `Grid.css` styles `data-gap`/`data-align`/`data-justify` the same way `Layout.css` does; `display: grid` lives in the stylesheet, not inline (only `gridTemplateColumns`, freeform, stays inline). Storybook stories (`storybook/Grid.stories.tsx`) verified in a real browser via Playwright — column-track proportions and align/justify-items centering both confirmed correct; one story (`ThreeColumns`) needed a width-constraining wrapper like its siblings already had, since without one each `1fr` track collapses to its content's minimum width instead of splitting available space.

Two real gaps found and fixed during implementation, worth remembering for the next component built from scratch rather than copied from a sibling: (1) `GridProps` was originally a hand-rolled closed object type instead of extending native `<div>` props — TypeScript specially exempts `data-*`/`aria-*` attribute names from prop-type checking on *any* JSX element regardless of the component's declared props, so a test passing `aria-label` looked like it proved "arbitrary attribute passthrough" while an ordinary prop like `id` actually failed to type-check — a real TypeScript consumer couldn't have written `<Grid id="foo">` at all, even though the runtime `{...rest}` spread would have handled it fine. Fixed by composing from `Omit<HTMLAttributes<HTMLDivElement>, 'className'|'children'>` like `Layout`, and swapped the test's `aria-label` for `id` so it actually proves what it claims — a `data-*`/`aria-*`-based passthrough test is not real evidence of native-prop composition. (2) The `{...rest}` spread came *before* the protected `data-gap`/`data-align`/`data-justify`/`className` values instead of after — exactly the ordering gotcha already documented in Patterns below, just not yet applied to `Grid`'s first draft.

---

## Release Readiness

All 11 packages have `LICENSE`, `README.md`, a verified dry-run tarball, Storybook stories, and are published live on npm — see Live packages above. Nothing currently pending.

**Post-release audit** (all 11 packages, cross-package): reviewed for refactor candidates, missing tests, and native-element-instead-of-`@asnewyla`-component gaps in Storybook demos. Fixed: `Form`'s error summary had zero CSS despite being an advertised feature (added `FormErrorSummary.css`, extracted the component to its own file to match the `validation.ts`/`useFieldRegistry.ts` split, re-added the `./styles.css` export removed earlier when `form` genuinely had no CSS); `storybook/Form.stories.tsx` used a raw `<button type="submit">` in all four stories instead of `@asnewyla/button`'s `Button`; `Button`/`Input`'s `className`-merging behavior was untested; `Card.spec.tsx` never combined `image` with `radius` in one test. Confirmed not a gap: `UnstyledButton`'s `isFocusVisible` has no test — verified via a throwaway probe that jsdom's `:focus-visible` can't distinguish keyboard from mouse focus, matching the same limitation already documented for `unstyled-input`.

---

## Next

### Planned modules, by priority

**Tier 1**

- **Theme** (multi-brand theming, distinct from light/dark) — `[data-theme="x"]`-scoped `--xd-*` custom-property overrides layered on top of the existing soft-dependency token architecture; no component CSS changes needed, since every component already reads colors exclusively through `var(--xd-*, fallback)`. A `ThemeProvider` sets `data-theme` on `document.documentElement`, not a wrapping `<div>` — critical so the attribute cascades to portal-rendered content (Dialog, Select) that mounts outside the React tree's DOM position. Proposed as its own small package (`@asnewyla/theme` or similar) rather than folding into `@asnewyla/tokens`, since `tokens` is deliberately CSS-only today (no JS/React entry point at all) and a provider component would break that for consumers who only want the default stylesheet. Consumer-authored theme files follow `tokens.css`'s existing `--xd-*` contract; the repo ships 1-2 example themes as Storybook-only fixtures, not published brand-specific CSS. Architecture proposed, not yet confirmed.
- **Light/dark mode** — related but orthogonal axis to Theme (color-scheme vs. brand identity), composes with the same attribute-scoping mechanism rather than a separate system. Today only exists as an implicit `@media (prefers-color-scheme: dark)` override in `tokens.css`, with no explicit user-facing toggle.
- **Checkbox / Radio** — real gap in `@asnewyla/form`'s own scope: `FormFieldInput`'s rule-based validation currently has no consumer for boolean/choice fields, only text-like `Input`.
- **Select / Dropdown** — explicit top user priority; needs search/prefilter for large option lists and a listbox/combobox a11y pattern. Likely portal-based, which is why it's sequenced after the Theme provider's portal-cascade decision above.

**Tier 2**

- **Table** — sortable/filterable, explicit user priority; largest scope in this batch, likely composed from `Layout`/`Grid` primitives rather than a fully custom layout.
- **Dialog** — consolidates the user's separate Dialog/Modal/Prompt requests into one portal-based primitive with presentational presets, matching the `Layout`→`Stack`/`Group` "one primitive, thin variants" precedent instead of three parallel components.
- **Switch** — same interactive-primitive shape as Checkbox; natural to build alongside it.
- **Textarea** — same primitive/styled split as `Input`; fills a real multi-line-text gap in `@asnewyla/form`.
- **Tabs**
- **Tooltip**

**Tier 3**

- **Collapsible**
- **Alert / Badge** — small, low-risk, mostly presentational (same category as `Card`).
- **Spinner / Skeleton** — loading-state gap noticed during this roadmap review; not in the user's original list but a common design-system need once async data (Table, Select) exists.
- **NavBar** — reconsider as a Storybook recipe built from existing `Layout`/`Group` rather than a new component, unless a real nav-specific behavior (active-route state, mobile collapse) turns up.
- **Calendar, Carousel** — most complex/scope-heavy of the list; defer until there's a real consumer need.

Revisit the Open Questions below (tsdown migration, `changesets/action` in CI) alongside this roadmap, not instead of it.

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
- **A `<form>` doing its own JS validation needs `noValidate`, even though its fields keep real native `required`/`pattern`/etc. attributes** — those attributes still have to be real (native validation must keep working for a field used outside `Form`), but left enabled on the `<form>` itself, the browser's own constraint validation silently blocks the `submit` event before any JS handler runs on an invalid required field — no error thrown, no event at all. jsdom 24 replicates this. A test that only asserts "`onSubmit` wasn't called" can pass for the wrong reason (native validation blocked it, not the component's own logic) and hide this for a long time — the failed-submit-then-something-visible-happens tests (focus moving, a summary appearing) are what actually caught it here, because those need the handler to run at all.
- **Prefer `flushSync` over a `useEffect` with a narrowed dependency array for "focus/scroll to a thing that just appeared in response to this event"** — `Form`'s error summary first tried a `useEffect` keyed only on a submit-attempt counter (reading `invalid.length` in the body without listing it as a dependency, needing a `biome-ignore lint/correctness/useExhaustiveDependencies`). The actual fix: wrap the validation state updates in `flushSync` (`react-dom`) inside `handleSubmit` itself, so the DOM is already updated by the time `.focus()` is called right there — no effect, no dependency array, no suppression comment at all. When a lint rule like this fires, look for a restructure that makes it genuinely satisfied before reaching for a suppression; a comment justifying a narrowed dependency array is a sign the code might be forcing something imperative (an event-driven side effect) into something reactive (an effect), not a shape to preserve.
- **`npm view`/`npm show` right after a publish can falsely 404 even though the publish genuinely succeeded** — npm's read path (what `npm view`/the website/`npm install` see) lags behind the write path (what `npm publish` commits to) by anywhere from seconds to longer. Seen twice now: once with a single package (`icon-button`, Module 7) and once across six packages published together in one `changeset publish` run (this session) — `npm view` 404'd on all six even after a 20s wait, while `changeset publish`'s own "Successfully published" output was correct. The reliable confirmation isn't `npm view` returning data — it's retrying the actual `npm publish`/`pnpm publish` for the same version: `npm error You cannot publish over the previously published versions` proves the version is genuinely live, is harmless to trigger (rejected, not a duplicate publish), and doesn't require waiting on propagation. Don't treat a post-publish `npm view` 404 as a real failure without trying this first.
- **A shared private custom property (`--_padding`-style) lets a padded container and a full-bleed child agree on one number without duplicating it** — `Card`'s padding and its full-bleed image's negative-margin offset both read the same `--_padding` (set once per `data-padding` value), so the image always negates exactly what the container applies, no matter which size is active. Same underlying convention as `--_bg`/`--_bg-hover` (private/computed, never a token) applied to a new problem shape: "one child needs to visually escape a padded container by exactly the padding amount." `overflow: hidden` plus the container's own `border-radius` then clips the escaped child for free — no separate radius prop needed on the child at all.
- **className merging: `className ? \`xd-base ${className}\` : 'xd-base'`, never a bare template literal** — every component that accepts a consumer `className` (`Button`, `Input`, `Image`, `Card`, `Layout`, `Grid`) uses this exact ternary. A bare `` `xd-base ${className}` `` renders the literal string `"xd-base undefined"` whenever a consumer doesn't pass `className` — a real bug caught this way in four already-styled components at once (Button/Input/Image/Card had all been converted to the bare form in one pass). It slipped past every existing test because `toHaveClass('xd-base')` only checks the given class is *present*, not that the full attribute is clean — it doesn't fail on extra garbage classes. Reviewed and deliberately kept as an inline ternary rather than extracted into a shared helper function/package: same reasoning as the `OverridableProps` duplication decision (see Open Questions) — small, cheap-to-duplicate logic stays duplicated per file until proven painful, and `@asnewyla/tokens` specifically can't hold it since that package is CSS-only by design, no JS entry point at all. The older `['xd-base', className].filter(Boolean).join(' ')` form (still correct, just harder to read at a glance) was the convention before this; both avoid the bug, the ternary is now the standard going forward.

---

## Open Questions

- Is `tsdown` (tsup's actively-maintained successor) worth migrating to? Would likely fix CSS Modules support; not urgent.
- `unstyled-input` as a fully separate npm package doubles the package count for every future interactive primitive under the no-barrel rule. Not reconsidering yet — worth a harder look once a third interactive primitive shows up.
- Should `changesets/action` (automated "Version Packages" PR bot) be wired into CI, or is manual `pnpm changeset version` fine for a single-contributor repo? If yes: needs `permissions: contents: write, pull-requests: write`, an `NPM_TOKEN` secret, and removal of the manual `release` script in the same change.
