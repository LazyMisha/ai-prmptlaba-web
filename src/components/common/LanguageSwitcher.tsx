'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  locales,
  localeNames,
  localeFullNames,
  type Locale,
} from '@/i18n/locales'
import ChevronIcon from '@/components/icons/ChevronIcon'

/**
 * Props for the LanguageSwitcher component.
 */
interface LanguageSwitcherProps {
  /** Current active locale */
  currentLocale: Locale
  /** Additional CSS classes */
  className?: string
}

/**
 * Sets a cookie to remember the user's locale preference.
 * Cookie is set for 1 year with path=/ to be accessible site-wide.
 */
const setLocaleCookie = (locale: Locale): void => {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

/**
 * Language switcher component for toggling between locales.
 * Displays a dropdown menu for selecting languages.
 * Mobile-first, accessibility support.
 * Scalable to support any number of languages.
 */
export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  /**
   * Generates the path for switching to a different locale.
   * Replaces the current locale segment in the URL.
   */
  const getLocalePath = (locale: Locale): string => {
    // Handle null pathname (in tests or SSR)
    if (!pathname) {
      return `/${locale}`
    }
    // Remove the current locale from pathname and prepend new locale
    const segments = pathname.split('/')
    // segments[0] is empty string, segments[1] is the locale
    segments[1] = locale
    return segments.join('/')
  }

  /**
   * Handles click on locale link - saves preference to cookie.
   */
  const handleLocaleClick = (locale: Locale): void => {
    setLocaleCookie(locale)
    setIsOpen(false)
  }

  /**
   * Toggles the dropdown open/closed state.
   */
  const toggleDropdown = (): void => {
    setIsOpen((prev) => !prev)
  }

  /**
   * Closes dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  /**
   * Handles keyboard navigation for accessibility.
   */
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={cn(
        // Position
        'relative',
        // Display
        'inline-block',
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${localeFullNames[currentLocale]}. Select language`}
        className={cn(
          // Layout
          'inline-flex',
          'items-center',
          'justify-center',
          'gap-1',
          // Sizing - touch-friendly
          'min-h-[44px]',
          'px-3',
          'py-2',
          // Background
          'bg-black/[0.05]',
          // Border radius
          'rounded-lg',
          // Typography
          'text-sm',
          'font-medium',
          'tracking-tight',
          // Colors
          'text-[#1d1d1f]',
          // Hover
          'hover:bg-black/[0.08]',
          // Active
          'active:opacity-80',
          'active:scale-[0.98]',
          // Transition
          'transition-all',
          'duration-200',
          'ease-out',
          // Focus styles
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
        )}
      >
        <span>{localeNames[currentLocale]}</span>
        <ChevronIcon
          direction="down"
          isRotated={isOpen}
          className={cn(
            // Sizing
            'w-4',
            'h-4',
            // Colors
            'text-[#86868b]',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className={cn(
            // Position
            'absolute',
            'right-0',
            'mt-1',
            'z-50',
            // Sizing
            'min-w-[140px]',
            // Background
            'bg-white',
            // Border
            'border',
            'border-black/[0.08]',
            // Border radius
            'rounded-xl',
            // Shadow
            'shadow-lg',
            // Padding
            'py-1',
            // Animation
            'animate-in',
            'fade-in-0',
            'zoom-in-95',
            'duration-150',
          )}
        >
          {locales.map((locale) => {
            const isActive = locale === currentLocale

            return (
              <Link
                key={locale}
                href={getLocalePath(locale)}
                role="option"
                aria-selected={isActive}
                onClick={() => handleLocaleClick(locale)}
                className={cn(
                  // Layout
                  'flex',
                  'items-center',
                  'justify-between',
                  'w-full',
                  // Sizing - touch-friendly
                  'min-h-[44px]',
                  'px-4',
                  'py-2',
                  // Typography
                  'text-[15px]',
                  'font-normal',
                  // Colors
                  isActive ? 'text-[#007aff]' : 'text-[#1d1d1f]',
                  // Hover
                  'hover:bg-black/[0.04]',
                  // Transition
                  'transition-colors',
                  'duration-150',
                  // Focus styles
                  'focus:outline-none',
                  'focus-visible:bg-black/[0.04]',
                )}
              >
                <span>{localeFullNames[locale]}</span>
                <span
                  className={cn(
                    // Typography
                    'text-sm',
                    'font-medium',
                    // Colors
                    'text-[#86868b]',
                  )}
                >
                  {localeNames[locale]}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
