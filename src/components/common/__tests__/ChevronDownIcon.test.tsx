import { render } from '@testing-library/react'
import ChevronDownIcon from '../ChevronDownIcon'

describe('ChevronDownIcon', () => {
  it('renders svg element', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('applies default size classes', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('w-5')
    expect(svg).toHaveClass('h-5')
  })

  it('applies default color', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('text-gray-400')
  })

  it('does not rotate by default', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).not.toHaveClass('rotate-180')
  })

  it('rotates when isRotated is true', () => {
    const { container } = render(<ChevronDownIcon isRotated />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('rotate-180')
  })

  it('applies transition classes', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('transition-transform')
    expect(svg).toHaveClass('duration-300')
    expect(svg).toHaveClass('ease-out')
  })

  it('accepts custom className', () => {
    const { container } = render(<ChevronDownIcon className="custom-class" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('custom-class')
  })

  it('has aria-hidden attribute', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('has correct viewBox and stroke attributes', () => {
    const { container } = render(<ChevronDownIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke-width', '2')
  })

  it('renders chevron path', () => {
    const { container } = render(<ChevronDownIcon />)
    const path = container.querySelector('path')

    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('d', 'M19.5 8.25l-7.5 7.5-7.5-7.5')
  })
})
