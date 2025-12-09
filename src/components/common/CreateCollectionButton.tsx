'use client'

import { cn } from '@/lib/utils'
import FolderPlusIcon from '@/components/common/FolderPlusIcon'

/**
 * Props for the CreateCollectionButton component.
 */
interface CreateCollectionButtonProps {
  /** Callback when button is clicked */
  onClick: () => void
  /** Button label text */
  label?: string
  /** Whether the button is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * A reusable button for creating new collections.
 */
export default function CreateCollectionButton({
  onClick,
  label = 'Create New Collection',
  disabled = false,
  className,
}: CreateCollectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Layout
        'w-full',
        'flex',
        'items-center',
        'justify-center',
        'gap-3',
        // Spacing
        'px-4',
        'py-3',
        // Size
        'min-h-[44px]',
        // Border
        'rounded-xl',
        'border-2',
        'border-dashed',
        'border-gray-300',
        // Typography
        'text-gray-600',
        // Hover
        'hover:border-[#007aff]',
        'hover:text-[#007aff]',
        'hover:bg-[#007aff]/5',
        // Transitions
        'transition-colors',
        // Focus
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
        // Disabled
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'disabled:hover:border-gray-300',
        'disabled:hover:text-gray-600',
        'disabled:hover:bg-transparent',
        // Custom classes
        className,
      )}
    >
      <FolderPlusIcon className="w-5 h-5" />
      <span className={cn('text-sm', 'font-medium')}>{label}</span>
    </button>
  )
}
