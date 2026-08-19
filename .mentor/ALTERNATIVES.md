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
