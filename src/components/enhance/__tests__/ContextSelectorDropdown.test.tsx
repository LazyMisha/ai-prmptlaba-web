import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContextSelectorDropdown from '../ContextSelectorDropdown'
import { TOOL_CATEGORIES } from '@/constants/tool-categories'

describe('ContextSelectorDropdown', () => {
  const defaultProps = {
    value: TOOL_CATEGORIES.GENERAL,
    onChange: jest.fn(),
    label: 'Target Platform',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with label and current value', () => {
    render(<ContextSelectorDropdown {...defaultProps} />)

    expect(screen.getByText('Target Platform')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /target platform/i }),
    ).toHaveTextContent('General')
  })

  it('calls onChange when selection changes', async () => {
    render(<ContextSelectorDropdown {...defaultProps} />)

    const button = screen.getByRole('button', { name: /target platform/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Image')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Image'))

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      TOOL_CATEGORIES.IMAGE_GENERATOR,
    )
  })

  it('renders all tool category options when opened', async () => {
    render(<ContextSelectorDropdown {...defaultProps} />)

    const button = screen.getByRole('button', { name: /target platform/i })
    fireEvent.click(button)

    await waitFor(() => {
      const options = screen.getAllByRole('button')
      expect(options.length).toBeGreaterThan(5)
    })
  })

  it('is disabled when disabled prop is true', () => {
    render(<ContextSelectorDropdown {...defaultProps} disabled />)

    const button = screen.getByRole('button', { name: /target platform/i })
    expect(button).toBeDisabled()
  })

  it('uses custom label', () => {
    render(<ContextSelectorDropdown {...defaultProps} label="Choose Target" />)

    expect(screen.getByText('Choose Target')).toBeInTheDocument()
  })

  it('renders custom helper text', () => {
    const helperText = 'Custom helper text'
    render(
      <ContextSelectorDropdown {...defaultProps} helperText={helperText} />,
    )

    expect(screen.getByText(helperText)).toBeInTheDocument()
  })
})
