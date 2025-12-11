import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { PageLayout } from '@/components/common/PageLayout'
import { hasLocale, type Locale } from '@/i18n/locales'

interface HistoryLayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Layout for the History page within the inner route group.
 * Displays "Recent Prompts" title in the header with the logo.
 */
export default async function HistoryLayout({ children, params }: HistoryLayoutProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  return (
    <PageLayout showLogo pageTitle="Recent Prompts" locale={lang as Locale}>
      {children}
    </PageLayout>
  )
}
