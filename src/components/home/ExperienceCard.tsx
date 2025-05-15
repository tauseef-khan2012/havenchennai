
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ExperienceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  duration: string;
  price: number;
}

const ExperienceCard = ({ 
  id, 
  title, 
  description, 
  imageUrl, 
  category, 
  duration, 
  price 
}: ExperienceCardProps) => {
  return (
    <Link to={`/experiences/${id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-3 left-3 bg-haven-green">{category}</Badge>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-haven-green transition-colors">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">{duration}</span>
            <span className="font-semibold">${price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
