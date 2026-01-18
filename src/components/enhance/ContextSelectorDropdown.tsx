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
        triggerText={selectedOption?.label || ''}
        disabled={disabled}
        items={TOOL_CATEGORY_LIST}
        ariaLabel={label}
        id="target-selector-dropdown"
        onSelectItem={(option) => handleSelect(option.value)}
        renderItem={(option) => (
          <span className="truncate text-[#1d1d1f]">{option.label}</span>
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
