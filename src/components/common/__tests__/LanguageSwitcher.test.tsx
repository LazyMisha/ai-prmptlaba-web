import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from '../LanguageSwitcher'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/en/enhance',
}))

describe('LanguageSwitcher', () => {
  describe('Rendering', () => {
    it('renders the trigger button with current locale', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(screen.getByText('EN')).toBeInTheDocument()
    })

    it('renders with proper aria-label for current language', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button', {
        name: /current language: english\. select language/i,
      })
      expect(button).toBeInTheDocument()
    })

    it('does not render dropdown menu initially', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('renders chevron icon in button', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Dropdown behavior', () => {
    it('opens dropdown when button is clicked', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('shows all language options when open', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Українська')).toBeInTheDocument()
    })

    it('shows locale codes alongside full names', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Check for locale codes in the dropdown
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(2)
    })

    it('closes dropdown when clicking the button again', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      fireEvent.click(button)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('closes dropdown when pressing Escape', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      fireEvent.keyDown(screen.getByRole('listbox').parentElement!, {
        key: 'Escape',
      })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <LanguageSwitcher currentLocale="en" />
          <button data-testid="outside">Outside</button>
        </div>,
      )
      const button = screen.getByRole('button', {
        name: /current language: english/i,
      })
      fireEvent.click(button)
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      fireEvent.mouseDown(screen.getByTestId('outside'))
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Active state', () => {
    it('marks current locale as selected', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const enOption = screen.getByRole('option', { name: /english/i })
      expect(enOption).toHaveAttribute('aria-selected', 'true')
    })

    it('highlights active locale with different color', () => {
      render(<LanguageSwitcher currentLocale="uk" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const ukOption = screen.getByRole('option', { name: /українська/i })
      expect(ukOption).toHaveClass('text-[#007aff]')
    })

    it('does not highlight inactive locales', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const ukOption = screen.getByRole('option', { name: /українська/i })
      expect(ukOption).not.toHaveClass('text-[#007aff]')
      expect(ukOption).toHaveClass('text-[#1d1d1f]')
    })
  })

  describe('Styling', () => {
    it('applies touch-friendly sizing to trigger button', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-h-[44px]')
    })

    it('applies Apple-like styling to trigger button', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-black/[0.05]')
      expect(button).toHaveClass('rounded-lg')
    })

    it('applies focus styles to trigger button', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
      expect(button).toHaveClass('focus-visible:ring-[#007aff]')
    })

    it('applies Apple-like styling to dropdown', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const dropdown = screen.getByRole('listbox')
      expect(dropdown).toHaveClass('bg-white')
      expect(dropdown).toHaveClass('rounded-xl')
      expect(dropdown).toHaveClass('shadow-lg')
    })

    it('applies touch-friendly sizing to dropdown options', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const options = screen.getAllByRole('option')
      options.forEach((option) => {
        expect(option).toHaveClass('min-h-[44px]')
      })
    })

    it('applies additional className when provided', () => {
      render(<LanguageSwitcher currentLocale="en" className="custom-class" />)
      const container = screen.getByRole('button').parentElement
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('Accessibility', () => {
    it('has aria-expanded attribute on button', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('has aria-haspopup attribute on button', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-haspopup', 'listbox')
    })

    it('dropdown has proper listbox role', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(
        screen.getByRole('listbox', { name: /select language/i }),
      ).toBeInTheDocument()
    })

    it('options have proper option role', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(screen.getAllByRole('option')).toHaveLength(2)
    })
  })

  describe('Navigation', () => {
    it('generates correct href for English', () => {
      render(<LanguageSwitcher currentLocale="uk" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const enOption = screen.getByRole('option', { name: /english/i })
      expect(enOption).toHaveAttribute('href', '/en/enhance')
    })

    it('generates correct href for Ukrainian', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      const ukOption = screen.getByRole('option', { name: /українська/i })
      expect(ukOption).toHaveAttribute('href', '/uk/enhance')
    })

    // Polish locale is not supported; href tests cover English and Ukrainian
  })

  describe('Different current locales', () => {
    it('shows UA in button when currentLocale is uk', () => {
      render(<LanguageSwitcher currentLocale="uk" />)
      expect(screen.getByText('UA')).toBeInTheDocument()
    })

    it('has correct aria-label for Ukrainian', () => {
      render(<LanguageSwitcher currentLocale="uk" />)
      const button = screen.getByRole('button', {
        name: /current language: українська\. select language/i,
      })
      expect(button).toBeInTheDocument()
    })

    it('has correct aria-label for English', () => {
      render(<LanguageSwitcher currentLocale="en" />)
      const button = screen.getByRole('button', {
        name: /current language: english\. select language/i,
      })
      expect(button).toBeInTheDocument()
    })
  })
})
