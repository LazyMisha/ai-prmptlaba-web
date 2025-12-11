import type { Metadata } from 'next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageDescription } from '@/components/common/PageDescription'
import HistoryList from '@/components/history/HistoryList'
import { getDictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'

export const metadata: Metadata = {
  title: 'Recent Prompts | AI Prompt Laba',
  description: 'View your recently enhanced prompts history',
}

/**
 * Props for the history page.
 */
interface HistoryPageProps {
  params: Promise<{ lang: string }>
}

/**
 * History page that displays all recently enhanced prompts.
 * Uses IndexedDB to store and retrieve prompt history locally.
 * Page title is displayed in the Header via layout.
 */
export default async function HistoryPage({ params }: HistoryPageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageContainer>
      <PageDescription>{dict.history.description}</PageDescription>
      <HistoryList
        translations={{
          history: dict.history,
          promptCard: dict.promptCard,
          actions: dict.common.actions,
          common: {
            entry: dict.common.entry,
            entries: dict.common.entries,
          },
        }}
      />
    </PageContainer>
  )
}
