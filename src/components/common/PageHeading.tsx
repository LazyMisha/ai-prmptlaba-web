import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Props for the PageHeading component.
 */
interface PageHeadingProps {
  /** Heading text or content */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
  /**
   * HTML id attribute for accessibility.
   * Useful for anchor links or when referenced by aria-labelledby.
   */
  id?: string
}

/**
 * Page heading component with bold typography.
 * Features impactful typography with tight letter spacing.
 */
export function PageHeading({ children, className, id }: PageHeadingProps) {
  return (
    <h1
      id={id}
      className={cn(
        // Typography - headline style
        'font-semibold',
        // Tight letter spacing for headlines
        'tracking-tight',
        // Leading for large text
        'leading-[1.05]',
        // Primary text color
        'text-[#1d1d1f]',
        // Rendering
        'antialiased',
        // Responsive text sizing - hero scale
        'text-4xl',
        'sm:text-5xl',
        'md:text-6xl',
        'lg:text-7xl',
        // Balanced text wrap for headings
        'text-balance',
        // Custom classes
        className,
      )}
    >
      {children}
    </h1>
  )
}
