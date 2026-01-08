import { render, screen, fireEvent } from '@testing-library/react'
import NavLink from '../NavLink'

describe('NavLink', () => {
  it('renders with children text', () => {
    render(
      <NavLink href="/test" ariaLabel="Go to test page">
        Test Link
      </NavLink>,
    )
    const link = screen.getByRole('link', { name: /go to test page/i })
    expect(link).toBeInTheDocument()
  })

  it('renders with correct href', () => {
    render(
      <NavLink href="/enhance" ariaLabel="Go to enhance page">
        Enhance Prompt
      </NavLink>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/enhance')
  })

  it('applies aria-label when provided', () => {
    render(
      <NavLink href="/test" ariaLabel="Go to test page">
        Test
      </NavLink>,
    )
    const link = screen.getByRole('link', { name: /go to test page/i })
    expect(link).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <NavLink
        href="/test"
        ariaLabel="Go to test page"
        className="custom-class"
      >
        Test
      </NavLink>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('applies default styling classes', () => {
    render(
      <NavLink href="/test" ariaLabel="Go to test page">
        Test
      </NavLink>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('text-sm')
    expect(link).toHaveClass('font-normal')
    expect(link).toHaveClass('text-[#1d1d1f]')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(
      <NavLink href="/test" ariaLabel="Go to test page" onClick={handleClick}>
        Test
      </NavLink>,
    )
    const link = screen.getByRole('link')
    fireEvent.click(link)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies role when provided', () => {
    render(
      <NavLink href="/test" ariaLabel="Go to test page" role="menuitem">
        Test
      </NavLink>,
    )
    const link = screen.getByRole('menuitem')
    expect(link).toBeInTheDocument()
  })

  it('combines custom className with default classes', () => {
    render(
      <NavLink href="/test" ariaLabel="Go to test page" className="block px-4">
        Test
      </NavLink>,
    )
    const link = screen.getByRole('link')
    // Should have both custom and default classes
    expect(link).toHaveClass('block')
    expect(link).toHaveClass('px-4')
    expect(link).toHaveClass('text-sm')
    expect(link).toHaveClass('font-normal')
  })
})
