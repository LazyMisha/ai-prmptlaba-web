import { cn } from '@/lib/utils'

interface SelectorIconProps {
  /** Additional CSS classes for styling */
  className?: string
}

/**
 * A double-arrow selector icon (↕) indicating a dropdown/select input.
 * Better suited for native select elements than a chevron, as it doesn't
 * imply a rotational state change.
 */
export default function SelectorIcon({ className }: SelectorIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
      aria-hidden="true"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  )
}
