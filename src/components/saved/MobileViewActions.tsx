'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import type { Collection } from '@/types/saved-prompts'
import CreateCollectionButton from '@/components/common/CreateCollectionButton'
import ChevronIcon from '@/components/icons/ChevronIcon'
import SlidersIcon from '@/components/icons/SlidersIcon'
import ManageCollectionDialog from './ManageCollectionDialog'

interface MobileViewActionsProps {
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
}

/**
 * MobileViewActions displays collection selection for mobile devices.
 * Renders as a custom dropdown with action buttons.
 */
export function MobileViewActions({
  collections,
  selectedId,
  promptCounts,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: MobileViewActionsProps) {
  const dict = useTranslations()
  const t = dict.saved.collections
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isManageSheetOpen, setIsManageSheetOpen] = useState(false)

  const totalCount = Object.values(promptCounts).reduce(
    (sum, count) => sum + count,
    0,
  )

  const selectedCollection = selectedId
    ? collections.find((c) => c.id === selectedId)
    : null

  const selectedName = selectedCollection ? selectedCollection.name : t.all
  const selectedCount = selectedId ? promptCounts[selectedId] || 0 : totalCount
  const selectedColor = selectedCollection?.color

  return (
    <div className="md:hidden">
      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            // Layout
            'flex',
            'items-center',
            'justify-between',
            'w-full',
            // Spacing
            'px-4',
            'py-3',
            // Typography
            'text-[17px]',
            'font-medium',
            'text-[#1d1d1f]',
            // Background
            'bg-white/80',
            'backdrop-blur-sm',
            // Border
            'border',
            'border-black/[0.08]',
            'rounded-2xl',
            // Shadow
            'shadow-sm',
            // Transition
            'transition-all',
            'duration-200',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
            // Hover
            'hover:border-black/[0.12]',
            'hover:bg-white',
          )}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {selectedColor && (
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: selectedColor }}
                aria-hidden="true"
              />
            )}
            <span className="truncate">
              {selectedName} ({selectedCount})
            </span>
          </span>
          <ChevronIcon
            className={cn(
              'w-5',
              'h-5',
              'text-[#86868b]',
              'transition-transform',
              'duration-200',
              'shrink-0',
              isDropdownOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />
            {/* Menu */}
            <div
              className={cn(
                // Position
                'absolute',
                'left-0',
                'right-0',
                'top-full',
                'z-50',
                // Spacing
                'mt-2',
                // Background
                'bg-white',
                // Border
                'border',
                'border-black/[0.08]',
                'rounded-2xl',
                // Shadow
                'shadow-lg',
                // Animation
                'animate-in',
                'fade-in-0',
                'zoom-in-95',
                'slide-in-from-top-2',
                'duration-200',
                // Max height with scroll
                'max-h-[60vh]',
                'overflow-y-auto',
              )}
            >
              {/* All option */}
              <button
                type="button"
                onClick={() => {
                  onSelect(null)
                  setIsDropdownOpen(false)
                }}
                className={cn(
                  // Layout
                  'flex',
                  'items-center',
                  'justify-between',
                  'w-full',
                  // Size
                  'min-h-[50px]',
                  // Spacing
                  'px-4',
                  'py-3',
                  // Typography
                  'text-[17px]',
                  'font-medium',
                  'text-left',
                  // Border
                  'border-b',
                  'border-black/[0.08]',
                  // Hover
                  'hover:bg-black/[0.04]',
                  // Transition
                  'transition-colors',
                  'duration-150',
                  // Focus
                  'focus:outline-none',
                  'focus-visible:bg-black/[0.04]',
                )}
              >
                <span className="text-[#1d1d1f]">{t.all}</span>
                <span className="text-[#86868b] text-[15px]">{totalCount}</span>
              </button>

              {/* Collection items */}
              {collections.map((collection, index) => (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => {
                    onSelect(collection.id)
                    setIsDropdownOpen(false)
                  }}
                  className={cn(
                    // Layout
                    'flex',
                    'items-center',
                    'justify-between',
                    'w-full',
                    // Size
                    'min-h-[50px]',
                    // Spacing
                    'px-4',
                    'py-3',
                    // Typography
                    'text-[17px]',
                    'font-medium',
                    'text-left',
                    // Border
                    index < collections.length - 1 && [
                      'border-b',
                      'border-black/[0.08]',
                    ],
                    // Hover
                    'hover:bg-black/[0.04]',
                    // Transition
                    'transition-colors',
                    'duration-150',
                    // Focus
                    'focus:outline-none',
                    'focus-visible:bg-black/[0.04]',
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
                    <span className="truncate text-[#1d1d1f]">
                      {collection.name}
                    </span>
                  </span>
                  <span className="text-[#86868b] text-[15px] ml-2">
                    {promptCounts[collection.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
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
            aria-label={t.manage}
            className={cn(
              // Layout
              'flex',
              'items-center',
              'justify-center',
              // Sizing
              'min-h-[50px]',
              'w-[50px]',
              'shrink-0',
              // Background
              'bg-[#007aff]',
              // Border
              'rounded-2xl',
              // Text color
              'text-white',
              // Hover
              'hover:bg-[#0071e3]',
              'active:opacity-80',
              'active:scale-[0.98]',
              // Transition
              'transition-all',
              'duration-200',
              // Focus
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[#007aff]',
              'focus-visible:ring-offset-2',
            )}
          >
            <SlidersIcon className="w-5 h-5" />
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
  )
}
