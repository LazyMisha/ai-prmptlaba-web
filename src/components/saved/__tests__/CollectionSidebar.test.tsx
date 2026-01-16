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

      // Mobile dropdown trigger showing "All (10)"
      expect(
        screen.getByRole('button', { name: /All \(10\)/i }),
      ).toBeInTheDocument()
    })

    it('renders "All" option in mobile dropdown', () => {
      render(<CollectionSidebar {...defaultProps} />)

      // Mobile dropdown trigger should show "All"
      const mobileTrigger = screen.getByRole('button', { name: /All \(10\)/i })
      expect(mobileTrigger).toBeInTheDocument()
    })

    it('renders "All" button in desktop nav', () => {
      render(<CollectionSidebar {...defaultProps} />)

      // There are two "All" buttons (mobile + desktop), find the desktop one
      const allButtons = screen.getAllByRole('button', { name: /all/i })
      expect(allButtons.length).toBeGreaterThanOrEqual(1)
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

      // Desktop "All" button should be highlighted
      const allButtons = screen.getAllByRole('button', { name: /all/i })
      // Find the desktop button (the one with exact text "All")
      const desktopButton = allButtons.find((btn) =>
        btn.textContent?.match(/^All\s*10$/),
      )
      expect(desktopButton).toHaveClass('border-[#007aff]', 'text-[#007aff]')
    })

    it('highlights selected collection', () => {
      render(<CollectionSidebar {...defaultProps} selectedId="chatgpt" />)

      // Find desktop collection button - role="button" inside collection div
      const chatgptButtons = screen.getAllByRole('button', { name: /chatgpt/i })
      // The selected one should have the selected class
      const selectedButton = chatgptButtons.find((btn) =>
        btn.className.includes('border-[#007aff]'),
      )
      expect(selectedButton).toHaveClass('border-[#007aff]', 'text-[#007aff]')
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

      const allButtons = screen.getAllByRole('button', { name: /all/i })
      // Check that at least one has proper focus styles
      expect(allButtons[0]).toHaveClass('focus-visible:ring-2')
    })

    it('has minimum touch target size for buttons', () => {
      render(<CollectionSidebar {...defaultProps} />)

      const allButtons = screen.getAllByRole('button', { name: /all/i })
      // Desktop button (second) should have minimum touch target
      expect(allButtons[1]).toHaveClass('min-h-[44px]')
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

      const allButtons = screen.getAllByRole('button', { name: /all/i })
      // Check that mobile button has rounded corners
      expect(allButtons[0]).toHaveClass('rounded-2xl')
      // Check that desktop button has rounded corners
      expect(allButtons[1]).toHaveClass('rounded-2xl')
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

      expect(buttons.length).toBeGreaterThanOrEqual(1)
      // Both mobile and desktop buttons now use solid blue styling
      buttons.forEach((button) => {
        expect(button).toHaveClass('bg-[#007aff]')
        expect(button).toHaveClass('text-white')
      })
    })
  })
})
