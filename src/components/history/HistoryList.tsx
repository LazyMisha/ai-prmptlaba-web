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
import PromptCard from '@/components/common/PromptCard'
import EmptyHistoryState from './EmptyHistoryState'

/**
 * History translations.
 */
interface HistoryTranslations {
  loading: string
  error: string
  empty: {
    title: string
    description: string
  }
  clearAll: {
    title: string
    description: string
    confirm: string
  }
}

/**
 * Prompt card translations.
 */
interface PromptCardTranslations {
  target: string
  original: string
  enhanced: string
  expandCollapse: string
  deleteEntry: string
}

/**
 * Action translations.
 */
interface ActionTranslations {
  copy: string
  copied: string
  cancel: string
  tryAgain: string
  clearAll: string
}

/**
 * Common translations.
 */
interface CommonTranslations {
  entry: string
  entries: string
}

/**
 * All translations for HistoryList.
 */
interface HistoryListTranslations {
  history: HistoryTranslations
  promptCard: PromptCardTranslations
  actions: ActionTranslations
  common?: CommonTranslations
}

/**
 * Props for the HistoryList component.
 */
interface HistoryListProps {
  /** Translations for the component */
  translations?: HistoryListTranslations
}

/**
 * Displays the list of all prompt history entries.
 * Handles loading, empty states, and deletion of entries.
 */
export default function HistoryList({ translations }: HistoryListProps) {
  // Default translations
  const t = translations ?? {
    history: {
      loading: 'Loading history...',
      error: 'Failed to load prompt history',
      empty: {
        title: 'No prompt history yet',
        description: 'Your enhanced prompts will appear here',
      },
      clearAll: {
        title: 'Clear all history?',
        description:
          'This will permanently delete all your prompt history. This action cannot be undone.',
        confirm: 'Clear all',
      },
    },
    promptCard: {
      target: 'Target',
      original: 'Original',
      enhanced: 'Enhanced',
      expandCollapse: 'Click to expand',
      deleteEntry: 'Delete this entry',
    },
    actions: {
      copy: 'Copy',
      copied: 'Copied',
      cancel: 'Cancel',
      tryAgain: 'Try again',
      clearAll: 'Clear all',
    },
    common: {
      entry: 'entry',
      entries: 'entries',
    },
  }

  // Get common translations with defaults
  const commonT = t.common ?? { entry: 'entry', entries: 'entries' }

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

      setError(t.history.error)
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

      setError(t.history.error)
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

      setError(t.history.error)
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
          {t.history.loading}
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
          {t.actions.tryAgain}
        </button>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <EmptyHistoryState
        translations={{
          title: t.history.empty.title,
          description: t.history.empty.description,
        }}
      />
    )
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
          {entries.length}{' '}
          {entries.length === 1 ? commonT.entry : commonT.entries}
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
          {t.actions.clearAll}
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
            id={entry.id}
            originalPrompt={entry.originalPrompt}
            enhancedPrompt={entry.enhancedPrompt}
            target={entry.target}
            timestamp={entry.timestamp}
            onDelete={handleDelete}
            translations={t.promptCard}
          />
        ))}
      </div>

      {/* Clear all confirmation dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearAll}
        title={t.history.clearAll.title}
        description={t.history.clearAll.description}
        confirmText={t.history.clearAll.confirm}
        cancelText={t.actions.cancel}
        isDestructive
      />
    </div>
  )
}
