import { cn } from '@/lib/utils'

interface FolderMoveIconProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Folder with arrow icon for move actions.
 * Used for moving prompts between collections.
 */
export default function FolderMoveIcon({ className }: FolderMoveIconProps) {
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
        strokeWidth={1.5}
        d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 10.5v6m0 0l2.25-2.25M12 16.5l-2.25-2.25"
      />
    </svg>
  )
}
