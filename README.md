# AI Prompt Laba

Professional prompt creation and management tool built with Next.js 16, React 19, and TypeScript.

### Set up environment variables:

Edit `.env.local` and add OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-...your-actual-key-here...
```

## Project Structure

```
.husky/                         # Husky git hooks
|--- pre-commit                 # Pre-commit hook to run linters

public/                         # Static assets

src/
├── app/                        # Next.js app router pages
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles with Tailwind imports
│   ├── error.tsx               # Error boundary
│   ├── loading.tsx             # Loading UI
│   ├── not-found.tsx           # 404 page
│   ├── [lang]/                 # Dynamic locale segment (i18n)
│   │   ├── layout.tsx          # Locale layout with providers, validate locale and return 404 if invalid
│   │   ├── (home)/             # Home route group
│   │   │   ├── layout.tsx      # Home layout
│   │   │   └── page.tsx        # Home page
│   │   └── (inner)/            # Inner pages route group
│   │       ├── enhance/        # Prompt enhancement page
│   │       │   ├── layout.tsx  # Pass page specific title to the Header
│   │       │   └── page.tsx
│   │       ├── history/        # Prompt history page
│   │       │   ├── layout.tsx  # Pass page specific title to the Header
│   │       │   └── page.tsx
│   │       └── saved/          # Saved prompts page
│   │           ├── layout.tsx  # Pass page specific title to the Header
│   │           └── page.tsx
│   └── api/                    # API routes
│       └── enhance/            # Prompt enhancement endpoint
│           └── route.ts        # POST /api/enhance handler
├── components/                 # React components
│   ├── common/                 # Shared/reusable UI components
│   │   └── __tests__/          # Component tests
│   ├── enhance/                # Prompt enhancement UI components
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
│       ├── pl.json             # Polish translations
│       └── uk.json             # Ukrainian translations
├── lib/                        # Utility functions
│   ├── openai.ts               # OpenAI API client with retries
│   ├── utils.ts                # cn() utility for className merging
│   ├── ai/                     # AI-related utilities
│   │   ├── prompt-enhancer.ts  # Core enhancement logic
│   │   └── __tests__/          # Enhancement tests
│   ├── db/                     # Database utilities
│   │   ├── prompt-history.ts   # Prompt history storage
│   │   ├── saved-prompts.ts    # Saved prompts storage
│   │   └── __tests__/          # Database tests
│   ├── utils/                  # General utilities
│   │   └── cache.ts            # Time To Live (TTL) cache implementation
│   └── __tests__/              # Lib tests
├── types/                      # TypeScript type definitions
│   ├── enhance.ts              # Enhancement types
│   ├── history.ts              # History types
│   └── saved-prompts.ts        # Saved prompts types
└── proxy.ts                    # Proxy configuration

.prettierc                      # Prettier configuration
.eslint.config.mjs               # ESLint configuration
jest.config.ts                   # Jest configuration
jest.setup.ts                   # Jest setup file
next.config.js                   # Next.js configuration
package.json                    # npm package configuration
postcss.config.js                # PostCSS configuration
tsconfig.json                    # TypeScript configuration
```

## License

Private
