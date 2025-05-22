
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MapPin, Navigation, Compass, X, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const StayLocation = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Nearby attractions data
  const attractions: Attraction[] = [
    {
      name: 'Muttukadu Boat House',
      distance: '5 min drive',
      description: 'Enjoy boating activities on the backwaters. The boathouse offers pedal boats, motor boats, and rowing boats for a fun day on the water.',
      image: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
      coordinates: { lat: 12.8152, lng: 80.2478 },
      website: 'https://tntoursim.com/muttukadu-boathouse'
    },
    {
      name: 'Dakshinachitra Heritage Museum',
      distance: '10 min drive',
      description: 'A living museum that showcases the traditional arts, crafts, and architecture of South India. Experience cultural performances and artisan demonstrations.',
      image: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
      coordinates: { lat: 12.8256, lng: 80.2387 },
      website: 'https://dakshinachitra.net'
    },
    {
      name: 'Mahabalipuram UNESCO Sites',
      distance: '15 min drive',
      description: "Explore the famous Shore Temple, Arjuna's Penance, and other 7th-century rock-cut monuments that are UNESCO World Heritage sites.",
      image: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
      coordinates: { lat: 12.6269, lng: 80.1928 },
      website: 'https://whc.unesco.org/en/list/249'
    },
    {
      name: 'Crocodile Bank',
      distance: '10 min drive',
      description: 'One of the largest reptile zoos in the world, home to over 2,000 crocodiles from 14 different species. Learn about conservation efforts.',
      image: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
      coordinates: { lat: 12.7703, lng: 80.2528 },
      website: 'https://www.madrascrocodilebank.org'
    }
  ];
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Our Location"
          subtitle="Nestled beside the serene Muttukadu Lake, Haven offers the perfect balance of seclusion and accessibility."
          backgroundImage="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png"
        />
        <StayNavigation />
        
        {/* Map Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <h2 className="font-serif text-3xl font-bold mb-6">Finding Haven</h2>
                <p className="text-gray-700 mb-4">
                  Haven is strategically located adjacent to the beautiful Muttukadu Lake, offering stunning views of the Muttukadu Bridge and nearby boathouse. Our unique container retreat provides the perfect balance of seclusion and accessibility.
                </p>
                
                <div className="space-y-6 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-haven-green bg-opacity-10 rounded-full flex items-center justify-center">
                      <MapPin className="text-haven-green flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">Haven Container Retreat, Muttukadu Lake Road, ECR, Chennai, Tamil Nadu, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-haven-green bg-opacity-10 rounded-full flex items-center justify-center">
                      <Navigation className="text-haven-green flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Getting Here</h3>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From Chennai city center</span>
                          <span className="bg-haven-beige bg-opacity-30 px-3 py-1 rounded-full text-sm">40 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From Chennai International Airport</span>
                          <span className="bg-haven-beige bg-opacity-30 px-3 py-1 rounded-full text-sm">35 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">From Mahabalipuram</span>
                          <span className="bg-haven-beige bg-opacity-30 px-3 py-1 rounded-full text-sm">15 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="h-[450px] bg-gray-200 rounded-lg overflow-hidden shadow-lg"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7764.696126654798!2d80.24515492272668!3d12.815201699999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52598a9d672347%3A0xf97ab4362c317298!2sMuttukadu%20Boat%20House!5e0!3m2!1sen!2sus!4v1716565790945!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            </div>
            
            {/* Nearby Attractions */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-24"
            >
              <h2 className="font-serif text-3xl font-bold mb-8 text-center">Nearby Attractions</h2>
              <p className="text-gray-700 mb-10 max-w-3xl mx-auto text-center">
                While you might never want to leave our peaceful retreat, there's plenty to explore within a short drive.
                Here are some of the most popular attractions near Haven.
              </p>
              
              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {attractions.map((attraction, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer"
                    onClick={() => setSelectedAttraction(attraction)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{attraction.name}</h3>
                        <span className="bg-haven-beige bg-opacity-40 text-xs px-2 py-1 rounded-full">
                          {attraction.distance}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{attraction.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <Button variant="ghost" size="sm" className="text-haven-green p-0 hover:bg-transparent hover:text-haven-green/80">
                          Learn More
                        </Button>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Natural Surroundings Section */}
        <section className="py-16 bg-haven-beige bg-opacity-20">
          <div className="container-custom">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="font-serif text-3xl font-bold mb-12 text-center"
            >
              Our Natural Surroundings
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <h3 className="font-serif text-2xl font-semibold mb-4">Muttukadu Lake & Backwaters</h3>
                <p className="text-gray-700 mb-4">
                  Haven sits adjacent to the picturesque Muttukadu Lake, offering breathtaking views from our decks and rooftop. The lake is connected by the Buckingham Canal and opens into the Bay of Bengal, creating a unique ecosystem of backwaters that support diverse wildlife.
                </p>
                <p className="text-gray-700">
                  The tranquil waters are perfect for kayaking, birdwatching, or simply enjoying the sunset. Depending on the season, you might witness stunning views of the lake changing colors throughout the day.
                </p>
                
                <div className="mt-6 space-x-3">
                  <Badge label="Kayaking" />
                  <Badge label="Birdwatching" />
                  <Badge label="Fishing" />
                  <Badge label="Photography" />
                </div>
              </motion.div>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png" 
                  alt="View of Muttukadu Lake" 
                  className="w-full h-[350px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="md:order-2"
              >
                <h3 className="font-serif text-2xl font-semibold mb-4">Rich Birdlife & Wildlife</h3>
                <p className="text-gray-700 mb-4">
                  The area around Haven serves as a habitat for diverse birdlife, making it a paradise for birdwatchers and nature enthusiasts. During your stay, you might spot pelicans, flamingos, herons, egrets, kingfishers, and various exotic and migratory birds.
                </p>
                <p className="text-gray-700">
                  The best times for birdwatching are early morning and late afternoon when the birds are most active. Our rooftop deck and ground floor deck provide excellent vantage points for observing these magnificent creatures in their natural habitat.
                </p>
                
                <div className="mt-6 space-x-3">
                  <Badge label="Pelicans" />
                  <Badge label="Flamingos" />
                  <Badge label="Herons" />
                  <Badge label="Kingfishers" />
                </div>
              </motion.div>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="rounded-lg overflow-hidden shadow-lg md:order-1"
              >
                <img 
                  src="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png" 
                  alt="Sunset view from Haven's rooftop" 
                  className="w-full h-[350px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-20 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="font-serif text-xl font-semibold mb-4 text-center">Best Times to Visit</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-medium text-haven-green mb-2">Winter (Nov-Feb)</div>
                  <div className="text-sm text-gray-600">
                    <p>Pleasant temperatures</p>
                    <p>Ideal for outdoor activities</p>
                    <p>22°C - 30°C</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-haven-green mb-2">Summer (Mar-Jun)</div>
                  <div className="text-sm text-gray-600">
                    <p>Warm temperatures</p>
                    <p>Great for lake activities</p>
                    <p>30°C - 40°C</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-haven-green mb-2">Monsoon (Jul-Sep)</div>
                  <div className="text-sm text-gray-600">
                    <p>Occasional rainfall</p>
                    <p>Lush green surroundings</p>
                    <p>25°C - 35°C</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-haven-green mb-2">Post-Monsoon (Oct)</div>
                  <div className="text-sm text-gray-600">
                    <p>Fresh atmosphere</p>
                    <p>Cooler evenings</p>
                    <p>24°C - 32°C</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Attraction Detail Modal */}
      <Dialog open={!!selectedAttraction} onOpenChange={() => setSelectedAttraction(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedAttraction && (
            <div>
              <div className="relative h-40 mb-4 -mt-6 -mx-6 overflow-hidden">
                <img 
                  src={selectedAttraction.image} 
                  alt={selectedAttraction.name} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedAttraction(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-xl font-semibold">{selectedAttraction.name}</h3>
                <span className="bg-haven-beige bg-opacity-40 px-3 py-1 rounded-full text-sm">
                  {selectedAttraction.distance}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedAttraction.description}</p>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                
                <a href={selectedAttraction.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm" className="bg-haven-green hover:bg-haven-green/90">
                    Visit Website
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

// Badge component for categories
const Badge = ({ label }: { label: string }) => (
  <span className="inline-block bg-haven-green/10 text-haven-green text-sm px-3 py-1 rounded-full">
    {label}
  </span>
);

// Types
interface Attraction {
  name: string;
  distance: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  website: string;
}

export default StayLocation;
