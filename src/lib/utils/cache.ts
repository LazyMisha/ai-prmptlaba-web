import crypto from 'crypto'

/**
 * Cache entry with expiration time
 */
interface CacheEntry<T> {
  value: T
  expiresAt: number
}

/**
 * Simple in-memory TTL cache implementation
 *
 * This is suitable for single-instance deployments. For distributed systems,
 * replace with Redis or another distributed cache solution.
 *
 * @example
 * const cache = new TTLCache<string>(12 * 60 * 60 * 1000); // 12 hours TTL
 * cache.set('key', 'value');
 * const value = cache.get('key'); // Returns 'value' or undefined if expired
 */
export class TTLCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map()

  /**
   * @param defaultTTL - Default time-to-live in milliseconds
   */
  constructor(private readonly defaultTTL: number) {
    if (defaultTTL <= 0) {
      throw new Error('TTL must be greater than 0')
    }

    // Clean up expired entries every 10 minutes to prevent memory leaks
    // TODO: In production, use Redis with automatic expiration instead
    setInterval(() => this.cleanup(), 10 * 60 * 1000)
  }

  /**
   * Store a value in the cache with TTL
   *
   * @param key - Cache key
   * @param value - Value to store
   * @param ttl - Optional custom TTL in milliseconds (uses default if not provided)
   */
  set(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.defaultTTL)
    this.cache.set(key, { value, expiresAt })
  }

  /**
   * Retrieve a value from the cache
   *
   * @param key - Cache key
   * @returns The cached value, or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      return undefined
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * Check if a key exists and is not expired
   *
   * @param key - Cache key
   * @returns true if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Delete a specific cache entry
   *
   * @param key - Cache key
   * @returns true if an entry was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get the number of entries in the cache
   * Note: This includes expired entries that haven't been cleaned up yet
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Remove expired entries from the cache
   * This is called automatically on an interval, but can be called manually
   */
  private cleanup(): void {
    const now = Date.now()
    let removedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        removedCount++
      }
    }

    // Log cleanup for monitoring (in production, use proper logging)
    if (removedCount > 0) {
      console.log(`[TTLCache] Cleaned up ${removedCount} expired entries`)
    }
  }
}

/**
 * Generate a cache key by hashing the input values
 * This ensures consistent key generation and prevents key collision
 *
 * @param values - Values to include in the hash
 * @returns SHA256 hash of the concatenated values
 */
export function generateCacheKey(...values: string[]): string {
  const combined = values.join('|')
  return crypto.createHash('sha256').update(combined).digest('hex')
}

/**
 * Global cache instance for prompt enhancement results
 * TTL: 12 hours (43,200,000 milliseconds)
 *
 * TODO: Replace with Redis for production scaling and persistence
 */
export const promptEnhancementCache = new TTLCache<string>(12 * 60 * 60 * 1000)
