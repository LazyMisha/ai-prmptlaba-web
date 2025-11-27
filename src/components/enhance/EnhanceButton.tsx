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
 * Primary action button for triggering prompt enhancement.
 */
export default function EnhanceButton({
  onClick,
  disabled,
  isLoading,
  className,
}: EnhanceButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={
        isLoading
          ? 'Enhancing prompt, please wait'
          : disabled
            ? 'Enhance prompt (currently disabled)'
            : 'Enhance prompt'
      }
      className={cn(
        // Sizing
        'w-full',
        // Spacing
        'px-6',
        'py-3',
        'mt-2',
        // Typography
        'text-base',
        'font-medium',
        'text-white',
        // Background - gradient for depth
        'bg-gradient-to-b',
        'from-blue-500',
        'to-blue-600',
        // Border
        'border',
        'border-blue-600',
        'rounded-xl',
        // Shadow - subtle depth
        'shadow-sm',
        'shadow-blue-500/25',
        // Transition
        'transition-all',
        'duration-200',
        // Focus
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-blue-500/50',
        'focus-visible:ring-offset-2',
        // Hover - lift effect
        !isDisabled && 'hover:from-blue-600',
        !isDisabled && 'hover:to-blue-700',
        !isDisabled && 'hover:shadow-md',
        !isDisabled && 'hover:shadow-blue-500/30',
        // Active - press effect
        !isDisabled && 'active:from-blue-700',
        !isDisabled && 'active:to-blue-800',
        !isDisabled && 'active:shadow-sm',
        !isDisabled && 'active:scale-[0.98]',
        // Disabled state
        isDisabled && 'opacity-50',
        isDisabled && 'cursor-not-allowed',
        // Custom classes
        className,
      )}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
      </span>
    </button>
  )
}
