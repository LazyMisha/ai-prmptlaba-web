'use client'

import { cn } from '@/lib/utils'

/**
 * Translations for PromptInput.
 */
interface PromptInputTranslations {
  label: string
  placeholder: string
  helperText: string
  moreCharNeeded: string
  moreCharsNeeded: string
  overLimit: string
}

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
  /** Translations for the component */
  translations?: PromptInputTranslations
  /** Additional CSS classes */
  className?: string
}

/**
 * Textarea input for the user's raw prompt.
 */
export default function PromptInput({
  value,
  onChange,
  disabled,
  error,
  onKeyDown,
  translations,
  className,
}: PromptInputProps) {
  // Default translations
  const t = translations ?? {
    label: 'Your Prompt',
    placeholder: 'e.g., write a post about my promotion',
    helperText: 'Press ⌘/Ctrl + Enter to enhance',
    moreCharNeeded: 'more character needed',
    moreCharsNeeded: 'more characters needed',
    overLimit: 'over limit',
  }

  const charCount = value.length
  const minChars = 3
  const maxChars = 2000

  const isOverMaximum = charCount > maxChars
  const hasError = error || isOverMaximum

  return (
    <div className={className}>
      <label
        htmlFor="prompt-input"
        className={cn(
          // Typography
          'text-sm',
          'font-medium',
          'text-gray-700',
          // Layout
          'block',
          // Spacing
          'mb-2',
        )}
      >
        {t.label}
      </label>

      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={t.placeholder}
        rows={6}
        aria-describedby="prompt-char-count prompt-helper-text prompt-error"
        aria-invalid={hasError ? true : undefined}
        aria-required="true"
        className={cn(
          // Sizing
          'w-full',
          'min-h-[140px]',
          // Spacing
          'px-4',
          'py-3',
          // Typography
          'text-base',
          'font-normal',
          'text-gray-900',
          'placeholder:text-gray-400',
          'placeholder:font-light',
          // Background - subtle frosted effect
          'bg-white/80',
          'backdrop-blur-sm',
          // Border
          'border',
          hasError ? 'border-red-400' : 'border-gray-200',
          'rounded-xl',
          // Shadow - subtle depth
          'shadow-sm',
          // Resize
          'resize-y',
          // Transition
          'transition-all',
          'duration-200',
          // Focus
          'focus:outline-none',
          'focus:ring-2',
          hasError ? 'focus:ring-red-500/40' : 'focus:ring-blue-500/40',
          hasError ? 'focus:border-red-400' : 'focus:border-blue-500',
          'focus:bg-white',
          // Hover
          !hasError && 'hover:border-gray-300',
          'hover:bg-white',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      />

      {/* Footer with helper text and character count */}
      <div
        className={cn(
          // Layout
          'flex',
          'justify-between',
          'items-center',
          // Spacing
          'mt-2',
          // Typography
          'text-xs',
          'font-light',
        )}
      >
        <span
          id="prompt-helper-text"
          className={cn(
            charCount < minChars && charCount > 0
              ? 'text-amber-600'
              : isOverMaximum
                ? 'text-red-500'
                : 'text-gray-500',
          )}
        >
          {charCount < minChars && charCount > 0
            ? `${minChars - charCount} ${minChars - charCount === 1 ? t.moreCharNeeded : t.moreCharsNeeded}`
            : isOverMaximum
              ? `${charCount - maxChars} ${t.overLimit}`
              : t.helperText}
        </span>

        <span
          id="prompt-char-count"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            'tabular-nums',
            isOverMaximum ? 'text-red-500' : 'text-gray-400',
          )}
        >
          {charCount.toLocaleString()} / {maxChars.toLocaleString()}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p
          id="prompt-error"
          role="alert"
          className={cn(
            // Spacing
            'mt-2',
            // Typography
            'text-sm',
            'font-light',
            'text-red-500',
          )}
        >
          {error}
        </p>
      )}
    </div>
  )
}
