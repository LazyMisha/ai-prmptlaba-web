'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CopyIcon from '@/components/common/CopyIcon'
import CheckIcon from '@/components/common/CheckIcon'

type CopyButtonVariant = 'default' | 'subtle' | 'success'

interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string
  /** Visual variant of the button */
  variant?: CopyButtonVariant
  /** Whether to show text label alongside icon */
  showLabel?: boolean
  /** Custom label text (defaults to "Copy" / "Copied") */
  label?: string
  /** Custom success label text (defaults to "Copied") */
  successLabel?: string
  /** Additional CSS classes */
  className?: string
  /** Callback fired after successful copy */
  onCopy?: () => void
}

const variantStyles: Record<CopyButtonVariant, { base: string; copied: string; hover: string }> = {
  default: {
    base: 'text-gray-600 bg-gray-100',
    copied: 'text-emerald-600 bg-emerald-100',
    hover: 'hover:bg-gray-200 hover:text-gray-900',
  },
  subtle: {
    base: 'text-[#86868b]',
    copied: 'text-[#34c759]',
    hover: 'hover:text-[#007aff]',
  },
  success: {
    base: 'text-emerald-700 bg-emerald-100',
    copied: 'text-emerald-600 bg-emerald-200',
    hover: 'hover:bg-emerald-200',
  },
}

/**
 * Reusable copy-to-clipboard button with visual feedback.
 * Shows a checkmark and success state for 2 seconds after copying.
 */
export default function CopyButton({
  text,
  variant = 'default',
  showLabel = true,
  label = 'Copy',
  successLabel = 'Copied',
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const styles = variantStyles[variant]
  const displayLabel = copied ? successLabel : label

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${successLabel} to clipboard` : `${label} to clipboard`}
      className={cn(
        // Layout
        'flex',
        'items-center',
        'gap-1.5',
        // Spacing
        'px-3',
        'py-1.5',
        // Typography
        'text-sm',
        'font-medium',
        // Border
        'rounded-lg',
        // Transition
        'transition-all',
        'duration-200',
        // Focus
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
        'focus-visible:ring-offset-2',
        // Variant styles
        copied ? styles.copied : styles.base,
        !copied && styles.hover,
        className,
      )}
    >
      {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
      {showLabel && <span>{displayLabel}</span>}
    </button>
  )
}
