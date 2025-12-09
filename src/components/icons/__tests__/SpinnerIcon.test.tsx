import { render } from '@testing-library/react'
import SpinnerIcon from '../SpinnerIcon'

describe('SpinnerIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<SpinnerIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<SpinnerIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(<SpinnerIcon className="text-white w-6 h-6" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('text-white')
    expect(svg).toHaveClass('w-6')
    expect(svg).toHaveClass('h-6')
  })

  it('has default size classes', () => {
    const { container } = render(<SpinnerIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-4')
    expect(svg).toHaveClass('h-4')
  })

  it('has animate-spin class for rotation animation', () => {
    const { container } = render(<SpinnerIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })

  it('contains circle and path elements for spinner design', () => {
    const { container } = render(<SpinnerIcon />)
    const circle = container.querySelector('circle')
    const path = container.querySelector('path')
    expect(circle).toBeInTheDocument()
    expect(path).toBeInTheDocument()
  })
})
