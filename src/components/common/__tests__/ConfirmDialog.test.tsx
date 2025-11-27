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
  })

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      render(<ConfirmDialog {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('renders dialog when isOpen is true', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('renders title correctly', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    })

    it('renders description correctly', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
    })

    it('renders default button text when not provided', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('renders custom button text when provided', () => {
      render(<ConfirmDialog {...defaultProps} confirmText="Delete" cancelText="Keep" />)

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria attributes', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const dialog = screen.getByRole('alertdialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
      expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description')
    })

    it('has title with correct id for aria-labelledby', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const title = screen.getByText('Confirm Action')
      expect(title).toHaveAttribute('id', 'dialog-title')
    })

    it('has description with correct id for aria-describedby', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const description = screen.getByText('Are you sure you want to proceed?')
      expect(description).toHaveAttribute('id', 'dialog-description')
    })

    it('focuses cancel button when dialog opens', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toHaveFocus()
    })
  })

  describe('User Interactions', () => {
    it('calls onClose when cancel button is clicked', () => {
      const onClose = jest.fn()
      render(<ConfirmDialog {...defaultProps} onClose={onClose} />)

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onConfirm when confirm button is clicked', () => {
      const onConfirm = jest.fn()
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', () => {
      const onClose = jest.fn()
      render(<ConfirmDialog {...defaultProps} onClose={onClose} />)

      // The backdrop is the element with role="presentation"
      const backdrop = screen.getByRole('presentation')
      fireEvent.click(backdrop)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when dialog content is clicked', () => {
      const onClose = jest.fn()
      render(<ConfirmDialog {...defaultProps} onClose={onClose} />)

      const dialog = screen.getByRole('alertdialog')
      fireEvent.click(dialog)

      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose when Escape key is pressed', () => {
      const onClose = jest.fn()
      render(<ConfirmDialog {...defaultProps} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Destructive Variant', () => {
    it('applies destructive styles to confirm button when isDestructive is true', () => {
      render(<ConfirmDialog {...defaultProps} isDestructive />)

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      expect(confirmButton).toHaveClass('text-red-500')
    })

    it('applies normal styles to confirm button when isDestructive is false', () => {
      render(<ConfirmDialog {...defaultProps} isDestructive={false} />)

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      expect(confirmButton).toHaveClass('text-blue-500')
    })
  })

  describe('Body Scroll Prevention', () => {
    it('prevents body scroll when dialog is open', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body scroll when dialog is closed', () => {
      const { rerender } = render(<ConfirmDialog {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')

      rerender(<ConfirmDialog {...defaultProps} isOpen={false} />)

      expect(document.body.style.overflow).toBe('')
    })

    it('restores body scroll on unmount', () => {
      const { unmount } = render(<ConfirmDialog {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')

      unmount()

      expect(document.body.style.overflow).toBe('')
    })
  })
})
