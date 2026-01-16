import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SaveToCollectionDialog from '../SaveToCollectionDialog'
import * as savedPromptsDb from '@/lib/db/saved-prompts'
import { clearAllToasts } from '../Toast'
import type { CollectionWithCount } from '@/types/saved-prompts'

jest.mock('@/lib/db/saved-prompts')
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
    ;(
      savedPromptsDb.getAllCollectionsWithCounts as jest.Mock
    ).mockResolvedValue(mockCollections)
  })

  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(<SaveToCollectionDialog {...defaultProps} isOpen={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders dialog when isOpen is true', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('displays correct title in select mode', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByText('Save to Collection')).toBeInTheDocument()
      })
    })
  })

  describe('Select mode', () => {
    it('loads and displays collections', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByText('ChatGPT')).toBeInTheDocument()
        expect(screen.getByText('Work Projects')).toBeInTheDocument()
      })
    })

    it('displays quick save button', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /quick save/i }),
        ).toBeInTheDocument()
      })
    })

    it('allows selecting a collection', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByText('Work Projects')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Work Projects'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /save to selected/i }),
        ).toBeInTheDocument()
      })
    })

    it('switches to create mode when create button clicked', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', {
        name: /or create a new one/i,
      })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('New Collection')).toBeInTheDocument()
      })
    })
  })

  describe('Create mode', () => {
    it('shows collection form in create mode', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      })

      fireEvent.click(
        screen.getByRole('button', { name: /or create a new one/i }),
      )

      await waitFor(() => {
        expect(screen.getByText('New Collection')).toBeInTheDocument()
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      })
    })

    it('goes back to select mode when back button clicked', async () => {
      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      })

      fireEvent.click(
        screen.getByRole('button', { name: /or create a new one/i }),
      )

      await waitFor(() => {
        expect(screen.getByText('New Collection')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /back/i }))

      await waitFor(() => {
        expect(screen.getByText('Save to Collection')).toBeInTheDocument()
        expect(screen.getByText('ChatGPT')).toBeInTheDocument()
      })
    })
  })

  describe('Saving', () => {
    it('calls savePrompt when quick save clicked', async () => {
      ;(
        savedPromptsDb.getOrCreateDefaultCollection as jest.Mock
      ).mockResolvedValue({
        id: 'default-id',
        name: 'ChatGPT',
        color: '#007AFF',
        isDefault: true,
        sortOrder: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      ;(savedPromptsDb.savePrompt as jest.Mock).mockResolvedValue({})

      render(<SaveToCollectionDialog {...defaultProps} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /quick save/i }),
        ).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /quick save/i }))

      await waitFor(() => {
        expect(savedPromptsDb.savePrompt).toHaveBeenCalled()
        expect(defaultProps.onSaved).toHaveBeenCalled()
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })
  })
})
