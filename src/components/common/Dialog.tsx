'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface DialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback when dialog is closed (cancel or backdrop click) */
  onClose: () => void
  /** Content to be rendered inside the dialog */
  children: React.ReactNode
  /** Z-index for the dialog (default: 100) */
  zIndex?: number
}

/**
 * A generic dialog component with portal rendering.
 * Features frosted glass effect, smooth animations, keyboard support,
 * and proper accessibility attributes.
 */
export default function Dialog({
  isOpen,
  onClose,
  children,
  zIndex = 100,
}: DialogProps) {
  // Keyboard listener and body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // SSR-safe: only render portal on client
  if (!isOpen || typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className={cn(
        // Position
        'fixed',
        'inset-0',
        // Layout
        'flex',
        'items-center',
        'justify-center',
        // Spacing
        'p-4',
        // Background overlay
        'bg-black/50',
        'backdrop-blur-sm',
        // Animation
        'animate-in',
        'fade-in',
        'duration-200',
      )}
      onClick={handleBackdropClick}
      role="presentation"
      style={{ zIndex }}
    >
      <div
        role="dialog"
        aria-modal="true"
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
        {children}
      </div>
    </div>,
    document.body,
  )
}
