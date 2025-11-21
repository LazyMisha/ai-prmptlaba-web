import { cn } from '@/lib/utils'

export default function Footer() {
  return (
    <footer
      className={cn(
        // Position at bottom
        'bottom-0',
        // Full width
        'w-full',
        // Add padding
        'p-4',
        // Background color
        'bg-gray-100',
        // Center text
        'text-center',
      )}
    >
      <p
        className={cn(
          // Text small
          'text-sm',
          // Text gray
          'text-gray-600',
        )}
      >
        &copy; {new Date().getFullYear()} AI PromptLaba. All rights reserved.
      </p>
    </footer>
  )
}
