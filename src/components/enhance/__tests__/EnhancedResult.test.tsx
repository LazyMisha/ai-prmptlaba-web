import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EnhancedResult from '../EnhancedResult'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

// Mock SaveToCollectionDialog
jest.mock('@/components/common/SaveToCollectionDialog', () => {
  return function MockDialog({
    isOpen,
    onClose,
  }: {
    isOpen: boolean
    onClose: () => void
  }) {
    return isOpen ? (
      <div data-testid="save-dialog">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  }
})

describe('EnhancedResult', () => {
  const defaultProps = {
    enhanced: null,
    error: null,
    originalPrompt: 'test prompt',
    target: 'General',
  }

  it('renders nothing when no enhanced result or error', () => {
    const { container } = render(<EnhancedResult {...defaultProps} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when loading', () => {
    const { container } = render(
      <EnhancedResult {...defaultProps} enhanced="test" isLoading />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders error state', () => {
    render(<EnhancedResult {...defaultProps} error="API failed" />)

    expect(screen.getByRole('alert')).toHaveTextContent('API failed')
    expect(screen.getByText(/enhancement failed/i)).toBeInTheDocument()
  })

  it('renders enhanced result with copy button', async () => {
    render(<EnhancedResult {...defaultProps} enhanced="Enhanced text here" />)

    expect(screen.getByText('Enhanced text here')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /enhanced prompt result/i }),
    ).toBeInTheDocument()

    // Test copy functionality
    const copyButton = screen.getByRole('button', {
      name: /copy to clipboard/i,
    })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Enhanced text here',
      )
    })
  })

  it('shows original prompt in collapsible', () => {
    render(
      <EnhancedResult
        {...defaultProps}
        enhanced="Enhanced"
        originalPrompt="Original text"
      />,
    )

    // Expand details
    const summary = screen.getByText(/view original/i)
    fireEvent.click(summary)

    expect(screen.getByText('Original text')).toBeInTheDocument()
  })

  it('opens save dialog when save button clicked', () => {
    render(<EnhancedResult {...defaultProps} enhanced="Enhanced text" />)

    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)

    expect(screen.getByTestId('save-dialog')).toBeInTheDocument()
  })
})
