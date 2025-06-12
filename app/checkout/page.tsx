'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import * as z from 'zod'
import { useAuth } from '../providers'

const FormSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Required'),
  paymentMethod: z.enum(['direct', 'online'])
})

type FormValues = z.infer<typeof FormSchema>

export default function CheckoutPage() {
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name ?? '',
      email: user?.email ?? '',
      phone: '',
      paymentMethod: 'direct'
    }
  })

  const createBooking = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: params.get('start'),
          end: params.get('end'),
          guestInfo: data,
          status: 'pending'
        })
      })
      if (!res.ok) throw new Error('failed')
      return res.json() as Promise<{ id: string }>
    },
    onSuccess: ({ id }, variables) => {
      if (variables.paymentMethod === 'direct') {
        router.push(`/confirmation?bookingId=${id}`)
      } else {
        router.push(`/payment?bookingId=${id}`)
      }
    }
  })

  return (
    <form onSubmit={handleSubmit(values => createBooking.mutate(values))} className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <input placeholder="Name" className="border p-2 w-full" {...register('name')} />
      {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      <input placeholder="Email" className="border p-2 w-full" {...register('email')} />
      {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      <input placeholder="Phone" className="border p-2 w-full" {...register('phone')} />
      {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
      <div className="space-x-2">
        <label>
          <input type="radio" value="direct" {...register('paymentMethod')} /> Pay at property
        </label>
        <label>
          <input type="radio" value="online" {...register('paymentMethod')} /> Pay online
        </label>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={createBooking.isPending}>
        Continue
      </button>
    </form>
  )
}

