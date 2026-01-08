'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import type { Collection } from '@/types/saved-prompts'
import ResponsiveDialog from '@/components/common/ResponsiveDialog'

interface MoveToCollectionSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Callback when sheet is closed */
  onClose: () => void
  /** List of collections */
  collections: Collection[]
  /** ID of the collection the prompt is currently in */
  currentCollectionId?: string
  /** Callback when a collection is selected */
  onSelect: (collectionId: string) => void
}

/**
 * Responsive dialog for moving a prompt to a different collection.
 * Shows as bottom sheet on mobile and centered dialog on desktop.
 */
export default function MoveToCollectionSheet({
  isOpen,
  onClose,
  collections,
  currentCollectionId,
  onSelect,
}: MoveToCollectionSheetProps) {
  const dict = useTranslations()
  const collectionsT = dict.saved.collections
  const promptsT = dict.saved.prompts
  const actionsT = dict.common.actions

  // Footer with cancel button (desktop only - handled by ResponsiveDialog)
  const footer = (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        'w-full',
        'px-5',
        'py-3',
        'text-[15px]',
        'font-medium',
        'text-[#86868b]',
        'rounded-xl',
        'border',
        'border-black/[0.08]',
        'hover:bg-black/[0.04]',
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
      )}
    >
      {actionsT.cancel}
    </button>
  )

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={onClose}
      title={promptsT.move}
      breakpoint="lg"
      maxWidth="sm"
      footer={footer}
      contentClassName="p-0"
    >
      {collections.length === 0 ? (
        <p
          className={cn(
            'px-5',
            'py-8',
            'text-center',
            'text-gray-500',
            'text-sm',
          )}
        >
          {collectionsT.noCollectionsAvailable}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {collections.map((collection) => {
            const isCurrentCollection = collection.id === currentCollectionId

            return (
              <li key={collection.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isCurrentCollection) {
                      onSelect(collection.id)
                    }
                  }}
                  disabled={isCurrentCollection}
                  className={cn(
                    'flex',
                    'items-center',
                    'gap-3',
                    'w-full',
                    'px-5',
                    'py-4',
                    'min-h-[56px]',
                    'text-left',
                    'transition-colors',
                    'duration-200',
                    isCurrentCollection
                      ? cn('bg-[#007aff]/10', 'cursor-default')
                      : cn('hover:bg-gray-50', 'active:bg-gray-100'),
                    'focus:outline-none',
                    'focus-visible:bg-gray-50',
                  )}
                >
                  {/* Color dot */}
                  {collection.color && (
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: collection.color }}
                      aria-hidden="true"
                    />
                  )}
                  {/* Collection name */}
                  <span
                    className={cn(
                      'flex-1',
                      'text-[15px]',
                      'truncate',
                      isCurrentCollection ? 'text-[#007aff]' : 'text-gray-900',
                    )}
                  >
                    {collection.name}
                  </span>
                  {/* Current indicator */}
                  {isCurrentCollection && (
                    <span className="text-sm font-medium text-[#007aff]">
                      {collectionsT.current}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </ResponsiveDialog>
  )
}
