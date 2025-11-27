'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

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
}

/**
 * A user-friendly confirmation dialog component.
 * Features frosted glass effect, smooth animations, keyboard support,
 * and proper accessibility attributes.
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
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Handle escape key to close dialog
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  // Focus management and keyboard listener
  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button when dialog opens (safer default)
      cancelButtonRef.current?.focus()

      // Add escape key listener
      document.addEventListener('keydown', handleKeyDown)

      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, handleKeyDown])

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        // Position
        'fixed',
        'inset-0',
        'z-50',
        // Layout
        'flex',
        'items-center',
        'justify-center',
        // Spacing
        'p-4',
        // Background overlay
        'bg-black/30',
        'backdrop-blur-sm',
        // Animation
        'animate-in',
        'fade-in',
        'duration-200',
      )}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className={cn(
          // Sizing
          'w-full',
          'max-w-sm',
          // Background
          'bg-white/95',
          'backdrop-blur-xl',
          // Border
          'border',
          'border-gray-200/50',
          // Rounded corners
          'rounded-2xl',
          // Shadow
          'shadow-xl',
          'shadow-black/10',
          // Animation
          'animate-in',
          'zoom-in-95',
          'duration-200',
        )}
      >
        {/* Content */}
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
            ref={confirmButtonRef}
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
              isDestructive ? 'focus-visible:ring-red-500' : 'focus-visible:ring-blue-500',
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
      </div>
    </div>
  )
}
