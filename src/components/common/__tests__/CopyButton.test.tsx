import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CopyButton from '../CopyButton'

// Mock clipboard API
const mockWriteText = jest.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('CopyButton', () => {
  beforeEach(() => {
    mockWriteText.mockClear()
    mockWriteText.mockResolvedValue(undefined)
  })

  it('renders with default props', () => {
    render(<CopyButton text="Test text" />)

    const button = screen.getByRole('button', { name: /copy to clipboard/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('copies text to clipboard when clicked', async () => {
    render(<CopyButton text="Test text to copy" />)

    const button = screen.getByRole('button', { name: /copy to clipboard/i })

    await act(async () => {
      fireEvent.click(button)
    })

    expect(mockWriteText).toHaveBeenCalledTimes(1)
    expect(mockWriteText).toHaveBeenCalledWith('Test text to copy')
  })

  it('shows success state after copying', async () => {
    render(<CopyButton text="Test text" />)

    const button = screen.getByRole('button', { name: /copy to clipboard/i })

    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument()
    })
  })

  it('resets to default state after 2 seconds', async () => {
    jest.useFakeTimers()

    render(<CopyButton text="Test text" />)

    const button = screen.getByRole('button', { name: /copy to clipboard/i })

    await act(async () => {
      fireEvent.click(button)
    })

    expect(screen.getByText('Copied')).toBeInTheDocument()

    await act(async () => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText('Copy')).toBeInTheDocument()

    jest.useRealTimers()
  })

  it('hides label when showLabel is false', () => {
    render(<CopyButton text="Test text" showLabel={false} />)

    expect(screen.queryByText('Copy')).not.toBeInTheDocument()
  })

  it('uses custom label when provided', () => {
    render(<CopyButton text="Test text" label="Copy text" successLabel="Text copied!" />)

    expect(screen.getByText('Copy text')).toBeInTheDocument()
  })

  it('shows custom success label after copying', async () => {
    render(<CopyButton text="Test text" successLabel="Done!" />)

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(screen.getByText('Done!')).toBeInTheDocument()
    })
  })

  it('calls onCopy callback after successful copy', async () => {
    const onCopy = jest.fn()
    render(<CopyButton text="Test text" onCopy={onCopy} />)

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(onCopy).toHaveBeenCalledTimes(1)
  })

  it('applies subtle variant styles', () => {
    const { container } = render(<CopyButton text="Test text" variant="subtle" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('text-[#86868b]')
  })

  it('applies success variant styles', () => {
    const { container } = render(<CopyButton text="Test text" variant="success" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('text-emerald-700')
    expect(button).toHaveClass('bg-emerald-100')
  })

  it('applies custom className', () => {
    const { container } = render(<CopyButton text="Test text" className="custom-class" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('handles clipboard error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    mockWriteText.mockRejectedValue(new Error('Clipboard error'))

    render(<CopyButton text="Test text" />)

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('stops event propagation when clicked', async () => {
    const parentClickHandler = jest.fn()

    render(
      <div onClick={parentClickHandler}>
        <CopyButton text="Test text" />
      </div>,
    )

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(parentClickHandler).not.toHaveBeenCalled()
  })

  it('has correct accessibility attributes', () => {
    render(<CopyButton text="Test text" />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'Copy to clipboard')
  })

  it('updates aria-label after copying', async () => {
    render(<CopyButton text="Test text" />)

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Copied to clipboard')
    })
  })
})
