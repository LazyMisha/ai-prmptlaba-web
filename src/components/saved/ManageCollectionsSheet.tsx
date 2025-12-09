'use client'

import { cn } from '@/lib/utils'
import type { Collection } from '@/types/saved-prompts'
import MobileSheet from '@/components/common/MobileSheet'
import PencilIcon from '@/components/common/PencilIcon'
import TrashIcon from '@/components/common/TrashIcon'

interface ManageCollectionsSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Callback when sheet is closed */
  onClose: () => void
  /** List of collections */
  collections: Collection[]
  /** Callback when edit is requested */
  onEdit?: (id: string) => void
  /** Callback when delete is requested */
  onDelete?: (id: string) => void
}

/**
 * Mobile bottom sheet for managing collections (rename/delete).
 * Provides a touch-friendly interface for collection management on mobile devices.
 */
export default function ManageCollectionsSheet({
  isOpen,
  onClose,
  collections,
  onEdit,
  onDelete,
}: ManageCollectionsSheetProps) {
  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Collections"
      contentClassName="p-0"
    >
      {collections.length === 0 ? (
        <p className={cn('px-5', 'py-8', 'text-center', 'text-gray-500', 'text-sm')}>
          No collections yet
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {collections.map((collection) => (
            <li
              key={collection.id}
              className={cn(
                'flex',
                'items-center',
                'justify-between',
                'px-5',
                'py-3',
                'min-h-[56px]',
              )}
            >
              {/* Collection info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {collection.color && (
                  <span
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: collection.color }}
                    aria-hidden="true"
                  />
                )}
                <span className={cn('text-[15px]', 'font-medium', 'text-gray-900', 'truncate')}>
                  {collection.name}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-3">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(collection.id)
                      onClose()
                    }}
                    aria-label={`Rename ${collection.name}`}
                    className={cn(
                      'p-2.5',
                      'rounded-xl',
                      'text-gray-500',
                      'hover:text-[#007aff]',
                      'hover:bg-[#007aff]/10',
                      'active:bg-[#007aff]/20',
                      'transition-colors',
                      'focus:outline-none',
                      'focus-visible:ring-2',
                      'focus-visible:ring-[#007aff]',
                    )}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(collection.id)
                      onClose()
                    }}
                    aria-label={`Delete ${collection.name}`}
                    className={cn(
                      'p-2.5',
                      'rounded-xl',
                      'text-gray-500',
                      'hover:text-[#ff3b30]',
                      'hover:bg-[#ff3b30]/10',
                      'active:bg-[#ff3b30]/20',
                      'transition-colors',
                      'focus:outline-none',
                      'focus-visible:ring-2',
                      'focus-visible:ring-[#007aff]',
                    )}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </MobileSheet>
  )
}
