'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import NavLink from './NavLink'

/**
 * Mobile menu component with hamburger button and dropdown.
 * Handles all client-side interactivity including menu toggle and click-outside detection.
 */
export default function MobileMenu() {
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
    <div className={cn('relative', 'md:hidden')}>
      {/* Menu Button */}
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
          'w-10',
          'h-10',
          // Spacing
          'gap-1.5',
          // Colors
          'text-gray-600',
          // Focus styles
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-blue-500',
          'focus:ring-offset-2',
          'rounded',
        )}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        {/* Hamburger Icon */}
        <span
          className={cn(
            // Bar styling
            'w-6',
            'h-0.5',
            'bg-gray-600',
            'rounded-full',
            // Transition
            'transition-all',
            'duration-300',
            // Transform when open
            isMenuOpen && 'rotate-45 translate-y-2',
          )}
        />
        <span
          className={cn(
            // Bar styling
            'w-6',
            'h-0.5',
            'bg-gray-600',
            'rounded-full',
            // Transition
            'transition-all',
            'duration-300',
            // Hide middle bar when open
            isMenuOpen && 'opacity-0',
          )}
        />
        <span
          className={cn(
            // Bar styling
            'w-6',
            'h-0.5',
            'bg-gray-600',
            'rounded-full',
            // Transition
            'transition-all',
            'duration-300',
            // Transform when open
            isMenuOpen && '-rotate-45 -translate-y-2',
          )}
        />
      </button>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className={cn(
            // Positioning
            'absolute',
            'top-full',
            'right-0',
            'mt-2',
            // Sizing
            'w-48',
            // Colors
            'bg-white',
            'border',
            'border-gray-200',
            // Effects
            'rounded-lg',
            'shadow-lg',
            // Z-index
            'z-20',
            // Animation
            'animate-in',
            'fade-in',
            'slide-in-from-top-2',
            'duration-200',
          )}
          role="menu"
        >
          <NavLink
            href="/enhance"
            onClick={closeMenu}
            ariaLabel="Go to prompt enhancer page"
            role="menuitem"
            className={cn(
              // Display
              'block',
              // Spacing
              'px-4',
              'py-3',
              // Typography
              'text-base',
              // Hover
              'hover:bg-gray-50',
              // First item
              'rounded-t-lg',
              // Focus styles
              'focus:bg-gray-100',
            )}
          >
            Enhance Prompt
          </NavLink>
        </div>
      )}
    </div>
  )
}
