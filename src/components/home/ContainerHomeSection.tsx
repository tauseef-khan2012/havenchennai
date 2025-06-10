

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
    description: "Comfortable sleeping arrangements for up to 5 guests with a dedicated workspace for remote work needs.",
    image: "/lovable-uploads/457f5e29-0207-45d0-822a-6252f1d6f7da.png",
    alt: "Bunk bed setup with workspace area featuring desk and chair"
  }, {
    icon: <ChefHat className="h-6 w-6" />,
    title: "Fully Equipped Kitchen & Refrigerator",
    description: "Modern kitchen with all essentials for preparing meals, including refrigerator, induction cooktop, and utensils.",
    image: "/lovable-uploads/5425331e-4704-48e6-913b-0d6a48d98aaf.png",
    alt: "Fully equipped kitchen with induction cooktop, utensils, and storage cabinets"
  }, {
    icon: <BookOpen className="h-6 w-6" />,
    title: "25-Book Library & JBL Flip 5 Speaker",
    description: "Curated collection of books and premium sound system for entertainment during your stay.",
    image: "/lovable-uploads/705f2a35-1b3d-4af4-ad9b-a72ca9c61845.png",
    alt: "Collection of books on shelf with fire extinguisher and safety equipment"
  }, {
    icon: <Waves className="h-6 w-6" />,
    title: "Three Panoramic Decks",
    description: "Stunning 360° views of Muttukadu Lake from three different decks, perfect for sunrise and sunset moments.",
    image: "/lovable-uploads/51e2e8f4-cfbe-4d8c-81f2-ac28bc7d3f04.png",
    alt: "Aerial view of yellow container deck levels with seating areas"
  }];

  return <section className="py-8 lg:py-12 bg-gradient-to-br from-haven-beige via-white to-haven-beige/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="container-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="2" height="2" fill="currentColor" />
            <rect x="30" y="30" width="2" height="2" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#container-pattern)" />
        </svg>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Updated Header Section */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-haven-dark mb-3">Container House with Garden & Kitchen</h1>
          <h2 className="font-serif lg:text-3xl xl:text-4xl mb-3 text-haven-dark font-semibold text-xl mx-0 px-0">besides Muttukadu Lake</h2>
        </div>

        {/* Main Content Grid - Fixed responsive layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start mb-8">
          {/* Content Column - Responsive positioning */}
          <div className="order-1 lg:order-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/20">
              <p className="text-gray-700 mb-6 leading-relaxed">Experience the perfect blend of comfort and nature in our fully-equipped container guest house, featuring panoramic lake views, modern amenities, and thoughtfully designed spaces for your ideal getaway.</p>
              
              {/* Quick Stats - Improved responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-haven-teal/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-haven-teal mb-1">5</div>
                  <div className="text-sm text-gray-600 font-medium">Max Guests</div>
                </div>
                <div className="text-center bg-haven-green/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-haven-green mb-1">3</div>
                  <div className="text-sm text-gray-600 font-medium">Deck Levels</div>
                </div>
              </div>
              
              {/* CTA Button - Full width on mobile, proper sizing on desktop */}
              <Link to="/booking" className="block">
                <Button className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white text-lg py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <Calendar className="h-5 w-5 mr-2" />
                  Check Availability
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image Column - Proper aspect ratio and positioning */}
          <div className="order-2 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="aspect-[4/3] lg:aspect-[3/2]">
                <img 
                  src="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png" 
                  alt="Haven container house exterior with multiple deck levels overlooking Muttukadu Lake" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  loading="lazy" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-6">
          <h3 className="font-serif text-2xl lg:text-3xl font-bold text-center text-haven-dark mb-4">
            Premium Amenities & Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} image={feature.image} alt={feature.alt} />)}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-haven-teal to-haven-green rounded-2xl p-6 lg:p-8 text-white">
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

