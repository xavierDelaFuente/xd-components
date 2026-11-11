# @asnewyla/alert

## 0.2.0

### Minor Changes

- e62485a: Add `@asnewyla/alert`: `Alert`, a short inline message (form error, confirmation, notice). A tinted panel with the theme text colour and an accent border, set by `tone` (`error` | `success` | `info` | `warning`, default `info`) from the status colour tokens. The role follows the tone (`error` → `alert`, others → `status`); `role` overrides it, and `announce={false}` renders no role for static text. Optional `title`, inline `children` (links allowed), native `<div>` props and `ref`. No hooks and no `'use client'`, so it renders as a server component. Ships `styles.css`.
