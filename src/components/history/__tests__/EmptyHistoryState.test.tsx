import { render, screen } from '@testing-library/react'
import EmptyHistoryState from '../EmptyHistoryState'

describe('EmptyHistoryState', () => {
  it('renders empty state message', () => {
    render(<EmptyHistoryState />)

    expect(screen.getByText(/no history yet/i)).toBeInTheDocument()
    expect(
      screen.getByText(/enhanced prompts will appear here/i),
    ).toBeInTheDocument()
  })

  it('renders with correct styling', () => {
    const { container } = render(<EmptyHistoryState />)
    const emptyStateDiv = container.firstChild as HTMLElement

    expect(emptyStateDiv).toHaveClass('flex')
    expect(emptyStateDiv).toHaveClass('flex-col')
    expect(emptyStateDiv).toHaveClass('border-dashed')
  })
})
