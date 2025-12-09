import { cn } from '@/lib/utils'

interface CloseIconProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Close (X) icon for dismiss actions.
 * Used for closing modals, errors, and notifications.
 */
export default function CloseIcon({ className }: CloseIconProps) {
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
