import { NextResponse } from 'next/server'
import { differenceInCalendarDays } from 'date-fns'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  if (!start || !end) {
    return NextResponse.json({ message: 'Missing dates' }, { status: 400 })
  }
  const nights = Math.max(differenceInCalendarDays(new Date(end), new Date(start)), 0)
  const nightlyRate = 2000
  const total = nightlyRate * nights
  const taxes = total * 0.18
  const isAvailable = true
  return NextResponse.json({ nightlyRate, taxes, total: total + taxes, isAvailable })
}

