import { DB_NAME, DB_VERSION } from '@/constants/db'
import {
  SAVED_PROMPTS_DB,
  DEFAULT_COLLECTION_COLOR,
} from '@/constants/saved-prompts'
import { PROMPT_HISTORY_DB } from '@/constants/history'
import type {
  Collection,
  SavedPrompt,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  SavePromptRequest,
  UpdateSavedPromptRequest,
  CollectionWithCount,
} from '@/types/saved-prompts'

/**
 * Generates a unique ID for database entries.
 * @returns A unique string ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Opens or creates the IndexedDB database with all required stores.
 * Handles database upgrades when version changes.
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

      // Existing prompt history store (from v1)
      if (!db.objectStoreNames.contains(PROMPT_HISTORY_DB.STORE_NAME)) {
        const historyStore = db.createObjectStore(
          PROMPT_HISTORY_DB.STORE_NAME,
          {
            keyPath: 'id',
          },
        )
        historyStore.createIndex('timestamp', 'timestamp', { unique: false })
      }

      // New stores for v2/v3
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

// ============================================================================
// COLLECTION OPERATIONS
// ============================================================================

/**
 * Creates a new collection in the database.
 *
 * @param data - The collection data to create
 * @returns Promise that resolves to the created collection
 */
export async function createCollection(
  data: CreateCollectionRequest,
): Promise<Collection> {
  const db = await openDatabase()

  // Get the next sort order
  const existingCollections = await getAllCollections()
  const maxSortOrder = existingCollections.reduce(
    (max, c) => Math.max(max, c.sortOrder),
    -1,
  )

  const now = Date.now()
  const collection: Collection = {
    id: generateId(),
    name: data.name,
    description: data.description,
    color: data.color ?? DEFAULT_COLLECTION_COLOR,
    isDefault: data.isDefault ?? false,
    sortOrder: maxSortOrder + 1,
    createdAt: now,
    updatedAt: now,
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.COLLECTIONS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.COLLECTIONS_STORE)

    const request = store.add(collection)

    request.onsuccess = () => {
      resolve(collection)
    }

    request.onerror = () => {
      reject(new Error('Failed to create collection'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while creating collection'))
    }
  })
}

/**
 * Retrieves all collections, sorted by sortOrder.
 *
 * @returns Promise that resolves to array of collections
 */
export async function getAllCollections(): Promise<Collection[]> {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [SAVED_PROMPTS_DB.COLLECTIONS_STORE],
        'readonly',
      )
      const store = transaction.objectStore(SAVED_PROMPTS_DB.COLLECTIONS_STORE)
      const index = store.index('sortOrder')

      const request = index.openCursor(null, 'next')
      const collections: Collection[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          collections.push(cursor.value)
          cursor.continue()
        } else {
          resolve(collections)
        }
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve collections'))
      }

      transaction.onerror = () => {
        reject(new Error('Transaction failed while retrieving collections'))
      }
    })
  } catch (error) {
    console.error('Error accessing collections:', error)
    return []
  }
}

/**
 * Retrieves all collections with their prompt counts.
 *
 * @returns Promise that resolves to array of collections with counts
 */
export async function getAllCollectionsWithCounts(): Promise<
  CollectionWithCount[]
> {
  const collections = await getAllCollections()
  const savedPrompts = await getAllSavedPrompts()

  // Count prompts per collection
  const countMap = new Map<string, number>()
  savedPrompts.forEach((prompt) => {
    const count = countMap.get(prompt.collectionId) ?? 0
    countMap.set(prompt.collectionId, count + 1)
  })

  return collections.map((collection) => ({
    ...collection,
    promptCount: countMap.get(collection.id) ?? 0,
  }))
}

/**
 * Retrieves a collection by its ID.
 *
 * @param id - The collection ID
 * @returns Promise that resolves to the collection or null if not found
 */
export async function getCollectionById(
  id: string,
): Promise<Collection | null> {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [SAVED_PROMPTS_DB.COLLECTIONS_STORE],
        'readonly',
      )
      const store = transaction.objectStore(SAVED_PROMPTS_DB.COLLECTIONS_STORE)

      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result ?? null)
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve collection'))
      }

      transaction.onerror = () => {
        reject(new Error('Transaction failed while retrieving collection'))
      }
    })
  } catch (error) {
    console.error('Error retrieving collection:', error)
    return null
  }
}

