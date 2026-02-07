import {
  countTokens,
  getTokenEfficiency,
  getThresholdCategory,
  CATEGORY_THRESHOLDS,
} from '../tokenCount'

// Mock gpt-tokenizer
jest.mock('gpt-tokenizer', () => ({
  countTokens: jest.fn((text: string) => {
    return Math.ceil(text.length / 4)
  }),
}))

describe('tokenCount', () => {
  describe('CATEGORY_THRESHOLDS', () => {
    it('exports correct text thresholds', () => {
      expect(CATEGORY_THRESHOLDS.text).toEqual({ LOW: 1000, HIGH: 4000 })
    })

    it('exports correct image thresholds', () => {
      expect(CATEGORY_THRESHOLDS.image).toEqual({ LOW: 250, HIGH: 600 })
    })

    it('exports correct video thresholds', () => {
      expect(CATEGORY_THRESHOLDS.video).toEqual({ LOW: 150, HIGH: 400 })
    })
  })

  describe('getThresholdCategory', () => {
    it('returns "text" when no target provided', () => {
      expect(getThresholdCategory()).toBe('text')
      expect(getThresholdCategory(undefined)).toBe('text')
    })

    it('returns "image" for image-related targets', () => {
      expect(getThresholdCategory('image-generator')).toBe('image')
      expect(getThresholdCategory('Image')).toBe('image')
    })

    it('returns "video" for video-related targets', () => {
      expect(getThresholdCategory('video-generator')).toBe('video')
      expect(getThresholdCategory('Video')).toBe('video')
    })

    it('returns "text" for other targets', () => {
      expect(getThresholdCategory('text-generator')).toBe('text')
      expect(getThresholdCategory('Chat & Writing')).toBe('text')
      expect(getThresholdCategory('Code')).toBe('text')
      expect(getThresholdCategory('General')).toBe('text')
    })
  })

  describe('getTokenEfficiency', () => {
    describe('text category (default)', () => {
      it('returns "low" for 0 tokens', () => {
        expect(getTokenEfficiency(0)).toBe('low')
      })

      it('returns "low" for 500 tokens', () => {
        expect(getTokenEfficiency(500)).toBe('low')
      })

      it('returns "low" for 1000 tokens (boundary)', () => {
        expect(getTokenEfficiency(1000)).toBe('low')
      })

      it('returns "medium" for 1001 tokens (boundary)', () => {
        expect(getTokenEfficiency(1001)).toBe('medium')
      })

      it('returns "medium" for 2500 tokens', () => {
        expect(getTokenEfficiency(2500)).toBe('medium')
      })

      it('returns "medium" for 4000 tokens (boundary)', () => {
        expect(getTokenEfficiency(4000)).toBe('medium')
      })

      it('returns "high" for 4001 tokens (boundary)', () => {
        expect(getTokenEfficiency(4001)).toBe('high')
      })

      it('returns "high" for 5000 tokens', () => {
        expect(getTokenEfficiency(5000)).toBe('high')
      })
    })

    describe('image category', () => {
      it('returns "low" for 250 tokens (boundary)', () => {
        expect(getTokenEfficiency(250, 'image')).toBe('low')
      })

      it('returns "medium" for 251 tokens (boundary)', () => {
        expect(getTokenEfficiency(251, 'image')).toBe('medium')
      })

      it('returns "medium" for 600 tokens (boundary)', () => {
        expect(getTokenEfficiency(600, 'image')).toBe('medium')
      })

      it('returns "high" for 601 tokens (boundary)', () => {
        expect(getTokenEfficiency(601, 'image')).toBe('high')
      })
    })

    describe('video category', () => {
      it('returns "low" for 150 tokens (boundary)', () => {
        expect(getTokenEfficiency(150, 'video')).toBe('low')
      })

      it('returns "medium" for 151 tokens (boundary)', () => {
        expect(getTokenEfficiency(151, 'video')).toBe('medium')
      })

      it('returns "medium" for 400 tokens (boundary)', () => {
        expect(getTokenEfficiency(400, 'video')).toBe('medium')
      })

      it('returns "high" for 401 tokens (boundary)', () => {
        expect(getTokenEfficiency(401, 'video')).toBe('high')
      })
    })
  })

  describe('countTokens', () => {
    const { countTokens: mockCountTokens } = jest.requireMock('gpt-tokenizer')

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('returns 0 for empty string', async () => {
      const result = await countTokens('')
      expect(result).toBe(0)
      expect(mockCountTokens).not.toHaveBeenCalled()
    })

    it('returns 0 for whitespace-only string', async () => {
      const result = await countTokens('   ')
      expect(result).toBe(0)
      expect(mockCountTokens).not.toHaveBeenCalled()
    })

    it('counts tokens for short text', async () => {
      const result = await countTokens('Hello world')
      expect(result).toBeGreaterThan(0)
      expect(mockCountTokens).toHaveBeenCalledWith('Hello world')
    })

    it('counts tokens for longer text', async () => {
      const text =
        'This is a longer text that should have more tokens when counted using the BPE tokenizer.'
      const result = await countTokens(text)
      expect(result).toBeGreaterThan(0)
      expect(mockCountTokens).toHaveBeenCalledWith(text)
    })

    it('handles tokenizer errors with fallback approximation', async () => {
      mockCountTokens.mockImplementationOnce(() => {
        throw new Error('Tokenizer failed')
      })

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const text = 'Test text with 20 char'
      const result = await countTokens(text)

      expect(result).toBe(Math.ceil(text.length / 4))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
