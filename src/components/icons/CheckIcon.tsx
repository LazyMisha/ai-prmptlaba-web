import { cn } from '@/lib/utils'

interface CheckIconProps {
  /** Additional CSS classes */
  className?: string
  /** Stroke width for the checkmark */
  strokeWidth?: number
}

/**
 * Checkmark icon for success states and confirmations.
 * Used for success indicators and completed actions.
 */
export default function CheckIcon({ className, strokeWidth = 2 }: CheckIconProps) {
  return (
    <svg
      className={cn(
        // Sizing
        'w-4',
        'h-4',
        className,
      )}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
