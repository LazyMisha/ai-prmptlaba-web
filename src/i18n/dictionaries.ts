import 'server-only'
import type { Locale } from './locales'

/**
 * Dictionary type based on the English dictionary structure.
 */
export type Dictionary = {
  home: {
    description: string
  }
  enhance: {
    description: string
  }
}

/**
 * Dictionary loaders for each supported locale.
 * Uses dynamic imports for code splitting.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default as Dictionary),
  uk: () => import('./dictionaries/uk.json').then((module) => module.default as Dictionary),
  pl: () => import('./dictionaries/pl.json').then((module) => module.default as Dictionary),
}

/**
 * Loads the dictionary for the specified locale.
 * @param locale - The locale code to load translations for
 * @returns Promise resolving to the dictionary object
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]()
