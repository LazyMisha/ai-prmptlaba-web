import { PageLayout } from '@/components/common/PageLayout'
import { hasLocale, type Locale } from '@/i18n/locales'
import { notFound } from 'next/navigation'

/**
 * Props for the home layout.
 */
interface HomeLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the home page.
 * Uses default Header with brand name text.
 */
export default async function HomeLayout({ children, params }: HomeLayoutProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const locale = lang as Locale

  return <PageLayout locale={locale}>{children}</PageLayout>
}
