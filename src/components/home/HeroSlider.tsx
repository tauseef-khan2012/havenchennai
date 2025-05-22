
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  imageUrl: string;
  alt: string;
}

const HeroSlider = () => {
  const slides: Slide[] = [
    {
      imageUrl: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
      alt: 'Haven Chennai lakeside deck at sunrise'
    },
    {
      imageUrl: '/lovable-uploads/2d7b66e7-63b3-4b13-a6f3-9d253a5609aa.png',
      alt: 'Sunset rooftop deck at Haven Chennai'
    },
    {
      imageUrl: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
      alt: 'Container home exterior at Haven Chennai'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = window.setInterval(nextSlide, 6000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, nextSlide]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    intervalRef.current = window.setInterval(nextSlide, 6000);
  };

  return (
    <div 
      className="relative h-[90vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img 
            src={slide.imageUrl} 
            alt={slide.alt}
            className="w-full h-full object-cover animate-ken-burns"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      ))}
      
      <div className="absolute inset-0 flex flex-col justify-center items-start z-20 container-custom">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Minimalist Container Home by Muttukadu Lake
          </h1>
          <p className="text-xl text-white mb-8">
            Escape to our sustainable container-built retreat where modern design meets lakeside serenity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/stay">
              <Button className="bg-haven-teal hover:bg-opacity-90 text-white text-lg">Book Your Stay</Button>
            </Link>
            <Link to="/experiences">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-haven-dark text-lg">
                Explore Experiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 left-4 z-30 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 right-4 z-30 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
      
      {/* Booking CTA */}
      <div className="absolute bottom-8 right-8 z-30">
        <Link to="/booking">
          <Button className="bg-haven-teal hover:bg-opacity-90 text-white">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSlider;
