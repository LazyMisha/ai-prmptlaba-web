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
  id: string
}

/**
 * Page description component with refined typography.
 * Features secondary typography with optimal readability.
 */
export function PageDescription({
  children,
  className,
  id,
}: PageDescriptionProps) {
  return (
    <p
      id={id}
      className={cn(
        // Typography - subhead style
        'font-normal',
        // Leading for comfortable reading
        'leading-relaxed',
        // Secondary text color
        'text-[#86868b]',
        // Subtle letter spacing
        'tracking-tight',
        // Width - take full width of container
        'w-full',
        // Max width - Optimal reading length (65-75 characters)
        'max-w-2xl',
        // Responsive text sizing
        'text-lg',
        'sm:text-xl',
        'md:text-2xl',
        // Pretty text wrap
        'text-pretty',
        // Rendering
        'antialiased',
        // Margin 0
        'm-0',
        // Custom classes
        className,
      )}
    >
      {children}
    </p>
  )
}
