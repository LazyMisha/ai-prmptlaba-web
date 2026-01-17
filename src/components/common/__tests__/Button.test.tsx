import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)

    expect(
      screen.getByRole('button', { name: /click me/i }),
    ).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🔵</span>
    render(<Button icon={icon}>With Icon</Button>)

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('supports type attribute', () => {
    render(<Button type="submit">Submit</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('supports aria-label', () => {
    render(<Button ariaLabel="Custom label">Click</Button>)

    expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
  })

  it('defaults to type button', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('renders as Link when href is provided', () => {
    render(<Button href="/test">Go to page</Button>)

    const link = screen.getByRole('link', { name: /go to page/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('renders Link with icon', () => {
    const icon = <span data-testid="icon">🔵</span>
    render(
      <Button href="/test" icon={icon}>
        Go to page
      </Button>,
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('applies disabled styles to Link', () => {
    render(
      <Button href="/test" disabled>
        Disabled Link
      </Button>,
    )

    const link = screen.getByRole('link')
    expect(link).toHaveClass('pointer-events-none')
    expect(link).toHaveClass('opacity-50')
  })
})
