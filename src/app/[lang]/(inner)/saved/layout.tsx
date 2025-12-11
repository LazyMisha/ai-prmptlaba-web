import { PageLayout } from '@/components/common/PageLayout'
import { hasLocale, type Locale } from '@/i18n/locales'
import { notFound } from 'next/navigation'

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
export default async function SavedLayout({ children, params }: SavedLayoutProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const locale = lang as Locale

  return (
    <PageLayout showLogo pageTitle="Saved Prompts" locale={locale}>
      {children}
    </PageLayout>
  )
}
