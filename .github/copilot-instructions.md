# GitHub Copilot Project Instructions

## 1. Project Overview

This repository is a production-grade Next.js 16 application using the App Router.
The project structure is fully established and must not be recreated. Copilot must only extend or modify the existing codebase.

**Code Quality Standard**: All code must be production-ready and written at Senior Frontend Developer level. This includes:

- Enterprise-grade architecture and patterns
- Comprehensive error handling and edge case coverage
- Performance optimization and best practices
- Accessibility (a11y) compliance
- Security considerations
- Clean, maintainable, and scalable code
- Proper TypeScript typing (no `any` types unless absolutely necessary)
- Thoughtful code comments and documentation
- DRY (Don't Repeat Yourself) principles
- SOLID principles where applicable

## 2. Tech Stack

- Next.js 16 (App Router)
- React 19 (Server + Client Components, React Compiler enabled)
- TypeScript 5
- TailwindCSS v4
- PostCSS
- ESLint + Prettier
- Jest + @testing-library/react
- API implemented using Next.js Route Handlers (src/app/api/\*)
- Utilities, hooks, constants, and shared components follow the project folder structure.

## 3. Project Structure (must always be respected)

.github/ # Copilot and GitHub configurations
.husky/ # Git hooks for linting and tests
├── pre-commit # Run linting and tests before each commit
src/
├── app/ # Next.js app router pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── globals.css # Global styles with Tailwind imports
│ ├── error.tsx # Error boundary
│ ├── loading.tsx # Loading UI
│ ├── not-found.tsx # 404 page
│ ├── api/ # API routes
├── components/ # React components
│ ├── common/ # Shared components and reusable icons (e.g., ChevronIcon.tsx, CloseIcon.tsx)
├── lib/ # Utility functions
│ ├── utils.ts # cn() utility for className merging
│ ├── utils/ # General utilities
│ ├── api/ # API utilities
├── types/ # TypeScript type definitions
├── constants/ # App-wide constants
└── hooks/ # Custom React hooks (not existing yet)
└── i18n/ # Internationalization (not existing yet)
├── .env.example # Environment variable template
├── .env.local # Local environment variables (not committed)

All new components or APIs must be placed in the appropriate folder.

## 4. Coding Rules

### TypeScript

- Always use TypeScript with strict typing (avoid `any`).
- Define proper interfaces and types for all props, state, and API responses.
- Use type inference where obvious, explicit types for public APIs.
- Leverage union types, discriminated unions, and type guards.
- Use `unknown` instead of `any` when type is genuinely unknown.

### React Patterns

- Use React Server Components (RSC) by default for better performance.
- Use "use client" only when necessary (state, effects, browser APIs, event handlers).
- Prefer composition over inheritance and prop drilling.
- Keep components small, single-responsibility, and reusable.
- Use custom hooks to extract and share logic.
- Implement proper loading and error states for all async operations.
- Use Suspense boundaries for async components.

**React Compiler (Automatic Memoization):**

This project has React Compiler enabled, which automatically handles memoization. Therefore:

- **DO NOT use `useCallback`** - React Compiler auto-memoizes functions
- **DO NOT use `useMemo`** - React Compiler auto-memoizes computed values
- **DO NOT use `React.memo()`** - React Compiler optimizes component re-renders automatically
- Only use `useState`, `useEffect`, `useRef`, `useContext`, and other non-memoization hooks
- If you need stable references for event listeners (e.g., `document.addEventListener`), use `useRef` to store mutable values that the listener needs to access

**Exception:** When adding event listeners to `document` or `window` that need access to current state values, use a ref to track the current value (since the listener closure would otherwise capture stale values).

### Code Quality

- Use named exports unless a file is a single-purpose default component.
- Use async/await instead of .then() for better readability.
- Use modern ECMAScript features (optional chaining, nullish coalescing, etc.).
- Write self-documenting code with clear, descriptive names.
- Add JSDoc comments for complex logic, public APIs, and utility functions.
- Follow DRY principles - extract repeated logic into utilities.
- Apply SOLID principles where applicable.

### Error Handling

- Implement comprehensive error handling with user-friendly messages.
- Consider all edge cases and error states.
- Write defensive code that gracefully handles unexpected inputs.
- Use try-catch for async operations with proper error logging.
- Provide meaningful error messages that guide users to resolution.
- Never expose sensitive error details to users.

### Performance

- Optimize for performance when needed.
- Implement lazy loading for heavy components.
- Use code splitting for routes and large features.
- Avoid unnecessary re-renders.
- Optimize images (next/image) and assets.

### Accessibility

- Use semantic HTML elements.
- Add proper ARIA labels and roles.
- Ensure keyboard navigation works.
- Maintain proper heading hierarchy.
- Provide alt text for images.
- Ensure sufficient color contrast (WCAG 2.1 AA: 4.5:1 for text, 3:1 for UI components).

**Focus States:**

- Always add visible focus indicators for keyboard users
- Use `focus:outline-none` with `focus-visible:ring-2` pattern
- Focus ring: `focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-2`
- Ensure focus ring has sufficient contrast against background

**Touch Targets:**

- Minimum touch target size: 44x44px (WCAG 2.5.5)
- Use `min-h-[44px]` or `min-h-[50px]` for buttons and links
- Add adequate spacing between interactive elements

### Icons and SVG

- **NEVER add inline SVG code directly in components** - always use reusable icon components.
- All SVG icons must be extracted into reusable components in `src/components/common/`.
- Icon components should accept `className` prop for sizing and styling.
- Icon components should include `aria-hidden="true"` for decorative icons.
- Use consistent naming: `IconNameIcon.tsx` (e.g., `ChevronIcon.tsx`, `CloseIcon.tsx`).
- Icon components should use `cn()` utility for className merging.
- Provide configurable props when needed (e.g., `direction`, `strokeWidth`).
- Add JSDoc comments documenting the icon's purpose and usage.
- **Every new icon component MUST have a corresponding test file** in `__tests__/` folder.

### Security

- Sanitize all user inputs.
- Prevent XSS attacks (never use dangerouslySetInnerHTML without sanitization).
- Validate data on both client and server.
- Use environment variables for sensitive data.
- Follow OWASP security best practices.

### Data Fetching

- Use native `fetch` with Next.js caching.
- Prefer Server Components for data fetching.
- Use React `use()` hook when needed.
- Implement proper error boundaries.
- Add loading.tsx for route-level loading states.

### Forms

- Use Server Actions for form submissions when possible.
- Validate on both client and server.
- Provide inline validation feedback.
- Handle loading and error states.
- Use progressive enhancement.

### Performance metrics

- Target Lighthouse score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Use Next.js Image optimization
- Implement code splitting for routes > 200KB

### Performance Guardrails

All new code must be optimized by default. Copilot must:

1. Prevent runtime bottlenecks:
   - Avoid unnecessary re-renders
   - Use Server Components for data-heavy logic
   - Fetch data with caching (Next.js Cache API, `revalidate`)

2. Control bundle size:
   - Dynamically import heavy components
   - Avoid unused/large dependency additions (must request approval)
   - Aim for page bundles < 200KB after compression

3. Optimize media and assets:
   - Use `next/image` for all images
   - Use responsive and lazy-loading media by default

4. Monitoring & validation:
   - Confirm Lighthouse score ≥ 90 before changes
   - Log bundle impact using `npx next build --analyze`
   - Ensure no regressions to Core Web Vitals:
     - FCP: < 1.5s
     - TTI: < 3.5s
     - CLS: < 0.1

If Copilot suggests code that may reduce performance,
it must:

- Explain the trade-offs explicitly
- Provide mitigation steps
- Request user confirmation before proceeding

## 5. Styling Rules

### Design Philosophy

**MOBILE-FIRST APPROACH**

All UI must be designed and implemented mobile-first. This means:

1. **Design for mobile screens first** - Start with the smallest viewport (320px) and progressively enhance for larger screens
2. **Base styles are mobile** - Write base CSS/Tailwind classes for mobile, then use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to adapt for larger screens
3. **Touch-friendly by default** - Minimum touch target size of 44x44px for interactive elements
4. **Performance on mobile** - Optimize for slower mobile networks and less powerful devices
5. **Test on real devices** - Verify UI looks and works great on both mobile and desktop

**Responsive Breakpoints (use progressively):**

- Base (no prefix): 0px+ (mobile phones)
- `sm:`: 640px+ (large phones / small tablets)
- `md:`: 768px+ (tablets)
- `lg:`: 1024px+ (laptops / desktops)
- `xl:`: 1280px+ (large desktops)
- `2xl:`: 1536px+ (extra large screens)

Follow Apple's design principles for all UI components:

- **Clarity** - Text is legible, icons are precise, adornments are subtle and appropriate
- **Deference** - Fluid motion and crisp interface help users focus on content
- **Depth** - Visual layers and realistic motion convey hierarchy and facilitate understanding

**Key characteristics:**

- Clean, minimalist layouts with generous whitespace
- Subtle shadows and depth (avoid harsh drop shadows)
- Smooth, meaningful animations and transitions
- High-quality typography with clear hierarchy
- Muted, sophisticated color palettes with purposeful accent colors
- Rounded corners with consistent border-radius
- Frosted glass effects (backdrop-blur) where appropriate
- Focus on content over chrome

**Apple Design Tokens (MUST USE):**

Colors:

- Primary text: `text-[#1d1d1f]`
- Secondary text: `text-[#86868b]`
- Blue (links/buttons): `bg-[#007aff]`, hover: `hover:bg-[#0071e3]`
- Red (destructive): `text-[#ff3b30]}` or `bg-[#ff3b30]`
- Green (success): `text-[#34c759]` or `bg-[#34c759]`
- Borders: `border-black/[0.08]` or `border-black/[0.12]`

Typography:

- Body text: `text-[17px]` with `tracking-[-0.01em]`
- Small text: `text-[15px]`
- Captions: `text-xs` (12px)
- Font weights: `font-normal` (body), `font-medium` (emphasis), `font-semibold` (headings/buttons)

Buttons:

- Primary: `bg-[#007aff] text-white rounded-xl px-7 py-3.5 text-[17px] font-semibold`
- Hover: `hover:bg-[#0071e3]`
- Active: `active:opacity-80 active:scale-[0.98]`
- Min height: `min-h-[50px]` for primary CTAs, `min-h-[44px]` for secondary
- Focus: `focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-2`

Border radius:

- Large (cards, modals): `rounded-2xl`
- Medium (buttons, inputs): `rounded-xl`
- Small (tags, badges): `rounded-lg`

Transitions:

- Duration: `duration-200` or `duration-300`
- Easing: `ease-out`

### TailwindCSS

- Use TailwindCSS utility classes for all styling.
- Avoid custom CSS unless absolutely necessary.
- Group related classes logically (layout, spacing, colors, typography).
- **ALWAYS use `cn()` utility from src/lib/utils.ts for ALL className attributes with multiple classes** - not just conditional ones.
- **ALWAYS add grouped comments** (e.g., `// Layout`, `// Spacing`, `// Colors`) to organize classes within `cn()`.
- Add inline comments to explain complex class combinations.
- **Always write mobile styles first**, then add responsive prefixes for larger screens.
- Leverage Tailwind's dark mode utilities when needed.

### Mobile-First Best Practices

- **Start small, scale up** - Base classes define mobile appearance, responsive prefixes enhance for larger screens.
- **Fluid typography** - Use responsive text sizes (e.g., `text-sm md:text-base lg:text-lg`).
- **Flexible layouts** - Use `flex-col` on mobile, `md:flex-row` on larger screens.
- **Appropriate spacing** - Smaller padding/margins on mobile (`p-4`), larger on desktop (`md:p-6 lg:p-8`).
- **Touch-friendly buttons** - Minimum height of `h-11` (44px) for touch targets.
- **Hidden/shown elements** - Use `hidden md:block` or `block md:hidden` to show/hide content appropriately.
- **Stack on mobile, side-by-side on desktop** - Common pattern for forms, cards, and content sections.

### Best Practices

- Keep className lists readable - break into logical groups with comments.
- Use semantic spacing (consistent margins and paddings).
- **Mobile-first is mandatory** - Never write desktop-first styles.
- Maintain consistent color palette using Tailwind's color system.
- Use Tailwind's built-in accessibility features.

### Example (Mobile-First)

```tsx
import { cn } from '@/lib/utils'
;<div
  className={cn(
    // Layout
    'flex',
    'flex-col',
    // Spacing
    'p-4',
    'gap-4',
    // Sizing
    'w-full',
    'max-w-3xl',
    // Colors
    'bg-white',
    'border',
    'border-gray-200',
    // Effects
    'rounded-lg',
    'shadow-sm',
    // Responsive
    'md:p-6',
    // Conditional
    isActive && 'ring-2 ring-blue-500',
  )}
>
  Content
</div>
```

## 6. API Rules

### Input Validation

- Validate all inputs using type guards or validation libraries.
- Check required fields and data types.
- Validate string lengths, number ranges, and formats.
- Return descriptive 400 errors for validation failures.

### Response Format

- Always return typed JSON using `NextResponse`.
- Use consistent response structure:
  ```typescript
  // Success: { data: T }
  // Error: { error: string, code?: string, details?: unknown }
  ```
- Set appropriate HTTP status codes (200, 201, 400, 401, 404, 500).
- Include proper Content-Type headers.

### Error Handling

- Wrap logic in try-catch blocks.
- Log errors server-side without exposing to client.
- Return user-friendly error messages.
- Distinguish between client errors (4xx) and server errors (5xx).
- Include `retryable` flag for transient errors.

### Security

- Implement input sanitization.
- Validate authentication/authorization when needed.
- Never expose sensitive data or stack traces.
- Use CORS properly for cross-origin requests.

### Performance

- Implement caching where appropriate.
- Set proper cache headers.
- Use database connection pooling if applicable.
- Implement request timeouts.
- Consider pagination for large datasets.

### Example

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  target: z.string().min(1).max(100),
})

