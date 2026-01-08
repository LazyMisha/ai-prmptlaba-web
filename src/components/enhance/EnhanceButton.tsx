'use client'

import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import SpinnerIcon from '@/components/icons/SpinnerIcon'

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
  const dict = useTranslations()
  const t = dict.enhance.form
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={
        isLoading
          ? t.enhancingAriaLabel
          : disabled
            ? t.enhanceDisabledAriaLabel
            : t.ariaLabel
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
        {isLoading && <SpinnerIcon className="h-4 w-4" />}
        {isLoading ? t.enhancing : t.enhanceButton}
      </span>
    </button>
  )
}
