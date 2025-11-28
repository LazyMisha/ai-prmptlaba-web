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
 * Label-value pair component for history items.
 * Features consistent spacing and refined typography.
 */
export default function HistoryLabel({
  label,
  value,
  valueColor = 'text-[#1d1d1f]',
  truncate = true,
  showBorder = false,
}: HistoryLabelProps) {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'items-baseline',
        // Spacing
        'gap-3',
        'py-1.5',
        // Sizing
        'w-full',
        // Border
        showBorder && ['border-t', 'border-black/[0.06]', 'pt-3', 'mt-2'],
      )}
    >
      <span
        className={cn(
          // Typography
          'text-xs',
          'font-medium',
          'text-[#86868b]',
          'uppercase',
          'tracking-wide',
          // Sizing
          'flex-shrink-0',
          'w-20',
          // Align
          'text-left',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          // Typography
          'text-sm',
          'font-normal',
          'leading-relaxed',
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
