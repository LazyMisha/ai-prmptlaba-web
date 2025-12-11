'use client'

import { useState } from 'react'

interface UseCopyToClipboardOptions {
  /** Duration in ms to show copied state (default: 2000) */
  resetDelay?: number
  /** Callback fired after successful copy */
  onCopy?: () => void
  /** Callback fired on copy error */
  onError?: (error: Error) => void
}

interface UseCopyToClipboardReturn {
  /** Whether content was recently copied */
  copied: boolean
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<void>
}

/**
 * Hook for copying text to clipboard with visual feedback state.
 * Automatically resets the copied state after a delay.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { resetDelay = 2000, onCopy, onError } = options
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)

      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), resetDelay)
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to copy to clipboard')

      console.error('Failed to copy:', error)
      onError?.(error)
    }
  }

  return { copied, copy }
}
