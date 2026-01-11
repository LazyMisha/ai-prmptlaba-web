import { cn } from '@/lib/utils'

interface PromptCardInfoProps {
  /** Timestamp when the prompt was created/saved */
  timestamp: number
  /** Target tool/platform used for enhancement */
  target: string
}

const PromptCardInfo = ({ timestamp, target }: PromptCardInfoProps) => {
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <>
      <time
        dateTime={date.toISOString()}
        className={cn(
          'text-xs',
          'text-[#86868b]',
          'font-normal',
          'tracking-tight',
        )}
      >
        {formattedDate}
      </time>
      <span
        className={cn(
          'px-2',
          'py-0.5',
          'bg-[#007aff]/10',
          'text-[#007aff]',
          'text-xs',
          'font-medium',
          'rounded-full',
        )}
      >
        {target}
      </span>
    </>
  )
}

export default PromptCardInfo
