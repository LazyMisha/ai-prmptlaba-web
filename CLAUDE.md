# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` – Start the Next.js dev server
- `npm run build` – Production build
- `npm run lint` – Run ESLint (`npm run lint:fix` to auto-fix)
- `npm run type-check` – TypeScript check with `tsc --noEmit`
- `npm test` – Run Jest tests (`npm run test:watch` for watch mode)
- `npm run format` – Run Prettier on the entire codebase

### Post-change validation

After any code changes, run:

```bash
npm run lint && npm run type-check && npm run test
```

If any of these checks fail, fix them before finishing.

### Running a single test

Jest is configured with `next/jest`. To run a single test file:

```bash
npx jest src/components/common/__tests__/Button.test.tsx
```

## Documentation & Research Policy

Before making architectural changes, renaming files, or adopting new framework conventions, **always verify against the official documentation** rather than relying on memory or assumption. If Context7 MCP is available, query it for up-to-date framework docs before implementing changes. This project runs on rapidly evolving versions (Next.js 16, React 19, Tailwind v4) where conventions shift between releases.

## Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router), React 19.2, TypeScript 5 (strict)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`
- **Compiler:** React Compiler enabled (`babel-plugin-react-compiler`)
- **AI:** OpenAI SDK (`gpt-4o-mini`), with `gpt-tokenizer` for client-side token counting
- **Storage:** Client-side IndexedDB only (no server DB). Stores `prompt-history`, `collections`, and `saved-prompts`
- **State:** Local React state (`useState`/`useRef`); no external state library
- **i18n:** Custom lightweight system supporting `en` and `uk`

### Routing & i18n

- App Router uses a dynamic locale segment: `src/app/[lang]/`
- Route groups separate pages:
  - `(home)` – Landing page
  - `(inner)` – App pages: `enhance`, `history`, `saved`
- Locale validation happens in `src/app/[lang]/layout.tsx` via `hasLocale(lang)`; invalid locales return `notFound()`
- The root `layout.tsx` is a minimal pass-through; `html`/`body` elements live in the `[lang]/layout.tsx`

### i18n Data Flow

- **Server Components** load translations with `getDictionary(locale)` from `@/i18n/dictionaries` (uses `server-only`)
- The `[lang]/layout.tsx` loads the dictionary server-side and passes it to `I18nProvider`
- **Client Components** import hooks from `@/i18n/client`:
  - `useTranslations()` – returns the full dictionary
  - `useLocale()` – returns current locale string
- Dictionaries are in `src/i18n/dictionaries/{en,uk}.json` and typed via the `Dictionary` interface

### API

- There is a single API route: `POST /api/enhance` at `src/app/api/enhance/route.ts`
- Accepts `{ target: string, prompt: string }` and returns `{ enhanced: string }`
- 30-second timeout via `AbortController`
- OpenAI calls live in `src/lib/ai/prompt-enhancer.ts` with retry logic in `src/lib/openai.ts`
- Server-side prompt enhancement results are cached in-memory with a 12-hour TTL (`src/lib/utils/cache.ts`)

## Code Conventions

### Styling

- Apple-like minimal UI: `backdrop-blur-md`, `rounded-2xl`, subtle borders (`border-black/[0.05]`)
- Always use `cn()` from `@/lib/utils` for className merging
- Group Tailwind classes with comments:

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

### Components

- Server Components by default; mark interactive components with `'use client'`
- Functional components only; use `async/await`, never `.then()`
- Feature-based organization under `src/components/`: `common/`, `enhance/`, `history/`, `saved/`, `icons/`
- Icons are custom SVG React components in `src/components/icons/`
- All user-facing strings must come from the i18n dictionary (not hardcoded)

### TypeScript

- Strict mode with `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- Avoid `any`; define interfaces for all props and data structures
- Path alias: `@/*` maps to `src/*`

### Prettier config

- `semi: false`, `singleQuote: true`, `trailingComma: all`, `arrowParens: always`, `printWidth: 80`
- Enforced via `eslint-plugin-prettier` (`prettier/prettier: error`)

### Testing

- Tests live in `__tests__/` folders adjacent to source, or as `*.test.{ts,tsx}`
- `jest.setup.js` mocks `@/i18n/client` to return English translations by default and mocks `next/navigation` `usePathname` to `/en`
- Polyfills `TextDecoder`/`TextEncoder` for `gpt-tokenizer`

## Key Files

- `src/proxy.ts` – Locale detection and redirect (cookie → Accept-Language → default `en`). Renamed from `middleware.ts` in Next.js 16 (see codemod `npx @next/codemod@latest middleware-to-proxy .`)
- `src/app/[lang]/layout.tsx` – Locale layout, dictionary loading, `I18nProvider`
- `src/i18n/client.tsx` – Client i18n context and hooks
- `src/i18n/dictionaries.ts` – Server-only dictionary loader
- `src/lib/utils.ts` – `cn()` helper
- `src/lib/openai.ts` – OpenAI client with retries and custom `OpenAIError`
- `src/lib/ai/prompt-enhancer.ts` – Core enhancement logic and caching
- `src/lib/db/` – IndexedDB wrappers for history, saved prompts, and collections
- `next.config.ts` – Security headers, `removeConsole` in production, `optimizePackageImports`
- `DESIGN.md` – Page specifications and user flows
- `README.md` – Project structure overview
