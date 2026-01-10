import { render } from '@testing-library/react'
import Loading from '../Loading'

describe('Loading', () => {
  it('renders with default size (M)', () => {
    const { container } = render(<Loading />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8', 'h-8')
  })

  it('renders small size', () => {
    const { container } = render(<Loading size="S" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-4', 'h-4')
  })

  it('renders medium size', () => {
    const { container } = render(<Loading size="M" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8', 'h-8')
  })

  it('renders large size', () => {
    const { container } = render(<Loading size="L" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-16', 'h-16')
  })

  it('renders as full page when fullPage is true', () => {
    const { container } = render(<Loading fullPage />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('min-h-screen')
  })

  it('renders inline by default', () => {
    const { container } = render(<Loading />)
    const wrapper = container.firstChild
    expect(wrapper).not.toHaveClass('min-h-screen')
  })

  it('applies custom className', () => {
    const { container } = render(<Loading className="custom-class" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })

  it('has proper accessibility attributes', () => {
    const { container } = render(<Loading />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveAttribute('role', 'status')
    expect(wrapper).toHaveAttribute('aria-live', 'polite')
  })

  it('renders SVG spinner', () => {
    const { container } = render(<Loading />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
