import { renderHook, waitFor } from '@testing-library/react'
import { useTokenCount } from '../useTokenCount'
import * as tokenCountModule from '@/lib/utils/tokenCount'

jest.mock('@/lib/utils/tokenCount', () => ({
  countTokens: jest.fn(),
  getTokenEfficiency: jest.fn(),
  getThresholdCategory: jest.fn(() => 'text'),
  CATEGORY_THRESHOLDS: {
    text: { LOW: 1000, HIGH: 4000 },
    image: { LOW: 250, HIGH: 600 },
    video: { LOW: 150, HIGH: 400 },
  },
}))

describe('useTokenCount', () => {
  const mockCountTokens = tokenCountModule.countTokens as jest.MockedFunction<
    typeof tokenCountModule.countTokens
  >
  const mockGetTokenEfficiency =
    tokenCountModule.getTokenEfficiency as jest.MockedFunction<
      typeof tokenCountModule.getTokenEfficiency
    >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with null values and isLoading true', () => {
    mockCountTokens.mockResolvedValue(50)
    mockGetTokenEfficiency.mockReturnValue('low')

    const { result } = renderHook(() => useTokenCount('test text'))

    expect(result.current.tokenCount).toBeNull()
    expect(result.current.efficiency).toBeNull()
    expect(result.current.isLoading).toBe(true)
  })

  it('counts tokens with default text category', async () => {
    mockCountTokens.mockResolvedValue(500)
    mockGetTokenEfficiency.mockReturnValue('low')

    const { result } = renderHook(() => useTokenCount('short text'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockCountTokens).toHaveBeenCalledWith('short text')
    expect(mockGetTokenEfficiency).toHaveBeenCalledWith(500, 'text')
    expect(result.current.tokenCount).toBe(500)
    expect(result.current.efficiency).toBe('low')
  })

  it('passes category to getTokenEfficiency', async () => {
    mockCountTokens.mockResolvedValue(300)
    mockGetTokenEfficiency.mockReturnValue('high')

    const { result } = renderHook(() => useTokenCount('image prompt', 'image'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetTokenEfficiency).toHaveBeenCalledWith(300, 'image')
    expect(result.current.efficiency).toBe('high')
  })

  it('handles video category', async () => {
    mockCountTokens.mockResolvedValue(200)
    mockGetTokenEfficiency.mockReturnValue('medium')

    const { result } = renderHook(() => useTokenCount('video prompt', 'video'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetTokenEfficiency).toHaveBeenCalledWith(200, 'video')
    expect(result.current.efficiency).toBe('medium')
  })

  it('recalculates when text changes', async () => {
    mockCountTokens.mockResolvedValueOnce(500).mockResolvedValueOnce(2000)
    mockGetTokenEfficiency.mockImplementation((count) => {
      if (count <= 1000) return 'low'
      if (count <= 4000) return 'medium'
      return 'high'
    })

    const { result, rerender } = renderHook(({ text }) => useTokenCount(text), {
      initialProps: { text: 'initial text' },
    })

    await waitFor(() => {
      expect(result.current.tokenCount).toBe(500)
    })

    expect(result.current.efficiency).toBe('low')

    rerender({ text: 'updated longer text' })

    await waitFor(() => {
      expect(result.current.tokenCount).toBe(2000)
    })

    expect(result.current.efficiency).toBe('medium')
    expect(mockCountTokens).toHaveBeenCalledTimes(2)
  })

  it('handles errors gracefully', async () => {
    mockCountTokens.mockRejectedValue(new Error('Token counting failed'))

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const { result } = renderHook(() => useTokenCount('error text'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.tokenCount).toBeNull()
    expect(result.current.efficiency).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('does not update state after unmount', async () => {
    mockCountTokens.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(50), 100)
        }),
    )

    const { result, unmount } = renderHook(() => useTokenCount('test'))

    unmount()

    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(result.current.tokenCount).toBeNull()
  })

  it('handles empty text', async () => {
    mockCountTokens.mockResolvedValue(0)
    mockGetTokenEfficiency.mockReturnValue('low')

    const { result } = renderHook(() => useTokenCount(''))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockCountTokens).toHaveBeenCalledWith('')
    expect(result.current.tokenCount).toBe(0)
    expect(result.current.efficiency).toBe('low')
  })
})
