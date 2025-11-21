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

src/
├── app/ # Next.js app router pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── globals.css # Global styles with Tailwind imports
│ ├── error.tsx # Error boundary
│ ├── loading.tsx # Loading UI
│ ├── not-found.tsx # 404 page
│ ├── enhance/ # Enhance page route
│ ├── api/ # API routes
│ │ └── enhance/ # Prompt enhancement endpoint
│ └── **tests**/ # Page tests
├── components/ # React components
│ ├── common/ # Shared components
│ │ ├── Header.tsx # Site header with navigation (formerly Navbar)
│ │ ├── Footer.tsx # Site footer
│ │ └── **tests**/ # Component tests
│ └── enhance/ # Prompt enhancement UI components
├── lib/ # Utility functions
│ ├── openai.ts # OpenAI API client with retries
│ ├── utils.ts # cn() utility for className merging
│ ├── ai/ # AI-related utilities
│ ├── utils/ # General utilities
│ ├── api/ # API utilities
│ │ └── **tests**/ # API tests
│ └── **tests**/ # Lib tests
├── types/ # TypeScript type definitions
├── constants/ # App-wide constants
│ └── app.ts # App name and config
└── hooks/ # Custom React hooks (empty)

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

- Optimize for performance (React.memo, useMemo, useCallback when beneficial).
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
- Ensure sufficient color contrast.

### Security

- Sanitize all user inputs.
- Prevent XSS attacks (never use dangerouslySetInnerHTML without sanitization).
- Validate data on both client and server.
- Use environment variables for sensitive data.
- Follow OWASP security best practices.

## 5. Styling Rules

### TailwindCSS

- Use TailwindCSS utility classes for all styling.
- Avoid custom CSS unless absolutely necessary.
- Group related classes logically (layout, spacing, colors, typography).
- Use `cn()` utility from src/lib/utils.ts for conditional classNames.
- Add inline comments to explain complex class combinations.
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:) for responsive design.
- Leverage Tailwind's dark mode utilities when needed.

### Best Practices

- Keep className lists readable - break into logical groups with comments.
- Use semantic spacing (consistent margins and paddings).
- Follow mobile-first responsive design approach.
- Maintain consistent color palette using Tailwind's color system.
- Use Tailwind's built-in accessibility features.

### Example

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

### Structure

- Place all API routes under `src/app/api/<endpoint>/route.ts`.
- Use Next.js Route Handlers (GET, POST, PUT, DELETE, PATCH).
- Export named functions for each HTTP method.

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
  // Error: { error: string, details?: unknown }
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
- Use database connection pooling.
- Implement request timeouts.
- Consider pagination for large datasets.

### Example

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = schema.parse(body)

    // Process request
    const result = await processData(validated)

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      )
    }

    console.error('API error:', error)
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
- Test accessibility features.
- Don't test third-party library internals.

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

## 8. Component Conventions

### Organization

- Place all components in `src/components/`.
- Shared/reusable UI components go to `src/components/common/`.
- Feature-specific components go to `src/components/<feature>/`.
- One component per file (exception: tightly coupled sub-components).

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
- Event handlers: `handleEventName` (e.g., `handleClick`)
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
        'rounded-lg px-4 py-2',
        'bg-blue-600 text-white',
        'hover:bg-blue-700',
        'disabled:opacity-50 disabled:cursor-not-allowed',
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
6. Relative imports (./)
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

## 10. Copilot Behavior Ruless

### Core Principles

- Never create a new project from scratch.
- Never change existing project structure unless explicitly asked.
- Never remove or modify ESLint, TSConfig, or Tailwind config rules.
- Always write clean, production-ready, modern code at Senior Frontend Developer level.
- Always follow best practices and industry standards.
- Always use the project's existing dependencies (don't add new ones without asking).
- Think about scalability, maintainability, and future extensibility.
- Consider performance implications of every implementation.
- Write code that other senior developers would approve in code review.

### Code Generation Workflow

When user asks to "create X" or "implement Y", always:

1. **Analyze** - Review project structure and existing patterns.
2. **Plan** - Determine correct file locations and dependencies.
3. **Implement** - Write production-ready code following all rules.
4. **Test** - Create comprehensive tests for new functionality.
5. **Validate** - Run linting, type checking, and tests after changes:
   - `npm run lint` - Check for ESLint errors
   - `npm run type-check` - Verify TypeScript types
   - `npm run test` - Run all tests
6. **Document** - Add JSDoc comments and update relevant docs.

### Validation Requirements

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

## 11. Git and Commit Conventions

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(enhance): add prompt validation with character limits
fix(api): handle timeout errors in OpenAI requests
docs(readme): update installation instructions
refactor(components): extract shared button logic to hook
test(enhance): add unit tests for prompt enhancer
```

### Best Practices

- Write clear, descriptive commit messages.
- Keep commits atomic (one logical change per commit).
- Don't commit commented-out code.
- Don't commit console.logs or debugging code.
- Ensure all tests pass before committing.
- Run linters before committing (handled by Husky).
- **Always run validation commands after changes** (lint, type-check, test).
