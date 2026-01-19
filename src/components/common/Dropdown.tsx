'use client'

import { cn } from '@/lib/utils'
import ChevronIcon from '@/components/icons/ChevronIcon'

interface DropdownProps<T> {
  /** Whether the dropdown is open */
  isOpen: boolean
  /** Callback when open state changes */
  onOpenChange: (isOpen: boolean) => void
  /** Display text for the trigger button */
  triggerText: React.ReactNode
  /** Optional element to display before the trigger text */
  triggerPrefix?: React.ReactNode
  /** Whether the dropdown is disabled */
  disabled?: boolean
  /** Array of items to display in the dropdown */
  items: T[]
  /** Callback when an item is selected */
  onSelectItem: (item: T, index: number) => void
  /** Function to render each item's content */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Aria label for the trigger button */
  ariaLabel?: string
  /** ID for the trigger button (for label association) */
  id?: string
  /** Additional CSS classes for the trigger */
  triggerClassName?: string
  /** Additional CSS classes for the dropdown menu */
  menuClassName?: string
}

/**
 * Reusable dropdown component with custom trigger and items.
 * Includes backdrop, animations, and Apple-inspired styling.
 */
export function Dropdown<T>({
  isOpen,
  onOpenChange,
  triggerText,
  triggerPrefix,
  disabled = false,
  items,
  onSelectItem,
  renderItem,
  ariaLabel,
  id,
  triggerClassName,
  menuClassName,
}: DropdownProps<T>) {
  const handleToggle = () => {
    if (!disabled) {
      onOpenChange(!isOpen)
    }
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        id={id}
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
          triggerClassName,
        )}
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          {triggerPrefix}
          <span className="truncate">{triggerText}</span>
        </span>
        <ChevronIcon
          className={cn(
            'w-5',
            'h-5',
            'text-[#86868b]',
            'transition-transform',
            'duration-200',
            'shrink-0',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => onOpenChange(false)}
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
              menuClassName,
            )}
          >
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectItem(item, index)}
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
                  index < items.length - 1 && [
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
                {renderItem(item, index)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
