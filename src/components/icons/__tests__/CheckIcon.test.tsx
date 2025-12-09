import { render } from '@testing-library/react'
import CheckIcon from '../CheckIcon'

describe('CheckIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<CheckIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<CheckIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(<CheckIcon className="text-green-500 w-6 h-6" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('text-green-500')
    expect(svg).toHaveClass('w-6')
    expect(svg).toHaveClass('h-6')
  })

  it('has default size classes', () => {
    const { container } = render(<CheckIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-4')
    expect(svg).toHaveClass('h-4')
  })

  it('uses default strokeWidth of 2', () => {
    const { container } = render(<CheckIcon />)
    const path = container.querySelector('path')
    expect(path).toHaveAttribute('stroke-width', '2')
  })

  it('accepts custom strokeWidth prop', () => {
    const { container } = render(<CheckIcon strokeWidth={2.5} />)
    const path = container.querySelector('path')
    expect(path).toHaveAttribute('stroke-width', '2.5')
  })
})
