import Link from 'next/link'
import { APP_NAME } from '@/constants/app'
import { cn } from '@/lib/utils'
import MobileMenu from './MobileMenu'
import NavLink from './NavLink'

export default function Header() {
  return (
    <header
      className={cn(
        // Sticky position
        'sticky',
        // Position at top
        'top-0',
        // Full width
        'w-full',
        // Add padding
        'p-4',
        // Background color
        'bg-gray-100',
        // Z-index to stay above content
        'z-10',
      )}
      role="banner"
    >
      <nav
        className={cn(
          // Flexbox
          'flex',
          // Justify between
          'justify-between',
          // Items center
          'items-center',
          // Relative positioning for menu
          'relative',
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          className={cn(
            // Typography
            'text-xl',
            'font-light',
            'tracking-tight',
            'text-gray-600',
            // Rendering
            'antialiased',
            // Focus styles
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'rounded',
            'px-2',
            'py-1',
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
            'gap-4',
          )}
        >
          <NavLink href="/enhance" ariaLabel="Go to prompt enhancer page">
            Enhance Prompt
          </NavLink>
          <NavLink href="/history" ariaLabel="Go to prompt history page">
            Recent Prompts
          </NavLink>
        </div>

        {/* Mobile Menu - Hidden on desktop */}
        <MobileMenu />
      </nav>
    </header>
  )
}
