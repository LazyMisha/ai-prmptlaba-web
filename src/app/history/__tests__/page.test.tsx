import { render, screen } from '@testing-library/react'
import HistoryPage from '../page'

// Mock the HistoryList component since it uses IndexedDB
jest.mock('@/components/history/HistoryList', () => {
  return function MockHistoryList() {
    return <div data-testid="history-list">History List Component</div>
  }
})

describe('HistoryPage', () => {
  it('renders page heading', () => {
    render(<HistoryPage />)
    expect(screen.getByRole('heading', { name: /recent prompts/i })).toBeInTheDocument()
  })

  it('renders page description', () => {
    render(<HistoryPage />)
    expect(screen.getByText(/view and manage your recently enhanced prompts/i)).toBeInTheDocument()
  })

  it('renders history list component', () => {
    render(<HistoryPage />)
    expect(screen.getByTestId('history-list')).toBeInTheDocument()
  })

  it('uses PageContainer layout', () => {
    const { container } = render(<HistoryPage />)
    // PageContainer adds max-w-4xl class
    expect(container.querySelector('.max-w-4xl')).toBeInTheDocument()
  })
})
