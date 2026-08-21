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
| Color | `--xd-color-{primary,secondary,destructive}`, `--xd-on-{primary,secondary,destructive}` — light mode by default, overridden under `prefers-color-scheme: dark` |
| Spacing | `--xd-space-{xs,sm,md,lg,xl,2xl}` (0.25rem → 1.5rem) |
| Radius | `--xd-radius-{sm,md,lg,full}` |
| Typography | `--xd-font-size-{sm,md,lg}`, `--xd-font-weight-{regular,semibold}`, `--xd-line-height-normal` |

`--xd-color-focus` is intentionally **not** defined here — components that
use it (e.g. `Button`) fall back to their own variant color when it's unset,
so defining a single default here would override that per-variant behavior.
Set it explicitly if you want one focus-ring color across every variant.

## License

MIT
