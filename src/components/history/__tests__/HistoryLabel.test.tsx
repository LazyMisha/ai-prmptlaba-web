import { render, screen } from '@testing-library/react'
import HistoryLabel from '../HistoryLabel'

describe('HistoryLabel', () => {
  it('renders label and value correctly', () => {
    render(<HistoryLabel label="Target" value="ChatGPT" />)

    expect(screen.getByText(/target/i)).toBeInTheDocument()
    expect(screen.getByText(/chatgpt/i)).toBeInTheDocument()
  })

  it('applies default text color to value', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const valueSpan = container.querySelector('span:last-child')

    expect(valueSpan).toHaveClass('text-[#1d1d1f]')
  })

  it('applies custom value color when provided', () => {
    const { container } = render(
      <HistoryLabel label="Original" value="Test prompt" valueColor="text-[#86868b]" />,
    )
    const valueSpan = container.querySelector('span:last-child')

    expect(valueSpan).toHaveClass('text-[#86868b]')
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
    expect(labelSpan).toHaveClass('font-medium')
    expect(labelSpan).toHaveClass('text-[#86868b]')
    expect(labelSpan).toHaveClass('uppercase')
    expect(labelSpan).toHaveClass('w-20')
  })

  it('renders label without colon', () => {
    render(<HistoryLabel label="Target" value="ChatGPT" />)

    // Label should not have colon
    expect(screen.getByText('Target')).toBeInTheDocument()
    expect(screen.queryByText(/target:/i)).not.toBeInTheDocument()
  })

  it('applies full width to container', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const containerDiv = container.firstChild

    expect(containerDiv).toHaveClass('w-full')
    expect(containerDiv).toHaveClass('flex')
    expect(containerDiv).toHaveClass('items-baseline')
  })

  it('has no border by default', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" />)
    const containerDiv = container.firstChild

    expect(containerDiv).not.toHaveClass('border-t')
  })

  it('shows visible border when showBorder is true', () => {
    const { container } = render(<HistoryLabel label="Target" value="ChatGPT" showBorder />)
    const containerDiv = container.firstChild

    expect(containerDiv).toHaveClass('border-t')
    expect(containerDiv).toHaveClass('border-black/[0.06]')
  })
})
