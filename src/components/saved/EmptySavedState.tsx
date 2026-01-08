'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import BookmarkIcon from '@/components/icons/BookmarkIcon'

interface EmptySavedStateProps {
  /** Base path for links (includes locale) */
  basePath?: string
}

/**
 * EmptySavedState displays a friendly empty state when no prompts are saved.
 */
export function EmptySavedState({ basePath = '' }: EmptySavedStateProps) {
  const dict = useTranslations()
  const t = dict.saved.empty

  return (
    <div
      className={cn(
        // Layout
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        // Spacing
        'mt-8',
        'md:mt-10',
        'py-16',
        'px-4',
        'md:py-24',
        // Text
        'text-center',
      )}
    >
      {/* Large Icon */}
      <div
        className={cn(
          // Layout
          'flex',
          'items-center',
          'justify-center',
          // Size
          'w-20',
          'h-20',
          'md:w-24',
          'md:h-24',
          // Colors
          'bg-[#f5f5f7]',
          // Effects
          'rounded-full',
          // Spacing
          'mb-6',
        )}
        aria-hidden="true"
      >
        <BookmarkIcon
          className={cn(
            // Size
            'w-10',
            'h-10',
            'md:w-12',
            'md:h-12',
            // Color
            'text-[#86868b]',
          )}
        />
      </div>

      {/* Heading */}
      <h2
        className={cn(
          // Typography
          'text-xl',
          'md:text-2xl',
          'font-semibold',
          'tracking-[-0.01em]',
          // Color
          'text-[#1d1d1f]',
          // Spacing
          'mb-2',
        )}
      >
        {t.title}
      </h2>

      {/* Description */}
      <p
        className={cn(
          // Typography
          'text-[15px]',
          'md:text-[17px]',
          'leading-relaxed',
          // Color
          'text-[#86868b]',
          // Width
          'max-w-sm',
          // Spacing
          'mb-8',
        )}
      >
        {t.description}
      </p>

      {/* CTA Button */}
      <Link
        href={`${basePath}/enhance`}
        className={cn(
          // Layout
          'inline-flex',
          'items-center',
          'justify-center',
          // Size
          'min-h-[50px]',
          'px-7',
          // Typography
          'text-[17px]',
          'font-semibold',
          // Colors
          'bg-[#007aff]',
          'text-white',
          // Effects
          'rounded-xl',
          // Transitions
          'transition-all',
          'duration-200',
          'ease-out',
          // Hover
          'hover:bg-[#0071e3]',
          // Active
          'active:opacity-80',
          'active:scale-[0.98]',
          // Focus
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
        )}
      >
        {t.cta}
      </Link>
    </div>
  )
}
