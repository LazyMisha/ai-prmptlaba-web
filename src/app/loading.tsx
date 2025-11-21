import { cn } from '@/lib/utils'

export default function Loading() {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'min-h-screen',
        'items-center',
        'justify-center',
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          // Size
          'h-8',
          'w-8',
          // Animation
          'animate-spin',
          // Shape
          'rounded-full',
          // Border
          'border-4',
          'border-gray-300',
          'border-t-blue-500',
        )}
        aria-hidden="true"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
