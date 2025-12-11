import { render, screen, fireEvent } from '@testing-library/react'

import MobileSheet from '../MobileSheet'

describe('MobileSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Sheet',
    children: <div>Sheet content</div>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<MobileSheet {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Test Sheet')).toBeInTheDocument()
      expect(screen.getByText('Sheet content')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<MobileSheet {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders title in heading element', () => {
      render(<MobileSheet {...defaultProps} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Test Sheet')
    })

    it('renders children content', () => {
      render(
        <MobileSheet {...defaultProps}>
          <button>Action Button</button>
          <p>Some text content</p>
        </MobileSheet>,
      )

      expect(
        screen.getByRole('button', { name: 'Action Button' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Some text content')).toBeInTheDocument()
    })

    it('renders footer when provided', () => {
      render(
        <MobileSheet
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

    it('renders drag handle', () => {
      render(<MobileSheet {...defaultProps} />)

      expect(screen.getByTestId('drag-handle')).toBeInTheDocument()
    })
  })

  describe('Close button', () => {
    it('renders close button by default', () => {
      render(<MobileSheet {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
      render(<MobileSheet {...defaultProps} showCloseButton={false} />)

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
      render(<MobileSheet {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Backdrop', () => {
    it('calls onClose when backdrop is clicked', () => {
      render(<MobileSheet {...defaultProps} />)

      const backdrop = screen.getByRole('dialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when dialog content is clicked', () => {
      render(<MobileSheet {...defaultProps} />)

      fireEvent.click(screen.getByRole('dialog'))

      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has dialog role', () => {
      render(<MobileSheet {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal attribute', () => {
      render(<MobileSheet {...defaultProps} />)

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby referencing title', () => {
      render(<MobileSheet {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      const labelledById = dialog.getAttribute('aria-labelledby')
      expect(labelledById).toBeTruthy()

      const titleElement = document.getElementById(labelledById!)
      expect(titleElement).toHaveTextContent('Test Sheet')
    })

    it('closes on Escape key press', () => {
      render(<MobileSheet {...defaultProps} />)

      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('close button has accessible label', () => {
      render(<MobileSheet {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('Z-index', () => {
    it('applies default z-index of 100', () => {
      render(<MobileSheet {...defaultProps} />)

      const backdrop = screen.getByRole('dialog').parentElement
      expect(backdrop).toHaveStyle({ zIndex: 100 })
    })

    it('applies custom z-index when provided', () => {
      render(<MobileSheet {...defaultProps} zIndex={200} />)

      const backdrop = screen.getByRole('dialog').parentElement
      expect(backdrop).toHaveStyle({ zIndex: 200 })
    })
  })
})
