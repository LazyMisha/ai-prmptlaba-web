import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Page container component with generous spacing.
 * Provides centered, max-width content area with refined responsive padding.
 */
interface PageContainerProps {
  /** Content to be rendered inside the container */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
  /** Whether to center content horizontally and vertically */
  centered?: boolean
}

export function PageContainer({
  children,
  className,
  centered = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        // Max width - content constraint
        'max-w-4xl',
        // Center horizontally
        'mx-auto',
        // Consistent padding
        'px-6',
        'py-6',
        'md:px-10',
        'md:py-8',
        // Consistent vertical spacing between children
        'space-y-6',
        'md:space-y-8',
        // Optional centering
        centered && [
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'text-center',
          'min-h-[60vh]',
        ],
        className,
      )}
    >
      {children}
    </div>
  )
}
