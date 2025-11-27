'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { PromptHistoryEntry } from '@/types/history'
import {
  getAllPromptHistory,
  deletePromptHistory,
  clearAllPromptHistory,
} from '@/lib/db/prompt-history'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import HistoryItem from './HistoryItem'
import EmptyHistoryState from './EmptyHistoryState'

/**
 * Displays the list of all prompt history entries.
 * Handles loading, empty states, and deletion of entries.
 */
export default function HistoryList() {
  const [entries, setEntries] = useState<PromptHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Load history entries on mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const history = await getAllPromptHistory()
      setEntries(history)
    } catch (err) {
      console.error('Failed to load history:', err)

      setError('Failed to load prompt history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePromptHistory(id)
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      console.error('Failed to delete entry:', err)

      setError('Failed to delete history entry')
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

      setError('Failed to clear history')
    }
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          // Layout
          'flex',
          'items-center',
          'justify-center',
          // Spacing
          'py-16',
        )}
      >
        <p
          className={cn(
            // Typography
            'text-lg',
            'font-light',
            'text-gray-500',
          )}
        >
          Loading history...
        </p>
      </div>
    )
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
          'py-16',
          'gap-4',
        )}
      >
        <p
          className={cn(
            // Typography
            'text-lg',
            'font-light',
            'text-red-500',
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
            'font-light',
            // Colors
            'text-blue-600',
            'hover:text-blue-700',
            // Spacing
            'px-4',
            'py-2',
            // Effects
            'transition-colors',
            // Focus
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'rounded',
          )}
        >
          Try again
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
          // Spacing
          'mb-2',
        )}
      >
        <p
          className={cn(
            // Typography
            'text-sm',
            'font-light',
            'text-gray-500',
          )}
        >
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
        <button
          type="button"
          onClick={handleClearAll}
          className={cn(
            // Typography
            'text-sm',
            'font-light',
            'text-gray-400',
            // Hover
            'hover:text-red-500',
            // Spacing
            'px-3',
            'py-1',
            // Effects
            'transition-colors',
            // Focus
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-red-500',
            'focus:ring-offset-1',
            'rounded',
          )}
        >
          Clear all
        </button>
      </div>

      {/* History entries list */}
      <div
        className={cn(
          // Layout
          'flex',
          'flex-col',
          // Spacing
          'gap-3',
        )}
      >
        {entries.map((entry) => (
          <HistoryItem key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </div>

      {/* Clear all confirmation dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearAll}
        title="Clear all history?"
        description="This will permanently delete all your prompt history. This action cannot be undone."
        confirmText="Clear all"
        cancelText="Cancel"
        isDestructive
      />
    </div>
  )
}
