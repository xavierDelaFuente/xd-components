# @asnewyla/layout

Layout primitives — props instead of repeating raw flex/grid CSS in every
consumer. `Layout` (`direction`/`gap`/`align`/`justify`/`wrap`) is flex-based,
with `Stack` and `Group` as thin presets over it. `Grid` is a separate,
CSS-Grid-based primitive for genuine 2D layouts (card grids, dashboards)
that flex-wrap can't express well.

## Install

```bash
npm install @asnewyla/layout
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/layout/styles.css';
```

## Usage

```tsx
import { Layout, Stack, Group } from '@asnewyla/layout';

// Generic — pick an axis explicitly
<Layout direction="horizontal" gap="md">
  <Button>Save</Button>
  <Button>Cancel</Button>
</Layout>

// Stack — always vertical
<Stack gap="lg">
  <Field label="Name" />
  <Field label="Email" />
</Stack>

// Group — always horizontal
<Group gap="sm" align="center">
  <Avatar />
  <span>Jordan</span>
</Group>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `direction` | `'vertical' \| 'horizontal'` (`Layout` only — fixed on `Stack`/`Group`) | `'vertical'` |
| `gap` | `'sm' \| 'md' \| 'lg'` | — (no gap) |
| `align` | `'start' \| 'center' \| 'end'` | — (browser default) |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` | — (browser default) |
| `wrap` | `boolean` | `false` |

`Stack` and `Group` accept every `Layout` prop except `direction`, which is
fixed.

## Grid

A separate CSS-Grid primitive, not a `Layout` variant — it renders its own
`display: grid`, not a flex container, so `align`/`justify` map to different
CSS properties than they do on `Layout` (see below). Reach for it when you
need genuine 2D layout — equal-height rows, explicit column tracks — that
flex-wrap can't express well.

```tsx
import { Grid } from '@asnewyla/layout';

// Equal-width columns
<Grid columns={3} gap="md">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

// Explicit column tracks
<Grid columns="200px 1fr 200px" gap="sm">
  <Sidebar />
  <Main />
  <Aside />
</Grid>
```

### Grid props

| Prop | Type | Default |
|---|---|---|
| `columns` | `number \| string` — a number renders `repeat(N, 1fr)`; a string is passed straight through as `grid-template-columns` (e.g. `"200px 1fr 200px"`, `"repeat(auto-fit, minmax(200px, 1fr))"`) | — (single column) |
| `gap` | `'sm' \| 'md' \| 'lg'` — same scale and tokens as `Layout` | — (no gap) |
| `align` | `'start' \| 'center' \| 'end'` → `align-items` (vertical position of an item within its own cell) | — (browser default) |
| `justify` | `'start' \| 'center' \| 'end'` → `justify-items` (horizontal position of an item within its own cell) — **not** `justify-content`; there's no `'between'`/`'around'`, since those distribute space across tracks, which isn't what per-item cell alignment does | — (browser default) |

Every other native `<div>` prop (`className`, `style`, `id`, `aria-*`, ...)
is accepted and forwarded to the root element; a `className` you pass is
merged with `Grid`'s own, not replaced.

### Theming

`gap` reads from `@asnewyla/tokens` the same way `@asnewyla/button` and
`@asnewyla/image` do — optional import, works standalone with built-in
fallbacks. Applies to both `Layout`'s and `Grid`'s `gap` prop identically.

## License

MIT
