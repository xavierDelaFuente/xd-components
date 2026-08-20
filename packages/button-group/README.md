# @xd/button-group

Groups `@xd/button` components visually (`role="group"`) and propagates
`variant`, `size`, and `disabled` to every child via context. Any child can
override an individual prop.

## Install

```bash
npm install @xd/button-group
```

## Usage

```tsx
import { Button } from '@xd/button';
import { ButtonGroup } from '@xd/button-group';

<ButtonGroup variant="secondary" aria-label="Text alignment">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button variant="destructive">Right</Button> {/* overrides the group */}
</ButtonGroup>
```

## License

MIT
