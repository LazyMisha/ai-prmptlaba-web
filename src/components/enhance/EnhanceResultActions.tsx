'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/client'
import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import BookmarkIcon from '@/components/icons/BookmarkIcon'
import SaveToCollectionDialog from '@/components/common/SaveToCollectionDialog'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface EnhanceResultActionsProps {
  /** The enhanced prompt text to save/copy */
  enhancedPrompt: string
  /** Target category for saving */
  target: string
}

/**
 * Right side action buttons for enhanced result card header.
 * Shows save and copy buttons with state management.
 */
export default function EnhanceResultActions({
  enhancedPrompt,
  target,
}: EnhanceResultActionsProps) {
  const dict = useTranslations()
  const t = dict.enhance

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [savedPrompt, setSavedPrompt] = useState<string | null>(null)
  const { copied, copy } = useCopyToClipboard()

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
        aria-label={
          isCurrentlySaved ? t.result.promptSaved : t.result.saveToCollection
        }
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
        aria-label={
          copied ? t.result.copiedToClipboard : t.result.copyToClipboard
        }
      >
        {copied ? (
          <CheckIcon className={cn('w-4', 'h-4', 'text-[#34c759]')} />
        ) : (
          <CopyIcon className={cn('w-4', 'h-4', 'text-[#86868b]')} />
        )}
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
