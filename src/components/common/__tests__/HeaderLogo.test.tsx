import { render, screen } from '@testing-library/react'
import { HeaderLogo } from '../HeaderLogo'

describe('HeaderLogo', () => {
  describe('Rendering', () => {
    it('renders a link to home page', () => {
      render(<HeaderLogo />)
      const link = screen.getByRole('link', { name: /go to home page/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/')
    })

    it('renders the logo image', () => {
      render(<HeaderLogo />)
      const image = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(image).toBeInTheDocument()
    })

    it('has correct image source', () => {
      render(<HeaderLogo />)
      const image = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(image).toHaveAttribute('src', expect.stringContaining('logo.webp'))
    })
  })

  describe('Styling', () => {
    it('applies negative margins for full header height and visual alignment', () => {
      render(<HeaderLogo />)
      const link = screen.getByRole('link', { name: /go to home page/i })
      expect(link).toHaveClass('-my-4')
      expect(link).toHaveClass('-ml-3')
    })

    it('applies focus styles to link', () => {
      render(<HeaderLogo />)
      const link = screen.getByRole('link', { name: /go to home page/i })
      expect(link).toHaveClass('focus:outline-none')
      expect(link).toHaveClass('focus-visible:ring-2')
      expect(link).toHaveClass('focus-visible:ring-[#007aff]')
    })

    it('applies hover transition styles', () => {
      render(<HeaderLogo />)
      const link = screen.getByRole('link', { name: /go to home page/i })
      expect(link).toHaveClass('transition-opacity')
      expect(link).toHaveClass('hover:opacity-70')
    })

    it('applies full height and rounded corners to image', () => {
      render(<HeaderLogo />)
      const image = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(image).toHaveClass('h-[72px]')
      expect(image).toHaveClass('w-auto')
      expect(image).toHaveClass('rounded-[22%]')
    })
  })

  describe('Accessibility', () => {
    it('has accessible aria-label on link', () => {
      render(<HeaderLogo />)
      const link = screen.getByRole('link', { name: /go to home page/i })
      expect(link).toHaveAccessibleName('Go to home page')
    })

    it('has alt text on image', () => {
      render(<HeaderLogo />)
      const image = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(image).toHaveAccessibleName('AI Prompt Laba')
    })
  })
})
