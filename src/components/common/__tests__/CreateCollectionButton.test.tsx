import { render, screen, fireEvent } from '@testing-library/react'

import CreateCollectionButton from '../CreateCollectionButton'

describe('CreateCollectionButton', () => {
  describe('Rendering', () => {
    it('renders with default label', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      expect(
        screen.getByRole('button', { name: /create new collection/i }),
      ).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(
        <CreateCollectionButton onClick={() => {}} label="Add Collection" />,
      )

      expect(
        screen.getByRole('button', { name: /add collection/i }),
      ).toBeInTheDocument()
    })

    it('renders folder plus icon', () => {
      const { container } = render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn()
      render(
        <CreateCollectionButton
          onClick={handleClick}
          label="Create new collection"
        />,
      )

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(
        <CreateCollectionButton
          onClick={handleClick}
          label="Create new collection"
          disabled
        />,
      )

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
          disabled
        />,
      )

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('is not disabled by default', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      expect(screen.getByRole('button')).not.toBeDisabled()
    })
  })

  describe('Styling', () => {
    it('applies dashed border styling', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-[#007aff]')
      expect(button).toHaveClass('text-white')
      expect(button).toHaveClass('rounded-2xl')
    })

    it('applies custom className', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
          className="custom-class"
        />,
      )

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('has minimum touch target size', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      expect(screen.getByRole('button')).toHaveClass('min-h-[50px]')
    })

    it('has proper focus styles', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      const button = screen.getByRole('button')

      expect(button).toHaveClass('focus:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
      expect(button).toHaveClass('focus-visible:ring-[#007aff]')
    })
  })

  describe('Accessibility', () => {
    it('has button type attribute', () => {
      render(
        <CreateCollectionButton
          onClick={() => {}}
          label="Create new collection"
        />,
      )

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('is keyboard accessible', () => {
      const handleClick = jest.fn()
      render(
        <CreateCollectionButton
          onClick={handleClick}
          label="Create new collection"
        />,
      )

      const button = screen.getByRole('button')
      button.focus()

      expect(document.activeElement).toBe(button)

      fireEvent.keyDown(button, { key: 'Enter' })
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalled()
    })
  })
})
