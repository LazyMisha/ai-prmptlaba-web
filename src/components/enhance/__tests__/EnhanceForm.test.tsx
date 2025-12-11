import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EnhanceForm from '../EnhanceForm'

// Mock fetch
global.fetch = jest.fn()

// Mock savePromptHistory
jest.mock('@/lib/db/prompt-history', () => ({
  savePromptHistory: jest.fn().mockResolvedValue(undefined),
}))

const mockTranslations = {
  form: {
    ariaLabel: 'Enhance form',
    targetLabel: 'Target',
    promptLabel: 'Prompt',
    placeholder: 'Enter prompt',
    helperText: 'Press Cmd+Enter',
    moreCharNeeded: 'more char needed',
    moreCharsNeeded: 'more chars needed',
    overLimit: 'over limit',
    enhanceButton: 'Enhance',
    enhancing: 'Enhancing...',
    enhancingAriaLabel: 'Enhancing',
    enhanceDisabledAriaLabel: 'Disabled',
    enhanceAriaLabel: 'Enhance prompt',
  },
  result: {
    ariaLabel: 'Result',
    title: 'Enhanced',
    error: 'Error',
    viewOriginal: 'View original',
    copyToClipboard: 'Copy',
    copiedToClipboard: 'Copied',
    promptSaved: 'Saved',
    saveToCollection: 'Save',
  },
  validation: {
    enterPrompt: 'Enter a prompt',
    minLength: 'Min 3 chars',
    maxLength: 'Max 2000 chars',
    networkError: 'Network error',
    unexpectedError: 'Unexpected error',
  },
  actions: {
    copy: 'Copy',
    copied: 'Copied',
    save: 'Save',
    saved: 'Saved',
  },
}

describe('EnhanceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form with all inputs', () => {
    render(<EnhanceForm translations={mockTranslations} />)

    expect(
      screen.getByRole('combobox', { name: /target/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /prompt/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('enables button when valid prompt entered', () => {
    render(<EnhanceForm translations={mockTranslations} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Valid prompt text' } })

    expect(screen.getByRole('button', { name: /enhance/i })).toBeEnabled()
  })

  it('submits form and shows result on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enhanced: 'Enhanced result' }),
    })

    render(<EnhanceForm translations={mockTranslations} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test prompt' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enhance/i }))

    await waitFor(() => {
      expect(screen.getByText('Enhanced result')).toBeInTheDocument()
    })
  })

  it('shows error on API failure', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    })

    render(<EnhanceForm translations={mockTranslations} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test prompt' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enhance/i }))

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('submits on Cmd+Enter', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enhanced: 'Result' }),
    })

    render(<EnhanceForm translations={mockTranslations} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('keeps button disabled for empty prompt', () => {
    render(<EnhanceForm translations={mockTranslations} />)

    // Enter then clear
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'abc' } })
    fireEvent.change(textarea, { target: { value: '' } })

    // Button should be disabled
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
