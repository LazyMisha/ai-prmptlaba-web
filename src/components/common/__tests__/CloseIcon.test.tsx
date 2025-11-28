import { render } from '@testing-library/react'
import CloseIcon from '../CloseIcon'

describe('CloseIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<CloseIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<CloseIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(<CloseIcon className="text-red-500 w-6 h-6" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('text-red-500')
    expect(svg).toHaveClass('w-6')
    expect(svg).toHaveClass('h-6')
  })

  it('has default size classes', () => {
    const { container } = render(<CloseIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-4')
    expect(svg).toHaveClass('h-4')
  })
})
