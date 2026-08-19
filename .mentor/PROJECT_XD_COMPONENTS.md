# 📋 XD Components - Project Context

## Project Overview

**Type**: Component Library (Monorepo)
**Status**: In Progress (Modules 1-2 Complete, 6 Remaining)
**Repo**: https://github.com/xavierDelaFuente/xd-components
**Local**: ~/Repos/other/xd-components (MINGW64)

---

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 18.3.0
- **Package Manager**: pnpm 9.x (monorepo workspaces)
- **Testing**: Vitest 2.0.0 + Testing Library 16.0.0
- **Build**: tsup 8.1.0
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions (test-lint-build.yml, deploy-storybook.yml)
- **Deployment**: GitHub Pages (Storybook)
- **Styling**: CSS Modules with data-* attributes
- **Documentation**: Storybook

---

## Architecture Decisions

### ✓ Monorepo with Workspaces
- **Why**: Multiple independent components, each published to npm
- **Structure**: packages/{component-name}/
- **Benefit**: Shared tsconfig, ESLint, CI/CD. Each package independent.

### ✓ Modular Packages (NO Barrel)
- **Design**: `@xd-components/button`, `@xd-components/icon-button`, etc.
- **Not**: Single barrel with all exports
- **Benefit**: Consumer chooses only what they need. Each package may have own versioning.

### ✓ Render Props Pattern
- **Usage**: UnstyledButton exposes state (isHovered, isPressed, isFocused, isFocusVisible)
- **Consumer Choice**: Decide rendering based on state
- **Alternative Considered**: Callbacks only (rejected - limiting)
- **Benefit**: Maximum flexibility, decoupled behavior from presentation

### ✓ Composition Over Inheritance
- **Button wraps UnstyledButton**: No code duplication
- **IconButton wraps Button**: Adds aria-label, hides icon
- **ButtonGroup provides Context**: Children inherit props
- **Benefit**: DRY, easier to maintain, no tight coupling

### ✓ CSS Modules + Data Attributes
- **State via data-***: `data-variant="primary"`, `data-size="md"`, `data-disabled="true"`
- **Styling by state**: `.button[data-variant="primary"] { ... }`
- **Not**: Inline styles or Emotion
- **Benefit**: Scoped CSS, clear state management, accessible styling

### ✓ CI/CD from Day 1
- **Branch Protection**: main requires PR, 4 status checks, 1 approval
- **Status Checks**:
  - pnpm test (>90% coverage)
  - pnpm type-check (TypeScript strict)
  - pnpm lint (ESLint)
  - pnpm build (no errors)
- **Benefit**: Catches bugs before merge. Quality gate enforced.

### ✓ Accessibility First
- **Pattern**: ARIA labels, semantic HTML, keyboard navigation
- **Data Attributes**: For state visibility
- **isFocusVisible**: Focus ring only on keyboard focus (UX improvement)
- **Testing**: All tests verify a11y (getByRole, labels)

---

## Modules Completed

### Module 1: Scaffold ✅ COMPLETE
**Deliverables**
- [x] pnpm monorepo setup
- [x] TypeScript strict config
- [x] Vitest + Testing Library setup
- [x] ESLint + Prettier config
- [x] GitHub Actions workflows (test-lint-build, deploy-storybook)
- [x] Branch protection rules (4 checks, 1 approval required)

**Commits**
```
1. chore: add gitignore
2. chore: scaffold monorepo with pnpm workspaces and config
3. chore: add ESLint + Prettier config
```

**Lessons Learned**
- Branch protection before coding prevents merge of broken code
- Monorepo workspace:* dependencies simplify peer management
- TypeScript strict from start prevents tech debt

---

### Module 2: UnstyledButton ✅ COMPLETE
**Deliverables**
- [x] Unstyled button primitive (no styling)
- [x] Render props pattern (children as function)
- [x] Interactive state management (isHovered, isPressed, isFocused, isFocusVisible)
- [x] Polymorphic component ('as' prop)
- [x] forwardRef support
- [x] 11 tests (TDD: Red → Green → Refactor)
- [x] 100% coverage

**Key Patterns Implemented**
```tsx
// Render Props: expose state to consumer
<UnstyledButton>
  {({ isHovered, isPressed }) => (
    <span>{isHovered ? 'Hover' : 'Normal'}</span>
  )}
</UnstyledButton>

// Polymorphism: render as any element
<UnstyledButton as="a" href="/home">Link</UnstyledButton>

// forwardRef: parent can access DOM
const ref = useRef(null);
<UnstyledButton ref={ref}>Button</UnstyledButton>
```

**Commits** (TDD visible in history)
```
1. feat(unstyled-button): render as button element (TDD red-green)
2. feat(unstyled-button): polymorphic 'as' prop
3. refactor: extract OverridableProps to shared utils
4. feat(unstyled-button): forwardRef support
5. test(unstyled-button): interaction and keyboard tests
6. feat(unstyled-button): render props with interaction state
7. test(unstyled-button): data attribute state tests
```

**Tests**
- renders as button by default
- renders as custom element ('as' prop)
- forwards ref
- calls onClick when clicked
- doesn't respond when disabled
- focusable via Tab
- triggers on Enter and Space
- accepts children as render function
- passes state to render function
- sets data-attributes for state
- Complete a11y compliance

