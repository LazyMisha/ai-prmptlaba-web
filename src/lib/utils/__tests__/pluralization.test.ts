import { pluralizeUk } from '../pluralization'

describe('pluralizeUk', () => {
  const forms: [string, string, string] = ['запис', 'записи', 'записів']

  describe('singular form (запис)', () => {
    it('returns singular for 1', () => {
      expect(pluralizeUk(1, forms)).toBe('запис')
    })

    it('returns singular for 21', () => {
      expect(pluralizeUk(21, forms)).toBe('запис')
    })

    it('returns singular for 31', () => {
      expect(pluralizeUk(31, forms)).toBe('запис')
    })

    it('returns singular for 101', () => {
      expect(pluralizeUk(101, forms)).toBe('запис')
    })
  })

  describe('plural form 1 (записи)', () => {
    it('returns записи for 2', () => {
      expect(pluralizeUk(2, forms)).toBe('записи')
    })

    it('returns записи for 3', () => {
      expect(pluralizeUk(3, forms)).toBe('записи')
    })

    it('returns записи for 4', () => {
      expect(pluralizeUk(4, forms)).toBe('записи')
    })

    it('returns записи for 22', () => {
      expect(pluralizeUk(22, forms)).toBe('записи')
    })

    it('returns записи for 23', () => {
      expect(pluralizeUk(23, forms)).toBe('записи')
    })

    it('returns записи for 24', () => {
      expect(pluralizeUk(24, forms)).toBe('записи')
    })

    it('returns записи for 102', () => {
      expect(pluralizeUk(102, forms)).toBe('записи')
    })
  })

  describe('plural form 2 (записів)', () => {
    it('returns записів for 0', () => {
      expect(pluralizeUk(0, forms)).toBe('записів')
    })

    it('returns записів for 5', () => {
      expect(pluralizeUk(5, forms)).toBe('записів')
    })

    it('returns записів for 11', () => {
      expect(pluralizeUk(11, forms)).toBe('записів')
    })

    it('returns записів for 12', () => {
      expect(pluralizeUk(12, forms)).toBe('записів')
    })

    it('returns записів for 13', () => {
      expect(pluralizeUk(13, forms)).toBe('записів')
    })

    it('returns записів for 14', () => {
      expect(pluralizeUk(14, forms)).toBe('записів')
    })

    it('returns записів for 15', () => {
      expect(pluralizeUk(15, forms)).toBe('записів')
    })

    it('returns записів for 20', () => {
      expect(pluralizeUk(20, forms)).toBe('записів')
    })

    it('returns записів for 25', () => {
      expect(pluralizeUk(25, forms)).toBe('записів')
    })

    it('returns записів for 111', () => {
      expect(pluralizeUk(111, forms)).toBe('записів')
    })

    it('returns записів for 112', () => {
      expect(pluralizeUk(112, forms)).toBe('записів')
    })
  })

  describe('edge cases', () => {
    it('handles negative numbers correctly', () => {
      expect(pluralizeUk(-1, forms)).toBe('запис')
      expect(pluralizeUk(-2, forms)).toBe('записи')
      expect(pluralizeUk(-5, forms)).toBe('записів')
      expect(pluralizeUk(-11, forms)).toBe('записів')
    })
  })
})
