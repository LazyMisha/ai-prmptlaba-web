import { render, screen, fireEvent } from '@testing-library/react'
import Dialog from '../index'

describe('Dialog', () => {
  const mockOnClose = jest.fn()
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Dialog content</div>,
  }

  beforeEach(() => {
    mockOnClose.mockClear()
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders children when open', () => {
    render(<Dialog {...defaultProps} />)
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Dialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<Dialog {...defaultProps} />)
    const backdrop = screen.getByRole('presentation')
    fireEvent.click(backdrop)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when dialog content is clicked', () => {
    render(<Dialog {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    render(<Dialog {...defaultProps} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll when open', () => {
    render(<Dialog {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Dialog {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Dialog {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('applies custom z-index', () => {
    render(<Dialog {...defaultProps} zIndex={200} />)
    const backdrop = screen.getByRole('presentation')
    expect(backdrop).toHaveStyle({ zIndex: 200 })
  })

  it('uses default z-index of 100', () => {
    render(<Dialog {...defaultProps} />)
    const backdrop = screen.getByRole('presentation')
    expect(backdrop).toHaveStyle({ zIndex: 100 })
  })

  it('has proper ARIA attributes', () => {
    render(<Dialog {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })
})
