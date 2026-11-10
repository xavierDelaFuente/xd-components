---
"@asnewyla/tokens": minor
---

Add status colour tokens to `tokens.css` and every theme, light and dark: `--xd-color-{success,info,warning}`, `--xd-on-{success,info,warning}`, and the tints `--xd-color-{destructive,success,info,warning}-subtle`. Each theme's tones follow its own `destructive` lightness and chroma. Contrast is tested in every theme and mode: `on-*` on its fill meets 4.5:1, the accent on the surface and on its tint 3:1, and text on a tint 4.5:1. New tokens only; no existing value changes.
