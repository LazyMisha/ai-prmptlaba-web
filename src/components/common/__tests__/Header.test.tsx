import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders navigation element', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders banner element', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
