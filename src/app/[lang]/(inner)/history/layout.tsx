import type { ReactNode } from 'react'
import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'
import { getDictionary } from '@/i18n/dictionaries'

interface HistoryLayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the History page within the inner route group.
 * Displays "Recent Prompts" title in the header with the logo.
 * Note: Locale validation is handled by [lang]/layout.tsx
 */
export default async function HistoryLayout({
  children,
  params,
}: HistoryLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageLayout showLogo pageTitle={dict.history.pageTitle} locale={locale}>
      {children}
    </PageLayout>
  )
}
