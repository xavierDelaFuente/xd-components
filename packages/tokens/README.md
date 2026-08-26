# @asnewyla/tokens

Design tokens — color, spacing, radius, typography, elevation — as CSS
custom properties under the `--xd-*` prefix shared across every
`@asnewyla/*` component.

## Install

```bash
npm install @asnewyla/tokens
```

## Usage

This is a **soft dependency**. Every component ships its own hardcoded
fallback for each token it uses (`var(--xd-color-primary, #0f766e)`), so it
looks right with zero setup. Import this stylesheet once to override the
whole set at once — no component declares a dependency on it, and none is
required to import it:

```ts
import '@asnewyla/tokens/tokens.css';
```

```css
:root {
  --xd-color-primary: #0f766e;
  --xd-color-focus: #0f766e;
}
```

### Tokens

| Group | Tokens |
|---|---|
| Color | `--xd-color-{primary,secondary,destructive}`, `--xd-on-{primary,secondary,destructive}` — light mode by default, overridden under `prefers-color-scheme: dark` |
| Surface & text | `--xd-color-surface`, `--xd-color-surface-hover`, `--xd-color-text`, `--xd-color-text-muted` — page/popover background and text; `-text-muted` is placeholder/secondary text, still held to 4.5:1 |
| Spacing | `--xd-space-{xs,sm,md,lg,xl,2xl,3xl}` (0.25rem → 2rem) |
| Radius | `--xd-radius-{sm,md,lg}` in rem (0.25rem → 0.625rem), `--xd-radius-full` (`9999px`, a fixed pill/circle trick value, not on the rem scale) |
| Typography | `--xd-font-family`, `--xd-font-family-mono`, `--xd-font-size-{sm,md,lg}`, `--xd-font-weight-{regular,medium,semibold,bold}`, `--xd-line-height-normal`, `--xd-letter-spacing-label`, `--xd-text-transform-label` (the last two are read by every form `<label>` and by a filled button's own visible text) |
| Border | `--xd-color-border` (decorative, e.g. a card outline) and `--xd-color-border-strong` (an interactive control's own boundary, held to WCAG 1.4.11's 3:1) — two different jobs, don't swap them; `--xd-border-width-{thin,thick}`; `--xd-frame-border-width` (what a card/popover/listbox border reads, defaults to the hairline); `--xd-control-border-width`/`--xd-control-border-color` (a filled control's own outline — `0`/`currentColor` by default, so inert until a theme opts in) |
| Focus ring | `--xd-color-focus`, `--xd-focus-ring-width`, `--xd-focus-ring-offset` — `-focus` is its own token rather than an alias of `-primary`, since on a primary-filled control the ring has to contrast with the fill and the two need to be able to diverge per theme |
| Elevation | `--xd-shadow-{sm,md}` (surface elevation — a card, a popover), `--xd-shadow-control`/`--xd-shadow-control-active`/`--xd-press-transform` (a button's own press effect, separate tier, all `none` by default) |
| Density | `--xd-control-height-md` — the fixed height `Button`'s `md` size, `Select`'s trigger, and `Input`'s field all read |
| State | `--xd-opacity-disabled` |
| Motion | `--xd-motion-fast` |

### Units: rem vs. px, on purpose

Spacing, typography, and radius are in `rem` — they scale together with the
user's text-size preference, which is what should happen for anything sized
relative to text. `--xd-radius-full` and `--xd-border-width-thin`/`-thick`
are the deliberate exceptions, all in `px`: `radius-full` is a "bigger than
any element will ever be" trick value to force a pill/circle shape, not a
real size on the scale; a hairline (or thicker) border is meant to render
at a fixed device-pixel width at any zoom level — in `rem` it would scale
with font-size and could round to a blurry sub-pixel or a visibly thicker
line. This isn't inconsistency — it's picking the unit that matches what
each token means.

## Themes

Beyond the default palette, this package ships six complete alternative
token sets, each scoped under its own `[data-theme="..."]` attribute:

```ts
import '@asnewyla/tokens/theme-terra.css';
import '@asnewyla/tokens/theme-almanac.css';
import '@asnewyla/tokens/theme-block.css';
import '@asnewyla/tokens/theme-graphite.css';
import '@asnewyla/tokens/theme-rubber.css';
import '@asnewyla/tokens/theme-terminal.css';
```

| Theme | Feel |
|---|---|
| `terra` | Warm terracotta and clay, generous rounded corners, soft diffuse warm shadows, 170ms motion, Plus Jakarta Sans |
| `almanac` | Editorial serif on cool ink-and-cream, tight 2–4px corners, navy-ink primary, Source Serif 4, 200ms motion |
| `block` | Thick ink frames, hard offset shadows that collapse on press, uppercase Space Grotesk labels, 2px borders everywhere, no blur |
| `graphite` | Dense, precise, neutral instrument-panel feel — tight spacing/radius, IBM Plex Sans/Mono, 90ms motion; for tables and control panels, not marketing surfaces |
| `rubber` | Soft, airy, pill-shaped, springy — 16–24px radius, diffuse violet shadows, overshoot easing, `scale(0.97)` press |
| `terminal` | Monospace, square, outlined, instant — JetBrains Mono, zero radius, 1px outlines on filled controls, uppercase tracked labels, 60ms linear motion |

Each theme file is a **complete, standalone** token set — every `--xd-*`
token this package defines, not just the ones that diverge from the
default — so importing just one theme file works with no other import,
matching the soft-dependency model above. Unlike the default palette, a
theme's selector is only ever `[data-theme="name"]` — it does **not** also
apply to a bare, untagged `:root`. `tokens.css`'s own `:root` is the sole
untagged default; every theme is opt-in on top of it. Import several and
set `data-theme="terra"` (etc.) on `<html>` to pick one at runtime — see
`@asnewyla/theme`'s `ThemeProvider`, which does exactly that.

Every theme also supports the same `data-mode="light"|"dark"` override as
an explicit third state, independent of `prefers-color-scheme`, on top of
whichever theme is active — e.g. `[data-theme="block"][data-mode="dark"]`.
Each theme also paints `background-color`/`color`/`font-family` directly
on its own `[data-theme="name"]` element, not just the custom properties
— a page that mounts only a theme file, with no other component styling,
still renders correctly rather than transparent.

## License

MIT
