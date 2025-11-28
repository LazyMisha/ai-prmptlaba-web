import { cn } from '@/lib/utils'

/**
 * Empty state component displayed when no history entries are found.
 * Features subtle visual styling with centered content.
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
        'py-20',
        'px-6',
        // Border
        'border',
        'border-dashed',
        'border-black/[0.12]',
        'rounded-2xl',
        // Background
        'bg-[#f5f5f7]/50',
      )}
    >
      <p
        className={cn(
          // Typography
          'text-lg',
          'font-medium',
          'text-[#1d1d1f]',
          'text-center',
          'tracking-tight',
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
          'font-normal',
          'text-[#86868b]',
          'text-center',
          'tracking-tight',
        )}
      >
        Your enhanced prompts will appear here
      </p>
    </div>
  )
}
