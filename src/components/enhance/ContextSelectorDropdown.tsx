'use client'

import type { EnhancementTarget } from '@/types/enhance'
import { cn } from '@/lib/utils'
import SelectorIcon from '@/components/icons/SelectorIcon'

import { TOOL_CATEGORY_LIST } from '@/constants/tool-categories'

export interface TargetSelectorProps {
  /** Currently selected enhancement target */
  value: EnhancementTarget
  /** Callback fired when selection changes */
  onChange: (target: EnhancementTarget) => void
  /** Whether the selector is disabled */
  disabled?: boolean
  /** Label text for the selector */
  label: string
  /** Helper text displayed below the selector */
  helperText?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Dropdown selector for choosing the enhancement target platform.
 */
export default function ContextSelectorDropdown({
  value,
  onChange,
  disabled,
  label,
  helperText,
  className,
}: TargetSelectorProps) {
  return (
    <div className={className}>
      <label
        htmlFor="target-selector"
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
        {label}
      </label>

      <div className="relative">
        <select
          id="target-selector"
          value={value}
          onChange={(e) => onChange(e.target.value as EnhancementTarget)}
          disabled={disabled}
          aria-describedby="target-helper-text"
          className={cn(
            // Sizing
            'w-full',
            // Spacing
            'px-4',
            'py-3',
            'pr-10',
            // Typography
            'text-base',
            'font-normal',
            'text-gray-900',
            // Background - subtle frosted effect
            'bg-white/80',
            'backdrop-blur-sm',
            // Border
            'border',
            'border-gray-200',
            'rounded-xl',
            // Shadow - subtle depth
            'shadow-sm',
            // Appearance - hide default arrow
            'appearance-none',
            // Transition
            'transition-all',
            'duration-200',
            // Focus
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500/40',
            'focus:border-blue-500',
            'focus:bg-white',
            // Hover
            'hover:border-gray-300',
            'hover:bg-white',
            // Disabled state
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer',
          )}
        >
          {TOOL_CATEGORY_LIST.map(({ value: categoryValue, label }) => (
            <option key={categoryValue} value={categoryValue}>
              {label}
            </option>
          ))}
        </select>

        <div
          className={cn(
            // Position
            'absolute',
            'right-3',
            'top-1/2',
            '-translate-y-1/2',
            // Pointer events - allow clicks to pass through to select
            'pointer-events-none',
            // Color
            'text-gray-400',
          )}
        >
          <SelectorIcon
            className={cn(
              // Sizing
              'w-5',
              'h-5',
            )}
          />
        </div>
      </div>

      <p
        id="target-helper-text"
        className={cn(
          // Typography
          'text-xs',
          'font-light',
          'text-gray-500',
          // Spacing
          'mt-2',
        )}
      >
        {helperText}
      </p>
    </div>
  )
}
