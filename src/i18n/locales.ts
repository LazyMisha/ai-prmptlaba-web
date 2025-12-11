/**
 * Supported locales configuration.
 * Easily extendable by adding new locale codes.
 */
export const locales = ['en', 'uk', 'pl'] as const

/**
 * Type representing supported locale codes.
 */
export type Locale = (typeof locales)[number]

/**
 * Default locale used when no locale is specified.
 */
export const defaultLocale: Locale = 'en'

/**
 * Locale display names for the language switcher (short codes).
 */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  uk: 'UA',
  pl: 'PL',
}

/**
 * Full locale names for accessibility and display.
 */
export const localeFullNames: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
  pl: 'Polski',
}

/**
 * Type guard to check if a string is a valid locale.
 * @param lang - The string to check.
 * @returns True if the string is a valid locale.
 */
export function hasLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale)
}