/**
 * Updates a collection's properties.
 *
 * @param id - The collection ID to update
 * @param data - The properties to update
 * @returns Promise that resolves to the updated collection
 */
export async function updateCollection(
  id: string,
  data: UpdateCollectionRequest,
): Promise<Collection> {
  const db = await openDatabase()
  const existing = await getCollectionById(id)

  if (!existing) {
    throw new Error('Collection not found')
  }

  const updated: Collection = {
    ...existing,
    ...data,
    updatedAt: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.COLLECTIONS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.COLLECTIONS_STORE)

    const request = store.put(updated)

    request.onsuccess = () => {
      resolve(updated)
    }

    request.onerror = () => {
      reject(new Error('Failed to update collection'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while updating collection'))
    }
  })
}

/**
 * Gets or creates a default collection for a target.
 * Default collections are named after the target and flagged as isDefault.
 *
 * @param target - The target name to get or create a collection for
 * @returns Promise that resolves to the collection
 */
export async function getOrCreateDefaultCollection(
  target: string,
): Promise<Collection> {
  // Check if a default collection for this target already exists
  const collections = await getAllCollections()
  const existing = collections.find((c) => c.isDefault && c.name === target)

  if (existing) {
    return existing
  }

  // Create a new default collection for this target
  return createCollection({
    name: target,
    isDefault: true,
  })
}

/**
 * Deletes a collection and all its associated saved prompts.
 *
 * @param id - The collection ID to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteCollection(id: string): Promise<void> {
  const db = await openDatabase()

  // First, delete all prompts in this collection
  const prompts = await getSavedPromptsByCollection(id)
  if (prompts.length > 0) {
    await bulkDeleteSavedPrompts(prompts.map((p) => p.id))
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.COLLECTIONS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.COLLECTIONS_STORE)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error('Failed to delete collection'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while deleting collection'))
    }
  })
}

// ============================================================================
// SAVED PROMPT OPERATIONS
// ============================================================================

/**
 * Saves a prompt to a collection.
 *
 * @param data - The prompt data to save
 * @returns Promise that resolves to the saved prompt
 */
export async function savePrompt(
  data: SavePromptRequest,
): Promise<SavedPrompt> {
  const db = await openDatabase()

  const now = Date.now()
  const savedPrompt: SavedPrompt = {
    id: generateId(),
    originalPrompt: data.originalPrompt,
    enhancedPrompt: data.enhancedPrompt,
    target: data.target,
    collectionId: data.collectionId,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE)

    const request = store.add(savedPrompt)

    request.onsuccess = () => {
      resolve(savedPrompt)
    }

    request.onerror = () => {
      reject(new Error('Failed to save prompt'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while saving prompt'))
    }
  })
}

/**
 * Retrieves all saved prompts, sorted by creation date (newest first).
 *
 * @returns Promise that resolves to array of saved prompts
 */
export async function getAllSavedPrompts(): Promise<SavedPrompt[]> {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
        'readonly',
      )
      const store = transaction.objectStore(
        SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE,
      )
      const index = store.index('createdAt')

      const request = index.openCursor(null, 'prev')
      const prompts: SavedPrompt[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          prompts.push(cursor.value)
          cursor.continue()
        } else {
          resolve(prompts)
        }
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve saved prompts'))
      }

      transaction.onerror = () => {
        reject(new Error('Transaction failed while retrieving saved prompts'))
      }
    })
  } catch (error) {
    console.error('Error accessing saved prompts:', error)
    return []
  }
}

/**
 * Retrieves saved prompts for a specific collection.
 *
 * @param collectionId - The collection ID to filter by
 * @returns Promise that resolves to array of saved prompts
 */
