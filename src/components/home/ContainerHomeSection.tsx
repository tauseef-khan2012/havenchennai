
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Home, BookOpen, Waves, Bed, ChefHat, Monitor, Wifi, Car, Volume2 } from 'lucide-react';

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
  <div className="group glass-panel-navy rounded-3xl shadow-navy overflow-hidden hover-lift transition-all duration-500 animate-fade-in">
    <div className="aspect-[4/3] overflow-hidden relative">
      <img 
        src={image} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-haven-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-6 md:p-8">
      <div className="text-haven-yellow mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold mb-3 text-haven-beige group-hover:text-haven-yellow transition-colors duration-300">
        {title}
      </h3>
      <p className="text-haven-beige/80 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const ContainerHomeSection = () => {
  const features = [
    {
      icon: <Bed className="h-7 w-7" />,
      title: "Queen + Bunk Bed Configuration",
      description: "Innovative bunk bed setup with queen-size bottom bed and single top bed. Dedicated workspace with 32-inch monitor for remote work in our sustainable container home.",
      image: "/lovable-uploads/457f5e29-0207-45d0-822a-6252f1d6f7da.png",
      alt: "Haven Chennai container home interior showing bunk bed setup with workspace featuring 32-inch monitor and desk"
    },
    {
      icon: <ChefHat className="h-7 w-7" />,
      title: "Fully Equipped Kitchen Facilities",
      description: "Complete kitchen with induction stove, cooking utensils, spices, coffee, teas, and refrigerator. Perfect for self-catering during your Muttukadu Lake retreat.",
      image: "/lovable-uploads/5425331e-4704-48e6-913b-0d6a48d98aaf.png",
      alt: "Modern kitchen facilities in Haven container home Chennai with induction cooktop and cooking essentials"
    },
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: "Curated Library & Premium Audio",
      description: "Carefully selected collection of 25 books and premium JBL Flip 5 speaker for entertainment and relaxation during your eco-friendly stay.",
      image: "/lovable-uploads/705f2a35-1b3d-4af4-ad9b-a72ca9c61845.png",
      alt: "Reading corner with curated book collection and JBL speaker in Haven Chennai lakeside accommodation"
    },
    {
      icon: <Waves className="h-7 w-7" />,
      title: "Three-Level Deck Experience",
      description: "160 sq ft rooftop deck with panoramic Muttukadu Lake views, plus ground and first-floor decks for outdoor relaxation. Ideal for birdwatching and nature immersion.",
      image: "/lovable-uploads/51e2e8f4-cfbe-4d8c-81f2-ac28bc7d3f04.png",
      alt: "Multi-level deck spaces at Haven container home with panoramic Muttukadu Lake views and outdoor seating areas"
    }
  ];

  const amenities = [
    { icon: Wifi, label: "High-Speed Wi-Fi (500 Mbps)" },
    { icon: Monitor, label: "32-inch Monitor/Smart TV" },
    { icon: Car, label: "Parking for 2 Cars" },
    { icon: Volume2, label: "JBL Flip 5 Premium Speaker" }
  ];

  return (
    <section className="py-12 lg:py-20 bg-navy-gradient relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-organic-texture opacity-30"></div>
      <div className="absolute inset-0 leaf-pattern opacity-20"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-organic bg-haven-yellow/10 animate-float-gentle"></div>
      <div className="absolute top-40 right-20 w-12 h-12 rounded-organic-2 bg-haven-navy-light/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-10 h-10 rounded-organic-3 bg-haven-yellow/15 animate-float-gentle" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            <span className="font-handwritten text-2xl text-haven-yellow">Sustainable Luxury</span>
            <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold text-haven-beige mb-4">
            Haven: Unique Container Home
            <span className="block text-haven-yellow">Beside Muttukadu Lake</span>
          </h1>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mb-6 text-haven-beige/80 font-medium">
            Eco-friendly Lakeside Retreat on <span className="font-handwritten text-3xl text-haven-yellow">Chennai's OMR</span>
          </h2>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
          {/* Content Column */}
          <div className="order-1 lg:order-1 animate-fade-in">
            <div className="glass-panel-navy rounded-3xl p-8 lg:p-10 shadow-navy hover-lift transition-all duration-500">
              <p className="text-haven-beige/90 mb-8 leading-relaxed text-lg">
                An intimate getaway thoughtfully built using <span className="font-semibold text-haven-yellow">sustainable container architecture</span>, 
                designed to promote connection and nature immersion. Located in Padur beside the serene Muttukadu Lake along Chennai's OMR, this eco-friendly accommodation blends minimal living with expansive lakeside views.
              </p>
              
              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="text-center glass-panel rounded-2xl p-6 hover-organic bg-haven-navy-dark/30">
                  <div className="text-4xl font-bold text-haven-yellow mb-2 animate-breathe">5</div>
                  <div className="text-sm text-haven-beige/70 font-semibold uppercase tracking-wide">Max Guests</div>
                </div>
                <div className="text-center glass-panel rounded-2xl p-6 hover-organic bg-haven-navy-dark/30">
                  <div className="text-4xl font-bold text-haven-yellow mb-2 animate-breathe" style={{ animationDelay: '0.5s' }}>3</div>
                  <div className="text-sm text-haven-beige/70 font-semibold uppercase tracking-wide">Deck Levels</div>
                </div>
              </div>

              {/* Amenities Preview */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-haven-beige/80">
                      <Icon className="h-4 w-4 text-haven-yellow" />
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Enhanced CTA Button */}
              <Link to="/booking" className="block">
                <Button className="w-full bg-yellow-gradient hover:shadow-yellow text-haven-navy text-lg py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ripple-effect font-semibold">
                  <Calendar className="h-6 w-6 mr-3" />
                  Check Availability
                </Button>
              </Link>
            </div>
          </div>

          {/* Enhanced Hero Image Column */}
          <div className="order-2 lg:order-2 animate-fade-in-delay">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-gradient rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-navy">
                <div className="aspect-[4/3] lg:aspect-[3/2]">
                  <img 
                    src="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png" 
                    alt="Haven Chennai - Unique container home accommodation beside Muttukadu Lake showcasing sustainable architecture and lakeside setting" 
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
              <div className="w-8 h-1 bg-yellow-gradient rounded-full"></div>
              <span className="font-handwritten text-xl text-haven-yellow">Premium Amenities</span>
              <div className="w-8 h-1 bg-yellow-gradient rounded-full"></div>
            </div>
            <h3 className="font-serif text-3xl lg:text-4xl font-bold text-haven-beige">
              Thoughtfully Designed <span className="text-haven-yellow">Container Living</span>
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
          <div className="bg-yellow-gradient rounded-3xl p-8 lg:p-12 text-haven-navy shadow-yellow relative overflow-hidden">
            <div className="absolute inset-0 bg-water-ripple opacity-30"></div>
            <div className="relative z-10">
              <h3 className="font-serif text-3xl lg:text-4xl font-bold mb-6">
                Ready for Your <span className="font-handwritten text-4xl">Muttukadu Lake Escape</span>?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Book your sustainable getaway in our unique container home and experience the perfect blend of eco-friendly luxury and nature immersion beside Muttukadu Lake.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/booking">
                  <Button className="bg-haven-navy text-haven-beige hover:bg-haven-navy-dark px-10 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-navy ripple-effect">
                    Book Your Lakeside Stay
                  </Button>
                </Link>
                <Link to="/stay">
                  <Button 
                    variant="outline" 
                    className="border-2 border-haven-navy text-haven-navy hover:bg-haven-navy/10 px-10 py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Container Home
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
