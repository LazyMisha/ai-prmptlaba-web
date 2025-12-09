'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { DEFAULT_COLLECTION_COLOR } from '@/constants/saved-prompts'
import {
  getAllCollectionsWithCounts,
  createCollection,
  savePrompt,
  getOrCreateDefaultCollection,
} from '@/lib/db/saved-prompts'
import { showToast } from '@/components/common/Toast'
import CheckIcon from '@/components/common/CheckIcon'
import CloseIcon from '@/components/common/CloseIcon'
import CreateCollectionButton from '@/components/common/CreateCollectionButton'
import CreateCollectionForm from '@/components/common/CreateCollectionForm'
import FolderIcon from '@/components/common/FolderIcon'
import SpinnerIcon from '@/components/common/SpinnerIcon'
import type { CollectionWithCount } from '@/types/saved-prompts'
import type { CollectionColor } from '@/constants/saved-prompts'

/**
 * Props for the SaveToCollectionDialog component.
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
 * Dialog for saving an enhanced prompt to a collection.
 * Allows selecting an existing collection or creating a new one.
 */
export default function SaveToCollectionDialog({
  isOpen,
  onClose,
  onSaved,
  originalPrompt,
  enhancedPrompt,
  target,
}: SaveToCollectionDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const modeRef = useRef<DialogMode>('select')

  const [mode, setMode] = useState<DialogMode>('select')
  const [collections, setCollections] = useState<CollectionWithCount[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)

  // New collection form state
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionColor, setNewCollectionColor] = useState<CollectionColor>(
    DEFAULT_COLLECTION_COLOR as CollectionColor,
  )
  const [nameError, setNameError] = useState<string | null>(null)

  // Load collections when dialog opens
  const loadCollections = async () => {
    setIsLoadingCollections(true)

    try {
      const data = await getAllCollectionsWithCounts()

      setCollections(data)

      // Auto-select the default collection for this target if it exists
      const defaultForTarget = data.find((c) => c.isDefault && c.name === target)

      if (defaultForTarget) {
        setSelectedCollectionId(defaultForTarget.id)
      } else if (data.length > 0 && data[0]) {
        setSelectedCollectionId(data[0].id)
      }
    } catch (error) {
      console.error('Failed to load collections:', error)

      showToast('error', 'Failed to load collections')
    } finally {
      setIsLoadingCollections(false)
    }
  }

  // Handle escape key to close dialog
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (modeRef.current === 'create') {
        setMode('select')
        modeRef.current = 'select'
        setNewCollectionName('')
        setNameError(null)
      } else {
        onClose()
      }
    }
  }

  // Focus management and keyboard listener
  useEffect(() => {
    if (isOpen) {
      loadCollections()

      // Add escape key listener
      document.addEventListener('keydown', handleKeyDown)

      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Handle saving to selected collection
  const handleSaveToCollection = async () => {
    if (!selectedCollectionId) {
      showToast('error', 'Please select a collection')

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

      showToast('success', 'Prompt saved successfully')
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to save prompt:', error)

      showToast('error', 'Failed to save prompt')
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

      showToast('success', `Saved to "${collection.name}"`)
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to quick save:', error)

      showToast('error', 'Failed to save prompt')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle creating a new collection and saving
  const handleCreateAndSave = async () => {
    const trimmedName = newCollectionName.trim()

    if (!trimmedName) {
      setNameError('Please enter a collection name')

      return
    }

    if (trimmedName.length > 50) {
      setNameError('Name must be 50 characters or less')

      return
    }

    // Check for duplicate names
    if (collections.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setNameError('A collection with this name already exists')

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

      showToast('success', `Saved to "${newCollection.name}"`)
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to create collection and save:', error)

      showToast('error', 'Failed to create collection')
    } finally {
      setIsSaving(false)
    }
  }

  // Client-side mounting detection for portal
  const subscribeToNothing = () => () => {}
  const getIsMounted = () => true
  const getServerSnapshot = () => false
  const isMounted = useSyncExternalStore(subscribeToNothing, getIsMounted, getServerSnapshot)

  if (!isOpen) {
    return null
  }

  // Don't render on server
  if (!isMounted) {
    return null
  }

  const dialogContent = (
    <div
      className={cn(
        // Position
        'fixed',
        'inset-0',
        'z-[100]',
        // Layout
        'flex',
        'items-end',
        'sm:items-center',
        'justify-center',
        // Background overlay
        'bg-black/50',
        'backdrop-blur-sm',
        // Animation
        'animate-in',
        'fade-in',
        'duration-200',
      )}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-dialog-title"
        className={cn(
          // Sizing
          'w-full',
          'sm:max-w-md',
          // Height
          'max-h-[90dvh]',
          'sm:max-h-[80vh]',
          // Background
          'bg-white',
          // Rounded corners - only top on mobile, all corners on desktop
          'rounded-t-3xl',
          'sm:rounded-2xl',
          // Shadow
          'shadow-2xl',
          // Animation
          'animate-in',
          'slide-in-from-bottom',
          'sm:zoom-in-95',
          'duration-200',
          // Overflow - clip footer to rounded corners
          'overflow-hidden',
          'flex',
          'flex-col',
        )}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {/* Header */}
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'px-5',
            'pt-2',
            'pb-4',
            'sm:py-4',
            'border-b',
            'border-gray-100',
            'flex-shrink-0',
          )}
        >
          <h2 id="save-dialog-title" className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
            {mode === 'select' ? 'Save to Collection' : 'New Collection'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              'p-2',
              '-mr-2',
              'rounded-full',
              'text-gray-500',
              'hover:bg-gray-100',
              'hover:text-gray-700',
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
        <div className={cn('flex-1', 'overflow-y-auto', 'overscroll-contain')}>
          {mode === 'select' ? (
            <div className="px-5 py-4">
              {/* Quick save button */}
              <button
                type="button"
                onClick={handleQuickSave}
                disabled={isSaving}
                className={cn(
                  'w-full',
                  'flex',
                  'items-center',
                  'justify-center',
                  'gap-2',
                  'px-4',
                  'py-3',
                  'mb-4',
                  'bg-[#007aff]',
                  'text-white',
                  'rounded-xl',
                  'font-medium',
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
                {isSaving ? (
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" strokeWidth={2} />
                    Quick Save to &ldquo;{target}&rdquo;
                  </>
                )}
              </button>

              <div className={cn('flex', 'items-center', 'gap-3', 'mb-4')}>
                <div className={cn('flex-1', 'h-px', 'bg-gray-200')} />
                <span className={cn('text-xs', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                  or choose collection
                </span>
                <div className={cn('flex-1', 'h-px', 'bg-gray-200')} />
              </div>

              {/* Collections list */}
              {isLoadingCollections ? (
                <div className={cn('flex', 'items-center', 'justify-center', 'py-8')}>
                  <SpinnerIcon className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : collections.length === 0 ? (
                <div className={cn('text-center', 'py-8', 'text-gray-500', 'text-sm')}>
                  No collections yet. Create your first one!
                </div>
              ) : (
                <div className={cn('space-y-2', 'mb-4')}>
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
                        'py-3',
                        'rounded-xl',
                        'transition-all',
                        'focus:outline-none',
                        'focus-visible:ring-2',
                        'focus-visible:ring-[#007aff]',
                        selectedCollectionId === collection.id
                          ? 'bg-[#007aff]/10 border-2 border-[#007aff]'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100',
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
                      <div className={cn('flex-1', 'text-left')}>
                        <div className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                          {collection.name}
                        </div>
                        <div className={cn('text-xs', 'text-gray-500')}>
                          {collection.promptCount}{' '}
                          {collection.promptCount === 1 ? 'prompt' : 'prompts'}
                        </div>
                      </div>
                      {selectedCollectionId === collection.id && (
                        <CheckIcon className="w-5 h-5 text-[#007aff]" strokeWidth={2.5} />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Create new collection button */}
              <CreateCollectionButton
                onClick={() => {
                  setMode('create')
                  modeRef.current = 'create'
                }}
              />
            </div>
          ) : (
            /* Create new collection form */
            <div className="px-5 py-4">
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

        {/* Footer */}
        {(mode === 'create' || (mode === 'select' && selectedCollectionId)) && (
          <div
            className={cn(
              'px-5',
              'pt-4',
              'pb-6',
              'sm:py-4',
              'border-t',
              'border-gray-100',
              'flex-shrink-0',
              'bg-gray-50/80',
            )}
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {mode === 'create' ? (
              <button
                type="button"
                onClick={handleCreateAndSave}
                disabled={isSaving || !newCollectionName.trim()}
                className={cn(
                  'w-full',
                  'flex',
                  'items-center',
                  'justify-center',
                  'gap-2',
                  'px-4',
                  'py-3',
                  'bg-[#007aff]',
                  'text-white',
                  'rounded-xl',
                  'font-medium',
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
                {isSaving ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Create & Save'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveToCollection}
                disabled={isSaving}
                className={cn(
                  'w-full',
                  'flex',
                  'items-center',
                  'justify-center',
                  'gap-2',
                  'px-4',
                  'py-3',
                  'bg-[#34C759]',
                  'text-white',
                  'rounded-xl',
                  'font-medium',
                  'transition-colors',
                  'hover:bg-[#2fb350]',
                  'active:opacity-80',
                  'focus:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[#34C759]',
                  'focus-visible:ring-offset-2',
                  'disabled:opacity-50',
                  'disabled:cursor-not-allowed',
                )}
              >
                {isSaving ? (
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" strokeWidth={2} />
                    Save to Selected Collection
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
