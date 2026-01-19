import { render, screen, fireEvent } from '@testing-library/react'
import CreateCollectionDialog from '../CreateCollectionDialog'
import { DEFAULT_COLLECTION_COLOR } from '@/constants/saved-prompts'
import type { CollectionColor } from '@/constants/saved-prompts'

describe('CreateCollectionDialog', () => {
  const defaultProps = {
    showCreateCollection: true,
    setShowCreateCollection: jest.fn(),
    newCollectionName: '',
    setNewCollectionName: jest.fn(),
    newCollectionColor: DEFAULT_COLLECTION_COLOR as CollectionColor,
    setNewCollectionColor: jest.fn(),
    newCollectionNameError: null,
    setNewCollectionNameError: jest.fn(),
    handleCreateCollection: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when showCreateCollection is true', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      expect(
        screen.getByRole('heading', { name: /new collection/i }),
      ).toBeInTheDocument()
    })

    it('does not render when showCreateCollection is false', () => {
      render(
        <CreateCollectionDialog
          {...defaultProps}
          showCreateCollection={false}
        />,
      )
      expect(
        screen.queryByRole('heading', { name: /new collection/i }),
      ).not.toBeInTheDocument()
    })

    it('renders create button', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /create/i }),
      ).toBeInTheDocument()
    })

    it('renders collection form', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    })
  })

  describe('Create button state', () => {
    it('is disabled when name is empty', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
    })

    it('is disabled when name is whitespace only', () => {
      render(
        <CreateCollectionDialog {...defaultProps} newCollectionName="   " />,
      )
      expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
    })

    it('is enabled when name has value', () => {
      render(
        <CreateCollectionDialog
          {...defaultProps}
          newCollectionName="My Collection"
        />,
      )
      expect(screen.getByRole('button', { name: /create/i })).toBeEnabled()
    })
  })

  describe('User interactions', () => {
    it('calls handleCreateCollection when create button is clicked', () => {
      render(
        <CreateCollectionDialog {...defaultProps} newCollectionName="Test" />,
      )
      fireEvent.click(screen.getByRole('button', { name: /create/i }))
      expect(defaultProps.handleCreateCollection).toHaveBeenCalledTimes(1)
    })

    it('resets state when close button is clicked', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(defaultProps.setShowCreateCollection).toHaveBeenCalledWith(false)
      expect(defaultProps.setNewCollectionName).toHaveBeenCalledWith('')
      expect(defaultProps.setNewCollectionColor).toHaveBeenCalledWith(
        DEFAULT_COLLECTION_COLOR,
      )
      expect(defaultProps.setNewCollectionNameError).toHaveBeenCalledWith(null)
    })

    it('resets state when dialog backdrop is clicked', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      const backdrop = screen.getByRole('presentation')
      fireEvent.click(backdrop)

      expect(defaultProps.setShowCreateCollection).toHaveBeenCalledWith(false)
      expect(defaultProps.setNewCollectionName).toHaveBeenCalledWith('')
      expect(defaultProps.setNewCollectionColor).toHaveBeenCalledWith(
        DEFAULT_COLLECTION_COLOR,
      )
      expect(defaultProps.setNewCollectionNameError).toHaveBeenCalledWith(null)
    })
  })

  describe('Form integration', () => {
    it('passes name to form', () => {
      render(
        <CreateCollectionDialog
          {...defaultProps}
          newCollectionName="Test Collection"
        />,
      )
      expect(screen.getByDisplayValue('Test Collection')).toBeInTheDocument()
    })

    it('calls setNewCollectionName when form name changes', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      const input = screen.getByLabelText(/name/i)
      fireEvent.change(input, { target: { value: 'New Name' } })
      expect(defaultProps.setNewCollectionName).toHaveBeenCalledWith('New Name')
    })

    it('clears error when name changes', () => {
      render(
        <CreateCollectionDialog
          {...defaultProps}
          newCollectionNameError="Error"
        />,
      )
      const input = screen.getByLabelText(/name/i)
      fireEvent.change(input, { target: { value: 'Test' } })
      expect(defaultProps.setNewCollectionNameError).toHaveBeenCalledWith(null)
    })

    it('does not clear error when name changes if no error exists', () => {
      render(<CreateCollectionDialog {...defaultProps} />)
      const input = screen.getByLabelText(/name/i)
      fireEvent.change(input, { target: { value: 'Test' } })
      expect(defaultProps.setNewCollectionNameError).not.toHaveBeenCalled()
    })
  })
})
