import { NextRequest } from 'next/server'
import { enhancePrompt, ValidationError } from '@/lib/ai/prompt-enhancer'
import { OpenAIError } from '@/lib/openai'

interface EnhanceRequestBody {
  target: string
  prompt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhanceRequestBody = await request.json()

    // Validate required fields exist (additional validation happens in enhancePrompt)
    if (!body.target || typeof body.target !== 'string') {
      return Response.json(
        { error: 'Missing or invalid "target" field' },
        { status: 400 },
      )
    }

    if (!body.prompt || typeof body.prompt !== 'string') {
      return Response.json(
        { error: 'Missing or invalid "prompt" field' },
        { status: 400 },
      )
    }

    // Create AbortController for timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      // Enhance the prompt with OpenAI
      const enhanced = await enhancePrompt(
        body.target,
        body.prompt,
        controller.signal,
      )

      // Clear timeout
      clearTimeout(timeoutId)

      // Return the enhanced prompt
      return Response.json({ enhanced }, { status: 200 })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      )
    }

    // Handle validation errors
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    // Handle OpenAI API errors
    if (error instanceof OpenAIError) {
      const statusCode = error.statusCode || 500

      return Response.json(
        {
          error: error.message,
          retryable: error.isRetryable,
        },
        { status: statusCode },
      )
    }

    // Handle abort/timeout errors
    if ((error as Error).name === 'AbortError') {
      return Response.json(
        { error: 'Request timeout - please try again' },
        { status: 408 },
      )
    }

    // Log unexpected errors for monitoring (in production, use proper logging service)
    console.error('[API /enhance] Unexpected error:', error)

    // Handle unexpected errors
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
