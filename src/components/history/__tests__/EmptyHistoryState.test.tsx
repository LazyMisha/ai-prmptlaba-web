import { render, screen } from '@testing-library/react'
import EmptyHistoryState from '../EmptyHistoryState'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ lang: 'en' }),
}))

describe('EmptyHistoryState', () => {
  it('renders empty state message', () => {
    render(<EmptyHistoryState />)

    expect(screen.getByText(/no history yet/i)).toBeInTheDocument()
    expect(
      screen.getByText(/enhanced prompts will appear here/i),
    ).toBeInTheDocument()
  })

  it('renders ClockIcon', () => {
    const { container } = render(<EmptyHistoryState />)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('renders with heading hierarchy', () => {
    render(<EmptyHistoryState />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it('renders CTA button', () => {
    render(<EmptyHistoryState />)
    const ctaLink = screen.getByRole('link', { name: /start enhancing/i })
    expect(ctaLink).toBeInTheDocument()
    expect(ctaLink).toHaveAttribute('href', '/en/enhance')
  })
})
