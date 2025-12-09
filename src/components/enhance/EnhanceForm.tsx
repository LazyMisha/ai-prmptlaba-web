'use client'

import { useState, useRef } from 'react'

import type {
  EnhancementTarget,
  EnhanceRequest,
  EnhanceResponse,
  EnhanceErrorResponse,
} from '@/types/enhance'
import { TOOL_CATEGORIES, TOOL_CATEGORY_NAMES } from '@/constants/tool-categories'
import { cn } from '@/lib/utils'
import { savePromptHistory } from '@/lib/db/prompt-history'

import TargetSelector from './TargetSelector'
import PromptInput from './PromptInput'
import EnhanceButton from './EnhanceButton'
import EnhancedResult from './EnhancedResult'

/**
 * Main form component that orchestrates the prompt enhancement flow.
 * Manages state, validation, API calls, and accessibility features.
 */
export default function EnhanceForm() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [target, setTarget] = useState<EnhancementTarget>(TOOL_CATEGORIES.GENERAL)
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

      // Save to history
      try {
        await savePromptHistory({
          originalPrompt: prompt.trim(),
          enhancedPrompt: successData.enhanced,
          target: TOOL_CATEGORY_NAMES[target],
        })
      } catch (historyError) {
        // Log error but don't block the user experience
        console.error('Failed to save to history:', historyError)
      }

      // Move focus to results for screen readers after successful enhancement
      setTimeout(() => {
        resultRef.current?.focus()
      }, 100)
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
   * Handle keyboard shortcuts in textarea.
   * ⌘+Enter (Mac) or Ctrl+Enter (Windows/Linux) to submit.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleEnhance()
    }
  }

  return (
    <div>
      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleEnhance()
        }}
        aria-label="Prompt enhancement form"
      >
        <TargetSelector value={target} onChange={setTarget} disabled={isLoading} className="mb-4" />

        <PromptInput
          value={prompt}
          onChange={setPrompt}
          disabled={isLoading}
          error={error && !enhanced ? error : null}
          onKeyDown={handleKeyDown}
          className="mb-4"
        />

        <EnhanceButton
          onClick={handleEnhance}
          disabled={!prompt.trim() || prompt.length < 3 || prompt.length > 2000}
          isLoading={isLoading}
        />
      </form>

      {/* Result Display */}
      <div ref={resultRef} tabIndex={-1} className={cn('focus:outline-none')}>
        <EnhancedResult
          enhanced={enhanced}
          error={error && enhanced ? error : null}
          originalPrompt={prompt}
          target={TOOL_CATEGORY_NAMES[target]}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
