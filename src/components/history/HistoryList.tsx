'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import { pluralizeUk } from '@/lib/utils/pluralization'
import type { PromptHistoryEntry } from '@/types/history'
import {
  getAllPromptHistory,
  deletePromptHistory,
  clearAllPromptHistory,
} from '@/lib/db/prompt-history'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PromptCard from '@/components/common/PromptCard/PromptCard'
import PromptCardHeader from '../common/PromptCard/PromptCardHeader'
import PromptCardInfo from '../common/PromptCard/PromptCardInfo'
import TokenBadge from '../common/PromptCard/TokenBadge'
import HistoryPromptActions from './HistoryPromptActions'
import EmptyHistoryState from './EmptyHistoryState'
import Loading from '@/components/common/Loading'

/**
 * Displays the list of all prompt history entries.
 * Handles loading, empty states, and deletion of entries.
 */
export default function HistoryList() {
  const dict = useTranslations()
  const historyT = dict.history
  const commonT = dict.common
  const actionsT = commonT.actions

  const [entries, setEntries] = useState<PromptHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const history = await getAllPromptHistory()
      setEntries(history)
    } catch (err) {
      console.error('Failed to load history:', err)
      setError(historyT.error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load history entries on mount only.
  // loadHistory is intentionally excluded - we want to load once on mount,
  // and the retry button calls loadHistory directly when needed.
  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only effect
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deletePromptHistory(id)
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      console.error('Failed to delete entry:', err)

      setError(historyT.error)
    }
  }

  const handleClearAll = () => {
    setShowClearConfirm(true)
  }

  const confirmClearAll = async () => {
    setShowClearConfirm(false)
    try {
      await clearAllPromptHistory()
      setEntries([])
    } catch (err) {
      console.error('Failed to clear history:', err)

      setError(historyT.error)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div
        className={cn(
          // Layout
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          // Spacing
          'py-20',
          'gap-5',
        )}
      >
        <p
          className={cn(
            // Typography
            'text-base',
            'font-normal',
            'text-[#ff3b30]',
            'tracking-tight',
          )}
        >
          {error}
        </p>
        <button
          type="button"
          onClick={loadHistory}
          className={cn(
            // Typography
            'text-sm',
            'font-medium',
            // Colors
            'text-[#007aff]',
            'hover:opacity-70',
            // Spacing
            'px-5',
            'py-2.5',
            // Effects
            'transition-opacity',
            'duration-200',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
            'rounded-lg',
          )}
        >
          {actionsT.tryAgain}
        </button>
      </div>
    )
  }

  if (entries.length === 0) {
    return <EmptyHistoryState />
  }

  return (
    <div
      className={cn(
        // Layout
        'flex',
        'flex-col',
        // Spacing
        'gap-4',
      )}
    >
      {/* Header with clear button */}
      <div
        className={cn(
          // Layout
          'flex',
          'justify-between',
          'items-center',
        )}
      >
        <p
          className={cn(
            // Typography
            'text-sm',
            'font-normal',
            'text-[#86868b]',
            'tracking-tight',
          )}
        >
          {entries.length}{' '}
          {pluralizeUk(entries.length, [
            commonT.entry,
            commonT.entries,
            commonT.entriesMany,
          ])}
        </p>
        <button
          type="button"
          onClick={handleClearAll}
          className={cn(
            // Typography
            'text-sm',
            'font-normal',
            'text-[#86868b]',
            // Hover
            'hover:text-[#ff3b30]',
            // Spacing
            'px-4',
            // Effects
            'transition-colors',
            'duration-200',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#ff3b30]',
            'focus-visible:ring-offset-2',
            'rounded-lg',
          )}
        >
          {actionsT.clearAll}
        </button>
      </div>

      {/* History entries list */}
      <div
        className={cn(
          // Layout
          'flex',
          'flex-col',
          // Spacing
          'gap-4',
        )}
      >
        {entries.map((entry) => (
          <PromptCard
            key={entry.id}
            enhancedPrompt={entry.enhancedPrompt}
            variant="compact"
          >
            <PromptCardHeader
              LeftSideComponent={
                <PromptCardInfo
                  timestamp={entry.timestamp}
                  target={entry.target}
                />
              }
              RightSideComponent={
                <HistoryPromptActions
                  id={entry.id}
                  enhancedPrompt={entry.enhancedPrompt}
                  target={entry.target}
                  onDelete={handleDelete}
                />
              }
            />
            <div className={cn('px-4', 'pt-3')}>
              <TokenBadge text={entry.enhancedPrompt} target={entry.target} />
            </div>
          </PromptCard>
        ))}
      </div>

      {/* Clear all confirmation dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearAll}
        title={historyT.clearAll.title}
        description={historyT.clearAll.description}
        confirmText={historyT.clearAll.confirm}
        cancelText={actionsT.cancel}
        isDestructive
      />
    </div>
  )
}
