
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const Stay = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const { toast } = useToast();

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
    
    // Here you would connect to Supabase to create a booking
    toast({
      title: "Success!",
      description: "Your booking request has been submitted. We'll contact you shortly to confirm.",
    });
  };

  const containerFeatures = [
    "Spacious 320 sq ft layout with panoramic windows",
    "Queen-sized bed with premium organic linens",
    "Fully equipped kitchenette with local coffee and tea",
    "Modern bathroom with rainfall shower",
    "Private deck with outdoor seating and fire pit",
    "Fast Wi-Fi and Bluetooth sound system",
    "Sustainable climate control for year-round comfort",
    "Curated guidebook to local attractions and hiking trails"
  ];

  const containerAmenities = [
    "Fresh organic breakfast basket (weekends only)",
    "Complimentary local wine upon arrival",
    "Yoga mats and meditation cushions",
    "Binoculars for wildlife viewing",
    "Board games and books",
    "Outdoor hammock (seasonal)",
    "Stargazing guide and telescope",
    "Electric vehicle charging station"
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Stay</h1>
              <p className="text-xl text-white">Experience our unique container home surrounded by nature.</p>
            </div>
          </div>
        </section>
        
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
                      src="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" 
                      alt="Container Home Exterior" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img 
                      src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                      alt="Container Home Interior" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                      alt="Container Home Interior" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                </div>
                
                {/* Details */}
                <div className="mb-8">
                  <h3 className="font-serif text-xl font-semibold mb-4">Features</h3>
                  <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                    {containerFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-serif text-xl font-semibold mb-4">Amenities</h3>
                  <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                    {containerAmenities.map((amenity, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4">Policies</h3>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="font-medium mb-1">Check-in / Check-out</p>
                      <p className="text-gray-600">Check-in: 3:00 PM - 8:00 PM<br />Check-out: 11:00 AM</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Cancellation Policy</p>
                      <p className="text-gray-600">Free cancellation up to 7 days before check-in. 50% refund up to 3 days before check-in.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">House Rules</p>
                      <p className="text-gray-600">No smoking. No pets. Quiet hours from 10:00 PM to 7:00 AM.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Minimum Stay</p>
                      <p className="text-gray-600">2 nights. 3 nights on holidays and peak season.</p>
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
        
        {/* Additional Info */}
        <section className="py-12 bg-haven-beige bg-opacity-30">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-bold text-center mb-10">What to Expect During Your Stay</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-haven-green mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">The Location</h3>
                <p className="text-gray-600">
                  Nestled in a serene woodland setting, yet just a 15-minute drive from town with restaurants, shops, and essential services. Hiking trails accessible directly from the property.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-haven-green mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Your Host</h3>
                <p className="text-gray-600">
                  Our dedicated team will welcome you, provide a tour of the property, and remain available throughout your stay while respecting your privacy and space.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-haven-green mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Seasonal Experiences</h3>
                <p className="text-gray-600">
                  Each season offers unique experiences, from spring wildflowers to summer stargazing, autumn foliage to winter coziness with potential snow views.
                </p>
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
