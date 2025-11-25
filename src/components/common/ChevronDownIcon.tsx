import { cn } from '@/lib/utils'

interface ChevronDownIconProps {
  /** Whether the icon should be rotated (pointing up) */
  isRotated?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Chevron down icon with smooth rotation animation.
 * Used for expand/collapse indicators.
 */
export default function ChevronDownIcon({ isRotated = false, className }: ChevronDownIconProps) {
  return (
    <svg
      className={cn(
        // Sizing
        'w-5',
        'h-5',
        // Colors
        'text-gray-400',
        // Transform with smooth animation
        'transition-transform',
        'duration-300',
        'ease-out',
        isRotated && 'rotate-180',
        className,
      )}
      aria-hidden="true"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
