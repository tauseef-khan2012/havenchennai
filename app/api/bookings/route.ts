import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { bookings } from './store'

export async function POST(request: Request) {
  const data = await request.json()
  const id = randomUUID()
  const booking = {
    id,
    start: data.start,
    end: data.end,
    guestInfo: data.guestInfo,
    status: 'pending' as const,
    total: 1000,
  }
  bookings.set(id, booking)
  return NextResponse.json({ id })
}

export async function GET() {
  return NextResponse.json(Array.from(bookings.values()))
}

