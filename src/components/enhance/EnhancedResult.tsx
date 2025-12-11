'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CloseIcon from '@/components/icons/CloseIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import ChevronIcon from '@/components/icons/ChevronIcon'
import CopyIcon from '@/components/icons/CopyIcon'
import IconTextButton from '@/components/common/IconTextButton'
import BookmarkIcon from '@/components/icons/BookmarkIcon'
import SaveToCollectionDialog from '@/components/common/SaveToCollectionDialog'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

/**
 * Result translations for EnhancedResult.
 */
interface ResultTranslations {
  ariaLabel: string
  title: string
  error: string
  viewOriginal: string
  copyToClipboard: string
  copiedToClipboard: string
  promptSaved: string
  saveToCollection: string
}

/**
 * Action translations for EnhancedResult.
 */
interface ActionTranslations {
  copy: string
  copied: string
  save: string
  saved: string
}

/**
 * Save dialog translations for EnhancedResult.
 */
interface SaveDialogTranslations {
  title?: string
  newCollectionTitle?: string
  closeDialog?: string
  quickSaveTo?: string
  orChooseCollection?: string
  noCollectionsYet?: string
  prompt?: string
  prompts?: string
  createAndSave?: string
  saveToSelected?: string
}

/**
 * All translations for EnhancedResult.
 */
interface EnhancedResultTranslations {
  result: ResultTranslations
  actions: ActionTranslations
  saveDialog?: SaveDialogTranslations
}

export interface EnhancedResultProps {
  /** The enhanced prompt text */
  enhanced: string | null
  /** Error message if enhancement failed */
  error: string | null
  /** Original prompt for comparison */
  originalPrompt: string
  /** The target tool category used for enhancement */
  target: string
  /** Whether enhancement is in progress */
  isLoading?: boolean
  /** Translations for the component */
  translations?: EnhancedResultTranslations
  /** Additional CSS classes */
  className?: string
}

/**
 * Display component for the enhanced prompt result.
 */
