'use client'

import { cn } from '@/lib/utils'

export interface EnhanceButtonProps {
  /** Callback fired when button is clicked */
  onClick: () => void
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is in a loading state */
  isLoading?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Button to trigger prompt enhancement.
 * Handles loading states and disabled states with full accessibility support.
 */
export default function EnhanceButton({
  onClick,
  disabled,
  isLoading,
  className,
}: EnhanceButtonProps) {
  return (
    <button
      className={cn(
        // Background color
        'bg-blue-600',
        // Text color
        'text-white',
        // Padding
        'px-4',
        'py-2',
        // Margin
        'mt-4',
        // Border radius
        'rounded',
        // Hover effect
        'hover:bg-blue-700',
        // Focus styles for keyboard navigation
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500',
        'focus:ring-offset-2',
        // Disabled state
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
        // Custom classes
        className,
      )}
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={
        isLoading
          ? 'Enhancing prompt, please wait'
          : disabled
            ? 'Enhance prompt (currently disabled)'
            : 'Enhance prompt'
      }
    >
      {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
    </button>
  )
}
