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

## API Documentation

### POST /api/enhance

Enhances a user prompt based on the target platform or context using OpenAI's GPT-4o-mini model.

**Request Body:**

```json
{
  "target": "LinkedIn",
  "prompt": "write post about my promotion"
}
```

**Parameters:**

- `target` (string, required): Target platform or context. Supported values:
  - `LinkedIn` - Professional networking content
  - `Facebook` - Personal social networking content
  - `Development` - Software development prompts
  - `Copilot` - AI coding assistant prompts
  - `Midjourney` - AI image generation (Midjourney)
  - `DALL-E` - AI image generation (DALL-E)
  - `Sora` - AI video generation (Sora)
  - `Claude` - Claude AI assistant prompts
  - `General` - General-purpose enhancement
- `prompt` (string, required): The user's raw prompt text (3-2000 characters)

**Response (200 OK):**

```json
{
  "enhanced": "Craft a professional LinkedIn post announcing my recent promotion..."
}
```

**Error Responses:**

- `400 Bad Request` - Invalid or missing parameters
  ```json
  {
    "error": "Missing or invalid \"target\" field"
  }
  ```
- `500 Internal Server Error` - Server error or OpenAI API failure
  ```json
  {
    "error": "Internal server error",
    "retryable": true
  }
  ```

### Build the application and start the production server:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Make sure to set the `OPENAI_API_KEY` environment variable in your hosting platform.

## License

Private
