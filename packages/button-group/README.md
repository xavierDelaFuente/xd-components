# @asnewyla/button-group

Groups `@asnewyla/button` components visually (`role="group"`) and propagates
`variant`, `size`, and `disabled` to every child via context. Any child can
override an individual prop.

## Install

```bash
npm install @asnewyla/button-group
```

## Usage

```tsx
import { Button } from '@asnewyla/button';
import { ButtonGroup } from '@asnewyla/button-group';

<ButtonGroup variant="secondary" aria-label="Text alignment">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button variant="destructive">Right</Button> {/* overrides the group */}
</ButtonGroup>
```

## License

MIT
