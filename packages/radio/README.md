# @asnewyla/radio

Styled radio built on `@asnewyla/unstyled-radio`. Label association, inline
validation error, full keyboard/focus accessibility.

## Install

```bash
npm install @asnewyla/radio
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/radio/styles.css';
```

## Usage

```tsx
import { Radio } from '@asnewyla/radio';

<Radio label="Option A" name="choice" defaultChecked />
<Radio label="Option B" name="choice" />

<Radio label="Option A" error="You must choose an option" />

// Controlled
<Radio
  label="Option A"
  checked={selected === 'a'}
  onChange={() => setSelected('a')}
/>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (**required**) | — |
| `error` | `string` | — |
| `checked` / `defaultChecked` | `boolean` | — |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `id` | `string` | auto-generated via `useId()` |

`error` doubles as the invalid-state flag — there's no separate `invalid`
prop. Setting `error` sets `aria-invalid` on the input and links it via
`aria-describedby` to the rendered error message; there's no way to end up
with one without the other. Same convention `@asnewyla/input` and
`@asnewyla/checkbox` use.

### Grouping radios

Two `Radio`s sharing a native `name` get correct browser-level exclusivity
for free — clicking one genuinely unchecks the other at the DOM level.
That's enough for a *display-only* group, or one you fully control
yourself via `checked`/`onChange` on every member. For a group where you
want React to own "which value is selected" as shared state, use
`RadioGroup` from `@asnewyla/radio-group` instead of wiring several
`Radio`s up by hand:

```tsx
import { RadioGroup } from '@asnewyla/radio-group';
import { Radio } from '@asnewyla/radio';

<RadioGroup name="size" defaultValue="md">
  <Radio label="Small" value="sm" />
  <Radio label="Medium" value="md" />
  <Radio label="Large" value="lg" />
</RadioGroup>
```

`Radio` exports `RadioGroupProvider`/`useRadioGroupContext` itself (that's
how it consumes an ancestor group), but you'd only reach for those
directly if you were building something like `RadioGroup` yourself — see
`@asnewyla/radio-group`'s README for the underlying limitation it exists
to fix (an uncontrolled radio's own state can go stale when a sibling is
selected instead, since browsers don't fire a change event on the
deselected radio).

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-destructive: #dc2626;
}
```

## License

MIT
