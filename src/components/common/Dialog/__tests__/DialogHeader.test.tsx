import { render, screen, fireEvent } from '@testing-library/react'
import DialogHeader from '../DialogHeader'

describe('DialogHeader', () => {
  const mockOnClose = jest.fn()
  const defaultProps = {
    title: 'Test Dialog Title',
    onClose: mockOnClose,
  }

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders title correctly', () => {
    render(<DialogHeader {...defaultProps} />)
    expect(
      screen.getByRole('heading', { name: 'Test Dialog Title' }),
    ).toBeInTheDocument()
  })

  it('renders close button with default aria-label', () => {
    render(<DialogHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('renders close button with custom aria-label', () => {
    render(<DialogHeader {...defaultProps} closeLabel="Close dialog" />)
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<DialogHeader {...defaultProps} />)
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('applies custom titleId when provided', () => {
    render(<DialogHeader {...defaultProps} titleId="custom-dialog-title" />)
    const heading = screen.getByRole('heading', { name: 'Test Dialog Title' })
    expect(heading).toHaveAttribute('id', 'custom-dialog-title')
  })

  it('does not have titleId when not provided', () => {
    render(<DialogHeader {...defaultProps} />)
    const heading = screen.getByRole('heading', { name: 'Test Dialog Title' })
    expect(heading).not.toHaveAttribute('id')
  })

  it('has proper heading level (h2)', () => {
    render(<DialogHeader {...defaultProps} />)
    const heading = screen.getByRole('heading', { name: 'Test Dialog Title' })
    expect(heading.tagName).toBe('H2')
  })

  it('close button has proper focus styles', () => {
    render(<DialogHeader {...defaultProps} />)
    const closeButton = screen.getByRole('button', { name: 'Close' })
    expect(closeButton).toHaveClass('focus:outline-none')
    expect(closeButton).toHaveClass('focus-visible:ring-2')
    expect(closeButton).toHaveClass('focus-visible:ring-[#007aff]')
  })

  it('renders CloseIcon inside close button', () => {
    render(<DialogHeader {...defaultProps} />)
    const closeButton = screen.getByRole('button', { name: 'Close' })
    const svg = closeButton.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
