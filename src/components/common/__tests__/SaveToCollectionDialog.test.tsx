import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SaveToCollectionDialog from '../SaveToCollectionDialog'
import * as savedPromptsDb from '@/lib/db/saved-prompts'
import { clearAllToasts } from '../Toast'
import type { CollectionWithCount, Collection, SavedPrompt } from '@/types/saved-prompts'

// Mock the database functions
jest.mock('@/lib/db/saved-prompts', () => ({
  getAllCollectionsWithCounts: jest.fn(),
  createCollection: jest.fn(),
  savePrompt: jest.fn(),
  getOrCreateDefaultCollection: jest.fn(),
}))

// Mock the Toast module
jest.mock('../Toast', () => ({
  showToast: jest.fn(),
  clearAllToasts: jest.fn(),
}))

const mockCollections: CollectionWithCount[] = [
  {
    id: 'collection-1',
    name: 'ChatGPT',
    color: '#007AFF',
    isDefault: true,
    sortOrder: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    promptCount: 5,
  },
  {
    id: 'collection-2',
    name: 'Work Projects',
    color: '#34C759',
    isDefault: false,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    promptCount: 3,
  },
]

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSaved: jest.fn(),
  originalPrompt: 'Original prompt text',
  enhancedPrompt: 'Enhanced prompt text',
  target: 'ChatGPT',
}

