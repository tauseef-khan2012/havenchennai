import { NextResponse } from 'next/server'
import { bookings } from '../store'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const booking = bookings.get(params.id)
  if (!booking) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const booking = bookings.get(params.id)
  if (!booking) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  const data = await request.json()
  bookings.set(params.id, { ...booking, ...data })
  return NextResponse.json({ ok: true })
}

