import { enhancePrompt, ValidationError } from '../prompt-enhancer'
import { callOpenAI } from '@/lib/openai'
import * as cacheModule from '@/lib/utils/cache'

// Mock dependencies
jest.mock('@/lib/openai')
jest.mock('@/lib/utils/cache')

const mockCallOpenAI = callOpenAI as jest.MockedFunction<typeof callOpenAI>
const mockCache = cacheModule.promptEnhancementCache as jest.Mocked<
  typeof cacheModule.promptEnhancementCache
>
const mockGenerateCacheKey = cacheModule.generateCacheKey as jest.MockedFunction<
  typeof cacheModule.generateCacheKey
>

describe('enhancePrompt', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockCache.get = jest.fn().mockReturnValue(undefined)
    mockCache.set = jest.fn()
    mockCallOpenAI.mockResolvedValue('Enhanced prompt text')

    // Mock generateCacheKey to return predictable hash-like values
    let cacheKeyCounter = 0
    mockGenerateCacheKey.mockImplementation(() => {
      cacheKeyCounter++
      return 'a'.repeat(63) + cacheKeyCounter // 64-char hex-like string
    })
  })

  describe('Input Validation', () => {
    it('should throw ValidationError for empty target', async () => {
      await expect(enhancePrompt('', 'test prompt')).rejects.toThrow(ValidationError)
      await expect(enhancePrompt('', 'test prompt')).rejects.toThrow(
        'Target must be a non-empty string',
      )
    })

    it('should throw ValidationError for whitespace-only target', async () => {
      await expect(enhancePrompt('   ', 'test prompt')).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError for target exceeding max length', async () => {
      const longTarget = 'a'.repeat(51)
      await expect(enhancePrompt(longTarget, 'test prompt')).rejects.toThrow(ValidationError)
      await expect(enhancePrompt(longTarget, 'test prompt')).rejects.toThrow(
        'Target must not exceed 50 characters',
      )
    })

    it('should throw ValidationError for empty prompt', async () => {
      await expect(enhancePrompt('LinkedIn', '')).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError for prompt shorter than minimum length', async () => {
      await expect(enhancePrompt('LinkedIn', 'hi')).rejects.toThrow(ValidationError)
      await expect(enhancePrompt('LinkedIn', 'hi')).rejects.toThrow(
        'Prompt must be at least 3 characters long',
      )
    })

    it('should throw ValidationError for prompt exceeding max length', async () => {
      const longPrompt = 'a'.repeat(2001)
      await expect(enhancePrompt('LinkedIn', longPrompt)).rejects.toThrow(ValidationError)
      await expect(enhancePrompt('LinkedIn', longPrompt)).rejects.toThrow(
        'Prompt must not exceed 2000 characters',
      )
    })

    it('should accept valid input with minimum length', async () => {
      const result = await enhancePrompt('LinkedIn', 'abc')
      expect(result).toBe('Enhanced prompt text')
      expect(mockCallOpenAI).toHaveBeenCalledTimes(1)
    })

    it('should trim whitespace from inputs', async () => {
      await enhancePrompt('  LinkedIn  ', '  test prompt  ')
      expect(mockCallOpenAI).toHaveBeenCalledWith(expect.any(String), 'test prompt', undefined)
    })
  })

  describe('Caching', () => {
    it('should return cached result when available', async () => {
      mockCache.get = jest.fn().mockReturnValue('Cached enhanced prompt')

      const result = await enhancePrompt('LinkedIn', 'test prompt')

      expect(result).toBe('Cached enhanced prompt')
      expect(mockCache.get).toHaveBeenCalledTimes(1)
      expect(mockCallOpenAI).not.toHaveBeenCalled()
    })

    it('should cache new results after OpenAI call', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)
      mockCallOpenAI.mockResolvedValue('New enhanced prompt')

      const result = await enhancePrompt('LinkedIn', 'test prompt')

      expect(result).toBe('New enhanced prompt')
      expect(mockCache.set).toHaveBeenCalledTimes(1)
      expect(mockCache.set).toHaveBeenCalledWith(
        expect.stringMatching(/^[a-f0-9]{64}$/),
        'New enhanced prompt',
      )
    })

    it('should use different cache keys for different inputs', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)

      await enhancePrompt('LinkedIn', 'prompt 1')
      const cacheKey1 = (mockCache.set as jest.Mock).mock.calls[0][0]

      await enhancePrompt('Facebook', 'prompt 1')
      const cacheKey2 = (mockCache.set as jest.Mock).mock.calls[1][0]

      await enhancePrompt('LinkedIn', 'prompt 2')
      const cacheKey3 = (mockCache.set as jest.Mock).mock.calls[2][0]

      expect(cacheKey1).not.toBe(cacheKey2)
      expect(cacheKey1).not.toBe(cacheKey3)
      expect(cacheKey2).not.toBe(cacheKey3)
    })

    it('should use case-insensitive cache keys for target', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)

      await enhancePrompt('LinkedIn', 'test prompt')
      const call1 = mockGenerateCacheKey.mock.calls[0]

      await enhancePrompt('LINKEDIN', 'test prompt')
      const call2 = mockGenerateCacheKey.mock.calls[1]

      // Both calls should have lowercase 'linkedin' as first argument
      expect(call1).toBeDefined()
      expect(call2).toBeDefined()
      expect(call1![0]).toBe('linkedin')
      expect(call2![0]).toBe('linkedin')
      expect(call1![1]).toBe('test prompt')
      expect(call2![1]).toBe('test prompt')
    })
  })

  describe('OpenAI Integration', () => {
    it('should call OpenAI with correct system prompt for LinkedIn', async () => {
      await enhancePrompt('LinkedIn', 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('professional LinkedIn content'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Facebook', async () => {
      await enhancePrompt('Facebook', 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('engaging Facebook content'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Development', async () => {
      await enhancePrompt('Development', 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('software development'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Copilot', async () => {
      await enhancePrompt('Copilot', 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('AI coding assistants'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with general system prompt for unknown target', async () => {
      await enhancePrompt('CustomTarget', 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('expert prompt engineer'),
        'test prompt',
        undefined,
      )
    })

    it('should return enhanced prompt from OpenAI', async () => {
      mockCallOpenAI.mockResolvedValue('Enhanced by AI')

      const result = await enhancePrompt('LinkedIn', 'test prompt')

      expect(result).toBe('Enhanced by AI')
    })

    it('should pass AbortSignal to OpenAI call', async () => {
      const controller = new AbortController()

      await enhancePrompt('LinkedIn', 'test prompt', controller.signal)

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.any(String),
        'test prompt',
        controller.signal,
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate ValidationError', async () => {
      await expect(enhancePrompt('', 'test')).rejects.toThrow(ValidationError)
    })

    it('should wrap unexpected errors', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)
      mockCallOpenAI.mockRejectedValue(new Error('Unexpected error'))

      await expect(enhancePrompt('LinkedIn', 'test prompt')).rejects.toThrow(
        'Failed to enhance prompt: Unexpected error',
      )
    })
  })
})
