import type { Metadata } from 'next'
import EnhanceForm from '@/components/enhance/EnhanceForm'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeading } from '@/components/common/PageHeading'
import { PageDescription } from '@/components/common/PageDescription'

export const metadata: Metadata = {
  title: 'Enhance Prompt | AI Prompt Laba',
  description: 'Transform your prompts into professional, effective AI instructions',
}

/**
 * Prompt enhancement page (Server Component)
 */
export default function EnhancePage() {
  return (
    <PageContainer>
      <PageHeading>Prompt Enhancer</PageHeading>
      <PageDescription>
        Transform your basic prompts into professional, effective AI instructions optimized for your
        target context.
      </PageDescription>
      <EnhanceForm />
    </PageContainer>
  )
}
