import { render } from '@testing-library/react'
import TrashIcon from '../TrashIcon'

describe('TrashIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<TrashIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<TrashIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies default size classes', () => {
    const { container } = render(<TrashIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('w-4', 'h-4')
  })

  it('applies custom className', () => {
    const { container } = render(<TrashIcon className="w-6 h-6 text-red-500" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('w-6', 'h-6', 'text-red-500')
  })

  it('has correct viewBox', () => {
    const { container } = render(<TrashIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('uses currentColor for stroke', () => {
    const { container } = render(<TrashIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('has no fill', () => {
    const { container } = render(<TrashIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('fill', 'none')
  })
})
