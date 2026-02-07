/** Token counting with gpt-tokenizer (dynamic import for bundle optimization). */

export type TokenEfficiency = 'low' | 'medium' | 'high'
export type ThresholdCategory = 'text' | 'image' | 'video'

/** Per-category token thresholds: green < LOW, yellow LOW–HIGH, red > HIGH */
export const CATEGORY_THRESHOLDS: Record<
  ThresholdCategory,
  { LOW: number; HIGH: number }
> = {
  text: { LOW: 1000, HIGH: 4000 },
  image: { LOW: 250, HIGH: 600 },
  video: { LOW: 150, HIGH: 400 },
} as const

/** Maps a target string (ToolCategory ID or display name) to a ThresholdCategory. */
export function getThresholdCategory(target?: string): ThresholdCategory {
  if (!target) return 'text'

  const normalized = target.toLowerCase()

  if (normalized.includes('image')) return 'image'
  if (normalized.includes('video')) return 'video'

  return 'text'
}

/** Count tokens using gpt-tokenizer with dynamic import. */
export async function countTokens(text: string): Promise<number> {
  if (!text || text.trim().length === 0) {
    return 0
  }

  try {
    const { countTokens } = await import('gpt-tokenizer')

    return countTokens(text)
  } catch (error) {
    console.error('Failed to count tokens:', error)

    return Math.ceil(text.length / 4)
  }
}

/** Determine token efficiency based on count and category. */
export function getTokenEfficiency(
  tokenCount: number,
  category: ThresholdCategory = 'text',
): TokenEfficiency {
  const thresholds = CATEGORY_THRESHOLDS[category]

  if (tokenCount <= thresholds.LOW) {
    return 'low'
  }
  if (tokenCount <= thresholds.HIGH) {
    return 'medium'
  }
  return 'high'
}
