
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ExperiencePhilosophy = () => {
  const values = [
    {
      title: "Stillness",
      description: "We believe in the power of quiet moments."
    },
    {
      title: "Connection",
      description: "Fostering deeper bonds with self, others, and the environment."
    },
    {
      title: "Mindful Design",
      description: "Every element has a purpose; minimalism meets comfort."
    },
    {
      title: "Sustainability",
      description: "A deep respect for the planet, woven into our operations."
    },
    {
      title: "Authenticity",
      description: "Real experiences, real stories, real impact."
    }
  ];

  return (
    <section className="py-16 bg-haven-beige bg-opacity-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Our Values</h2>
          <p className="text-gray-700 mb-12">
            At Haven, we believe that meaningful experiences create lasting connections. Our curated activities are designed to help you connect—with nature, with yourself, and with each other. From the serene waters of Muttukadu Lake to the starlit skies above our rooftop deck, each experience offers a unique way to embrace the beauty of simplicity and the richness of the present moment.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="font-serif text-xl font-semibold mb-3 text-haven-green">{value.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
          
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
