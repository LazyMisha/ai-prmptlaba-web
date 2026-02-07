'use client'

import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import { useTokenCount } from '@/hooks/useTokenCount'
import { getThresholdCategory } from '@/lib/utils/tokenCount'

interface TokenBadgeProps {
  /** Text to count tokens for */
  text: string
  /** Target tool category (e.g. 'image-generator' or 'Image') */
  target?: string
}

/** Badge showing token count with color-coded efficiency (green/yellow/red). */
const TokenBadge = ({ text, target }: TokenBadgeProps) => {
  const dict = useTranslations()
  const t = dict.promptCard

  const category = getThresholdCategory(target)
  const { tokenCount, efficiency } = useTokenCount(text, category)

  if (tokenCount === null || efficiency === null) {
    return (
      <div
        className={cn('inline-flex', 'items-center', 'gap-1', 'animate-pulse')}
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className={cn('h-[18px]', 'w-16', 'bg-black/[0.05]', 'rounded-full')}
        />
      </div>
    )
  }

  const colorClasses = {
    low: cn('bg-[#34c759]/10', 'text-[#34c759]'),
    medium: cn('bg-[#ff9f0a]/10', 'text-[#ff9f0a]'),
    high: cn('bg-[#ff3b30]/10', 'text-[#ff3b30]'),
  }[efficiency]

  return (
    <span
      className={cn(
        // Layout
        'inline-flex',
        'items-center',
        // Spacing
        'px-2',
        'py-0.5',
        // Typography
        'text-xs',
        'font-medium',
        // Shape
        'rounded-full',
        // Colors
        colorClasses,
      )}
      aria-label={`${tokenCount} ${t.tokens}`}
    >
      {t.tokens}: {tokenCount.toLocaleString()}
    </span>
  )
}

export default TokenBadge
