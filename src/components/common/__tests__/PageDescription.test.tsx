import { render, screen } from '@testing-library/react'
import { PageDescription } from '../PageDescription'

describe('PageDescription', () => {
  describe('Rendering', () => {
    it('renders text content correctly', () => {
      render(<PageDescription>Test description text</PageDescription>)
      expect(screen.getByText(/test description text/i)).toBeInTheDocument()
    })

    it('renders as paragraph semantic element', () => {
      const { container } = render(<PageDescription>Description</PageDescription>)
      expect(container.querySelector('p')).toBeInTheDocument()
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

    it('supports multiline text', () => {
      const longText = 'This is a long description that spans multiple lines in the UI.'
      render(<PageDescription>{longText}</PageDescription>)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies default typography classes', () => {
      const { container } = render(<PageDescription>Description</PageDescription>)
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('font-light')
      expect(paragraph).toHaveClass('text-gray-600')
      expect(paragraph).toHaveClass('tracking-normal')
      expect(paragraph).toHaveClass('text-base')
      expect(paragraph).toHaveClass('sm:text-lg')
    })

    it('applies max-width constraint for readability', () => {
      const { container } = render(<PageDescription>Description</PageDescription>)
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('max-w-2xl')
    })

    it('applies responsive text sizing', () => {
      const { container } = render(<PageDescription>Description</PageDescription>)
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('text-base')
      expect(paragraph).toHaveClass('sm:text-lg')
    })

    it('applies additional className when provided', () => {
      const { container } = render(
        <PageDescription className="custom-class">Description</PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('custom-class')
      expect(paragraph).toHaveClass('font-light') // Still has default classes
      expect(paragraph).toHaveClass('text-gray-600')
    })

    it('allows overriding default classes with className', () => {
      const { container } = render(
        <PageDescription className="text-red-500">Description</PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('text-red-500')
    })
  })

  describe('Accessibility', () => {
    it('renders id attribute when provided', () => {
      const { container } = render(
        <PageDescription id="test-description">Description</PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveAttribute('id', 'test-description')
    })

    it('does not render id attribute when not provided', () => {
      const { container } = render(<PageDescription>Description</PageDescription>)
      const paragraph = container.querySelector('p')

      expect(paragraph).not.toHaveAttribute('id')
    })

    it('can be referenced by aria-describedby from another element', () => {
      render(
        <>
          <input aria-describedby="field-description" />
          <PageDescription id="field-description">Help text for the field</PageDescription>
        </>,
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'field-description')
      expect(screen.getByText(/help text for the field/i)).toHaveAttribute(
        'id',
        'field-description',
      )
    })
  })
})
