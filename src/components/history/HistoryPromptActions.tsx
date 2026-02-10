'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import BookmarkIcon from '@/components/icons/BookmarkIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { useTranslations } from '@/i18n/client'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import SaveToCollectionDialog from '@/components/common/SaveToCollectionDialog'

interface HistoryPromptActionsProps {
  /** Unique identifier for the prompt entry */
  id: string
  /** The enhanced prompt text */
  enhancedPrompt: string
  /** Target tool category */
  target: string
  /** Callback when delete action is triggered */
  onDelete: (id: string) => void
}

const HistoryPromptActions = ({
  id,
  enhancedPrompt,
  target,
  onDelete,
}: HistoryPromptActionsProps) => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [savedPrompt, setSavedPrompt] = useState<string | null>(null)
  const { copied, copy } = useCopyToClipboard()

  const dict = useTranslations()
  const t = dict.promptCard

  const isCurrentlySaved =
    savedPrompt !== null && savedPrompt === enhancedPrompt

  const handleSaved = () => {
    setSavedPrompt(enhancedPrompt)
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copy(enhancedPrompt)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isCurrentlySaved) {
      setIsSaveDialogOpen(true)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isCurrentlySaved}
        className={cn(
          'p-2',
          'rounded-lg',
          'transition-colors',
          'duration-200',
          'min-h-[44px]',
          'min-w-[44px]',
          'flex',
          'items-center',
          'justify-center',
          isCurrentlySaved
            ? 'bg-[#007aff]/10 cursor-default'
            : 'hover:bg-black/[0.05]',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
          'disabled:cursor-default',
        )}
        aria-label={isCurrentlySaved ? t.promptSaved : t.saveToCollection}
      >
        <BookmarkIcon
          className={cn(
            'w-4',
            'h-4',
            isCurrentlySaved ? 'text-[#007aff]' : 'text-[#86868b]',
          )}
          filled={isCurrentlySaved}
        />
      </button>

      <button
        onClick={handleCopy}
        className={cn(
          'p-2',
          'rounded-lg',
          'transition-colors',
          'duration-200',
          'min-h-[44px]',
          'min-w-[44px]',
          'flex',
          'items-center',
          'justify-center',
          copied ? 'bg-[#34c759]/10' : 'hover:bg-black/[0.05]',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
        )}
        aria-label={copied ? t.copiedToClipboard : t.copyToClipboard}
      >
        {copied ? (
          <CheckIcon className={cn('w-4', 'h-4', 'text-[#34c759]')} />
        ) : (
          <CopyIcon className={cn('w-4', 'h-4', 'text-[#86868b]')} />
        )}
      </button>
      <button
        onClick={handleDelete}
        className={cn(
          'p-2',
          'rounded-lg',
          'hover:bg-[#ff3b30]/10',
          'transition-colors',
          'duration-200',
          'min-h-[44px]',
          'min-w-[44px]',
          'flex',
          'items-center',
          'justify-center',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#ff3b30]',
          'focus-visible:ring-offset-2',
        )}
        aria-label={t.deleteEntry}
      >
        <TrashIcon
          className={cn('w-4', 'h-4', 'text-[#86868b]', 'hover:text-[#ff3b30]')}
        />
      </button>

      {/* Save to Collection Dialog */}
      <SaveToCollectionDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSaved={handleSaved}
        enhancedPrompt={enhancedPrompt}
        target={target}
      />
    </>
  )
}

export default HistoryPromptActions
