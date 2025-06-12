import { generateBookingReference, calculateNights, applyDiscount, calculateTax, formatPrice } from '../src/utils/bookingUtils'

describe('generateBookingReference', () => {
  it('should generate reference with correct format', () => {
    const ref = generateBookingReference()
    expect(ref).toMatch(/^HAV-\d{8}-\d{4}$/)
  })

  it('should generate unique references', () => {
    const refs = new Set<string>()
    for (let i = 0; i < 20; i++) {
      refs.add(generateBookingReference())
    }
    expect(refs.size).toBe(20)
  })
})

describe('calculateNights', () => {
  it('should calculate number of nights between two dates', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = new Date('2024-01-05')
    expect(calculateNights(checkIn, checkOut)).toBe(4)
  })
})

describe('applyDiscount', () => {
  it('should apply percentage discount', () => {
    expect(applyDiscount(1000, 10)).toBeCloseTo(900)
  })
})

describe('calculateTax', () => {
  it('should calculate tax amount', () => {
    expect(calculateTax(1000, 18)).toBeCloseTo(180)
  })
})

describe('formatPrice', () => {
  it('should format price with currency symbol and commas', () => {
    expect(formatPrice(1234.5, 'INR')).toBe('₹1,234.50')
    expect(formatPrice(1234.5, 'USD')).toBe('$1,234.50')
  })
})

