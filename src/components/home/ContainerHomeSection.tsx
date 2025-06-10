
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
}: FeatureCardProps) => (
  <div className="group glass-panel rounded-3xl shadow-organic overflow-hidden hover-lift transition-all duration-500 animate-fade-in">
    <div className="aspect-[4/3] overflow-hidden relative">
      <img 
        src={image} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-haven-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-6 md:p-8">
      <div className="text-haven-teal mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold mb-3 text-haven-dark group-hover:text-haven-teal transition-colors duration-300">
        {title}
      </h3>
      <p className="text-haven-dark/70 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const ContainerHomeSection = () => {
  const features = [
    {
      icon: <Bed className="h-7 w-7" />,
      title: "Queen + Bunk Bed & Workspace",
      description: "Comfortable sleeping arrangements for up to 5 guests with a dedicated workspace for remote work needs.",
      image: "/lovable-uploads/457f5e29-0207-45d0-822a-6252f1d6f7da.png",
      alt: "Bunk bed setup with workspace area featuring desk and chair"
    },
    {
      icon: <ChefHat className="h-7 w-7" />,
      title: "Fully Equipped Kitchen & Refrigerator",
      description: "Modern kitchen with all essentials for preparing meals, including refrigerator, induction cooktop, and utensils.",
      image: "/lovable-uploads/5425331e-4704-48e6-913b-0d6a48d98aaf.png",
      alt: "Fully equipped kitchen with induction cooktop, utensils, and storage cabinets"
    },
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: "25-Book Library & JBL Flip 5 Speaker",
      description: "Curated collection of books and premium sound system for entertainment during your stay.",
      image: "/lovable-uploads/705f2a35-1b3d-4af4-ad9b-a72ca9c61845.png",
      alt: "Collection of books on shelf with fire extinguisher and safety equipment"
    },
    {
      icon: <Waves className="h-7 w-7" />,
      title: "Three Panoramic Decks",
      description: "Stunning 360° views of Muttukadu Lake from three different decks, perfect for sunrise and sunset moments.",
      image: "/lovable-uploads/51e2e8f4-cfbe-4d8c-81f2-ac28bc7d3f04.png",
      alt: "Aerial view of yellow container deck levels with seating areas"
    }
  ];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-haven-beige via-white to-haven-beige-warm relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-organic-texture opacity-30"></div>
      <div className="absolute inset-0 leaf-pattern opacity-20"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-organic bg-haven-teal/10 animate-float-gentle"></div>
      <div className="absolute top-40 right-20 w-12 h-12 rounded-organic-2 bg-haven-moss/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-10 h-10 rounded-organic-3 bg-haven-sunset/15 animate-float-gentle" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-nature-gradient rounded-full"></div>
            <span className="font-handwritten text-2xl text-haven-green">Sustainable Luxury</span>
            <div className="w-12 h-1 bg-nature-gradient rounded-full"></div>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold text-haven-dark mb-4">
            Container House with 
            <span className="block text-haven-teal">Garden & Kitchen</span>
          </h1>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mb-6 text-haven-dark/80 font-medium">
            beside <span className="font-handwritten text-3xl text-haven-blue">Muttukadu Lake</span>
          </h2>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
          {/* Content Column */}
          <div className="order-1 lg:order-1 animate-fade-in">
            <div className="glass-panel rounded-3xl p-8 lg:p-10 shadow-organic hover-lift transition-all duration-500">
              <p className="text-haven-dark/80 mb-8 leading-relaxed text-lg">
                Experience the perfect blend of <span className="font-semibold text-haven-green">comfort and nature</span> in our fully-equipped container guest house, featuring panoramic lake views, modern amenities, and thoughtfully designed spaces for your ideal getaway.
              </p>
              
              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="text-center glass-panel rounded-2xl p-6 hover-organic">
                  <div className="text-4xl font-bold text-haven-teal mb-2 animate-breathe">5</div>
                  <div className="text-sm text-haven-dark/70 font-semibold uppercase tracking-wide">Max Guests</div>
                </div>
                <div className="text-center glass-panel rounded-2xl p-6 hover-organic">
                  <div className="text-4xl font-bold text-haven-green mb-2 animate-breathe" style={{ animationDelay: '0.5s' }}>3</div>
                  <div className="text-sm text-haven-dark/70 font-semibold uppercase tracking-wide">Deck Levels</div>
                </div>
              </div>
              
              {/* Enhanced CTA Button */}
              <Link to="/booking" className="block">
                <Button className="w-full bg-nature-gradient hover:shadow-organic-hover text-white text-lg py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple-effect">
                  <Calendar className="h-6 w-6 mr-3" />
                  Check Availability
                </Button>
              </Link>
            </div>
          </div>

          {/* Enhanced Hero Image Column */}
          <div className="order-2 lg:order-2 animate-fade-in-delay">
            <div className="relative group">
              <div className="absolute inset-0 bg-nature-gradient rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-organic-hover">
                <div className="aspect-[4/3] lg:aspect-[3/2]">
                  <img 
                    src="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png" 
                    alt="Haven container house exterior with multiple deck levels overlooking Muttukadu Lake" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="mb-12">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-1 bg-lake-gradient rounded-full"></div>
              <span className="font-handwritten text-xl text-haven-teal">Thoughtful Amenities</span>
              <div className="w-8 h-1 bg-lake-gradient rounded-full"></div>
            </div>
            <h3 className="font-serif text-3xl lg:text-4xl font-bold text-haven-dark">
              Premium <span className="text-haven-green">Features</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FeatureCard 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description} 
                  image={feature.image} 
                  alt={feature.alt} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center animate-fade-in-delay-2">
          <div className="bg-nature-gradient rounded-3xl p-8 lg:p-12 text-white shadow-organic-hover relative overflow-hidden">
            <div className="absolute inset-0 bg-water-ripple opacity-30"></div>
            <div className="relative z-10">
              <h3 className="font-serif text-3xl lg:text-4xl font-bold mb-6">
                Ready for Your <span className="font-handwritten text-4xl text-haven-sunset">Lakeside Escape</span>?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Book your sustainable getaway and experience the perfect blend of comfort and nature.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/booking">
                  <Button className="bg-white text-haven-dark hover:bg-haven-beige px-10 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-organic ripple-effect">
                    Book Your Stay
                  </Button>
                </Link>
                <Link to="/stay">
                  <Button 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContainerHomeSection;
