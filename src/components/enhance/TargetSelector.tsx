'use client'

import type { EnhancementTarget } from '@/types/enhance'
import { ENHANCEMENT_TARGETS } from '@/types/enhance'
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
        )}
        htmlFor="target-selector"
      >
        Target Platform
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
        {ENHANCEMENT_TARGETS.map((target) => (
          <option key={target} value={target}>
            {target}
          </option>
        ))}
      </select>
      <p
        className={cn(
          // font size
          'text-sm',
          // color
          'text-gray-600',
          // margin top
          'mt-1',
        )}
      >
        Choose the platform or context for prompt optimization
      </p>
    </div>
  )
}
