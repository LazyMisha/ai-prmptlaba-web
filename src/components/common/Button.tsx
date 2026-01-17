'use client'

import { cn } from '@/lib/utils'

/**
 * Props for the Button component.
 */
interface ButtonProps {
  /** Button content */
  children: React.ReactNode
  /** Click handler */
  onClick?: () => void
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
  /** Whether the button is disabled */
  disabled?: boolean
  /** Optional icon to display before text */
  icon?: React.ReactNode
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Reusable button component with Apple-inspired styling.
 * Used throughout the application for consistent button design.
 */
export function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon,
  ariaLabel,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        // Layout
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        // Spacing
        'px-6',
        'py-3',
        // Size
        'min-h-[50px]',
        // Background
        'bg-[#007aff]',
        'text-white',
        // Border
        'rounded-2xl',
        // Hover
        'hover:bg-[#0071e3]',
        'active:opacity-80',
        'active:scale-[0.98]',
        // Transition
        'transition-all',
        'duration-200',
        // Typography
        'text-[17px]',
        'font-semibold',
        // Focus
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
        'focus-visible:ring-offset-2',
        // Disabled
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        // Custom classes
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}
