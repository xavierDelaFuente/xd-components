# @asnewyla/theme

Multi-brand theming for `@asnewyla/*` components — a `ThemeProvider` that
switches the active `--xd-*` token set at runtime.

## Install

```bash
npm install @asnewyla/theme
```

## Server rendering / Next.js

`ThemeProvider` sets the attributes in an effect, so a server-rendered page
first paints with no theme and switches after hydration. If you render on
the server, put the attributes on `<html>` in the server output instead.
The CSS needs nothing else, and no `ThemeProvider` is needed:

```tsx
// app/layout.tsx: a server component
import '@asnewyla/tokens/tokens.css';
import '@asnewyla/tokens/theme-terra.css';
import { isMode } from '@asnewyla/theme/constants';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  const stored = (await cookies()).get('mode')?.value;
  const mode = isMode(stored) ? stored : undefined;

  return (
    <html lang="en" data-theme="terra" data-mode={mode}>
      <body>{children}</body>
    </html>
  );
}
```

- `data-theme="terra"` picks the theme. Import its stylesheet.
- `data-mode="light"` or `"dark"` forces a mode, e.g. from a cookie the user
  set. Validate the stored value with `isMode`: an unknown value would match
  no CSS.
- **No `data-mode`** follows the OS setting (`prefers-color-scheme`). That's
  the right default; don't set `"light"` just to have a value.

Import the constants from **`@asnewyla/theme/constants`** in server code.
The main entry is a client module (`'use client'`), and a server component
that imports a value from a client module gets a reference, not the value,
so `THEMES.includes(...)` would fail there. The main entry re-exports the
same constants for client code.

`ThemeProvider` is for client-only apps (no server rendering) and for
switching theme or mode at runtime, without a reload.

## Constants

```ts
import { THEMES, MODES, isTheme, isMode, type Theme, type Mode } from '@asnewyla/theme/constants';

THEMES; // ['terra', 'almanac', 'block', 'graphite', 'rubber', 'terminal']
MODES;  // ['light', 'dark']
isTheme(value); // value is Theme: safe for an untrusted stored string
isMode(value);  // value is Mode
```

`THEMES` is tested against the `theme-*.css` files `@asnewyla/tokens`
ships, so it can't drift.

## Usage (client-only apps)

Import the theme stylesheets you want to offer (see `@asnewyla/tokens`),
then wrap your app:

```tsx
import '@asnewyla/tokens/theme-terra.css';
import '@asnewyla/tokens/theme-graphite.css';
import { ThemeProvider, type Mode } from '@asnewyla/theme';

function App() {
  const [theme, setTheme] = useState<'terra' | 'graphite'>('terra');
  const [mode, setMode] = useState<Mode>();

  return (
    <ThemeProvider theme={theme} mode={mode}>
      <YourApp />
    </ThemeProvider>
  );
}
```

`theme` and `mode` are independent — use either alone, both together, or
neither. Leaving `mode` unset (the default) lets `prefers-color-scheme`
drive light/dark automatically; leaving `theme` unset lets whichever
theme's bare fallback (or `@asnewyla/tokens/tokens.css`) apply.

### Props

| Prop | Type | Default |
|---|---|---|
| `theme` | `Theme \| (string & {})` | — (unset: no theme override) |
| `mode` | `Mode` (`'light' \| 'dark'`) | — (unset: follows `prefers-color-scheme`) |
| `children` | `React.ReactNode` | — (required) |

`theme` autocompletes the shipped themes (`Theme`) but accepts any string,
so a theme stylesheet of your own works too. `ThemeProvider` just sets the
value as `data-theme` on `<html>`. `mode` is a real union, since
every `@asnewyla/tokens` theme file only ever matches `data-mode="light"`
or `"dark"` — anything else would silently match nothing.

## How it works

`ThemeProvider` doesn't render a wrapping element — it sets `data-theme`
and `data-mode` on `document.documentElement` (`<html>`) via two
independent effects, one per prop, each removing its own attribute on
unmount. Setting `data-theme`/`data-mode` on `<html>` (not a wrapping
`<div>`) is deliberate: CSS custom property inheritance follows the real
DOM tree, not the React tree, so a component that renders through a portal
(a future `Dialog`, `Select`, `Toast`, mounted straight into
`document.body`) sits outside `ThemeProvider`'s own JSX position but still
under `<html>` — only an attribute on the document root reliably reaches
it.

Leaving `theme` or `mode` unset doesn't set a default value for that
attribute — it removes the attribute entirely, so the underlying CSS's own
fallback (a bare `:root:not([data-theme])` block, or
`prefers-color-scheme` for mode) takes over. A default of, say,
`mode="light"` would permanently defeat automatic dark-mode detection for
every consumer, since `@asnewyla/tokens`' dark-mode blocks are scoped
`:not([data-mode="light"])` specifically so the OS preference keeps
working until someone explicitly opts into a mode.

Switching either prop updates its attribute on the next render; React runs
the previous effect's cleanup before the new one, so there's no flash of
an unset attribute in between.

## License

MIT
