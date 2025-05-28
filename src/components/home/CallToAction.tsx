
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="bg-haven-green text-white py-12 lg:py-16">
      <div className="container-custom text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
          Ready for Your Haven Experience?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Book your stay now and discover the perfect balance of comfort and adventure in our unique container home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/booking">
            <Button variant="secondary" size="lg" className="min-w-[160px]">
              Book Your Stay
            </Button>
          </Link>
          <Link to="/experiences">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-haven-green min-w-[160px]" 
              size="lg"
            >
              View Experiences
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
