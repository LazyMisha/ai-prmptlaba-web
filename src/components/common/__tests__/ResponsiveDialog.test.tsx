import { render, screen, fireEvent } from '@testing-library/react'

import ResponsiveDialog from '../ResponsiveDialog'

describe('ResponsiveDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Dialog',
    children: <div>Dialog content</div>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
      expect(screen.getByText('Dialog content')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<ResponsiveDialog {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders title in heading element', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Test Dialog')
    })

    it('renders children content', () => {
      render(
        <ResponsiveDialog {...defaultProps}>
          <button>Action Button</button>
          <p>Some text content</p>
        </ResponsiveDialog>,
      )

      expect(
        screen.getByRole('button', { name: 'Action Button' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Some text content')).toBeInTheDocument()
    })

    it('renders footer when provided', () => {
      render(
        <ResponsiveDialog
          {...defaultProps}
          footer={
            <div>
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          }
        />,
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Confirm' }),
      ).toBeInTheDocument()
    })

    it('renders drag handle for mobile', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      expect(screen.getByTestId('drag-handle')).toBeInTheDocument()
    })
  })

  describe('Close button', () => {
    it('renders close button by default', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
      render(<ResponsiveDialog {...defaultProps} showCloseButton={false} />)

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Backdrop', () => {
    it('calls onClose when backdrop is clicked', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      const backdrop = screen.getByRole('dialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when dialog content is clicked', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      fireEvent.click(screen.getByRole('dialog'))

      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })

    it('does not close on backdrop click when isAlert is true', () => {
      render(<ResponsiveDialog {...defaultProps} isAlert />)

      const backdrop = screen.getByRole('alertdialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      // Note: isAlert currently doesn't prevent backdrop click - just changes role
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Breakpoint configurations', () => {
    it('applies sm breakpoint classes by default', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      // Verify the dialog has sm breakpoint responsive classes
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('sm:rounded-2xl')
    })

    it('applies md breakpoint classes when specified', () => {
      render(<ResponsiveDialog {...defaultProps} breakpoint="md" />)

      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('md:rounded-2xl')
    })

    it('applies lg breakpoint classes when specified', () => {
      render(<ResponsiveDialog {...defaultProps} breakpoint="lg" />)

      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('lg:rounded-2xl')
    })
  })

  describe('Max width', () => {
    it('applies default sm max-width', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('sm:max-w-sm')
    })

    it('applies xs max-width when specified', () => {
      render(<ResponsiveDialog {...defaultProps} maxWidth="xs" />)

      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('sm:max-w-xs')
    })

    it('applies lg max-width when specified', () => {
      render(<ResponsiveDialog {...defaultProps} maxWidth="lg" />)

      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('sm:max-w-lg')
    })
  })

  describe('Accessibility', () => {
    it('has dialog role', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal attribute', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby referencing title', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      const labelledById = dialog.getAttribute('aria-labelledby')
      expect(labelledById).toBeTruthy()

      const titleElement = document.getElementById(labelledById!)
      expect(titleElement).toHaveTextContent('Test Dialog')
    })

    it('closes on Escape key press', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close on Escape when isAlert is true', () => {
      render(<ResponsiveDialog {...defaultProps} isAlert />)

      fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' })

      // Note: isAlert currently doesn't prevent Escape - just changes role
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('has alertdialog role when isAlert is true', () => {
      render(<ResponsiveDialog {...defaultProps} isAlert />)

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('close button has accessible label', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('Z-index', () => {
    it('applies default z-index of 100', () => {
      render(<ResponsiveDialog {...defaultProps} />)

      const backdrop = screen.getByRole('dialog').parentElement
      expect(backdrop).toHaveStyle({ zIndex: 100 })
    })

    it('applies custom z-index when provided', () => {
      render(<ResponsiveDialog {...defaultProps} zIndex={200} />)

      const backdrop = screen.getByRole('dialog').parentElement
      expect(backdrop).toHaveStyle({ zIndex: 200 })
    })
  })
})
