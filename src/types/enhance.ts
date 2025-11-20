/**
 * Available target platforms for prompt enhancement
 */
export const ENHANCEMENT_TARGETS = [
  'LinkedIn',
  'Facebook',
  'Development',
  'Copilot',
  'General',
] as const

export type EnhancementTarget = (typeof ENHANCEMENT_TARGETS)[number]

/**
 * Request payload for the enhance API
 */
export interface EnhanceRequest {
  target: string
  prompt: string
}

/**
 * Response from the enhance API (success)
 */
export interface EnhanceResponse {
  enhanced: string
}

/**
 * Response from the enhance API (error)
 */
export interface EnhanceErrorResponse {
  error: string
  retryable?: boolean
}

/**
 * State for the enhancement form
 */
export interface EnhanceFormState {
  target: EnhancementTarget
  prompt: string
  isLoading: boolean
  enhanced: string | null
  error: string | null
}
