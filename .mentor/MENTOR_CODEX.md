# 🎓 MENTOR CODEX - Universal Development Principles

## Core Philosophy

**TDD Always**
- Red → Green → Refactor in every cycle
- Tests are the first customer of your code
- Coverage >90% for production code
- Test behavior, not implementation

**Ship Quality**
- Tests must pass before merge
- Linting enforces consistency
- TypeScript strict mode mandatory
- Code review before production

**Composition > Inheritance**
- Wrap, don't extend
- Render props for flexibility
- Context for shared state
- Avoid tight coupling

**Explicit > Implicit**
- Clear naming: `isHovered` not `hov`
- Types define contracts
- No magic or hidden behavior
- Data attributes for state visibility

**Accessibility First**
- ARIA semantic
- Keyboard navigation always
- Focus management explicit
- Screen reader friendly

---

## Tech Stack Defaults

### Frontend Stack
- **Language**: TypeScript (strict mode)
- **Framework**: React 18+ (or Next.js)
- **Package Manager**: pnpm (monorepos, workspaces)
- **Build**: tsup (libraries), Vite (apps)
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Styling**: CSS Modules (libraries) or Tailwind (apps)
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages (docs), Vercel (apps)

### Why These Choices?

**pnpm**
- Monorepo workspaces native
- Faster than npm/yarn
- Strict peer dependencies (prevents phantom deps)
- Better disk usage (symlinks)

**Vitest**
- Fast (native ESM, multi-threaded)
- Jest-compatible (easy migration)
- TypeScript first-class
- Best with Vite ecosystem

**Testing Library**
- User-centric queries (getByRole not getByTestId)
- Encourages accessibility testing
- Tests behavior, not implementation
- Resilient to refactors

**GitHub Actions**
- Free tier sufficient
- Integrates with branch protection
- Matrix testing easy
- Secrets management built-in

---

## Project Types & Patterns

### Pattern 1: Component Library

**When to use**
- [ ] Multiple independent components?
- [ ] Components used in multiple projects?
- [ ] Publishing to npm?

**Structure**
```
packages/
├── component-a/    ← Separate npm package
├── component-b/
└── component-c/
```

**Characteristics**
- Monorepo with pnpm workspaces
- Each package independent
- Shared tsconfig base
- Storybook for docs
- Render props for flexibility

**Key Patterns**
- Unstyled primitives + styled components
- Composition: small → composite
- Data attributes for state
- ARIA/accessibility first

### Pattern 2: React Application

**When to use**
- [ ] Single deliverable?
- [ ] Not reused in other projects?
- [ ] Single deployment?

**Structure**
```
src/
├── components/
├── pages/
├── hooks/
├── utils/
└── styles/
```

**Characteristics**
- Single package.json
- Vite for fast dev
- Tailwind for styling (fast iteration)
- API integration
- Single deployment

**Key Patterns**
- Custom hooks for logic reuse
- Component composition (not library exports)
- Global state if needed (Context, Redux)
- Feature-based folder structure

### Pattern 3: Monorepo with Multiple Apps

**When to use**
- [ ] Multiple apps sharing logic?
- [ ] Shared component library?
- [ ] Mono vs poly tradeoffs evaluated?

**Structure**
```
packages/
├── shared-components/
├── web-app/
├── mobile-app/
├── docs/
└── cli/
```

**Characteristics**
- pnpm workspaces
- workspace:* for internal references
- Shared tsconfig, ESLint, CI/CD
- Version management strategy (changeset or manual)

**Key Patterns**
- Each app independent deployment
- Shared packages as npm or workspace:*
- CI/CD runs tests for affected packages

---

## Decision Trees

### "Should I build a monorepo?"

```
├─ Multiple independent packages?
│  └─ YES → monorepo
│  └─ NO → single package
├─ Each publishable to npm?
│  └─ YES → monorepo
│  └─ NO → single package
└─ Shared documentation/CI/CD?
   └─ YES → monorepo benefit increases
   └─ NO → single package simpler
```

**Default: single package unless 2+ above are YES**

---

### "Should I use Render Props?"

```
├─ Consumer needs to control rendering?
│  └─ YES → render props
│  └─ NO → direct children
├─ Multiple visual states?
│  └─ YES → render props
│  └─ NO → CSS sufficient
├─ Component behavior decoupled from presentation?
│  └─ YES → render props
│  └─ NO → direct styles
└─ Maximum flexibility needed?
   └─ YES → render props
   └─ NO → styled component simpler
```

**Default: render props for primitives, styled components for finished components**

---

### "Should I add CI/CD now?"

```
├─ Sharing code with team?
│  └─ YES → CI/CD mandatory
│  └─ NO → OK to defer
├─ Publishing to npm/production?
│  └─ YES → CI/CD mandatory
│  └─ NO → beneficial but optional
└─ Want quality gates?
   └─ YES → CI/CD mandatory
   └─ NO → manual testing OK for now
```

**Default: CI/CD from day 1 if any YES**

---

### "What styling approach?"

```
├─ Library component?
│  ├─ Unstyled primitive?
│  │  └─ CSS Modules + data-attributes (scoped)
│  └─ Styled component?
│     └─ CSS Modules + data-attributes (scoped)
│
├─ Application?
│  ├─ Internal only?
│  │  └─ Tailwind (fast iteration)
│  └─ Design system?
│     └─ CSS Modules + design tokens
│
└─ Mixed?
   └─ Tailwind for app, CSS Modules for library
```

