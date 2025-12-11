import type { Metadata } from 'next'
import EnhanceForm from '@/components/enhance/EnhanceForm'
import { PageContainer } from '@/components/common/PageContainer'
import { PageDescription } from '@/components/common/PageDescription'
import { getDictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'

export const metadata: Metadata = {
  title: 'Enhance Prompt | AI Prompt Laba',
  description:
    'Transform your prompts into professional, effective AI instructions',
}

/**
 * Props for the enhance page.
 */
interface EnhancePageProps {
  params: Promise<{ lang: string }>
}

/**
 * Prompt enhancement page (Server Component)
 * Page title is displayed in the Header via layout.
 * Displays translated description based on the current locale.
 */
export default async function EnhancePage({ params }: EnhancePageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <PageContainer>
      <PageDescription>{dict.enhance.description}</PageDescription>
      <EnhanceForm
        translations={{
          form: dict.enhance.form,
          result: dict.enhance.result,
          validation: dict.enhance.validation,
          actions: dict.common.actions,
          saveDialog: dict.saveDialog,
        }}
      />
    </PageContainer>
  )
}
