# 🔄 Alternatives & Learning Deviations

This file documents when you implement something different from MENTOR_CODEX suggestions.
It grows as you learn and is used by Claude to understand your preferences and patterns.

**Format**:
```
## [Module N]: [Feature/Decision]

### MENTOR_CODEX Suggested
[What the system suggested]

### What You Did Instead
[Your implementation]

### Why
[Your reasoning]

### Lesson for Future
[What Claude should remember for next projects]
```

---

## Module 2: UnstyledButton - No Deviations

### Summary
- Followed MENTOR_CODEX exactly
- TDD: Red → Green → Refactor (worked perfectly)
- Render props pattern as suggested
- isFocusVisible for keyboard focus (great UX)
- Data attributes for state (clean and testable)

### Confidence
All patterns from MENTOR_CODEX applied flawlessly.
No deviations needed. Continue same approach in Module 3.

---

## Module 3: Button (To Learn)

### Expected Decision Points
When building Button, you may encounter:
1. **Styling approach**: CSS Modules vs Tailwind vs CSS-in-JS?
2. **Variant management**: Data attributes vs className selectors?
3. **Icon implementation**: How to handle startIcon/endIcon sizing?
4. **State inheritance**: Via render props or Context API?

Document here if you deviate from MENTOR_CODEX suggestions.

---

## Template for Future Use

```
## [Module N]: [Feature]

### MENTOR_CODEX Suggested
[Copy the suggestion from MENTOR_CODEX.md]

### What You Did Instead
[Your implementation with code if relevant]

### Why
- [Reason 1]
- [Reason 2]
- [Trade-offs considered]

### Results
- [What worked]
- [What didn't]
- [Would you do it again?]

### Lesson for Future
When [scenario from MENTOR_CODEX], consider:
- [Your approach for similar situations]
- [When to use your approach vs MENTOR_CODEX]
- [Edge cases discovered]
```

---

## Cross-Project Patterns

As you complete more projects, this section accumulates meta-patterns:

### Styling Strategy by Project Type
(Will populate after multiple projects)

Example (placeholder for later):
```
- Component Library: CSS Modules (scoped, reusable)
- React App: Tailwind (fast iteration)
- Micro Frontend: CSS Modules + design tokens (shared theme)
```

### Testing Strategy by Scale
(Will populate after multiple projects)

Example (placeholder for later):
```
- Small component: Unit tests only
- Medium component: Unit + integration tests
- Full app: Unit + integration + E2E tests
```

### CI/CD Optimization
(Will populate after experimenting)

Example (placeholder for later):
```
- First project: All checks on every push (safe)
- Mature project: Conditional checks (based on changes)
```

---

## Notes for Claude

When loading this file in future sessions:
- Read this file AFTER MENTOR_CODEX.md
- These alternatives override default suggestions
- If pattern appears 3+ times, update MENTOR_CODEX.md
- Use alternatives to calibrate suggestions for THIS developer

---

**Active Projects Using This System**:
- xd-components (component library - Modules 1-2 complete)

**Archived Projects**:
(None yet)

---

**Last Updated**: After completing Module 2
**Next Update**: After first deviation or Module 3 completion
