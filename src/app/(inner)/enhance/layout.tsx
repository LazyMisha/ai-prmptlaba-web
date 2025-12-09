import { PageLayout } from '@/components/common/PageLayout'

/**
 * Layout for the Enhance page.
 * Uses Header with logo and centered page title.
 */
export default function EnhanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout showLogo pageTitle="Prompt Enhancer">
      {children}
    </PageLayout>
  )
}
