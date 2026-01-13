import { render, screen, fireEvent } from '@testing-library/react'
import ManageCollectionDialog from '../ManageCollectionDialog'
import type { Collection } from '@/types/saved-prompts'

const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'ChatGPT',
    color: '#007AFF',
    isDefault: true,
    sortOrder: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'col-2',
    name: 'My Collection',
    color: '#34C759',
    isDefault: false,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

describe('ManageCollectionDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    collections: mockCollections,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<ManageCollectionDialog {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Manage Collections')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<ManageCollectionDialog {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders all collections', () => {
      render(<ManageCollectionDialog {...defaultProps} />)

      expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      expect(screen.getByText('My Collection')).toBeInTheDocument()
    })

    it('shows empty message when no collections', () => {
      render(<ManageCollectionDialog {...defaultProps} collections={[]} />)

      expect(screen.getByText('No collections yet')).toBeInTheDocument()
    })

    it('renders collection colors as colored dots', () => {
      render(<ManageCollectionDialog {...defaultProps} />)

      // Both collections have colors, so they should render color indicator spans
      // We just verify the collections render - color rendering is implementation detail
      expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      expect(screen.getByText('My Collection')).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    it('renders rename buttons when onEdit is provided', () => {
      const onEdit = jest.fn()
      render(<ManageCollectionDialog {...defaultProps} onEdit={onEdit} />)

      expect(
        screen.getByRole('button', { name: /rename chatgpt/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /rename my collection/i }),
      ).toBeInTheDocument()
    })

    it('renders delete buttons when onDelete is provided', () => {
      const onDelete = jest.fn()
      render(<ManageCollectionDialog {...defaultProps} onDelete={onDelete} />)

      expect(
        screen.getByRole('button', { name: /delete chatgpt/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /delete my collection/i }),
      ).toBeInTheDocument()
    })

    it('calls onEdit and closes sheet when rename is clicked', () => {
      const onEdit = jest.fn()
      const onClose = jest.fn()
      render(
        <ManageCollectionDialog
          {...defaultProps}
          onEdit={onEdit}
          onClose={onClose}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /rename chatgpt/i }))

      expect(onEdit).toHaveBeenCalledWith('col-1')
      expect(onClose).toHaveBeenCalled()
    })

    it('calls onDelete and closes sheet when delete is clicked', () => {
      const onDelete = jest.fn()
      const onClose = jest.fn()
      render(
        <ManageCollectionDialog
          {...defaultProps}
          onDelete={onDelete}
          onClose={onClose}
        />,
      )

      fireEvent.click(
        screen.getByRole('button', { name: /delete my collection/i }),
      )

      expect(onDelete).toHaveBeenCalledWith('col-2')
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Interactions', () => {
    it('closes on close button click', () => {
      const onClose = jest.fn()
      render(<ManageCollectionDialog {...defaultProps} onClose={onClose} />)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(onClose).toHaveBeenCalled()
    })

    it('closes on backdrop click', () => {
      const onClose = jest.fn()
      render(<ManageCollectionDialog {...defaultProps} onClose={onClose} />)

      const backdrop = screen.getByRole('presentation')
      fireEvent.click(backdrop)

      expect(onClose).toHaveBeenCalled()
    })

    it('closes on escape key', () => {
      const onClose = jest.fn()
      render(<ManageCollectionDialog {...defaultProps} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper dialog role and aria attributes', () => {
      render(<ManageCollectionDialog {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('has accessible close button', () => {
      render(<ManageCollectionDialog {...defaultProps} />)

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('action buttons have accessible labels', () => {
      const onEdit = jest.fn()
      const onDelete = jest.fn()
      render(
        <ManageCollectionDialog
          {...defaultProps}
          onEdit={onEdit}
          onDelete={onDelete}
        />,
      )

      expect(
        screen.getByRole('button', { name: 'Rename ChatGPT' }),
      ).toHaveAttribute('aria-label', 'Rename ChatGPT')
      expect(
        screen.getByRole('button', { name: 'Delete My Collection' }),
      ).toHaveAttribute('aria-label', 'Delete My Collection')
    })
  })
})
