import { cn } from '@/lib/utils'

/**
 * Translations for EmptyHistoryState.
 */
interface EmptyHistoryStateTranslations {
  title: string
  description: string
}

/**
 * Props for the EmptyHistoryState component.
 */
interface EmptyHistoryStateProps {
  /** Translations for the component */
  translations?: EmptyHistoryStateTranslations
}

/**
 * Empty state component displayed when no history entries are found.
 * Features subtle visual styling with centered content.
 */
export default function EmptyHistoryState({
  translations,
}: EmptyHistoryStateProps) {
  // Default translations
  const t = translations ?? {
    title: 'No prompt history yet',
    description: 'Your enhanced prompts will appear here',
  }

  return (
    <div
      className={cn(
        // Container
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        // Spacing
        'py-20',
        'px-6',
        // Border
        'border',
        'border-dashed',
        'border-black/[0.12]',
        'rounded-2xl',
        // Background
        'bg-[#f5f5f7]/50',
      )}
    >
      <p
        className={cn(
          // Typography
          'text-lg',
          'font-medium',
          'text-[#1d1d1f]',
          'text-center',
          'tracking-tight',
          // Spacing
          'mb-2',
        )}
      >
        {t.title}
      </p>
      <p
        className={cn(
          // Typography
          'text-sm',
          'font-normal',
          'text-[#86868b]',
          'text-center',
          'tracking-tight',
        )}
      >
        {t.description}
      </p>
    </div>
  )
}
