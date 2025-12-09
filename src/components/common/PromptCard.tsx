'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import CheckIcon from '@/components/icons/CheckIcon'
import ChevronIcon from '@/components/icons/ChevronIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import FolderMoveIcon from '@/components/icons/FolderMoveIcon'
import IconTextButton from '@/components/common/IconTextButton'
import TrashIcon from '@/components/icons/TrashIcon'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

export interface PromptCardProps {
  /** Unique identifier for the prompt */
  id: string
  /** Original prompt text before enhancement */
  originalPrompt: string
  /** Enhanced prompt text */
  enhancedPrompt: string
  /** Target tool/platform used for enhancement */
  target: string
  /** Timestamp when the prompt was created/saved */
  timestamp: number
  /** Callback when delete is requested */
  onDelete?: (id: string) => void
  /** Callback when move is requested (for saved prompts) */
  onMove?: (id: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Reusable prompt card component for displaying enhanced prompts.
 */
export function PromptCard({
  id,
  originalPrompt,
  enhancedPrompt,
  target,
  timestamp,
  onDelete,
  onMove,
  className,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { copied, copy } = useCopyToClipboard()

  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(id)
  }

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMove?.(id)
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
        className,
      )}
      onClick={toggleExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-expanded={isExpanded}
      aria-label={`Prompt entry from ${formattedDate}. Click to ${isExpanded ? 'collapse' : 'expand'}`}
    >
      {/* Top row: Date on left, Actions + Arrow on right */}
      <header
        className={cn(
          // Layout
          'flex',
          'flex-col',
          // Spacing
          'gap-2',
          // Large screens: single row
          'lg:flex-row',
          'lg:items-center',
          'lg:justify-between',
        )}
      >
        {/* Mobile/Tablet: Date + Chevron row / Desktop: Just date */}
        <div
          className={cn(
            // Mobile/Tablet: row with date and chevron
            'flex',
            'items-center',
            'justify-between',
            // Desktop: just date, no chevron here
            'lg:justify-start',
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
              // Prevent shrinking
              'shrink-0',
            )}
          >
            {formattedDate}
          </time>

          {/* Mobile/Tablet chevron */}
          <div className="lg:hidden">
            <ChevronIcon isRotated={isExpanded} />
          </div>
        </div>

        {/* Actions row */}
        <div
          className={cn(
            // Layout
            'flex',
            'items-center',
            // Spacing - no left padding on mobile/tablet
            'gap-2',
            // Responsive
            'lg:gap-3',
          )}
        >
          <IconTextButton
            icon={copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            label={copied ? 'Copied' : 'Copy'}
            onClick={(e) => {
              e.stopPropagation()
              copy(enhancedPrompt)
            }}
            variant={copied ? 'success' : 'default'}
            ariaLabel={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            className={cn('[&]:pl-0', 'lg:[&]:pl-3')}
          />
          {onMove && (
            <IconTextButton
              icon={<FolderMoveIcon className="w-4 h-4" />}
              label="Move"
              onClick={handleMove}
              ariaLabel="Move to another collection"
            />
          )}
          {onDelete && (
            <IconTextButton
              icon={<TrashIcon className="w-4 h-4" />}
              label="Delete"
              onClick={handleDelete}
              variant="destructive"
              ariaLabel="Delete this entry"
            />
          )}
          {/* Desktop-only chevron */}
          <div className="hidden lg:block">
            <ChevronIcon isRotated={isExpanded} />
          </div>
        </div>
      </header>

      {/* Content rows: Label on left, Value on right */}
      <div className={cn('flex', 'flex-col', 'gap-2')}>
        {/* Target */}
        <div className={cn('flex', 'items-baseline', 'gap-4')}>
          <span
            className={cn(
              'text-xs',
              'font-medium',
              'text-[#86868b]',
              'uppercase',
              'tracking-wide',
              'w-20',
              'shrink-0',
            )}
          >
            Target
          </span>
          <span className={cn('text-sm', 'font-normal', 'text-[#1d1d1f]', 'flex-1')}>{target}</span>
        </div>

        {/* Original */}
        <div className={cn('flex', 'items-baseline', 'gap-4')}>
          <span
            className={cn(
              'text-xs',
              'font-medium',
              'text-[#86868b]',
              'uppercase',
              'tracking-wide',
              'w-20',
              'shrink-0',
            )}
          >
            Original
          </span>
          <span
            className={cn(
              'text-sm',
              'font-normal',
              'text-[#86868b]',
              'flex-1',
              !isExpanded && 'truncate',
            )}
          >
            {originalPrompt}
          </span>
        </div>

        {/* Enhanced */}
        <div className={cn('flex', 'items-baseline', 'gap-4')}>
          <span
            className={cn(
              'text-xs',
              'font-medium',
              'text-[#86868b]',
              'uppercase',
              'tracking-wide',
              'w-20',
              'shrink-0',
            )}
          >
            Enhanced
          </span>
          <span
            className={cn(
              'text-sm',
              'font-normal',
              'text-[#1d1d1f]',
              'leading-relaxed',
              'flex-1',
              !isExpanded && 'truncate',
            )}
          >
            {enhancedPrompt}
          </span>
        </div>
      </div>
    </article>
  )
}

export default PromptCard
