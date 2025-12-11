import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'
import { getDictionary } from '@/i18n/dictionaries'

/**
 * Props for the enhance layout.
 */
interface EnhanceLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the Enhance page.
 * Uses Header with logo and centered page title.
 */
export default async function EnhanceLayout({
  children,
  params,
}: EnhanceLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageLayout showLogo pageTitle={dict.enhance.pageTitle} locale={locale}>
      {children}
    </PageLayout>
  )
}
