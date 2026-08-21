# @asnewyla/tokens

Design tokens — color, spacing, radius, typography — as CSS custom
properties under the `--xd-*` prefix shared across every `@asnewyla/*`
component.

## Install

```bash
npm install @asnewyla/tokens
```

## Usage

This is a **soft dependency**. Every component ships its own hardcoded
fallback for each token it uses (`var(--xd-color-primary, #0d9488)`), so it
looks right with zero setup. Import this stylesheet once to override the
whole set at once — no component declares a dependency on it, and none is
required to import it:

```ts
import '@asnewyla/tokens/tokens.css';
```

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-focus: #0d9488;
}
```

### Tokens

| Group | Tokens |
|---|---|
| Color | `--xd-color-{primary,secondary,destructive}`, `--xd-on-{primary,secondary,destructive}`, `--xd-color-border` — light mode by default, overridden under `prefers-color-scheme: dark` |
| Spacing | `--xd-space-{xs,sm,md,lg,xl,2xl}` (0.25rem → 1.5rem) |
| Radius | `--xd-radius-{sm,md,lg}` in rem (0.25rem → 0.625rem), `--xd-radius-full` (`9999px`, a fixed pill/circle trick value, not on the rem scale) |
| Typography | `--xd-font-size-{sm,md,lg}`, `--xd-font-weight-{regular,semibold}`, `--xd-line-height-normal` |
| Border | `--xd-border-width-thin` (`1px`) |

`--xd-color-focus` is intentionally **not** defined here — components that
use it (e.g. `Button`) fall back to their own variant color when it's unset,
so defining a single default here would override that per-variant behavior.
Set it explicitly if you want one focus-ring color across every variant.

### Units: rem vs. px, on purpose

Spacing, typography, and radius are in `rem` — they scale together with the
user's text-size preference, which is what should happen for anything sized
relative to text. `--xd-radius-full` and `--xd-border-width-thin` are the two
deliberate exceptions, both in `px`: `radius-full` is a "bigger than any
element will ever be" trick value to force a pill/circle shape, not a real
size on the scale; a hairline border is meant to render as exactly one
device pixel at any zoom level — in `rem` it would scale with font-size and
could round to a blurry sub-pixel or a visibly thicker line. This isn't
inconsistency — it's picking the unit that matches what each token means.

## License

MIT
