'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import SpinnerIcon from '@/components/icons/SpinnerIcon'

/**
 * Common props shared between button and link variants.
 */
interface BaseButtonProps {
  /** Button content */
  children: React.ReactNode
  /** Whether the button/link is disabled */
  disabled?: boolean
  /** Whether the button is in a loading state */
  isLoading?: boolean
  /** Optional icon to display before text */
  icon?: React.ReactNode
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Props for Button component when rendered as a link.
 */
interface LinkButtonProps extends BaseButtonProps {
  /** Link href (renders as Next.js Link) */
  href: string
  /** Not available for links */
  onClick?: never
  /** Not available for links */
  type?: never
}

/**
 * Props for Button component when rendered as a button.
 */
interface ActionButtonProps extends BaseButtonProps {
  /** Not available for buttons */
  href?: never
  /** Click handler */
  onClick?: () => void
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Props for the Button component.
 * Discriminated union ensures type safety based on whether href is provided.
 */
type ButtonProps = LinkButtonProps | ActionButtonProps

/**
 * Reusable button component with Apple-inspired styling.
 * Can render as a button or Next.js Link based on props.
 * Used throughout the application for consistent button design.
 */
export function Button({
  children,
  onClick,
  href,
  type = 'button',
  disabled = false,
  isLoading = false,
  icon,
  ariaLabel,
  className,
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  const baseClasses = cn(
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
    isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    // Custom classes
    className,
  )

  const content = (
    <>
      {isLoading ? <SpinnerIcon className="w-5 h-5" /> : icon}
      <span>{children}</span>
    </>
  )

  // Render as Link for navigation
  if (href) {
    return (
      <Link href={href} className={baseClasses} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  // Render as button for actions
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      className={baseClasses}
    >
      {content}
    </button>
  )
}
