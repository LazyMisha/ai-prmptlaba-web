import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/locales'

/**
 * Props for the HeaderLogo component.
 */
interface HeaderLogoProps {
  /** Current locale for the home link */
  locale: Locale
}

/**
 * Header logo component that links to home page.
 * Displays the app logo spanning the full height of the header.
 * Uses negative margins to extend beyond header padding.
 */
export function HeaderLogo({ locale }: HeaderLogoProps) {
  return (
    <Link
      href={`/${locale}`}
      aria-label="Go to home page"
      className={cn(
        // Negative margins to extend to full header height
        '-my-4',
        // Negative left margin to compensate for logo image internal whitespace
        // This aligns the visual edge of the logo with the content edge
        '-ml-3',
        // Flex for alignment
        'flex',
        'items-center',
        'shrink-0',
        // Focus styles
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
        'focus-visible:ring-offset-2',
        // Rounded for focus ring
        'rounded-lg',
        // Smooth hover transition
        'transition-opacity',
        'duration-200',
        'hover:opacity-70',
      )}
    >
      <Image
        src="/logo.webp"
        alt="AI Prompt Laba"
        width={64}
        height={64}
        priority
        className={cn(
          // Full header height (py-4 = 16px top + 16px bottom + content)
          // Header content area is roughly 40-48px, total ~72-80px
          'h-[72px]',
          'w-auto',
          // Rounded corners matching logo style
          'rounded-[22%]',
        )}
      />
    </Link>
  )
}
