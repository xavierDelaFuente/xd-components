# @asnewyla/layout

Flex-based layout primitives — `direction`/`gap`/`align`/`justify`/`wrap`
props instead of repeating `style={{ display: 'flex', gap: '1rem' }}` in
every consumer. `Stack` and `Group` are thin presets over the generic
`Layout`.

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

### Theming

`gap` reads from `@asnewyla/tokens` the same way `@asnewyla/button` and
`@asnewyla/image` do — optional import, works standalone with built-in
fallbacks.

## License

MIT
