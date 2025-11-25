import { render, screen, fireEvent } from '@testing-library/react'
import MobileMenu from '../MobileMenu'

describe('MobileMenu', () => {
  it('renders menu button', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('opens menu when button is clicked', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Menu should not be visible initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Click to open menu
    fireEvent.click(menuButton)

    // Menu should now be visible
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('closes menu when menu item is clicked', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Click first menu item
    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems.length).toBeGreaterThan(0)
    fireEvent.click(menuItems[0]!)

    // Menu should be closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes menu when clicking outside', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Click outside (on document body)
    fireEvent.mouseDown(document.body)

    // Menu should be closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('does not close menu when clicking inside the menu', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()

    // Click inside the menu (but not on a link)
    fireEvent.mouseDown(menu)

    // Menu should still be open
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('toggles menu button aria-label when opened and closed', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Initial state
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu')

    // Open menu
    fireEvent.click(menuButton)
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()

    // Close menu
    fireEvent.click(menuButton)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('sets correct aria-expanded attribute on menu button', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Initial state
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    // Open menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Close menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders Enhance Prompt link in menu', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)

    // Check for link
    const enhanceLink = screen.getByRole('menuitem', {
      name: /go to prompt enhancer page/i,
    })
    expect(enhanceLink).toBeInTheDocument()
    expect(enhanceLink).toHaveAttribute('href', '/enhance')
  })

  it('renders Recent Prompts link in menu', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)

    // Check for link
    const historyLink = screen.getByRole('menuitem', {
      name: /go to prompt history page/i,
    })
    expect(historyLink).toBeInTheDocument()
    expect(historyLink).toHaveAttribute('href', '/history')
  })

  it('renders both menu items when open', () => {
    render(<MobileMenu />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)

    // Check both links are present
    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(2)
  })
})
