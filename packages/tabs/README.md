# @asnewyla/tabs

Styled tabs built on `@asnewyla/unstyled-tabs`. Compound components, an
underline active-tab indicator, and full keyboard/focus accessibility.

## Install

```bash
npm install @asnewyla/tabs
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/tabs/styles.css';
```

## Usage

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@asnewyla/tabs';

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

### Props

Every prop is `@asnewyla/unstyled-tabs`'s own — `Tabs`/`TabList`/`Tab`/
`TabPanel` each add no props of their own; `className` merges with each
piece's base class (`xd-tabs`, `xd-tab-list`, `xd-tab`, `xd-tab-panel`,
base class first), the same convention every styled component in this
library follows. See `@asnewyla/unstyled-tabs`'s README for the full
component/keyboard/accessibility contract — sorting, disabled tabs,
`ArrowLeft`/`ArrowRight`/`Home`/`End` behavior, and the `aria-controls`/
`aria-labelledby` wiring are all unchanged here.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-border: #cbd5e1;
  --xd-color-text-muted: #475569;
}
```

## License

MIT
