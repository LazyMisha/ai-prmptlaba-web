'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import Dialog from './Dialog'

/**
 * Props for the ConfirmDialog component.
 */
interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback when dialog is closed (cancel or backdrop click) */
  onClose: () => void
  /** Callback when confirm action is triggered */
  onConfirm: () => void
  /** Dialog title */
  title: string
  /** Dialog description/message */
  description: string
  /** Text for the confirm button */
  confirmText?: string
  /** Text for the cancel button */
  cancelText?: string
  /** Whether the action is destructive (shows red confirm button) */
  isDestructive?: boolean
  /** Z-index for the dialog (default: 100) */
  zIndex?: number
}

/**
 * Confirmation dialog with destructive action support.
 * Built on Dialog component with keyboard navigation and proper focus management.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  zIndex = 100,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management
  useEffect(() => {
    if (!isOpen) return

    // Focus the cancel button when dialog opens (safer default)
    cancelButtonRef.current?.focus()
  }, [isOpen])

  return (
    <Dialog isOpen={isOpen} onClose={onClose} zIndex={zIndex}>
      <div
        className={cn(
          // Spacing
          'px-6',
          'pt-6',
          'pb-4',
          // Text alignment
          'text-center',
        )}
      >
        <h2
          id="dialog-title"
          className={cn(
            // Typography
            'text-lg',
            'font-semibold',
            'text-gray-900',
            // Spacing
            'mb-2',
          )}
        >
          {title}
        </h2>
        <p
          id="dialog-description"
          className={cn(
            // Typography
            'text-sm',
            'font-light',
            'text-gray-600',
            // Line height
            'leading-relaxed',
          )}
        >
          {description}
        </p>
      </div>

      {/* Divider */}
      <div
        className={cn(
          // Border
          'border-t',
          'border-gray-200/50',
        )}
      />

      {/* Actions */}
      <div
        className={cn(
          // Layout
          'flex',
          'flex-col',
          // Dividers between buttons
          'divide-y',
          'divide-gray-200/50',
        )}
      >
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            // Sizing
            'w-full',
            // Spacing
            'py-3',
            'px-4',
            // Typography
            'text-base',
            'font-medium',
            // Colors
            isDestructive ? 'text-red-500' : 'text-blue-500',
            // Hover
            isDestructive ? 'hover:bg-red-50/50' : 'hover:bg-blue-50/50',
            // Active
            isDestructive ? 'active:bg-red-100/50' : 'active:bg-blue-100/50',
            // Transition
            'transition-colors',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            isDestructive
              ? 'focus-visible:ring-red-500'
              : 'focus-visible:ring-blue-500',
            'focus-visible:ring-inset',
          )}
        >
          {confirmText}
        </button>
        <button
          ref={cancelButtonRef}
          type="button"
          onClick={onClose}
          className={cn(
            // Sizing
            'w-full',
            // Spacing
            'py-3',
            'px-4',
            // Typography
            'text-base',
            'font-normal',
            'text-gray-600',
            // Hover
            'hover:bg-gray-50/50',
            // Active
            'active:bg-gray-100/50',
            // Transition
            'transition-colors',
            // Rounded bottom corners
            'rounded-b-2xl',
            // Focus
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-gray-400',
            'focus-visible:ring-inset',
          )}
        >
          {cancelText}
        </button>
      </div>
    </Dialog>
  )
}
