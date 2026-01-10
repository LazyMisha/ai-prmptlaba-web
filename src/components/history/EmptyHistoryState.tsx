'use client'

import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import { EmptyState } from '@/components/common/EmptyState'
import { ClockIcon } from '@/components/icons/ClockIcon'
import type { Locale } from '@/i18n/locales'

/**
 * Empty state component displayed when no history entries are found.
 * Features subtle visual styling with centered content.
 */
export default function EmptyHistoryState() {
  const params = useParams()
  const locale = params.lang as Locale
  const dict = useTranslations()
  const t = dict.history.empty

  return (
    <EmptyState
      icon={
        <ClockIcon
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
      }
      title={t.title}
      description={t.description}
      ctaText={t.cta}
      ctaHref={`/${locale}/enhance`}
    />
  )
}
