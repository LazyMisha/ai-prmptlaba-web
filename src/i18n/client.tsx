'use client'

import { createContext, useContext } from 'react'
import type { Locale } from './locales'
import type { Dictionary } from './dictionaries'

interface I18nContextValue {
  locale: Locale
  dictionary: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  locale: Locale
  dictionary: Dictionary
  children: React.ReactNode
}

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

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}

export function useLocale(): Locale {
  return useI18n().locale
}

export function useDictionary(): Dictionary {
  return useI18n().dictionary
}

/**
 * Client translations hook: returns the full dictionary.
 * Preferred usage across client components.
 */
export function useTranslations(): Dictionary {
  return useDictionary()
}
