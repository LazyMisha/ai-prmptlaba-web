import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
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

  it('renders app name link', () => {
    render(<Header />)
    const appNameLink = screen.getByRole('link', { name: /go to home page/i })
    expect(appNameLink).toBeInTheDocument()
    expect(appNameLink).toHaveAttribute('href', '/')
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
