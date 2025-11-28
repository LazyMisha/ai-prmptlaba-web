import { render, screen, fireEvent } from '@testing-library/react'
import HistoryItem from '../HistoryItem'
import type { PromptHistoryEntry } from '@/types/history'

const mockEntry: PromptHistoryEntry = {
  id: 'test-id-123',
  originalPrompt: 'Test original prompt',
  enhancedPrompt: 'Test enhanced prompt',
  target: 'ChatGPT',
  timestamp: new Date('2025-01-01T12:00:00Z').getTime(),
}

describe('HistoryItem', () => {
  it('renders collapsed by default', () => {
    const { container } = render(<HistoryItem entry={mockEntry} />)

    // Should show preview in collapsed state (text-gray-600 is for original in collapsed state)
    const collapsedElements = container.querySelectorAll('.truncate')
    const originalPreview = Array.from(collapsedElements).find((el) =>
      el.textContent?.includes('Test original prompt'),
    )
    expect(originalPreview).toBeInTheDocument()

    // Expanded content should exist but be hidden with grid-rows-[0fr]
    const expandedContainer = container.querySelector('.grid-rows-\\[0fr\\]')
    expect(expandedContainer).toBeInTheDocument()

    // Should have opacity-0 when collapsed
    const hiddenContent = container.querySelector('.opacity-0')
    expect(hiddenContent).toBeInTheDocument()
  })

  it('expands when clicked', () => {
    render(<HistoryItem entry={mockEntry} />)

    const item = screen.getByRole('button', { name: /history entry/i })
    fireEvent.click(item)

    // Should now show the expanded content with labels
    const originalLabels = screen.getAllByText(/original/i)
    const enhancedLabels = screen.getAllByText(/enhanced/i)
    expect(originalLabels.length).toBeGreaterThan(0)
    expect(enhancedLabels.length).toBeGreaterThan(0)
    expect(screen.getByText(/test enhanced prompt/i)).toBeInTheDocument()
  })

  it('collapses when clicked again', () => {
    render(<HistoryItem entry={mockEntry} />)

    const item = screen.getByRole('button', { name: /history entry/i })

    // Expand
    fireEvent.click(item)
    expect(item).toHaveAttribute('aria-expanded', 'true')

    // Collapse
    fireEvent.click(item)

    // Check aria-expanded is false
    expect(item).toHaveAttribute('aria-expanded', 'false')
  })

  it('displays timestamp in formatted date', () => {
    render(<HistoryItem entry={mockEntry} />)

    // Check that some form of date is displayed
    expect(screen.getByText(/jan/i)).toBeInTheDocument()
  })

  it('displays target category', () => {
    render(<HistoryItem entry={mockEntry} />)

    expect(screen.getByText(/chatgpt/i)).toBeInTheDocument()
  })

  it('renders delete button when onDelete prop is provided', () => {
    const handleDelete = jest.fn()
    render(<HistoryItem entry={mockEntry} onDelete={handleDelete} />)

    const deleteButton = screen.getByRole('button', {
      name: /delete this history entry/i,
    })
    expect(deleteButton).toBeInTheDocument()
  })

  it('does not render delete button when onDelete prop is not provided', () => {
    render(<HistoryItem entry={mockEntry} />)

    const deleteButton = screen.queryByRole('button', {
      name: /delete this history entry/i,
    })
    expect(deleteButton).not.toBeInTheDocument()
  })

  it('calls onDelete with entry id when delete button is clicked', () => {
    const handleDelete = jest.fn()
    render(<HistoryItem entry={mockEntry} onDelete={handleDelete} />)

    const deleteButton = screen.getByRole('button', {
      name: /delete this history entry/i,
    })
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledTimes(1)
    expect(handleDelete).toHaveBeenCalledWith('test-id-123')
  })

  it('does not expand when delete button is clicked', () => {
    const handleDelete = jest.fn()
    const { container } = render(<HistoryItem entry={mockEntry} onDelete={handleDelete} />)

    const deleteButton = screen.getByRole('button', {
      name: /delete this history entry/i,
    })
    fireEvent.click(deleteButton)

    // Should remain collapsed - check aria-expanded on the article element
    const article = container.querySelector('article')
    expect(article).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports keyboard navigation with Enter key', () => {
    render(<HistoryItem entry={mockEntry} />)

    const item = screen.getByRole('button', { name: /history entry/i })
    fireEvent.keyDown(item, { key: 'Enter' })

    // Should expand
    expect(item).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports keyboard navigation with Space key', () => {
    render(<HistoryItem entry={mockEntry} />)

    const item = screen.getByRole('button', { name: /history entry/i })
    fireEvent.keyDown(item, { key: ' ' })

    // Should expand
    expect(item).toHaveAttribute('aria-expanded', 'true')
  })

  it('sets correct aria-expanded attribute', () => {
    render(<HistoryItem entry={mockEntry} />)

    const item = screen.getByRole('button', { name: /history entry/i })

    // Initially collapsed
    expect(item).toHaveAttribute('aria-expanded', 'false')

    // Expand
    fireEvent.click(item)
    expect(item).toHaveAttribute('aria-expanded', 'true')
  })

  it('applies correct styling classes', () => {
    const { container } = render(<HistoryItem entry={mockEntry} />)
    const article = container.querySelector('article')

    expect(article).toHaveClass('flex')
    expect(article).toHaveClass('flex-col')
    expect(article).toHaveClass('border')
    expect(article).toHaveClass('rounded-2xl')
    expect(article).toHaveClass('cursor-pointer')
  })

  it('uses semantic HTML elements', () => {
    const { container } = render(<HistoryItem entry={mockEntry} />)

    // Should use article for the main container
    expect(container.querySelector('article')).toBeInTheDocument()

    // Should use header for the top section
    expect(container.querySelector('header')).toBeInTheDocument()

    // Should use time element for timestamp
    const timeElement = container.querySelector('time')
    expect(timeElement).toBeInTheDocument()
    expect(timeElement).toHaveAttribute('datetime')
  })

  it('uses HistoryLabel components when expanded', () => {
    render(<HistoryItem entry={mockEntry} />)

    const item = screen.getByRole('button', { name: /history entry/i })
    fireEvent.click(item)

    // Should show labels with borders when expanded
    const originalLabels = screen.getAllByText(/original/i)
    const enhancedLabels = screen.getAllByText(/enhanced/i)
    expect(originalLabels.length).toBeGreaterThan(0)
    expect(enhancedLabels.length).toBeGreaterThan(0)
  })
})
