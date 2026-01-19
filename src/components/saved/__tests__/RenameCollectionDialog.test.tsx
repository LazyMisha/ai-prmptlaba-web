import { render, screen, fireEvent } from '@testing-library/react'
import RenameCollectionDialog from '../RenameCollectionDialog'

describe('RenameCollectionDialog', () => {
  const defaultProps = {
    renameCollectionId: 'col-1',
    renameValue: 'Old Name',
    setRenameValue: jest.fn(),
    setRenameCollectionId: jest.fn(),
    handleRenameCollection: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders when renameCollectionId is set', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('does not render when renameCollectionId is null', () => {
      render(
        <RenameCollectionDialog {...defaultProps} renameCollectionId={null} />,
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders input with current value', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument()
    })

    it('renders cancel button', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument()
    })

    it('renders save button', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })
  })

  describe('Save button state', () => {
    it('is disabled when value is empty', () => {
      render(<RenameCollectionDialog {...defaultProps} renameValue="" />)
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
    })

    it('is disabled when value is whitespace only', () => {
      render(<RenameCollectionDialog {...defaultProps} renameValue="   " />)
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
    })

    it('is enabled when value is not empty', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
    })
  })

  describe('User interactions', () => {
    it('calls handleRenameCollection when save is clicked', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /save/i }))
      expect(defaultProps.handleRenameCollection).toHaveBeenCalledTimes(1)
    })

    it('closes dialog when cancel is clicked', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(defaultProps.setRenameCollectionId).toHaveBeenCalledWith(null)
    })

    it('closes dialog when backdrop is clicked', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      fireEvent.click(screen.getByRole('presentation'))
      expect(defaultProps.setRenameCollectionId).toHaveBeenCalledWith(null)
    })

    it('calls setRenameValue when input changes', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      const input = screen.getByDisplayValue('Old Name')
      fireEvent.change(input, { target: { value: 'New Name' } })
      expect(defaultProps.setRenameValue).toHaveBeenCalledWith('New Name')
    })

    it('calls handleRenameCollection on Enter key with valid value', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      const input = screen.getByDisplayValue('Old Name')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(defaultProps.handleRenameCollection).toHaveBeenCalledTimes(1)
    })

    it('does not call handleRenameCollection on Enter with empty value', () => {
      render(<RenameCollectionDialog {...defaultProps} renameValue="" />)
      const input = screen.getByPlaceholderText(/name/i)
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(defaultProps.handleRenameCollection).not.toHaveBeenCalled()
    })

    it('does not call handleRenameCollection on other keys', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      const input = screen.getByDisplayValue('Old Name')
      fireEvent.keyDown(input, { key: 'a' })
      expect(defaultProps.handleRenameCollection).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has dialog role with aria-modal', () => {
      render(<RenameCollectionDialog {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })
})
