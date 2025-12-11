import { render } from '@testing-library/react'
import SelectorIcon from '../SelectorIcon'

describe('SelectorIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<SelectorIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<SelectorIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('has default size classes', () => {
    const { container } = render(<SelectorIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('h-4')
    expect(svg).toHaveClass('w-4')
  })

  it('applies custom className', () => {
    const { container } = render(
      <SelectorIcon className="custom-class w-6 h-6" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
    expect(svg).toHaveClass('w-6')
    expect(svg).toHaveClass('h-6')
  })

  it('has correct SVG attributes', () => {
    const { container } = render(<SelectorIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('stroke-width', '2')
    expect(svg).toHaveAttribute('stroke-linecap', 'round')
    expect(svg).toHaveAttribute('stroke-linejoin', 'round')
  })

  it('renders both arrow paths (up and down)', () => {
    const { container } = render(<SelectorIcon />)
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(2)
  })
})
