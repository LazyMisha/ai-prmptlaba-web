'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import NavLink from './NavLink'

/**
 * Mobile menu component with clean dropdown.
 * Features smooth animations and refined interaction patterns.
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
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
            href="/enhance"
            onClick={closeMenu}
            ariaLabel="Go to prompt enhancer page"
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
            Enhance
          </NavLink>
          <NavLink
            href="/saved"
            onClick={closeMenu}
            ariaLabel="Go to saved prompts page"
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
            Saved
          </NavLink>
          <NavLink
            href="/history"
            onClick={closeMenu}
            ariaLabel="Go to prompt history page"
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
            History
          </NavLink>
        </div>
      )}
    </div>
  )
}
