import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeading } from '@/components/common/PageHeading'
import { PageDescription } from '@/components/common/PageDescription'
import { getDictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'

export const metadata: Metadata = {
  title: 'AI Prompt Laba | Smart Prompt Creation & Management',
  description:
    'Your hub for smart prompt creation and management. Transform basic ideas into professional, effective AI instructions with ease.',
}

/**
 * Props for the home page.
 */
interface HomePageProps {
  params: Promise<{ lang: string }>
}

/**
 * Home page (Server Component)
 * Displays translated content based on the current locale.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageContainer centered>
      <Image
        src="/logo.webp"
        alt="AI Prompt Laba - AI-powered prompt enhancement tool"
        aria-hidden="true"
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
      <PageHeading>{dict.home.title}</PageHeading>
      <PageDescription>{dict.home.description}</PageDescription>

      <Link
        href={`/${locale}/enhance`}
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
        {dict.home.cta}
      </Link>
    </PageContainer>
  )
}
