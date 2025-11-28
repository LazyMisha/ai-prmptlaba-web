import type { Metadata } from 'next'
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
 * Hero section with bold typography and clear messaging.
 */
export default function HomePage() {
  return (
    <PageContainer centered>
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
