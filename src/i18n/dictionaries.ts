import 'server-only'
import type { Locale } from './locales'

/**
 * Dictionary type based on the English dictionary structure.
 */
export type Dictionary = {
  common: {
    appName: string
    navigation: {
      enhance: string
      saved: string
      history: string
      goToHome: string
      goToEnhance: string
      goToSaved: string
      goToHistory: string
      openMenu: string
      closeMenu: string
    }
    actions: {
      copy: string
      copied: string
      save: string
      saved: string
      delete: string
      cancel: string
      confirm: string
      move: string
      create: string
      rename: string
      tryAgain: string
      clearAll: string
    }
    loading: string
    entry: string
    entries: string
  }
  home: {
    title: string
    description: string
    cta: string
  }
  enhance: {
    description: string
    form: {
      ariaLabel: string
      targetLabel: string
      targetHelperText: string
      promptLabel: string
      placeholder: string
      helperText: string
      moreCharNeeded: string
      moreCharsNeeded: string
      overLimit: string
      enhanceButton: string
      enhancing: string
      enhancingAriaLabel: string
      enhanceDisabledAriaLabel: string
      enhanceAriaLabel: string
    }
    result: {
      ariaLabel: string
      title: string
      error: string
      viewOriginal: string
      copyToClipboard: string
      copiedToClipboard: string
      promptSaved: string
      saveToCollection: string
    }
    validation: {
      enterPrompt: string
      minLength: string
      maxLength: string
      networkError: string
      unexpectedError: string
    }
  }
  saved: {
    description: string
    empty: {
      title: string
      description: string
      cta: string
    }
    noPromptsInCollection: string
    collections: {
      all: string
      label: string
      create: string
      rename: string
      delete: string
      newCollection: string
      collectionName: string
      collectionColor: string
      namePlaceholder: string
      nameRequired: string
      nameTooLong: string
      nameExists: string
      manage: string
      manageTitle: string
      noCollectionsYet: string
      noCollectionsAvailable: string
      backToCollections: string
      current: string
    }
    prompts: {
      delete: string
      deleteConfirm: string
      move: string
      moveToAnother: string
    }
    deleteCollectionConfirm: string
  }
  history: {
    description: string
    loading: string
    error: string
    empty: {
      title: string
      description: string
      cta: string
    }
    clearAll: {
      title: string
      description: string
      confirm: string
    }
  }
  promptCard: {
    target: string
    original: string
    enhanced: string
    expandCollapse: string
    deleteEntry: string
    copy: string
    copied: string
    move: string
    delete: string
    copyToClipboard: string
    copiedToClipboard: string
    moveToAnother: string
  }
  toast: {
    success: {
      promptDeleted: string
      collectionDeleted: string
      collectionRenamed: string
      collectionCreated: string
      promptMoved: string
      promptSaved: string
      savedTo: string
    }
    error: {
      loadFailed: string
      deleteFailed: string
      deleteCollectionFailed: string
      renameFailed: string
      createFailed: string
      moveFailed: string
      loadCollectionsFailed: string
      selectCollection: string
      saveFailed: string
    }
  }
  saveDialog: {
    title: string
    newCollectionTitle: string
    closeDialog: string
    quickSaveTo: string
    orChooseCollection: string
    noCollectionsYet: string
    prompt: string
    prompts: string
    createAndSave: string
    saveToSelected: string
  }
}

/**
 * Dictionary loaders for each supported locale.
 * Uses dynamic imports for code splitting.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import('./dictionaries/en.json').then(
      (module) => module.default as Dictionary,
    ),
  uk: () =>
    import('./dictionaries/uk.json').then(
      (module) => module.default as Dictionary,
    ),
}

/**
 * Loads the dictionary for the specified locale.
 * @param locale - The locale code to load translations for
 * @returns Promise resolving to the dictionary object
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  if (typeof dictionaries[locale] !== 'function') {
    throw new Error(
      `[getDictionary] Invalid locale: "${locale}". Available locales: ${Object.keys(dictionaries).join(', ')}`,
    )
  }
  return dictionaries[locale]()
}
