# ALTERNATIVES

Where I overrode MENTOR_CODEX. **These entries beat the CODEX.**
Append-only — a reversed decision gets a new entry, the old one stays.

Carry this file into every new repo. It is the part of the system that learns.

---

## Entry format

```
### <date> · <project> · <topic>
**CODEX said**: <one line>
**I did**: <one line>
**Because**: <one or two lines>
**Verdict**: <working | mixed | reverted — filled in later>
**Generalise**: <when this should apply again, or "one-off">
```

Keep entries to five lines. If an entry needs more, it belongs in PROJECT.md.

---

## Entries

### 2026-08 · xd-components · Modules 1–2
**CODEX said**: TDD, strict TS, CI-first, render props on primitives, `data-*` for state
**I did**: Followed all of it
**Because**: No friction encountered; the patterns held up
**Verdict**: working — 11 tests, CI catching issues before merge
**Generalise**: baseline confirmed, no override needed

### 2026-08-20 · xd-components · Module 3 — Button styling
**CODEX said**: Component library styling default = CSS Modules + `data-*`
**I did**: Plain CSS with hand-namespaced classes (`.xd-button`), imported as a side effect, instead of CSS Modules
**Because**: The only viable esbuild CSS Modules plugin (`esbuild-css-modules-plugin`, 15mo stale) broke `tsup`'s dist output paths and, even after fixing that, never produced real scoped class names — tsup's own CSS support is documented experimental
**Verdict**: working — full CI gate green, verified real class name ships in `dist/index.js`
**Generalise**: apply the same pattern to `icon-button`/`button-group`; revisit if the project migrates to `tsdown`

### 2026-08-20 · xd-components · Module 7 — npm scope
**CODEX said**: n/a — project decision, not a CODEX default. Doc's original spec used `@xd-components`; earlier this session it was shortened to `@xd`.
**I did**: Renamed all four packages to `@asnewyla/*` (personal npm username scope), not `@xd` or `@xd-components`
**Because**: `@xd` was already registered by someone else on npm (discovered via the token-creation UI, confirmed by the org lookup returning no valid scope); `@xd-components` was available but would've meant reverting the earlier in-session rename. Personal scope needed zero setup and published immediately.
**Verdict**: working — all four packages live on the public registry, dependency resolution verified correct end to end
**Generalise**: check real npm scope/org availability *before* committing to a name across a whole codebase, not after — this is the second full-codebase scope rename this project has done

### 2026-08-24 · xd-components · RadioGroup module
**CODEX said**: TDD tests-only — write RED tests for new component logic, stop, let the user implement GREEN
**I did**: Implemented `RadioGroupContext`/`Radio`'s context consumption/`RadioGroup` directly, including the tests, instead of stopping after RED
**Because**: Explicit, direct instruction ("implement radio group") — same class of override as the `ThemeProvider` document-manipulation deviation, not a standing change to the convention
**Verdict**: working — 21 `Radio` tests + 8 `RadioGroup` tests pass, full gate clean, fix verified live in Storybook (the exact sibling-desync bug from an earlier screenshot no longer reproduces)
**Generalise**: one-off, same as the `ThemeProvider` entry — still ask/write-RED-only by default; only skip to full implementation on an explicit "implement X" ask

---

## Promotion tracker

A pattern that appears here **three times across different projects** graduates into
MENTOR_CODEX. Track candidates:

| Pattern | Seen in | Count | Status |
|---|---|---|---|
| _(none yet)_ | | | |

---

## Cross-project observations

Fill in once two or more projects are done. Empty is honest; do not invent entries.

**Styling by project type** — _pending second project_
**Testing depth by scale** — _pending second project_
**Monorepo vs single package, in hindsight** — _pending second project_
