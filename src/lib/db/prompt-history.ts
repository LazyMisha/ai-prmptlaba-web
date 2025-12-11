import { DB_NAME, DB_VERSION } from '@/constants/db'
import { PROMPT_HISTORY_DB, MAX_HISTORY_ITEMS } from '@/constants/history'
import { SAVED_PROMPTS_DB } from '@/constants/saved-prompts'
import type {
  PromptHistoryEntry,
  SavePromptHistoryRequest,
} from '@/types/history'

/**
 * Opens or creates the IndexedDB database for prompt history.
 * @returns Promise that resolves to the database instance
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is only available in browser environment'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB database'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const oldVersion = event.oldVersion

      // Create prompt history store if it doesn't exist (v1)
      if (!db.objectStoreNames.contains(PROMPT_HISTORY_DB.STORE_NAME)) {
        const objectStore = db.createObjectStore(PROMPT_HISTORY_DB.STORE_NAME, {
          keyPath: 'id',
        })
        // Create index for sorting by timestamp
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
      }

      // Create v2/v3 stores for collections and saved prompts
      if (oldVersion < 3) {
        // Collections store
        if (!db.objectStoreNames.contains(SAVED_PROMPTS_DB.COLLECTIONS_STORE)) {
          const collectionsStore = db.createObjectStore(
            SAVED_PROMPTS_DB.COLLECTIONS_STORE,
            {
              keyPath: 'id',
            },
          )
          collectionsStore.createIndex('sortOrder', 'sortOrder', {
            unique: false,
          })
          collectionsStore.createIndex('isDefault', 'isDefault', {
            unique: false,
          })
          collectionsStore.createIndex('createdAt', 'createdAt', {
            unique: false,
          })
        }

        // Saved prompts store
        if (
          !db.objectStoreNames.contains(SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE)
        ) {
          const savedPromptsStore = db.createObjectStore(
            SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE,
            {
              keyPath: 'id',
            },
          )
          savedPromptsStore.createIndex('collectionId', 'collectionId', {
            unique: false,
          })
          savedPromptsStore.createIndex('target', 'target', { unique: false })
          savedPromptsStore.createIndex('createdAt', 'createdAt', {
            unique: false,
          })
        }
      }
    }
  })
}

/**
 * Saves a new prompt history entry to IndexedDB.
 * Automatically manages history size by removing oldest entries if MAX_HISTORY_ITEMS is exceeded.
 *
 * @param data - The prompt data to save
 * @returns Promise that resolves to the saved entry
 */
export async function savePromptHistory(
  data: SavePromptHistoryRequest,
): Promise<PromptHistoryEntry> {
  const db = await openDatabase()

  const entry: PromptHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    originalPrompt: data.originalPrompt,
    enhancedPrompt: data.enhancedPrompt,
    target: data.target,
    timestamp: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [PROMPT_HISTORY_DB.STORE_NAME],
      'readwrite',
    )
    const store = transaction.objectStore(PROMPT_HISTORY_DB.STORE_NAME)

    const addRequest = store.add(entry)

    addRequest.onsuccess = async () => {
      // Clean up old entries if exceeding max limit
      await cleanupOldEntries(db)
      resolve(entry)
    }

    addRequest.onerror = () => {
      reject(new Error('Failed to save prompt to history'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while saving prompt'))
    }
  })
}

/**
 * Retrieves all prompt history entries, sorted by timestamp (newest first).
 *
 * @returns Promise that resolves to array of history entries
 */
export async function getAllPromptHistory(): Promise<PromptHistoryEntry[]> {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [PROMPT_HISTORY_DB.STORE_NAME],
        'readonly',
      )
      const store = transaction.objectStore(PROMPT_HISTORY_DB.STORE_NAME)
      const index = store.index('timestamp')

      // Get all entries sorted by timestamp (descending)
      const request = index.openCursor(null, 'prev')
      const entries: PromptHistoryEntry[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          entries.push(cursor.value)
          cursor.continue()
        } else {
          resolve(entries)
        }
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve prompt history'))
      }

      transaction.onerror = () => {
        reject(new Error('Transaction failed while retrieving history'))
      }
    })
  } catch (error) {
    // Return empty array if IndexedDB is not available
    console.error('Error accessing prompt history:', error)
    return []
  }
}

/**
 * Deletes a specific prompt history entry by ID.
 *
 * @param id - The ID of the entry to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deletePromptHistory(id: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [PROMPT_HISTORY_DB.STORE_NAME],
      'readwrite',
    )
    const store = transaction.objectStore(PROMPT_HISTORY_DB.STORE_NAME)

    const deleteRequest = store.delete(id)

    deleteRequest.onsuccess = () => {
      resolve()
    }

    deleteRequest.onerror = () => {
      reject(new Error('Failed to delete prompt from history'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while deleting prompt'))
    }
  })
}

/**
 * Clears all prompt history entries from IndexedDB.
 *
 * @returns Promise that resolves when all entries are cleared
 */
export async function clearAllPromptHistory(): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [PROMPT_HISTORY_DB.STORE_NAME],
      'readwrite',
    )
    const store = transaction.objectStore(PROMPT_HISTORY_DB.STORE_NAME)

    const clearRequest = store.clear()

    clearRequest.onsuccess = () => {
      resolve()
    }

    clearRequest.onerror = () => {
      reject(new Error('Failed to clear prompt history'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while clearing history'))
    }
  })
}

/**
 * Internal helper to remove oldest entries if history exceeds MAX_HISTORY_ITEMS.
 *
 * @param db - The database instance
 */
async function cleanupOldEntries(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [PROMPT_HISTORY_DB.STORE_NAME],
      'readwrite',
    )
    const store = transaction.objectStore(PROMPT_HISTORY_DB.STORE_NAME)
    const index = store.index('timestamp')

    // Get all entries sorted by timestamp (oldest first)
    const request = index.openCursor(null, 'next')
    const entries: string[] = []

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        entries.push(cursor.value.id)
        cursor.continue()
      } else {
        // If we have more than MAX_HISTORY_ITEMS, delete the oldest ones
        if (entries.length > MAX_HISTORY_ITEMS) {
          const entriesToDelete = entries.slice(
            0,
            entries.length - MAX_HISTORY_ITEMS,
          )
          entriesToDelete.forEach((id) => {
            store.delete(id)
          })
        }
        resolve()
      }
    }

    request.onerror = () => {
      reject(new Error('Failed to cleanup old entries'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed during cleanup'))
    }
  })
}
