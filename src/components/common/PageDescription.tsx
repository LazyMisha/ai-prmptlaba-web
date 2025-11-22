import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Reusable page description component with consistent typography.
 * Provides standardized paragraph styling for page descriptions.
 */
interface PageDescriptionProps {
  /** Description text or content */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
}

export function PageDescription({ children, className }: PageDescriptionProps) {
  return (
    <p
      className={cn(
        // font size
        'text-lg',
        className,
      )}
    >
      {children}
    </p>
  )
}
