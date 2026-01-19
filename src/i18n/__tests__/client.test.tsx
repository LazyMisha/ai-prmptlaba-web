/**
 * @jest-environment jsdom
 */
import { render, screen, renderHook } from '@testing-library/react'
import {
  I18nProvider,
  useI18n,
  useLocale,
  useDictionary,
  useTranslations,
} from '../client'
import type { Locale } from '../locales'
import type { Dictionary } from '../dictionaries'

// Unmock @/i18n/client for this test file since we're testing it directly
jest.unmock('@/i18n/client')

// Mock dictionary for testing - includes all required properties
const mockDictionary: Dictionary = {
  common: {
    appName: 'Test App',
    navigation: {
      enhance: 'Enhance',
      saved: 'Saved',
      history: 'History',
      goToHome: 'Go to Home',
      goToEnhance: 'Go to Enhance',
      goToSaved: 'Go to Saved',
      goToHistory: 'Go to History',
      openMenu: 'Open Menu',
      closeMenu: 'Close Menu',
    },
    actions: {
      copy: 'Copy',
      copied: 'Copied',
      save: 'Save',
      saved: 'Saved',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      move: 'Move',
      create: 'Create',
      rename: 'Rename',
      tryAgain: 'Try Again',
      clearAll: 'Clear All',
    },
    loading: 'Loading...',
    entry: 'entry',
    entries: 'entries',
    entriesMany: 'entries',
  },
  home: {
    title: 'Test Home Title',
    description: 'Test description',
    cta: 'Get Started',
  },
  enhance: {
    description: 'Enhance description',
    form: {
      ariaLabel: 'Prompt form',
      targetLabel: 'Target',
      targetHelperText: 'Helper text',
      promptLabel: 'Prompt',
      placeholder: 'Enter prompt',
      helperText: 'Helper',
      moreCharNeeded: 'more character needed',
      moreCharsNeeded: 'more characters needed',
      overLimit: 'over limit',
      enhanceButton: 'Enhance',
      enhancing: 'Enhancing...',
      enhancingAriaLabel: 'Enhancing prompt',
      enhanceDisabledAriaLabel: 'Enhance disabled',
      enhanceAriaLabel: 'Enhance prompt',
    },
    result: {
      title: 'Enhanced Prompt',
      ariaLabel: 'Enhanced prompt result',
      error: 'Error',
      viewOriginal: 'View Original',
      copyToClipboard: 'Copy to clipboard',
      copiedToClipboard: 'Copied!',
      promptSaved: 'Prompt saved',
      saveToCollection: 'Save to collection',
    },
    validation: {
      enterPrompt: 'Please enter a prompt',
      minLength: 'Minimum length',
      maxLength: 'Maximum length',
      networkError: 'Network error',
      unexpectedError: 'Unexpected error',
    },
  },
  history: {
    description: 'Your prompt history',
    loading: 'Loading...',
    error: 'Error loading history',
    empty: {
      title: 'No history',
      description: 'No prompts yet',
      cta: 'Create your first prompt',
    },
    clearAll: {
      title: 'Clear History',
      description: 'This will delete all history',
      confirm: 'Clear All',
    },
  },
  saved: {
    description: 'Your saved prompts',
    empty: {
      title: 'No saved prompts',
      description: 'Save prompts to see them here',
      cta: 'Enhance a prompt',
    },
    noPromptsInCollection: 'No prompts in this collection',
    collections: {
      all: 'All Prompts',
      label: 'Collections',
      create: 'Create Collection',
      rename: 'Rename Collection',
      delete: 'Delete Collection',
      newCollection: 'New Collection',
      collectionName: 'Collection Name',
      collectionColor: 'Color',
      namePlaceholder: 'Enter name',
      nameRequired: 'Name is required',
      nameTooLong: 'Name is too long',
      nameExists: 'Name already exists',
      manage: 'Manage',
      manageTitle: 'Manage Collections',
      noCollectionsYet: 'No collections yet',
      noCollectionsAvailable: 'No collections available',
      backToCollections: 'Back to collections',
      current: 'Current',
    },
    prompts: {
      delete: 'Delete',
      deleteConfirm: 'Delete this prompt?',
      move: 'Move',
      moveToAnother: 'Move to another collection',
    },
    deleteCollectionConfirm: 'Delete this collection?',
  },
  promptCard: {
    target: 'Target',
    original: 'Original',
    enhanced: 'Enhanced',
    expandCollapse: 'Expand/Collapse',
    deleteEntry: 'Delete entry',
    copy: 'Copy',
    copied: 'Copied',
    move: 'Move',
    delete: 'Delete',
    copyToClipboard: 'Copy to clipboard',
    copiedToClipboard: 'Copied!',
    moveToAnother: 'Move to another',
  },
  toast: {
    success: {
      promptDeleted: 'Prompt deleted',
      collectionDeleted: 'Collection deleted',
      collectionRenamed: 'Collection renamed',
      collectionCreated: 'Collection created',
      promptMoved: 'Prompt moved',
      promptSaved: 'Prompt saved',
      savedTo: 'Saved to',
    },
    error: {
      loadFailed: 'Failed to load',
      deleteFailed: 'Failed to delete',
      deleteCollectionFailed: 'Failed to delete collection',
      renameFailed: 'Failed to rename',
      createFailed: 'Failed to create',
      moveFailed: 'Failed to move',
      loadCollectionsFailed: 'Failed to load collections',
      selectCollection: 'Please select a collection',
      saveFailed: 'Failed to save',
    },
  },
  saveDialog: {
    title: 'Save to Collection',
    newCollectionTitle: 'New Collection',
    closeDialog: 'Close dialog',
    quickSaveTo: 'Quick save to',
    orChooseCollection: 'Or choose a collection',
    orCreateNew: 'Or create new',
    noCollectionsYet: 'No collections yet',
    prompt: 'prompt',
    prompts: 'prompts',
    createAndSave: 'Create and Save',
    saveToSelected: 'Save to Selected',
  },
}

