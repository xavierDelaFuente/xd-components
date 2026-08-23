# @asnewyla/theme

Multi-brand theming for `@asnewyla/*` components — a `ThemeProvider` that
switches the active `--xd-*` token set at runtime.

## Install

```bash
npm install @asnewyla/theme
```

## Usage

Import the theme stylesheets you want to offer (see `@asnewyla/tokens`),
then wrap your app:

```tsx
import '@asnewyla/tokens/theme-paper.css';
import '@asnewyla/tokens/theme-sand.css';
import '@asnewyla/tokens/theme-lavender.css';
import { ThemeProvider } from '@asnewyla/theme';

function App() {
  const [theme, setTheme] = useState<'paper' | 'sand' | 'lavender'>('paper');
  const [mode, setMode] = useState<'light' | 'dark'>();

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
| `theme` | `string` | — (unset: no theme override) |
| `mode` | `'light' \| 'dark'` | — (unset: follows `prefers-color-scheme`) |
| `children` | `React.ReactNode` | — (required) |

`theme` is a plain `string`, not a union of the example theme names above —
`@asnewyla/theme` has no knowledge of which themes exist. It just sets
whatever value you give it as `data-theme` on `<html>`; the theme names
themselves are defined entirely by whichever `--xd-*` stylesheets you
import (`@asnewyla/tokens`'s or your own). `mode` is a real union, since
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
