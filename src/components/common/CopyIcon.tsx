import { cn } from '@/lib/utils'

interface CopyIconProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Copy icon for clipboard actions.
 * Used for copy to clipboard buttons.
 */
export default function CopyIcon({ className }: CopyIconProps) {
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
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}
