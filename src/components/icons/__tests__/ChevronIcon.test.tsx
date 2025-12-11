import { render } from '@testing-library/react'
import ChevronIcon from '../ChevronIcon'

describe('ChevronIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<ChevronIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<ChevronIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('has default size classes', () => {
    const { container } = render(<ChevronIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-5')
    expect(svg).toHaveClass('h-5')
  })

  it('has transition classes for animation', () => {
    const { container } = render(<ChevronIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('transition-transform')
    expect(svg).toHaveClass('duration-300')
    expect(svg).toHaveClass('ease-out')
  })

  it('applies custom className', () => {
    const { container } = render(
      <ChevronIcon className="custom-class w-4 h-4" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
    expect(svg).toHaveClass('w-4')
    expect(svg).toHaveClass('h-4')
  })

  describe('direction prop', () => {
    it('points down by default (rotate-0)', () => {
      const { container } = render(<ChevronIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-0')
    })

    it('points up with direction="up" (rotate-180)', () => {
      const { container } = render(<ChevronIcon direction="up" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-180')
    })

    it('points right with direction="right" (-rotate-90)', () => {
      const { container } = render(<ChevronIcon direction="right" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('-rotate-90')
    })

    it('points left with direction="left" (rotate-90)', () => {
      const { container } = render(<ChevronIcon direction="left" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-90')
    })
  })

  describe('isRotated prop', () => {
    it('does not add rotation when isRotated is false', () => {
      const { container } = render(<ChevronIcon isRotated={false} />)
      const svg = container.querySelector('svg')
      // Should have rotate-0 from default direction
      expect(svg).toHaveClass('rotate-0')
    })

    it('adds rotate-180 when isRotated is true (default rotationAmount)', () => {
      const { container } = render(<ChevronIcon isRotated={true} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-180')
    })

    it('adds rotate-90 when isRotated is true and rotationAmount is 90', () => {
      const { container } = render(
        <ChevronIcon isRotated={true} rotationAmount={90} />,
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-90')
    })

    it('adds rotate-180 when isRotated is true and rotationAmount is 180', () => {
      const { container } = render(
        <ChevronIcon isRotated={true} rotationAmount={180} />,
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-180')
    })
  })

  it('has correct stroke attributes', () => {
    const { container } = render(<ChevronIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('stroke-width', '2')
    expect(svg).toHaveAttribute('fill', 'none')
  })

  it('has correct viewBox', () => {
    const { container } = render(<ChevronIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('contains a path element', () => {
    const { container } = render(<ChevronIcon />)
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
