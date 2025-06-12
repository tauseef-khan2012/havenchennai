
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { useAuth } from '../providers'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Users, Calendar, MapPin } from 'lucide-react'

const FormSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Required'),
  paymentMethod: z.enum(['direct', 'online'])
})

type FormValues = z.infer<typeof FormSchema>

interface GuestInfo {
  name: string;
  age: string;
}

export default function CheckoutPage() {
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [guestInfos, setGuestInfos] = useState<GuestInfo[]>([])
  
  const propertyId = params.get('propertyId')
  const start = params.get('start')
  const end = params.get('end')
  const guests = parseInt(params.get('guests') || '2')
  const total = params.get('total')
  const currency = params.get('currency') || 'INR'

  // Initialize guest info array based on guest count
  useState(() => {
    setGuestInfos(Array.from({ length: guests }, () => ({ name: '', age: '' })))
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name ?? '',
      email: user?.email ?? '',
      phone: '',
      paymentMethod: 'direct'
    }
  })

  // Fetch property details for display
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      // Mock property data - replace with actual API call
      return {
        id: propertyId,
        name: 'Haven Lakeside Retreat',
        location: 'Padur, Chennai OMR'
      }
    }
  })

  const createBooking = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start,
          end,
          guestInfo: data,
          guests: guestInfos,
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

  const updateGuestInfo = (index: number, field: keyof GuestInfo, value: string) => {
    setGuestInfos(prev => prev.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(parseFloat(amount))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property && (
                  <div>
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-gray-600">{property.location}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Check-in</Label>
                    <p>{start ? formatDate(start) : 'Not selected'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Check-out</Label>
                    <p>{end ? formatDate(end) : 'Not selected'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Guests</Label>
                    <p>{guests} {guests === 1 ? 'guest' : 'guests'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Total</Label>
                    <p className="font-semibold text-lg">{total ? formatPrice(total) : 'N/A'}</p>
                  </div>
                </div>

                <Badge variant="secondary" className="w-full justify-center py-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {user ? 'Secure checkout' : 'No account required • Secure guest booking'}
                </Badge>
              </CardContent>
            </Card>

            {/* Guest Details & Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact & Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(values => createBooking.mutate(values))} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Contact Information</h3>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        placeholder="Your full name" 
                        {...register('name')} 
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your.email@example.com" 
                        {...register('email')} 
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210" 
                        {...register('phone')} 
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <Separator />

                  {/* Guest Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Guest Details</h3>
                    {guestInfos.map((guest, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`guest-name-${index}`}>Guest {index + 1} Name</Label>
                          <Input
                            id={`guest-name-${index}`}
                            placeholder="Guest name"
                            value={guest.name}
                            onChange={(e) => updateGuestInfo(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`guest-age-${index}`}>Age (optional)</Label>
                          <Input
                            id={`guest-age-${index}`}
                            type="number"
                            placeholder="Age"
                            value={guest.age}
                            onChange={(e) => updateGuestInfo(index, 'age', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" value="direct" {...register('paymentMethod')} />
                        <span>Pay at property</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" value="online" {...register('paymentMethod')} />
                        <span>Pay online now</span>
                      </label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg" 
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? 'Processing...' : 'Complete Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
