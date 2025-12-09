'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import CloseIcon from '@/components/common/CloseIcon'

type DialogMaxWidth = 'xs' | 'sm' | 'md' | 'lg'
type Breakpoint = 'sm' | 'md' | 'lg'

interface ResponsiveDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback when dialog is closed */
  onClose: () => void
  /** Dialog title */
  title: string
  /** Dialog content */
  children: React.ReactNode
  /** Optional footer content */
  footer?: React.ReactNode
  /** Maximum width of the desktop dialog */
  maxWidth?: DialogMaxWidth
  /** Breakpoint at which to switch from mobile sheet to desktop dialog */
  breakpoint?: Breakpoint
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Custom aria-labelledby id */
  ariaLabelledBy?: string
  /** Optional aria-describedby id */
  ariaDescribedBy?: string
  /** Z-index for the dialog (default: 100) */
  zIndex?: number
  /** Whether to use alertdialog role (for confirmations) */
  isAlert?: boolean
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

const maxWidthClasses: Record<DialogMaxWidth, string> = {
  xs: 'sm:max-w-xs md:max-w-xs lg:max-w-xs',
  sm: 'sm:max-w-sm md:max-w-sm lg:max-w-sm',
  md: 'sm:max-w-md md:max-w-md lg:max-w-md',
  lg: 'sm:max-w-lg md:max-w-lg lg:max-w-lg',
}

const breakpointClasses: Record<
  Breakpoint,
  {
    backdrop: string
    dialog: string
    dragHandle: string
    header: string
    closeButton: string
    footer: string
  }
> = {
  sm: {
    backdrop: 'items-end sm:items-center sm:p-4',
    dialog:
      'rounded-t-3xl sm:rounded-2xl slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95',
    dragHandle: 'sm:hidden',
    header: 'px-5 pt-2 pb-4 sm:px-6 sm:pt-5 sm:pb-4 border-b border-gray-100 sm:border-b-0',
    closeButton: 'sm:hidden',
    footer:
      'px-5 py-4 sm:px-6 border-t border-gray-100 sm:border-t-0 bg-gray-50/80 sm:bg-transparent',
  },
  md: {
    backdrop: 'items-end md:items-center md:p-4',
    dialog:
      'rounded-t-3xl md:rounded-2xl slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95',
    dragHandle: 'md:hidden',
    header: 'px-5 pt-2 pb-4 md:px-6 md:pt-5 md:pb-4 border-b border-gray-100 md:border-b-0',
    closeButton: 'md:hidden',
    footer:
      'px-5 py-4 md:px-6 border-t border-gray-100 md:border-t-0 bg-gray-50/80 md:bg-transparent',
  },
  lg: {
    backdrop: 'items-end lg:items-center lg:p-4',
    dialog:
      'rounded-t-3xl lg:rounded-2xl slide-in-from-bottom lg:slide-in-from-bottom-0 lg:zoom-in-95',
    dragHandle: 'lg:hidden',
    header: 'px-5 pt-2 pb-4 lg:px-6 lg:pt-5 lg:pb-4 border-b border-gray-100 lg:border-b-0',
    closeButton: 'lg:hidden',
    footer:
      'px-5 py-4 lg:px-6 border-t border-gray-100 lg:border-t-0 bg-gray-50/80 lg:bg-transparent',
  },
}

/**
 * Responsive dialog component that shows as a bottom sheet on mobile
 * and a centered dialog on desktop.
 */
export default function ResponsiveDialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'sm',
  breakpoint = 'sm',
  showCloseButton = true,
  ariaLabelledBy,
  ariaDescribedBy,
  zIndex = 100,
  isAlert = false,
  contentClassName,
}: ResponsiveDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId =
    ariaLabelledBy ?? `responsive-dialog-title-${title.toLowerCase().replace(/\s+/g, '-')}`
  const classes = breakpointClasses[breakpoint]

  // Handle escape key to close dialog
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

  const dialogContent = (
    <div
      className={cn(
        // Position
        'fixed',
        'inset-0',
        // Layout
        'flex',
        'justify-center',
        // Background overlay
        'bg-black/50',
        'backdrop-blur-sm',
        // Animation
        'animate-in',
        'fade-in',
        'duration-200',
        // Responsive positioning
        classes.backdrop,
      )}
      style={{ zIndex }}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role={isAlert ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        className={cn(
          // Sizing
          'w-full',
          maxWidthClasses[maxWidth],
          // Height
          'max-h-[85dvh]',
          // Background
          'bg-white',
          // Shadow
          'shadow-2xl',
          // Animation
          'animate-in',
          'duration-200',
          // Layout
          'overflow-hidden',
          'flex',
          'flex-col',
          // Responsive styles
          classes.dialog,
        )}
      >
        {/* Drag handle - mobile only */}
        <div
          className={cn('flex', 'justify-center', 'pt-3', 'pb-1', classes.dragHandle)}
          data-testid="drag-handle"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div
          className={cn('flex', 'items-center', 'justify-between', 'flex-shrink-0', classes.header)}
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
                // Hide on desktop (cancel button in footer)
                classes.closeButton,
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
            breakpoint === 'sm' && 'sm:px-6',
            breakpoint === 'md' && 'md:px-6',
            breakpoint === 'lg' && 'lg:px-6',
            contentClassName,
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn('flex-shrink-0', classes.footer)}
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
