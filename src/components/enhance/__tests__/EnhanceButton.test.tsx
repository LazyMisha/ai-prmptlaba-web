import { render, screen, fireEvent } from '@testing-library/react'
import EnhanceButton from '../EnhanceButton'

describe('EnhanceButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default text and calls onClick', () => {
    render(<EnhanceButton {...defaultProps} />)

    const button = screen.getByRole('button', { name: /enhance prompt/i })
    expect(button).toBeEnabled()

    fireEvent.click(button)
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state with spinner', () => {
    render(<EnhanceButton {...defaultProps} isLoading />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(/enhancing/i)).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<EnhanceButton {...defaultProps} disabled />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('uses custom translations', () => {
    const translations = {
      buttonText: 'Custom Text',
      loadingText: 'Loading...',
      enhancingAriaLabel: 'Processing',
      disabledAriaLabel: 'Disabled',
      ariaLabel: 'Custom label',
    }

    render(<EnhanceButton {...defaultProps} translations={translations} />)

    expect(
      screen.getByRole('button', { name: 'Custom label' }),
    ).toHaveTextContent('Custom Text')
  })
})
