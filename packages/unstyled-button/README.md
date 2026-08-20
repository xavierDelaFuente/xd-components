# @xd/unstyled-button

Unstyled, accessible button primitive. Renders click, keyboard, and focus
behavior — plus hover/press/focus-visible state — without imposing any visual
styling. The base layer under every styled component in this library.

## Install

```bash
npm install @xd/unstyled-button
```

## Usage

```tsx
import { UnstyledButton } from '@xd/unstyled-button';

<UnstyledButton onClick={() => {}}>Click me</UnstyledButton>

// Polymorphic
<UnstyledButton as="a" href="/home">Go home</UnstyledButton>

// Render props expose interaction state
<UnstyledButton>
  {({ isHovered, isPressed, isFocusVisible }) => (
    <span>{isPressed ? 'Pressed' : isHovered ? 'Hovered' : 'Idle'}</span>
  )}
</UnstyledButton>
```

## License

MIT
