
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface StayOverviewSectionProps {
  forwardRef: React.RefObject<HTMLDivElement>;
}

const StayOverviewSection = ({ forwardRef }: StayOverviewSectionProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <section 
      className="min-h-screen py-16 bg-white snap-start scroll-mt-32"
      ref={forwardRef}
    >
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="font-serif text-3xl font-bold mb-6">The Haven Experience</h2>
            <p className="text-gray-700 mb-6">
              Our custom-designed container home offers the perfect blend of modern luxury and rustic charm, 
              situated with stunning views of Muttukadu Lake. Wake up to breathtaking panoramas through floor-to-ceiling 
              windows, enjoy your morning coffee on multi-level decks, and fall asleep to the gentle sounds of nature.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="bg-haven-beige bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-2">
                  <svg className="h-8 w-8 text-haven-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-medium">Tranquility</h3>
              </div>
              <div className="text-center">
                <div className="bg-haven-beige bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-2">
                  <svg className="h-8 w-8 text-haven-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-medium">Comfort</h3>
              </div>
              <div className="text-center">
                <div className="bg-haven-beige bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-2">
                  <svg className="h-8 w-8 text-haven-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium">Views</h3>
              </div>
            </div>
            
            <Link to="/stay/amenities">
              <Button className="btn-primary mb-4 w-full">Explore Amenities</Button>
            </Link>
            <Link to="/stay/deck-views">
              <Button variant="outline" className="w-full">Discover Deck Views</Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="relative"
          >
            <div className="grid grid-cols-12 grid-rows-6 gap-2 h-[500px]">
              <div className="col-span-8 row-span-4 relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png" 
                  alt="Rooftop Deck Panoramic Views" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="col-span-4 row-span-3 relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png" 
                  alt="Sunset Views from Deck" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="col-span-4 row-span-3 relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/lovable-uploads/54bc279a-b178-45ae-a1a2-5d06ad1c435d.png" 
                  alt="Rooftop Deck Night Views" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="col-span-8 row-span-2 relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/lovable-uploads/d62143b5-3f29-4040-9d6c-f00ea43f861e.png" 
                  alt="Multi-level Deck Overview" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StayOverviewSection;
