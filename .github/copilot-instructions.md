# AI Coding Instructions

## Project Overview

Production-grade Mextjs app built with Nextjs 16 (App Router) and Tailwind CSS
It uses OpenAI API to enhance user-provided AI prompts, making them more professional and effective
React 19+ with React Compiler is used for optimal performance

## Implementation Approach

- Break down requirements into logical steps
- Implement each step thoroughly
- Think step by step through the entire process

## Project Context & Architecture

- Always refer to `DESIGN.md` for page specifications, user flows
- Check `README.md` for authoritative project structure before implementing features

## Context7 MCP Usage

- Always use Context7 to get the latest documentation of used libraries

## Restrictions

- Do not change the code that you didn't ask to change
- Do not break existing functionality

## Validation Requirement

- After ANY code changes, run:

```bash
npm run lint && npm run type-check && npm run test
```

- If any of these checks fail, fix them

## General Coding Conventions

- All user-facing strings add to app/i18n/\*\* files
- Every new component/utility MUST have tests in `__tests__/`
- Create reusable components in `app/components/` folder in case of need, always use best practices and SOLID, DRY principles

## TypeScript

- Strict typing; avoid `any` unless absolutely necessary
- Use latest stable TypeScript features
- Define interfaces for all props and data structures

## React & Next.js

- Functional components only
- Server Components for data fetching; Client Components for interactivity
- Use `async/await` (not `.then()`)
- Use `next/image` for all images

## Error Handling

- Try-catch for async operations with logging
- User-friendly messages; never expose stack traces
- Handle all edge cases defensively
- Validate inputs on both client and server

## Security

- Sanitize all user inputs
- No `dangerouslySetInnerHTML` without sanitization
- Follow OWASP best practices

## App Styling

- Apple-like UI: Use backdrop-blur-md, high-contrast text on soft backgrounds, and rounded-2xl for borders. Borders should be subtle: border-black/[0.05]

- Use Apple-like clean and minimal design
- Consistent spacing, font sizes, and colors
- Responsive design for mobile and desktop

## TailwindCSS Rules

- Mobile-first mandatory
- Always use `cn()` from `@/lib/utils` for className merging
- Group classes with comments, example:

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

## Accessibility Requirements

- Always use Accessibility best practices
- Semantic HTML5 elements
- ARIA attributes where necessary

## Icons

- All icons in `app/components/icons/` as React components
- Check existing icons before adding new ones

## Testing Guidelines

- Test files in `__tests__/` folders adjacent to source
- Naming: `{SourceFile}.test.tsx` or `.test.ts`
- Use Jest and React Testing Library
- Avoid redundant tests; focus on critical paths

## Performance Targets

| Metric                  | Target               |
| ----------------------- | -------------------- |
| Lighthouse Score        | ≥ 90                 |
| First Contentful Paint  | < 1.5s               |
| Time to Interactive     | < 3.5s               |
| Cumulative Layout Shift | < 0.1                |
| Page Bundle Size        | < 200KB (compressed) |

## Performance Rules

- Server Components for data-heavy logic
- Dynamic imports for heavy components
- No new dependencies without approval
