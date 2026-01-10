'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import type { Collection, SavedPrompt } from '@/types/saved-prompts'
import type { CollectionColor } from '@/constants/saved-prompts'
import { DEFAULT_COLLECTION_COLOR } from '@/constants/saved-prompts'
import {
  getAllCollections,
  getAllSavedPrompts,
  deleteSavedPrompt,
  deleteCollection,
  updateCollection,
  createCollection,
  moveSavedPrompt,
} from '@/lib/db/saved-prompts'
import { EmptySavedState } from './EmptySavedState'
import { CollectionSidebar } from './CollectionSidebar'
import PromptCard from '../common/PromptCard'
import MoveToCollectionSheet from './MoveToCollectionSheet'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ResponsiveDialog from '@/components/common/ResponsiveDialog'
import CreateCollectionForm from '@/components/common/CreateCollectionForm'
import { ToastContainer, showToast } from '@/components/common/Toast'
import Loading from '@/components/common/Loading'

// Hydration-safe client detection
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

/**
 * Props for the SavedPromptsClient component.
 */
interface SavedPromptsClientProps {
  /** Base path for links (includes locale, e.g., '/en') */
  basePath?: string
}

/**
 * SavedPromptsClient is the main client component for the saved prompts page.
 * It orchestrates loading data from IndexedDB, managing state, and rendering
 * the collection sidebar and prompt cards.
 */
