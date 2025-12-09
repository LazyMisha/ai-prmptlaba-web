import { PageLayout } from '@/components/common/PageLayout'

/**
 * Layout for the Saved Prompts page.
 * Uses Header with logo and centered page title.
 */
export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout showLogo pageTitle="Saved Prompts">
      {children}
    </PageLayout>
  )
}
