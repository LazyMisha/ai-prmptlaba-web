import { renderHook, act } from '@testing-library/react'
import { useCopyToClipboard } from '../useCopyToClipboard'

// Mock clipboard API
const mockWriteText = jest.fn()

beforeEach(() => {
  jest.useFakeTimers()
  Object.assign(navigator, {
    clipboard: {
      writeText: mockWriteText,
    },
  })
  mockWriteText.mockResolvedValue(undefined)
})

afterEach(() => {
  jest.useRealTimers()
  jest.clearAllMocks()
})

describe('useCopyToClipboard', () => {
  it('should initialize with copied as false', () => {
    const { result } = renderHook(() => useCopyToClipboard())

    expect(result.current.copied).toBe(false)
    expect(typeof result.current.copy).toBe('function')
  })

  it('should copy text to clipboard and set copied to true', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(mockWriteText).toHaveBeenCalledWith('test text')
    expect(result.current.copied).toBe(true)
  })

  it('should reset copied state after default delay (2000ms)', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.copied).toBe(false)
  })

  it('should respect custom resetDelay', async () => {
    const { result } = renderHook(() =>
      useCopyToClipboard({ resetDelay: 1000 }),
    )

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      jest.advanceTimersByTime(999)
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current.copied).toBe(false)
  })

  it('should call onCopy callback after successful copy', async () => {
    const onCopy = jest.fn()
    const { result } = renderHook(() => useCopyToClipboard({ onCopy }))

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(onCopy).toHaveBeenCalledTimes(1)
  })

  it('should call onError callback when copy fails', async () => {
    const error = new Error('Clipboard access denied')
    mockWriteText.mockRejectedValueOnce(error)

    const onError = jest.fn()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCopyToClipboard({ onError }))

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(onError).toHaveBeenCalledWith(error)
    expect(result.current.copied).toBe(false)

    consoleErrorSpy.mockRestore()
  })

  it('should handle non-Error rejection', async () => {
    mockWriteText.mockRejectedValueOnce('string error')

    const onError = jest.fn()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCopyToClipboard({ onError }))

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
    expect(onError.mock.calls[0][0].message).toBe('Failed to copy to clipboard')

    consoleErrorSpy.mockRestore()
  })

  it('should allow multiple copies', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('first')
    })

    expect(mockWriteText).toHaveBeenCalledWith('first')

    await act(async () => {
      await result.current.copy('second')
    })

    expect(mockWriteText).toHaveBeenCalledWith('second')
    expect(mockWriteText).toHaveBeenCalledTimes(2)
  })
})
