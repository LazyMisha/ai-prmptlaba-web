import { render, screen } from '@testing-library/react'
import type { Locale } from '@/i18n/locales'
import Header from '../Header'

// Mock getDictionary for async Server Component testing
jest.mock('@/i18n/dictionaries', () => ({
  getDictionary: jest.fn().mockResolvedValue({
    common: {
      navigation: {
        enhance: 'Enhance',
        saved: 'Saved',
        history: 'History',
        goToHome: 'Go to home page',
        goToEnhance: 'Go to prompt enhancer page',
        goToSaved: 'Go to saved prompts page',
        goToHistory: 'Go to prompt history page',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      },
    },
  }),
}))

/**
 * Helper to render async Server Components in tests.
 * Awaits the component promise and renders the result.
 */
async function renderAsync(
  component: Promise<React.ReactElement> | React.ReactElement,
) {
  const resolvedComponent = await Promise.resolve(component)
  return render(resolvedComponent)
}

describe('Header', () => {
  describe('Default mode (home page)', () => {
    // Existence-only tests removed; covered implicitly by link queries

    it('renders app name link with text', async () => {
      await renderAsync(<Header locale="en" />)
      const appNameLink = screen.getByRole('link', { name: /go to home/i })
      expect(appNameLink).toBeInTheDocument()
      expect(appNameLink).toHaveAttribute('href', '/en')
      expect(appNameLink).toHaveTextContent('AI Prompt Laba')
    })

    it('does not render logo when showLogo is false', async () => {
      await renderAsync(<Header locale="en" />)
      const logo = screen.queryByRole('img', { name: /ai prompt laba/i })
      expect(logo).not.toBeInTheDocument()
    })

    it('does not render page title when not provided', async () => {
      await renderAsync(<Header locale="en" />)
      const heading = screen.queryByRole('heading', { level: 1 })
      expect(heading).not.toBeInTheDocument()
    })

    it('renders desktop navigation with Enhance Prompt link', async () => {
      await renderAsync(<Header locale="en" />)
      const enhanceLinks = screen.getAllByRole('link', {
        name: /go to prompt enhancer/i,
      })
      // Should have at least one link (desktop nav)
      expect(enhanceLinks.length).toBeGreaterThan(0)
      // Desktop link should have locale-prefixed href
      expect(enhanceLinks[0]).toHaveAttribute('href', '/en/enhance')
    })

    it('renders desktop navigation with Recent Prompts link', async () => {
      await renderAsync(<Header locale="en" />)
      const historyLinks = screen.getAllByRole('link', {
        name: /go to prompt history/i,
      })
      // Should have at least one link (desktop nav)
      expect(historyLinks.length).toBeGreaterThan(0)
      // Desktop link should have locale-prefixed href
      expect(historyLinks[0]).toHaveAttribute('href', '/en/history')
    })

    it('renders mobile menu button', async () => {
      await renderAsync(<Header locale="en" />)
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Inner page mode (with logo and title)', () => {
    it('renders logo when showLogo is true', async () => {
      await renderAsync(<Header showLogo locale="en" />)
      const logo = screen.getByRole('img', { name: /ai prompt laba/i })
      expect(logo).toBeInTheDocument()
    })

    it('renders logo link to home page', async () => {
      await renderAsync(<Header showLogo locale="en" />)
      const logoLink = screen.getByRole('link', { name: /go to home/i })
      expect(logoLink).toHaveAttribute('href', '/en')
    })

    it('does not render text brand name when showLogo is true', async () => {
      await renderAsync(<Header showLogo locale="en" />)
      expect(screen.queryByText('AI Prompt Laba')).not.toBeInTheDocument()
    })

    it('still renders navigation when showLogo is true', async () => {
      await renderAsync(<Header showLogo locale="en" />)
      const enhanceLinks = screen.getAllByRole('link', {
        name: /go to prompt enhancer/i,
      })
      expect(enhanceLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Locale support', () => {
    const locales: Locale[] = ['en', 'uk']
    it.each(locales.map((l) => [l]))(
      'renders locale-prefixed links (%s)',
      async (locale: Locale) => {
        await renderAsync(<Header locale={locale} />)

        const appNameLink = screen.getByRole('link', { name: /go to home/i })
        expect(appNameLink).toHaveAttribute('href', `/${locale}`)

        const enhanceLinks = screen.getAllByRole('link', {
          name: /go to prompt enhancer/i,
        })
        expect(enhanceLinks[0]).toHaveAttribute('href', `/${locale}/enhance`)

        const historyLinks = screen.getAllByRole('link', {
          name: /go to prompt history/i,
        })
        expect(historyLinks[0]).toHaveAttribute('href', `/${locale}/history`)
      },
    )
  })
})
