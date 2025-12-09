import type { Metadata } from 'next'
import EnhanceForm from '@/components/enhance/EnhanceForm'
import { PageContainer } from '@/components/common/PageContainer'
import { PageDescription } from '@/components/common/PageDescription'

export const metadata: Metadata = {
  title: 'Enhance Prompt | AI Prompt Laba',
  description: 'Transform your prompts into professional, effective AI instructions',
}

/**
 * Prompt enhancement page (Server Component)
 * Page title is displayed in the Header via layout.
 */
export default function EnhancePage() {
  return (
    <PageContainer>
      <PageDescription>
        Transform your basic prompts into professional, effective AI instructions optimized for your
        target context.
      </PageDescription>
      <EnhanceForm />
    </PageContainer>
  )
}
