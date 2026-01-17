'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import type { Collection } from '@/types/saved-prompts'
import { Button } from '@/components/common/Button'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import { Dropdown } from '@/components/common/Dropdown'
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

type CollectionItem = {
  id: string | null
  name: string
  color?: string
  count: number
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

  // Sort collections by creation date (newest first)
  const sortedCollections = [...collections].sort(
    (a, b) => b.createdAt - a.createdAt,
  )

  // Build items array with "All" option first
  const items: CollectionItem[] = [
    { id: null, name: t.all, count: totalCount },
    ...sortedCollections.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      count: promptCounts[c.id] || 0,
    })),
  ]

  const handleSelectItem = (item: CollectionItem) => {
    onSelect(item.id)
    setIsDropdownOpen(false)
  }

  return (
    <div className="md:hidden">
      {/* Dropdown */}
      <Dropdown
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        triggerText={`${selectedName} (${selectedCount})`}
        triggerPrefix={
          selectedColor && (
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: selectedColor }}
              aria-hidden="true"
            />
          )
        }
        items={items}
        onSelectItem={(item) => handleSelectItem(item)}
        renderItem={(item) => (
          <>
            <span className="flex items-center gap-2 flex-1 min-w-0">
              {item.color && (
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
              )}
              <span className="truncate text-[#1d1d1f]">{item.name}</span>
            </span>
            <span className="text-[#86868b] text-[15px] ml-2">
              {item.count}
            </span>
          </>
        )}
      />

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        {onCreate && (
          <Button
            onClick={onCreate}
            icon={<FolderPlusIcon className="w-5 h-5" />}
            className="flex-1"
          >
            {t.create}
          </Button>
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
