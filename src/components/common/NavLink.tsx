'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  /** The URL path to navigate to */
  href: string
  /** The visible text of the link */
  children: React.ReactNode
  /** Accessible label for screen readers */
  ariaLabel: string
  /** Additional CSS classes */
  className?: string
  /** Click handler for closing menus */
  onClick?: () => void
  /** ARIA role (e.g., 'menuitem' for dropdown menus) */
  role?: string
}

/**
 * Navigation link component with smooth hover transitions.
 * Features refined typography, subtle interaction feedback, and active state indicator.
 */
export default function NavLink({
  href,
  children,
  ariaLabel,
  className,
  onClick,
  role,
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      onClick={onClick}
      role={role}
      className={cn(
        // Typography - navigation style
        'text-sm',
        'font-normal',
        'tracking-tight',
        'text-[#1d1d1f]',
        // Rendering
        'antialiased',
        // Smooth hover transition
        'transition-opacity',
        'duration-200',
        'hover:opacity-60',
        // Active state
        isActive && 'font-semibold opacity-100',
        !isActive && 'opacity-60',
        // Focus styles
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#007aff]',
        'focus-visible:ring-offset-2',
        'rounded-lg',
        'px-3',
        'py-2',
        className,
      )}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
