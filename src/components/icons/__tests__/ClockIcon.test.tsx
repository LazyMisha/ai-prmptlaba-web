import { render } from '@testing-library/react'
import { ClockIcon } from '../ClockIcon'

describe('ClockIcon', () => {
  it('renders correctly', () => {
    const { container } = render(<ClockIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute', () => {
    const { container } = render(<ClockIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies default classes', () => {
    const { container } = render(<ClockIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-6', 'h-6')
  })

  it('applies custom className', () => {
    const { container } = render(
      <ClockIcon className="custom-class w-10 h-10" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class', 'w-10', 'h-10')
  })

  it('renders circle and polyline elements', () => {
    const { container } = render(<ClockIcon />)
    const circle = container.querySelector('circle')
    const polyline = container.querySelector('polyline')

    expect(circle).toBeInTheDocument()
    expect(polyline).toBeInTheDocument()
  })

  it('has proper SVG attributes', () => {
    const { container } = render(<ClockIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })
})
