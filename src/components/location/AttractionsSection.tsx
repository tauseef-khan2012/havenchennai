
import React from 'react';
import { motion } from 'framer-motion';
import AttractionCard from './AttractionCard';
import { attractions, fadeInUp, staggerContainer } from '@/data/attractionsData';
import { Attraction } from '@/types/location';

interface AttractionsSectionProps {
  onSelectAttraction: (attraction: Attraction) => void;
}

const AttractionsSection = ({ onSelectAttraction }: AttractionsSectionProps) => {
  return (
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
          <AttractionCard 
            key={index}
            attraction={attraction}
            onClick={() => onSelectAttraction(attraction)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AttractionsSection;
