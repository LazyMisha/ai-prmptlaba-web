import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  describe('Default mode (home page)', () => {
    it('renders navigation element', () => {
      render(<Header />)
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('renders banner element', () => {
      render(<Header />)
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('renders app name link with text', () => {
      render(<Header />)
      const appNameLink = screen.getByRole('link', { name: /go to home page/i })
      expect(appNameLink).toBeInTheDocument()
      expect(appNameLink).toHaveAttribute('href', '/')
      expect(appNameLink).toHaveTextContent('AI Prompt Laba')
    })

    it('does not render logo when showLogo is false', () => {
      render(<Header />)
      const logo = screen.queryByRole('img', { name: /ai prompt laba/i })
      expect(logo).not.toBeInTheDocument()
    })

    it('does not render page title when not provided', () => {
      render(<Header />)
      const heading = screen.queryByRole('heading', { level: 1 })
      expect(heading).not.toBeInTheDocument()
    })

    it('renders desktop navigation with Enhance Prompt link', () => {
      render(<Header />)
      const enhanceLinks = screen.getAllByRole('link', {
        name: /go to prompt enhancer page/i,
      })
      // Should have at least one link (desktop nav)
      expect(enhanceLinks.length).toBeGreaterThan(0)
      // Desktop link should have href="/enhance"
      expect(enhanceLinks[0]).toHaveAttribute('href', '/enhance')
    })

    it('renders desktop navigation with Recent Prompts link', () => {
      render(<Header />)
      const historyLinks = screen.getAllByRole('link', {
        name: /go to prompt history page/i,
      })
      // Should have at least one link (desktop nav)
      expect(historyLinks.length).toBeGreaterThan(0)
      // Desktop link should have href="/history"
      expect(historyLinks[0]).toHaveAttribute('href', '/history')
    })

    it('renders mobile menu button', () => {
      render(<Header />)
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Inner page mode (with logo and title)', () => {
    it('renders logo when showLogo is true', () => {
      render(<Header showLogo />)
      const logo = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(logo).toBeInTheDocument()
    })

    it('renders logo link to home page', () => {
      render(<Header showLogo />)
      const logoLink = screen.getByRole('link', { name: /go to home page/i })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('does not render text brand name when showLogo is true', () => {
      render(<Header showLogo />)
      expect(screen.queryByText('AI Prompt Laba')).not.toBeInTheDocument()
    })

    it('renders centered page title when provided', () => {
      render(<Header showLogo pageTitle="Prompt Enhancer" />)
      const heading = screen.getByRole('heading', { level: 1, name: /prompt enhancer/i })
      expect(heading).toBeInTheDocument()
    })

    it('renders page title with correct styling for centering', () => {
      render(<Header showLogo pageTitle="Saved Prompts" />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('absolute')
      expect(heading).toHaveClass('left-1/2')
      expect(heading).toHaveClass('-translate-x-1/2')
    })

    it('still renders navigation when showLogo is true', () => {
      render(<Header showLogo pageTitle="Recent Prompts" />)
      const enhanceLinks = screen.getAllByRole('link', {
        name: /go to prompt enhancer page/i,
      })
      expect(enhanceLinks.length).toBeGreaterThan(0)
    })
  })
})
