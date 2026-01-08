import '@testing-library/jest-dom'

// Provide a global mock for i18n client hooks so tests don't need wrapping
// with an actual I18nProvider. This returns the English dictionary by default.
jest.mock('@/i18n/client', () => {
  const enModule = jest.requireActual('@/i18n/dictionaries/en.json')
  const en = enModule.default || enModule
  return {
    I18nProvider: ({ children }) => children,
    useI18n: () => ({ locale: 'en', dictionary: en }),
    useLocale: () => 'en',
    useDictionary: () => en,
    useTranslations: () => en,
  }
})

// Mock Next.js navigation hooks used in client components
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/en',
  }
})
