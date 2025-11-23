import Link from 'next/link'
import { APP_NAME } from '@/constants/app'
import { cn } from '@/lib/utils'

export default function Header() {
  return (
    <header
      className={cn(
        // Sticky position
        'sticky',
        // Position at top
        'top-0',
        // Full width
        'w-full',
        // Add padding
        'p-4',
        // Background color
        'bg-gray-100',
        // Z-index to stay above content
        'z-10',
      )}
      role="banner"
    >
      <nav
        className={cn(
          // Flexbox
          'flex',
          // Justify between
          'justify-between',
          // Items center
          'items-center',
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          className={cn(
            // Typography
            'text-xl',
            'font-light',
            'tracking-tight',
            'text-gray-600',
            // Rendering
            'antialiased',
            // Focus styles
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'rounded',
            'px-2',
            'py-1',
          )}
          href="/"
          aria-label="Go to home page"
        >
          {APP_NAME}
        </Link>
        <Link
          className={cn(
            // Typography
            'text-lg',
            'font-light',
            'tracking-tight',
            'text-gray-600',
            // Rendering
            'antialiased',
            // Focus styles
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'rounded',
            'px-2',
            'py-1',
          )}
          href="/enhance"
          aria-label="Go to prompt enhancer page"
        >
          Enhance Prompt
        </Link>
      </nav>
    </header>
  )
}
