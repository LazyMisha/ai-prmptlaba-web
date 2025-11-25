'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PromptHistoryEntry } from '@/types/history'
import HistoryLabel from './HistoryLabel'
import ChevronDownIcon from '@/components/common/ChevronDownIcon'

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
        'gap-1',
        // Border and background
        'border',
        'border-gray-200',
        'bg-white',
        'rounded-lg',
        // Hover effect
        'hover:shadow-sm',
        'transition-all',
        'duration-300',
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
      {/* Header with target and timestamp */}
      <header
        className={cn(
          // Layout
          'flex',
          'justify-between',
          'items-start',
          // Spacing
          'gap-2',
        )}
      >
        <div
          className={cn(
            // Layout
            'flex',
            'flex-col',
            'items-start',
            // Spacing
            'gap-1',
            // Sizing
            'flex-1',
            'min-w-0',
          )}
        >
          <time
            dateTime={date.toISOString()}
            className={cn(
              // Typography
              'text-xs',
              'font-light',
              'text-gray-400',
            )}
          >
            {formattedDate}
          </time>

          {/* Target */}
          <HistoryLabel label="Target" value={entry.target} />

          {/* Preview when collapsed */}
          {!isExpanded && (
            <>
              <HistoryLabel
                label="Original"
                value={entry.originalPrompt}
                valueColor="text-gray-600"
              />
              <HistoryLabel
                label="Enhanced"
                value={entry.enhancedPrompt}
                valueColor="text-gray-800"
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className={cn(
                // Typography
                'text-xs',
                'font-light',
                'text-gray-400',
                // Hover
                'hover:text-red-500',
                // Spacing
                'px-2',
                'py-1',
                // Effects
                'transition-colors',
                // Focus
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-red-500',
                'focus:ring-offset-1',
                'rounded',
              )}
              aria-label="Delete this history entry"
            >
              Delete
            </button>
          )}
          {/* Expand/Collapse indicator */}
          <ChevronDownIcon isRotated={isExpanded} />
        </div>
      </header>

      {/* Full content when expanded */}
      <div
        className={cn(
          // Grid for smooth height animation
          'grid',
          'transition-[grid-template-rows]',
          'duration-300',
          'ease-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div
          className={cn(
            // Overflow hidden for smooth animation
            'overflow-hidden',
            // Fade in/out effect
            'transition-opacity',
            'duration-300',
            'ease-out',
            isExpanded ? 'opacity-100' : 'opacity-0',
          )}
        >
          <HistoryLabel
            label="Original"
            value={entry.originalPrompt}
            valueColor="text-gray-700"
            truncate={false}
            showBorder
          />
          <HistoryLabel
            label="Enhanced"
            value={entry.enhancedPrompt}
            valueColor="text-gray-900"
            truncate={false}
            showBorder
          />
        </div>
      </div>
    </article>
  )
}
