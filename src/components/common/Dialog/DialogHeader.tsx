'use client'

import { cn } from '@/lib/utils'
import CloseIcon from '@/components/icons/CloseIcon'

interface DialogHeaderProps {
  /** Title text to display in the header */
  title: string
  /** Callback when close button is clicked */
  onClose: () => void
  /** Optional ID for the title element (for aria-labelledby) */
  titleId?: string
  /** Optional aria-label for the close button */
  closeLabel?: string
}

/**
 * Reusable dialog header with title and close button.
 * Follows Apple-inspired design system with consistent styling.
 */
export default function DialogHeader({
  title,
  onClose,
  titleId,
  closeLabel = 'Close',
}: DialogHeaderProps) {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'items-center',
        'justify-between',
        // Spacing
        'px-6',
        'min-h-[50px]',
        // Border
        'border-b',
        'border-gray-100',
      )}
    >
      <h2
        id={titleId}
        className={cn(
          // Typography
          'text-lg',
          'font-semibold',
          // Colors
          'text-gray-900',
        )}
      >
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className={cn(
          // Spacing
          'p-2',
          '-mr-2',
          // Shape
          'rounded-full',
          // Colors
          'text-gray-400',
          'hover:text-gray-600',
          'hover:bg-gray-100',
          // Effects
          'transition-colors',
          // Focus
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
        )}
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
