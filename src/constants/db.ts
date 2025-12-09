/**
 * Shared IndexedDB database configuration.
 * This is the single source of truth for database-level constants.
 */

/**
 * The name of the IndexedDB database used across all stores.
 */
export const DB_NAME = 'PromptLabaDB'

/**
 * Current database version.
 * Increment this when adding new object stores or changing schema.
 *
 * Version history:
 * - v1: Initial version with prompt history store
 * - v2: Added collections and saved prompts stores
 * - v3: Force recreation of stores (fix missing stores bug)
 */
export const DB_VERSION = 3
