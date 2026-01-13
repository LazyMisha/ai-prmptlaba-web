import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '../ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders title and description', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to proceed?'),
    ).toBeInTheDocument()
  })

  it('renders default button text', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('renders custom button text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />,
    )

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('applies destructive styles when isDestructive is true', () => {
    render(<ConfirmDialog {...defaultProps} isDestructive />)

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveClass('text-red-500')
  })

  it('applies normal styles when isDestructive is false', () => {
    render(<ConfirmDialog {...defaultProps} />)

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveClass('text-blue-500')
  })

  it('focuses cancel button when dialog opens', () => {
    render(<ConfirmDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(cancelButton).toHaveFocus()
  })

  it('has proper ARIA ids for title and description', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByText('Confirm Action')).toHaveAttribute(
      'id',
      'dialog-title',
    )
    expect(
      screen.getByText('Are you sure you want to proceed?'),
    ).toHaveAttribute('id', 'dialog-description')
  })
})
