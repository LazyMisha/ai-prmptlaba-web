import type { ReactNode } from 'react'
import { PageLayout } from '@/components/common/PageLayout'
import type { Locale } from '@/i18n/locales'

interface HistoryLayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the History page within the inner route group.
 * Uses Header with logo and auto-detected page title.
 * Note: Locale validation is handled by [lang]/layout.tsx
 */
export default async function HistoryLayout({
  children,
  params,
}: HistoryLayoutProps) {
  const { lang } = await params
  const locale = lang as Locale

  return (
    <PageLayout showLogo locale={locale}>
      {children}
    </PageLayout>
  )
}
