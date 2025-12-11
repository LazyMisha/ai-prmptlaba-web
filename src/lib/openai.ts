import OpenAI from 'openai'

/**
 * Configuration for OpenAI API calls
 */
const OPENAI_CONFIG = {
  model: 'gpt-4o-mini', // Cost-effective model optimized for text processing
  maxTokens: 500, // Limit response length for prompt enhancement
  temperature: 0.7, // Balance between creativity and consistency
  retryAttempts: 2, // Number of retry attempts for transient errors
  initialRetryDelay: 300, // Initial retry delay in milliseconds
} as const

/**
 * Custom error class for OpenAI API errors
 */
export class OpenAIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly isRetryable: boolean = false,
  ) {
    super(message)
    this.name = 'OpenAIError'
  }
}

/**
 * Initialize OpenAI client with API key validation
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new OpenAIError(
      'OPENAI_API_KEY environment variable is not set. Please configure it in your .env.local file.',
      500,
      false,
    )
  }

  return new OpenAI({ apiKey })
}

/**
 * Sleep utility for exponential backoff
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof OpenAI.APIError) {
    // Retry on 5xx server errors and rate limits
    return (
      error.status !== undefined &&
      (error.status >= 500 || error.status === 429)
    )
  }

  // Retry on network errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('enotfound')
    )
  }

  return false
}

/**
 * Call OpenAI Chat Completion API with robust error handling and automatic retries
 *
 * @param systemPrompt - The system message that defines the AI's behavior
 * @param userPrompt - The user's input message
 * @param signal - Optional AbortSignal for request cancellation
 * @returns The AI's response text
 * @throws OpenAIError with details about the failure
 */
export async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const client = getOpenAIClient()

  let lastError: Error | undefined

  // Implement retry logic with exponential backoff
  for (let attempt = 0; attempt <= OPENAI_CONFIG.retryAttempts; attempt++) {
    try {
      // Check if request was aborted before making the call
      if (signal?.aborted) {
        throw new OpenAIError('Request was aborted', 499, false)
      }

      const completion = await client.chat.completions.create(
        {
          model: OPENAI_CONFIG.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: OPENAI_CONFIG.temperature,
        },
        { signal }, // Pass abort signal to OpenAI SDK
      )

      const content = completion.choices[0]?.message?.content

      if (!content) {
        throw new OpenAIError(
          'OpenAI returned an empty response. Please try again.',
          500,
          true,
        )
      }

      return content.trim()
    } catch (error) {
      lastError = error as Error

      // Handle abort signal
      if (signal?.aborted) {
        throw new OpenAIError('Request was aborted', 499, false)
      }

      // Handle OpenAI API errors
      if (error instanceof OpenAI.APIError) {
        const isRetryable = isRetryableError(error)

        // If this is the last attempt or error is not retryable, throw immediately
        if (attempt === OPENAI_CONFIG.retryAttempts || !isRetryable) {
          throw new OpenAIError(
            `OpenAI API error: ${error.message}`,
            error.status,
            isRetryable,
          )
        }

        // Calculate exponential backoff delay: 300ms, 900ms
        const delay = OPENAI_CONFIG.initialRetryDelay * Math.pow(3, attempt)
        await sleep(delay)
        continue
      }

      // Handle other errors (network, etc.)
      if (isRetryableError(error)) {
        // If this is the last attempt, throw
        if (attempt === OPENAI_CONFIG.retryAttempts) {
          throw new OpenAIError(
            `Network error after ${OPENAI_CONFIG.retryAttempts + 1} attempts: ${lastError.message}`,
            503,
            true,
          )
        }

        // Exponential backoff
        const delay = OPENAI_CONFIG.initialRetryDelay * Math.pow(3, attempt)
        await sleep(delay)
        continue
      }

      // Non-retryable error
      throw new OpenAIError(
        `Unexpected error calling OpenAI: ${lastError.message}`,
        500,
        false,
      )
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new OpenAIError(
    `Failed after ${OPENAI_CONFIG.retryAttempts + 1} attempts: ${lastError?.message}`,
    503,
    true,
  )
}
