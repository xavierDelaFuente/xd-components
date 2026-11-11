---
"@asnewyla/button-group": minor
---

Space grouped buttons apart so they no longer touch. `ButtonGroup` ships a new `@asnewyla/button-group/styles.css` (import it to get the spacing): a wrapping inline-flex row. A new `gap` prop (`'sm' | 'md' | 'lg'`, default `'sm'`) sets the space between buttons on the same token scale as `Stack`/`Group` (`--xd-space-sm/md/lg`). The group now carries the `xd-button-group` class, merged with a consumer `className`.
