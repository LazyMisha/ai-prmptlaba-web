import { render } from '@testing-library/react'
import FolderPlusIcon from '../FolderPlusIcon'

describe('FolderPlusIcon', () => {
  describe('Rendering', () => {
    it('renders the SVG element', () => {
      render(<FolderPlusIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('has aria-hidden set to true for accessibility', () => {
      render(<FolderPlusIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('renders with default viewBox', () => {
      render(<FolderPlusIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('has correct fill and stroke attributes', () => {
      render(<FolderPlusIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('fill', 'none')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<FolderPlusIcon className="w-5 h-5 text-green-600" />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveClass('w-5', 'h-5', 'text-green-600')
    })

    it('applies default stroke width', () => {
      render(<FolderPlusIcon />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '1.5')
    })

    it('applies custom stroke width', () => {
      render(<FolderPlusIcon strokeWidth={2} />)
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '2')
    })
  })

  describe('Path element', () => {
    it('contains a path element', () => {
      render(<FolderPlusIcon />)
      const path = document.querySelector('path')
      expect(path).toBeInTheDocument()
    })

    it('has correct line cap and line join attributes', () => {
      render(<FolderPlusIcon />)
      const path = document.querySelector('path')
      expect(path).toHaveAttribute('stroke-linecap', 'round')
      expect(path).toHaveAttribute('stroke-linejoin', 'round')
    })
  })
})