export type EnhanceRequest = z.infer<typeof requestSchema>

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = requestSchema.parse(body) as EnhanceRequest
    // business logic
    const result = await enhancePrompt(validated)

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 })
    }
    console.error('Enhance API error:', err)

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 7. Testing Rules

### Test Organization

- Place test files in `__tests__/` folders next to the code they test.
- Name test files: `ComponentName.test.tsx` or `functionName.test.ts`.
- Group related tests using `describe` blocks.
- Use clear, descriptive test names that explain what is being tested.

### Component Testing

- Use React Testing Library for all component tests.
- Test user behavior, not implementation details.
- Query by accessible elements (role, label, text).
- Avoid testing internal state or implementation.
- Test loading states, error states, and edge cases.

### Unit Testing

- Use Jest for utility and library function tests.
- Test all exported functions and classes.
- Cover edge cases, error conditions, and boundary values.
- Mock external dependencies (APIs, database, etc.).
- Avoid over-mocking - test real behavior when possible.

### Test Coverage

- Aim for high test coverage on critical paths.
- Test error handling and validation logic.
- Test async operations and loading states.
- Test accessibility features with jest-axe, or keyboard/semantic test automation.
- Don't test third-party library internals.

### Test Planning Requirement

Before writing code for any new functionality, Copilot must:

