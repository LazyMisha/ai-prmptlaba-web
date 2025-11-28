import type { Metadata } from 'next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeading } from '@/components/common/PageHeading'
import { PageDescription } from '@/components/common/PageDescription'

export const metadata: Metadata = {
  title: 'AI Prompt Laba | Smart Prompt Creation & Management',
  description:
    'Your hub for smart prompt creation and management. Transform basic ideas into professional, effective AI instructions with ease.',
}

/**
 * Home page (Server Component)
 * Hero section with bold typography and clear messaging.
 */
export default function HomePage() {
  return (
    <PageContainer centered>
      <PageHeading>AI Prompt Laba</PageHeading>
      <PageDescription>
        Your hub for smart prompt creation and management. Transform basic ideas into professional,
        effective AI instructions with ease.
      </PageDescription>
    </PageContainer>
  )
}
