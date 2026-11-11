---
"@asnewyla/tokens": patch
---

Document the fonts each theme expects (loading them is the app's job, with a `next/font` example) and point server-rendered apps at setting `data-theme`/`data-mode` on `<html>`. A new test checks that every font stack ends in a generic family.