export async function getSavedPromptsByCollection(
  collectionId: string,
): Promise<SavedPrompt[]> {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
        'readonly',
      )
      const store = transaction.objectStore(
        SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE,
      )
      const index = store.index('collectionId')

      const request = index.openCursor(IDBKeyRange.only(collectionId))
      const prompts: SavedPrompt[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          prompts.push(cursor.value)
          cursor.continue()
        } else {
          // Sort by createdAt descending
          prompts.sort((a, b) => b.createdAt - a.createdAt)
          resolve(prompts)
        }
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve saved prompts by collection'))
      }

      transaction.onerror = () => {
        reject(new Error('Transaction failed while retrieving saved prompts'))
      }
    })
  } catch (error) {
    console.error('Error accessing saved prompts by collection:', error)
    return []
  }
}

/**
 * Retrieves a saved prompt by its ID.
 *
 * @param id - The saved prompt ID
 * @returns Promise that resolves to the saved prompt or null if not found
 */
export async function getSavedPromptById(
  id: string,
): Promise<SavedPrompt | null> {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
        'readonly',
      )
      const store = transaction.objectStore(
        SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE,
      )

      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result ?? null)
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve saved prompt'))
      }

      transaction.onerror = () => {
        reject(new Error('Transaction failed while retrieving saved prompt'))
      }
    })
  } catch (error) {
    console.error('Error retrieving saved prompt:', error)
    return null
  }
}

/**
 * Updates a saved prompt's properties.
 *
 * @param id - The saved prompt ID to update
 * @param data - The properties to update
 * @returns Promise that resolves to the updated saved prompt
 */
export async function updateSavedPrompt(
  id: string,
  data: UpdateSavedPromptRequest,
): Promise<SavedPrompt> {
  const db = await openDatabase()
  const existing = await getSavedPromptById(id)

  if (!existing) {
    throw new Error('Saved prompt not found')
  }

  const updated: SavedPrompt = {
    ...existing,
    ...data,
    updatedAt: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE)

    const request = store.put(updated)

    request.onsuccess = () => {
      resolve(updated)
    }

    request.onerror = () => {
      reject(new Error('Failed to update saved prompt'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while updating saved prompt'))
    }
  })
}

/**
 * Deletes a saved prompt by ID.
 *
 * @param id - The saved prompt ID to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteSavedPrompt(id: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error('Failed to delete saved prompt'))
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while deleting saved prompt'))
    }
  })
}

/**
 * Moves a saved prompt to a different collection.
 *
 * @param id - The saved prompt ID to move
 * @param newCollectionId - The target collection ID
 * @returns Promise that resolves to the updated saved prompt
 */
export async function moveSavedPrompt(
  id: string,
  newCollectionId: string,
): Promise<SavedPrompt> {
  return updateSavedPrompt(id, { collectionId: newCollectionId })
}

/**
 * Deletes multiple saved prompts at once.
 *
 * @param ids - Array of saved prompt IDs to delete
 * @returns Promise that resolves when all deletions are complete
 */
export async function bulkDeleteSavedPrompts(ids: string[]): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE],
      'readwrite',
    )
    const store = transaction.objectStore(SAVED_PROMPTS_DB.SAVED_PROMPTS_STORE)

    let completed = 0
    let hasError = false

    ids.forEach((id) => {
      const request = store.delete(id)

      request.onsuccess = () => {
        completed++
        if (completed === ids.length && !hasError) {
          resolve()
        }
      }

      request.onerror = () => {
        if (!hasError) {
          hasError = true
          reject(new Error('Failed to delete some saved prompts'))
        }
      }
    })

    // Handle empty array case
    if (ids.length === 0) {
      resolve()
    }

    transaction.onerror = () => {
      reject(new Error('Transaction failed while bulk deleting prompts'))
    }
  })
}

/**
 * Moves multiple saved prompts to a different collection.
 *
 * @param ids - Array of saved prompt IDs to move
 * @param newCollectionId - The target collection ID
 * @returns Promise that resolves when all moves are complete
 */
export async function bulkMoveSavedPrompts(
  ids: string[],
  newCollectionId: string,
): Promise<void> {
  // Move each prompt sequentially to ensure data consistency
  for (const id of ids) {
    await moveSavedPrompt(id, newCollectionId)
  }
}
