'use client'

import { cn } from '@/lib/utils'
import SpinnerIcon from '@/components/icons/SpinnerIcon'

export type LoadingSize = 'S' | 'M' | 'L'

interface LoadingProps {
  /** Size of the spinner: S (16px), M (32px), L (64px) */
  size?: LoadingSize
  /** Whether this is a full-page loading state */
  fullPage?: boolean
  /** Additional CSS classes */
  className?: string
}

const sizeClasses: Record<LoadingSize, string> = {
  S: 'w-4 h-4',
  M: 'w-8 h-8',
  L: 'w-16 h-16',
}

/**
 * Unified loading spinner component.
 * Provides consistent loading states across the application.
 * Supports three sizes and full-page display mode.
 */
export default function Loading({
  size = 'M',
  fullPage = false,
  className,
}: LoadingProps) {
  const spinner = <SpinnerIcon className={sizeClasses[size]} />

  if (fullPage) {
    return (
      <div
        className={cn(
          // Layout
          'flex',
          'min-h-screen',
          'items-center',
          'justify-center',
          // Custom classes
          className,
        )}
        role="status"
        aria-live="polite"
      >
        {spinner}
      </div>
    )
  }

  return (
    <div
      className={cn(
        // Layout
        'flex',
        'flex-1',
        'items-center',
        'justify-center',
        // Custom classes
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {spinner}
    </div>
  )
}
