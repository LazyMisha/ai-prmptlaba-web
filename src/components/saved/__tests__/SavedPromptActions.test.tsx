import { render, screen, fireEvent } from '@testing-library/react'
import SavedPromptActions from '../SavedPromptActions'

// Mock hooks
jest.mock('@/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: jest.fn(() => ({
    copied: false,
    copy: jest.fn(),
  })),
}))

jest.mock('@/i18n/client', () => ({
  useTranslations: () => ({
    promptCard: {
      copyToClipboard: 'Copy to Clipboard',
      copiedToClipboard: 'Copied to Clipboard',
      deleteEntry: 'Delete entry',
      moveToAnother: 'Move to Another Collection',
    },
  }),
}))

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

describe('SavedPromptActions', () => {
  const mockOnDelete = jest.fn()
  const mockOnMove = jest.fn()
  const mockCopy = jest.fn()

  const defaultProps = {
    id: 'test-id-1',
    enhancedPrompt: 'Enhanced prompt text',
    onDelete: mockOnDelete,
    onMove: mockOnMove,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCopyToClipboard as jest.Mock).mockReturnValue({
      copied: false,
      copy: mockCopy,
    })
  })

  describe('Rendering', () => {
    it('renders copy button', () => {
      render(<SavedPromptActions {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /copy to clipboard/i }),
      ).toBeInTheDocument()
    })

    it('renders move button', () => {
      render(<SavedPromptActions {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /move to another collection/i }),
      ).toBeInTheDocument()
    })

    it('renders delete button', () => {
      render(<SavedPromptActions {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /delete entry/i }),
      ).toBeInTheDocument()
    })

    it('renders all three action buttons', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })
  })

  describe('Copy Action', () => {
    it('calls copy function when copy button is clicked', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })

      fireEvent.click(copyButton)

      expect(mockCopy).toHaveBeenCalledWith('Enhanced prompt text')
      expect(mockCopy).toHaveBeenCalledTimes(1)
    })

    it('shows copied state with check icon', () => {
      ;(useCopyToClipboard as jest.Mock).mockReturnValue({
        copied: true,
        copy: mockCopy,
      })

      render(<SavedPromptActions {...defaultProps} />)

      expect(
        screen.getByRole('button', { name: /copied to clipboard/i }),
      ).toBeInTheDocument()
    })

    it('prevents event propagation on copy click', () => {
      const stopPropagation = jest.fn()
      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'stopPropagation', {
        value: stopPropagation,
      })

      fireEvent(copyButton, event)

      expect(stopPropagation).toHaveBeenCalled()
    })
  })

  describe('Move Action', () => {
    it('calls onMove with correct id when move button is clicked', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const moveButton = screen.getByRole('button', {
        name: /move to another collection/i,
      })

      fireEvent.click(moveButton)

      expect(mockOnMove).toHaveBeenCalledWith('test-id-1')
      expect(mockOnMove).toHaveBeenCalledTimes(1)
    })

    it('prevents event propagation on move click', () => {
      const stopPropagation = jest.fn()
      render(<SavedPromptActions {...defaultProps} />)
      const moveButton = screen.getByRole('button', {
        name: /move to another collection/i,
      })

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'stopPropagation', {
        value: stopPropagation,
      })

      fireEvent(moveButton, event)

      expect(stopPropagation).toHaveBeenCalled()
    })
  })

  describe('Delete Action', () => {
    it('calls onDelete with correct id when delete button is clicked', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      fireEvent.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledWith('test-id-1')
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })

    it('prevents event propagation on delete click', () => {
      const stopPropagation = jest.fn()
      render(<SavedPromptActions {...defaultProps} />)
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'stopPropagation', {
        value: stopPropagation,
      })

      fireEvent(deleteButton, event)

      expect(stopPropagation).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('copy button has proper aria-label', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })

      expect(copyButton).toHaveAccessibleName('Copy to Clipboard')
    })

    it('move button has proper aria-label', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const moveButton = screen.getByRole('button', {
        name: /move to another collection/i,
      })

      expect(moveButton).toHaveAccessibleName('Move to Another Collection')
    })

    it('delete button has proper aria-label', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      expect(deleteButton).toHaveAccessibleName('Delete entry')
    })

    it('updates aria-label when copied', () => {
      ;(useCopyToClipboard as jest.Mock).mockReturnValue({
        copied: true,
        copy: mockCopy,
      })

      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copied to clipboard/i,
      })

      expect(copyButton).toHaveAccessibleName('Copied to Clipboard')
    })
  })

  describe('Button Styling', () => {
    it('applies proper styling classes to all buttons', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })
      const moveButton = screen.getByRole('button', {
        name: /move to another collection/i,
      })
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      expect(copyButton).toHaveClass('rounded-lg')
      expect(moveButton).toHaveClass('rounded-lg')
      expect(deleteButton).toHaveClass('rounded-lg')
    })

    it('copy button has success styling when copied', () => {
      ;(useCopyToClipboard as jest.Mock).mockReturnValue({
        copied: true,
        copy: mockCopy,
      })

      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copied to clipboard/i,
      })

      expect(copyButton.className).toContain('bg-[#34c759]')
    })

    it('delete button has destructive styling', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      expect(deleteButton.className).toContain('hover:bg-[#ff3b30]')
    })
  })

  describe('Action Independence', () => {
    it('clicking copy does not trigger move or delete', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })

      fireEvent.click(copyButton)

      expect(mockCopy).toHaveBeenCalled()
      expect(mockOnMove).not.toHaveBeenCalled()
      expect(mockOnDelete).not.toHaveBeenCalled()
    })

    it('clicking move does not trigger copy or delete', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const moveButton = screen.getByRole('button', {
        name: /move to another collection/i,
      })

      fireEvent.click(moveButton)

      expect(mockOnMove).toHaveBeenCalled()
      expect(mockCopy).not.toHaveBeenCalled()
      expect(mockOnDelete).not.toHaveBeenCalled()
    })

    it('clicking delete does not trigger copy or move', () => {
      render(<SavedPromptActions {...defaultProps} />)
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      fireEvent.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalled()
      expect(mockCopy).not.toHaveBeenCalled()
      expect(mockOnMove).not.toHaveBeenCalled()
    })
  })
})
