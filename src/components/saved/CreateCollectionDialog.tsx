import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import Dialog from '../common/Dialog'
import CreateCollectionForm from '@/components/common/CreateCollectionForm'
import CloseIcon from '@/components/icons/CloseIcon'
import type { CollectionColor } from '@/constants/saved-prompts'
import { DEFAULT_COLLECTION_COLOR } from '@/constants/saved-prompts'

interface CreateCollectionDialogProps {
  // Whether to show the create collection dialog
  showCreateCollection: boolean
  // New collection name
  newCollectionName: string
  // Setter for new collection name
  setNewCollectionName: (name: string) => void
  // New collection color
  newCollectionColor: CollectionColor
  // Setter for new collection color
  setNewCollectionColor: (color: CollectionColor) => void
  // Error message for new collection name
  newCollectionNameError: string | null
  // Setter for new collection name error
  setNewCollectionNameError: (error: string | null) => void
  // Handler for creating the collection
  handleCreateCollection: () => void
  // Whether to show the create collection dialog
  setShowCreateCollection: (show: boolean) => void
}

const CreateCollectionDialog = ({
  showCreateCollection,
  setShowCreateCollection,
  newCollectionName,
  setNewCollectionName,
  newCollectionColor,
  setNewCollectionColor,
  newCollectionNameError,
  setNewCollectionNameError,
  handleCreateCollection,
}: CreateCollectionDialogProps) => {
  const dict = useTranslations()
  const savedT = dict.saved
  const actionsT = dict.common.actions

  return (
    <Dialog
      isOpen={showCreateCollection}
      onClose={() => {
        setShowCreateCollection(false)
        setNewCollectionName('')
        setNewCollectionColor(DEFAULT_COLLECTION_COLOR as CollectionColor)
        setNewCollectionNameError(null)
      }}
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
          {savedT.collections.newCollection}
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowCreateCollection(false)
            setNewCollectionName('')
            setNewCollectionColor(DEFAULT_COLLECTION_COLOR as CollectionColor)
            setNewCollectionNameError(null)
          }}
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
        <CreateCollectionForm
          name={newCollectionName}
          onNameChange={(value) => {
            setNewCollectionName(value)
            if (newCollectionNameError) setNewCollectionNameError(null)
          }}
          color={newCollectionColor}
          onColorChange={setNewCollectionColor}
          nameError={newCollectionNameError}
          autoFocus
        />
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
        <button
          type="button"
          onClick={handleCreateCollection}
          disabled={!newCollectionName.trim()}
          className={cn(
            'w-full',
            'px-4',
            'py-3',
            'bg-[#007aff]',
            'text-white',
            'text-[15px]',
            'font-semibold',
            'rounded-xl',
            'transition-colors',
            'hover:bg-[#0071e3]',
            'active:opacity-80',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
          )}
        >
          {actionsT.create}
        </button>
      </div>
    </Dialog>
  )
}

export default CreateCollectionDialog
