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
cp .env.local.example .env.local
```

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
├── app/                # Next.js app router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── error.tsx       # Error boundary
│   ├── loading.tsx     # Loading UI
│   └── not-found.tsx   # 404 page
├── components/         # React components
│   └── common/         # Shared components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── constants/          # App-wide constants
```

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

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm run build
```

Then deploy to Vercel with the Vercel CLI or by connecting your Git repository.

### Other Platforms

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## License

Private
