import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  const mockIcon = <svg data-testid="mock-icon" />

  it('renders with required props', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="No items found"
        description="Start by adding your first item"
        ctaText="Get started"
        ctaHref="/enhance"
      />,
    )

    expect(
      screen.getByRole('heading', { name: /no items found/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/start by adding your first item/i),
    ).toBeInTheDocument()
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('renders CTA button', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Empty state"
        description="No content available"
        ctaText="Get started"
        ctaHref="/enhance"
      />,
    )

    const ctaLink = screen.getByRole('link', { name: /get started/i })
    expect(ctaLink).toBeInTheDocument()
    expect(ctaLink).toHaveAttribute('href', '/enhance')
  })

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState
        icon={mockIcon}
        title="Empty state"
        description="No content available"
        ctaText="Get started"
        ctaHref="/enhance"
        className="custom-class"
      />,
    )

    const emptyStateDiv = container.firstChild
    expect(emptyStateDiv).toHaveClass('custom-class')
  })

  it('renders icon container with aria-hidden', () => {
    const { container } = render(
      <EmptyState
        icon={mockIcon}
        title="Empty state"
        description="No content available"
        ctaText="Get started"
        ctaHref="/enhance"
      />,
    )

    const iconContainer = container.querySelector('[aria-hidden="true"]')
    expect(iconContainer).toBeInTheDocument()
    expect(iconContainer).toContainElement(screen.getByTestId('mock-icon'))
  })

  it('maintains proper heading hierarchy', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Empty state title"
        description="Description text"
        ctaText="Get started"
        ctaHref="/enhance"
      />,
    )

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Empty state title')
  })
})
