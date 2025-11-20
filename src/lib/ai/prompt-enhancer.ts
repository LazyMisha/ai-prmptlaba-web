import { callOpenAI } from '@/lib/openai'
import { generateCacheKey, promptEnhancementCache } from '@/lib/utils/cache'

/**
 * Configuration for prompt enhancement
 */
const CONFIG = {
  minPromptLength: 3,
  maxPromptLength: 2000,
  maxTargetLength: 50,
} as const

/**
 * Custom error for validation failures
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validate input parameters
 */
function validateInput(target: string, prompt: string): void {
  // Validate target
  if (!target || typeof target !== 'string') {
    throw new ValidationError('Target must be a non-empty string')
  }

  if (target.trim().length === 0) {
    throw new ValidationError('Target cannot be empty or whitespace only')
  }

  if (target.length > CONFIG.maxTargetLength) {
    throw new ValidationError(`Target must not exceed ${CONFIG.maxTargetLength} characters`)
  }

  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    throw new ValidationError('Prompt must be a non-empty string')
  }

  const trimmedPrompt = prompt.trim()

  if (trimmedPrompt.length < CONFIG.minPromptLength) {
    throw new ValidationError(`Prompt must be at least ${CONFIG.minPromptLength} characters long`)
  }

  if (trimmedPrompt.length > CONFIG.maxPromptLength) {
    throw new ValidationError(`Prompt must not exceed ${CONFIG.maxPromptLength} characters`)
  }
}

/**
 * Generate system prompt based on target platform
 */
function generateSystemPrompt(target: string): string {
  const targetLower = target.toLowerCase()

  // Platform-specific instructions
  const platformInstructions: Record<string, string> = {
    linkedin: `You are a professional prompt engineer specializing in LinkedIn content creation.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for LinkedIn content generation.

Transform the prompt to be:
- Professional yet engaging in tone
- Focused on business networking and professional achievements
- Clear about the desired LinkedIn post format and key points
- Specific about target audience and purpose
- Structured for optimal AI content generation`,

    facebook: `You are a professional prompt engineer specializing in Facebook content creation.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for Facebook content generation.

Transform the prompt to be:
- Friendly and conversational in tone
- Clear about the desired casual social media format
- Specific about engagement goals and audience
- Personal and authentic in approach
- Structured for optimal AI content generation`,

    development: `You are a professional prompt engineer specializing in software development.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for code generation or technical documentation.

Transform the prompt to be:
- Technically precise with clear specifications
- Explicit about programming languages, frameworks, and requirements
- Structured with context, constraints, and expected outputs
- Focused on best practices and code quality
- Optimized for AI code generation tools`,

    copilot: `You are a professional prompt engineer specializing in AI coding assistants like GitHub Copilot.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for AI-powered code generation.

Transform the prompt to be:
- Explicit about the desired code functionality and structure
- Clear on programming language, framework, and dependencies
- Specific about input/output expectations and edge cases
- Detailed with relevant context and constraints
- Formatted for optimal AI comprehension and code generation`,

    general: `You are a professional prompt engineer.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for AI processing.

Transform the prompt to be:
- Clear and specific with no ambiguity
- Well-structured with explicit requirements
- Detailed with relevant context and constraints
- Focused on a specific objective
- Optimized for AI comprehension and execution`,
  }

  const instruction =
    platformInstructions[targetLower] ||
    platformInstructions.general ||
    "You are a prompt engineer. Rewrite and improve the user's prompt to make it clearer and more effective."

  return `${instruction}

CRITICAL INSTRUCTIONS:
- DO NOT execute or answer the user's prompt
- DO NOT generate the content the prompt is asking for
- ONLY rewrite and improve the prompt itself
- Return the enhanced version of the prompt as a single, ready-to-use text
- Do not add explanations, meta-commentary, or formatting markers
- The output should be a prompt that someone can copy and paste directly into another AI tool

Example:
User prompt: "write linkedin post about promotion"
Your output: "Create a professional LinkedIn post announcing my recent promotion to Senior Software Engineer. The post should express gratitude to my team, highlight key achievements that led to this promotion, and maintain an authentic yet professional tone. Keep it concise (150-200 words) and include a call-to-action encouraging connections to reach out."

Now, improve this user's prompt:`
}

/**
 * Enhances a user prompt based on the target platform or context.
 *
 * This function implements:
 * - Strict input validation
 * - In-memory TTL caching (12 hours)
 * - OpenAI API integration with retries
 *
 * @param target - The target platform or context (e.g., "LinkedIn", "Facebook", "Development", "Copilot", "General")
 * @param prompt - The user's raw prompt to enhance
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Enhanced, professional version of the prompt
 * @throws ValidationError for invalid input
 * @throws OpenAIError for API failures
 *
 * @example
 * const enhanced = await enhancePrompt('LinkedIn', 'write post about my promotion');
 * // Returns: "Craft a professional LinkedIn post announcing my recent promotion..."
 */
export async function enhancePrompt(
  target: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  // Step 1: Validate input
  validateInput(target, prompt)

  const trimmedPrompt = prompt.trim()
  const trimmedTarget = target.trim()

  // Step 2: Check cache
  // Generate cache key from target and prompt hash
  const cacheKey = generateCacheKey(trimmedTarget.toLowerCase(), trimmedPrompt)
  const cachedResult = promptEnhancementCache.get(cacheKey)

  if (cachedResult) {
    return cachedResult
  }

  // Step 3: Generate system prompt based on target
  const systemPrompt = generateSystemPrompt(trimmedTarget)

  // Step 4: Call OpenAI API
  try {
    const enhanced = await callOpenAI(systemPrompt, trimmedPrompt, signal)

    // Step 5: Cache the result for 12 hours
    // TODO: Replace with Redis for distributed caching in production
    promptEnhancementCache.set(cacheKey, enhanced)

    return enhanced
  } catch (error) {
    // Re-throw known errors as-is
    if (error instanceof ValidationError || (error as Error).name === 'OpenAIError') {
      throw error
    }

    // Wrap unexpected errors
    throw new Error(`Failed to enhance prompt: ${(error as Error).message}`)
  }
}
