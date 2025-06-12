
import { forwardRef } from 'react';
import { Leaf, Heart, Users, Wifi, Car, Coffee } from 'lucide-react';

interface StayOverviewSectionProps {
  forwardRef?: React.RefObject<HTMLDivElement>;
}

const StayOverviewSection = forwardRef<HTMLDivElement, StayOverviewSectionProps>(
  (props, ref) => {
    return (
      <section ref={ref} className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* What Makes Haven Special */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              <span className="font-handwritten text-2xl text-haven-yellow">Special Experience</span>
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-8">
              What Makes Haven
              <span className="block text-haven-teal">Truly Special</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Experience the perfect harmony of sustainable living and modern luxury. Our repurposed shipping 
              container home offers an innovative approach to eco-conscious hospitality without compromising comfort.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center group">
              <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                <Leaf className="h-10 w-10 text-haven-teal" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Sustainable Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Our innovative container architecture proves that eco-friendly choices can be both beautiful and functional, 
                inspiring a new way of thinking about sustainable living.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                <Heart className="h-10 w-10 text-haven-teal" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Lakeside Serenity</h3>
              <p className="text-gray-600 leading-relaxed">
                Wake up to stunning views of Muttukadu Lake. Our elevated position offers breathtaking sunrises 
                and peaceful moments that reconnect you with nature's rhythm.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                <Users className="h-10 w-10 text-haven-teal" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Thoughtful Details</h3>
              <p className="text-gray-600 leading-relaxed">
                Every element is carefully curated—from locally sourced amenities to our handpicked book collection—
                creating an experience that feels both personal and transformative.
              </p>
            </div>
          </div>

          {/* Essential Amenities */}
          <div className="bg-gray-50 rounded-2xl p-10">
            <h3 className="text-2xl font-serif font-bold text-center mb-8 text-gray-900">Essential Comforts</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-center space-x-3">
                <Wifi className="h-6 w-6 text-haven-teal" />
                <span className="text-gray-700">High-Speed Wi-Fi</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="h-6 w-6 text-haven-teal" />
                <span className="text-gray-700">Free Parking</span>
              </div>
              <div className="flex items-center space-x-3">
                <Coffee className="h-6 w-6 text-haven-teal" />
                <span className="text-gray-700">Coffee & Tea Station</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

StayOverviewSection.displayName = 'StayOverviewSection';

export default StayOverviewSection;
