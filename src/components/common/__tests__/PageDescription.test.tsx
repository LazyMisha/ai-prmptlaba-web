import { render, screen } from '@testing-library/react'
import { PageDescription } from '../PageDescription'

describe('PageDescription', () => {
  describe('Rendering', () => {
    it('renders text content correctly', () => {
      render(
        <PageDescription id="test-desc">Test description text</PageDescription>,
      )
      expect(screen.getByText(/test description text/i)).toBeInTheDocument()
    })

    it('renders as paragraph semantic element', () => {
      const { container } = render(
        <PageDescription id="test-desc">Description</PageDescription>,
      )
      expect(container.querySelector('p')).toBeInTheDocument()
    })

    it('renders complex children', () => {
      render(
        <PageDescription id="test-desc">
          Test <strong data-testid="bold">bold</strong> description
        </PageDescription>,
      )

      expect(screen.getByText(/test/i)).toBeInTheDocument()
      expect(screen.getByTestId('bold')).toHaveTextContent('bold')
    })

    it('supports multiline text', () => {
      const longText =
        'This is a long description that spans multiple lines in the UI.'
      render(<PageDescription id="test-desc">{longText}</PageDescription>)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies default typography classes', () => {
      const { container } = render(
        <PageDescription id="test-desc">Description</PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('font-normal')
      expect(paragraph).toHaveClass('text-[#86868b]')
      expect(paragraph).toHaveClass('tracking-tight')
      expect(paragraph).toHaveClass('text-lg')
      expect(paragraph).toHaveClass('sm:text-xl')
    })

    it('applies max-width constraint for readability', () => {
      const { container } = render(
        <PageDescription id="test-desc">Description</PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('max-w-2xl')
    })

    it('applies responsive text sizing', () => {
      const { container } = render(
        <PageDescription id="test-desc">Description</PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('text-lg')
      expect(paragraph).toHaveClass('sm:text-xl')
      expect(paragraph).toHaveClass('md:text-2xl')
    })

    it('applies additional className when provided', () => {
      const { container } = render(
        <PageDescription id="test-desc" className="custom-class">
          Description
        </PageDescription>,
      )
      const paragraph = container.querySelector('p')

      expect(paragraph).toHaveClass('custom-class')
      expect(paragraph).toHaveClass('font-normal') // Still has default classes
      expect(paragraph).toHaveClass('text-[#86868b]')
    })

    it('allows overriding default classes with className', () => {
      const { container } = render(
        <PageDescription id="test-desc" className="text-red-500">
          Description
        </PageDescription>,
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

    it('can be referenced by aria-describedby from another element', () => {
      const { container } = render(
        <>
          <input aria-describedby="field-description" />
          <PageDescription id="field-description">
            Help text for the field
          </PageDescription>
        </>,
      )
      const paragraph = container.querySelector('p')
      expect(paragraph).toHaveAttribute('id', 'field-description')

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'field-description')
      expect(screen.getByText(/help text for the field/i)).toHaveAttribute(
        'id',
        'field-description',
      )
    })
  })
})
