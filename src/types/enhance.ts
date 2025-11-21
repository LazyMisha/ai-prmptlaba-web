import type { ToolCategory } from '@/constants/tool-categories'

/**
 * Enhancement target is now a ToolCategory
 */
export type EnhancementTarget = ToolCategory

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
