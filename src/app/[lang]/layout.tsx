import { notFound } from 'next/navigation'
import { locales, hasLocale, type Locale } from '@/i18n/locales'
import { getDictionary } from '@/i18n/dictionaries'
import { I18nProvider } from '@/i18n/client'

/**
 * Generate static params for all supported locales.
 * This enables static generation of pages for each locale.
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

/**
 * Props for the language layout.
 */
interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

/**
 * Language-specific layout.
 * Sets the html lang attribute and validates the locale.
 */
export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params

  // Validate locale and return 404 if invalid
  if (!hasLocale(lang)) {
    notFound()
  }

  // Cast to Locale type after validation
  const locale = lang as Locale

  // Load dictionary on the server and provide it to client components
  const dict = await getDictionary(locale)

  return (
    <I18nProvider locale={locale} dictionary={dict}>
      {/* Set lang attribute on the html element via script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = "${locale}";`,
        }}
      />
      {children}
    </I18nProvider>
  )
}
