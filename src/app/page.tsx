import { cn } from '@/lib/utils'

export default function HomePage() {
  return (
    <div
      className={cn(
        // width=768px max
        'max-w-3xl',
        // center horizontally
        'mx-auto',
        // center text
        'text-center',
        // vertical spacing
        'space-y-6',
        // padding
        'p-4',
      )}
    >
      <h1
        className={cn(
          // font size
          'text-4xl',
          // font weight
          'font-semibold',
        )}
      >
        AI Prompt Laba
      </h1>
      <p
        className={cn(
          // font size
          'text-lg',
          // line height
          'leading-relaxed',
        )}
      >
        Your hub for smart prompt creation and management. Transform basic ideas into professional,
        effective AI instructions with ease.
      </p>
    </div>
  )
}
