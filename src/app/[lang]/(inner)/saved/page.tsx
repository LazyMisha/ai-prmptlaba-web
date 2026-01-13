import type { Metadata } from 'next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageDescription } from '@/components/common/PageDescription'
import SavedPrompts from '@/components/saved/SavedPrompts'
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
 * Saved prompts page with collection organization.
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
      <SavedPrompts />
    </PageContainer>
  )
}
