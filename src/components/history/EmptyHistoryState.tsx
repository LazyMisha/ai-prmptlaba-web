import { cn } from '@/lib/utils'

/**
 * Empty state component displayed when no history entries are found.
 */
export default function EmptyHistoryState() {
  return (
    <div
      className={cn(
        // Container
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        // Spacing
        'py-16',
        'px-4',
        // Border
        'border',
        'border-gray-200',
        'border-dashed',
        'rounded-lg',
      )}
    >
      <p
        className={cn(
          // Typography
          'text-lg',
          'font-light',
          'text-gray-500',
          'text-center',
          // Spacing
          'mb-2',
        )}
      >
        No prompt history yet
      </p>
      <p
        className={cn(
          // Typography
          'text-sm',
          'font-light',
          'text-gray-400',
          'text-center',
        )}
      >
        Your enhanced prompts will appear here
      </p>
    </div>
  )
}
