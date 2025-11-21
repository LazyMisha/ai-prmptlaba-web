import type { Metadata } from 'next'
import EnhanceForm from '@/components/enhance/EnhanceForm'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Enhance Prompt | AI Prompt Laba',
  description: 'Transform your prompts into professional, effective AI instructions',
}

/**
 * Prompt enhancement page (Server Component)
 */
export default function EnhancePage() {
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
      {/* Page Header */}
      <div>
        <h1
          className={cn(
            // font size
            'text-4xl',
            // font weight
            'font-semibold',
          )}
        >
          Prompt Enhancer
        </h1>
        <p
          className={cn(
            // font size
            'text-lg',
            // color
            'text-gray-700',
          )}
        >
          Transform your basic prompts into professional, effective AI instructions optimized for
          your target context.
        </p>
      </div>

      {/* Enhancement Form (Client Component) */}
      <EnhanceForm />
    </div>
  )
}
