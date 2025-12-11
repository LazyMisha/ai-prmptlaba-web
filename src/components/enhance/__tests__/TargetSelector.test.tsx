import { render, screen, fireEvent } from '@testing-library/react'
import TargetSelector from '../TargetSelector'
import { TOOL_CATEGORIES } from '@/constants/tool-categories'

describe('TargetSelector', () => {
  const defaultProps = {
    value: TOOL_CATEGORIES.GENERAL,
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with label and current value', () => {
    render(<TargetSelector {...defaultProps} />)

    expect(
      screen.getByRole('combobox', { name: /target platform/i }),
    ).toHaveValue(TOOL_CATEGORIES.GENERAL)
  })

  it('calls onChange when selection changes', () => {
    render(<TargetSelector {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, {
      target: { value: TOOL_CATEGORIES.IMAGE_GENERATOR },
    })

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      TOOL_CATEGORIES.IMAGE_GENERATOR,
    )
  })

  it('renders all tool category options', () => {
    render(<TargetSelector {...defaultProps} />)

    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThan(5)
  })

  it('is disabled when disabled prop is true', () => {
    render(<TargetSelector {...defaultProps} disabled />)

    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('uses custom label', () => {
    render(<TargetSelector {...defaultProps} label="Choose Target" />)

    expect(
      screen.getByRole('combobox', { name: /choose target/i }),
    ).toBeInTheDocument()
  })
})
