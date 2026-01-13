import { render, screen, fireEvent } from '@testing-library/react'
import MoveToCollectionDialog from '../MoveToCollectionDialog'
import type { Collection } from '@/types/saved-prompts'

const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'General',
    color: '#007AFF',
    createdAt: 1000,
    updatedAt: 1000,
    isDefault: true,
    sortOrder: 0,
  },
  {
    id: 'col-2',
    name: 'Work',
    color: '#34C759',
    createdAt: 2000,
    updatedAt: 2000,
    isDefault: false,
    sortOrder: 1,
  },
  {
    id: 'col-3',
    name: 'Personal',
    color: '#FF3B30',
    createdAt: 3000,
    updatedAt: 3000,
    isDefault: false,
    sortOrder: 2,
  },
]

describe('MoveToCollectionDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    collections: mockCollections,
    currentCollectionId: 'col-1',
    onSelect: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<MoveToCollectionDialog {...defaultProps} isOpen={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders all collections', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      expect(screen.getByText('General')).toBeInTheDocument()
      expect(screen.getByText('Work')).toBeInTheDocument()
      expect(screen.getByText('Personal')).toBeInTheDocument()
    })

    it('shows empty state when no collections', () => {
      render(<MoveToCollectionDialog {...defaultProps} collections={[]} />)
      expect(screen.getByText(/no collections available/i)).toBeInTheDocument()
    })

    it('shows current indicator for current collection', () => {
      render(
        <MoveToCollectionDialog
          {...defaultProps}
          currentCollectionId="col-2"
        />,
      )
      expect(screen.getByText(/current/i)).toBeInTheDocument()
    })

    it('renders close button', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      expect(screen.getByLabelText(/close/i)).toBeInTheDocument()
    })

    it('renders cancel button', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByLabelText(/close/i))
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when cancel button is clicked', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByRole('presentation'))
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onSelect when a collection is clicked', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByText('Work'))
      expect(defaultProps.onSelect).toHaveBeenCalledWith('col-2')
    })

    it('does not call onSelect when current collection is clicked', () => {
      render(
        <MoveToCollectionDialog
          {...defaultProps}
          currentCollectionId="col-2"
        />,
      )
      fireEvent.click(screen.getByText('Work'))
      expect(defaultProps.onSelect).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has dialog role with aria-modal', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('disables current collection button', () => {
      render(
        <MoveToCollectionDialog
          {...defaultProps}
          currentCollectionId="col-1"
        />,
      )
      const generalButton = screen.getByText('General').closest('button')
      expect(generalButton).toBeDisabled()
    })

    it('enables non-current collection buttons', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      const workButton = screen.getByText('Work').closest('button')
      expect(workButton).toBeEnabled()
    })
  })

  describe('Styling', () => {
    it('renders collection color dots', () => {
      render(<MoveToCollectionDialog {...defaultProps} />)
      const colorDots = document.querySelectorAll('span.rounded-full')
      expect(colorDots.length).toBeGreaterThan(0)
    })

    it('applies current collection styles', () => {
      render(
        <MoveToCollectionDialog
          {...defaultProps}
          currentCollectionId="col-2"
        />,
      )
      const workButton = screen.getByText('Work').closest('button')
      expect(workButton).toHaveClass('bg-[#007aff]/10')
    })
  })
})
