
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ExperiencePhilosophy = () => {
  return (
    <section className="py-16 bg-haven-beige bg-opacity-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Our Experience Philosophy</h2>
          <p className="text-gray-700 mb-8">
            At Haven, we believe that meaningful experiences create lasting connections. Our curated activities are designed to help you connect—with nature, with yourself, and with each other. From the serene waters of Muttukadu Lake to the starlit skies above our rooftop deck, each experience offers a unique way to embrace the beauty of simplicity and the richness of the present moment.
          </p>
          <p className="text-gray-700 mb-8">
            We've thoughtfully crafted each experience to complement the intimate nature of our container home, embracing sustainable practices and highlighting the natural wonders that surround us. Whether you're watching birds take flight across the lake or enjoying a meal under the stars, we invite you to slow down and savor the simple luxury of time well spent.
          </p>
          <Link to="/stay">
            <Button className="bg-haven-green hover:bg-haven-green/90">
              Explore Our Container Stay
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperiencePhilosophy;
