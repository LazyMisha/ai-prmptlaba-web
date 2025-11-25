import { cn } from '@/lib/utils'

interface HistoryLabelProps {
  label: string
  value: string
  /** Optional custom color for value text */
  valueColor?: string
  /** Whether to truncate value to single line with ellipsis */
  truncate?: boolean
  /** Whether to show a top border (for expanded sections) */
  showBorder?: boolean
}

/**
 * Reusable label-value pair component for history items.
 * Labels have consistent width for vertical alignment.
 */
export default function HistoryLabel({
  label,
  value,
  valueColor = 'text-gray-700',
  truncate = true,
  showBorder = false,
}: HistoryLabelProps) {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'items-center',
        // Spacing
        'gap-2',
        // Sizing
        'w-full',
        // Border
        showBorder ? ['border-t', 'border-gray-200'] : ['border-t', 'border-transparent'],
      )}
    >
      <span
        className={cn(
          // Typography
          'text-xs',
          'font-light',
          'text-gray-500',
          'uppercase',
          'tracking-wide',
          // Sizing
          'flex-shrink-0',
          'w-20',
          // Align
          'text-left',
        )}
      >
        {label}:
      </span>
      <span
        className={cn(
          // Typography
          'text-sm',
          'font-light',
          valueColor,
          // Truncate or wrap
          truncate ? 'truncate' : 'break-words',
          // Align
          'text-left',
        )}
      >
        {value}
      </span>
    </div>
  )
}
