import { render, screen, fireEvent } from '@testing-library/react'
import { PromptCard } from '../PromptCard'

// Mock translations
jest.mock('@/i18n/client', () => ({
  useTranslations: () => ({
    promptCard: {
      original: 'BEFORE',
      enhanced: 'AFTER',
    },
  }),
}))

const defaultProps = {
  originalPrompt: 'Write a function to calculate fibonacci numbers',
  enhancedPrompt:
    'Create an efficient TypeScript function that calculates fibonacci numbers using dynamic programming with memoization for optimal performance.',
  children: <div>Header content</div>,
}

describe('PromptCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with header content', () => {
      render(<PromptCard {...defaultProps} />)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('renders BEFORE and AFTER labels', () => {
      render(<PromptCard {...defaultProps} />)
      expect(screen.getByText('BEFORE')).toBeInTheDocument()
      expect(screen.getByText('AFTER')).toBeInTheDocument()
    })

    it('shows preview text when sections are collapsed', () => {
      const { container } = render(<PromptCard {...defaultProps} />)
      // Both previews should be visible when collapsed
      const previews = container.querySelectorAll('.truncate')
      expect(previews.length).toBe(2)
    })

    it('applies custom className', () => {
      const { container } = render(
        <PromptCard {...defaultProps} className="custom-class" />,
      )
      const article = container.querySelector('article')
      expect(article).toHaveClass('custom-class')
    })
  })

  describe('BEFORE Section - Expand/Collapse', () => {
    it('starts in collapsed state', () => {
      render(<PromptCard {...defaultProps} />)
      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })
      expect(beforeButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('expands when clicked', () => {
      render(<PromptCard {...defaultProps} />)
      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })

      fireEvent.click(beforeButton)

      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
    })

    it('hides preview when expanded', () => {
      render(<PromptCard {...defaultProps} />)
      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })

      fireEvent.click(beforeButton)

      // Preview should not be in the BEFORE button
      const beforeSection = beforeButton.closest('button')
      const preview = beforeSection?.querySelector('.text-\\[\\#86868b\\]\\/60')
      expect(preview).not.toBeInTheDocument()
    })

    it('shows full text when expanded', () => {
      render(<PromptCard {...defaultProps} />)
      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })

      fireEvent.click(beforeButton)

      // Full text should be visible
      expect(
        screen.getByText(defaultProps.originalPrompt, {
          selector: 'p.text-sm',
        }),
      ).toBeInTheDocument()
    })

    it('collapses when clicked again', () => {
      render(<PromptCard {...defaultProps} />)
      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })

      fireEvent.click(beforeButton)
      const expandedButton = screen.getByRole('button', {
        name: /BEFORE\. Click to collapse/i,
      })
      fireEvent.click(expandedButton)

      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to expand/i,
        }),
      ).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('AFTER Section - Expand/Collapse', () => {
    it('starts in collapsed state', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })
      expect(afterButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('expands when clicked', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })

      fireEvent.click(afterButton)

      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
    })

    it('hides preview when expanded', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })

      fireEvent.click(afterButton)

      // Preview should not be in the AFTER button
      const afterSection = afterButton.closest('button')
      const preview = afterSection?.querySelector('.text-\\[\\#007aff\\]\\/50')
      expect(preview).not.toBeInTheDocument()
    })

    it('shows full text when expanded', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })

      fireEvent.click(afterButton)

      // Full text should be visible
      expect(
        screen.getByText(defaultProps.enhancedPrompt, {
          selector: 'p.text-sm',
        }),
      ).toBeInTheDocument()
    })

    it('collapses when clicked again', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })

      fireEvent.click(afterButton)
      const expandedButton = screen.getByRole('button', {
        name: /AFTER\. Click to collapse/i,
      })
      fireEvent.click(expandedButton)

      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to expand/i,
        }),
      ).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Independent Expansion', () => {
    it('both sections can be expanded independently', () => {
      render(<PromptCard {...defaultProps} />)

      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })

      // Expand both
      fireEvent.click(beforeButton)
      fireEvent.click(afterButton)

      // Both should be expanded
      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
    })

    it('expanding one section does not affect the other', () => {
      render(<PromptCard {...defaultProps} />)

      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })

      // Expand only BEFORE
      fireEvent.click(beforeButton)

      // BEFORE expanded, AFTER still collapsed
      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
      expect(afterButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-labels for sections', () => {
      render(<PromptCard {...defaultProps} />)

      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to expand/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to expand/i,
        }),
      ).toBeInTheDocument()
    })

    it('updates aria-labels when expanded', () => {
      render(<PromptCard {...defaultProps} />)
      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })

      fireEvent.click(beforeButton)

      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to collapse/i,
        }),
      ).toBeInTheDocument()
    })

    it('renders chevron icons for both sections', () => {
      const { container } = render(<PromptCard {...defaultProps} />)
      // Should have at least 2 chevron icons (one for each section)
      const svgElements = container.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThanOrEqual(2)
    })
  })
})
