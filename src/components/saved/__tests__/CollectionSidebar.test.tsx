import { render, screen, fireEvent } from '@testing-library/react'

import type { Collection } from '@/types/saved-prompts'
import { CollectionSidebar } from '../CollectionSidebar'

const mockCollections: Collection[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    isDefault: true,
    sortOrder: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    color: '#6366f1',
    isDefault: true,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'custom-1',
    name: 'My Custom Collection',
    color: '#10b981',
    isDefault: false,
    sortOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const mockPromptCounts = {
  chatgpt: 5,
  midjourney: 3,
  'custom-1': 2,
}

describe('CollectionSidebar', () => {
  const defaultProps = {
    collections: mockCollections,
    selectedId: null,
    promptCounts: mockPromptCounts,
    onSelect: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the navigation element for desktop', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(
        screen.getByRole('navigation', { name: /collections/i }),
      ).toBeInTheDocument()
    })

    it('renders mobile dropdown selector', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders "All" option in mobile dropdown', () => {
      render(<CollectionSidebar {...defaultProps} />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('all')
    })

    it('renders "All" button in desktop nav', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    })

    it('renders all collection buttons in desktop nav', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(
        screen.getByRole('button', { name: /chatgpt/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /midjourney/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /my custom collection/i }),
      ).toBeInTheDocument()
    })

    it('displays total count for "All" in desktop nav', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('displays count for each collection in desktop nav', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(screen.getByText('5')).toBeInTheDocument() // ChatGPT
      expect(screen.getByText('3')).toBeInTheDocument() // Midjourney
      expect(screen.getByText('2')).toBeInTheDocument() // Custom
    })

    it('renders color dot for collections with colors', () => {
      const { container } = render(<CollectionSidebar {...defaultProps} />)

      const colorDots = container.querySelectorAll('[aria-hidden="true"]')
      // Should have color dots for Midjourney and Custom collection
      expect(colorDots.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Selection', () => {
    it('highlights "All" when selectedId is null', () => {
      render(<CollectionSidebar {...defaultProps} selectedId={null} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      expect(allButton).toHaveClass('bg-[#007aff]', 'text-white')
    })

    it('highlights selected collection', () => {
      render(<CollectionSidebar {...defaultProps} selectedId="chatgpt" />)

      const chatgptButton = screen.getByRole('button', { name: /chatgpt/i })
      expect(chatgptButton).toHaveClass('bg-[#007aff]', 'text-white')
    })

    it('calls onSelect with null when "All" is clicked', () => {
      const onSelect = jest.fn()
      render(
        <CollectionSidebar
          {...defaultProps}
          onSelect={onSelect}
          selectedId="chatgpt"
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /all/i }))

      expect(onSelect).toHaveBeenCalledWith(null)
    })

    it('calls onSelect with collection id when collection is clicked', () => {
      const onSelect = jest.fn()
      render(<CollectionSidebar {...defaultProps} onSelect={onSelect} />)

      fireEvent.click(screen.getByRole('button', { name: /midjourney/i }))

      expect(onSelect).toHaveBeenCalledWith('midjourney')
    })
  })

  describe('Create Button', () => {
    it('renders create buttons when onCreate is provided (mobile and desktop)', () => {
      const onCreate = jest.fn()
      render(<CollectionSidebar {...defaultProps} onCreate={onCreate} />)

      // Both mobile and desktop buttons use label "Create Collection"
      const createButtons = screen.getAllByRole('button', {
        name: /create collection/i,
      })
      expect(createButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('does not render create buttons when onCreate is not provided', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(
        screen.queryByRole('button', { name: /create collection/i }),
      ).not.toBeInTheDocument()
    })

    it('calls onCreate when mobile create button is clicked', () => {
      const onCreate = jest.fn()
      render(<CollectionSidebar {...defaultProps} onCreate={onCreate} />)

      // Mobile button labeled "Create Collection"
      const mobileButtons = screen.getAllByRole('button', {
        name: /create collection/i,
      })
      fireEvent.click(mobileButtons[0]!)

      expect(onCreate).toHaveBeenCalled()
    })

    it('calls onCreate when desktop create button is clicked', () => {
      const onCreate = jest.fn()
      render(<CollectionSidebar {...defaultProps} onCreate={onCreate} />)

      // Desktop button labeled "Create Collection"
      const desktopButtons = screen.getAllByRole('button', {
        name: /create collection/i,
      })
      fireEvent.click(desktopButtons[desktopButtons.length - 1]!)

      expect(onCreate).toHaveBeenCalled()
    })
  })

  describe('Action Buttons', () => {
    it('shows rename button when onEdit is provided', () => {
      const onEdit = jest.fn()
      render(<CollectionSidebar {...defaultProps} onEdit={onEdit} />)

      const renameButton = screen.getByRole('button', {
        name: /rename chatgpt/i,
      })
      expect(renameButton).toBeInTheDocument()
    })

    it('shows delete button for non-default collections when onDelete is provided', () => {
      const onDelete = jest.fn()
      render(<CollectionSidebar {...defaultProps} onDelete={onDelete} />)

      const deleteButton = screen.getByRole('button', {
        name: /delete my custom collection/i,
      })
      expect(deleteButton).toBeInTheDocument()
    })

    it('shows delete button for default collections', () => {
      const onDelete = jest.fn()
      render(<CollectionSidebar {...defaultProps} onDelete={onDelete} />)

      // ChatGPT is a default collection - should still have delete button
      expect(
        screen.getByRole('button', { name: /delete chatgpt/i }),
      ).toBeInTheDocument()
    })

    it('calls onEdit when rename button is clicked', () => {
      const onEdit = jest.fn()
      render(<CollectionSidebar {...defaultProps} onEdit={onEdit} />)

      const renameButton = screen.getByRole('button', {
        name: /rename chatgpt/i,
      })
      fireEvent.click(renameButton)

      expect(onEdit).toHaveBeenCalledWith('chatgpt')
    })

    it('calls onDelete when delete button is clicked', () => {
      const onDelete = jest.fn()
      render(<CollectionSidebar {...defaultProps} onDelete={onDelete} />)

      const deleteButton = screen.getByRole('button', {
        name: /delete my custom collection/i,
      })
      fireEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith('custom-1')
    })

    it('does not select collection when clicking action buttons', () => {
      const onEdit = jest.fn()
      const onSelect = jest.fn()
      render(
        <CollectionSidebar
          {...defaultProps}
          onEdit={onEdit}
          onSelect={onSelect}
        />,
      )

      const renameButton = screen.getByRole('button', {
        name: /rename chatgpt/i,
      })
      fireEvent.click(renameButton)

      expect(onEdit).toHaveBeenCalledWith('chatgpt')
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-label on navigation', () => {
      render(<CollectionSidebar {...defaultProps} />)

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Collections',
      )
    })

    it('has proper focus styles on buttons', () => {
      render(<CollectionSidebar {...defaultProps} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      expect(allButton).toHaveClass('focus-visible:ring-2')
    })

    it('has minimum touch target size for buttons', () => {
      render(<CollectionSidebar {...defaultProps} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      expect(allButton).toHaveClass('min-h-[44px]')
    })

    it('has accessible aria-labels on action buttons', () => {
      const onEdit = jest.fn()
      const onDelete = jest.fn()
      render(
        <CollectionSidebar
          {...defaultProps}
          onEdit={onEdit}
          onDelete={onDelete}
        />,
      )

      // Rename button should have proper aria-label
      const renameButton = screen.getByRole('button', {
        name: /rename chatgpt/i,
      })
      expect(renameButton).toHaveAttribute('aria-label', 'Rename ChatGPT')

      // Delete button should have proper aria-label (for non-default collection)
      const deleteButton = screen.getByRole('button', {
        name: /delete my custom collection/i,
      })
      expect(deleteButton).toHaveAttribute(
        'aria-label',
        'Delete My Custom Collection',
      )
    })
  })

  describe('Styling', () => {
    it('applies Apple design tokens', () => {
      render(<CollectionSidebar {...defaultProps} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      expect(allButton).toHaveClass('rounded-xl')
    })

    it('applies custom className to container', () => {
      const { container } = render(
        <CollectionSidebar {...defaultProps} className="custom-class" />,
      )

      // className is applied to the outer div wrapper
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('applies dashed border styling to create buttons', () => {
      const onCreate = jest.fn()
      render(<CollectionSidebar {...defaultProps} onCreate={onCreate} />)

      const buttons = screen.getAllByRole('button', {
        name: /create collection/i,
      })
      buttons.forEach((button) => {
        expect(button).toHaveClass('border-dashed')
        expect(button).toHaveClass('border-gray-300')
        expect(button).toHaveClass('hover:border-[#007aff]')
        expect(button).toHaveClass('hover:text-[#007aff]')
      })
    })
  })
})
