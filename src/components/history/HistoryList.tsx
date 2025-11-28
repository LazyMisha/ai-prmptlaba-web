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
          'py-20',
        )}
      >
        <p
          className={cn(
            // Typography
            'text-base',
            'font-normal',
            'text-[#86868b]',
            'tracking-tight',
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
        'gap-6',
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
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
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
            'py-2',
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
          'gap-4',
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
