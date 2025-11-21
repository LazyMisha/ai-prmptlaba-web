'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

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
 * Shows success state with copy functionality or error state with details.
 */
export default function EnhancedResult({
  enhanced,
  error,
  originalPrompt,
  isLoading,
  className,
}: EnhancedResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (enhanced) {
      await navigator.clipboard.writeText(enhanced)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
          // border
          'border',
          'border-red-300',
          // border radius
          'rounded',
          // padding
          'p-4',
          // margin top
          'mt-4',
          // background
          'bg-red-50',
          className,
        )}
      >
        <h3
          className={cn(
            // font size
            'text-lg',
            // font weight
            'font-semibold',
            // text color
            'text-red-800',
            // margin bottom
            'mb-2',
          )}
        >
          Enhancement Failed
        </h3>
        <p className={cn('text-red-700')}>{error}</p>
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
        // border
        'border',
        'border-green-300',
        // border radius
        'rounded',
        // padding
        'p-4',
        // margin top
        'mt-4',
        // background
        'bg-green-50',
        className,
      )}
    >
      <div
        className={cn(
          // flex
          'flex',
          // justify between
          'justify-between',
          // items center
          'items-center',
          // margin bottom
          'mb-2',
        )}
      >
        <h3
          className={cn(
            // font size
            'text-lg',
            // font weight
            'font-semibold',
            // text color
            'text-green-800',
          )}
        >
          Enhanced Prompt
        </h3>
        <button
          className={cn(
            // text small
            'text-sm',
            // text blue
            'text-blue-600',
            // hover underline
            'hover:underline',
            // focus styles
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'rounded',
            'px-2',
            'py-1',
          )}
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy enhanced prompt to clipboard'}
          aria-live="polite"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      <div
        className={cn(
          // background color
          'bg-white',
          // padding
          'p-4',
          // border
          'border',
          'border-gray-200',
          // border radius
          'rounded',
          // margin bottom
          'mb-4',
        )}
      >
        <p
          className={cn(
            // whitespace pre-wrap
            'whitespace-pre-wrap',
            // font family
            'font-mono',
            // text align
            'text-left',
            // text color
            'text-gray-900',
          )}
          aria-label="Enhanced prompt text"
        >
          {enhanced}
        </p>
      </div>

      {originalPrompt && (
        <details
          className={cn(
            // text small
            'text-sm',
            // text gray
            'text-gray-700',
          )}
        >
          <summary
            className={cn(
              // cursor pointer
              'cursor-pointer',
              // margin bottom
              'mb-2',
              // focus styles
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-blue-500',
              'rounded',
              'px-2',
              'py-1',
              'inline-block',
            )}
            aria-label="Toggle original prompt visibility"
          >
            <span
              className={cn(
                // text underline
                'underline',
              )}
            >
              View Original Prompt
            </span>
          </summary>
          <div
            className={cn(
              // background color
              'bg-gray-50',
              // padding
              'p-4',
              // border
              'border',
              'border-gray-200',
              // border radius
              'rounded',
            )}
            role="region"
            aria-label="Original prompt text"
          >
            <p
              className={cn(
                // whitespace pre-wrap
                'whitespace-pre-wrap',
                // font family
                'font-mono',
                // text align
                'text-left',
                // text color
                'text-gray-900',
              )}
            >
              {originalPrompt}
            </p>
          </div>
        </details>
      )}
    </div>
  )
}
