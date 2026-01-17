import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /** Icon component to display */
  icon: ReactNode
  /** Main heading text */
  title: string
  /** Secondary description text */
  description: string
  /** CTA button text */
  ctaText: string
  /** CTA button link */
  ctaHref: string
  /** Additional CSS classes */
  className?: string
}

/**
 * EmptyState is a reusable component for displaying empty states across the app.
 * Features with centered content, icon, and CTA button.
 */
export function EmptyState({
  icon,
  title,
  description,
  ctaText,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        // Layout
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        // Spacing
        'py-16',
        'px-4',
        'md:py-24',
        // Text
        'text-center',
        className,
      )}
    >
      {/* Large Icon Container */}
      <div
        className={cn(
          // Layout
          'flex',
          'items-center',
          'justify-center',
          // Size
          'w-20',
          'h-20',
          'md:w-24',
          'md:h-24',
          // Colors
          'bg-[#f5f5f7]',
          // Effects
          'rounded-full',
          // Spacing
          'mb-6',
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      {/* Heading */}
      <h2
        className={cn(
          // Typography
          'text-xl',
          'md:text-2xl',
          'font-semibold',
          'tracking-[-0.01em]',
          // Color
          'text-[#1d1d1f]',
          // Spacing
          'mb-2',
        )}
      >
        {title}
      </h2>
      {/* Description */}
      <p
        className={cn(
          // Typography
          'text-[15px]',
          'md:text-[17px]',
          'leading-relaxed',
          // Color
          'text-[#86868b]',
          // Width
          'max-w-sm',
          // Spacing
          'mb-8',
        )}
      >
        {description}
      </p>
      {/* CTA Button */}
      <Link
        href={ctaHref}
        className={cn(
          // Layout
          'inline-flex',
          'items-center',
          'justify-center',
          // Size
          'min-h-[50px]',
          'px-7',
          // Typography
          'text-[17px]',
          'font-semibold',
          // Colors
          'bg-[#007aff]',
          'text-white',
          // Effects
          'rounded-2xl',
          // Transitions
          'transition-all',
          'duration-200',
          'ease-out',
          // Hover
          'hover:bg-[#0071e3]',
          // Active
          'active:opacity-80',
          'active:scale-[0.98]',
          // Focus
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
        )}
      >
        {ctaText}
      </Link>
    </div>
  )
}
