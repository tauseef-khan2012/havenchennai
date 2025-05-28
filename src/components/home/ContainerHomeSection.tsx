import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Home, BookOpen, Waves, Bed, ChefHat } from 'lucide-react';
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  alt: string;
}
const FeatureCard = ({
  icon,
  title,
  description,
  image,
  alt
}: FeatureCardProps) => <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <div className="aspect-[4/3] overflow-hidden">
      <img src={image} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
    </div>
    <div className="p-6">
      <div className="text-haven-teal mb-3">{icon}</div>
      <h3 className="font-serif text-lg font-semibold mb-2 text-haven-dark">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>;
const ContainerHomeSection = () => {
  const features = [{
    icon: <Bed className="h-6 w-6" />,
    title: "Queen + Bunk Bed & Workspace",
    description: "Comfortable sleeping arrangements for up to 4 guests with a dedicated workspace for remote work needs.",
    image: "/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png",
    alt: "Container interior workspace at Haven Chennai"
  }, {
    icon: <ChefHat className="h-6 w-6" />,
    title: "Fully Equipped Kitchen & Refrigerator",
    description: "Modern kitchen with all essentials for preparing meals, including refrigerator, induction cooktop, and utensils.",
    image: "/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png",
    alt: "Container ground-floor living and kitchen"
  }, {
    icon: <BookOpen className="h-6 w-6" />,
    title: "25-Book Library & JBL Flip 5 Speaker",
    description: "Curated collection of books and premium sound system for entertainment during your stay.",
    image: "/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png",
    alt: "Container interior with library and entertainment setup"
  }, {
    icon: <Waves className="h-6 w-6" />,
    title: "Three Panoramic Decks",
    description: "Stunning 360° views of Muttukadu Lake from three different decks, perfect for sunrise and sunset moments.",
    image: "/lovable-uploads/ea3b40a2-e087-4627-aecc-211b123dc269.png",
    alt: "Three panoramic decks at Haven Chennai"
  }];
  return <section className="py-16 lg:py-24 bg-gradient-to-br from-haven-beige via-white to-haven-beige/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="Better relevant title for useful SEO searches">
          <pattern id="container-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="2" height="2" fill="currentColor" />
            
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#container-pattern)" />
        </svg>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-haven-dark mb-4">
            Minimalist Comfort by Muttukadu Lake
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Experience the perfect blend of sustainable living and modern comfort in our uniquely designed container home. 
            Surrounded by nature yet equipped with all modern amenities for the perfect lakeside escape.
          </p>
        </div>

        {/* Main Content Grid */}
        

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="font-serif text-2xl lg:text-3xl font-bold text-center text-haven-dark mb-8">
            Premium Amenities & Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} image={feature.image} alt={feature.alt} />)}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-haven-teal to-haven-green rounded-2xl p-8 lg:p-12 text-white">
          <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-4">
            Ready for Your Lakeside Escape?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Book your sustainable getaway and experience the perfect blend of comfort and nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button className="bg-white text-haven-teal hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl">
                Book Your Stay
              </Button>
            </Link>
            <Link to="/stay">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl">
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default ContainerHomeSection;