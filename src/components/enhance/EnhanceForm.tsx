'use client'

import { useState } from 'react'
import TargetSelector from './TargetSelector'
import PromptInput from './PromptInput'
import EnhanceButton from './EnhanceButton'
import EnhancedResult from './EnhancedResult'
import type {
  EnhancementTarget,
  EnhanceRequest,
  EnhanceResponse,
  EnhanceErrorResponse,
} from '@/types/enhance'
import { cn } from '@/lib/utils'

/**
 * Main form component that orchestrates the prompt enhancement flow
 */
export default function EnhanceForm() {
  const [target, setTarget] = useState<EnhancementTarget>('General')
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [enhanced, setEnhanced] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Validate the form inputs before submission
   */
  const validateForm = (): string | null => {
    if (!prompt.trim()) {
      return 'Please enter a prompt'
    }

    if (prompt.trim().length < 3) {
      return 'Prompt must be at least 3 characters long'
    }

    if (prompt.length > 2000) {
      return 'Prompt must not exceed 2000 characters'
    }

    return null
  }

  /**
   * Handle the enhance button click
   */
  const handleEnhance = async () => {
    // Reset previous results
    setError(null)
    setEnhanced(null)

    // Validate inputs
    const validationError = validateForm()

    if (validationError) {
      setError(validationError)

      return
    }

    setIsLoading(true)

    try {
      const requestBody: EnhanceRequest = {
        target,
        prompt: prompt.trim(),
      }

      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = (await response.json()) as EnhanceResponse | EnhanceErrorResponse

      if (!response.ok) {
        const errorData = data as EnhanceErrorResponse

        setError(errorData.error || `Request failed with status ${response.status}`)

        return
      }

      const successData = data as EnhanceResponse

      setEnhanced(successData.enhanced)
    } catch (err) {
      setError(
        err instanceof Error
          ? `Network error: ${err.message}`
          : 'An unexpected error occurred. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle Enter key in textarea (Shift+Enter for new line, Enter to submit)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnhance()
    }
  }

  return (
    <div>
      {/* Input Form */}
      <div>
        <TargetSelector value={target} onChange={setTarget} disabled={isLoading} />

        <PromptInput
          value={prompt}
          onChange={setPrompt}
          disabled={isLoading}
          error={error && !enhanced ? error : null}
          onKeyDown={handleKeyDown}
        />

        <div>
          <p
            className={cn(
              // margin top
              'mt-1',
              // text small
              'text-sm',
              // text gray
              'text-gray-600',
            )}
          >
            Press{' '}
            <kbd
              className={cn(
                // padding x
                'px-1',
                // padding y
                'py-0.5',
                // border
                'border',
                // border radius
                'rounded',
                // background color
                'bg-gray-200',
                // font weight
                'font-medium',
              )}
            >
              Enter
            </kbd>{' '}
            to enhance
          </p>
          <EnhanceButton
            onClick={handleEnhance}
            disabled={!prompt.trim() || prompt.length < 3 || prompt.length > 2000}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Result Display */}
      <EnhancedResult
        enhanced={enhanced}
        error={error && enhanced ? error : null}
        originalPrompt={prompt}
      />
    </div>
  )
}
