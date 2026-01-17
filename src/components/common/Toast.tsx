'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import CheckIcon from '@/components/icons/CheckIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import InfoIcon from '@/components/icons/InfoIcon'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastItemProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

// Cached empty array for server snapshot to avoid infinite loop
const EMPTY_TOAST_ARRAY: ToastMessage[] = []

// Store for tracking if we're mounted on client
function subscribeToMounted() {
  // No-op - the value never changes after mount
  return () => {}
}

function getMountedSnapshot() {
  return true
}

function getServerMountedSnapshot() {
  return false
}

/**
 * Individual toast notification item.
 */
function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const onDismissRef = useRef(onDismiss)

  // Keep ref in sync with latest onDismiss
  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10)

    // Auto-dismiss after duration
    const duration = toast.duration ?? 3000
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => {
        onDismissRef.current(toast.id)
      }, 200) // Match animation duration
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(dismissTimer)
    }
  }, [toast.duration, toast.id])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onDismiss(toast.id)
    }, 200) // Match animation duration
  }

  const iconMap = {
    success: (
      <CheckIcon className={cn('w-4', 'h-4', 'text-white')} strokeWidth={2.5} />
    ),
    error: <CloseIcon className={cn('w-4', 'h-4', 'text-white')} />,
    info: (
      <InfoIcon className={cn('w-4', 'h-4', 'text-white')} strokeWidth={2} />
    ),
  }

  const bgColorMap = {
    success: 'bg-[#34C759]',
    error: 'bg-[#FF3B30]',
    info: 'bg-[#007AFF]',
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        // Layout
        'flex',
        'items-center',
        'gap-3',
        // Spacing
        'px-4',
        'py-3',
        // Background
        bgColorMap[toast.type],
        // Border
        'rounded-2xl',
        // Shadow
        'shadow-lg',
        // Animation
        'transition-all',
        'duration-200',
        'ease-out',
        // Initial/leaving state
        !isVisible || isLeaving
          ? 'opacity-0 translate-y-2 scale-95'
          : 'opacity-100 translate-y-0 scale-100',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0',
          'w-6',
          'h-6',
          'flex',
          'items-center',
          'justify-center',
          'bg-white/20',
          'rounded-full',
        )}
      >
        {iconMap[toast.type]}
      </div>

      {/* Message */}
      <p className={cn('flex-1', 'text-sm', 'font-medium', 'text-white')}>
        {toast.message}
      </p>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'flex-shrink-0',
          'p-1',
          'rounded-lg',
          'text-white/80',
          'hover:text-white',
          'hover:bg-white/10',
          'transition-colors',
          'duration-150',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-white/50',
        )}
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast store for managing toasts globally
let toastListeners: Array<() => void> = []
let toastQueue: ToastMessage[] = []

function subscribe(listener: () => void) {
  toastListeners.push(listener)
  return () => {
    toastListeners = toastListeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return toastQueue
}

function getServerSnapshot() {
  return EMPTY_TOAST_ARRAY
}

function notifyListeners() {
  toastListeners.forEach((listener) => listener())
}

/**
 * Show a toast notification.
 */
export function showToast(type: ToastType, message: string, duration?: number) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const toast: ToastMessage = { id, type, message, duration }

  toastQueue = [...toastQueue, toast]
  notifyListeners()

  return id
}

/**
 * Dismiss a specific toast by ID.
 */
export function dismissToast(id: string) {
  toastQueue = toastQueue.filter((t) => t.id !== id)
  notifyListeners()
}

/**
 * Clear all toasts. Primarily used for testing.
 * @internal
 */
export function clearAllToasts() {
  toastQueue = []
  notifyListeners()
}

/**
 * Toast container component that renders all active toasts.
 * Should be mounted once at the app root level.
 */
export function ToastContainer() {
  // Use useSyncExternalStore to safely detect client-side mounting
  const isMounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getServerMountedSnapshot,
  )
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const handleDismiss = (id: string) => {
    dismissToast(id)
  }

  // Return null on server to avoid hydration mismatch
  if (!isMounted) return null

  return createPortal(
    <div
      aria-label="Notifications"
      className={cn(
        // Position
        'fixed',
        'bottom-6',
        'left-1/2',
        '-translate-x-1/2',
        // Layout
        'flex',
        'flex-col',
        'gap-2',
        // Size
        'w-full',
        'max-w-sm',
        // Spacing
        'px-4',
        // Z-index
        'z-50',
        // Pointer events
        'pointer-events-none',
        '[&>*]:pointer-events-auto',
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>,
    document.body,
  )
}
