'use client'

import type { EnhancementTarget } from '@/types/enhance'
import { TOOL_CATEGORY_LIST } from '@/constants/tool-categories'
import { cn } from '@/lib/utils'

export interface TargetSelectorProps {
  /** Currently selected enhancement target */
  value: EnhancementTarget
  /** Callback fired when selection changes */
  onChange: (target: EnhancementTarget) => void
  /** Whether the selector is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Dropdown selector for choosing the enhancement target platform.
 * Includes accessibility features for keyboard navigation and screen readers.
 */
export default function TargetSelector({
  value,
  onChange,
  disabled,
  className,
}: TargetSelectorProps) {
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
        htmlFor="target-selector"
      >
        Target:
      </label>
      <select
        className={cn(
          // width full
          'w-full',
          // padding
          'p-2',
          // border
          'border',
          'border-gray-300',
          // border radius
          'rounded',
          // Focus styles for keyboard navigation
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-blue-500',
          'focus:border-transparent',
          // Disabled state
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        )}
        id="target-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as EnhancementTarget)}
        disabled={disabled}
        aria-describedby="target-helper-text"
        aria-label="Select target platform for prompt enhancement"
      >
        {TOOL_CATEGORY_LIST.map(({ value: categoryValue, label }) => (
          <option key={categoryValue} value={categoryValue}>
            {label}
          </option>
        ))}
      </select>
      <div
        id="target-helper-text"
        className={cn(
          // margin top
          'mt-1',
          // flex container
          'flex',
          // justify content
          'justify-center',
          // text small
          'text-sm',
          // text gray
          'text-gray-600',
        )}
      >
        <span>Choose the context for prompt optimization</span>
      </div>
    </div>
  )
}
