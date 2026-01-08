import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'

/**
 * Props for the enhance layout.
 */
interface EnhanceLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the Enhance page.
 * Uses Header with logo and auto-detected page title.
 */
export default async function EnhanceLayout({
  children,
  params,
}: EnhanceLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale

  return (
    <PageLayout showLogo locale={locale}>
      {children}
    </PageLayout>
  )
}
