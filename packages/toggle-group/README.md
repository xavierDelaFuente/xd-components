# @asnewyla/toggle-group

A choose-one group of pressable buttons (`ToggleGroup` / `ToggleGroupItem`) for
small sets of options: a colour mode, a view, a filter. Items are real
`<button>`s, so a group of `type="submit"` items works inside a plain `<form>`
before JavaScript loads.

## Install

```bash
npm install @asnewyla/toggle-group @asnewyla/button
```

```tsx
import '@asnewyla/button/styles.css';
import '@asnewyla/toggle-group/styles.css';
```

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from '@asnewyla/toggle-group';

<ToggleGroup aria-label="Colour mode" defaultValue="system" onValueChange={setMode}>
  <ToggleGroupItem value="system">System</ToggleGroupItem>
  <ToggleGroupItem value="light">Light</ToggleGroupItem>
  <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
</ToggleGroup>
```

The pressed item has `aria-pressed="true"` and the `primary` Button look. The
others have `aria-pressed="false"` and the `outline` look. Clicking the pressed
item again keeps it pressed: one item is always chosen once a value is set.

### Three ways to hold the value

| Props | Behaviour |
|---|---|
| `defaultValue` (± `onValueChange`) | Uncontrolled: the group moves the pressed state itself. |
| `value` + `onValueChange` | Controlled: you store the value; the group reports clicks. |
| `value` only | Server-driven: shows the value it was given and never moves it. Pair with `type="submit"` items. |

### Inside a form, with no JavaScript state

```tsx
// A server component: the pressed item comes from the saved setting.
<form action={saveMode}>
  <ToggleGroup aria-label="Colour mode" name="mode" value={savedMode}>
    <ToggleGroupItem type="submit" value="system">System</ToggleGroupItem>
    <ToggleGroupItem type="submit" value="light">Light</ToggleGroupItem>
    <ToggleGroupItem type="submit" value="dark">Dark</ToggleGroupItem>
  </ToggleGroup>
</form>
```

The group gives every item its `name`, so the clicked item submits
`mode=<value>`. Items default to `type="button"`, so they never submit by
accident.

### Keyboard

Native button behaviour, with one tab stop per item: Tab / Shift+Tab move
between items (disabled ones are skipped), and Enter or Space selects the
focused item, or submits it if it's a `type="submit"` item. There's no
roving tabindex and no arrow keys. The group has to work before JavaScript
loads, and it's a set of toggle buttons, not a radio group.

### Props

`ToggleGroup`: every native `<div>` prop, plus:

| Prop | Type | Default |
|---|---|---|
| `aria-label` / `aria-labelledby` | `string` (one is **required**) | — |
| `value` | `string` | — |
| `defaultValue` | `string` | — |
| `onValueChange` | `(value: string) => void` | — |
| `name` | `string` (given to every item) | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` (disables every item) | `false` |
| `gap` | `'sm' \| 'md' \| 'lg'` (`--xd-space-sm/md/lg`) | `'sm'` |

`ToggleGroupItem`: every `Button` prop except `as` and `variant` (native
`type`, `formAction`, `disabled`, `onClick`, ...), plus a **required** `value`.
Its own `name`, `size` and `disabled` override the group's.

## License

MIT