1. Provide a clear Test Plan that includes:
   - All intended test cases and user flows
   - Edge cases, error cases, and accessibility validations
   - Unit and component testing responsibilities
   - Mocking strategy (if needed)
   - Expected behavior for loading and failure states

2. Wait for user approval before generating code or test files.

All new code must follow the test plan. If the implementation changes,
the test plan must be updated accordingly before adjusting tests.

### Best Practices

- Keep tests simple and focused (one concept per test).
- Use meaningful test data (avoid foo/bar).
- Clean up after tests (cleanup functions, unmount).
- Make tests deterministic (no random data, mock dates/times).
- Run tests before committing code.

### Example

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EnhanceButton } from './EnhanceButton'

describe('EnhanceButton', () => {
  it('renders with default text', () => {
    render(<EnhanceButton onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /enhance/i })).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(<EnhanceButton onClick={() => {}} isLoading />)
    expect(screen.getByText(/enhancing/i)).toBeInTheDocument()
  })

  it('disables button when disabled prop is true', () => {
    render(<EnhanceButton onClick={() => {}} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<EnhanceButton onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

or/and

```typescript
// in component test
import { toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
// ... render component and run axe
```

## 8. Component Conventions

### Organization

- Place all components in `src/components/`.
- Shared/reusable UI components go to `src/components/common/`.
- Feature-specific components go to `src/components/<feature>/`.
- Keep one component per file.

### Component Structure

- Use functional components exclusively (no class components).
- Define prop types using TypeScript interfaces.
- Extract complex logic into custom hooks.
- Keep components focused on a single responsibility.
- Prefer composition over inheritance.

### Props

- Define clear, typed prop interfaces.
- Avoid props explosion (max ~5-7 props).
- Use composition or render props for complex scenarios.
- Provide default values for optional props.
- Document complex prop types with JSDoc.

### State Management

- Keep state as local as possible.
- Lift state only when necessary for sharing.
- Use React Context for deeply nested shared state.
- Consider external state management (Zustand, Redux) only when needed.

### Naming Conventions

- Components: PascalCase (e.g., `EnhanceButton`)
- Props interfaces: `ComponentNameProps`
- Event handlers: `handleEventName` (e.g., `handleClick`), better to use meaningful names like `onDelete`, `onSubmit`.
- Boolean props: `isLoading`, `hasError`, `showModal`
- Callback props: `onEventName` (e.g., `onClick`, `onSubmit`)

### Documentation

- Add JSDoc comments for exported components.
- Document complex props and their expected values.
- Include usage examples for reusable components.
- Document any non-obvious behavior or side effects.

### Example

```typescript
import { cn } from '@/lib/utils'

/**
 * A reusable button component for enhancing prompts.
 * Handles loading states and disabled states automatically.
 */
interface EnhanceButtonProps {
  /** Callback fired when button is clicked */
  onClick: () => void
  /** Whether the button is in a loading state */
  isLoading?: boolean
  /** Whether the button is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

export function EnhanceButton({
  onClick,
  isLoading = false,
  disabled = false,
  className,
}: EnhanceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        //... Tailwind classes ...
        className,
      )}
    >
      {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
    </button>
  )
}
```

## 9. File Naming and Import Conventions

### File Naming

- Components: PascalCase (e.g., `EnhanceButton.tsx`)
- Utilities/Helpers: camelCase (e.g., `formatDate.ts`)
- Types: camelCase (e.g., `enhance.ts`)
- Constants: camelCase (e.g., `app.ts`)
- Test files: Match source file name with `.test.tsx` or `.test.ts`

### Import Order

Organize imports in the following order with blank lines between groups:

1. React and Next.js imports
2. Third-party library imports
3. Internal absolute imports (@/) types
4. Internal absolute imports (@/) components
5. Internal absolute imports (@/) libs utilities
6. Relative imports (./) (all except constants)
7. CSS/Style imports
8. Constant imports

### Example

```typescript
// React/Next.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'

// Third-party
import { z } from 'zod'

// Internal
import { cn } from '@/lib/utils'
import { EnhanceButton } from '@/components/enhance/EnhanceButton'
import type { EnhanceRequest } from '@/types/enhance'

// Relative
import { formatDate } from './utils'
```

### Path Aliases

- Use `@/` for all absolute imports from `src/`.
- Prefer absolute imports over relative imports for better maintainability.
- Use relative imports only for tightly coupled files in the same directory.

## 10. Copilot Behavior Rules

### Planning Requirement (IMPORTANT)

Before writing or modifying code for any feature, Copilot must:

1. Propose a clear implementation plan that includes:
   - Files to be created or updated
   - Data flow and component hierarchy
   - Whether Server or Client Components will be used and why
   - State management approach (local state, context, or server actions)
   - Error, loading, and empty-state handling
   - Performance and accessibility considerations
   - Testing strategy (unit, component, integration tests)

2. Wait for user approval before writing any code.

Plans must be **concise, structured, and actionable**. Do not generate code until the plan is approved.

### Core Principles

- Never change existing project structure unless explicitly asked.
- Never remove ESLint, TSConfig, or Tailwind config rules. Modify only if absolutely necessary and with justification.
- Always write clean, production-ready, modern code at Senior Frontend Developer level.
- Always follow best practices and industry standards.
- Always use the project's existing dependencies (don't add new ones without asking).
- Think about scalability, maintainability, and future extensibility.
- Consider performance implications of every implementation.
- Write code that other senior developers would approve in code review.

### Architectural Change Restrictions

Copilot must not modify the project's core architectural elements unless explicitly approved by the user.

This includes:

- Project structure and folder organization
- Routing structure within `src/app/**`
- Global providers and root layout (`layout.tsx`)
- Next.js configuration (`next.config.js`)
- TypeScript / ESLint / Prettier / Tailwind / Husky configuration files
- Shared utilities in `src/lib/**`
- Authentication or global state logic
- Base UI tokens, themes, or CSS resets

Refactoring or reorganizing existing code is only allowed when:

1. The user explicitly requests the change, and
2. Copilot presents a detailed plan and receives approval

If Copilot determines refactoring is beneficial, it must:

- Explain the justification clearly
- Propose a short, risk-assessed plan
- Wait for user confirmation before executing

### Code Generation Workflow

When user asks to "create X" or "implement Y", always:

1. **Analyze** - Review project structure and existing patterns.
2. **Plan** - Determine correct file locations and dependencies.
3. **Implement** - Write production-ready code following all rules.
4. **Test** - Create comprehensive tests for new functionality.
   - **MANDATORY**: Every new component/utility file MUST have a corresponding test file.
   - Test file must be created in the same task, not deferred.
5. **Validate** - Run linting, type checking, and tests after changes.
6. **Review** - Self-review code for quality, edge cases, and best practices.
7. **Document** - Add JSDoc comments and update relevant docs.

### Validation Requirements

If any code was generated without prior approved planning, stop and request planning approval.

**CRITICAL**: After making any code changes, you MUST run the following commands to ensure code quality:

```bash
# 1. Check for linting errors
npm run lint

# 2. Verify TypeScript compilation
npm run type-check

# 3. Run all tests
npm run test

# If any command fails, fix the issues before proceeding
```

**Never skip validation steps.** These checks ensure:

- Code follows project standards (ESLint)
- No TypeScript compilation errors (type-check)
- All existing functionality still works (tests)
- Changes don't introduce regressions

### Code Review Mindset

Before suggesting code, ask yourself:

- Is this production-ready?
- Would this pass a senior developer's code review?
- Does this handle all edge cases and errors?
- Is this accessible and performant?
- Is this secure and maintainable?
- Does this follow the project's patterns?
- Does it break any existing functionality?

## 11. Internationalization (i18n)

- Structure: TBD when implemented
- Use consistent key naming conventions
- Extract all user-facing strings
- Test with different languages/locales
