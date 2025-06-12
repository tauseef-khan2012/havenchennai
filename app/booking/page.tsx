'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function BookingPage() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const { data, isFetching } = useQuery({
    queryKey: ['pricing', start, end],
    enabled: Boolean(start && end),
    queryFn: async () => {
      const res = await fetch(`/api/pricing?start=${start}&end=${end}`)
      if (!res.ok) throw new Error('failed')
      return res.json() as Promise<{ nightlyRate: number; taxes: number; total: number; isAvailable: boolean }>
    }
  })

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Select Dates</h1>
      <div className="flex gap-2">
        <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border p-2" />
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border p-2" />
      </div>
      {isFetching && <p>Loading pricing…</p>}
      {data && (
        <div className="border p-2 rounded">
          <p>Nightly: {data.nightlyRate}</p>
          <p>Taxes: {data.taxes}</p>
          <p>Total: {data.total}</p>
          {!data.isAvailable && <p className="text-red-600">Not available</p>}
        </div>
      )}
      <Link
        href={data?.isAvailable ? `/checkout?start=${start}&end=${end}` : '#'}
        className={`px-4 py-2 rounded bg-blue-600 text-white ${data?.isAvailable ? '' : 'opacity-50 pointer-events-none'}`}
      >
        Continue
      </Link>
    </div>
  )
}

