
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative h-[90vh] bg-black overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
          filter: 'brightness(0.65)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative h-full container-custom flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Escape to Lakeside Intimacy at Haven</h1>
          <p className="text-xl text-white mb-8">Experience our unique stacked container home retreat beside Muttukadu Lake, where minimal living meets expansive views and meaningful connections.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/stay">
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
