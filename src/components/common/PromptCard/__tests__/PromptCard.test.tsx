import { render, screen, fireEvent } from '@testing-library/react'
import { PromptCard } from '../PromptCard'

jest.mock('@/i18n/client', () => ({
  useTranslations: () => ({
    promptCard: {
      original: 'BEFORE',
      enhanced: 'AFTER',
      prompt: 'PROMPT',
      tokens: 'tokens',
    },
  }),
}))

jest.mock('@/hooks/useTokenCount', () => ({
  useTokenCount: () => ({
    tokenCount: 42,
    efficiency: 'low',
    isLoading: false,
  }),
}))

jest.mock('@/lib/utils/tokenCount', () => ({
  getThresholdCategory: () => 'text',
}))

const defaultProps = {
  originalPrompt: 'Write a function to calculate fibonacci numbers',
  enhancedPrompt:
    'Create an efficient TypeScript function that calculates fibonacci numbers using dynamic programming with memoization for optimal performance.',
  children: (
    <>
      <div>Header content</div>
      <div>Token badge</div>
    </>
  ),
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

    it('shows preview text for collapsed sections', () => {
      const { container } = render(<PromptCard {...defaultProps} />)
      // Only BEFORE preview should be visible (AFTER starts expanded when originalPrompt is provided)
      const previews = container.querySelectorAll('.truncate')
      expect(previews.length).toBe(1)
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
    it('starts in expanded state when originalPrompt is provided', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to collapse/i,
      })
      expect(afterButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('collapses when clicked', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to collapse/i,
      })

      fireEvent.click(afterButton)

      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to expand/i,
        }),
      ).toHaveAttribute('aria-expanded', 'false')
    })

    it('hides preview when expanded', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to collapse/i,
      })

      // Preview should not be in the AFTER button when expanded
      const afterSection = afterButton.closest('button')
      const preview = afterSection?.querySelector('.truncate')
      expect(preview).not.toBeInTheDocument()
    })

    it('shows full text when expanded', () => {
      render(<PromptCard {...defaultProps} />)

      // Full text should be visible by default (starts expanded)
      expect(
        screen.getByText(defaultProps.enhancedPrompt, {
          selector: 'p.text-sm',
        }),
      ).toBeInTheDocument()
    })

    it('expands again after collapsing', () => {
      render(<PromptCard {...defaultProps} />)
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to collapse/i,
      })

      fireEvent.click(afterButton)
      const collapsedButton = screen.getByRole('button', {
        name: /AFTER\. Click to expand/i,
      })
      fireEvent.click(collapsedButton)

      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('Independent Expansion', () => {
    it('both sections can be expanded independently', () => {
      render(<PromptCard {...defaultProps} />)

      const beforeButton = screen.getByRole('button', {
        name: /BEFORE\. Click to expand/i,
      })

      // AFTER starts expanded, expand BEFORE too
      fireEvent.click(beforeButton)

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

      // Collapse AFTER first, then expand BEFORE
      const afterButton = screen.getByRole('button', {
        name: /AFTER\. Click to collapse/i,
      })
      fireEvent.click(afterButton)
      fireEvent.click(beforeButton)

      // BEFORE expanded, AFTER collapsed
      expect(
        screen.getByRole('button', {
          name: /BEFORE\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
      expect(
        screen.getByRole('button', {
          name: /AFTER\. Click to expand/i,
        }),
      ).toHaveAttribute('aria-expanded', 'false')
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
          name: /AFTER\. Click to collapse/i,
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

  describe('Without originalPrompt', () => {
    const compactProps = {
      enhancedPrompt: defaultProps.enhancedPrompt,
      children: (
        <>
          <div>Header content</div>
          <div>Token badge</div>
        </>
      ),
    }

    it('does not render BEFORE section', () => {
      render(<PromptCard {...compactProps} />)
      expect(screen.queryByText('BEFORE')).not.toBeInTheDocument()
    })

    it('uses PROMPT label instead of AFTER', () => {
      render(<PromptCard {...compactProps} />)
      expect(screen.getByText('PROMPT')).toBeInTheDocument()
      expect(screen.queryByText('AFTER')).not.toBeInTheDocument()
    })

    it('starts enhanced section collapsed', () => {
      render(<PromptCard {...compactProps} />)
      const promptButton = screen.getByRole('button', {
        name: /PROMPT\. Click to expand/i,
      })
      expect(promptButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('expands enhanced section when clicked', () => {
      render(<PromptCard {...compactProps} />)
      const promptButton = screen.getByRole('button', {
        name: /PROMPT\. Click to expand/i,
      })

      fireEvent.click(promptButton)

      expect(
        screen.getByRole('button', {
          name: /PROMPT\. Click to collapse/i,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
    })

    it('shows full text when expanded', () => {
      render(<PromptCard {...compactProps} />)
      const promptButton = screen.getByRole('button', {
        name: /PROMPT\. Click to expand/i,
      })

      fireEvent.click(promptButton)

      expect(
        screen.getByText(compactProps.enhancedPrompt, {
          selector: 'p.text-sm',
        }),
      ).toBeInTheDocument()
    })

    it('renders only one chevron icon', () => {
      const { container } = render(<PromptCard {...compactProps} />)
      const svgElements = container.querySelectorAll('svg')
      expect(svgElements.length).toBe(1)
    })

    it('renders header content', () => {
      render(<PromptCard {...compactProps} />)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('does not require originalPrompt prop', () => {
      expect(() => render(<PromptCard {...compactProps} />)).not.toThrow()
    })
  })
})
