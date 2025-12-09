import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeading } from '@/components/common/PageHeading'
import { PageDescription } from '@/components/common/PageDescription'

export const metadata: Metadata = {
  title: 'AI Prompt Laba | Smart Prompt Creation & Management',
  description:
    'Your hub for smart prompt creation and management. Transform basic ideas into professional, effective AI instructions with ease.',
}

/**
 * Home page (Server Component)
 */
export default function HomePage() {
  return (
    <PageContainer centered>
      <Image
        src="/logo.webp"
        alt="AI Prompt Laba - AI-powered prompt enhancement tool"
        aria-hidden="true" // Screen readers skip (heading has brand name)
        width={160}
        height={160}
        priority
        className={cn(
          // Sizing - responsive (larger for hero impact)
          'w-28',
          'h-28',
          'md:w-36',
          'md:h-36',
          'lg:w-40',
          'lg:h-40',
          // Shadow for depth
          'drop-shadow-lg',
          // Rounded corners
          'rounded-[22%]',
        )}
      />
      <PageHeading>AI Prompt Laba</PageHeading>
      <PageDescription>
        Your hub for smart prompt creation and management. Transform basic ideas into professional,
        effective AI instructions with ease.
      </PageDescription>

      <Link
        href="/enhance"
        className={cn(
          // Layout
          'inline-flex',
          'items-center',
          'justify-center',
          // Sizing
          'px-7',
          'py-3.5',
          'min-h-[50px]',
          // Typography
          'text-[17px]',
          'font-semibold',
          'tracking-[-0.01em]',
          'text-white',
          // Background
          'bg-[#007aff]',
          // Border
          'rounded-xl',
          // Transition
          'transition-all',
          'duration-200',
          'ease-out',
          // Hover
          'hover:bg-[#0071e3]',
          // Focus - high contrast ring for accessibility
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[#007aff]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-white',
          // Active
          'active:opacity-80',
          'active:scale-[0.98]',
        )}
      >
        Enhance Your Prompt
      </Link>
    </PageContainer>
  )
}
