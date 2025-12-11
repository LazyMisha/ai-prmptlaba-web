import { render, screen, fireEvent } from '@testing-library/react'

import CreateCollectionForm from '../CreateCollectionForm'
import {
  COLLECTION_COLORS,
  DEFAULT_COLLECTION_COLOR,
} from '@/constants/saved-prompts'

import type { CollectionColor } from '@/constants/saved-prompts'

describe('CreateCollectionForm', () => {
  const defaultProps = {
    name: '',
    onNameChange: jest.fn(),
    color: DEFAULT_COLLECTION_COLOR as CollectionColor,
    onColorChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders name input with label', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      expect(screen.getByLabelText(/collection name/i)).toBeInTheDocument()
    })

    it('renders color picker with label', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      expect(screen.getByText(/collection color/i)).toBeInTheDocument()
    })

    it('renders all color options', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      const colorButtons = screen.getAllByRole('button', {
        name: /select color/i,
      })

      expect(colorButtons).toHaveLength(COLLECTION_COLORS.length)
    })

    it('renders placeholder text in name input', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      expect(
        screen.getByPlaceholderText(/e.g., work projects/i),
      ).toBeInTheDocument()
    })

    it('renders back button when showBackButton is true', () => {
      const onBack = jest.fn()
      render(
        <CreateCollectionForm
          {...defaultProps}
          showBackButton
          onBack={onBack}
        />,
      )

      expect(
        screen.getByRole('button', { name: /back to collections/i }),
      ).toBeInTheDocument()
    })

    it('does not render back button by default', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      expect(
        screen.queryByRole('button', { name: /back to collections/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Name Input', () => {
    it('displays current name value', () => {
      render(<CreateCollectionForm {...defaultProps} name="My Collection" />)

      expect(screen.getByDisplayValue('My Collection')).toBeInTheDocument()
    })

    it('calls onNameChange when typing', () => {
      const onNameChange = jest.fn()
      render(
        <CreateCollectionForm {...defaultProps} onNameChange={onNameChange} />,
      )

      fireEvent.change(screen.getByLabelText(/collection name/i), {
        target: { value: 'New Name' },
      })

      expect(onNameChange).toHaveBeenCalledWith('New Name')
    })

    it('has maxLength of 50 characters', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      expect(screen.getByLabelText(/collection name/i)).toHaveAttribute(
        'maxLength',
        '50',
      )
    })
  })

  describe('Name Error', () => {
    it('displays name error message', () => {
      render(
        <CreateCollectionForm {...defaultProps} nameError="Name is required" />,
      )

      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })

    it('applies error styling to input when error exists', () => {
      render(
        <CreateCollectionForm {...defaultProps} nameError="Invalid name" />,
      )

      expect(screen.getByLabelText(/collection name/i)).toHaveClass(
        'border-red-300',
      )
    })

    it('calls onClearNameError when typing after error', () => {
      const onClearNameError = jest.fn()
      render(
        <CreateCollectionForm
          {...defaultProps}
          nameError="Some error"
          onClearNameError={onClearNameError}
        />,
      )

      fireEvent.change(screen.getByLabelText(/collection name/i), {
        target: { value: 'New Name' },
      })

      expect(onClearNameError).toHaveBeenCalled()
    })
  })

  describe('Color Picker', () => {
    it('highlights selected color', () => {
      const selectedColor = COLLECTION_COLORS[2] as CollectionColor
      render(<CreateCollectionForm {...defaultProps} color={selectedColor} />)

      const selectedButton = screen.getByRole('button', {
        name: `Select color ${selectedColor}`,
        pressed: true,
      })

      expect(selectedButton).toHaveClass('ring-2')
    })

    it('calls onColorChange when clicking a color', () => {
      const onColorChange = jest.fn()
      const newColor = COLLECTION_COLORS[3] as CollectionColor
      render(
        <CreateCollectionForm
          {...defaultProps}
          onColorChange={onColorChange}
        />,
      )

      fireEvent.click(
        screen.getByRole('button', { name: `Select color ${newColor}` }),
      )

      expect(onColorChange).toHaveBeenCalledWith(newColor)
    })

    it('renders check icon for selected color', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      // The selected color button should have a check icon (svg inside)
      const selectedButton = screen.getByRole('button', {
        name: `Select color ${DEFAULT_COLLECTION_COLOR}`,
        pressed: true,
      })

      expect(selectedButton.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Back Button', () => {
    it('calls onBack when clicked', () => {
      const onBack = jest.fn()
      render(
        <CreateCollectionForm
          {...defaultProps}
          showBackButton
          onBack={onBack}
        />,
      )

      fireEvent.click(
        screen.getByRole('button', { name: /back to collections/i }),
      )

      expect(onBack).toHaveBeenCalled()
    })

    it('has chevron icon', () => {
      const onBack = jest.fn()
      render(
        <CreateCollectionForm
          {...defaultProps}
          showBackButton
          onBack={onBack}
        />,
      )

      // Back button should contain an SVG (chevron icon)
      const backButton = screen.getByRole('button', {
        name: /back to collections/i,
      })

      expect(backButton.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <CreateCollectionForm {...defaultProps} className="custom-class" />,
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('applies Apple design tokens to input', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      const input = screen.getByLabelText(/collection name/i)

      expect(input).toHaveClass('rounded-xl')
      expect(input).toHaveClass('px-4')
      expect(input).toHaveClass('py-3')
    })

    it('applies proper focus styles to input', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      const input = screen.getByLabelText(/collection name/i)

      expect(input).toHaveClass('focus:outline-none')
      expect(input).toHaveClass('focus:ring-2')
    })
  })

  describe('Accessibility', () => {
    it('has proper label association for name input', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      const input = screen.getByLabelText(/collection name/i)

      expect(input).toHaveAttribute('id', 'collection-name')
    })

    it('color buttons have aria-pressed attribute', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      const colorButtons = screen.getAllByRole('button', {
        name: /select color/i,
      })

      colorButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed')
      })
    })

    it('color buttons have descriptive aria-label', () => {
      render(<CreateCollectionForm {...defaultProps} />)

      COLLECTION_COLORS.forEach((color) => {
        expect(
          screen.getByRole('button', { name: `Select color ${color}` }),
        ).toBeInTheDocument()
      })
    })
  })
})
