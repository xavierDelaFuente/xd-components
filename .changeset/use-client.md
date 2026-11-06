---
"@asnewyla/button": patch
"@asnewyla/checkbox": patch
"@asnewyla/form": patch
"@asnewyla/image": patch
"@asnewyla/input": patch
"@asnewyla/radio": patch
"@asnewyla/radio-group": patch
"@asnewyla/select": patch
"@asnewyla/switch": patch
"@asnewyla/textarea": patch
"@asnewyla/theme": patch
"@asnewyla/video": patch
"@asnewyla/unstyled-button": patch
"@asnewyla/unstyled-checkbox": patch
"@asnewyla/unstyled-dialog": patch
"@asnewyla/unstyled-input": patch
"@asnewyla/unstyled-radio": patch
"@asnewyla/unstyled-select": patch
"@asnewyla/unstyled-switch": patch
"@asnewyla/unstyled-table": patch
"@asnewyla/unstyled-tabs": patch
"@asnewyla/unstyled-textarea": patch
"@asnewyla/unstyled-tooltip": patch
---

Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.
