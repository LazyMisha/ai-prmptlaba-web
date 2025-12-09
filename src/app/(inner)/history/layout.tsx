import { PageLayout } from '@/components/common/PageLayout'

/**
 * Layout for the History page.
 * Uses Header with logo and centered page title.
 */
export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout showLogo pageTitle="Recent Prompts">
      {children}
    </PageLayout>
  )
}
