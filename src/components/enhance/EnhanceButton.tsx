'use client'

import { cn } from '@/lib/utils'

interface EnhanceButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
}

/**
 * Button to trigger prompt enhancement
 */
export default function EnhanceButton({ onClick, disabled, isLoading }: EnhanceButtonProps) {
  return (
    <button
      className={cn(
        // Background color
        'bg-blue-600',
        // Text color
        'text-white',
        // Padding
        'px-4',
        'py-2',
        // Border radius
        'rounded',
        // Hover effect
        'hover:bg-blue-700',
        // Disabled state
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
      )}
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
    </button>
  )
}
