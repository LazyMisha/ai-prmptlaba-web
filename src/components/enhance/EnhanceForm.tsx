'use client'

import { useState, useRef } from 'react'
import { useTranslations } from '@/i18n/client'
import type {
  EnhancementTarget,
  EnhanceRequest,
  EnhanceResponse,
  EnhanceErrorResponse,
} from '@/types/enhance'
import {
  TOOL_CATEGORIES,
  TOOL_CATEGORY_NAMES,
} from '@/constants/tool-categories'
import { cn } from '@/lib/utils'
import { savePromptHistory } from '@/lib/db/prompt-history'

import ContextSelectorDropdown from './ContextSelectorDropdown'
import PromptInput from './PromptInput'
import { Button } from '@/components/common/Button'
import PromptCard from '@/components/common/PromptCard/PromptCard'
import PromptCardHeader from '@/components/common/PromptCard/PromptCardHeader'
import EnhanceResultInfo from './EnhanceResultInfo'
import EnhanceResultActions from './EnhanceResultActions'

/**
 * Main form component that orchestrates the prompt enhancement flow.
 * Manages state, validation, API calls, and accessibility features.
 */
export default function EnhanceForm() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [target, setTarget] = useState<EnhancementTarget>(
    TOOL_CATEGORIES.GENERAL,
  )
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [enhanced, setEnhanced] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dict = useTranslations()
  const t = dict.enhance

  /**
   * Validate the form inputs before submission
   */
  const validateForm = (): string | null => {
    if (!prompt.trim()) {
      return t.validation.enterPrompt
    }

    if (prompt.trim().length < 3) {
      return t.validation.minLength
    }

    if (prompt.length > 2000) {
      return t.validation.maxLength
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

      const data = (await response.json()) as
        | EnhanceResponse
        | EnhanceErrorResponse

      if (!response.ok) {
        const errorData = data as EnhanceErrorResponse

        setError(
          errorData.error || `Request failed with status ${response.status}`,
        )

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
          ? `${t.validation.networkError}: ${err.message}`
          : t.validation.unexpectedError,
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
        aria-label={t.form.ariaLabel}
      >
        <ContextSelectorDropdown
          value={target}
          onChange={setTarget}
          disabled={isLoading}
          label={t.form.targetLabel}
          helperText={t.form.targetHelperText}
          className="mb-4"
        />

        <PromptInput
          value={prompt}
          onChange={setPrompt}
          disabled={isLoading}
          error={error && !enhanced ? error : null}
          onKeyDown={handleKeyDown}
          className="mb-4"
        />

        <Button
          onClick={handleEnhance}
          disabled={!prompt.trim() || prompt.length < 3 || prompt.length > 2000}
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? t.form.enhancing : t.form.enhanceButton}
        </Button>
      </form>

      {/* Result Display */}
      {enhanced && (
        <div
          ref={resultRef}
          tabIndex={-1}
          className={cn('focus:outline-none', 'mt-6')}
        >
          <PromptCard originalPrompt={prompt} enhancedPrompt={enhanced}>
            <PromptCardHeader
              LeftSideComponent={<EnhanceResultInfo />}
              RightSideComponent={
                <EnhanceResultActions
                  enhancedPrompt={enhanced}
                  originalPrompt={prompt}
                  target={TOOL_CATEGORY_NAMES[target]}
                />
              }
            />
          </PromptCard>
        </div>
      )}
    </div>
  )
}
