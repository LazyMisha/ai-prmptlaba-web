import { enhancePrompt, ValidationError } from '../prompt-enhancer'
import { callOpenAI } from '@/lib/openai'
import * as cacheModule from '@/lib/utils/cache'
import { TOOL_CATEGORIES } from '@/constants/tool-categories'

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
      const result = await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'abc')
      expect(result).toBe('Enhanced prompt text')
      expect(mockCallOpenAI).toHaveBeenCalledTimes(1)
    })

    it('should trim whitespace from inputs', async () => {
      await enhancePrompt(`  ${TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR}  `, '  test prompt  ')
      expect(mockCallOpenAI).toHaveBeenCalledWith(expect.any(String), 'test prompt', undefined)
    })
  })

  describe('Caching', () => {
    it('should return cached result when available', async () => {
      mockCache.get = jest.fn().mockReturnValue('Cached enhanced prompt')

      const result = await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt')

      expect(result).toBe('Cached enhanced prompt')
      expect(mockCache.get).toHaveBeenCalledTimes(1)
      expect(mockCallOpenAI).not.toHaveBeenCalled()
    })

    it('should cache new results after OpenAI call', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)
      mockCallOpenAI.mockResolvedValue('New enhanced prompt')

      const result = await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt')

      expect(result).toBe('New enhanced prompt')
      expect(mockCache.set).toHaveBeenCalledTimes(1)
      expect(mockCache.set).toHaveBeenCalledWith(
        expect.stringMatching(/^[a-f0-9]{64}$/),
        'New enhanced prompt',
      )
    })

    it('should use different cache keys for different inputs', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)

      await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'prompt 1')
      const cacheKey1 = (mockCache.set as jest.Mock).mock.calls[0][0]

      await enhancePrompt(TOOL_CATEGORIES.FACEBOOK_POST_CREATOR, 'prompt 1')
      const cacheKey2 = (mockCache.set as jest.Mock).mock.calls[1][0]

      await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'prompt 2')
      const cacheKey3 = (mockCache.set as jest.Mock).mock.calls[2][0]

      expect(cacheKey1).not.toBe(cacheKey2)
      expect(cacheKey1).not.toBe(cacheKey3)
      expect(cacheKey2).not.toBe(cacheKey3)
    })

    it('should use case-insensitive cache keys for target', async () => {
      mockCache.get = jest.fn().mockReturnValue(undefined)

      await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt')
      const call1 = mockGenerateCacheKey.mock.calls[0]

      await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR.toUpperCase(), 'test prompt')
      const call2 = mockGenerateCacheKey.mock.calls[1]

      // Both calls should have lowercase category value as first argument
      expect(call1).toBeDefined()
      expect(call2).toBeDefined()
      expect(call1![0]).toBe(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR)
      expect(call2![0]).toBe(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR)
      expect(call1![1]).toBe('test prompt')
      expect(call2![1]).toBe('test prompt')
    })
  })

  describe('OpenAI Integration', () => {
    it('should call OpenAI with correct system prompt for LinkedIn', async () => {
      await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('LinkedIn content creation'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Facebook', async () => {
      await enhancePrompt(TOOL_CATEGORIES.FACEBOOK_POST_CREATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('Facebook content creation'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Development', async () => {
      await enhancePrompt(TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('AI coding assistants and development tools'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Copilot', async () => {
      await enhancePrompt(TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('AI coding assistants'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for image generation tools', async () => {
      await enhancePrompt(TOOL_CATEGORIES.IMAGE_GENERATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('AI image generation tools'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for video generation tools', async () => {
      await enhancePrompt(TOOL_CATEGORIES.VIDEO_GENERATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('AI video generation tools'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for text generation tools', async () => {
      await enhancePrompt(TOOL_CATEGORIES.TEXT_GENERATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('AI text generation and conversational AI tools'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Twitter', async () => {
      await enhancePrompt(TOOL_CATEGORIES.TWITTER_POST_CREATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('Twitter (X) content creation'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with correct system prompt for Instagram', async () => {
      await enhancePrompt(TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR, 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('Instagram content creation'),
        'test prompt',
        undefined,
      )
    })

    it('should call OpenAI with general system prompt for unknown target', async () => {
      await enhancePrompt('CustomTarget', 'test prompt')

      expect(mockCallOpenAI).toHaveBeenCalledWith(
        expect.stringContaining('professional prompt engineer'),
        'test prompt',
        undefined,
      )
    })

    it('should return enhanced prompt from OpenAI', async () => {
      mockCallOpenAI.mockResolvedValue('Enhanced by AI')

      const result = await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt')

      expect(result).toBe('Enhanced by AI')
    })

    it('should pass AbortSignal to OpenAI call', async () => {
      const controller = new AbortController()

      await enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt', controller.signal)

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

      await expect(
        enhancePrompt(TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR, 'test prompt'),
      ).rejects.toThrow('Failed to enhance prompt: Unexpected error')
    })
  })
})
