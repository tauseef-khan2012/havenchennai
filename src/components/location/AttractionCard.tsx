
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Attraction } from '@/types/location';
import { fadeInUp } from '@/data/attractionsData';

interface AttractionCardProps {
  attraction: Attraction;
  onClick: () => void;
}

const AttractionCard = ({ attraction, onClick }: AttractionCardProps) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer"
      onClick={onClick}
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
  );
};

export default AttractionCard;
