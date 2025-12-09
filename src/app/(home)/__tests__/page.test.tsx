import { render, screen } from '@testing-library/react'
import HomePage from '../page'

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', { name: /AI Prompt Laba/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<HomePage />)
    const description = screen.getByText(/Your hub for smart prompt creation and management/i)
    expect(description).toBeInTheDocument()
  })
})
