import Link from 'next/link'
import { APP_NAME } from '@/constants/app'
import { cn } from '@/lib/utils'
import MobileMenu from './MobileMenu'
import NavLink from './NavLink'

/**
 * Header component with frosted glass effect.
 */
export default function Header() {
  return (
    <header
      className={cn(
        // Sticky positioning
        'sticky',
        'top-0',
        // Full width
        'w-full',
        // Padding - generous spacing
        'px-6',
        'py-4',
        'md:px-10',
        // Frosted glass effect
        'bg-white/72',
        'backdrop-blur-xl',
        'backdrop-saturate-150',
        // Subtle bottom border
        'border-b',
        'border-black/[0.08]',
        // Z-index to stay above content
        'z-50',
        // Smooth transition for scroll effects
        'transition-all',
        'duration-300',
      )}
      role="banner"
    >
      <nav
        className={cn(
          // Flexbox layout
          'flex',
          'justify-between',
          'items-center',
          // Max width for large screens
          'max-w-6xl',
          'mx-auto',
          // Relative positioning for menu
          'relative',
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          className={cn(
            // Typography - brand styling
            'text-xl',
            'font-semibold',
            'tracking-tight',
            'text-[#1d1d1f]',
            // Rendering
            'antialiased',
            // Smooth hover transition
            'transition-opacity',
            'duration-200',
            'hover:opacity-60',
            // Focus styles
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[#007aff]',
            'focus-visible:ring-offset-2',
            'rounded-lg',
            'px-2',
            'py-1',
            '-ml-2',
          )}
          href="/"
          aria-label="Go to home page"
        >
          {APP_NAME}
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div
          className={cn(
            // Hidden on mobile
            'hidden',
            // Visible on md and up
            'md:flex',
            // Gap between items
            'gap-8',
            // Center items
            'items-center',
          )}
        >
          <NavLink href="/enhance" ariaLabel="Go to prompt enhancer page">
            Enhance
          </NavLink>
          <NavLink href="/saved" ariaLabel="Go to saved prompts page">
            Saved
          </NavLink>
          <NavLink href="/history" ariaLabel="Go to prompt history page">
            History
          </NavLink>
        </div>

        {/* Mobile Menu - Hidden on desktop */}
        <MobileMenu />
      </nav>
    </header>
  )
}
