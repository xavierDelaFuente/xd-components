# @asnewyla/unstyled-tabs

Unstyled, accessible tabs primitive. Compound components with roving-focus
keyboard navigation, no visual styling — the base layer under
`@asnewyla/tabs`.

## Install

```bash
npm install @asnewyla/unstyled-tabs
```

## Usage

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@asnewyla/unstyled-tabs';

// Uncontrolled
<Tabs defaultValue="profile">
  <TabList aria-label="Account settings">
    <Tab value="profile">Profile</Tab>
    <Tab value="settings">Settings</Tab>
    <Tab value="billing" disabled>Billing</Tab>
  </TabList>
  <TabPanel value="profile">Profile content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
  <TabPanel value="billing">Billing content</TabPanel>
</Tabs>

// Controlled
<Tabs value={active} onValueChange={setActive}>
  ...
</Tabs>
```

### Components

| Component | Renders | Notes |
|---|---|---|
| `Tabs` | `<div>` | Owns active-value state (`value`/`defaultValue`/`onValueChange`), provides context to the rest |
| `TabList` | `<div role="tablist">` | Owns keyboard navigation |
| `Tab` | `<button role="tab">` | `value` (required), `disabled?` |
| `TabPanel` | `<div role="tabpanel">` | `value` (required) — only the active panel is rendered at all, not just hidden |

### Keyboard

- `ArrowRight`/`ArrowLeft` move focus to the next/previous **enabled** tab and activate it immediately (automatic activation — the common pattern; moving focus and switching panels happen together, no extra keystroke). Wraps at both ends.
- `Home`/`End` jump to the first/last enabled tab.
- Disabled tabs are real `<button disabled>` elements — skipped entirely by keyboard navigation and inert to clicks, not just visually dimmed.

Horizontal orientation only for now — `ArrowUp`/`ArrowDown` aren't handled. A straightforward, backward-compatible addition if a vertical layout is ever needed.

### Accessibility

`Tab` and `TabPanel` cross-reference each other (`aria-controls`/`aria-labelledby`) automatically — both derive matching ids from the same `value`, no manual id wiring required. A `TabPanel`'s accessible name therefore comes from its associated tab's label, not its own body text — expected ARIA behavior for a tabpanel, not a bug.

Only the active tab has `tabIndex={0}`; every other tab is `-1` (roving tabindex) — the tablist itself is a single stop in the page's tab order, matching the WAI-ARIA Tabs pattern.

## License

MIT
