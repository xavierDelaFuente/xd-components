# @asnewyla/unstyled-tooltip

Unstyled, accessible tooltip primitive. Compound components, hover/focus open
with a delay, Escape to dismiss — no visual styling, the base layer under
`@asnewyla/tooltip`.

## Install

```bash
npm install @asnewyla/unstyled-tooltip
```

## Usage

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@asnewyla/unstyled-tooltip';

<Tooltip>
  <TooltipTrigger>
    <button type="button">Save</button>
  </TooltipTrigger>
  <TooltipContent>Saves your work automatically</TooltipContent>
</Tooltip>

// Controlled
<Tooltip open={open} onOpenChange={setOpen}>
  ...
</Tooltip>
```

### Components

| Component | Renders | Notes |
|---|---|---|
| `Tooltip` | `<span>` wrapper | Owns open state (`open`/`defaultOpen`/`onOpenChange`), `delay?` (hover open delay, ms, default `700`). The wrapper is `position: relative; display: inline-block` so `TooltipContent` can place itself with plain CSS |
| `TooltipTrigger` | its single child, cloned | Injects `aria-describedby` (while open) and pointer/focus/blur handlers onto whatever element you pass — a `<button>`, a link, an input. The child must forward `ref` and props |
| `TooltipContent` | `<span role="tooltip">` | `side?` → `data-side` (`top`/`right`/`bottom`/`left`, default `top`). Rendered only while open |

### Behavior

- Opens on pointer enter after `delay` ms, or immediately on keyboard focus.
- Closes on pointer leave, blur, `Escape`, or pressing the trigger.
- `Escape` closing is the one hard WAI-ARIA requirement and works regardless of how the tooltip was opened.
- `aria-describedby` on the trigger points at the content's id only while the tooltip is open.

### Not yet supported

- **Collision-aware positioning.** `side` is honored as-is; a tooltip near a viewport edge is not flipped or shifted.
- **Portal rendering.** The content renders inline, so an ancestor with `overflow: hidden` can clip it.
- **Hoverable content.** Moving the pointer onto the tooltip closes it — it's for display, not interaction.

## License

MIT
