import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Reusable page container with consistent layout and spacing.
 * Provides centered, max-width content area with responsive padding.
 */
interface PageContainerProps {
  /** Content to be rendered inside the container */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        // width=768px max
        'max-w-3xl',
        // center horizontally
        'mx-auto',
        // center text
        'text-center',
        // vertical spacing
        'space-y-6',
        // padding
        'p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
