/**
 * i18n module exports.
 * Centralized exports for internationalization utilities.
 *
 * Note: Dictionary functions are exported from a separate file (dictionaries.ts)
 * that uses 'server-only'. Import them directly when needed in Server Components.
 * Client Components should only import from locales.ts.
 */

// Client-safe exports (can be used in both Server and Client Components)
export { locales, defaultLocale, localeNames, localeFullNames, hasLocale } from './locales'
export type { Locale } from './locales'

// Server-only exports - import directly from '@/i18n/dictionaries' in Server Components
// export { getDictionary } from './dictionaries'
// export type { Dictionary } from './dictionaries'
