import { render, screen, fireEvent } from '@testing-library/react'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  const items = ['Option 1', 'Option 2', 'Option 3']
  const mockOnSelectItem = jest.fn()
  const defaultProps = {
    isOpen: false,
    onOpenChange: jest.fn(),
    onSelectItem: mockOnSelectItem,
    triggerText: 'Select Option',
    items,
    renderItem: (item: string) => <div>{item}</div>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders trigger with text', () => {
    render(<Dropdown {...defaultProps} />)

    expect(screen.getByText('Select Option')).toBeInTheDocument()
  })

  it('calls onOpenChange when trigger is clicked', () => {
    render(<Dropdown {...defaultProps} />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(true)
  })

  it('renders dropdown menu when open', () => {
    render(<Dropdown {...defaultProps} isOpen />)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('does not render dropdown menu when closed', () => {
    render(<Dropdown {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('closes dropdown when backdrop is clicked', () => {
    render(<Dropdown {...defaultProps} isOpen />)

    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toBeInTheDocument()

    fireEvent.click(backdrop!)

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders with trigger prefix', () => {
    const prefix = <span data-testid="prefix">🔵</span>
    render(<Dropdown {...defaultProps} triggerPrefix={prefix} />)

    expect(screen.getByTestId('prefix')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Dropdown {...defaultProps} disabled />)

    const trigger = screen.getByRole('button')
    expect(trigger).toBeDisabled()
  })

  it('does not open when disabled and clicked', () => {
    render(<Dropdown {...defaultProps} disabled />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    expect(defaultProps.onOpenChange).not.toHaveBeenCalled()
  })

  it('rotates chevron icon when open', () => {
    const { rerender } = render(<Dropdown {...defaultProps} isOpen={false} />)

    const chevron = document.querySelector('svg')
    expect(chevron?.classList.contains('rotate-180')).toBe(false)

    rerender(<Dropdown {...defaultProps} isOpen />)

    expect(chevron?.classList.contains('rotate-180')).toBe(true)
  })

  it('applies custom trigger className', () => {
    render(
      <Dropdown {...defaultProps} triggerClassName="custom-trigger-class" />,
    )

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveClass('custom-trigger-class')
  })

  it('applies custom menu className', () => {
    render(<Dropdown {...defaultProps} isOpen menuClassName="custom-menu" />)

    const menu = document.querySelector('.custom-menu')
    expect(menu).toBeInTheDocument()
  })

  it('calls onSelectItem when an item is clicked', () => {
    render(<Dropdown {...defaultProps} isOpen />)

    const option = screen.getAllByText('Option 1')[0]
    fireEvent.click(option!)

    expect(mockOnSelectItem).toHaveBeenCalledWith('Option 1', 0)
  })
})
