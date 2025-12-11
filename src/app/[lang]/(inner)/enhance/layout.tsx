import { PageLayout } from '@/components/common/PageLayout'
import { hasLocale, type Locale } from '@/i18n/locales'
import { notFound } from 'next/navigation'

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
export default async function EnhanceLayout({ children, params }: EnhanceLayoutProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const locale = lang as Locale

  return (
    <PageLayout showLogo pageTitle="Prompt Enhancer" locale={locale}>
      {children}
    </PageLayout>
  )
}
