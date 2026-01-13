import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import Dialog from '@/components/common/Dialog'
import CloseIcon from '@/components/icons/CloseIcon'

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
      {/* Header */}
      <div
        className={cn(
          'flex',
          'items-center',
          'justify-between',
          'px-6',
          'pt-5',
          'pb-4',
          'border-b',
          'border-gray-100',
        )}
      >
        <h2 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
          {savedT.collections.rename}
        </h2>
        <button
          type="button"
          onClick={() => setRenameCollectionId(null)}
          aria-label="Close"
          className={cn(
            'p-2',
            '-mr-2',
            'rounded-full',
            'text-gray-400',
            'hover:text-gray-600',
            'hover:bg-gray-100',
            'transition-colors',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
          )}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

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
            'text-[17px]',
            'border',
            'border-black/[0.12]',
            'rounded-xl',
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
        <button
          type="button"
          onClick={() => setRenameCollectionId(null)}
          className={cn(
            'flex-1',
            'px-5',
            'py-2.5',
            'text-[15px]',
            'font-medium',
            'text-[#86868b]',
            'rounded-xl',
            'border',
            'border-black/[0.08]',
            'hover:bg-white',
            'active:bg-gray-100',
            'transition-colors',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
          )}
        >
          {actionsT.cancel}
        </button>
        <button
          type="button"
          onClick={handleRenameCollection}
          disabled={!renameValue.trim()}
          className={cn(
            'flex-1',
            'px-5',
            'py-2.5',
            'text-[15px]',
            'font-semibold',
            'text-white',
            'bg-[#007aff]',
            'rounded-xl',
            'hover:bg-[#0071e3]',
            'active:opacity-80',
            'transition-colors',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
          )}
        >
          {actionsT.save}
        </button>
      </div>
    </Dialog>
  )
}

export default RenameCollectionDialog
