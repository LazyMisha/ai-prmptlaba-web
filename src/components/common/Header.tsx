import Link from 'next/link'
import { APP_NAME } from '@/constants/app'
import { cn } from '@/lib/utils'

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
    >
      <nav
        className={cn(
          // Flexbox
          'flex',
          // Justify between
          'justify-between',
          // Items center
          'items-center',
        )}
      >
        <Link
          className={cn(
            // Font size
            'text-xl',
            // Font weight
            'font-bold',
          )}
          href="/"
        >
          {APP_NAME}
        </Link>
        <Link
          className={cn(
            // Font size
            'text-lg',
            // Font weight
            'font-medium',
          )}
          href="/enhance"
        >
          Enhance Prompt
        </Link>
      </nav>
    </header>
  )
}
