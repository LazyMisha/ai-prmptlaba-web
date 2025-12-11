import { render, screen } from '@testing-library/react'
import { PageLayout } from '../PageLayout'

describe('PageLayout', () => {
  describe('Default mode', () => {
    it('renders Header with default props', () => {
      render(<PageLayout locale="en">Content</PageLayout>)
      // Default mode shows brand name text
      const homeLink = screen.getByRole('link', { name: /go to home page/i })
      expect(homeLink).toHaveTextContent('AI Prompt Laba')
    })

    it('renders Footer', () => {
      render(<PageLayout locale="en">Content</PageLayout>)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('renders main content', () => {
      render(<PageLayout locale="en">Test Content</PageLayout>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders main element with correct styles', () => {
      render(<PageLayout locale="en">Content</PageLayout>)
      const main = screen.getByRole('main')
      expect(main).toHaveClass('w-full')
      expect(main).toHaveClass('flex-grow')
    })
  })

  describe('Inner page mode', () => {
    it('renders logo when showLogo is true', () => {
      render(
        <PageLayout showLogo pageTitle="Test Page" locale="en">
          Content
        </PageLayout>,
      )
      const logo = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(logo).toBeInTheDocument()
    })

    it('renders page title in Header', () => {
      render(
        <PageLayout showLogo pageTitle="Prompt Enhancer" locale="en">
          Content
        </PageLayout>,
      )
      const heading = screen.getByRole('heading', { level: 1, name: /prompt enhancer/i })
      expect(heading).toBeInTheDocument()
    })

    it('does not show brand name text when showLogo is true', () => {
      render(
        <PageLayout showLogo pageTitle="Test" locale="en">
          Content
        </PageLayout>,
      )
      expect(screen.queryByText('AI Prompt Laba')).not.toBeInTheDocument()
    })
  })

  describe('Children rendering', () => {
    it('renders complex children correctly', () => {
      render(
        <PageLayout locale="en">
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </PageLayout>,
      )
      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Locale support', () => {
    it('passes locale to child components', () => {
      render(
        <PageLayout showLogo pageTitle="Test" locale="uk">
          Content
        </PageLayout>,
      )
      // Logo link should have the Ukrainian locale
      const logoLink = screen.getByRole('link', { name: /go to home page/i })
      expect(logoLink).toHaveAttribute('href', '/uk')
    })
  })
})
