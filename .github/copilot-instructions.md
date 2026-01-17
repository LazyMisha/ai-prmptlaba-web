# GitHub Copilot Project Instructions

> **Production-grade Next.js + React + TypeScript application.**
> All code must meet Senior Frontend Engineer standards.

---

## 1. CRITICAL RULES (Always Follow)

### Context7 MCP

Automatically use Context7 MCP tools (`resolve-library-id` → `query-docs`) for any library code generation or documentation lookup.

**Installed Package Versions (use these for Context7 queries):**

| Package    | Installed Version | Context7 Library ID       |
| ---------- | ----------------- | ------------------------- |
| Next.js    | 16.0.10           | `/vercel/next.js/v16.1.0` |
| React      | 19.2.3            | `/facebook/react`         |
| TypeScript | 5.x               | `/microsoft/typescript`   |

**Version Matching (CRITICAL):**

1. **Use the Context7 Library IDs from the table above** — these are pre-validated for this project
2. When querying Context7, **always use the highest available version** within the same major version
3. For packages not in the table: call `resolve-library-id`, then pick the **newest** version matching your major version
4. Never assume API compatibility — always verify against versioned docs
5. **Next.js 16 uses `proxy.ts`** (not `middleware.ts`) — this is a breaking change from Next.js 15

### Planning Requirement

**Before writing ANY code**, propose a plan including:

- Files to create/update
- Server vs Client Components (with reasoning)
- State management approach
- Error/loading/empty states
- Testing strategy

**Wait for user approval before generating code.**

### Validation Requirement

**After ANY code changes**, run:

```bash
npm run lint && npm run type-check && npm run test
```

Fix all failures before proceeding.

### Architectural Restrictions

**DO NOT modify without explicit approval:**

- Project structure, routing, or folder organization
- Config files (next.config.ts, tsconfig.json, eslint, tailwind, prettier)
- Root/global layouts, providers, or shared utilities in `src/lib/`
- Authentication or global state logic

### React Compiler (Automatic Memoization)

React Compiler is enabled. **DO NOT use:**

- `useCallback`, `useMemo`, `React.memo()` — handled automatically
- Exception: Use `useRef` for event listeners needing current state values

**Skill Rules Superseded by React Compiler:**

- `rerender-memo` — ignore, React Compiler handles memoization
- `advanced-event-handler-refs` — use `useRef` instead of manual ref patterns
- `advanced-use-latest` — not needed with React Compiler

### Agent Skills (Performance & Design)

Two Agent Skills are installed in `.github/skills/`:

| Skill                         | Purpose                            | Triggers On                                                      |
| ----------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `vercel-react-best-practices` | 45 React/Next.js performance rules | Writing/reviewing React code, data fetching, bundle optimization |
| `web-design-guidelines`       | Web interface design patterns      | UI reviews, accessibility audits, design checks                  |

**Precedence Rules:**

- **Project instructions override skills** — e.g., don't use `useMemo()` even if skill suggests it (React Compiler handles this)
- Skills provide implementation patterns; instructions define project standards
- When in doubt, follow existing patterns in the codebase

---

## 2. Project Context

### Structure

Check `README.md` for authoritative project structure before implementing features.

| Location                    | Purpose                      |
| --------------------------- | ---------------------------- |
| `src/app/[lang]/`           | Pages with i18n routing      |
| `src/components/common/`    | Shared UI components         |
| `src/components/<feature>/` | Feature-specific components  |
| `src/components/icons/`     | Reusable SVG icon components |
| `src/lib/`                  | Utilities, AI, DB helpers    |
| `src/i18n/dictionaries/`    | Translation files (en, uk)   |
| `src/types/`                | TypeScript definitions       |
| `src/constants/`            | App-wide constants           |

### Key Principles

- Extend existing code; don't restructure
- Follow patterns in similar existing files
- All user-facing strings → translation files (no hardcoded text)
- Every new component/utility MUST have tests in `__tests__/`

---

## 3. Code Standards

### TypeScript

- Strict typing; avoid `any` unless absolutely necessary
- Use latest stable TypeScript features
- Define interfaces for all props and data structures

