
import { HomeExperience } from '@/data/homeExperiencesData';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomeExperienceCardProps {
  experience: HomeExperience;
}

const HomeExperienceCard = ({ experience }: HomeExperienceCardProps) => {
  return (
    <Link 
      to={`/experiences/${experience.id}`} 
      className="flex-shrink-0 w-[280px] snap-start bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-[200px]">
        <img 
          src={experience.imageUrl} 
          alt={experience.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-white py-1 px-2 rounded-full text-sm font-medium">
          {experience.duration}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium bg-haven-teal/10 text-haven-teal px-2 py-0.5 rounded-full">
            {experience.category}
          </span>
          <span className="text-xs text-gray-500 ml-2">{experience.location}</span>
        </div>
        
        <h3 className="font-serif text-lg font-medium mb-1 line-clamp-1">{experience.title}</h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {experience.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{experience.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({experience.reviewCount})</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">₹{experience.price}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeExperienceCard;
