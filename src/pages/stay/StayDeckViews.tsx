import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Volume2, VolumeX, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StayDeckViews = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const deckViews = [
    {
      name: 'Rooftop Deck',
      description: 'Our spectacular rooftop deck offers 360-degree views of the lake and sky, perfect for stargazing and sunrise watching.',
      image: '/lovable-uploads/2d7b66e7-63b3-4b13-a6f3-9d253a5609aa.png',
      features: [
        'Panoramic views of Muttukadu Lake',
        'Yoga and meditation space with mats',
        'Perfect spot for watching sunrises and sunsets',
        'Nighttime stargazing opportunities'
      ]
    },
    {
      name: 'First Floor Deck',
      description: 'The first floor deck provides a comfortable outdoor living space with direct views of the surrounding nature.',
      image: '/lovable-uploads/ea3b40a2-e087-4627-aecc-211b123dc269.png',
      features: [
        'Comfortable seating for relaxation',
        'Perfect for enjoying morning coffee',
        'Lake and greenery views',
        'Quiet space to read or work'
      ]
    },
    {
      name: 'Ground Floor Deck',
      description: 'A spacious ground-level deck surrounded by greenery and plants, perfect for socializing.',
      image: '/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png',
      features: [
        'Shaded outdoor space',
        'Comfortable seating area',
        'Surrounded by plants and nature',
        'Easy access to surrounding grounds'
      ]
    }
  ];
  
  const galleryImages = [
    {
      src: '/lovable-uploads/2d7b66e7-63b3-4b13-a6f3-9d253a5609aa.png',
      alt: 'Rooftop Deck View',
      time: 'Sunrise'
    },
    {
      src: '/lovable-uploads/ea3b40a2-e087-4627-aecc-211b123dc269.png',
      alt: 'First Floor Deck',
      time: 'Morning'
    },
    {
      src: '/lovable-uploads/8446db9f-ec1d-4876-adb8-84f568a58892.png',
      alt: 'Sunset View from Deck',
      time: 'Sunset'
    },
    {
      src: '/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png',
      alt: 'Ground Floor Deck',
      time: 'Afternoon'
    }
  ];
  
  const openLightbox = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setLightboxOpen(true);
  };
  
  const toggleSound = () => {
    if (soundPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setSoundPlaying(!soundPlaying);
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Deck Views"
          subtitle="Experience breathtaking panoramas from our thoughtfully designed deck spaces."
          backgroundImage="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png"
        />
        <StayNavigation />
        
        <section className="py-16 relative">
          {/* Ambient sound toggle */}
          <div className="absolute top-8 right-8 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full p-2 bg-white/80 backdrop-blur-sm"
              onClick={toggleSound}
              aria-label={soundPlaying ? "Mute lake sounds" : "Play lake sounds"}
            >
              {soundPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <audio ref={audioRef} loop className="hidden">
              <source src="https://soundbible.com/mp3/Lake_Waves_Lapping-Mike_Koenig-591240633.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="container-custom">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="font-serif text-3xl font-bold mb-4">Spectacular Views from Every Deck</h2>
              <p className="text-gray-700">
                Our container home features multiple deck spaces, each offering unique perspectives of the surrounding natural beauty. 
                From the ground floor to the rooftop, immerse yourself in the serene environment while enjoying modern comforts.
              </p>
            </motion.div>
            
            <div className="space-y-32">
              {deckViews.map((deck, index) => (
                <motion.div 
                  key={index} 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
                >
                  <div className="md:w-1/2">
                    <div 
                      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] group"
                      onClick={() => openLightbox(deck.image)}
                    >
                      <img 
                        src={deck.image} 
                        alt={deck.name} 
                        className="w-full h-[400px] object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                          Click to enlarge
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="font-serif text-2xl font-semibold mb-3">{deck.name}</h3>
                    <p className="text-gray-700 mb-4">{deck.description}</p>
                    <h4 className="font-medium mb-2">Highlights:</h4>
                    <ul className="space-y-2">
                      {deck.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-24"
            >
              <h3 className="font-serif text-2xl font-semibold mb-6 text-center">Experience Every Moment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openLightbox(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h4 className="text-white font-medium">{image.alt}</h4>
                      <p className="text-white/80 text-sm">{image.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-24 bg-haven-beige bg-opacity-20 p-8 rounded-xl"
            >
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="font-serif text-2xl font-semibold mb-4">The Perfect Time to Visit</h3>
                <p className="text-gray-700 mb-6">
                  Each of our deck spaces offers unique experiences throughout the day. From misty mornings to golden sunsets, 
                  discover the magic of Muttukadu Lake from every angle.
                </p>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Morning</div>
                    <div className="text-sm text-gray-600">Misty lake views, birdwatching</div>
                  </div>
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Midday</div>
                    <div className="text-sm text-gray-600">Clear views, perfect for photography</div>
                  </div>
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Sunset</div>
                    <div className="text-sm text-gray-600">Golden hour, spectacular colors</div>
                  </div>
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Night</div>
                    <div className="text-sm text-gray-600">Stargazing, moonlit lake</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <img 
              src={currentImage} 
              alt="Enlarged view" 
              className="w-full max-h-[80vh] object-contain"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default StayDeckViews;
