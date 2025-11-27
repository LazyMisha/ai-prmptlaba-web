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
 * A reusable page heading component.
 * Provides standardized h1 styling with clean, elegant typography.
 */
export function PageHeading({ children, className, id }: PageHeadingProps) {
  return (
    <h1
      id={id}
      className={cn(
        // Typography
        'font-light',
        // Letter spacing
        'tracking-tight',
        // Color
        'text-gray-900',
        // Rendering
        'antialiased',
        // Responsive text sizing - scales from mobile to desktop
        // (includes appropriate line-height via Tailwind defaults)
        'text-3xl',
        'sm:text-4xl',
        'md:text-5xl',
        // Spacing
        'mb-4',
        // Custom classes
        className,
      )}
    >
      {children}
    </h1>
  )
}
