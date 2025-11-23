import { render, screen } from '@testing-library/react'
import { PageHeading } from '../PageHeading'

describe('PageHeading', () => {
  it('renders text content correctly', () => {
    render(<PageHeading>Test Heading</PageHeading>)
    expect(screen.getByRole('heading', { level: 1, name: /test heading/i })).toBeInTheDocument()
  })

  it('applies default typography classes', () => {
    render(<PageHeading>Heading</PageHeading>)
    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toHaveClass('text-5xl')
    expect(heading).toHaveClass('font-light')
    expect(heading).toHaveClass('tracking-tight')
    expect(heading).toHaveClass('text-gray-600')
  })

  it('applies additional className when provided', () => {
    render(<PageHeading className="custom-class">Heading</PageHeading>)
    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toHaveClass('custom-class')
    expect(heading).toHaveClass('text-5xl') // Still has default classes
  })

  it('renders complex children', () => {
    render(
      <PageHeading>
        Test <span data-testid="highlight">Highlighted</span> Heading
      </PageHeading>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByTestId('highlight')).toHaveTextContent('Highlighted')
  })

  it('renders as h1 semantic element', () => {
    const { container } = render(<PageHeading>Heading</PageHeading>)
    expect(container.querySelector('h1')).toBeInTheDocument()
  })
})
