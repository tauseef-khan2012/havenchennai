
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';

const Stay = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }
    
    // Since we don't have multiple properties in the database yet,
    // we'll hardcode a sample property ID for demonstration
    const samplePropertyId = "d290f1ee-6c54-4b01-90e6-d701748f0851";
    
    // Navigate to the booking page with property ID
    navigate(`/booking?propertyId=${samplePropertyId}`);
  };

  return (
    <>
      <Navbar />
      <main>
        <StayHero 
          title="Book Your Stay"
          subtitle="Experience our unique container home surrounded by nature."
          backgroundImage="/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png"
        />
        
        <StayNavigation />
        
        {/* Main Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Property Info and Gallery */}
              <div className="md:col-span-2">
                <h2 className="font-serif text-3xl font-bold mb-6">The Haven Container Home</h2>
                <p className="text-gray-700 mb-6">
                  Our custom-designed container home offers the perfect blend of modern luxury and rustic charm, 
                  situated on 5 acres of pristine woodland. Wake up to stunning views of nature through floor-to-ceiling 
                  windows, enjoy your morning coffee on the private deck, and fall asleep to the gentle sounds of the forest.
                </p>
                
                {/* Image Gallery */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="col-span-2">
                    <img 
                      src="/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png" 
                      alt="Container Home Exterior" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img 
                      src="/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png" 
                      alt="Container Home Interior" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img 
                      src="/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png" 
                      alt="Container Home Bedroom" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                </div>
                
                {/* Feature Highlights */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 border border-haven-green/20 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-serif text-xl font-semibold mb-2">Amenities</h3>
                    <p className="text-gray-600 mb-3">Modern comfort in a rustic setting with premium amenities.</p>
                    <Link to="/stay/amenities" className="text-haven-green hover:underline inline-flex items-center">
                      View Details 
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="p-4 border border-haven-green/20 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-serif text-xl font-semibold mb-2">Deck Views</h3>
                    <p className="text-gray-600 mb-3">Breathtaking panoramas from our multi-level deck spaces.</p>
                    <Link to="/stay/deck-views" className="text-haven-green hover:underline inline-flex items-center">
                      View Details 
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="p-4 border border-haven-green/20 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-serif text-xl font-semibold mb-2">Location</h3>
                    <p className="text-gray-600 mb-3">Perfectly situated by Muttukadu Lake with stunning natural surroundings.</p>
                    <Link to="/stay/location" className="text-haven-green hover:underline inline-flex items-center">
                      View Details 
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                
                {/* Policies (Condensed) */}
                <div className="mb-8 bg-haven-beige bg-opacity-20 p-6 rounded-lg">
                  <h3 className="font-serif text-xl font-semibold mb-4">Key Policies</h3>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="font-medium mb-1">Check-in / Check-out</p>
                      <p className="text-gray-600">Check-in: 3:00 PM - 8:00 PM<br />Check-out: 11:00 AM</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Cancellation Policy</p>
                      <p className="text-gray-600">Free cancellation up to 7 days before check-in.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Form */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="font-serif text-xl font-semibold mb-4">Book Your Stay</h3>
                  <p className="text-2xl font-bold mb-2">$249 <span className="text-sm font-normal text-gray-600">per night</span></p>
                  
                  <Separator className="my-4" />
                  
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <Label htmlFor="check-in">Check-in Date</Label>
                      <Input 
                        id="check-in" 
                        type="date" 
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="check-out">Check-out Date</Label>
                      <Input 
                        id="check-out" 
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guests">Guests</Label>
                      <select 
                        id="guests"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>
                    
                    <Button type="submit" className="w-full btn-primary">
                      Request to Book
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Looking for something special?</p>
                    <Link to="/packages" className="text-haven-green hover:underline font-medium">
                      View our custom packages →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Stay;
