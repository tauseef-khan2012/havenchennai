
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar';
import PlatformComparison from '@/components/booking/PlatformComparison';
import DiscountCodeInput from '@/components/booking/DiscountCodeInput';
import { EnhancedPriceSummary } from '@/components/booking/EnhancedPriceSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, Calendar, Star } from 'lucide-react';
import { UUID } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateEnhancedPropertyBookingPrice, EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { getPlatformRatesForProperty, comparePlatformPricing } from '@/services/platformRatesService';
import { DiscountApplication } from '@/services/discountService';
import { calculateNights } from '@/utils/bookingUtils';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const propertyId = searchParams.get('propertyId') as UUID;
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | undefined>();
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState(2);
  const [priceBreakdown, setPriceBreakdown] = useState<EnhancedPriceBreakdown | null>(null);
  const [platformComparisons, setPlatformComparisons] = useState<any[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountApplication | undefined>();
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        toast({
          title: "Error",
          description: "No property selected for booking.",
          variant: "destructive"
        });
        navigate('/stay');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          throw new Error('Property not found');
        }

        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive"
        });
        navigate('/stay');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, navigate, toast]);

  const handleDateRangeSelect = async (checkIn: Date, checkOut: Date) => {
    setSelectedCheckIn(checkIn);
    setSelectedCheckOut(checkOut);
    
    if (propertyId) {
      await calculatePricing(checkIn, checkOut);
      await fetchPlatformComparisons(checkIn, checkOut);
    }
  };

  const calculatePricing = async (checkIn: Date, checkOut: Date) => {
    setIsCalculatingPrice(true);
    try {
      const pricing = await calculateEnhancedPropertyBookingPrice(
        propertyId,
        checkIn,
        checkOut
      );
      
      // Apply discount if one exists
      let finalPricing = pricing;
      if (appliedDiscount?.isValid && appliedDiscount.discountAmount > 0) {
        const subtotalAfterDiscount = pricing.subtotalAfterDiscount - appliedDiscount.discountAmount;
        const gstAmount = subtotalAfterDiscount * 0.18;
        
        finalPricing = {
          ...pricing,
          discountAmount: pricing.discountAmount + appliedDiscount.discountAmount,
          subtotalAfterDiscount,
          taxAmount: gstAmount,
          totalAmountDue: subtotalAfterDiscount + gstAmount + (pricing.cleaningFee || 0)
        };
      }
      
      setPriceBreakdown(finalPricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to calculate pricing.",
        variant: "destructive"
      });
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const fetchPlatformComparisons = async (checkIn: Date, checkOut: Date) => {
    try {
      const platformRates = await getPlatformRatesForProperty(propertyId, checkIn, checkOut);
      const nights = calculateNights(checkIn, checkOut);
      const directPrice = priceBreakdown?.totalAmountDue || 0;
      
      const comparisons = comparePlatformPricing(directPrice, platformRates, nights);
      setPlatformComparisons(comparisons);
    } catch (error) {
      console.error('Error fetching platform comparisons:', error);
    }
  };

  const handleDiscountApplied = (discount: DiscountApplication) => {
    setAppliedDiscount(discount);
    
    if (selectedCheckIn && selectedCheckOut) {
      calculatePricing(selectedCheckIn, selectedCheckOut);
    }
  };

  const handleProceedToPayment = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your booking.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!selectedCheckIn || !selectedCheckOut || !priceBreakdown) {
      toast({
        title: "Missing information",
        description: "Please select dates and ensure pricing is calculated.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to payment with booking details
    const bookingParams = new URLSearchParams({
      propertyId,
      checkIn: selectedCheckIn.toISOString(),
      checkOut: selectedCheckOut.toISOString(),
      guests: guestCount.toString(),
      ...(appliedDiscount?.isValid && { discountCode: appliedDiscount.discountCode?.code || '' })
    });

    navigate(`/booking/payment?${bookingParams.toString()}`);
  };

  const handlePlatformBooking = (platform: string, url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Not available",
        description: `Booking via ${platform} is not available for these dates.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for could not be found.</p>
            <Button onClick={() => navigate('/stay')}>
              Browse Properties
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const nights = selectedCheckIn && selectedCheckOut ? calculateNights(selectedCheckIn, selectedCheckOut) : 0;

  return (
    <>
      <Navbar />
      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">{property.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.location_details || 'Haven Resort'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Up to {property.max_guests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">4.8 (24 reviews)</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-haven-teal text-white">
                {property.type || 'Premium'}
              </Badge>
            </div>

            {property.image_urls && property.image_urls.length > 0 && (
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <img
                  src={property.image_urls[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-gray-600 mb-6">
              {property.short_description || property.long_description}
            </p>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Calendar and Platform Comparison */}
            <div className="lg:col-span-2 space-y-6">
              <AvailabilityCalendar
                propertyId={propertyId}
                onDateRangeSelect={handleDateRangeSelect}
                selectedCheckIn={selectedCheckIn}
                selectedCheckOut={selectedCheckOut}
              />

              {selectedCheckIn && selectedCheckOut && priceBreakdown && (
                <PlatformComparison
                  directPrice={priceBreakdown.totalAmountDue}
                  platformComparisons={platformComparisons}
                  currency={property.currency}
                  onPlatformSelect={handlePlatformBooking}
                />
              )}
            </div>

            {/* Right Column - Booking Summary */}
            <div className="space-y-6">
              {/* Guest Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Discount Code */}
              {selectedCheckIn && selectedCheckOut && priceBreakdown && (
                <DiscountCodeInput
                  bookingType="property"
                  itemId={propertyId}
                  totalAmount={priceBreakdown.subtotalAfterDiscount}
                  onDiscountApplied={handleDiscountApplied}
                  appliedDiscount={appliedDiscount}
                />
              )}

              {/* Price Summary */}
              {selectedCheckIn && selectedCheckOut && priceBreakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Check-in</span>
                        <span>{selectedCheckIn.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Check-out</span>
                        <span>{selectedCheckOut.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nights</span>
                        <span>{nights}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Guests</span>
                        <span>{guestCount}</span>
                      </div>
                      
                      <Separator />
                      
                      <EnhancedPriceSummary 
                        priceBreakdown={priceBreakdown} 
                        nights={nights}
                        showCompetitorComparison={false}
                      />
                      
                      <Button 
                        onClick={handleProceedToPayment}
                        className="w-full bg-haven-teal hover:bg-haven-teal/90"
                        disabled={isCalculatingPrice}
                      >
                        {isCalculatingPrice ? 'Calculating...' : 'Proceed to Payment'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedCheckIn || !selectedCheckOut ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your dates to see pricing and book</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingPage;
