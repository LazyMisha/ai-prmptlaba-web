/**
 * Represents a single prompt history entry stored in IndexedDB.
 */
export interface PromptHistoryEntry {
  /** Unique identifier for the history entry */
  id: string
  /** Enhanced prompt text */
  enhancedPrompt: string
  /** Target tool category selected */
  target: string
  /** Timestamp when the prompt was enhanced */
  timestamp: number
}

/**
 * Request payload for saving a prompt to history.
 */
export interface SavePromptHistoryRequest {
  enhancedPrompt: string
  target: string
}

/**
 * Response when fetching all history entries.
 */
export interface PromptHistoryResponse {
  entries: PromptHistoryEntry[]
  total: number
}
