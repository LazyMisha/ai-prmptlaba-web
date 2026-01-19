'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import type { Collection } from '@/types/saved-prompts'
import Dialog from '@/components/common/Dialog'
import DialogHeader from '@/components/common/Dialog/DialogHeader'
import { Button } from '@/components/common/Button'

interface MoveToCollectionDialogProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Callback when sheet is closed */
  onClose: () => void
  /** List of collections */
  collections: Collection[]
  /** ID of the collection the prompt is currently in */
  currentCollectionId: string
  /** Callback when a collection is selected */
  onSelect: (collectionId: string) => void
}

/**
 * Dialog for moving a prompt to a different collection.
 */
export default function MoveToCollectionDialog({
  isOpen,
  onClose,
  collections,
  currentCollectionId,
  onSelect,
}: MoveToCollectionDialogProps) {
  const dict = useTranslations()
  const collectionsT = dict.saved.collections
  const promptsT = dict.saved.prompts
  const actionsT = dict.common.actions

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={promptsT.move} onClose={onClose} />

      {/* Content */}
      <div className={cn('max-h-[400px]', 'overflow-y-auto')}>
        {collections.length === 0 ? (
          <p
            className={cn(
              'px-6',
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
                      'px-6',
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
                        isCurrentCollection
                          ? 'text-[#007aff]'
                          : 'text-gray-900',
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
      </div>

      {/* Footer */}
      <div
        className={cn(
          'px-6',
          'py-4',
          'border-t',
          'border-gray-100',
          'bg-gray-50/80',
          'rounded-b-2xl',
        )}
      >
        <Button
          onClick={onClose}
          className={cn(
            'w-full',
            'bg-white',
            'text-[#86868b]',
            'border',
            'border-black/[0.08]',
            'hover:bg-gray-50',
            'active:bg-gray-100',
          )}
        >
          {actionsT.cancel}
        </Button>
      </div>
    </Dialog>
  )
}
