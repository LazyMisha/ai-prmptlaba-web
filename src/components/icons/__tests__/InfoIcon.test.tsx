import { render } from '@testing-library/react'
import InfoIcon from '../InfoIcon'

describe('InfoIcon', () => {
  describe('Rendering', () => {
    it('renders an SVG element', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')

      expect(svg).toBeInTheDocument()
    })

    it('has aria-hidden attribute for accessibility', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('has default size classes', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveClass('w-5', 'h-5')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<InfoIcon className="w-6 h-6 text-blue-500" />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveClass('w-6', 'h-6', 'text-blue-500')
    })

    it('uses default strokeWidth of 2', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveAttribute('stroke-width', '2')
    })

    it('applies custom strokeWidth', () => {
      const { container } = render(<InfoIcon strokeWidth={1.5} />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveAttribute('stroke-width', '1.5')
    })
  })

  describe('SVG Structure', () => {
    it('contains a path element', () => {
      const { container } = render(<InfoIcon />)
      const path = container.querySelector('path')

      expect(path).toBeInTheDocument()
    })

    it('has proper viewBox', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('uses stroke for rendering', () => {
      const { container } = render(<InfoIcon />)
      const svg = container.querySelector('svg')

      expect(svg).toHaveAttribute('fill', 'none')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
    })
  })
})
