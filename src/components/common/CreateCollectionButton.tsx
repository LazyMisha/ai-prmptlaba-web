'use client'

import { Button } from '@/components/common/Button'
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
    <Button
      onClick={onClick}
      disabled={disabled}
      icon={<FolderPlusIcon className="w-5 h-5" />}
      className={className}
    >
      {label}
    </Button>
  )
}
