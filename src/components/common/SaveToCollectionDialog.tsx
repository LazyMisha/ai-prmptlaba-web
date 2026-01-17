'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import { DEFAULT_COLLECTION_COLOR } from '@/constants/saved-prompts'
import {
  getAllCollectionsWithCounts,
  createCollection,
  savePrompt,
  getOrCreateDefaultCollection,
} from '@/lib/db/saved-prompts'
import { showToast } from '@/components/common/Toast'
import Dialog from '@/components/common/Dialog'
import CheckIcon from '@/components/icons/CheckIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import { Button } from '@/components/common/Button'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import CreateCollectionForm from '@/components/common/CreateCollectionForm'
import FolderIcon from '@/components/icons/FolderIcon'
import SpinnerIcon from '@/components/icons/SpinnerIcon'
import type { CollectionWithCount } from '@/types/saved-prompts'
import type { CollectionColor } from '@/constants/saved-prompts'

/**
 * Props for the SaveToCollectionDialog component
 */
interface SaveToCollectionDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback when dialog is closed */
  onClose: () => void
  /** Callback when prompt is successfully saved */
  onSaved?: () => void
  /** The original prompt text */
  originalPrompt: string
  /** The enhanced prompt text */
  enhancedPrompt: string
  /** The target tool category */
  target: string
}

type DialogMode = 'select' | 'create'

/**
 * Dialog for saving enhanced prompts to collections.
 * Supports quick  default collection or selecting/creating custom collections.
 */
