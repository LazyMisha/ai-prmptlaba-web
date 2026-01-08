import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EnhanceForm from '../EnhanceForm'

// Mock fetch
global.fetch = jest.fn()

// Mock savePromptHistory
jest.mock('@/lib/db/prompt-history', () => ({
  savePromptHistory: jest.fn().mockResolvedValue(undefined),
}))

describe('EnhanceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form with all inputs', () => {
    render(<EnhanceForm />)

    expect(
      screen.getByRole('combobox', { name: /context/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /prompt/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('enables button when valid prompt entered', () => {
    render(<EnhanceForm />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Valid prompt text' } })

    expect(screen.getByRole('button', { name: /enhance/i })).toBeEnabled()
  })

  it('submits form and shows result on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enhanced: 'Enhanced result' }),
    })

    render(<EnhanceForm />)

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

    render(<EnhanceForm />)

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

    render(<EnhanceForm />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('keeps button disabled for empty prompt', () => {
    render(<EnhanceForm />)

    // Enter then clear
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'abc' } })
    fireEvent.change(textarea, { target: { value: '' } })

    // Button should be disabled
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
