'use client'

import { useRef, useEffect } from 'react'
import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils'
import {
  COLLECTION_COLORS,
  DEFAULT_COLLECTION_COLOR,
} from '@/constants/saved-prompts'
import CheckIcon from '@/components/icons/CheckIcon'
import ChevronIcon from '@/components/icons/ChevronIcon'

import type { CollectionColor } from '@/constants/saved-prompts'

/**
 * Props for the CreateCollectionForm component.
 */
interface CreateCollectionFormProps {
  /** Current collection name value */
  name: string
  /** Callback when name changes */
  onNameChange: (name: string) => void
  /** Current selected color */
  color: CollectionColor
  /** Callback when color changes */
  onColorChange: (color: CollectionColor) => void
  /** Error message to display for name validation */
  nameError?: string | null
  /** Callback to clear name error */
  onClearNameError?: () => void
  /** Whether to show back button */
  showBackButton?: boolean
  /** Callback when back button is clicked */
  onBack?: () => void
  /** Whether to auto-focus the name input */
  autoFocus?: boolean
  /** Additional CSS classes for the container */
  className?: string
}

/**
 * A reusable form for creating new collections.
 */
export default function CreateCollectionForm({
  name,
  onNameChange,
  color,
  onColorChange,
  nameError,
  onClearNameError,
  showBackButton = false,
  onBack,
  autoFocus = false,
  className,
}: CreateCollectionFormProps) {
  const dict = useTranslations()
  const t = dict.saved.collections
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus name input when component mounts
  useEffect(() => {
    if (autoFocus && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [autoFocus])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value)

    if (nameError && onClearNameError) {
      onClearNameError()
    }
  }

  return (
    <div className={className}>
      {/* Back button */}
      {showBackButton && onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            // Layout
            'flex',
            'items-center',
            'gap-1',
            // Spacing
            'mb-4',
            // Typography
            'text-sm',
            'text-[#007aff]',
            // Hover
            'hover:text-[#0071e3]',
            // Transitions
            'transition-colors',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'rounded',
          )}
        >
          <ChevronIcon
            direction="left"
            className={cn(
              // Sizing
              'w-4',
              'h-4',
              // Color - inherit from parent
              'text-current',
            )}
          />
          {t.backToCollections}
        </button>
      )}

      {/* Name input */}
      <div className="mb-6">
        <label
          htmlFor="collection-name"
          className={cn(
            'block',
            'text-sm',
            'font-medium',
            'text-gray-700',
            'mb-1.5',
          )}
        >
          {t.collectionName}
        </label>
        <input
          ref={nameInputRef}
          id="collection-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder={t.namePlaceholder}
          maxLength={50}
          className={cn(
            // Sizing
            'w-full',
            // Spacing
            'px-4',
            'py-3',
            // Typography
            'text-base',
            // Border
            'border',
            nameError ? 'border-red-300' : 'border-gray-200',
            'rounded-xl',
            // Focus
            'focus:outline-none',
            'focus:ring-2',
            nameError ? 'focus:ring-red-500/50' : 'focus:ring-[#007aff]/50',
            'focus:border-transparent',
            // Placeholder
            'placeholder:text-gray-400',
            // Transitions
            'transition-colors',
          )}
        />
        {nameError && (
          <p className={cn('mt-1.5', 'text-sm', 'text-red-600')}>{nameError}</p>
        )}
      </div>

      {/* Color picker */}
      <div>
        <label
          className={cn(
            'block',
            'text-sm',
            'font-medium',
            'text-gray-700',
            'mb-2',
          )}
        >
          {t.collectionColor}
        </label>
        <div
          className={cn(
            // Grid layout - 5 columns on mobile for even distribution
            'grid',
            'grid-cols-5',
            'gap-3',
          )}
        >
          {COLLECTION_COLORS.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => onColorChange(colorOption)}
              aria-label={`Select color ${colorOption}`}
              aria-pressed={color === colorOption}
              className={cn(
                // Sizing
                'w-8',
                'h-8',
                // Shape
                'rounded-full',
                // Layout
                'flex',
                'items-center',
                'justify-center',
                // Transitions
                'transition-transform',
                // Hover
                'hover:scale-110',
                // Focus
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-gray-400',
                // Selected state
                color === colorOption && 'ring-2 ring-offset-2 ring-gray-400',
              )}
              style={{ backgroundColor: colorOption }}
            >
              {color === colorOption && (
                <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Re-export default color for convenience
export { DEFAULT_COLLECTION_COLOR }
