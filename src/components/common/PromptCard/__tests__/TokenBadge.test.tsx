import { render, screen } from '@testing-library/react'
import TokenBadge from '../TokenBadge'

jest.mock('@/i18n/client', () => ({
  useTranslations: () => ({
    promptCard: {
      tokens: 'tokens',
    },
  }),
}))

const mockUseTokenCount = jest.fn()
jest.mock('@/hooks/useTokenCount', () => ({
  useTokenCount: (...args: unknown[]) => mockUseTokenCount(...args),
}))

jest.mock('@/lib/utils/tokenCount', () => ({
  getThresholdCategory: jest.fn((target?: string) => {
    if (!target) return 'text'
    if (target.toLowerCase().includes('image')) return 'image'
    if (target.toLowerCase().includes('video')) return 'video'
    return 'text'
  }),
}))

describe('TokenBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loading state', () => {
    it('renders loading skeleton when tokenCount is null', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: null,
        efficiency: null,
        isLoading: true,
      })

      const { container } = render(<TokenBadge text="test" />)

      const skeleton = container.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('has aria-live and aria-busy attributes when loading', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: null,
        efficiency: null,
        isLoading: true,
      })

      const { container } = render(<TokenBadge text="test" />)

      const loadingElement = container.querySelector('[aria-live="polite"]')
      expect(loadingElement).toBeInTheDocument()
      expect(loadingElement).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('low efficiency (green)', () => {
    it('renders with green styling', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 50,
        efficiency: 'low',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      const badge = screen.getByText('tokens: 50')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-[#34c759]/10')
      expect(badge).toHaveClass('text-[#34c759]')
    })

    it('has correct aria-label', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 99,
        efficiency: 'low',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      expect(screen.getByLabelText('99 tokens')).toBeInTheDocument()
    })
  })

  describe('medium efficiency (yellow)', () => {
    it('renders with yellow styling', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 1500,
        efficiency: 'medium',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      const badge = screen.getByText('tokens: 1,500')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-[#ff9f0a]/10')
      expect(badge).toHaveClass('text-[#ff9f0a]')
    })
  })

  describe('high efficiency (red)', () => {
    it('renders with red styling', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 5000,
        efficiency: 'high',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      const badge = screen.getByText('tokens: 5,000')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-[#ff3b30]/10')
      expect(badge).toHaveClass('text-[#ff3b30]')
    })
  })

  describe('category integration', () => {
    it('calls useTokenCount with text category by default', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 100,
        efficiency: 'low',
        isLoading: false,
      })

      render(<TokenBadge text="some prompt" />)

      expect(mockUseTokenCount).toHaveBeenCalledWith('some prompt', 'text')
    })

    it('passes image category from target prop', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 300,
        efficiency: 'high',
        isLoading: false,
      })

      render(<TokenBadge text="image prompt" target="image-generator" />)

      expect(mockUseTokenCount).toHaveBeenCalledWith('image prompt', 'image')
    })

    it('passes video category from target prop', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 200,
        efficiency: 'medium',
        isLoading: false,
      })

      render(<TokenBadge text="video prompt" target="Video" />)

      expect(mockUseTokenCount).toHaveBeenCalledWith('video prompt', 'video')
    })
  })

  describe('number formatting', () => {
    it('formats large numbers with locale separators', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 1000,
        efficiency: 'low',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      expect(screen.getByText('tokens: 1,000')).toBeInTheDocument()
    })

    it('does not format small numbers', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 99,
        efficiency: 'low',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      expect(screen.getByText('tokens: 99')).toBeInTheDocument()
    })
  })

  describe('styling consistency', () => {
    it('applies consistent badge styling', () => {
      mockUseTokenCount.mockReturnValue({
        tokenCount: 150,
        efficiency: 'low',
        isLoading: false,
      })

      render(<TokenBadge text="test" />)

      const badge = screen.getByText('tokens: 150')
      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('items-center')
      expect(badge).toHaveClass('px-2')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-xs')
      expect(badge).toHaveClass('font-medium')
      expect(badge).toHaveClass('rounded-full')
    })
  })
})
