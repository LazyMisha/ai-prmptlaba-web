import { render, screen, fireEvent } from '@testing-library/react'
import type { Locale } from '@/i18n/locales'
import MobileMenu from '../MobileMenu'

describe('MobileMenu', () => {
  // Remove existence-only menu button test; covered by behavior tests

  it('opens menu when button is clicked', () => {
    render(<MobileMenu locale="en" />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Menu should not be visible initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Click to open menu
    fireEvent.click(menuButton)

    // Menu should now be visible
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('closes menu when menu item is clicked', () => {
    render(<MobileMenu locale="en" />)
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
    render(<MobileMenu locale="en" />)
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
    render(<MobileMenu locale="en" />)
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
    render(<MobileMenu locale="en" />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Initial state
    expect(menuButton).toHaveAttribute('aria-label', 'Open Menu')

    // Open menu
    fireEvent.click(menuButton)
    expect(
      screen.getByRole('button', { name: /close menu/i }),
    ).toBeInTheDocument()

    // Close menu
    fireEvent.click(menuButton)
    expect(
      screen.getByRole('button', { name: /open menu/i }),
    ).toBeInTheDocument()
  })

  it('sets correct aria-expanded attribute on menu button', () => {
    render(<MobileMenu locale="en" />)
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

  const locales: Locale[] = ['en', 'uk']
  it.each(locales.map((l) => [l]))(
    'renders all menu items with correct hrefs for locale %s',
    (locale: Locale) => {
      render(<MobileMenu locale={locale} />)
      const menuButton = screen.getByRole('button', { name: /open menu/i })

      // Open menu
      fireEvent.click(menuButton)

      const enhanceLink = screen.getByRole('menuitem', {
        name: /go to prompt enhancer/i,
      })
      expect(enhanceLink).toHaveAttribute('href', `/${locale}/enhance`)

      const savedLink = screen.getByRole('menuitem', {
        name: /go to my collections/i,
      })
      expect(savedLink).toHaveAttribute('href', `/${locale}/saved`)

      const historyLink = screen.getByRole('menuitem', {
        name: /go to prompt history/i,
      })
      expect(historyLink).toHaveAttribute('href', `/${locale}/history`)
    },
  )

  // Locale-specific coverage consolidated in parameterized test above
})
