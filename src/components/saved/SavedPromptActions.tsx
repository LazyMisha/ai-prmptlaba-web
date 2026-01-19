'use client'

import { cn } from '@/lib/utils'
import CheckIcon from '@/components/icons/CheckIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import FolderMoveIcon from '@/components/icons/FolderMoveIcon'
import { useTranslations } from '@/i18n/client'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface SavedPromptActionsProps {
  /** Unique identifier for the prompt entry */
  id: string
  /** The enhanced prompt text */
  enhancedPrompt: string
  /** Callback when delete action is triggered */
  onDelete: (id: string) => void
  /** Callback when move action is triggered */
  onMove: (id: string) => void
}

const SavedPromptActions = ({
  id,
  enhancedPrompt,
  onDelete,
  onMove,
}: SavedPromptActionsProps) => {
  const { copied, copy } = useCopyToClipboard()

  const dict = useTranslations()
  const t = dict.promptCard

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copy(enhancedPrompt)
  }

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMove(id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <>
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
        onClick={handleMove}
        className={cn(
          'p-2',
          'rounded-lg',
          'hover:bg-black/[0.05]',
          'transition-colors',
          'duration-200',
          'min-h-[44px]',
          'min-w-[44px]',
          'flex',
          'items-center',
          'justify-center',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
        )}
        aria-label={t.moveToAnother}
      >
        <FolderMoveIcon className={cn('w-4', 'h-4', 'text-[#86868b]')} />
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
    </>
  )
}

export default SavedPromptActions
