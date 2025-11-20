# AI Prompt Laba

Professional prompt creation and management tool built with Next.js 16, React 19, and TypeScript.

## Features

- ⚡ Next.js 16 with App Router
- ⚛️ React 19 with React Compiler
- 📘 TypeScript with strict mode
- 🎨 Tailwind CSS 4
- 🧪 Jest + React Testing Library
- 🔍 ESLint + Prettier
- 🐶 Husky + lint-staged for pre-commit hooks
- 🔒 Security headers configured
- 🌙 Dark mode ready
- 🤖 OpenAI-powered prompt enhancement
- 💾 In-memory caching built-in

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-prmptlaba-web
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-...your-actual-key-here...
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles with Tailwind imports
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading UI
│   ├── not-found.tsx       # 404 page
│   ├── enhance/            # Enhance page route
│   │   └── page.tsx        # Prompt enhancement UI page
│   ├── api/                # API routes
│   │   └── enhance/        # Prompt enhancement endpoint
│   │       └── route.ts    # POST /api/enhance handler
│   └── __tests__/          # Page tests
├── components/             # React components
│   ├── common/             # Shared components
│   │   ├── Header.tsx      # Site header with navigation (formerly Navbar)
│   │   ├── Footer.tsx      # Site footer
│   │   └── __tests__/      # Component tests
│   └── enhance/            # Prompt enhancement UI components
│       ├── EnhanceForm.tsx     # Main form orchestrator
│       ├── TargetSelector.tsx  # Platform dropdown selector
│       ├── PromptInput.tsx     # Textarea with validation
│       ├── EnhanceButton.tsx   # Submit button with loading
│       └── EnhancedResult.tsx  # Result display with copy
├── lib/                    # Utility functions
│   ├── openai.ts           # OpenAI API client with retries
│   ├── utils.ts            # cn() utility for className merging
│   ├── ai/                 # AI-related utilities
│   │   ├── prompt-enhancer.ts  # Core enhancement logic
│   │   └── __tests__/          # Enhancement tests
│   ├── utils/              # General utilities
│   │   └── cache.ts        # TTL cache implementation
│   ├── api/                # API utilities
│   │   └── __tests__/      # API tests
│   └── __tests__/          # Lib tests
├── types/                  # TypeScript type definitions
│   └── enhance.ts          # Enhancement types
├── constants/              # App-wide constants
│   └── app.ts              # App name and config
└── hooks/                  # Custom React hooks (empty)
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

**Features:**

- ✅ Input validation (length limits, type checking)
- ✅ Automatic caching (12 hours TTL)
- ✅ Automatic retries on transient errors (5xx, network issues)
- ✅ Request timeout (30 seconds)
- ✅ Platform-specific prompt optimization

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "target": "LinkedIn",
    "prompt": "write post about my promotion"
  }'
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Configuration (Required)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...your-actual-key-here...
```

**Important:** Never commit your `.env.local` file to version control. It's already in `.gitignore`.

## Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** with strict mode enabled
- **Husky** for pre-commit hooks
- **lint-staged** for running linters on staged files

All commits are automatically checked for code quality.

## Testing

Run tests with:

```bash
npm run test
```

Tests are configured with Jest and React Testing Library. Place test files next to the components they test with `.test.tsx` or `.spec.tsx` extension.

## Deployment

### Production Considerations

**⚠️ Important for Production Scaling:**

The current implementation uses **in-memory caching**, which is suitable for single-instance deployments but has limitations:

1. **Cache is not distributed** - Each server instance maintains its own cache
2. **Cache is lost on restart** - Cached data doesn't persist between deployments

**For production at scale, replace with:**

- **Redis** for distributed caching with TTL
- Or use managed services like:
  - Vercel Edge Config for caching
  - Upstash Redis for distributed caching
  - CloudFlare Workers KV

**Note:** Rate limiting can be added later as needed based on your requirements.

The code includes `TODO` comments indicating where to implement Redis-based caching.

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Add the `OPENAI_API_KEY` environment variable in Vercel settings
4. Deploy

Or use the Vercel CLI:

```bash
npm run build
vercel
```

### Other Platforms

Build the application:

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
