'use client'

import { useEffect, useState } from 'react'
import {
  countTokens,
  getTokenEfficiency,
  type ThresholdCategory,
  type TokenEfficiency,
} from '@/lib/utils/tokenCount'

export interface UseTokenCountResult {
  tokenCount: number | null
  efficiency: TokenEfficiency | null
  isLoading: boolean
}

/** Hook to count tokens and determine efficiency level with async loading. */
export function useTokenCount(
  text: string,
  category: ThresholdCategory = 'text',
): UseTokenCountResult {
  const [tokenCount, setTokenCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchTokenCount = async () => {
      setIsLoading(true)

      try {
        const count = await countTokens(text)

        if (isMounted) {
          setTokenCount(count)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error counting tokens:', error)

        if (isMounted) {
          setTokenCount(null)
          setIsLoading(false)
        }
      }
    }

    fetchTokenCount()

    return () => {
      isMounted = false
    }
  }, [text])

  const efficiency =
    tokenCount !== null ? getTokenEfficiency(tokenCount, category) : null

  return {
    tokenCount,
    efficiency,
    isLoading,
  }
}
