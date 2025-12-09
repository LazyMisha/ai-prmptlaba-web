import { render, screen, fireEvent } from '@testing-library/react'
import IconTextButton from '../IconTextButton'

const MockIcon = () => <svg data-testid="mock-icon" />

describe('IconTextButton', () => {
  const defaultProps = {
    label: 'Test Button',
    icon: <MockIcon />,
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the label text', () => {
      render(<IconTextButton {...defaultProps} />)

      expect(screen.getByText('Test Button')).toBeInTheDocument()
    })

    it('renders the icon', () => {
      render(<IconTextButton {...defaultProps} />)

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('renders as a button element', () => {
      render(<IconTextButton {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const onClick = jest.fn()
      render(<IconTextButton {...defaultProps} onClick={onClick} />)

      fireEvent.click(screen.getByRole('button'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('passes event to onClick handler', () => {
      const onClick = jest.fn()
      render(<IconTextButton {...defaultProps} onClick={onClick} />)

      fireEvent.click(screen.getByRole('button'))

      expect(onClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('Variants', () => {
    it('applies default variant styles', () => {
      render(<IconTextButton {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-[#86868b]')
      expect(button).toHaveClass('hover:text-[#007aff]')
    })

    it('applies destructive variant styles', () => {
      render(<IconTextButton {...defaultProps} variant="destructive" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-[#86868b]')
      expect(button).toHaveClass('hover:text-[#ff3b30]')
    })

    it('applies success variant styles', () => {
      render(<IconTextButton {...defaultProps} variant="success" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-[#34c759]')
      expect(button).toHaveClass('hover:text-[#34c759]')
    })

    it('applies primary variant styles', () => {
      render(<IconTextButton {...defaultProps} variant="primary" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-[#007aff]')
      expect(button).toHaveClass('hover:text-[#007aff]')
    })
  })

  describe('Disabled state', () => {
    it('sets disabled attribute when disabled prop is true', () => {
      render(<IconTextButton {...defaultProps} disabled />)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies cursor-default when disabled', () => {
      render(<IconTextButton {...defaultProps} disabled />)

      expect(screen.getByRole('button')).toHaveClass('cursor-default')
    })

    it('does not apply hover styles when disabled', () => {
      render(<IconTextButton {...defaultProps} disabled />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('hover:text-[#007aff]')
    })

    it('still calls onClick when disabled (native behavior)', () => {
      const onClick = jest.fn()
      render(<IconTextButton {...defaultProps} onClick={onClick} disabled />)

      fireEvent.click(screen.getByRole('button'))

      // Disabled buttons don't fire click events
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('uses label as aria-label by default', () => {
      render(<IconTextButton {...defaultProps} />)

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test Button')
    })

    it('uses custom ariaLabel when provided', () => {
      render(<IconTextButton {...defaultProps} ariaLabel="Custom label" />)

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label')
    })

    it('has proper focus styles', () => {
      render(<IconTextButton {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:ring-2')
      expect(button).toHaveClass('focus-visible:ring-offset-2')
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<IconTextButton {...defaultProps} className="custom-class" />)

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('has consistent typography', () => {
      render(<IconTextButton {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-xs')
      expect(button).toHaveClass('font-medium')
    })

    it('has proper layout classes', () => {
      render(<IconTextButton {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('flex')
      expect(button).toHaveClass('items-center')
      expect(button).toHaveClass('gap-1.5')
    })
  })
})
