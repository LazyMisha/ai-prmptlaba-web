'use client'

import { useState, useEffect } from 'react'
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
import PromptCard from '../common/PromptCard/PromptCard'
import PromptCardHeader from '../common/PromptCard/PromptCardHeader'
import PromptCardInfo from '../common/PromptCard/PromptCardInfo'
import TokenBadge from '../common/PromptCard/TokenBadge'
import SavedPromptActions from './SavedPromptActions'
import MoveToCollectionDialog from './MoveToCollectionDialog'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import RenameCollectionDialog from './RenameCollectionDialog'
import CreateCollectionDialog from './CreateCollectionDialog'
import { showToast } from '@/components/common/Toast'
import Loading from '@/components/common/Loading'

/**
 * Main component for saved prompts page. Manages collections, saved prompts,
 * and their interactions (create, rename, delete, move).
 */
export default function SavedPrompts() {
  const dict = useTranslations()
  const savedT = dict.saved
  const toastT = dict.toast
  const actionsT = dict.common.actions

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

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
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

    loadData()
  }, [toastT.error.loadFailed])

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

  if (isLoading) {
    return <Loading />
  }

  if (savedPrompts.length === 0) {
    return <EmptySavedState />
  }

  return (
    <>
      <div className={cn('flex', 'flex-col', 'md:flex-row', 'gap-4')}>
        <aside
          className={cn(
            'w-full',
            'md:w-[280px]',
            'md:shrink-0',
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
                  enhancedPrompt={prompt.enhancedPrompt}
                >
                  <PromptCardHeader
                    LeftSideComponent={
                      <PromptCardInfo
                        timestamp={prompt.createdAt}
                        target={prompt.target}
                      />
                    }
                    RightSideComponent={
                      <SavedPromptActions
                        id={prompt.id}
                        enhancedPrompt={prompt.enhancedPrompt}
                        onDelete={setDeletePromptId}
                        onMove={setMovePromptId}
                      />
                    }
                  />
                  <div className={cn('px-4', 'pt-3')}>
                    <TokenBadge
                      text={prompt.enhancedPrompt}
                      target={prompt.target}
                    />
                  </div>
                </PromptCard>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Prompt Confirmation Dialog */}
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

      {/* Delete Collection Confirmation Dialog */}
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

      <RenameCollectionDialog
        renameCollectionId={renameCollectionId}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
        setRenameCollectionId={setRenameCollectionId}
        handleRenameCollection={handleRenameCollection}
      />

      <CreateCollectionDialog
        showCreateCollection={showCreateCollection}
        setShowCreateCollection={setShowCreateCollection}
        newCollectionName={newCollectionName}
        setNewCollectionName={setNewCollectionName}
        newCollectionColor={newCollectionColor}
        setNewCollectionColor={setNewCollectionColor}
        newCollectionNameError={newCollectionNameError}
        setNewCollectionNameError={setNewCollectionNameError}
        handleCreateCollection={handleCreateCollection}
      />

      <MoveToCollectionDialog
        isOpen={!!movePromptId}
        onClose={() => setMovePromptId(null)}
        collections={collections}
        currentCollectionId={
          savedPrompts.find((p) => p.id === movePromptId)?.collectionId || ''
        }
        onSelect={handleMovePrompt}
      />
    </>
  )
}
