import { render, screen } from '@testing-library/react'
import HistoryLabel from '../HistoryLabel'

describe('HistoryLabel', () => {
  it('renders label and value correctly', () => {
    render(<HistoryLabel label="Target" value="ChatGPT" />)

    expect(screen.getByText(/target:/i)).toBeInTheDocument()
    expect(screen.getByText(/chatgpt/i)).toBeInTheDocument()
  })

  it('applies default text color to value', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const valueSpan = container.querySelector('span:last-child')

    expect(valueSpan).toHaveClass('text-gray-700')
  })

  it('applies custom value color when provided', () => {
    const { container } = render(
      <HistoryLabel label="Original" value="Test prompt" valueColor="text-gray-600" />,
    )
    const valueSpan = container.querySelector('span:last-child')

    expect(valueSpan).toHaveClass('text-gray-600')
  })

  it('truncates value by default', () => {
    const { container } = render(<HistoryLabel label="Target" value="Very long text" />)
    const valueSpan = container.querySelector('span:last-child')

    expect(valueSpan).toHaveClass('truncate')
  })

  it('uses break-words when truncate is false', () => {
    const { container } = render(
      <HistoryLabel label="Target" value="Very long text" truncate={false} />,
    )
    const valueSpan = container.querySelector('span:last-child')

    expect(valueSpan).toHaveClass('break-words')
    expect(valueSpan).not.toHaveClass('truncate')
  })

  it('applies consistent label styling', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const labelSpan = container.querySelector('span:first-child')

    expect(labelSpan).toHaveClass('text-xs')
    expect(labelSpan).toHaveClass('font-light')
    expect(labelSpan).toHaveClass('text-gray-500')
    expect(labelSpan).toHaveClass('uppercase')
    expect(labelSpan).toHaveClass('w-20')
  })

  it('appends colon to label', () => {
    render(<HistoryLabel label="Target" value="ChatGPT" />)

    // Label should have colon
    expect(screen.getByText(/target:/i)).toBeInTheDocument()
  })

  it('applies full width to container', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const containerDiv = container.firstChild

    expect(containerDiv).toHaveClass('w-full')
    expect(containerDiv).toHaveClass('flex')
    expect(containerDiv).toHaveClass('items-center')
  })

  it('shows transparent border by default', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const containerDiv = container.firstChild

    expect(containerDiv).toHaveClass('border-t')
    expect(containerDiv).toHaveClass('border-transparent')
  })

  it('shows visible border when showBorder is true', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" showBorder />)
    const containerDiv = container.firstChild

    expect(containerDiv).toHaveClass('border-t')
    expect(containerDiv).toHaveClass('border-gray-200')
    expect(containerDiv).not.toHaveClass('border-transparent')
  })
})
