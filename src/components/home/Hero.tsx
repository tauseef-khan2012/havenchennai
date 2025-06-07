
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  return (
    <div className="relative h-[90vh] bg-black overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/lovable-uploads/15b485a2-1d79-4783-ba80-f0cf6d9d7a20.png)',
          filter: 'brightness(0.65)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative h-full container-custom flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Welcome to Haven</h1>
          <p className="text-xl text-white mb-8">Experience sustainable luxury in our unique container home retreat</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/booking?propertyId=${havenPropertyId}`}>
              <Button className="btn-primary text-lg">Book Your Stay</Button>
            </Link>
            <Link to="/experiences">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-haven-dark text-lg">Explore Experiences</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
