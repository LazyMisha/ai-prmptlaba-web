import { render, screen } from '@testing-library/react'
import { PageDescription } from '../PageDescription'

describe('PageDescription', () => {
  it('renders text content correctly', () => {
    render(<PageDescription>Test description text</PageDescription>)
    expect(screen.getByText(/test description text/i)).toBeInTheDocument()
  })

  it('applies default typography class', () => {
    const { container } = render(<PageDescription>Description</PageDescription>)
    const paragraph = container.querySelector('p')

    expect(paragraph).toHaveClass('text-lg')
  })

  it('applies additional className when provided', () => {
    const { container } = render(
      <PageDescription className="text-gray-700">Description</PageDescription>,
    )
    const paragraph = container.querySelector('p')

    expect(paragraph).toHaveClass('text-gray-700')
    expect(paragraph).toHaveClass('text-lg') // Still has default class
  })

  it('renders complex children', () => {
    render(
      <PageDescription>
        Test <strong data-testid="bold">bold</strong> description
      </PageDescription>,
    )

    expect(screen.getByText(/test/i)).toBeInTheDocument()
    expect(screen.getByTestId('bold')).toHaveTextContent('bold')
  })

  it('renders as paragraph semantic element', () => {
    const { container } = render(<PageDescription>Description</PageDescription>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('supports multiline text', () => {
    const longText = 'This is a long description that spans multiple lines in the UI.'
    render(<PageDescription>{longText}</PageDescription>)
    expect(screen.getByText(longText)).toBeInTheDocument()
  })
})
