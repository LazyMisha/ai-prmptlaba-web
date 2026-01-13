import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import { EmptyState } from '@/components/common/EmptyState'
import BookmarkIcon from '@/components/icons/BookmarkIcon'

/**
 * EmptySavedState displays a friendly empty state when no prompts are saved.
 */
export function EmptySavedState() {
  const dict = useTranslations()
  const t = dict.saved.empty

  return (
    <EmptyState
      icon={
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
      }
      title={t.title}
      description={t.description}
      ctaText={t.cta}
      ctaHref="/enhance"
    />
  )
}
