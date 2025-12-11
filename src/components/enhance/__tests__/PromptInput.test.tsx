import { render, screen, fireEvent } from '@testing-library/react'
import PromptInput from '../PromptInput'

describe('PromptInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders textarea with label and calls onChange', () => {
    render(<PromptInput {...defaultProps} />)

    const textarea = screen.getByRole('textbox', { name: /your prompt/i })
    expect(textarea).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: 'test' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('test')
  })

  it('shows character count', () => {
    render(<PromptInput {...defaultProps} value="hello" />)

    expect(screen.getByText('5 / 2,000')).toBeInTheDocument()
  })

  it('shows warning when under minimum characters', () => {
    render(<PromptInput {...defaultProps} value="ab" />)

    expect(screen.getByText(/1 more character needed/i)).toBeInTheDocument()
  })

  it('shows error when over maximum characters', () => {
    const longText = 'a'.repeat(2001)
    render(<PromptInput {...defaultProps} value={longText} />)

    expect(screen.getByText(/1 over limit/i)).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<PromptInput {...defaultProps} error="Required field" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('is disabled when disabled prop is true', () => {
    render(<PromptInput {...defaultProps} disabled />)

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('calls onKeyDown handler', () => {
    const onKeyDown = jest.fn()
    render(<PromptInput {...defaultProps} onKeyDown={onKeyDown} />)

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(onKeyDown).toHaveBeenCalled()
  })
})
