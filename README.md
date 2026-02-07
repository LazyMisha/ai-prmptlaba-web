# Project Architect

## File Structure

### Environment variables:

Edit `.env.local` and add OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-...your-actual-key-here...
```

### Project Structure

```
.husky/                         # Husky git hooks
|--- pre-commit                 # Pre-commit hook to run linters

public/                         # Static assets

src/
├── app/                        # Next.js app router pages
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles with Tailwind imports
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── [lang]/                 # Dynamic locale segment (i18n)
│   │   ├── layout.tsx          # Locale layout with providers, validate locale and return 404 if invalid
│   │   ├── loading.tsx         # Loading state for locale layout
│   │   ├── (home)/             # Home route group
│   │   │   ├── layout.tsx      # Home layout
│   │   │   └── page.tsx        # Home page
│   │   └── (inner)/            # Inner pages route group
│   │       ├── enhance/        # Enhance route
│   │       │   ├── layout.tsx  # Pass page specific title to the Header
│   │       │   └── page.tsx    # Enhance page
│   │       ├── history/        # History route
│   │       │   ├── layout.tsx  # Pass page specific title to the Header
│   │       │   └── page.tsx    # History page
│   │       └── saved/          # Saved prompts route
│   │           ├── layout.tsx  # Pass page specific title to the Header
│   │           └── page.tsx    # Saved prompts page
│   └── api/                    # API routes
│       └── enhance/            # Enhance API route
│           └── route.ts        # API route for prompt enhancement
├── components/                 # React components
│   ├── common/                 # Shared/reusable UI components
│   │   └── __tests__/          # Component tests
│   ├── enhance/                # Enhance page UI components
│   │   └── __tests__/          # Component tests
│   ├── history/                # History page components
│   │   └── __tests__/          # Component tests
│   ├── icons/                  # Reusable SVG icon components
│   │   └── __tests__/          # Icon component tests
│   └── saved/                  # Saved prompts page components
│       └── __tests__/          # Component tests
├── constants/                  # App-wide constants
│   ├── app.ts                  # App name and config
│   ├── db.ts                   # Database constants
│   ├── history.ts              # History constants
│   ├── saved-prompts.ts        # Saved prompts constants
│   └── tool-categories.ts      # Tool category definitions
├── hooks/                      # Custom React hooks
│   └── __tests__/              # Hook tests
├── i18n/                       # Internationalization
│   ├── index.ts                # i18n exports, types. Client and server setup
│   ├── locales.ts              # Locale configuration
│   ├── dictionaries.ts         # Dictionary loader
│   └── dictionaries/           # Translation files
│       ├── en.json             # English translations
│       └── uk.json             # Ukrainian translations
├── lib/                        # Utility functions
│   ├── openai.ts               # OpenAI API client with retries
│   ├── utils.ts                # General utilities
│   ├── ai/                     # AI-related utilities
│   │   ├── prompt-enhancer.ts  # Core enhancement logic, OpenAI API calls
│   │   └── __tests__/          # Enhancement tests
│   ├── db/                     # Database utilities
│   │   ├── prompt-history.ts   # Prompt history storage
│   │   ├── saved-prompts.ts    # Saved prompts storage
│   │   └── __tests__/          # Database tests
│   ├── utils/                  # General utilities
│   │   └── cache.ts            # Time To Live (TTL) cache implementation
│   └── __tests__/              # Lib tests
├── types/                      # TypeScript type definitions
└── proxy.ts                    # Next.js proxy configuration

.prettierc                      # Prettier configuration
.eslint.config.mjs               # ESLint configuration
jest.config.ts                   # Jest configuration
jest.setup.ts                   # Jest setup file
next.config.js                   # Next.js configuration
package.json                    # npm package configuration
postcss.config.js                # PostCSS configuration
tsconfig.json                    # TypeScript configuration
```
