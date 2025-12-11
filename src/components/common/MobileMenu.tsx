'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/locales'
import { LanguageSwitcher } from './LanguageSwitcher'
import NavLink from './NavLink'

/**
 * Navigation translations for MobileMenu.
 */
interface NavTranslations {
  enhance: string
  saved: string
  history: string
  goToEnhance: string
  goToSaved: string
  goToHistory: string
  openMenu: string
  closeMenu: string
}

/**
 * Props for the MobileMenu component.
 */
interface MobileMenuProps {
  /** Current locale for navigation links */
  locale: Locale
  /** Navigation translations */
  translations?: NavTranslations
}

/**
 * Mobile menu component with clean dropdown.
 * Features smooth animations and refined interaction patterns.
 */
export default function MobileMenu({ locale, translations }: MobileMenuProps) {
  // Default translations for fallback
  const t = translations ?? {
    enhance: 'Enhance',
    saved: 'Saved',
    history: 'History',
    goToEnhance: 'Go to prompt enhancer page',
    goToSaved: 'Go to saved prompts page',
    goToHistory: 'Go to prompt history page',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className={cn('relative', 'lg:hidden')}>
      {/* Menu Button - minimal design */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className={cn(
          // Flexbox
          'flex',
          'flex-col',
          'justify-center',
          'items-center',
          // Sizing
          'w-11',
          'h-11',
          // Spacing
          'gap-1.5',
          // Colors
          'text-[#1d1d1f]',
          // Rounded
          'rounded-full',
          // Hover state
          'transition-colors',
          'duration-200',
          'hover:bg-black/[0.04]',
          // Active state
          'active:bg-black/[0.08]',
          // Focus styles
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
        )}
        aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        {/* Hamburger Icon - Refined bars */}
        <span
          className={cn(
            // Bar styling
            'w-[18px]',
            'h-[1.5px]',
            'bg-[#1d1d1f]',
            'rounded-full',
            // Smooth transition
            'transition-all',
            'duration-300',
            'ease-out',
            // Transform when open
            isMenuOpen && 'rotate-45 translate-y-[7px]',
          )}
        />
        <span
          className={cn(
            // Bar styling
            'w-[18px]',
            'h-[1.5px]',
            'bg-[#1d1d1f]',
            'rounded-full',
            // Smooth transition
            'transition-all',
            'duration-300',
            'ease-out',
            // Hide middle bar when open
            isMenuOpen && 'opacity-0 scale-0',
          )}
        />
        <span
          className={cn(
            // Bar styling
            'w-[18px]',
            'h-[1.5px]',
            'bg-[#1d1d1f]',
            'rounded-full',
            // Smooth transition
            'transition-all',
            'duration-300',
            'ease-out',
            // Transform when open
            isMenuOpen && '-rotate-45 -translate-y-[7px]',
          )}
        />
      </button>

      {/* Menu Dropdown - Clean solid background */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className={cn(
            // Positioning
            'absolute',
            'top-full',
            'right-0',
            'mt-3',
            // Sizing
            'w-56',
            // Solid white background - no transparency
            'bg-white',
            // Border
            'border',
            'border-black/[0.08]',
            // Effects - elevated shadow
            'rounded-2xl',
            'shadow-xl',
            // Z-index
            'z-50',
            // Padding
            'py-2',
            // Animation
            'animate-in',
            'fade-in-0',
            'zoom-in-95',
            'slide-in-from-top-2',
            'duration-200',
          )}
          role="menu"
        >
          <NavLink
            href={`/${locale}/enhance`}
            onClick={closeMenu}
            ariaLabel={t.goToEnhance}
            role="menuitem"
            className={cn(
              // Display
              'block',
              'w-full',
              // Spacing
              'px-4',
              'py-3',
              // Typography
              'text-[15px]',
              'font-normal',
              // Reset hover from NavLink
              'hover:opacity-100',
              // Hover background
              'hover:bg-black/[0.04]',
              // Active state
              'active:bg-black/[0.08]',
              // Rounded
              'rounded-none',
              // Focus styles
              'focus:bg-black/[0.04]',
              // Transition
              'transition-colors',
              'duration-150',
            )}
          >
            {t.enhance}
          </NavLink>
          <NavLink
            href={`/${locale}/saved`}
            onClick={closeMenu}
            ariaLabel={t.goToSaved}
            role="menuitem"
            className={cn(
              // Display
              'block',
              'w-full',
              // Spacing
              'px-4',
              'py-3',
              // Typography
              'text-[15px]',
              'font-normal',
              // Reset hover from NavLink
              'hover:opacity-100',
              // Hover background
              'hover:bg-black/[0.04]',
              // Active state
              'active:bg-black/[0.08]',
              // Rounded
              'rounded-none',
              // Focus styles
              'focus:bg-black/[0.04]',
              // Transition
              'transition-colors',
              'duration-150',
            )}
          >
            {t.saved}
          </NavLink>
          <NavLink
            href={`/${locale}/history`}
            onClick={closeMenu}
            ariaLabel={t.goToHistory}
            role="menuitem"
            className={cn(
              // Display
              'block',
              'w-full',
              // Spacing
              'px-4',
              'py-3',
              // Typography
              'text-[15px]',
              'font-normal',
              // Reset hover from NavLink
              'hover:opacity-100',
              // Hover background
              'hover:bg-black/[0.04]',
              // Active state
              'active:bg-black/[0.08]',
              // Rounded
              'rounded-none',
              // Focus styles
              'focus:bg-black/[0.04]',
              // Transition
              'transition-colors',
              'duration-150',
            )}
          >
            {t.history}
          </NavLink>

          {/* Divider */}
          <div
            className={cn('my-2', 'mx-4', 'h-px', 'bg-black/[0.08]')}
            role="separator"
          />

          {/* Language Switcher */}
          <div className={cn('px-4', 'py-2')}>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      )}
    </div>
  )
}
