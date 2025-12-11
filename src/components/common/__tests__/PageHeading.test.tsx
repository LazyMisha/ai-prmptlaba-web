import { render, screen } from '@testing-library/react'
import { PageHeading } from '../PageHeading'

describe('PageHeading', () => {
  describe('Rendering', () => {
    it('renders text content correctly', () => {
      render(<PageHeading>Test Heading</PageHeading>)
      expect(
        screen.getByRole('heading', { level: 1, name: /test heading/i }),
      ).toBeInTheDocument()
    })

    it('renders as h1 semantic element', () => {
      const { container } = render(<PageHeading>Heading</PageHeading>)
      expect(container.querySelector('h1')).toBeInTheDocument()
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
  })

  describe('Styling', () => {
    it('applies default typography classes', () => {
      render(<PageHeading>Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).toHaveClass('font-semibold')
      expect(heading).toHaveClass('tracking-tight')
      expect(heading).toHaveClass('text-[#1d1d1f]')
      expect(heading).toHaveClass('antialiased')
    })

    it('applies responsive text sizing classes', () => {
      render(<PageHeading>Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).toHaveClass('text-4xl')
      expect(heading).toHaveClass('sm:text-5xl')
      expect(heading).toHaveClass('md:text-6xl')
      expect(heading).toHaveClass('lg:text-7xl')
    })

    it('applies text balance for headings', () => {
      render(<PageHeading>Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).toHaveClass('text-balance')
    })

    it('applies additional className when provided', () => {
      render(<PageHeading className="custom-class">Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).toHaveClass('custom-class')
      expect(heading).toHaveClass('font-semibold') // Still has default classes
    })

    it('allows overriding default classes with className', () => {
      render(<PageHeading className="text-red-500">Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).toHaveClass('text-red-500')
    })
  })

  describe('Accessibility', () => {
    it('renders id attribute when provided', () => {
      render(<PageHeading id="main-heading">Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).toHaveAttribute('id', 'main-heading')
    })

    it('does not render id attribute when not provided', () => {
      render(<PageHeading>Heading</PageHeading>)
      const heading = screen.getByRole('heading', { level: 1 })

      expect(heading).not.toHaveAttribute('id')
    })

    it('can be used as anchor link target', () => {
      render(
        <>
          <a href="#features">Go to Features</a>
          <PageHeading id="features">Features</PageHeading>
        </>,
      )

      const link = screen.getByRole('link', { name: /go to features/i })
      expect(link).toHaveAttribute('href', '#features')
      expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
        'id',
        'features',
      )
    })

    it('can be referenced by aria-labelledby', () => {
      render(
        <>
          <PageHeading id="section-title">Section Title</PageHeading>
          <section aria-labelledby="section-title">
            <p>Section content</p>
          </section>
        </>,
      )

      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'section-title')
    })
  })
})
