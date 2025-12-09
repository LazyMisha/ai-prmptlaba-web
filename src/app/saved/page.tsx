import type { Metadata } from 'next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeading } from '@/components/common/PageHeading'
import { PageDescription } from '@/components/common/PageDescription'
import SavedPromptsClient from '@/components/saved/SavedPromptsClient'

export const metadata: Metadata = {
  title: 'Saved Prompts | AI Prompt Laba',
  description: 'View and manage your saved enhanced prompts organized by collections.',
}

/**
 * Saved prompts page - displays all saved prompts organized by collections.
 * Users can view, copy, and manage their saved enhanced prompts.
 */
export default function SavedPage() {
  return (
    <PageContainer>
      <PageHeading>Saved Prompts</PageHeading>
      <PageDescription>
        Your enhanced prompts organized by collections. Click on a collection to view its prompts.
      </PageDescription>

      <SavedPromptsClient />
    </PageContainer>
  )
}
