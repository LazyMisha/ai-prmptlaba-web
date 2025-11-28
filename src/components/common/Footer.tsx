import { cn } from '@/lib/utils'

/**
 * Minimalist footer component.
 * Features subtle separator and refined typography.
 */
export default function Footer() {
  return (
    <footer
      className={cn(
        // Full width
        'w-full',
        // Generous padding
        'px-6',
        'py-6',
        'md:px-10',
        // Subtle top border
        'border-t',
        'border-black/[0.08]',
        // Background
        'bg-[#f5f5f7]',
      )}
      role="contentinfo"
    >
      <div
        className={cn(
          // Max width container
          'max-w-6xl',
          'mx-auto',
          // Center text
          'text-center',
        )}
      >
        <p
          className={cn(
            // Typography - secondary text style
            'text-xs',
            'font-normal',
            'tracking-tight',
            // Muted color
            'text-[#86868b]',
            // Rendering
            'antialiased',
          )}
        >
          {new Date().getFullYear()} AI PromptLaba.
        </p>
      </div>
    </footer>
  )
}
