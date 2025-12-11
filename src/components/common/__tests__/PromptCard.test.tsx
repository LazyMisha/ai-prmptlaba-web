import { render, screen, fireEvent } from '@testing-library/react'

import type { PromptCardProps } from '../PromptCard'
import PromptCard from '../PromptCard'

const mockPrompt: PromptCardProps = {
  id: 'test-id-1',
  originalPrompt: 'Write a function to calculate fibonacci numbers',
  enhancedPrompt:
    'Create an efficient TypeScript function that calculates fibonacci numbers using dynamic programming with memoization for optimal performance.',
  target: 'ChatGPT',
  timestamp: 1704067200000, // Jan 1, 2024
}

describe('PromptCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with all required fields', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.getByRole('button', { name: /prompt entry/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      expect(screen.getByText(mockPrompt.originalPrompt)).toBeInTheDocument()
      expect(screen.getByText(mockPrompt.enhancedPrompt)).toBeInTheDocument()
    })

    it('displays formatted date', () => {
      render(<PromptCard {...mockPrompt} />)

      // Format: "Jan 1, 2024, 12:00 AM" (time may vary by timezone)
      const article = screen.getByRole('button', { name: /prompt entry/i })
      const timeElement = article.querySelector('time')
      expect(timeElement).toBeInTheDocument()
      expect(timeElement).toHaveAttribute('datetime')
    })

    it('shows labels for Target, Original, and Enhanced', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(screen.getByText('Target')).toBeInTheDocument()
      expect(screen.getByText('Original')).toBeInTheDocument()
      expect(screen.getByText('Enhanced')).toBeInTheDocument()
    })

    it('renders Copy button with correct label', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.getByRole('button', { name: /copy to clipboard/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<PromptCard {...mockPrompt} className="custom-class" />)

      expect(screen.getByRole('button', { name: /prompt entry/i })).toHaveClass(
        'custom-class',
      )
    })
  })

  describe('Expand/Collapse', () => {
    it('starts in collapsed state', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.getByRole('button', { name: /prompt entry/i }),
      ).toHaveAttribute('aria-expanded', 'false')
    })

    it('expands when clicked', () => {
      render(<PromptCard {...mockPrompt} />)

      const article = screen.getByRole('button', { name: /prompt entry/i })
      fireEvent.click(article)

      expect(article).toHaveAttribute('aria-expanded', 'true')
    })

    it('collapses when clicked again', () => {
      render(<PromptCard {...mockPrompt} />)

      const article = screen.getByRole('button', { name: /prompt entry/i })
      fireEvent.click(article)
      fireEvent.click(article)

      expect(article).toHaveAttribute('aria-expanded', 'false')
    })

    it('expands when Enter key is pressed', () => {
      render(<PromptCard {...mockPrompt} />)

      const article = screen.getByRole('button', { name: /prompt entry/i })
      fireEvent.keyDown(article, { key: 'Enter' })

      expect(article).toHaveAttribute('aria-expanded', 'true')
    })

    it('expands when Space key is pressed', () => {
      render(<PromptCard {...mockPrompt} />)

      const article = screen.getByRole('button', { name: /prompt entry/i })
      fireEvent.keyDown(article, { key: ' ' })

      expect(article).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('Delete Action', () => {
    it('renders delete button when onDelete is provided', () => {
      const onDelete = jest.fn()
      render(<PromptCard {...mockPrompt} onDelete={onDelete} />)

      expect(
        screen.getByRole('button', { name: /delete/i }),
      ).toBeInTheDocument()
    })

    it('does not render delete button when onDelete is not provided', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.queryByRole('button', { name: /delete/i }),
      ).not.toBeInTheDocument()
    })

    it('calls onDelete with id when delete button is clicked', () => {
      const onDelete = jest.fn()
      render(<PromptCard {...mockPrompt} onDelete={onDelete} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith('test-id-1')
      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('does not toggle expand when delete button is clicked', () => {
      const onDelete = jest.fn()
      render(<PromptCard {...mockPrompt} onDelete={onDelete} />)

      const article = screen.getByRole('button', {
        name: /prompt entry/i,
      })
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(article).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Move Action', () => {
    it('renders move button when onMove is provided', () => {
      const onMove = jest.fn()
      render(<PromptCard {...mockPrompt} onMove={onMove} />)

      expect(screen.getByRole('button', { name: /move/i })).toBeInTheDocument()
    })

    it('does not render move button when onMove is not provided', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.queryByRole('button', { name: /move/i }),
      ).not.toBeInTheDocument()
    })

    it('calls onMove with id when move button is clicked', () => {
      const onMove = jest.fn()
      render(<PromptCard {...mockPrompt} onMove={onMove} />)

      const moveButton = screen.getByRole('button', { name: /move/i })
      fireEvent.click(moveButton)

      expect(onMove).toHaveBeenCalledWith('test-id-1')
      expect(onMove).toHaveBeenCalledTimes(1)
    })

    it('does not toggle expand when move button is clicked', () => {
      const onMove = jest.fn()
      render(<PromptCard {...mockPrompt} onMove={onMove} />)

      const article = screen.getByRole('button', {
        name: /prompt entry/i,
      })
      const moveButton = screen.getByRole('button', { name: /move/i })
      fireEvent.click(moveButton)

      expect(article).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Both Actions', () => {
    it('renders both delete and move buttons when both handlers are provided', () => {
      const onDelete = jest.fn()
      const onMove = jest.fn()
      render(<PromptCard {...mockPrompt} onDelete={onDelete} onMove={onMove} />)

      expect(
        screen.getByRole('button', { name: /delete/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /move/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-label with expand instruction when collapsed', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.getByRole('button', { name: /prompt entry/i }),
      ).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Click to expand'),
      )
    })

    it('has proper aria-label with collapse instruction when expanded', () => {
      render(<PromptCard {...mockPrompt} />)

      const article = screen.getByRole('button', { name: /prompt entry/i })
      fireEvent.click(article)

      expect(article).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Click to collapse'),
      )
    })

    it('has tabIndex for keyboard navigation', () => {
      render(<PromptCard {...mockPrompt} />)

      expect(
        screen.getByRole('button', { name: /prompt entry/i }),
      ).toHaveAttribute('tabIndex', '0')
    })

    it('time element has datetime attribute', () => {
      render(<PromptCard {...mockPrompt} />)

      const article = screen.getByRole('button', { name: /prompt entry/i })
      const timeElement = article.querySelector('time')
      expect(timeElement).toHaveAttribute(
        'datetime',
        new Date(mockPrompt.timestamp).toISOString(),
      )
    })
  })
})