describe('SaveToCollectionDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    act(() => {
      clearAllToasts()
    })
    ;(savedPromptsDb.getAllCollectionsWithCounts as jest.Mock).mockResolvedValue(mockCollections)
  })

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      render(<SaveToCollectionDialog {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders the dialog when isOpen is true', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
      expect(screen.getByText('Save to Collection')).toBeInTheDocument()
    })

    it('displays the quick save button with target name', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /quick save to/i })).toBeInTheDocument()
      })
    })

    it('displays collections list after loading', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('ChatGPT')).toBeInTheDocument()
        expect(screen.getByText('Work Projects')).toBeInTheDocument()
      })
    })

    it('displays prompt count for each collection', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('5 prompts')).toBeInTheDocument()
        expect(screen.getByText('3 prompts')).toBeInTheDocument()
      })
    })

    it('displays singular "prompt" when count is 1', async () => {
      const firstCollection = mockCollections[0]
      if (!firstCollection) {
        throw new Error('Mock collection not found')
      }
      const singlePromptCollection: CollectionWithCount[] = [{ ...firstCollection, promptCount: 1 }]
      ;(savedPromptsDb.getAllCollectionsWithCounts as jest.Mock).mockResolvedValue(
        singlePromptCollection,
      )

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('1 prompt')).toBeInTheDocument()
      })
    })

    it('shows empty state when no collections exist', async () => {
      ;(savedPromptsDb.getAllCollectionsWithCounts as jest.Mock).mockResolvedValue([])

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('No collections yet. Create your first one!')).toBeInTheDocument()
      })
    })
  })

  describe('Collection Selection', () => {
    it('auto-selects the default collection for the target', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        // Look for the collection button that contains "ChatGPT" and "prompts"
        const collectionButtons = screen.getAllByRole('button')
        const chatGptCollectionButton = collectionButtons.find(
          (btn) => btn.textContent?.includes('ChatGPT') && btn.textContent?.includes('prompts'),
        )
        expect(chatGptCollectionButton).toHaveClass('bg-[#007aff]/10')
      })
    })

    it('allows selecting a different collection', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Work Projects')).toBeInTheDocument()
      })

      const workProjectsButton = screen.getByRole('button', { name: /Work Projects.*prompts/i })
      fireEvent.click(workProjectsButton)

      expect(workProjectsButton).toHaveClass('bg-[#007aff]/10')
    })

    it('shows save button when a collection is selected', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Save to Selected Collection/i }),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Quick Save', () => {
    it('calls getOrCreateDefaultCollection and savePrompt on quick save', async () => {
      const mockCollection: Collection = {
        id: 'default-1',
        name: 'ChatGPT',
        color: '#007AFF',
        isDefault: true,
        sortOrder: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      ;(savedPromptsDb.getOrCreateDefaultCollection as jest.Mock).mockResolvedValue(mockCollection)
      ;(savedPromptsDb.savePrompt as jest.Mock).mockResolvedValue({} as SavedPrompt)

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /quick save to/i })).toBeInTheDocument()
      })

      const quickSaveButton = screen.getByRole('button', { name: /quick save to/i })
      fireEvent.click(quickSaveButton)

      await waitFor(() => {
        expect(savedPromptsDb.getOrCreateDefaultCollection).toHaveBeenCalledWith('ChatGPT')
        expect(savedPromptsDb.savePrompt).toHaveBeenCalledWith({
          originalPrompt: 'Original prompt text',
          enhancedPrompt: 'Enhanced prompt text',
          target: 'ChatGPT',
          collectionId: 'default-1',
        })
      })
    })

    it('calls onSaved and onClose after successful quick save', async () => {
      const mockCollection: Collection = {
        id: 'default-1',
        name: 'ChatGPT',
        color: '#007AFF',
        isDefault: true,
        sortOrder: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      ;(savedPromptsDb.getOrCreateDefaultCollection as jest.Mock).mockResolvedValue(mockCollection)
      ;(savedPromptsDb.savePrompt as jest.Mock).mockResolvedValue({} as SavedPrompt)

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /quick save to/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /quick save to/i }))

      await waitFor(() => {
        expect(defaultProps.onSaved).toHaveBeenCalled()
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })
  })

  describe('Save to Selected Collection', () => {
    it('saves prompt to selected collection', async () => {
      ;(savedPromptsDb.savePrompt as jest.Mock).mockResolvedValue({} as SavedPrompt)

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Work Projects/i })).toBeInTheDocument()
      })

      // Select a different collection
      fireEvent.click(screen.getByRole('button', { name: /Work Projects/i }))

      // Click save
      fireEvent.click(screen.getByRole('button', { name: /Save to Selected Collection/i }))

      await waitFor(() => {
        expect(savedPromptsDb.savePrompt).toHaveBeenCalledWith({
          originalPrompt: 'Original prompt text',
          enhancedPrompt: 'Enhanced prompt text',
          target: 'ChatGPT',
          collectionId: 'collection-2',
        })
      })
    })
  })

  describe('Create New Collection', () => {
    it('switches to create mode when clicking create button', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))

      expect(screen.getByText('New Collection')).toBeInTheDocument()
      expect(screen.getByLabelText('Collection Name')).toBeInTheDocument()
      expect(screen.getByText('Collection Color')).toBeInTheDocument()
    })

    it('shows back button in create mode', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))

      expect(screen.getByText('Back to collections')).toBeInTheDocument()
    })

    it('returns to select mode when clicking back', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))
      fireEvent.click(screen.getByText('Back to collections'))

      expect(screen.getByText('Save to Collection')).toBeInTheDocument()
    })

    it('shows color picker with all colors', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))

      // Check that color buttons exist (10 colors)
      const colorButtons = screen.getAllByRole('button', { name: /Select color/i })
      expect(colorButtons).toHaveLength(10)
    })

    it('validates empty collection name', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))

      // The Create & Save button should be disabled when the name is empty
      const createButton = screen.getByRole('button', { name: /Create & Save/i })
      expect(createButton).toBeDisabled()
    })

    it('validates duplicate collection names', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))
      fireEvent.change(screen.getByLabelText('Collection Name'), { target: { value: 'ChatGPT' } })
      fireEvent.click(screen.getByRole('button', { name: /Create & Save/i }))

      expect(screen.getByText('A collection with this name already exists')).toBeInTheDocument()
    })

    it('creates collection and saves prompt on valid submission', async () => {
      const newCollection: Collection = {
        id: 'new-collection',
        name: 'My New Collection',
        color: '#34C759',
        isDefault: false,
        sortOrder: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      ;(savedPromptsDb.createCollection as jest.Mock).mockResolvedValue(newCollection)
      ;(savedPromptsDb.savePrompt as jest.Mock).mockResolvedValue({} as SavedPrompt)

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))
      fireEvent.change(screen.getByLabelText('Collection Name'), {
        target: { value: 'My New Collection' },
      })
      fireEvent.click(screen.getByRole('button', { name: /Create & Save/i }))

      await waitFor(() => {
        expect(savedPromptsDb.createCollection).toHaveBeenCalledWith({
          name: 'My New Collection',
          color: '#007AFF', // default color
          isDefault: false,
        })
        expect(savedPromptsDb.savePrompt).toHaveBeenCalledWith({
          originalPrompt: 'Original prompt text',
          enhancedPrompt: 'Enhanced prompt text',
          target: 'ChatGPT',
          collectionId: 'new-collection',
        })
      })
    })
  })

  describe('Dialog Interactions', () => {
    it('closes dialog when clicking close button', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByLabelText('Close dialog'))

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('closes dialog when clicking backdrop', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click the backdrop (the presentation div)
      const backdrop = screen.getByRole('presentation')
      fireEvent.click(backdrop)

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('closes dialog on escape key in select mode', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('returns to select mode on escape key in create mode', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))
      expect(screen.getByText('New Collection')).toBeInTheDocument()

      fireEvent.keyDown(document, { key: 'Escape' })

      // Should return to select mode, not close
      expect(screen.getByText('Save to Collection')).toBeInTheDocument()
      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('shows loading spinner while fetching collections', async () => {
      // Make the promise hang
      ;(savedPromptsDb.getAllCollectionsWithCounts as jest.Mock).mockImplementation(
        () => new Promise(() => {}),
      )

      render(<SaveToCollectionDialog {...defaultProps} />)

      // Check for spinner (SpinnerIcon has animate-spin class)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('disables buttons while saving', async () => {
      // Make the save hang
      ;(savedPromptsDb.getOrCreateDefaultCollection as jest.Mock).mockImplementation(
        () => new Promise(() => {}),
      )

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        // Find the quick save button by looking for button with spinner or "Quick Save to" text
        const quickSaveButton = screen
          .getAllByRole('button')
          .find(
            (btn) =>
              btn.textContent?.includes('Quick Save to') ||
              btn.querySelector('.animate-spin') !== null,
          )
        expect(quickSaveButton).toBeInTheDocument()
      })

      // Click the quick save button
      const buttons = screen.getAllByRole('button')
      const quickSaveButton = buttons.find((btn) => btn.textContent?.includes('Quick Save to'))
      if (quickSaveButton) {
        fireEvent.click(quickSaveButton)
      }

      // Wait for the button to become disabled and show spinner
      await waitFor(() => {
        const spinningButton = screen
          .getAllByRole('button')
          .find((btn) => btn.querySelector('.animate-spin') !== null)
        expect(spinningButton).toBeDisabled()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'save-dialog-title')
    })

    it('has accessible close button', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    })

    it('color buttons have accessible labels', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Create New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Create New Collection'))

      const colorButtons = screen.getAllByRole('button', { name: /Select color/i })
      expect(colorButtons.length).toBeGreaterThan(0)
    })
  })
})
