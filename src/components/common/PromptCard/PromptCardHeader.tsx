import { cn } from '@/lib/utils'

interface PromptCardHeaderProps {
  /** Left side component (e.g., icon or badge) */
  LeftSideComponent: React.ReactNode
  /** Right side component (e.g., additional actions) */
  RightSideComponent: React.ReactNode
}

const PromptCardHeader = ({
  LeftSideComponent,
  RightSideComponent,
}: PromptCardHeaderProps) => {
  return (
    <header
      className={cn(
        // Layout
        'flex',
        'items-center',
        'justify-between',
        // Spacing
        'px-4',
        // Border
        'border-b',
        'border-black/[0.05]',
      )}
    >
      {/* Left side: Date + Context tag */}
      <div className={cn('flex', 'items-center', 'gap-2')}>
        {LeftSideComponent}
      </div>

      {/* Right side: Action buttons */}
      <div className={cn('flex', 'items-center', 'gap-1')}>
        {RightSideComponent}
      </div>
    </header>
  )
}

export default PromptCardHeader
