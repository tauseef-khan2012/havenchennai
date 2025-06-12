interface Booking {
  id: string
  start: string
  end: string
  guestInfo: {
    name: string
    email: string
    phone: string
    paymentMethod: 'direct' | 'online'
  }
  status: 'pending' | 'paid'
  total: number
}

export const bookings = new Map<string, Booking>()

