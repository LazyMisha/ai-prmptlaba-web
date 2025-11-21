'use client'

import { cn } from '@/lib/utils'

export interface PromptInputProps {
  /** Current value of the textarea */
  value: string
  /** Callback fired when value changes */
  onChange: (value: string) => void
  /** Whether the input is disabled */
  disabled?: boolean
  /** Error message to display */
  error?: string | null
  /** Callback for keydown events */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Textarea input for the user's raw prompt with validation feedback.
 * Includes character counting and accessibility features.
 */
export default function PromptInput({
  value,
  onChange,
  disabled,
  error,
  onKeyDown,
  className,
}: PromptInputProps) {
  const charCount = value.length
  const minChars = 3
  const maxChars = 2000

  const isOverMaximum = charCount > maxChars
  const hasError = error || isOverMaximum

  return (
    <div className={className}>
      <label
        className={cn(
          // font weight
          'font-medium',
          // margin bottom
          'mb-2',
          // display block
          'block',
          // text alignment
          'text-left',
        )}
        htmlFor="prompt-input"
      >
        Your Prompt:
      </label>
      <textarea
        className={cn(
          // width full
          'w-full',
          // padding
          'p-2',
          // border
          'border',
          // border color based on error state
          hasError ? 'border-red-500' : 'border-gray-300',
          // border radius
          'rounded',
          // font family
          'font-sans',
          // min height
          'min-h-[120px]',
          // Focus styles for keyboard navigation
          'focus:outline-none',
          'focus:ring-2',
          hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500',
          'focus:border-transparent',
        )}
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="e.g., write a post about my promotion"
        rows={6}
        aria-describedby="prompt-char-count prompt-helper-text prompt-error"
        aria-invalid={hasError ? true : undefined}
        aria-required="true"
      />
      <div
        className={cn(
          // margin top
          'mt-1',
          // flex container
          'flex',
          // justify between
          'justify-between',
          // text small
          'text-sm',
          // text gray
          'text-gray-600',
        )}
      >
        <span id="prompt-helper-text">
          {charCount < minChars && charCount > 0
            ? `At least ${minChars - charCount} more character${minChars - charCount === 1 ? '' : 's'} required`
            : charCount > maxChars
              ? `${charCount - maxChars} character${charCount - maxChars === 1 ? '' : 's'} over limit`
              : 'Enter your prompt to enhance'}
        </span>
        <span id="prompt-char-count" aria-live="polite" aria-atomic="true">
          {charCount} / {maxChars}
        </span>
      </div>
      {error && (
        <p
          id="prompt-error"
          role="alert"
          className={cn(
            // margin top
            'mt-2',
            // text red
            'text-red-600',
            // text small
            'text-sm',
          )}
        >
          {error}
        </p>
      )}
    </div>
  )
}
