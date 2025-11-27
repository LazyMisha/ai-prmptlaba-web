import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Props for the PageDescription component.
 */
interface PageDescriptionProps {
  /** Description text or content */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
  /**
   * HTML id attribute for accessibility.
   * Useful when referenced by aria-describedby from other elements.
   */
  id?: string
}

/**
 * A reusable page description component.
 * Provides standardized typography with clean, readable styling.
 */
export function PageDescription({ children, className, id }: PageDescriptionProps) {
  return (
    <p
      id={id}
      className={cn(
        // Typography
        'font-light',
        // Color - Muted for visual hierarchy
        'text-gray-600',
        // Spacing - Subtle letter spacing for elegance
        'tracking-normal',
        // Max width - Optimal reading length
        'max-w-2xl',
        // Responsive text sizing - base on mobile, lg on tablet+
        // (includes appropriate line-height via Tailwind defaults)
        'text-base',
        'sm:text-lg',
        // Custom classes
        className,
      )}
    >
      {children}
    </p>
  )
}
