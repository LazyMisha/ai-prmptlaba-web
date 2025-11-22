import { render, screen } from '@testing-library/react'
import { PageContainer } from '../PageContainer'

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <h1>Test Heading</h1>
        <p>Test content</p>
      </PageContainer>,
    )

    expect(screen.getByRole('heading', { name: /test heading/i })).toBeInTheDocument()
    expect(screen.getByText(/test content/i)).toBeInTheDocument()
  })

  it('applies default layout classes', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>,
    )

    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('max-w-3xl')
    expect(containerDiv).toHaveClass('mx-auto')
    expect(containerDiv).toHaveClass('text-center')
    expect(containerDiv).toHaveClass('space-y-6')
    expect(containerDiv).toHaveClass('p-4')
  })

  it('applies additional className when provided', () => {
    const { container } = render(
      <PageContainer className="custom-class">
        <div>Content</div>
      </PageContainer>,
    )

    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('custom-class')
    expect(containerDiv).toHaveClass('max-w-3xl') // Still has default classes
  })

  it('renders multiple children', () => {
    render(
      <PageContainer>
        <div data-testid="child1">First</div>
        <div data-testid="child2">Second</div>
        <div data-testid="child3">Third</div>
      </PageContainer>,
    )

    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
    expect(screen.getByTestId('child3')).toBeInTheDocument()
  })
})
