'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import CloseIcon from '@/components/icons/CloseIcon'

interface MobileSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Callback when sheet is closed */
  onClose: () => void
  /** Sheet title */
  title: string
  /** Sheet content */
  children: React.ReactNode
  /** Optional footer content */
  footer?: React.ReactNode
  /** Whether to show the close button in header */
  showCloseButton?: boolean
  /** Custom aria-labelledby id */
  ariaLabelledBy?: string
  /** Z-index for the sheet (default: 100) */
  zIndex?: number
  /** Additional CSS classes for the content area */
  contentClassName?: string
}

// For SSR-safe portal rendering
function subscribeToNothing() {
  return () => {}
}

function getIsMounted() {
  return true
}

function getServerSnapshot() {
  return false
}

/**
 * Mobile bottom sheet component.
 * Slides up from the bottom with a drag handle and header.
 * Uses portal for proper stacking context.
 */
export default function MobileSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  ariaLabelledBy,
  zIndex = 100,
  contentClassName,
}: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = ariaLabelledBy ?? `mobile-sheet-title-${title.toLowerCase().replace(/\s+/g, '-')}`

  // Handle escape key to close sheet
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

  // SSR-safe portal
  const isMounted = useSyncExternalStore(subscribeToNothing, getIsMounted, getServerSnapshot)

  if (!isOpen || !isMounted) {
    return null
  }

  const sheetContent = (
    <div
      className={cn(
        // Position
        'fixed',
        'inset-0',
        // Layout
        'flex',
        'items-end',
        'justify-center',
        // Background overlay
        'bg-black/50',
        'backdrop-blur-sm',
        // Animation
        'animate-in',
        'fade-in',
        'duration-200',
      )}
      style={{ zIndex }}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          // Sizing
          'w-full',
          // Height
          'max-h-[85dvh]',
          // Background
          'bg-white',
          // Rounded corners - only top
          'rounded-t-3xl',
          // Shadow
          'shadow-2xl',
          // Animation
          'animate-in',
          'slide-in-from-bottom',
          'duration-200',
          // Layout
          'overflow-hidden',
          'flex',
          'flex-col',
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1" data-testid="drag-handle">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'px-5',
            'pt-2',
            'pb-4',
            'border-b',
            'border-gray-100',
            'flex-shrink-0',
          )}
        >
          <h2 id={titleId} className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={cn(
                'p-2',
                '-mr-2',
                'rounded-full',
                'text-gray-400',
                'hover:text-gray-600',
                'hover:bg-gray-100',
                'transition-colors',
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#007aff]',
              )}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            'flex-1',
            'overflow-y-auto',
            'overscroll-contain',
            // Content padding matching header
            'px-5',
            'py-4',
            contentClassName,
          )}
          style={{ paddingBottom: footer ? undefined : 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              'flex-shrink-0',
              'px-5',
              'pt-4',
              'border-t',
              'border-gray-100',
              'bg-gray-50/80',
            )}
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(sheetContent, document.body)
}
