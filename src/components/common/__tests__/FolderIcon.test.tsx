import { render } from '@testing-library/react'
import FolderIcon from '../FolderIcon'

describe('FolderIcon', () => {
  describe('Rendering', () => {
    it('renders the SVG element', () => {
      render(<FolderIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('has aria-hidden set to true for accessibility', () => {
      render(<FolderIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('renders with default viewBox', () => {
      render(<FolderIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('has correct fill and stroke attributes', () => {
      render(<FolderIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('fill', 'none')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<FolderIcon className="w-8 h-8 text-yellow-500" />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveClass('w-8', 'h-8', 'text-yellow-500')
    })

    it('applies default stroke width', () => {
      render(<FolderIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '1.5')
    })

    it('applies custom stroke width', () => {
      render(<FolderIcon strokeWidth={2.5} />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '2.5')
    })

    it('applies inline styles', () => {
      render(<FolderIcon style={{ color: '#007AFF' }} />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveStyle({ color: 'rgb(0, 122, 255)' })
    })
  })

  describe('Path element', () => {
    it('contains a path element', () => {
      render(<FolderIcon />)
      const path = document.querySelector('path')
      expect(path).toBeInTheDocument()
    })

    it('has correct line cap and line join attributes', () => {
      render(<FolderIcon />)
      const path = document.querySelector('path')
      expect(path).toHaveAttribute('stroke-linecap', 'round')
      expect(path).toHaveAttribute('stroke-linejoin', 'round')
    })
  })
})
