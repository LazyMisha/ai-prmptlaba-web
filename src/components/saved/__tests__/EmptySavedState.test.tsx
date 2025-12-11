import { render, screen } from '@testing-library/react'

import { EmptySavedState } from '../EmptySavedState'

describe('EmptySavedState', () => {
  describe('Rendering', () => {
    it('renders the empty state message', () => {
      render(<EmptySavedState />)

      expect(
        screen.getByRole('heading', { name: /no saved prompts yet/i }),
      ).toBeInTheDocument()
    })

    it('renders the description text', () => {
      render(<EmptySavedState />)

      expect(
        screen.getByText(
          /save your enhanced prompts to organize them into collections/i,
        ),
      ).toBeInTheDocument()
    })

    it('renders a CTA link to the enhance page', () => {
      render(<EmptySavedState />)

      const link = screen.getByRole('link', { name: /start enhancing/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/enhance')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<EmptySavedState />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })

    it('hides the decorative icon from screen readers', () => {
      const { container } = render(<EmptySavedState />)

      const iconWrapper = container.querySelector('[aria-hidden="true"]')
      expect(iconWrapper).toBeInTheDocument()
    })

    it('has accessible link with proper focus styling', () => {
      render(<EmptySavedState />)

      const link = screen.getByRole('link', { name: /start enhancing/i })
      expect(link).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('Styling', () => {
    it('centers content with flexbox', () => {
      const { container } = render(<EmptySavedState />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
      )
    })

    it('applies Apple design tokens to the button', () => {
      render(<EmptySavedState />)

      const link = screen.getByRole('link', { name: /start enhancing/i })
      expect(link).toHaveClass('bg-[#007aff]', 'text-white', 'rounded-xl')
    })

    it('has minimum touch target size for the CTA', () => {
      render(<EmptySavedState />)

      const link = screen.getByRole('link', { name: /start enhancing/i })
      expect(link).toHaveClass('min-h-[50px]')
    })
  })
})
