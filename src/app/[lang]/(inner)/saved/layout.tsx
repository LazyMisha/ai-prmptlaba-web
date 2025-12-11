import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'
import { getDictionary } from '@/i18n/dictionaries'

/**
 * Props for the saved layout.
 */
interface SavedLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the Saved Prompts page.
 * Uses Header with logo and centered page title.
 */
export default async function SavedLayout({
  children,
  params,
}: SavedLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageLayout showLogo pageTitle={dict.saved.pageTitle} locale={locale}>
      {children}
    </PageLayout>
  )
}