const mockLocale: Locale = 'en'

/**
 * Wrapper component that provides I18nProvider context for testing hooks.
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider locale={mockLocale} dictionary={mockDictionary}>
      {children}
    </I18nProvider>
  )
}

describe('I18nProvider', () => {
  it('renders children correctly', () => {
    render(
      <I18nProvider locale={mockLocale} dictionary={mockDictionary}>
        <div data-testid="child">Child content</div>
      </I18nProvider>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('provides context to nested components', () => {
    function TestConsumer() {
      const dict = useTranslations()
      return <span>{dict.home.title}</span>
    }

    render(
      <I18nProvider locale={mockLocale} dictionary={mockDictionary}>
        <TestConsumer />
      </I18nProvider>,
    )

    expect(screen.getByText('Test Home Title')).toBeInTheDocument()
  })
})

describe('useI18n', () => {
  it('returns locale and dictionary when used within provider', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: TestWrapper,
    })

    expect(result.current.locale).toBe('en')
    expect(result.current.dictionary).toBe(mockDictionary)
  })

  it('throws error when used outside of I18nProvider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useI18n())
    }).toThrow('useI18n must be used within I18nProvider')

    consoleSpy.mockRestore()
  })
})

describe('useLocale', () => {
  it('returns the current locale', () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: TestWrapper,
    })

    expect(result.current).toBe('en')
  })

  it('throws error when used outside of I18nProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useLocale())
    }).toThrow('useI18n must be used within I18nProvider')

    consoleSpy.mockRestore()
  })
})

describe('useDictionary', () => {
  it('returns the full dictionary', () => {
    const { result } = renderHook(() => useDictionary(), {
      wrapper: TestWrapper,
    })

    expect(result.current).toBe(mockDictionary)
    expect(result.current.home.title).toBe('Test Home Title')
  })

  it('throws error when used outside of I18nProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useDictionary())
    }).toThrow('useI18n must be used within I18nProvider')

    consoleSpy.mockRestore()
  })
})

describe('useTranslations', () => {
  it('returns the full dictionary (same as useDictionary)', () => {
    const { result } = renderHook(() => useTranslations(), {
      wrapper: TestWrapper,
    })

    expect(result.current).toBe(mockDictionary)
    expect(result.current.common.appName).toBe('Test App')
  })

  it('throws error when used outside of I18nProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useTranslations())
    }).toThrow('useI18n must be used within I18nProvider')

    consoleSpy.mockRestore()
  })

  it('provides access to nested translation keys', () => {
    const { result } = renderHook(() => useTranslations(), {
      wrapper: TestWrapper,
    })

    expect(result.current.common.navigation.enhance).toBe('Enhance')
    expect(result.current.enhance.form.enhanceButton).toBe('Enhance')
    expect(result.current.saved.collections.all).toBe('All Prompts')
  })
})

describe('I18nProvider with different locales', () => {
  it('provides correct locale when set to uk', () => {
    const ukLocale: Locale = 'uk'

    function UkWrapper({ children }: { children: React.ReactNode }) {
      return (
        <I18nProvider locale={ukLocale} dictionary={mockDictionary}>
          {children}
        </I18nProvider>
      )
    }

    const { result } = renderHook(() => useLocale(), {
      wrapper: UkWrapper,
    })

    expect(result.current).toBe('uk')
  })
})
