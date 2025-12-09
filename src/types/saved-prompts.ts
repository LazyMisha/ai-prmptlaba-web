/**
 * Represents a collection/group for organizing saved prompts.
 */
export interface Collection {
  /** Unique identifier for the collection */
  id: string
  /** Display name of the collection */
  name: string
  /** Optional description for the collection */
  description?: string
  /** Optional color code for visual distinction (hex format) */
  color?: string
  /** Whether this is a system-generated default collection (by target) */
  isDefault: boolean
  /** Order for custom sorting in the UI */
  sortOrder: number
  /** Timestamp when the collection was created */
  createdAt: number
  /** Timestamp when the collection was last modified */
  updatedAt: number
}

/**
 * Represents a saved/bookmarked enhanced prompt.
 */
export interface SavedPrompt {
  /** Unique identifier for the saved prompt */
  id: string
  /** Original prompt text before enhancement */
  originalPrompt: string
  /** Enhanced prompt text */
  enhancedPrompt: string
  /** Target tool category used for enhancement */
  target: string
  /** Reference to the collection this prompt belongs to */
  collectionId: string
  /** Optional user notes about this prompt */
  notes?: string
  /** Timestamp when the prompt was saved */
  createdAt: number
  /** Timestamp when the prompt was last modified */
  updatedAt: number
}

/**
 * Request payload for creating a new collection.
 */
export interface CreateCollectionRequest {
  name: string
  description?: string
  color?: string
  isDefault?: boolean
}

/**
 * Request payload for updating a collection.
 */
export interface UpdateCollectionRequest {
  name?: string
  description?: string
  color?: string
  sortOrder?: number
}

/**
 * Request payload for saving a prompt to a collection.
 */
export interface SavePromptRequest {
  originalPrompt: string
  enhancedPrompt: string
  target: string
  collectionId: string
  notes?: string
}

/**
 * Request payload for updating a saved prompt.
 */
export interface UpdateSavedPromptRequest {
  collectionId?: string
  notes?: string
}

/**
 * Collection with its associated saved prompts count.
 */
export interface CollectionWithCount extends Collection {
  promptCount: number
}
