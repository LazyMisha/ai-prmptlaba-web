import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'

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
 * Note: Locale validation is handled by [lang]/layout.tsx
 */
export default async function HomeLayout({
  children,
  params,
}: HomeLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale

  return <PageLayout locale={locale}>{children}</PageLayout>
}