### React & Next.js

- Functional components only
- Server Components for data fetching; Client Components for interactivity
- Use `async/await` (not `.then()`)
- Use `next/image` for all images
- Implement `error.tsx` at route level

### Quality Rules

| Rule                  | Implementation                          |
| --------------------- | --------------------------------------- |
| DRY                   | Extract repeated logic to utilities     |
| Single Responsibility | One component = one purpose             |
| Named Exports         | Unless single-purpose default component |
| Self-documenting      | Clear, descriptive names                |
| JSDoc                 | Complex logic, public APIs, utilities   |

### Error Handling

- Try-catch for async operations with logging
- User-friendly messages; never expose stack traces
- Handle all edge cases defensively
- Validate inputs on both client and server

### Security

- Sanitize all user inputs
- No `dangerouslySetInnerHTML` without sanitization
- Sensitive data in environment variables only
- Follow OWASP best practices

---

## 4. Styling

### Design System: Apple-Inspired

**Design Tokens (MUST USE):**

| Token             | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| Primary text      | `text-[#1d1d1f]`                                                  |
| Secondary text    | `text-[#86868b]`                                                  |
| Blue (primary)    | `bg-[#007aff]` / `hover:bg-[#0071e3]`                             |
| Red (destructive) | `bg-[#ff3b30]`                                                    |
| Green (success)   | `bg-[#34c759]`                                                    |
| Borders           | `border-black/[0.08]` or `border-black/[0.12]`                    |
| Body text         | `text-[17px] tracking-[-0.01em]`                                  |
| Border radius     | Cards: `rounded-2xl` / Buttons: `rounded-xl` / Tags: `rounded-lg` |
| Transitions       | `duration-200 ease-out` or `duration-300 ease-out`                |

**Button Pattern:**

```tsx
className={cn(
  'bg-[#007aff] text-white rounded-xl px-7 py-3.5',
  'text-[17px] font-semibold min-h-[50px]',
  'hover:bg-[#0071e3] active:opacity-80 active:scale-[0.98]',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-2'
)}
```

### TailwindCSS Rules

1. **Mobile-first mandatory** — Base styles for mobile, then `sm:`, `md:`, `lg:`, `xl:`
2. **Always use `cn()`** from `@/lib/utils` for className merging
3. **Group classes with comments:**

```tsx
className={cn(
  // Layout
  'flex flex-col',
  // Spacing
  'p-4 gap-4 md:p-6',
  // Colors
  'bg-white border border-black/[0.08]',
  // Effects
  'rounded-2xl shadow-sm',
  // Conditional
  isActive && 'ring-2 ring-[#007aff]'
)}
```

### Accessibility Requirements

| Requirement    | Implementation                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Touch targets  | Min `44px` height (`min-h-[44px]`)                                                                 |
| Focus states   | `focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-2` |
| Color contrast | WCAG 2.1 AA (4.5:1 text, 3:1 UI)                                                                   |
| Semantics      | Proper HTML elements, ARIA labels, heading hierarchy                                               |
| Keyboard nav   | All interactive elements focusable and operable                                                    |

### Icons

- All icons as components in `src/components/icons/`
- Accept `className` prop; use `cn()` for merging
- Include `aria-hidden="true"` for decorative icons
- Naming: `{Name}Icon.tsx` (e.g., `ChevronIcon.tsx`)
- **Every icon MUST have a test file**

---

## 5. API & Data

### Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  prompt: z.string().min(1).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const validated = schema.parse(await req.json())
    const result = await processData(validated)
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 },
      )
    }
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
```

### Response Format

```typescript
// Success: { data: T }
// Error: { error: string, code?: string, details?: unknown }
```

### Data Fetching

- Prefer Server Components with native `fetch`
- Use Next.js caching (`revalidate`, Cache API)
- Implement proper error boundaries

---

## 6. Testing

### Organization

- Test files in `__tests__/` folders adjacent to source
- Naming: `{SourceFile}.test.tsx` or `.test.ts`

### Component Testing (React Testing Library)

```typescript
describe('EnhanceButton', () => {
  it('renders correctly', () => {
    render(<EnhanceButton onClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /enhance/i })).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<EnhanceButton onClick={jest.fn()} isLoading />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<EnhanceButton onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Rules

- Query by accessible elements (role, label, text)
- Test user behavior, not implementation
- Cover: happy path, edge cases, error states, loading states
- Mock external dependencies; avoid over-mocking
- Deterministic tests (mock dates/random values)

---

## 7. Workflow & Conventions

### Code Generation Workflow

1. **Read** `README.md` for project structure
2. **Analyze** existing patterns in similar files
3. **Plan** and get approval
4. **Implement** production-ready code
5. **Test** — create test files (mandatory)
6. **Validate** — run lint, type-check, tests
7. **Document** — JSDoc for complex logic

### Code Removal

1. **Find** all references/usages
2. **Plan** removal steps; get approval
3. **Remove** code and references
4. **Test** thoroughly to ensure no breakage
5. **Validate** — run lint, type-check, tests

### File Naming

| Type       | Convention   | Example                  |
| ---------- | ------------ | ------------------------ |
| Components | PascalCase   | `EnhanceButton.tsx`      |
| Utilities  | camelCase    | `formatDate.ts`          |
| Types      | camelCase    | `enhance.ts`             |
| Tests      | Match source | `EnhanceButton.test.tsx` |

### Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party
import { z } from 'zod'

// 3. Internal (@/)
import type { EnhanceRequest } from '@/types/enhance'
import { EnhanceButton } from '@/components/enhance/EnhanceButton'
import { cn } from '@/lib/utils'

// 4. Relative
import { formatDate } from './utils'
```

### Component Pattern

```typescript
interface ComponentNameProps {
  /** Required callback */
  onClick: () => void
  /** Loading state */
  isLoading?: boolean
  /** Additional classes */
  className?: string
}

export function ComponentName({
  onClick,
  isLoading = false,
  className,
}: ComponentNameProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={cn('base-classes', className)}
    >
      {isLoading ? 'Loading...' : 'Action'}
    </button>
  )
}
```

---

## 8. Internationalization (i18n)

### Structure

```
src/i18n/
├── dictionaries.ts      # getDictionary(locale)
├── locales.ts           # 'en' | 'uk'
└── dictionaries/
    ├── en.json
    └── uk.json
```

### Usage

**Server Component:**

```tsx
const dict = await getDictionary(locale)
return <h1>{dict.page.title}</h1>
```

**Client Component:**

```tsx
'use client'

import { useTranslations } from '@/i18n/client'

export function ClientComponent() {
  const dict = useTranslations()
  return <h1>{dict.page.title}</h1>
}
```

### Rules

- All user-facing strings in translation files
- Keep all language files in sync
- Hierarchical keys: `enhance.form.placeholder`
- Add to ALL language files simultaneously

---

## 9. Performance Targets

| Metric                  | Target               |
| ----------------------- | -------------------- |
| Lighthouse Score        | ≥ 90                 |
| First Contentful Paint  | < 1.5s               |
| Time to Interactive     | < 3.5s               |
| Cumulative Layout Shift | < 0.1                |
| Page Bundle Size        | < 200KB (compressed) |

### Performance Rules

- Server Components for data-heavy logic
- Dynamic imports for heavy components
- Lazy-load images and media
- No new dependencies without approval
- Cache data fetches appropriately

---

## 10. Quality Checklist

Before submitting any code, verify:

- [ ] Plan approved by user
- [ ] Follows existing project patterns
- [ ] TypeScript strict (no `any`)
- [ ] Error handling complete
- [ ] Accessible (keyboard, ARIA, contrast)
- [ ] Mobile-first responsive
- [ ] Tests written and passing
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] No hardcoded strings (use i18n)
- [ ] JSDoc for complex logic
- [ ] No security vulnerabilities
- [ ] Context7 MCP used for code generation
- [ ] Performance patterns follow `vercel-react-best-practices` skill (where not conflicting with React Compiler)
