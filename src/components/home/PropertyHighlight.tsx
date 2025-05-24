
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PropertyHighlightProps {
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
}

const PropertyHighlight = ({ title, description, imageUrl, reverse = false }: PropertyHighlightProps) => {
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  return (
    <div className={`grid md:grid-cols-2 gap-8 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className={`${reverse ? 'md:order-2' : ''}`}>
        <div className="rounded-lg overflow-hidden shadow-md">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
      <div className={`${reverse ? 'md:order-1' : ''}`}>
        <h2 className="font-serif text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <Link to={`/booking?propertyId=${havenPropertyId}`}>
          <Button className="btn-primary">Book Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyHighlight;
