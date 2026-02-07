'use client'

import { useState } from 'react'
import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import ChevronIcon from '@/components/icons/ChevronIcon'

export interface PromptCardProps {
  /** Original prompt text before enhancement (required for full variant) */
  originalPrompt?: string
  /** Enhanced prompt text */
  enhancedPrompt: string
  /** Display variant: 'full' shows both before/after, 'compact' shows only enhanced */
  variant?: 'full' | 'compact'
  /** Additional CSS classes */
  className?: string
  /** Header content */
  children: React.ReactNode
}

/**
 * Reusable prompt card component for displaying enhanced prompts.
 */
export function PromptCard({
  originalPrompt,
  enhancedPrompt,
  variant = 'full',
  className,
  children,
}: PromptCardProps) {
  const isCompact = variant === 'compact'
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false)
  const [isEnhancedExpanded, setIsEnhancedExpanded] = useState(!isCompact)

  const dict = useTranslations()
  const t = dict.promptCard
  const enhancedLabel = isCompact ? t.prompt : t.enhanced

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
      {/* Header */}
      {children}

      {/* Content */}
      <div className={cn('p-4', 'space-y-4')}>
        {/* Original Prompt - collapsible (hidden in compact variant) */}
        {!isCompact && (
          <button
            onClick={toggleOriginalExpanded}
            className={cn(
              'w-full',
              'text-left',
              'bg-black/[0.02]',
              'border',
              'border-black/[0.08]',
              'rounded-2xl',
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
                  <span className={cn('text-xs', 'text-[#86868b]', 'truncate')}>
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
        )}

        {/* Enhanced section - collapsible with blue background */}
        <button
          onClick={toggleEnhancedExpanded}
          className={cn(
            'w-full',
            'text-left',
            'bg-[#007aff]/5',
            'border',
            'border-[#007aff]/20',
            'rounded-2xl',
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
          aria-label={`${enhancedLabel}. Click to ${isEnhancedExpanded ? 'collapse' : 'expand'}`}
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
                {enhancedLabel}
              </span>
              {!isEnhancedExpanded && (
                <span className={cn('text-xs', 'text-[#0071e3]', 'truncate')}>
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