export default function SaveToCollectionDialog({
  isOpen,
  onClose,
  onSaved,
  originalPrompt,
  enhancedPrompt,
  target,
}: SaveToCollectionDialogProps) {
  const modeRef = useRef<DialogMode>('select')
  const t = useTranslations()

  const [mode, setMode] = useState<DialogMode>('select')
  const [collections, setCollections] = useState<CollectionWithCount[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null)

  // New collection form state
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionColor, setNewCollectionColor] = useState<CollectionColor>(
    DEFAULT_COLLECTION_COLOR as CollectionColor,
  )
  const [nameError, setNameError] = useState<string | null>(null)

  // Load collections and setup escape key listener for mode switching
  useEffect(() => {
    if (isOpen) {
      // Load collections
      const loadCollections = async () => {
        setIsLoadingCollections(true)

        try {
          const data = await getAllCollectionsWithCounts()

          // Sort collections by creation date (newest first)
          const sortedData = data.sort((a, b) => b.createdAt - a.createdAt)

          setCollections(sortedData)

          // Auto-select the default collection for this target if it exists
          const defaultForTarget = sortedData.find(
            (c) => c.isDefault && c.name === target,
          )

          if (defaultForTarget) {
            setSelectedCollectionId(defaultForTarget.id)
          } else if (sortedData.length > 0 && sortedData[0]) {
            setSelectedCollectionId(sortedData[0].id)
          }
        } catch (error) {
          console.error('Failed to load collections:', error)

          showToast('error', t.toast.error.loadCollectionsFailed)
        } finally {
          setIsLoadingCollections(false)
        }
      }

      // Handle escape key for going back from create to select mode
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && modeRef.current === 'create') {
          event.stopPropagation()
          setMode('select')
          modeRef.current = 'select'
          setNewCollectionName('')
          setNameError(null)
        }
      }

      loadCollections()
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      // Reset state when closing
      setMode('select')
      modeRef.current = 'select'
      setSelectedCollectionId(null)
      setNewCollectionName('')
      setNewCollectionColor(DEFAULT_COLLECTION_COLOR as CollectionColor)
      setNameError(null)
    }
  }, [isOpen, target, t.toast.error.loadCollectionsFailed])

  // Handle saving to selected collection
  const handleSaveToCollection = async () => {
    if (!selectedCollectionId) {
      showToast('error', t.toast.error.selectCollection)

      return
    }

    setIsSaving(true)

    try {
      await savePrompt({
        originalPrompt,
        enhancedPrompt,
        target,
        collectionId: selectedCollectionId,
      })

      showToast('success', t.toast.success.promptSaved)
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to save prompt:', error)

      showToast('error', t.toast.error.saveFailed)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle saving to default collection (quick save)
  const handleQuickSave = async () => {
    setIsSaving(true)

    try {
      // Get or create the default collection for this target
      const collection = await getOrCreateDefaultCollection(target)

      await savePrompt({
        originalPrompt,
        enhancedPrompt,
        target,
        collectionId: collection.id,
      })

      showToast('success', `${t.toast.success.savedTo} "${collection.name}"`)
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to quick save:', error)

      showToast('error', t.toast.error.saveFailed)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle creating a new collection and saving
  const handleCreateAndSave = async () => {
    const trimmedName = newCollectionName.trim()

    if (!trimmedName) {
      setNameError(t.saved.collections.nameRequired)

      return
    }

    if (trimmedName.length > 50) {
      setNameError(t.saved.collections.nameTooLong)

      return
    }

    // Check for duplicate names
    if (
      collections.some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setNameError(t.saved.collections.nameExists)

      return
    }

    setIsSaving(true)
    setNameError(null)

    try {
      // Create the new collection
      const newCollection = await createCollection({
        name: trimmedName,
        color: newCollectionColor,
        isDefault: false,
      })

      // Save the prompt to the new collection
      await savePrompt({
        originalPrompt,
        enhancedPrompt,
        target,
        collectionId: newCollection.id,
      })

      showToast('success', `${t.toast.success.savedTo} "${newCollection.name}"`)
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to create collection and save:', error)

      showToast('error', t.toast.error.createFailed)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
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
        <h2
          id="save-dialog-title"
          className={cn('text-lg', 'font-semibold', 'text-gray-900')}
        >
          {mode === 'select'
            ? t.saveDialog.title
            : t.saveDialog.newCollectionTitle}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.saveDialog.closeDialog}
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
      <div className={cn('flex', 'flex-col', 'flex-1', 'min-h-0')}>
        {mode === 'select' ? (
          <>
            {/* Sticky header with quick save */}
            <div
              className={cn(
                'px-6',
                'pt-4',
                'pb-3',
                'border-b',
                'border-gray-100',
                'bg-white',
                'sticky',
                'top-0',
                'z-10',
              )}
            >
              <Button
                onClick={handleQuickSave}
                disabled={isSaving}
                isLoading={isSaving}
                icon={
                  !isSaving && <CheckIcon className="w-5 h-5" strokeWidth={2} />
                }
                className="w-full mb-4"
              >
                {t.saveDialog.quickSaveTo} &ldquo;{target}&rdquo;
              </Button>

              <div className={cn('flex', 'items-center', 'gap-3')}>
                <div className={cn('flex-1', 'h-px', 'bg-gray-200')} />
                <span
                  className={cn(
                    'text-xs',
                    'text-gray-500',
                    'uppercase',
                    'tracking-wider',
                  )}
                >
                  {t.saveDialog.orChooseCollection}
                  {!isLoadingCollections && collections.length > 0 && (
                    <span className={cn('ml-1', 'font-semibold')}>
                      ({collections.length})
                    </span>
                  )}
                </span>
                <div className={cn('flex-1', 'h-px', 'bg-gray-200')} />
              </div>
            </div>

            {/* Scrollable collections list */}
            <div
              className={cn(
                'overflow-y-auto',
                'overscroll-contain',
                'px-6',
                'py-4',
                'max-h-[232px]',
              )}
            >
              {isLoadingCollections ? (
                <div
                  className={cn(
                    'flex',
                    'items-center',
                    'justify-center',
                    'py-8',
                  )}
                >
                  <SpinnerIcon className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : collections.length === 0 ? (
                <div
                  className={cn(
                    'text-center',
                    'py-8',
                    'text-gray-500',
                    'text-sm',
                  )}
                >
                  {t.saveDialog.noCollectionsYet}
                </div>
              ) : (
                <div className={cn('space-y-2')}>
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => setSelectedCollectionId(collection.id)}
                      className={cn(
                        'w-full',
                        'flex',
                        'items-center',
                        'gap-3',
                        'px-4',
                        'min-h-[50px]',
                        'rounded-2xl',
                        'transition-all',
                        'focus:outline-none',
                        'focus-visible:ring-2',
                        'focus-visible:ring-[#007aff]',
                        'border-2',
                        selectedCollectionId === collection.id
                          ? 'border-[#007aff]'
                          : 'border-transparent hover:bg-black/[0.04]',
                      )}
                    >
                      <div
                        className={cn(
                          'w-8',
                          'h-8',
                          'rounded-lg',
                          'flex',
                          'items-center',
                          'justify-center',
                        )}
                        style={{ backgroundColor: `${collection.color}20` }}
                      >
                        <FolderIcon
                          className="w-4 h-4"
                          style={{ color: collection.color ?? '#007aff' }}
                        />
                      </div>
                      <div className={cn('flex-1', 'text-left', 'min-w-0')}>
                        <div
                          className={cn(
                            'text-sm',
                            'font-medium',
                            'truncate',
                            selectedCollectionId === collection.id
                              ? 'text-[#007aff]'
                              : 'text-gray-900',
                          )}
                        >
                          {collection.name}
                        </div>
                        <div
                          className={cn(
                            'text-xs',
                            'truncate',
                            selectedCollectionId === collection.id
                              ? 'text-[#007aff]/70'
                              : 'text-gray-500',
                          )}
                        >
                          {collection.promptCount}{' '}
                          {collection.promptCount === 1
                            ? t.saveDialog.prompt
                            : t.saveDialog.prompts}
                        </div>
                      </div>
                      {selectedCollectionId === collection.id && (
                        <CheckIcon
                          className="w-5 h-5 text-[#007aff]"
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Create new collection form */
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            <CreateCollectionForm
              name={newCollectionName}
              onNameChange={(value) => {
                setNewCollectionName(value)
                if (nameError) setNameError(null)
              }}
              color={newCollectionColor}
              onColorChange={setNewCollectionColor}
              nameError={nameError}
              showBackButton
              onBack={() => {
                setMode('select')
                modeRef.current = 'select'
                setNewCollectionName('')
                setNameError(null)
              }}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      {mode === 'select' ? (
        <div
          className={cn(
            'px-6',
            'py-4',
            'border-t',
            'border-gray-100',
            'bg-gray-50/80',
            'rounded-b-2xl',
            'sticky',
            'bottom-0',
          )}
        >
          {selectedCollectionId ? (
            <div className={cn('flex', 'gap-3')}>
              <Button
                onClick={() => {
                  setMode('create')
                  modeRef.current = 'create'
                }}
                icon={<FolderPlusIcon className="w-5 h-5" />}
                ariaLabel={t.saveDialog.orCreateNew}
                className="flex-1"
              />
              <Button
                onClick={handleSaveToCollection}
                isLoading={isSaving}
                icon={
                  !isSaving && <CheckIcon className="w-5 h-5" strokeWidth={2} />
                }
                ariaLabel={t.saveDialog.saveToSelected}
                className="flex-1 bg-[#34C759] hover:bg-[#2fb350] focus-visible:ring-[#34C759]"
              />
            </div>
          ) : (
            <Button
              onClick={() => {
                setMode('create')
                modeRef.current = 'create'
              }}
              icon={<FolderPlusIcon className="w-5 h-5" />}
              ariaLabel={t.saveDialog.orCreateNew}
              className="w-full"
            />
          )}
        </div>
      ) : mode === 'create' ? (
        <div
          className={cn(
            'px-6',
            'py-4',
            'border-t',
            'border-gray-100',
            'bg-gray-50/80',
            'rounded-b-2xl',
            'sticky',
            'bottom-0',
          )}
        >
          <Button
            onClick={handleCreateAndSave}
            disabled={!newCollectionName.trim()}
            isLoading={isSaving}
            className="w-full"
          >
            {t.saveDialog.createAndSave}
          </Button>
        </div>
      ) : null}
    </Dialog>
  )
}
