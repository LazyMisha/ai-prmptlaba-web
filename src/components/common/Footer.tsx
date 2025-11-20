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
      <div>Footer</div>
    </footer>
  )
}
