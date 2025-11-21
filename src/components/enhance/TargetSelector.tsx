'use client'

import type { EnhancementTarget } from '@/types/enhance'
import { TOOL_CATEGORY_LIST } from '@/constants/tool-categories'
import { cn } from '@/lib/utils'

interface TargetSelectorProps {
  value: EnhancementTarget
  onChange: (target: EnhancementTarget) => void
  disabled?: boolean
}

/**
 * Dropdown selector for choosing the enhancement target platform
 */
export default function TargetSelector({ value, onChange, disabled }: TargetSelectorProps) {
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
          // border radius
          'rounded',
        )}
        id="target-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as EnhancementTarget)}
        disabled={disabled}
      >
        {TOOL_CATEGORY_LIST.map(({ value: categoryValue, label }) => (
          <option key={categoryValue} value={categoryValue}>
            {label}
          </option>
        ))}
      </select>
      <div
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