**Default: CSS Modules for libraries, Tailwind for apps**

---

## Code Quality Standards

### Testing

**Minimum coverage**: 90%
```
packages/
├── src/
│   ├── Button.tsx
│   └── Button.test.tsx        ← Same folder
├── vitest.config.ts           ← Coverage config
└── package.json               ← "test:coverage"
```

**Test structure**: AAA pattern
```tsx
it('description of behavior', () => {
  // Arrange: setup
  render(<Button>Click</Button>);
  
  // Act: user interaction
  await user.click(screen.getByRole('button'));
  
  // Assert: verify
  expect(handleClick).toHaveBeenCalled();
});
```

**Query priority**
1. `getByRole` (accessible, encourages a11y)
2. `getByLabelText` (accessible)
3. `getByTestId` (last resort, implementation detail)

---

### TypeScript

**Always `strict: true`**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true
  }
}
```

**Avoid `any`**
- Use unknown if type unknown
- Use generics for flexibility
- Create interfaces for complex shapes

**Polymorphic components**
```tsx
// Pattern for components that render as different elements
type OverridableProps<T extends ElementType, OwnProps> =
  OwnProps & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps>;

export type ButtonProps<T extends ElementType = 'button'> =
  OverridableProps<T, { variant: 'primary' | 'secondary' }>;
```

---

### Git & CI/CD

**Commit style**: Conventional Commits
```
feat(component): add new feature
fix(button): resolve click handling
test(button): add coverage for disabled state
docs: update README
chore: update dependencies
refactor(button): simplify hover logic
```

**Atomic commits**
- One logical change per commit
- Tests pass for each commit
- Readable history: `git log --oneline` tells story

**Branch protection rules**
```
main branch:
  ✓ Require pull request before merging
  ✓ Require 1 approval minimum
  ✓ Require status checks pass:
    - test
    - type-check
    - lint
    - build
  ✓ Dismiss stale reviews
```

**CI/CD checks**
```yaml
- pnpm install --frozen-lockfile
- pnpm test (coverage >90%)
- pnpm type-check (TypeScript strict)
- pnpm lint (ESLint clean)
- pnpm build (no errors)
```

---

## Accessibility Checklist

Every component must have:

- [ ] `role` attribute correct (button, link, etc)
- [ ] Keyboard navigation working (Tab, Enter, Space)
- [ ] Focus visible (`:focus-visible` or custom indicator)
- [ ] Focus management (trap in modals, return after close)
- [ ] Labels for form fields
- [ ] `aria-label` for icon-only buttons
- [ ] `aria-hidden` for decorative elements
- [ ] Semantic HTML (button not div+onclick)
- [ ] Color contrast >4.5:1
- [ ] No keyboard traps

---

## Common Patterns

### Pattern: Render Props for State Exposure

**Use when**: Component behavior decoupled from presentation

```tsx
// Component exposes state
<UnstyledButton>
  {({ isHovered, isPressed, isFocused }) => (
    <div>
      {isPressed ? 'Down' : isHovered ? 'Hover' : 'Up'}
    </div>
  )}
</UnstyledButton>

// Benefit: Consumer controls rendering
```

### Pattern: Data Attributes for State

**Use when**: Styling based on state

```tsx
// Component sets data attributes
<button
  data-variant={variant}
  data-size={size}
  data-disabled={disabled}
  data-pressed={isPressed}
/>

// CSS selects by state
.button[data-variant="primary"] { ... }
.button[data-pressed="true"] { ... }
```

### Pattern: Composition Over Inheritance

**Use always**: Don't extend classes

```tsx
// ✗ Bad: inheritance
class StyledButton extends UnstyledButton { ... }

// ✓ Good: composition
function StyledButton({ children, ...props }) {
  return (
    <UnstyledButton className={styles.button} {...props}>
      {children}
    </UnstyledButton>
  );
}
```

### Pattern: Polymorphic Components

**Use when**: Component needs flexibility

```tsx
// Render as button, link, custom element
<Button as="a" href="/home">Link</Button>
<Button as={CustomComponent} customProp="value">Custom</Button>

// Benefit: Type-safe, flexibility, accessibility
```

---

## Performance Principles

- Lazy load when possible (Route splitting, dynamic imports)
- Memoize expensive computations (useMemo)
- Memoize callbacks (useCallback)
- Avoid creating functions in render
- useTransition for non-urgent updates
- Measure before optimizing (Lighthouse, DevTools)

---

## Learning Philosophy

**Depth over breadth**
- Master fundamentals (TDD, TypeScript, accessibility)
- Use fewer tools excellently
- Avoid shiny new tech until needed

**Learn by doing**
- Build complete projects (not tutorials)
- TDD from start (tests guide learning)
- Commit history shows progression

**Patterns emerge**
- Notice what repeats across projects
- Document learnings (alternatives.md)
- Share with future self

---

## When to Break These Rules

Only if:
1. You understand the rule deeply
2. You have a specific reason
3. You document why in alternatives.md
4. Trade-offs are acceptable

Example: "I used Tailwind instead of CSS Modules because [reason]"

This is learning.

---

**Last Updated**: When you complete a project and learn something new
**Next Review**: After completing 2-3 projects
