# @asnewyla/alert

A short inline message: a form error, a confirmation, a notice or an import
summary. A tinted panel with normal text and an accent border, coloured by
`tone`. No hooks, so it renders as a server component.

## Install

```bash
npm install @asnewyla/alert
```

```tsx
import '@asnewyla/tokens/tokens.css'; // status colours, light and dark
import '@asnewyla/alert/styles.css';
```

## Usage

```tsx
import { Alert } from '@asnewyla/alert';

<Alert tone="error">Wrong email or password.</Alert>

<Alert tone="success" title="Password changed">
  You can now sign in with your new password.
</Alert>

<Alert tone="info">
  Import finished. <a href="/imports/42">See the summary</a>.
</Alert>
```

### Tone and role

| `tone` | Colours | Default `role` |
|---|---|---|
| `'error'` | `--xd-color-destructive` + `-subtle` | `alert` |
| `'success'` | `--xd-color-success` + `-subtle` | `status` |
| `'info'` (default) | `--xd-color-info` + `-subtle` | `status` |
| `'warning'` | `--xd-color-warning` + `-subtle` | `status` |

- `role` overrides the default, e.g. `role="alert"` on an urgent warning.
- `announce={false}` renders no role at all, for static text that shouldn't
  be announced (e.g. "This account is read-only."). It wins over `role`.

Screen readers announce a live region (`alert`/`status`) when its content
**changes or is inserted**, not content already in the page when it loads.
An Alert rendered by the server after a full-page form post is read as
normal page content. To have it announced, move focus to it (give it
`tabIndex={-1}` and focus it), or insert it on the client.

Every theme and mode meets WCAG AA for these colours: text on the tint
4.5:1, the accent border on the tint and on the page 3:1. Links in the
message keep the text colour and are underlined.

Without `@asnewyla/tokens`, Alert falls back to the default theme's light
colours.

### Props

Every native `<div>` prop, plus:

| Prop | Type | Default |
|---|---|---|
| `children` | `ReactNode` (**required**), inline content, links allowed | — |
| `tone` | `'error' \| 'success' \| 'info' \| 'warning'` | `'info'` |
| `title` | `ReactNode`, shown before the message | — |
| `announce` | `boolean` | `true` |
| `role` | `AriaRole` | from `tone` |
| `ref` | `Ref<HTMLDivElement>` | — |

`title` replaces the native `title` attribute (a tooltip), which isn't
useful on a message.

## License

MIT
