'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import Dialog from '@/components/common/Dialog'
import DialogHeader from '@/components/common/Dialog/DialogHeader'
import { Button } from '@/components/common/Button'

interface RenameCollectionDialogProps {
  // Current value of the collection name input
  renameValue: string
  // ID of the collection being renamed; null if dialog is closed
  renameCollectionId: string | null
  // Setter for the collection name input value
  setRenameValue: (value: string) => void
  // Handler to execute the rename action
  handleRenameCollection: () => void
  // ID of the collection being renamed; null if dialog is closed
  setRenameCollectionId: (id: string | null) => void
}

const RenameCollectionDialog = ({
  renameCollectionId,
  renameValue,
  setRenameValue,
  setRenameCollectionId,
  handleRenameCollection,
}: RenameCollectionDialogProps) => {
  const dict = useTranslations()
  const savedT = dict.saved
  const actionsT = dict.common.actions

  return (
    <Dialog
      isOpen={!!renameCollectionId}
      onClose={() => setRenameCollectionId(null)}
    >
      <DialogHeader
        title={savedT.collections.rename}
        onClose={() => setRenameCollectionId(null)}
      />

      {/* Content */}
      <div className={cn('px-6', 'py-4')}>
        <input
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          placeholder={savedT.collections.collectionName}
          className={cn(
            'w-full',
            'px-4',
            'py-3',
            'min-h-[50px]',
            'text-[17px]',
            'border',
            'border-black/[0.12]',
            'rounded-2xl',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-[#007aff]',
          )}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && renameValue.trim()) {
              handleRenameCollection()
            }
          }}
        />
      </div>

      {/* Footer */}
      <div
        className={cn(
          'flex',
          'gap-3',
          'px-6',
          'py-4',
          'border-t',
          'border-gray-100',
          'bg-gray-50/80',
          'rounded-b-2xl',
        )}
      >
        <Button
          onClick={() => setRenameCollectionId(null)}
          className={cn(
            'flex-1',
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
        <Button
          onClick={handleRenameCollection}
          disabled={!renameValue.trim()}
          className="flex-1"
        >
          {actionsT.save}
        </Button>
      </div>
    </Dialog>
  )
}

export default RenameCollectionDialog