export default function EnhancedResult({
  enhanced,
  error,
  originalPrompt,
  target,
  isLoading,
  translations,
  className,
}: EnhancedResultProps) {
  // Default translations
  const t = translations ?? {
    result: {
      ariaLabel: 'Enhanced prompt result',
      title: 'Enhanced Prompt',
      error: 'Enhancement Failed',
      viewOriginal: 'View original prompt',
      copyToClipboard: 'Copy to clipboard',
      copiedToClipboard: 'Copied to clipboard',
      promptSaved: 'Prompt saved',
      saveToCollection: 'Save prompt to collection',
    },
    actions: {
      copy: 'Copy',
      copied: 'Copied',
      save: 'Save',
      saved: 'Saved',
    },
  }

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  // Store the prompt that was saved, so we can check if current prompt matches
  const [savedPrompt, setSavedPrompt] = useState<string | null>(null)
  const { copied, copy } = useCopyToClipboard()

  // Check if the current enhanced prompt has been saved
  const isCurrentlySaved = savedPrompt !== null && savedPrompt === enhanced

  // Update saved prompt when saving
  const handleSaved = () => {
    setSavedPrompt(enhanced)
  }

  // Don't show previous results while loading
  if (isLoading) {
    return null
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          // Spacing
          'p-5',
          'mt-6',
          // Background - subtle red tint
          'bg-red-50/80',
          'backdrop-blur-sm',
          // Border
          'border',
          'border-red-200',
          'rounded-2xl',
          // Shadow
          'shadow-sm',
          className,
        )}
      >
        <div className="flex items-start gap-3">
          {/* Error icon */}
          <div
            className={cn(
              'flex-shrink-0',
              'w-8',
              'h-8',
              'flex',
              'items-center',
              'justify-center',
              'bg-red-100',
              'rounded-full',
            )}
          >
            <CloseIcon className="w-4 h-4 text-red-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-base',
                'font-semibold',
                'text-red-900',
                'mb-1',
              )}
            >
              {t.result.error}
            </h3>
            <p className={cn('text-sm', 'font-light', 'text-red-700')}>
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!enhanced) {
    return null
  }

  return (
    <div
      role="region"
      aria-label={t.result.ariaLabel}
      aria-live="polite"
      className={cn(
        // Spacing
        'mt-6',
        // Background - subtle success tint with frosted effect
        'bg-gradient-to-b',
        'from-emerald-50/80',
        'to-white/80',
        'backdrop-blur-sm',
        // Border
        'border',
        'border-emerald-200',
        'rounded-2xl',
        // Shadow
        'shadow-sm',
        // Overflow
        'overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex',
          'justify-between',
          'items-center',
          'gap-3',
          'px-4',
          'sm:px-5',
          'py-3',
          'sm:py-4',
          'border-b',
          'border-emerald-100',
        )}
      >
        <div className="flex items-center gap-2">
          {/* Success icon */}
          <div
            className={cn(
              'w-6',
              'h-6',
              'flex',
              'items-center',
              'justify-center',
              'bg-emerald-100',
              'rounded-full',
            )}
          >
            <CheckIcon
              className="w-3.5 h-3.5 text-emerald-600"
              strokeWidth={2.5}
            />
          </div>
          <h3
            className={cn(
              'text-sm',
              'sm:text-base',
              'font-semibold',
              'text-emerald-900',
              'whitespace-nowrap',
            )}
          >
            {t.result.title}
          </h3>
        </div>

        <div className={cn('flex', 'items-center', 'gap-2', 'shrink-0')}>
          {/* Save button */}
          <IconTextButton
            icon={
              <BookmarkIcon className="w-4 h-4" filled={isCurrentlySaved} />
            }
            label={isCurrentlySaved ? t.actions.saved : t.actions.save}
            onClick={() => !isCurrentlySaved && setIsSaveDialogOpen(true)}
            disabled={isCurrentlySaved}
            variant={isCurrentlySaved ? 'primary' : 'default'}
            ariaLabel={
              isCurrentlySaved
                ? t.result.promptSaved
                : t.result.saveToCollection
            }
          />

          <IconTextButton
            icon={
              copied ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )
            }
            label={copied ? t.actions.copied : t.actions.copy}
            onClick={() => copy(enhanced)}
            variant={copied ? 'success' : 'default'}
            ariaLabel={
              copied ? t.result.copiedToClipboard : t.result.copyToClipboard
            }
          />
        </div>
      </div>

      {/* Save to Collection Dialog */}
      <SaveToCollectionDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSaved={handleSaved}
        originalPrompt={originalPrompt}
        enhancedPrompt={enhanced}
        target={target}
        translations={translations?.saveDialog}
      />

      {/* Enhanced prompt content */}
      <div className="p-5">
        <div
          className={cn(
            // Background
            'bg-white',
            // Spacing
            'p-4',
            // Border
            'border',
            'border-gray-200',
            'rounded-xl',
            // Alignment
            'text-left',
          )}
        >
          <p
            className={cn(
              'whitespace-pre-wrap',
              'font-mono',
              'text-sm',
              'text-gray-900',
              'leading-relaxed',
            )}
          >
            {enhanced}
          </p>
        </div>

        {/* Original prompt collapsible */}
        {originalPrompt && (
          <details className="mt-4 group">
            <summary
              className={cn(
                // Layout
                'flex',
                'items-center',
                'gap-2',
                // Typography
                'text-sm',
                'font-medium',
                'text-gray-500',
                // Cursor
                'cursor-pointer',
                // Transition
                'transition-colors',
                'duration-200',
                // Hover
                'hover:text-gray-700',
                // Focus
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-blue-500/50',
                'rounded-lg',
                'px-2',
                'py-1',
                '-ml-2',
                // Hide default marker
                'list-none',
                '[&::-webkit-details-marker]:hidden',
              )}
            >
              <ChevronIcon
                className={cn(
                  // Sizing
                  'w-4',
                  'h-4',
                  // Rotation - starts pointing right, rotates to down when open
                  '-rotate-90',
                  'group-open:rotate-0',
                )}
              />
              {t.result.viewOriginal}
            </summary>

            <div
              className={cn(
                // Spacing
                'mt-3',
                'p-4',
                // Background
                'bg-gray-50',
                // Border
                'border',
                'border-gray-200',
                'rounded-xl',
                // Alignment
                'text-left',
              )}
            >
              <p
                className={cn(
                  'whitespace-pre-wrap',
                  'font-mono',
                  'text-sm',
                  'text-gray-600',
                  'leading-relaxed',
                )}
              >
                {originalPrompt}
              </p>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
