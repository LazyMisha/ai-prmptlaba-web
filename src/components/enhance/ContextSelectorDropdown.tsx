'use client'

import { useState } from 'react'
import type { EnhancementTarget } from '@/types/enhance'
import { cn } from '@/lib/utils'
import ChevronIcon from '@/components/icons/ChevronIcon'

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
    <div className={className}>
      <label
        id="target-selector-label"
        className={cn(
          // Typography
          'text-sm',
          'font-medium',
          'text-[#1d1d1f]',
          // Layout
          'block',
          // Spacing
          'mb-2',
        )}
      >
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
          aria-labelledby="target-selector-label"
          aria-describedby="target-helper-text"
          aria-expanded={isDropdownOpen}
          className={cn(
            // Layout
            'flex',
            'items-center',
            'justify-between',
            'w-full',
            // Spacing
            'px-4',
            'py-3',
            // Typography
            'text-[17px]',
            'font-medium',
            'text-[#1d1d1f]',
            // Background
            'bg-white/80',
            'backdrop-blur-sm',
            // Border
            'border',
            'border-black/[0.08]',
            'rounded-2xl',
            // Shadow
            'shadow-sm',
            // Transition
            'transition-all',
            'duration-200',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
            // Hover
            !disabled && 'hover:border-black/[0.12]',
            !disabled && 'hover:bg-white',
            // Disabled state
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer',
          )}
        >
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronIcon
            className={cn(
              'w-5',
              'h-5',
              'text-[#86868b]',
              'transition-transform',
              'duration-200',
              'shrink-0',
              isDropdownOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && !disabled && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />
            {/* Menu */}
            <div
              className={cn(
                // Position
                'absolute',
                'left-0',
                'right-0',
                'top-full',
                'z-50',
                // Spacing
                'mt-2',
                // Background
                'bg-white',
                // Border
                'border',
                'border-black/[0.08]',
                'rounded-2xl',
                // Shadow
                'shadow-lg',
                // Animation
                'animate-in',
                'fade-in-0',
                'zoom-in-95',
                'slide-in-from-top-2',
                'duration-200',
                // Max height with scroll
                'max-h-[40vh]',
                'overflow-y-auto',
              )}
            >
              {TOOL_CATEGORY_LIST.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    // Layout
                    'flex',
                    'items-center',
                    'justify-between',
                    'w-full',
                    // Size
                    'min-h-[50px]',
                    // Spacing
                    'px-4',
                    'py-3',
                    // Typography
                    'text-[17px]',
                    'font-medium',
                    'text-left',
                    // Border
                    index < TOOL_CATEGORY_LIST.length - 1 && [
                      'border-b',
                      'border-black/[0.08]',
                    ],
                    // Hover
                    'hover:bg-black/[0.04]',
                    // Transition
                    'transition-colors',
                    'duration-150',
                    // Focus
                    'focus:outline-none',
                    'focus-visible:bg-black/[0.04]',
                  )}
                >
                  <span className="truncate text-[#1d1d1f]">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <p
        id="target-helper-text"
        className={cn(
          // Typography
          'text-xs',
          'font-normal',
          'text-[#86868b]',
          // Spacing
          'mt-2',
        )}
      >
        {helperText}
      </p>
    </div>
  )
}
