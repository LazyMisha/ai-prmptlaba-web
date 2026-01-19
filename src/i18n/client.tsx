'use client'

import { createContext, useContext } from 'react'
import type { Locale } from './locales'
import type { Dictionary } from './dictionaries'

/**
 * Context value containing locale and dictionary for i18n.
 */
interface I18nContextValue {
  /** Current locale (e.g., 'en', 'uk') */
  locale: Locale
  /** Full translations dictionary for the current locale */
  dictionary: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

/**
 * Props for the I18nProvider component.
 */
interface I18nProviderProps {
  /** Current locale */
  locale: Locale
  /** Translations dictionary loaded on the server */
  dictionary: Dictionary
  /** Child components that will have access to i18n context */
  children: React.ReactNode
}

/**
 * Provider component that supplies i18n context to the component tree.
 * Must wrap all components that use i18n hooks.
 *
 * @example
 * ```tsx
 * // In a Server Component (e.g., layout.tsx)
 * const dict = await getDictionary(locale)
 * return (
 *   <I18nProvider locale={locale} dictionary={dict}>
 *     {children}
 *   </I18nProvider>
 * )
 * ```
 */
export function I18nProvider({
  locale,
  dictionary,
  children,
}: I18nProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, dictionary }}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * Returns the full i18n context including locale and dictionary.
 * Use this when you need access to both locale and translations.
 *
 * @throws Error if used outside of I18nProvider
 * @returns I18nContextValue containing locale and dictionary
 *
 * @example
 * ```tsx
 * 'use client'
 * const { locale, dictionary } = useI18n()
 * ```
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}

/**
 * Returns the current locale.
 * Use this when you only need the locale identifier.
 *
 * @throws Error if used outside of I18nProvider
 * @returns Current locale (e.g., 'en', 'uk')
 *
 * @example
 * ```tsx
 * 'use client'
 * const locale = useLocale() // 'en' | 'uk'
 * ```
 */
export function useLocale(): Locale {
  return useI18n().locale
}

/**
 * Returns the full translations dictionary for the current locale.
 * Alias for useTranslations().
 *
 * @throws Error if used outside of I18nProvider
 * @returns Dictionary - the full translations object
 *
 * @example
 * ```tsx
 * 'use client'
 * const dict = useDictionary()
 * return <h1>{dict.home.title}</h1>
 * ```
 */
export function useDictionary(): Dictionary {
  return useI18n().dictionary
}

/**
 * Client translations hook: returns the full dictionary.
 * Preferred usage across client components.
 *
 * @throws Error if used outside of I18nProvider
 * @returns Dictionary - the full translations object
 *
 * @example
 * ```tsx
 * 'use client'
 * import { useTranslations } from '@/i18n/client'
 *
 * export function MyComponent() {
 *   const dict = useTranslations()
 *   return <h1>{dict.home.title}</h1>
 * }
 * ```
 */
export function useTranslations(): Dictionary {
  return useDictionary()
}
