import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/common/PageContainer'

/**
 * Loading skeleton for the saved prompts page.
 * Displays while the page content is being loaded.
 */
export default function SavedLoading() {
  return (
    <PageContainer>
      {/* Header skeleton */}
      <div className="mb-6 sm:mb-8">
        <div
          className={cn(
            // Size
            'h-8',
            'w-48',
            // Background
            'bg-gray-200',
            // Shape
            'rounded-lg',
            // Animation
            'animate-pulse',
            // Spacing
            'mb-2',
          )}
        />
        <div
          className={cn(
            // Size
            'h-5',
            'w-80',
            'max-w-full',
            // Background
            'bg-gray-100',
            // Shape
            'rounded-lg',
            // Animation
            'animate-pulse',
          )}
        />
      </div>

      {/* Content skeleton */}
      <div
        className={cn(
          // Spacing
          'mt-8',
          'md:mt-10',
          // Layout
          'flex',
          'flex-col',
          // Responsive
          'md:flex-row',
          'md:gap-8',
        )}
      >
        {/* Sidebar skeleton */}
        <aside
          className={cn(
            // Size
            'w-full',
            // Spacing
            'mb-6',
            // Responsive
            'md:w-[280px]',
            'md:shrink-0',
            'md:mb-0',
          )}
        >
          {/* Mobile: Dropdown selector skeleton */}
          <div className="md:hidden space-y-3">
            {/* Label */}
            <div
              className={cn(
                // Size
                'h-4',
                'w-20',
                // Background
                'bg-gray-200',
                // Shape
                'rounded',
                // Animation
                'animate-pulse',
              )}
            />
            {/* Dropdown */}
            <div
              className={cn(
                // Size
                'h-12',
                'w-full',
                // Background
                'bg-gray-100',
                // Shape
                'rounded-xl',
                // Animation
                'animate-pulse',
              )}
            />
            {/* Create button */}
            <div
              className={cn(
                // Size
                'h-12',
                'w-full',
                // Background
                'bg-gray-50',
                // Border
                'border-2',
                'border-dashed',
                'border-gray-200',
                // Shape
                'rounded-xl',
                // Animation
                'animate-pulse',
              )}
            />
          </div>

          {/* Desktop: Sidebar skeleton */}
          <div className={cn('hidden', 'md:block', 'space-y-2')}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  // Size
                  'h-11',
                  // Background
                  'bg-gray-100',
                  // Shape
                  'rounded-xl',
                  // Animation
                  'animate-pulse',
                )}
              />
            ))}
            {/* Create button */}
            <div
              className={cn(
                // Size
                'h-11',
                // Background
                'bg-gray-50',
                // Border
                'border-2',
                'border-dashed',
                'border-gray-200',
                // Shape
                'rounded-xl',
                // Animation
                'animate-pulse',
              )}
            />
          </div>
        </aside>

        {/* Main content skeleton - single column list */}
        <main className={cn('flex-1', 'min-w-0')}>
          <div
            className={cn(
              // Layout
              'flex',
              'flex-col',
              // Spacing
              'gap-4',
            )}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  // Size
                  'h-40',
                  // Background
                  'bg-gray-100',
                  // Shape
                  'rounded-2xl',
                  // Animation
                  'animate-pulse',
                )}
              />
            ))}
          </div>
        </main>
      </div>
    </PageContainer>
  )
}
