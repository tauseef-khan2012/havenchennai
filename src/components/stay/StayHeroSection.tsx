
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface StayHeroSectionProps {
  onBookNowClick: () => void;
  onScrollToNext: () => void;
}

const StayHeroSection = ({ onBookNowClick, onScrollToNext }: StayHeroSectionProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section 
      className="h-[40vh] flex items-center justify-center relative snap-start scroll-mt-16"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png)',
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      <div className="relative container-custom z-10 text-white">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-2xl"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Your Lakeside Haven
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Experience luxury and serenity in our custom-designed container home overlooking Muttukadu Lake
          </p>
          <Button 
            className="bg-white text-haven-green hover:bg-opacity-90 text-lg px-8 py-6"
            onClick={onBookNowClick}
          >
            Book Your Escape
          </Button>
        </motion.div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <button 
          onClick={onScrollToNext}
          aria-label="Scroll to learn more"
          className="flex flex-col items-center"
        >
          <span className="mb-2 text-sm font-light">Discover More</span>
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default StayHeroSection;
