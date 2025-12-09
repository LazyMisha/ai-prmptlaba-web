/**
 * IndexedDB database configuration for prompt history.
 */
export const PROMPT_HISTORY_DB = {
  /** Name of the object store for prompt history */
  STORE_NAME: 'promptHistory',
} as const

/**
 * Maximum number of history entries to keep.
 * Older entries will be automatically removed.
 */
export const MAX_HISTORY_ITEMS = 50
