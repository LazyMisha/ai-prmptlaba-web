'use client'

import { cn } from '@/lib/utils'

type IconTextButtonVariant = 'default' | 'destructive' | 'success' | 'primary'

interface IconTextButtonProps {
  /** Button label text */
  label: string
  /** Icon component to render before the label */
  icon: React.ReactNode
  /** Click handler */
  onClick: (e: React.MouseEvent) => void
  /** Visual variant */
  variant?: IconTextButtonVariant
  /** Whether the button is disabled */
  disabled?: boolean
  /** Accessible label (defaults to label prop) */
  ariaLabel?: string
  /** Additional CSS classes */
  className?: string
}

const variantStyles: Record<IconTextButtonVariant, { base: string; hover: string; focus: string }> =
  {
    default: {
      base: 'text-[#86868b]',
      hover: 'hover:text-[#007aff]',
      focus: 'focus-visible:ring-[#007aff]',
    },
    destructive: {
      base: 'text-[#86868b]',
      hover: 'hover:text-[#ff3b30]',
      focus: 'focus-visible:ring-[#ff3b30]',
    },
    success: {
      base: 'text-[#34c759]',
      hover: 'hover:text-[#34c759]',
      focus: 'focus-visible:ring-[#34c759]',
    },
    primary: {
      base: 'text-[#007aff]',
      hover: 'hover:text-[#007aff]',
      focus: 'focus-visible:ring-[#007aff]',
    },
  }

/**
 * Reusable button with icon and text label.
 * Used for action buttons like Copy, Move, Delete.
 */
export default function IconTextButton({
  label,
  icon,
  onClick,
  variant = 'default',
  disabled = false,
  ariaLabel,
  className,
}: IconTextButtonProps) {
  const styles = variantStyles[variant]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={cn(
        // Layout
        'flex',
        'items-center',
        'gap-1.5',
        // Typography
        'text-xs',
        'font-medium',
        // Spacing
        'px-1.5',
        'lg:px-3',
        'py-1.5',
        // Border
        'rounded-lg',
        // Transition
        'transition-colors',
        'duration-200',
        // Focus
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-offset-2',
        // Disabled
        disabled && 'cursor-default',
        // Variant styles
        styles.base,
        !disabled && styles.hover,
        styles.focus,
        // Custom classes
        className,
      )}
    >
      {icon}
      {label}
    </button>
  )
}
