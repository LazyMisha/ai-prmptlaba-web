import type { Metadata } from 'next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageDescription } from '@/components/common/PageDescription'
import SavedPromptsClient from '@/components/saved/SavedPromptsClient'
import { getDictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'

export const metadata: Metadata = {
  title: 'Saved Prompts | AI Prompt Laba',
  description:
    'View and manage your saved enhanced prompts organized by collections.',
}

/**
 * Props for the saved page.
 */
interface SavedPageProps {
  params: Promise<{ lang: string }>
}

/**
 * Saved prompts page - displays all saved prompts organized by collections.
 * Users can view, copy, and manage their saved enhanced prompts.
 * Page title is displayed in the Header via layout.
 */
export default async function SavedPage({ params }: SavedPageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageContainer>
      <PageDescription id="saved-description">
        {dict.saved.description}
      </PageDescription>
      <SavedPromptsClient basePath={`/${locale}`} />
    </PageContainer>
  )
}
