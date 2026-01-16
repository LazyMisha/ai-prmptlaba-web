import { render } from '@testing-library/react'
import SlidersIcon from '../SlidersIcon'

describe('SlidersIcon', () => {
  it('renders correctly', () => {
    const { container } = render(<SlidersIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<SlidersIcon className="custom-class" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('has aria-hidden attribute', () => {
    const { container } = render(<SlidersIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