export default function SavedPromptsClient({
  basePath = '',
}: SavedPromptsClientProps) {
  const dict = useTranslations()
  const savedT = dict.saved
  const toastT = dict.toast
  const actionsT = dict.common.actions

  const isClient = useIsClient()

  const [collections, setCollections] = useState<Collection[]>([])
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null)
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null)
  const [deleteCollectionId, setDeleteCollectionId] = useState<string | null>(
    null,
  )
  const [movePromptId, setMovePromptId] = useState<string | null>(null)
  const [renameCollectionId, setRenameCollectionId] = useState<string | null>(
    null,
  )
  const [renameValue, setRenameValue] = useState('')
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionColor, setNewCollectionColor] = useState<CollectionColor>(
    DEFAULT_COLLECTION_COLOR as CollectionColor,
  )
  const [newCollectionNameError, setNewCollectionNameError] = useState<
    string | null
  >(null)

  const promptCounts = savedPrompts.reduce(
    (acc, prompt) => {
      acc[prompt.collectionId] = (acc[prompt.collectionId] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const filteredPrompts =
    selectedCollectionId === null
      ? savedPrompts
      : savedPrompts.filter((p) => p.collectionId === selectedCollectionId)

  const loadData = async () => {
    if (!isClient) return
    try {
      setIsLoading(true)
      const [collectionsData, promptsData] = await Promise.all([
        getAllCollections(),
        getAllSavedPrompts(),
      ])
      setCollections(collectionsData)
      setSavedPrompts(promptsData)
    } catch (error) {
      console.error('Failed to load saved prompts:', error)
      showToast('error', toastT.error.loadFailed)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient])

  const handleDeletePrompt = async () => {
    if (!deletePromptId) return
    try {
      await deleteSavedPrompt(deletePromptId)
      setSavedPrompts((prev) => prev.filter((p) => p.id !== deletePromptId))
      showToast('success', toastT.success.promptDeleted)
    } catch (error) {
      console.error('Failed to delete prompt:', error)
      showToast('error', toastT.error.deleteFailed)
    } finally {
      setDeletePromptId(null)
    }
  }

  const handleDeleteCollection = async () => {
    if (!deleteCollectionId) return
    try {
      await deleteCollection(deleteCollectionId)
      setCollections((prev) => prev.filter((c) => c.id !== deleteCollectionId))
      setSavedPrompts((prev) =>
        prev.filter((p) => p.collectionId !== deleteCollectionId),
      )
      if (selectedCollectionId === deleteCollectionId) {
        setSelectedCollectionId(null)
      }
      showToast('success', toastT.success.collectionDeleted)
    } catch (error) {
      console.error('Failed to delete collection:', error)
      showToast('error', toastT.error.deleteCollectionFailed)
    } finally {
      setDeleteCollectionId(null)
    }
  }

  const handleRenameCollection = async () => {
    if (!renameCollectionId || !renameValue.trim()) return
    try {
      const updated = await updateCollection(renameCollectionId, {
        name: renameValue.trim(),
      })
      setCollections((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      )
      showToast('success', toastT.success.collectionRenamed)
    } catch (error) {
      console.error('Failed to rename collection:', error)
      showToast('error', toastT.error.renameFailed)
    } finally {
      setRenameCollectionId(null)
      setRenameValue('')
    }
  }

  const handleCreateCollection = async () => {
    const trimmedName = newCollectionName.trim()

    if (!trimmedName) {
      setNewCollectionNameError(savedT.collections.nameRequired)
      return
    }

    if (trimmedName.length > 50) {
      setNewCollectionNameError(savedT.collections.nameTooLong)
      return
    }

    // Check for duplicate names
    if (
      collections.some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setNewCollectionNameError(savedT.collections.nameExists)
      return
    }

    try {
      const newCollection = await createCollection({
        name: trimmedName,
        color: newCollectionColor,
      })
      setCollections((prev) => [...prev, newCollection])
      showToast('success', toastT.success.collectionCreated)
    } catch (error) {
      console.error('Failed to create collection:', error)
      showToast('error', toastT.error.createFailed)
    } finally {
      setShowCreateCollection(false)
      setNewCollectionName('')
      setNewCollectionColor(DEFAULT_COLLECTION_COLOR as CollectionColor)
      setNewCollectionNameError(null)
    }
  }

  const handleMovePrompt = async (targetCollectionId: string) => {
    if (!movePromptId) return
    try {
      const updated = await moveSavedPrompt(movePromptId, targetCollectionId)
      setSavedPrompts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      )
      showToast('success', toastT.success.promptMoved)
    } catch (error) {
      console.error('Failed to move prompt:', error)
      showToast('error', toastT.error.moveFailed)
    } finally {
      setMovePromptId(null)
    }
  }

  const openRenameDialog = (id: string) => {
    const collection = collections.find((c) => c.id === id)
    if (collection) {
      setRenameValue(collection.name)
      setRenameCollectionId(id)
    }
  }

  if (!isClient) {
    return null
  }

  if (isLoading) {
    return <Loading />
  }

  if (savedPrompts.length === 0) {
    return <EmptySavedState basePath={basePath} />
  }

  return (
    <>
      <div
        className={cn(
          'mt-8',
          'md:mt-10',
          'flex',
          'flex-col',
          'md:flex-row',
          'md:gap-8',
        )}
      >
        <aside
          className={cn(
            'w-full',
            'mb-6',
            'md:w-[280px]',
            'md:shrink-0',
            'md:mb-0',
            'md:sticky',
            'md:top-4',
            'md:self-start',
          )}
        >
          <CollectionSidebar
            collections={collections}
            selectedId={selectedCollectionId}
            promptCounts={promptCounts}
            onSelect={setSelectedCollectionId}
            onEdit={openRenameDialog}
            onDelete={setDeleteCollectionId}
            onCreate={() => setShowCreateCollection(true)}
          />
        </aside>

        <main className={cn('flex-1', 'min-w-0')}>
          {filteredPrompts.length === 0 ? (
            <div
              className={cn(
                'flex',
                'flex-col',
                'items-center',
                'justify-center',
                'py-16',
                'text-center',
              )}
            >
              <p className={cn('text-[#86868b]', 'text-[17px]')}>
                {savedT.noPromptsInCollection}
              </p>
            </div>
          ) : (
            <div className={cn('flex', 'flex-col', 'gap-4')}>
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  originalPrompt={prompt.originalPrompt}
                  enhancedPrompt={prompt.enhancedPrompt}
                  target={prompt.target}
                  timestamp={prompt.createdAt}
                  onDelete={setDeletePromptId}
                  onMove={setMovePromptId}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={deletePromptId !== null}
        title={savedT.prompts.delete}
        description={savedT.prompts.deleteConfirm}
        confirmText={actionsT.delete}
        cancelText={actionsT.cancel}
        isDestructive
        onConfirm={handleDeletePrompt}
        onClose={() => setDeletePromptId(null)}
      />

      <ConfirmDialog
        isOpen={deleteCollectionId !== null}
        title={savedT.collections.delete}
        description={savedT.deleteCollectionConfirm}
        confirmText={actionsT.delete}
        cancelText={actionsT.cancel}
        isDestructive
        onConfirm={handleDeleteCollection}
        onClose={() => setDeleteCollectionId(null)}
      />

      {/* Rename Collection Dialog */}
      <ResponsiveDialog
        isOpen={!!renameCollectionId}
        onClose={() => setRenameCollectionId(null)}
        title={savedT.collections.rename}
        maxWidth="sm"
        showCloseButton={false}
        footer={
          <div className={cn('flex', 'gap-3', 'justify-end', 'sm:justify-end')}>
            <button
              type="button"
              onClick={() => setRenameCollectionId(null)}
              className={cn(
                'px-5',
                'py-2.5',
                'text-[15px]',
                'font-medium',
                'text-[#86868b]',
                'rounded-xl',
                'hover:bg-black/[0.04]',
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
                'px-5',
                'py-2.5',
                'text-[15px]',
                'font-semibold',
                'text-white',
                'bg-[#007aff]',
                'rounded-xl',
                'hover:bg-[#0071e3]',
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
        }
      >
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
            if (e.key === 'Enter') handleRenameCollection()
            if (e.key === 'Escape') setRenameCollectionId(null)
          }}
        />
      </ResponsiveDialog>

      {/* Create Collection Dialog */}
      <ResponsiveDialog
        isOpen={showCreateCollection}
        onClose={() => {
          setShowCreateCollection(false)
          setNewCollectionName('')
          setNewCollectionColor(DEFAULT_COLLECTION_COLOR as CollectionColor)
          setNewCollectionNameError(null)
        }}
        title={savedT.collections.newCollection}
        maxWidth="md"
        footer={
          <button
            type="button"
            onClick={handleCreateCollection}
            disabled={!newCollectionName.trim()}
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
            {actionsT.create}
          </button>
        }
      >
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
      </ResponsiveDialog>

      {/* Move to Collection - Mobile Sheet */}
      <MoveToCollectionSheet
        isOpen={!!movePromptId}
        onClose={() => setMovePromptId(null)}
        collections={collections}
        currentCollectionId={
          savedPrompts.find((p) => p.id === movePromptId)?.collectionId
        }
        onSelect={handleMovePrompt}
      />

      <ToastContainer />
    </>
  )
}
