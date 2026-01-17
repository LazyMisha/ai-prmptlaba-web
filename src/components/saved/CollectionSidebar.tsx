'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import type { Collection } from '@/types/saved-prompts'
import { Button } from '@/components/common/Button'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { MobileViewActions } from './MobileViewActions'

interface CollectionSidebarProps {
  /** List of collections to display */
  collections: Collection[]
  /** Currently selected collection ID (null for "All") */
  selectedId: string | null
  /** Prompt count per collection */
  promptCounts: Record<string, number>
  /** Callback when a collection is selected */
  onSelect: (id: string | null) => void
  /** Callback when edit is requested */
  onEdit?: (id: string) => void
  /** Callback when delete is requested */
  onDelete?: (id: string) => void
  /** Callback when create is requested */
  onCreate?: () => void
  /** Additional CSS classes for the container */
  className?: string
}

/**
 * CollectionSidebar displays a list of collections for navigation.
 * On mobile, it renders as a dropdown selector.
 * On desktop, it renders as a vertical sidebar.
 */
export function CollectionSidebar({
  collections,
  selectedId,
  promptCounts,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
  className,
}: CollectionSidebarProps) {
  const dict = useTranslations()
  const t = dict.saved.collections
  const totalCount = Object.values(promptCounts).reduce(
    (sum, count) => sum + count,
    0,
  )

  // Sort collections by creation date (newest first)
  const sortedCollections = [...collections].sort(
    (a, b) => b.createdAt - a.createdAt,
  )

  return (
    <div className={className}>
      {/* Mobile: Custom Dropdown */}
      <MobileViewActions
        collections={sortedCollections}
        selectedId={selectedId}
        promptCounts={promptCounts}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onCreate={onCreate}
      />
      {/* Desktop: Vertical Sidebar */}
      <nav
        aria-label="Collections"
        className={cn(
          // Hide on mobile
          'hidden',
          'md:flex',
          'md:flex-col',
          'md:gap-1',
        )}
      >
        {/* "All" option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            // Layout
            'flex',
            'items-center',
            'justify-between',
            'shrink-0',
            // Size
            'min-h-[44px]',
            // Spacing
            'px-4',
            'py-2',
            // Desktop sidebar
            'md:w-full',
            'md:px-3',
            'md:py-2.5',
            // Typography
            'text-[15px]',
            'font-medium',
            'whitespace-nowrap',
            // Border
            'border-2',
            selectedId === null ? 'border-[#007aff]' : 'border-transparent',
            // Effects
            'rounded-2xl',
            // Transitions
            'transition-all',
            'duration-200',
            // Gap between text and count
            'gap-2',
            // Selected state
            selectedId === null
              ? cn('text-[#007aff]')
              : cn('text-[#1d1d1f]', 'hover:bg-black/[0.04]'),
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
          )}
        >
          <span>{t.all}</span>
          <span
            className={cn(
              'text-sm',
              'ml-1',
              selectedId === null ? 'text-[#007aff]/70' : 'text-[#86868b]',
            )}
          >
            {totalCount}
          </span>
        </button>
        {/* Collection items */}
        {sortedCollections.map((collection) => (
          <div
            key={collection.id}
            className={cn(
              // Layout
              'group',
              'relative',
              'flex',
              'items-center',
              'shrink-0',
              'md:w-full',
            )}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(collection.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(collection.id)
                }
              }}
              className={cn(
                // Layout
                'flex',
                'items-center',
                'flex-1',
                'min-w-0',
                // Size
                'min-h-[44px]',
                // Spacing
                'pl-3',
                'pr-3',
                'py-2.5',
                // Typography
                'text-[15px]',
                'font-medium',
                'whitespace-nowrap',
                // Border
                'border-2',
                selectedId === collection.id
                  ? 'border-[#007aff]'
                  : 'border-transparent',
                // Effects
                'rounded-2xl',
                // Cursor
                'cursor-pointer',
                // Transitions
                'transition-all',
                'duration-200',
                // Selected state
                selectedId === collection.id
                  ? cn('text-[#007aff]')
                  : cn('text-[#1d1d1f]', 'hover:bg-black/[0.04]'),
                // Focus
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#007aff]',
                'focus-visible:ring-offset-2',
              )}
            >
              <span className="flex items-center gap-2 flex-1 min-w-0">
                {collection.color && (
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: collection.color }}
                    aria-hidden="true"
                  />
                )}
                <span className="truncate">{collection.name}</span>
              </span>
              {/* Count and action buttons container */}
              <span className="flex items-center gap-1 ml-2 shrink-0">
                {/* Action buttons - visible on hover */}
                {(onEdit || onDelete) && (
                  <span
                    className={cn(
                      // Layout
                      'items-center',
                      'gap-0.5',
                      // Hide by default, show on hover
                      'hidden',
                      'group-hover:flex',
                    )}
                  >
                    {onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(collection.id)
                        }}
                        aria-label={`Rename ${collection.name}`}
                        className={cn(
                          'p-1',
                          'rounded-lg',
                          'transition-colors',
                          'duration-150',
                          selectedId === collection.id
                            ? cn(
                                'text-[#007aff]/60',
                                'hover:text-[#007aff]',
                                'hover:bg-[#007aff]/10',
                              )
                            : cn(
                                'text-[#86868b]',
                                'hover:text-[#1d1d1f]',
                                'hover:bg-black/[0.06]',
                              ),
                          'focus:outline-none',
                          'focus-visible:ring-2',
                          'focus-visible:ring-[#007aff]',
                        )}
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(collection.id)
                        }}
                        aria-label={`Delete ${collection.name}`}
                        className={cn(
                          'p-1',
                          'rounded-lg',
                          'transition-colors',
                          'duration-150',
                          selectedId === collection.id
                            ? cn(
                                'text-[#ff3b30]/60',
                                'hover:text-[#ff3b30]',
                                'hover:bg-[#ff3b30]/10',
                              )
                            : cn(
                                'text-[#86868b]',
                                'hover:text-[#ff3b30]',
                                'hover:bg-[#ff3b30]/10',
                              ),
                          'focus:outline-none',
                          'focus-visible:ring-2',
                          'focus-visible:ring-[#007aff]',
                        )}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                )}
                {/* Prompt count */}
                <span
                  className={cn(
                    'text-sm',
                    'min-w-[1.5rem]',
                    'text-right',
                    selectedId === collection.id
                      ? 'text-[#007aff]/70'
                      : 'text-[#86868b]',
                  )}
                >
                  {promptCounts[collection.id] || 0}
                </span>
              </span>
            </div>
          </div>
        ))}

        {/* Create new collection button */}
        {onCreate && (
          <Button
            onClick={onCreate}
            icon={<FolderPlusIcon className="w-5 h-5" />}
            className="w-full"
          >
            {t.create}
          </Button>
        )}
      </nav>
    </div>
  )
}
