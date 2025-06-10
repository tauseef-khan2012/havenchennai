
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Experience } from '@/data/experiencesData';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Link 
      to={`/experiences/${experience.id}`} 
      className="group"
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={experience.imageUrl} 
            alt={experience.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-3 left-3 bg-haven-green">{experience.category}</Badge>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{experience.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({experience.reviewCount})</span>
            </div>
            <div className="flex items-center ml-auto text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-xs">{experience.location}</span>
            </div>
          </div>
          
          <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-haven-green transition-colors">{experience.title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{experience.description}</p>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">{experience.duration}</span>
            <span className="font-semibold">₹{experience.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
