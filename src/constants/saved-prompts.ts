/**
 * IndexedDB database configuration for saved prompts and collections.
 */
export const SAVED_PROMPTS_DB = {
  /** Object store for saved prompts */
  SAVED_PROMPTS_STORE: 'savedPrompts',
  /** Object store for collections */
  COLLECTIONS_STORE: 'collections',
} as const

/**
 * Default collection colors for visual distinction.
 * Apple-inspired color palette.
 */
export const COLLECTION_COLORS = [
  '#007AFF', // Blue (default)
  '#34C759', // Green
  '#FF9500', // Orange
  '#FF3B30', // Red
  '#AF52DE', // Purple
  '#5856D6', // Indigo
  '#FF2D55', // Pink
  '#00C7BE', // Teal
  '#FFD60A', // Yellow
  '#8E8E93', // Gray
] as const

export type CollectionColor = (typeof COLLECTION_COLORS)[number]

/**
 * Default color for new collections.
 */
export const DEFAULT_COLLECTION_COLOR = COLLECTION_COLORS[0]

/**
 * Prefix for auto-generated default collection IDs.
 */
export const DEFAULT_COLLECTION_ID_PREFIX = 'default-'
