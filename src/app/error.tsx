'use client'

import { cn } from '@/lib/utils'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'min-h-screen',
        'items-center',
        'justify-center',
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={cn('text-center')}>
        <h2 className={cn('mb-4', 'text-2xl', 'font-bold')}>
          Something went wrong
        </h2>
        <button
          onClick={reset}
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
          aria-label="Try again to reload the page"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
