import { render, screen, fireEvent } from '@testing-library/react'
import HistoryPromptActions from '../HistoryPromptActions'

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
    },
  }),
}))

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

describe('HistoryPromptActions', () => {
  const mockOnDelete = jest.fn()
  const mockCopy = jest.fn()

  const defaultProps = {
    id: 'test-id-1',
    enhancedPrompt: 'Enhanced prompt text',
    onDelete: mockOnDelete,
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
      render(<HistoryPromptActions {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /copy to clipboard/i }),
      ).toBeInTheDocument()
    })

    it('renders delete button', () => {
      render(<HistoryPromptActions {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: /delete entry/i }),
      ).toBeInTheDocument()
    })

    it('does not render move button', () => {
      render(<HistoryPromptActions {...defaultProps} />)
      expect(
        screen.queryByRole('button', { name: /move/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Copy Action', () => {
    it('calls copy function when copy button is clicked', () => {
      render(<HistoryPromptActions {...defaultProps} />)
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

      render(<HistoryPromptActions {...defaultProps} />)

      expect(
        screen.getByRole('button', { name: /copied to clipboard/i }),
      ).toBeInTheDocument()
    })

    it('shows copy icon when not copied', () => {
      render(<HistoryPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })

      // Should have an SVG icon
      const svg = copyButton.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('prevents event propagation on copy click', () => {
      const stopPropagation = jest.fn()
      render(<HistoryPromptActions {...defaultProps} />)
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

  describe('Delete Action', () => {
    it('calls onDelete with correct id when delete button is clicked', () => {
      render(<HistoryPromptActions {...defaultProps} />)
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      fireEvent.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledWith('test-id-1')
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })

    it('prevents event propagation on delete click', () => {
      const stopPropagation = jest.fn()
      render(<HistoryPromptActions {...defaultProps} />)
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
      render(<HistoryPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })

      expect(copyButton).toHaveAccessibleName('Copy to Clipboard')
    })

    it('delete button has proper aria-label', () => {
      render(<HistoryPromptActions {...defaultProps} />)
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

      render(<HistoryPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copied to clipboard/i,
      })

      expect(copyButton).toHaveAccessibleName('Copied to Clipboard')
    })
  })

  describe('Button Styling', () => {
    it('applies proper styling classes to buttons', () => {
      render(<HistoryPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copy to clipboard/i,
      })
      const deleteButton = screen.getByRole('button', {
        name: /delete entry/i,
      })

      expect(copyButton).toHaveClass('rounded-lg')
      expect(copyButton).toHaveClass('min-h-[44px]')
      expect(deleteButton).toHaveClass('rounded-lg')
      expect(deleteButton).toHaveClass('min-h-[44px]')
    })

    it('copy button has success styling when copied', () => {
      ;(useCopyToClipboard as jest.Mock).mockReturnValue({
        copied: true,
        copy: mockCopy,
      })

      render(<HistoryPromptActions {...defaultProps} />)
      const copyButton = screen.getByRole('button', {
        name: /copied to clipboard/i,
      })

      expect(copyButton.className).toContain('bg-[#34c759]')
    })
  })
})
