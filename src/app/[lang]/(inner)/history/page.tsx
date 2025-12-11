import type { Metadata } from 'next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageDescription } from '@/components/common/PageDescription'
import HistoryList from '@/components/history/HistoryList'

export const metadata: Metadata = {
  title: 'Recent Prompts | AI Prompt Laba',
  description: 'View your recently enhanced prompts history',
}

/**
 * History page that displays all recently enhanced prompts.
 * Uses IndexedDB to store and retrieve prompt history locally.
 * Page title is displayed in the Header via layout.
 */
export default function HistoryPage() {
  return (
    <PageContainer>
      <PageDescription>
        View and manage your recently enhanced prompts. All data is stored locally in your browser.
      </PageDescription>

      <HistoryList />
    </PageContainer>
  )
}
