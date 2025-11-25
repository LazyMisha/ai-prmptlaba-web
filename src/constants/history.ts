/**
 * IndexedDB database configuration for prompt history.
 */
export const PROMPT_HISTORY_DB = {
  /** Name of the IndexedDB database */
  DB_NAME: 'PromptLabaDB',
  /** Name of the object store for prompt history */
  STORE_NAME: 'promptHistory',
  /** Current database version */
  VERSION: 1,
} as const

/**
 * Maximum number of history entries to keep.
 * Older entries will be automatically removed.
 */
export const MAX_HISTORY_ITEMS = 50
