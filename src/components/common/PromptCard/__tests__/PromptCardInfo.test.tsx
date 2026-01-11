import { render, screen } from '@testing-library/react'
import PromptCardInfo from '../PromptCardInfo'

describe('PromptCardInfo', () => {
  const mockTimestamp = 1704067200000 // Jan 1, 2024 00:00:00 UTC
  const mockTarget = 'ChatGPT'

  it('renders formatted date', () => {
    render(<PromptCardInfo timestamp={mockTimestamp} target={mockTarget} />)

    const timeElement = screen.getByRole('time')
    expect(timeElement).toBeInTheDocument()
  })

  it('renders target label', () => {
    render(<PromptCardInfo timestamp={mockTimestamp} target={mockTarget} />)

    expect(screen.getByText('ChatGPT')).toBeInTheDocument()
  })

  it('time element has correct datetime attribute', () => {
    render(<PromptCardInfo timestamp={mockTimestamp} target={mockTarget} />)

    const timeElement = screen.getByRole('time')
    const date = new Date(mockTimestamp)
    expect(timeElement).toHaveAttribute('datetime', date.toISOString())
  })

  it('formats date correctly', () => {
    render(<PromptCardInfo timestamp={mockTimestamp} target={mockTarget} />)

    const timeElement = screen.getByRole('time')
    // Format: "Jan 1" (month and day)
    expect(timeElement.textContent).toMatch(/^[A-Z][a-z]{2}\s\d{1,2}$/)
  })

  it('renders different target values', () => {
    const targets = ['ChatGPT', 'Claude', 'Gemini', 'General']

    targets.forEach((target) => {
      const { unmount } = render(
        <PromptCardInfo timestamp={mockTimestamp} target={target} />,
      )
      expect(screen.getByText(target)).toBeInTheDocument()
      unmount()
    })
  })

  it('handles different timestamps correctly', () => {
    const timestamps = [
      1704067200000, // Jan 1, 2024
      1735689600000, // Jan 1, 2025
      1672531200000, // Jan 1, 2023
    ]

    timestamps.forEach((timestamp) => {
      const { unmount } = render(
        <PromptCardInfo timestamp={timestamp} target="ChatGPT" />,
      )
      const timeElement = screen.getByRole('time')
      const date = new Date(timestamp)
      expect(timeElement).toHaveAttribute('datetime', date.toISOString())
      unmount()
    })
  })

  it('renders target with pill styling', () => {
    render(<PromptCardInfo timestamp={mockTimestamp} target={mockTarget} />)

    const targetElement = screen.getByText('ChatGPT')
    expect(targetElement.tagName).toBe('SPAN')
    expect(targetElement).toHaveClass('rounded-full')
  })

  it('renders both elements as siblings', () => {
    render(<PromptCardInfo timestamp={mockTimestamp} target={mockTarget} />)

    const timeElement = screen.getByRole('time')
    const targetElement = screen.getByText('ChatGPT')
    expect(timeElement).toBeInTheDocument()
    expect(targetElement).toBeInTheDocument()
  })
})
