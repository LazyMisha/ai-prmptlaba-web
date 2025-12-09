import { cn } from '@/lib/utils'

interface BookmarkIconProps {
  /** Additional CSS classes */
  className?: string
  /** Whether the bookmark is filled (saved state) */
  filled?: boolean
  /** Stroke width for the icon */
  strokeWidth?: number
}

/**
 * Bookmark icon component for save/bookmark actions.
 * Supports filled and outline variants.
 */
export default function BookmarkIcon({
  className,
  filled = false,
  strokeWidth = 1.5,
}: BookmarkIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={cn('w-5 h-5', className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      />
    </svg>
  )
}
