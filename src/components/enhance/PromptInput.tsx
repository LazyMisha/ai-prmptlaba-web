'use client'

import { cn } from '@/lib/utils'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string | null
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

/**
 * Textarea input for the user's raw prompt
 */
export default function PromptInput({
  value,
  onChange,
  disabled,
  error,
  onKeyDown,
}: PromptInputProps) {
  const charCount = value.length
  const minChars = 3
  const maxChars = 2000

  return (
    <div>
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
          // border radius
          'rounded',
          // font family
          'font-sans',
          // min height
          'min-h-[120px]',
        )}
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="e.g., write a post about my promotion"
        rows={6}
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
        <span>
          {charCount < minChars && charCount > 0
            ? `At least ${minChars - charCount} more character${minChars - charCount === 1 ? '' : 's'} required`
            : charCount > maxChars
              ? `${charCount - maxChars} character${charCount - maxChars === 1 ? '' : 's'} over limit`
              : 'Enter your prompt to enhance'}
        </span>
        <span>
          {charCount} / {maxChars}
        </span>
      </div>
      {error && (
        <p
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
