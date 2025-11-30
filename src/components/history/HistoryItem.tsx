'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PromptHistoryEntry } from '@/types/history'
import ChevronIcon from '@/components/common/ChevronIcon'
import CopyButton from '@/components/common/CopyButton'

interface HistoryItemProps {
  entry: PromptHistoryEntry
  onDelete?: (id: string) => void
}

/**
 * Displays a single prompt history entry with original and enhanced prompts.
 * Expandable/collapsible to save space in the list.
 */
export default function HistoryItem({ entry, onDelete }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const date = new Date(entry.timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(entry.id)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleExpanded()
    }
  }

  return (
    <article
      className={cn(
        // Container
        'flex',
        'flex-col',
        // Spacing
        'p-4',
        'sm:p-5',
        'gap-3',
        // Background and border
        'bg-white',
        'border',
        'border-black/[0.08]',
        'rounded-2xl',
        // Shadow
        'shadow-sm',
        // Hover effect
        'hover:shadow-md',
        'hover:border-black/[0.12]',
        'transition-all',
        'duration-200',
        'ease-out',
        // Cursor
        'cursor-pointer',
      )}
      onClick={toggleExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-expanded={isExpanded}
      aria-label={`History entry from ${formattedDate}. Click to ${isExpanded ? 'collapse' : 'expand'}`}
    >
      {/* Top row: Date on left, Delete + Arrow on right */}
      <header
        className={cn(
          // Layout
          'flex',
          'items-center',
          'justify-between',
          // Spacing
          'gap-2',
        )}
      >
        <time
          dateTime={date.toISOString()}
          className={cn(
            // Typography
            'text-xs',
            'font-normal',
            'text-[#86868b]',
            'tracking-tight',
          )}
        >
          {formattedDate}
        </time>

        <div
          className={cn(
            // Layout
            'flex',
            'items-center',
            // Spacing
            'gap-2',
            // Responsive
            'sm:gap-3',
          )}
        >
          <CopyButton
            text={entry.enhancedPrompt}
            variant="subtle"
            label="Copy enhanced"
            className={cn(
              // Responsive label visibility
              '[&>span]:hidden',
              '[&>span]:sm:inline',
            )}
          />
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className={cn(
                // Typography
                'text-xs',
                'font-medium',
                'text-[#86868b]',
                // Hover
                'hover:text-[#ff3b30]',
                // Spacing
                'px-2',
                'sm:px-3',
                'py-1.5',
                // Effects
                'transition-colors',
                'duration-200',
                // Focus
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#ff3b30]',
                'focus-visible:ring-offset-2',
                'rounded-lg',
              )}
              aria-label="Delete this history entry"
            >
              Delete
            </button>
          )}
          <ChevronIcon isRotated={isExpanded} />
        </div>
      </header>

      {/* Content rows: Label on left, Value on right */}
      <div
        className={cn(
          // Layout
          'flex',
          'flex-col',
          // Spacing
          'gap-2',
        )}
      >
        {/* Target */}
        <div
          className={cn(
            // Layout
            'flex',
            'items-baseline',
            // Spacing
            'gap-4',
          )}
        >
          <span
            className={cn(
              // Typography
              'text-xs',
              'font-medium',
              'text-[#86868b]',
              'uppercase',
              'tracking-wide',
              // Sizing
              'w-20',
              'shrink-0',
            )}
          >
            Target
          </span>
          <span
            className={cn(
              // Typography
              'text-sm',
              'font-normal',
              'text-[#1d1d1f]',
              // Sizing
              'flex-1',
            )}
          >
            {entry.target}
          </span>
        </div>

        {/* Original */}
        <div
          className={cn(
            // Layout
            'flex',
            'items-baseline',
            // Spacing
            'gap-4',
          )}
        >
          <span
            className={cn(
              // Typography
              'text-xs',
              'font-medium',
              'text-[#86868b]',
              'uppercase',
              'tracking-wide',
              // Sizing
              'w-20',
              'shrink-0',
            )}
          >
            Original
          </span>
          <span
            className={cn(
              // Typography
              'text-sm',
              'font-normal',
              'text-[#86868b]',
              // Sizing
              'flex-1',
              // Conditional
              !isExpanded && 'truncate',
            )}
          >
            {entry.originalPrompt}
          </span>
        </div>

        {/* Enhanced */}
        <div
          className={cn(
            // Layout
            'flex',
            'items-baseline',
            // Spacing
            'gap-4',
          )}
        >
          <span
            className={cn(
              // Typography
              'text-xs',
              'font-medium',
              'text-[#86868b]',
              'uppercase',
              'tracking-wide',
              // Sizing
              'w-20',
              'shrink-0',
            )}
          >
            Enhanced
          </span>
          <span
            className={cn(
              // Typography
              'text-sm',
              'font-normal',
              'text-[#1d1d1f]',
              'leading-relaxed',
              // Sizing
              'flex-1',
              // Conditional
              !isExpanded && 'truncate',
            )}
          >
            {entry.enhancedPrompt}
          </span>
        </div>
      </div>
    </article>
  )
}
