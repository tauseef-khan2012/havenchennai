'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()
  const bookingId = params.get('bookingId')

  const { data, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    enabled: !!bookingId,
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`).then(r => r.json())
      return res
    }
  })

  const handleSuccess = () => {
    router.push(`/confirmation?bookingId=${bookingId}`)
  }

  if (isLoading) return <p className="p-4">Loading...</p>
  if (!data) return <p className="p-4">Booking not found</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Complete Payment</h1>
      <p>Total due: {data.total}</p>
      {/* TODO: integrate Razorpay JS SDK */}
      <button onClick={handleSuccess} className="px-4 py-2 bg-blue-600 text-white rounded">
        Simulate Payment Success
      </button>
    </div>
  )
}

