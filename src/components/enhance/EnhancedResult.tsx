'use client'

import { cn } from '@/lib/utils'
import CloseIcon from '@/components/common/CloseIcon'
import CheckIcon from '@/components/common/CheckIcon'
import ChevronIcon from '@/components/common/ChevronIcon'
import CopyButton from '@/components/common/CopyButton'

export interface EnhancedResultProps {
  /** The enhanced prompt text */
  enhanced: string | null
  /** Error message if enhancement failed */
  error: string | null
  /** Original prompt for comparison */
  originalPrompt: string
  /** Whether enhancement is in progress */
  isLoading?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Display component for the enhanced prompt result.
 */
export default function EnhancedResult({
  enhanced,
  error,
  originalPrompt,
  isLoading,
  className,
}: EnhancedResultProps) {
  // Don't show previous results while loading
  if (isLoading) {
    return null
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          // Spacing
          'p-5',
          'mt-6',
          // Background - subtle red tint
          'bg-red-50/80',
          'backdrop-blur-sm',
          // Border
          'border',
          'border-red-200',
          'rounded-2xl',
          // Shadow
          'shadow-sm',
          className,
        )}
      >
        <div className="flex items-start gap-3">
          {/* Error icon */}
          <div
            className={cn(
              'flex-shrink-0',
              'w-8',
              'h-8',
              'flex',
              'items-center',
              'justify-center',
              'bg-red-100',
              'rounded-full',
            )}
          >
            <CloseIcon className="w-4 h-4 text-red-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={cn('text-base', 'font-semibold', 'text-red-900', 'mb-1')}>
              Enhancement Failed
            </h3>
            <p className={cn('text-sm', 'font-light', 'text-red-700')}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!enhanced) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="Enhanced prompt result"
      aria-live="polite"
      className={cn(
        // Spacing
        'mt-6',
        // Background - subtle success tint with frosted effect
        'bg-gradient-to-b',
        'from-emerald-50/80',
        'to-white/80',
        'backdrop-blur-sm',
        // Border
        'border',
        'border-emerald-200',
        'rounded-2xl',
        // Shadow
        'shadow-sm',
        // Overflow
        'overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex',
          'justify-between',
          'items-center',
          'px-5',
          'py-4',
          'border-b',
          'border-emerald-100',
        )}
      >
        <div className="flex items-center gap-2">
          {/* Success icon */}
          <div
            className={cn(
              'w-6',
              'h-6',
              'flex',
              'items-center',
              'justify-center',
              'bg-emerald-100',
              'rounded-full',
            )}
          >
            <CheckIcon className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
          </div>
          <h3 className={cn('text-base', 'font-semibold', 'text-emerald-900')}>Enhanced Prompt</h3>
        </div>

        <CopyButton text={enhanced} variant="default" />
      </div>

      {/* Enhanced prompt content */}
      <div className="p-5">
        <div
          className={cn(
            // Background
            'bg-white',
            // Spacing
            'p-4',
            // Border
            'border',
            'border-gray-200',
            'rounded-xl',
            // Alignment
            'text-left',
          )}
        >
          <p
            className={cn(
              'whitespace-pre-wrap',
              'font-mono',
              'text-sm',
              'text-gray-900',
              'leading-relaxed',
            )}
          >
            {enhanced}
          </p>
        </div>

        {/* Original prompt collapsible */}
        {originalPrompt && (
          <details className="mt-4 group">
            <summary
              className={cn(
                // Layout
                'flex',
                'items-center',
                'gap-2',
                // Typography
                'text-sm',
                'font-medium',
                'text-gray-500',
                // Cursor
                'cursor-pointer',
                // Transition
                'transition-colors',
                'duration-200',
                // Hover
                'hover:text-gray-700',
                // Focus
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-blue-500/50',
                'rounded-lg',
                'px-2',
                'py-1',
                '-ml-2',
                // Hide default marker
                'list-none',
                '[&::-webkit-details-marker]:hidden',
              )}
            >
              <ChevronIcon
                className={cn(
                  // Sizing
                  'w-4',
                  'h-4',
                  // Rotation - starts pointing right, rotates to down when open
                  '-rotate-90',
                  'group-open:rotate-0',
                )}
              />
              View original prompt
            </summary>

            <div
              className={cn(
                // Spacing
                'mt-3',
                'p-4',
                // Background
                'bg-gray-50',
                // Border
                'border',
                'border-gray-200',
                'rounded-xl',
                // Alignment
                'text-left',
              )}
            >
              <p
                className={cn(
                  'whitespace-pre-wrap',
                  'font-mono',
                  'text-sm',
                  'text-gray-600',
                  'leading-relaxed',
                )}
              >
                {originalPrompt}
              </p>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
