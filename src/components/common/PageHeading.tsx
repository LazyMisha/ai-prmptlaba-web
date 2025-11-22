import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Reusable page heading component with consistent typography.
 * Provides standardized h1 styling across all pages.
 */
interface PageHeadingProps {
  /** Heading text or content */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
}

export function PageHeading({ children, className }: PageHeadingProps) {
  return (
    <h1
      className={cn(
        // font size
        'text-4xl',
        // font weight
        'font-semibold',
        className,
      )}
    >
      {children}
    </h1>
  )
}
