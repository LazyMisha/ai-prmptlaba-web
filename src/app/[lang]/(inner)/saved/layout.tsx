import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'

/**
 * Props for the saved layout.
 */
interface SavedLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the Saved Prompts page.
 * Uses Header with logo and auto-detected page title.
 */
export default async function SavedLayout({
  children,
  params,
}: SavedLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale

  return (
    <PageLayout showLogo locale={locale}>
      {children}
    </PageLayout>
  )
}
