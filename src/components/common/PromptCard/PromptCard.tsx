'use client'

import { useState } from 'react'
import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import CheckIcon from '@/components/icons/CheckIcon'
import ChevronIcon from '@/components/icons/ChevronIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import FolderMoveIcon from '@/components/icons/FolderMoveIcon'
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
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false)
  const [isEnhancedExpanded, setIsEnhancedExpanded] = useState(false)
  const { copied, copy } = useCopyToClipboard()
  const dict = useTranslations()
  const t = dict.promptCard

  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(id)
  }

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMove?.(id)
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copy(enhancedPrompt)
  }

  const toggleOriginalExpanded = () => {
    setIsOriginalExpanded((prev) => !prev)
  }

  const toggleEnhancedExpanded = () => {
    setIsEnhancedExpanded((prev) => !prev)
  }

  return (
    <article
      className={cn(
        // Container
        'bg-white',
        'rounded-2xl',
        'border',
        'border-black/[0.08]',
        'shadow-sm',
        'overflow-hidden',
        // Hover effect
        'hover:shadow-md',
        'hover:border-black/[0.12]',
        'transition-all',
        'duration-200',
        'ease-out',
        className,
      )}
    >
      {/* Header with date, context tag, and action buttons */}
      <header
        className={cn(
          // Layout
          'flex',
          'items-center',
          'justify-between',
          // Spacing
          'px-4',
          // Border
          'border-b',
          'border-black/[0.05]',
        )}
      >
        {/* Left side: Date + Context tag */}
        <div className={cn('flex', 'items-center', 'gap-2')}>
          <time
            dateTime={date.toISOString()}
            className={cn(
              'text-xs',
              'text-[#86868b]',
              'font-normal',
              'tracking-tight',
            )}
          >
            {formattedDate}
          </time>
          <span
            className={cn(
              'px-2',
              'py-0.5',
              'bg-[#007aff]/10',
              'text-[#007aff]',
              'text-xs',
              'font-medium',
              'rounded-full',
            )}
          >
            {target}
          </span>
        </div>

        {/* Right side: Action buttons */}
        <div className={cn('flex', 'items-center', 'gap-1')}>
          <button
            onClick={handleCopy}
            className={cn(
              'p-2',
              'rounded-lg',
              'transition-colors',
              'duration-200',
              'min-h-[44px]',
              'min-w-[44px]',
              'flex',
              'items-center',
              'justify-center',
              copied ? 'bg-[#34c759]/10' : 'hover:bg-black/[0.05]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[#007aff]',
              'focus-visible:ring-offset-2',
            )}
            aria-label={copied ? t.copiedToClipboard : t.copyToClipboard}
          >
            {copied ? (
              <CheckIcon className={cn('w-4', 'h-4', 'text-[#34c759]')} />
            ) : (
              <CopyIcon className={cn('w-4', 'h-4', 'text-[#86868b]')} />
            )}
          </button>

          {onMove && (
            <button
              onClick={handleMove}
              className={cn(
                'p-2',
                'rounded-lg',
                'hover:bg-black/[0.05]',
                'transition-colors',
                'duration-200',
                'min-h-[44px]',
                'min-w-[44px]',
                'flex',
                'items-center',
                'justify-center',
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#007aff]',
                'focus-visible:ring-offset-2',
              )}
              aria-label={t.moveToAnother}
            >
              <FolderMoveIcon className={cn('w-4', 'h-4', 'text-[#86868b]')} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className={cn(
                'p-2',
                'rounded-lg',
                'hover:bg-[#ff3b30]/10',
                'transition-colors',
                'duration-200',
                'min-h-[44px]',
                'min-w-[44px]',
                'flex',
                'items-center',
                'justify-center',
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#ff3b30]',
                'focus-visible:ring-offset-2',
              )}
              aria-label={t.deleteEntry}
            >
              <TrashIcon
                className={cn(
                  'w-4',
                  'h-4',
                  'text-[#86868b]',
                  'hover:text-[#ff3b30]',
                )}
              />
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className={cn('p-4', 'space-y-4')}>
        {/* Original Prompt - collapsible */}
        <button
          onClick={toggleOriginalExpanded}
          className={cn(
            'w-full',
            'text-left',
            'bg-black/[0.02]',
            'border',
            'border-black/[0.08]',
            'rounded-xl',
            'px-3',
            'py-2',
            'transition-all',
            'duration-200',
            'hover:bg-black/[0.04]',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
          )}
          aria-expanded={isOriginalExpanded}
          aria-label={`${t.original}. Click to ${isOriginalExpanded ? 'collapse' : 'expand'}`}
        >
          <div
            className={cn(
              'flex',
              'items-center',
              'justify-between',
              'gap-2',
              isOriginalExpanded && 'mb-2',
            )}
          >
            <div
              className={cn(
                'flex',
                'items-center',
                'gap-2',
                'flex-1',
                'min-w-0',
              )}
            >
              <span
                className={cn(
                  'text-xs',
                  'text-[#86868b]',
                  'font-normal',
                  'shrink-0',
                )}
              >
                {t.original}
              </span>
              {!isOriginalExpanded && (
                <span
                  className={cn('text-xs', 'text-[#86868b]/60', 'truncate')}
                >
                  {originalPrompt}
                </span>
              )}
            </div>
            <ChevronIcon
              isRotated={isOriginalExpanded}
              className="text-[#86868b] shrink-0"
            />
          </div>
          {isOriginalExpanded && (
            <p className={cn('text-sm', 'text-[#1d1d1f]', 'leading-relaxed')}>
              {originalPrompt}
            </p>
          )}
        </button>

        {/* Enhanced section - collapsible with blue background */}
        <button
          onClick={toggleEnhancedExpanded}
          className={cn(
            'w-full',
            'text-left',
            'bg-[#007aff]/5',
            'border',
            'border-[#007aff]/20',
            'rounded-xl',
            'px-3',
            'py-2',
            'transition-all',
            'duration-200',
            'hover:bg-[#007aff]/10',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
          )}
          aria-expanded={isEnhancedExpanded}
          aria-label={`${t.enhanced}. Click to ${isEnhancedExpanded ? 'collapse' : 'expand'}`}
        >
          <div
            className={cn(
              'flex',
              'items-center',
              'justify-between',
              'gap-2',
              isEnhancedExpanded && 'mb-2',
            )}
          >
            <div
              className={cn(
                'flex',
                'items-center',
                'gap-2',
                'flex-1',
                'min-w-0',
              )}
            >
              <span
                className={cn(
                  'text-xs',
                  'font-medium',
                  'text-[#007aff]',
                  'shrink-0',
                )}
              >
                {t.enhanced}
              </span>
              {!isEnhancedExpanded && (
                <span
                  className={cn('text-xs', 'text-[#007aff]/50', 'truncate')}
                >
                  {enhancedPrompt}
                </span>
              )}
            </div>
            <ChevronIcon
              isRotated={isEnhancedExpanded}
              className="text-[#007aff] shrink-0"
            />
          </div>
          {isEnhancedExpanded && (
            <p className={cn('text-sm', 'text-[#1d1d1f]', 'leading-relaxed')}>
              {enhancedPrompt}
            </p>
          )}
        </button>
      </div>
    </article>
  )
}

export default PromptCard
