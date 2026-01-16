'use client'

import { cn } from '@/lib/utils'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'

/**
 * Props for the CreateCollectionButton component.
 */
interface CreateCollectionButtonProps {
  /** Callback when button is clicked */
  onClick: () => void
  /** Button label text */
  label: string
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
  label,
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
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        // Spacing
        'px-6',
        'py-3',
        // Size
        'min-h-[50px]',
        // Background
        'bg-[#007aff]',
        'text-white',
        // Border
        'rounded-2xl',
        // Hover
        'hover:bg-[#0071e3]',
        'active:opacity-80',
        'active:scale-[0.98]',
        // Transition
        'transition-all',
        'duration-200',
        // Typography
        'text-[17px]',
        'font-semibold',
        // Focus
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
        'focus-visible:ring-offset-2',
        // Disabled
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        // Custom classes
        className,
      )}
    >
      <FolderPlusIcon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )
}
