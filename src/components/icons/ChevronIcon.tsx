import { cn } from '@/lib/utils'

type ChevronDirection = 'up' | 'down' | 'left' | 'right'
type RotationAmount = 90 | 180

interface ChevronIconProps {
  /** Direction the chevron points */
  direction?: ChevronDirection
  /** Whether the icon should be rotated (useful for expand/collapse) */
  isRotated?: boolean
  /** Amount of rotation in degrees when isRotated is true (default: 180) */
  rotationAmount?: RotationAmount
  /** Additional CSS classes */
  className?: string
}

/**
 * Chevron icon with configurable direction and smooth rotation animation.
 * Used for expand/collapse indicators, navigation, and dropdowns.
 */
export default function ChevronIcon({
  direction = 'down',
  isRotated = false,
  rotationAmount = 180,
  className,
}: ChevronIconProps) {
  // Base rotation based on direction
  const directionRotation: Record<ChevronDirection, string> = {
    down: 'rotate-0',
    up: 'rotate-180',
    right: '-rotate-90',
    left: 'rotate-90',
  }

  // Rotation class when isRotated is true
  const rotationClass: Record<RotationAmount, string> = {
    90: 'rotate-90',
    180: 'rotate-180',
  }

  return (
    <svg
      className={cn(
        // Sizing
        'w-5',
        'h-5',
        // Colors
        'text-gray-400',
        // Transform with smooth animation
        'transition-transform',
        'duration-300',
        'ease-out',
        // Direction rotation (applied first, can be overridden by className)
        directionRotation[direction],
        // Additional rotation when isRotated is true
        isRotated && rotationClass[rotationAmount],
        className,
      )}
      aria-hidden="true"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
