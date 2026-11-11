---
"@asnewyla/theme": minor
---

Add `THEMES`, `MODES`, `isTheme`, `isMode` and the `Theme`/`Mode` types, exported from the new `@asnewyla/theme/constants` entry (built without `'use client'`, so server code such as a Next.js layout gets real values) and re-exported from the main entry. `ThemeProvider`'s `theme` now autocompletes the shipped themes while still accepting any string. README: new "Server rendering / Next.js" section (set `data-theme`/`data-mode` on `<html>` server-side; no `data-mode` follows `prefers-color-scheme`; `ThemeProvider` is for client-only apps and runtime switching).
