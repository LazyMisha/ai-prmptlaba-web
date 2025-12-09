import { render, screen, fireEvent } from '@testing-library/react'
import MoveToCollectionSheet from '../MoveToCollectionSheet'
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

describe('MoveToCollectionSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    collections: mockCollections,
    onSelect: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<MoveToCollectionSheet {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Move to Collection')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<MoveToCollectionSheet {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders all collections', () => {
      render(<MoveToCollectionSheet {...defaultProps} />)

      expect(screen.getByText('General')).toBeInTheDocument()
      expect(screen.getByText('Work')).toBeInTheDocument()
      expect(screen.getByText('Personal')).toBeInTheDocument()
    })

    it('shows empty state when no collections', () => {
      render(<MoveToCollectionSheet {...defaultProps} collections={[]} />)

      expect(screen.getByText('No collections available')).toBeInTheDocument()
    })

    it('shows Current indicator for current collection', () => {
      render(<MoveToCollectionSheet {...defaultProps} currentCollectionId="col-2" />)

      expect(screen.getByText('Current')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn()
      render(<MoveToCollectionSheet {...defaultProps} onClose={onClose} />)

      fireEvent.click(screen.getByLabelText('Close'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', () => {
      const onClose = jest.fn()
      render(<MoveToCollectionSheet {...defaultProps} onClose={onClose} />)

      // Click on the backdrop (the outer div with role="presentation")
      const backdrop = screen.getByRole('presentation')
      fireEvent.click(backdrop)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onSelect when a collection is clicked', () => {
      const onSelect = jest.fn()
      render(<MoveToCollectionSheet {...defaultProps} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('Work'))

      expect(onSelect).toHaveBeenCalledWith('col-2')
    })

    it('does not call onSelect when current collection is clicked', () => {
      const onSelect = jest.fn()
      render(
        <MoveToCollectionSheet {...defaultProps} onSelect={onSelect} currentCollectionId="col-2" />,
      )

      fireEvent.click(screen.getByText('Work'))

      expect(onSelect).not.toHaveBeenCalled()
    })

    it('calls onClose when Escape key is pressed', () => {
      const onClose = jest.fn()
      render(<MoveToCollectionSheet {...defaultProps} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('has proper dialog role and aria attributes', () => {
      render(<MoveToCollectionSheet {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute(
        'aria-labelledby',
        'responsive-dialog-title-move-to-collection',
      )
    })

    it('has accessible close button', () => {
      render(<MoveToCollectionSheet {...defaultProps} />)

      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })

    it('disables current collection button', () => {
      render(<MoveToCollectionSheet {...defaultProps} currentCollectionId="col-1" />)

      const generalButton = screen.getByText('General').closest('button')
      expect(generalButton).toBeDisabled()
    })
  })

  describe('Styling', () => {
    it('renders collection color dots', () => {
      render(<MoveToCollectionSheet {...defaultProps} />)

      // Color dots are spans with w-3 h-3 classes inside buttons
      const buttons = screen.getAllByRole('button', { name: /General|Work|Personal/i })
      expect(buttons.length).toBe(3)

      // Each button should have a color indicator span
      buttons.forEach((button) => {
        const colorDot = button.querySelector('span.rounded-full')
        expect(colorDot).toBeInTheDocument()
      })
    })

    it('applies different styles to current collection', () => {
      render(<MoveToCollectionSheet {...defaultProps} currentCollectionId="col-2" />)

      const workButton = screen.getByText('Work').closest('button')
      expect(workButton).toHaveClass('bg-[#007aff]/10')
    })
  })
})
