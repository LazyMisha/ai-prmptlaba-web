'use client'

import { useState } from 'react'
import type { EnhancementTarget } from '@/types/enhance'
import { cn } from '@/lib/utils'
import { Dropdown } from '@/components/common/Dropdown'

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const selectedOption = TOOL_CATEGORY_LIST.find(
    (option) => option.value === value,
  )

  const handleSelect = (newValue: EnhancementTarget) => {
    onChange(newValue)
    setIsDropdownOpen(false)
  }

  return (
    <div
      className={cn(
        // Layout
        'flex',
        'flex-col',
        // Spacing
        'gap-1',
        // Custom classes
        className,
      )}
    >
      <label
        htmlFor="target-selector-dropdown"
        className={cn(
          // Typography
          'text-sm',
          'font-medium',
          'text-[#1d1d1f]',
          // Layout
          'block',
        )}
      >
        {label}
      </label>
      <Dropdown
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        triggerText={
          selectedOption ? (
            <span
              className={cn('flex', 'items-center', 'gap-1.5', 'min-w-0')}
              title={`${selectedOption.label} ${selectedOption.description}`}
            >
              <span className={cn('text-[#1d1d1f]', 'shrink-0')}>
                {selectedOption.label}
              </span>
              <span className={cn('text-xs', 'text-[#86868b]', 'truncate')}>
                {selectedOption.description}
              </span>
            </span>
          ) : (
            ''
          )
        }
        disabled={disabled}
        items={TOOL_CATEGORY_LIST}
        ariaLabel={label}
        id="target-selector-dropdown"
        onSelectItem={(option) => handleSelect(option.value)}
        renderItem={(option) => (
          <div
            className={cn('flex', 'flex-col', 'gap-0.5', 'min-w-0')}
            title={`${option.label} ${option.description}`}
          >
            <span className={cn('truncate', 'text-[#1d1d1f]')}>
              {option.label}
            </span>
            <span className={cn('text-xs', 'text-[#86868b]', 'truncate')}>
              {option.description}
            </span>
          </div>
        )}
      />
      <p
        id="target-helper-text"
        className={cn(
          // Typography
          'text-xs',
          'font-normal',
          'text-[#86868b]',
        )}
      >
        {helperText}
      </p>
    </div>
  )
}
