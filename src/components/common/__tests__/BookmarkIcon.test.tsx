import { render } from '@testing-library/react'
import BookmarkIcon from '../BookmarkIcon'

describe('BookmarkIcon', () => {
  describe('Rendering', () => {
    it('renders the SVG element', () => {
      render(<BookmarkIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('has aria-hidden set to true for accessibility', () => {
      render(<BookmarkIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('renders with default viewBox', () => {
      render(<BookmarkIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })
  })

  describe('Filled state', () => {
    it('renders outline style by default (filled=false)', () => {
      render(<BookmarkIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('fill', 'none')
    })

    it('renders filled style when filled prop is true', () => {
      render(<BookmarkIcon filled />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('fill', 'currentColor')
    })

    it('has stroke when not filled', () => {
      render(<BookmarkIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<BookmarkIcon className="w-6 h-6 text-blue-500" />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveClass('w-6', 'h-6', 'text-blue-500')
    })

    it('applies default stroke width', () => {
      render(<BookmarkIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '1.5')
    })

    it('applies custom stroke width', () => {
      render(<BookmarkIcon strokeWidth={2} />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '2')
    })
  })

  describe('Path element', () => {
    it('contains a path element', () => {
      render(<BookmarkIcon />)
      const path = document.querySelector('path')
      expect(path).toBeInTheDocument()
    })

    it('has correct line cap and line join attributes', () => {
      render(<BookmarkIcon />)
      const path = document.querySelector('path')
      expect(path).toHaveAttribute('stroke-linecap', 'round')
      expect(path).toHaveAttribute('stroke-linejoin', 'round')
    })
  })
})
