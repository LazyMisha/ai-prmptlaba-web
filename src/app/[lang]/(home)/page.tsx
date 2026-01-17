import type { Metadata } from 'next'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeading } from '@/components/common/PageHeading'
import { PageDescription } from '@/components/common/PageDescription'
import { Button } from '@/components/common/Button'
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
          // Force proper GPU rendering on mobile
          'transform-gpu',
        )}
      />
      <PageHeading id="home-title">{dict.home.title}</PageHeading>
      <PageDescription id="home-description">
        {dict.home.description}
      </PageDescription>
      <Button href={`/${locale}/enhance`}>{dict.home.cta}</Button>
    </PageContainer>
  )
}