**Lessons Learned**
- Render props > callbacks for flexibility
- isFocusVisible > isFocused for keyboard UX
- Data attributes make state visible and testable
- Unstyled primitive is better starting point than styled component

---

## Modules Pending

### Module 3: Button (Styled) ⏳ NEXT
- Wrap UnstyledButton
- Add variants (primary, secondary, destructive)
- Add sizes (sm, md, lg)
- Add icons (startIcon, endIcon)
- CSS Modules styling
- Expected: 13 tests

### Module 4: IconButton
- Reutilize Button (composition)
- Icon-only (aria-label mandatory)
- Expected: 7 tests

### Module 5: ButtonGroup
- Context API for prop inheritance
- Children inherit variant, size, disabled
- Override individually
- Expected: 7 tests

### Module 6: Storybook
- Centralized documentation
- Interactive stories
- Accessibility addon

### Module 7: Build & Publish
- Verify build output (ESM, CJS, types)
- Test local linking
- npm publish (optional)

### Module 8: Deploy
- GitHub Pages setup
- Storybook deploy
- CI/CD for deploy

---

## Current Code Structure

```
packages/
├── unstyled-button/
│   ├── src/
│   │   ├── components/UnstyledButton/
│   │   │   ├── UnstyledButton.tsx (complete)
│   │   │   ├── UnstyledButton.test.tsx (11 tests, all passing)
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── types.ts (OverridableProps)
│   │   ├── test-setup.ts
│   │   └── index.ts
│   ├── package.json (@xd-components/unstyled-button)
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── vitest.config.ts
│
└── button/
    ├── src/
    │   ├── components/Button/
    │   │   ├── Button.tsx (empty scaffold)
    │   │   ├── Button.module.css (empty scaffold)
    │   │   ├── Button.test.tsx (empty)
    │   │   └── index.ts
    │   └── ...
    └── (similar to unstyled-button)

.github/workflows/
├── test-lint-build.yml ✓ (4 parallel jobs)
└── deploy-storybook.yml (pending first Storybook build)

.mentor/
├── (being created - this file)
└── alternatives.md (skeleton)
```

---

## Key Insights

### Pattern: Render Props is Powerful
UnstyledButton doesn't impose how to render. It exposes state:
```tsx
// Simple usage
<UnstyledButton>Text</UnstyledButton>

// Complex usage with state
<UnstyledButton>
  {({ isPressed, isFocusVisible }) => (
    <motion.div animate={{ scale: isPressed ? 0.95 : 1 }}>
      {isFocusVisible && <FocusRing />}
      Button
    </motion.div>
  )}
</UnstyledButton>
```

### Insight: isFocusVisible vs isFocused
- `isFocused`: true when element has focus (any source)
- `isFocusVisible`: true only for keyboard focus
- **UX benefit**: Show focus ring only when user navigates via keyboard

### Insight: Data Attributes for State
```tsx
// Component sets state via data-*
<button data-variant="primary" data-pressed="true" />

// CSS responds to state
.button[data-pressed="true"] { transform: scale(0.95); }

// Benefits:
// 1. State visible in DevTools
// 2. CSS tests can validate classes
// 3. Accessible (data-* is semantic)
```

### Insight: CI/CD from Day 1 Prevents Regressions
- Branch protection catches bugs before merge
- Forces discipline (tests before commit)
- Makes Git history trustworthy

---

## Next Steps

### Before Module 3
- [ ] Review render props pattern (fully understood?)
- [ ] Verify CI/CD is catching issues (can test by breaking something?)
- [ ] Confirm monorepo setup is smooth (dependencies resolving?)

### During Module 3: Button
- [ ] Follow TDD exactly: Red → Green → Refactor
- [ ] Create PR from `feat/button` branch
- [ ] Verify all 4 CI/CD checks pass
- [ ] Document any changes from MENTOR_CODEX in alternatives.md
- [ ] Merge when ready
- [ ] Update this file

### After Module 3
- [ ] Run: pnpm build (should generate dist/ in each package)
- [ ] Review test coverage (must be >90%)
- [ ] Consider if patterns are holding up

---

## Questions for Future Self

If you're reading this later:
1. **Are render props still the best for this library?**
   - How did Button variants work out?
   - Did consumers find it flexible enough?

2. **Did CSS Modules scale well?**
   - Consider Tailwind for future projects?
   - Or keep CSS Modules for libraries?

3. **Is monorepo structure correct?**
   - Should each package be independent npm or wait?
   - Did workspace:* dependencies work smoothly?

4. **Did TDD actually work?**
   - Were the tests useful?
   - Did they catch bugs before deploy?
   - Worth continuing in next project?

---

## Resources & Links

- **Repo**: https://github.com/xavierDelaFuente/xd-components
- **Local**: ~/Repos/other/xd-components
- **Mentor System**: MENTOR_CODEX.md (universal principles)
- **Alternatives**: .mentor/alternatives.md (your deviations)

---

**Last Updated**: After completing Module 2 (UnstyledButton)
**Next Update**: After completing Module 3 (Button)
