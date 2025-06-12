'use client'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export default function ConfirmationPage() {
  const params = useSearchParams()
  const bookingId = params.get('bookingId')

  const { data, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    enabled: !!bookingId,
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`).then(r => r.json())
      return res
    }
  })

  if (isLoading) return <p className="p-4">Loading...</p>
  if (!data) return <p className="p-4">Booking not found</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Booking Confirmed</h1>
      <p>ID: {data.id}</p>
      <p>Status: {data.status}</p>
      <p>Total Paid: {data.total}</p>
      <a href={`/api/ical/${bookingId}`} className="text-blue-600 underline">Download iCal</a>
    </div>
  )
}

