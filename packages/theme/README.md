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

  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Props

| Prop | Type | Default |
|---|---|---|
| `theme` | `string` | — (required) |
| `children` | `React.ReactNode` | — (required) |

`theme` is a plain `string`, not a union of the example theme names above —
`@asnewyla/theme` has no knowledge of which themes exist. It just sets
whatever value you give it as `data-theme` on `<html>`; the theme names
themselves are defined entirely by whichever `--xd-*` stylesheets you
import (`@asnewyla/tokens`'s or your own).

## How it works

`ThemeProvider` doesn't render a wrapping element — it sets `data-theme` on
`document.documentElement` (`<html>`) via an effect, and removes it on
unmount. This is deliberate, not a stand-in for a simpler `<div data-theme>`
wrapper: CSS custom property inheritance follows the real DOM tree, not the
React tree, so a component that renders through a portal (a future
`Dialog`, `Select`, `Toast`, mounted straight into `document.body`) sits
outside `ThemeProvider`'s own JSX position but still under `<html>` — only
an attribute on the document root reliably reaches it.

Switching `theme` updates the attribute on the next render; React runs the
previous effect's cleanup before the new one, so there's no flash of an
unset attribute in between.

## License

MIT
