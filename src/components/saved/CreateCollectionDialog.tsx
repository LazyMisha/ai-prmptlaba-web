import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import Dialog from '../common/Dialog'
import CreateCollectionForm from '@/components/common/CreateCollectionForm'
import CloseIcon from '@/components/icons/CloseIcon'
import { Button } from '@/components/common/Button'
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
          'min-h-[50px]',
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
        <Button
          onClick={handleCreateCollection}
          disabled={!newCollectionName.trim()}
          className="w-full"
        >
          {actionsT.create}
        </Button>
      </div>
    </Dialog>
  )
}

export default CreateCollectionDialog
