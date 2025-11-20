'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface EnhancedResultProps {
  enhanced: string | null
  error: string | null
  originalPrompt: string
}

/**
 * Display component for the enhanced prompt result
 */
export default function EnhancedResult({ enhanced, error, originalPrompt }: EnhancedResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (enhanced) {
      await navigator.clipboard.writeText(enhanced)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (error) {
    return (
      <div>
        <h3>Enhancement Failed</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!enhanced) {
    return null
  }

  return (
    <div
      className={cn(
        // border
        'border',
        // border radius
        'rounded',
        // padding
        'p-4',
        // margin top
        'mt-4',
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
            'font-medium',
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
          )}
          type="button"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div
        className={cn(
          // background color
          'bg-gray-100',
          // padding
          'p-4',
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
          )}
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
            'text-gray-600',
          )}
        >
          <summary
            className={cn(
              // cursor pointer
              'cursor-pointer',
              // margin bottom
              'mb-2',
            )}
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
              // border radius
              'rounded',
            )}
          >
            <p
              className={cn(
                // whitespace pre-wrap
                'whitespace-pre-wrap',
                // font family
                'font-mono',
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
