'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import type { Collection } from '@/types/saved-prompts'
import CreateCollectionButton from '@/components/common/CreateCollectionButton'
import PencilIcon from '@/components/icons/PencilIcon'
import SelectorIcon from '@/components/icons/SelectorIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import ManageCollectionDialog from './ManageCollectionDialog'

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
  const [isManageSheetOpen, setIsManageSheetOpen] = useState(false)
  const totalCount = Object.values(promptCounts).reduce(
    (sum, count) => sum + count,
    0,
  )

  return (
    <div className={className}>
      {/* Mobile: Dropdown Selector */}
      <div className="md:hidden">
        <label
          htmlFor="collection-selector"
          className={cn(
            // Typography
            'text-sm',
            'font-medium',
            'text-gray-700',
            // Layout
            'block',
            // Spacing
            'mb-2',
          )}
        >
          {t.label}
        </label>
        <div className="relative">
          <select
            id="collection-selector"
            value={selectedId ?? 'all'}
            onChange={(e) =>
              onSelect(e.target.value === 'all' ? null : e.target.value)
            }
            className={cn(
              // Sizing
              'w-full',
              // Spacing
              'px-4',
              'py-3',
              'pr-10',
              // Typography
              'text-base',
              'font-normal',
              'text-gray-900',
              // Background
              'bg-white/80',
              'backdrop-blur-sm',
              // Border
              'border',
              'border-gray-200',
              'rounded-xl',
              // Shadow
              'shadow-sm',
              // Appearance
              'appearance-none',
              'cursor-pointer',
              // Transition
              'transition-all',
              'duration-200',
              // Focus
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-blue-500/40',
              'focus:border-blue-500',
              'focus:bg-white',
              // Hover
              'hover:border-gray-300',
              'hover:bg-white',
            )}
          >
            <option value="all">
              {t.all} ({totalCount})
            </option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name} ({promptCounts[collection.id] || 0})
              </option>
            ))}
          </select>
          <div
            className={cn(
              // Position
              'absolute',
              'right-3',
              'top-1/2',
              '-translate-y-1/2',
              // Pointer events
              'pointer-events-none',
              // Color
              'text-gray-400',
            )}
          >
            <SelectorIcon className="w-5 h-5" />
          </div>
        </div>
        {/* Mobile action buttons */}
        <div className="flex gap-2 mt-3">
          {onCreate && (
            <CreateCollectionButton
              onClick={onCreate}
              label={t.create}
              className="flex-1"
            />
          )}
          {(onEdit || onDelete) && collections.length > 0 && (
            <button
              type="button"
              onClick={() => setIsManageSheetOpen(true)}
              className={cn(
                // Layout
                'flex',
                'flex-1',
                'items-center',
                'justify-center',
                'gap-2',
                // Sizing
                'min-h-[44px]',
                'px-4',
                // Typography
                'text-[15px]',
                'font-medium',
                'text-[#007aff]',
                // Border
                'border',
                'border-[#007aff]/30',
                'rounded-xl',
                // Hover
                'hover:bg-[#007aff]/5',
                'active:bg-[#007aff]/10',
                // Transition
                'transition-colors',
                // Focus
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#007aff]',
                'focus-visible:ring-offset-2',
              )}
            >
              <PencilIcon className="w-4 h-4" />
              {t.manage}
            </button>
          )}
        </div>
        {/* Manage Collection Dialog */}
        <ManageCollectionDialog
          isOpen={isManageSheetOpen}
          onClose={() => setIsManageSheetOpen(false)}
          collections={collections}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
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
            // Effects
            'rounded-xl',
            // Transitions
            'transition-colors',
            'duration-200',
            // Gap between text and count
            'gap-2',
            // Selected state
            selectedId === null
              ? cn('bg-[#007aff]', 'text-white')
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
              selectedId === null ? 'text-white/80' : 'text-[#86868b]',
            )}
          >
            {totalCount}
          </span>
        </button>
        {/* Collection items */}
        {collections.map((collection) => (
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
                'pr-2',
                'py-2.5',
                // Typography
                'text-[15px]',
                'font-medium',
                'whitespace-nowrap',
                // Effects
                'rounded-xl',
                // Cursor
                'cursor-pointer',
                // Transitions
                'transition-colors',
                'duration-200',
                // Selected state
                selectedId === collection.id
                  ? cn('bg-[#007aff]', 'text-white')
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
                                'text-white/70',
                                'hover:text-white',
                                'hover:bg-white/20',
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
                                'text-white/70',
                                'hover:text-white',
                                'hover:bg-white/20',
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
                      ? 'text-white/80'
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
          <CreateCollectionButton label={t.create} onClick={onCreate} />
        )}
      </nav>
    </div>
  )
}
