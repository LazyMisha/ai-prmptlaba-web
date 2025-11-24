import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  /** The URL path to navigate to */
  href: string
  /** The visible text of the link */
  children: React.ReactNode
  /** Accessible label for screen readers */
  ariaLabel?: string
  /** Additional CSS classes */
  className?: string
  /** Click handler for closing menus */
  onClick?: () => void
  /** ARIA role (e.g., 'menuitem' for dropdown menus) */
  role?: string
}

/**
 * Reusable navigation link component with consistent styling.
 * Used in both desktop navigation and mobile menu.
 */
export default function NavLink({
  href,
  children,
  ariaLabel,
  className,
  onClick,
  role,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role={role}
      className={cn(
        // Typography
        'text-lg',
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
        className,
      )}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  )
}
