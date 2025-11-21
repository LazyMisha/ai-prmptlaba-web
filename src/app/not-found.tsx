import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'min-h-screen',
        'items-center',
        'justify-center',
      )}
      role="main"
    >
      <div className={cn('text-center')}>
        <h1 className={cn('mb-2', 'text-4xl', 'font-bold')}>404</h1>
        <p className={cn('mb-4', 'text-gray-600')}>Page not found</p>
        <Link
          href="/"
          className={cn(
            // Shape
            'rounded',
            // Colors
            'bg-blue-500',
            'text-white',
            // Spacing
            'px-4',
            'py-2',
            // Hover
            'hover:bg-blue-600',
            // Focus
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
          )}
          aria-label="Go back to home page"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
