
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Compass } from 'lucide-react';

const Location = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Way to Haven</h1>
              <p className="text-xl text-white">Nestled beside the serene Muttukadu Lake, our container retreat awaits your discovery.</p>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6">Our Location</h2>
                <p className="text-gray-700 mb-4">
                  Haven is strategically located adjacent to the beautiful Muttukadu Lake, offering stunning views of the Muttukadu Bridge and nearby boathouse. Our unique container retreat provides the perfect balance of seclusion and accessibility.
                </p>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-haven-green mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">Haven Container Retreat, Muttukadu Lake Road, ECR, Chennai, Tamil Nadu, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Navigation className="text-haven-green mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Getting Here</h3>
                      <p className="text-gray-600">40 minutes from Chennai city center via East Coast Road (ECR)</p>
                      <p className="text-gray-600">35 minutes from Chennai International Airport</p>
                      <p className="text-gray-600">15 minutes from Mahabalipuram</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Compass className="text-haven-green mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Nearby Attractions</h3>
                      <p className="text-gray-600">Muttukadu Boat House (5 min)</p>
                      <p className="text-gray-600">Dakshinachitra Heritage Museum (10 min)</p>
                      <p className="text-gray-600">Mahabalipuram UNESCO Sites (15 min)</p>
                      <p className="text-gray-600">Crocodile Bank (10 min)</p>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-8 bg-haven-green hover:bg-haven-green/90">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Open in Google Maps
                  </a>
                </Button>
              </div>
              
              <div className="h-[450px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7764.696126654798!2d80.24515492272668!3d12.815201699999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52598a9d672347%3A0xf97ab4362c317298!2sMuttukadu%20Boat%20House!5e0!3m2!1sen!2sus!4v1716565790945!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        
        {/* Natural Surroundings Section */}
        <section className="py-16 bg-haven-beige bg-opacity-20">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold mb-12 text-center">Our Natural Surroundings</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-4">Muttukadu Lake & Backwaters</h3>
                <p className="text-gray-700 mb-4">
                  Haven sits adjacent to the picturesque Muttukadu Lake, offering breathtaking views from our decks and rooftop. The lake is connected by the Buckingham Canal and opens into the Bay of Bengal, creating a unique ecosystem of backwaters that support diverse wildlife.
                </p>
                <p className="text-gray-700">
                  The tranquil waters are perfect for kayaking, birdwatching, or simply enjoying the sunset. Depending on the season, you might witness stunning views of the lake changing colors throughout the day.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                  alt="Muttukadu Lake" 
                  className="w-full h-[350px] object-cover"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="md:order-2">
                <h3 className="font-serif text-2xl font-semibold mb-4">Rich Birdlife & Wildlife</h3>
                <p className="text-gray-700 mb-4">
                  The area around Haven serves as a habitat for diverse birdlife, making it a paradise for birdwatchers and nature enthusiasts. During your stay, you might spot pelicans, flamingos, herons, egrets, kingfishers, and various exotic and migratory birds.
                </p>
                <p className="text-gray-700">
                  The best times for birdwatching are early morning and late afternoon when the birds are most active. Our rooftop deck and ground floor deck provide excellent vantage points for observing these magnificent creatures in their natural habitat.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1612024782955-49fae79e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                  alt="Birds at Muttukadu" 
                  className="w-full h-[350px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Property Spaces Section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold mb-12 text-center">Our Spaces</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1566908829550-e6551b00979b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                    alt="Container Home" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-semibold mb-2">Stacked Container Home</h3>
                  <p className="text-gray-600 text-sm flex-grow">
                    Our unique two-story container home offers comfortable, minimalist living with panoramic views of the surroundings. The thoughtful design maximizes space while maintaining an intimate connection to nature.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1543459176-4426b37the9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                    alt="Deck Spaces" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-semibold mb-2">Multiple Deck Spaces</h3>
                  <p className="text-gray-600 text-sm flex-grow">
                    Enjoy our ground floor deck with comfortable seating, the first floor smoking deck, and the spectacular rooftop deck offering 360-degree views of the lake and sky—perfect for stargazing and sunrise watching.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1601918774946-25832a4be0d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                    alt="Open Spaces" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-semibold mb-2">Backyard & Open Spaces</h3>
                  <p className="text-gray-600 text-sm flex-grow">
                    Our developing backyard and 5,000 sq. ft. sandy open space provide ample room for outdoor activities, small gatherings, and connecting with nature during your stay at Haven.
                  </p>
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

export default Location;
