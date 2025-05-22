
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Expand, Calendar, Home, BookOpen, Waves } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-haven-teal mb-4">{icon}</div>
    <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ContainerHomeSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const images = [
    {
      url: "/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png",
      alt: "Container interior workspace at Haven Chennai"
    },
    {
      url: "/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png",
      alt: "Container ground-floor living and kitchen"
    },
    {
      url: "/lovable-uploads/ea3b40a2-e087-4627-aecc-211b123dc269.png",
      alt: "Three panoramic decks at Haven Chennai"
    }
  ];
  
  const features = [
    {
      icon: <Home className="h-8 w-8" />,
      title: "Queen + Bunk Bed & Workspace",
      description: "Comfortable sleeping arrangements for up to 4 guests with a dedicated workspace for remote work needs."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>,
      title: "Fully Equipped Kitchen & Refrigerator",
      description: "Modern kitchen with all essentials for preparing meals, including refrigerator, induction cooktop, and utensils."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "25-Book Library & JBL Flip 5 Speaker",
      description: "Curated collection of books and premium sound system for entertainment during your stay."
    },
    {
      icon: <Waves className="h-8 w-8" />,
      title: "Three Panoramic Decks",
      description: "Stunning 360° views of Muttukadu Lake from three different decks, perfect for sunrise and sunset moments."
    }
  ];
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Set up automatic slideshow for gallery
  setTimeout(nextImage, 5000);
  
  return (
    <section className="py-20 bg-haven-beige relative overflow-hidden">
      {/* Background SVG pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 animate-fade-up">
            <div className="relative rounded-lg overflow-hidden shadow-xl group h-[450px]">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    data-lowres={image.url.replace('.png', '-lowres.png')}
                  />
                </div>
              ))}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/80 text-gray-800"
                    >
                      <Expand className="h-4 w-4 mr-2" />
                      View Gallery
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0">
                    <div className="relative h-[80vh]">
                      <img
                        src={images[currentImage].url}
                        alt={images[currentImage].alt}
                        className="w-full h-full object-contain"
                      />
                      
                      <button 
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 z-30 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 p-2 rounded-full"
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 z-30 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 p-2 rounded-full"
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImage + 1} / {images.length}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImage + 1} / {images.length}
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-fade-up delay-200">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-haven-dark mb-6">
              The Container Home: Minimalist Comfort by Muttukadu Lake
            </h2>
            
            <p className="text-gray-700 mb-8">
              Experience the perfect blend of sustainable living and modern comfort in our uniquely designed container home. 
              Surrounded by nature yet equipped with all modern amenities, our container home offers a refreshing escape 
              from city life while keeping you connected.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
            
            <Link to="/booking">
              <Button className="bg-haven-teal text-white hover:bg-opacity-90">
                <Calendar className="h-5 w-5 mr-2" />
                Check Availability
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContainerHomeSection;
