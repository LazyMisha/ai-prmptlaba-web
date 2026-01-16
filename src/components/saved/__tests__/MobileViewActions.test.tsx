import { render, screen, fireEvent } from '@testing-library/react'
import { MobileViewActions } from '../MobileViewActions'
import type { Collection } from '@/types/saved-prompts'

// Mock translations
jest.mock('@/i18n/client', () => ({
  useTranslations: () => ({
    saved: {
      collections: {
        all: 'All',
        create: 'Create Collection',
        manage: 'Manage',
      },
    },
  }),
}))

const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Work',
    color: '#007aff',
    isDefault: false,
    sortOrder: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'Personal',
    color: '#34c759',
    isDefault: false,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const mockPromptCounts = {
  '1': 5,
  '2': 3,
}

describe('MobileViewActions', () => {
  const mockOnSelect = jest.fn()
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnCreate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with "All" selected', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId={null}
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    expect(
      screen.getByRole('button', { name: /All \(8\)/i }),
    ).toBeInTheDocument()
  })

  it('renders correctly with a collection selected', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId="1"
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    expect(
      screen.getByRole('button', { name: /Work \(5\)/i }),
    ).toBeInTheDocument()
  })

  it('opens dropdown when trigger is clicked', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId={null}
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    const trigger = screen.getByRole('button', { name: /All \(8\)/i })
    fireEvent.click(trigger)

    // Check if dropdown items appear
    expect(screen.getByRole('button', { name: /All 8/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Work 5/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Personal 3/i }),
    ).toBeInTheDocument()
  })

  it('selects a collection from dropdown', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId={null}
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    // Open dropdown
    const trigger = screen.getByRole('button', { name: /All \(8\)/i })
    fireEvent.click(trigger)

    // Select a collection
    const workOption = screen.getByRole('button', { name: /Work 5/i })
    fireEvent.click(workOption)

    expect(mockOnSelect).toHaveBeenCalledWith('1')
  })

  it('closes dropdown when backdrop is clicked', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId={null}
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    // Open dropdown
    const trigger = screen.getByRole('button', { name: /All \(8\)/i })
    fireEvent.click(trigger)

    // Click backdrop
    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)

    // Dropdown should close (items should not be in document)
    expect(
      screen.queryByRole('button', { name: /Work 5/i }),
    ).not.toBeInTheDocument()
  })

  it('renders create button when onCreate is provided', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId={null}
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    const createButton = screen.getByRole('button', {
      name: /Create Collection/i,
    })
    expect(createButton).toBeInTheDocument()
    fireEvent.click(createButton)
    expect(mockOnCreate).toHaveBeenCalledTimes(1)
  })

  it('renders manage button when onEdit or onDelete is provided', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId={null}
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    )

    expect(screen.getByRole('button', { name: /Manage/i })).toBeInTheDocument()
  })

  it('does not render manage button when collections are empty', () => {
    render(
      <MobileViewActions
        collections={[]}
        selectedId={null}
        promptCounts={{}}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    )

    expect(
      screen.queryByRole('button', { name: /Manage/i }),
    ).not.toBeInTheDocument()
  })

  it('displays collection colors in dropdown', () => {
    render(
      <MobileViewActions
        collections={mockCollections}
        selectedId="1"
        promptCounts={mockPromptCounts}
        onSelect={mockOnSelect}
        onCreate={mockOnCreate}
      />,
    )

    // Color indicator should be displayed in the trigger
    const trigger = screen.getByRole('button', { name: /Work \(5\)/i })
    const colorIndicator = trigger.querySelector(
      'span[style*="background-color"]',
    )
    expect(colorIndicator).toBeInTheDocument()
    expect(colorIndicator).toHaveStyle({ backgroundColor: '#007aff' })
  })
})
