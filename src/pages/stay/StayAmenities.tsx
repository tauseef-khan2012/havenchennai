
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Badge } from '@/components/ui/badge';
import { Bed, Monitor, ChefHat, Car, Wifi, Volume2, Coffee, Utensils, Bath, BookOpen } from 'lucide-react';

const StayAmenities = () => {
  const amenityCategories = [
    {
      title: "Sleeping & Living",
      icon: <Bed className="h-8 w-8 text-haven-yellow" />,
      items: [
        "Queen-size bunk bed (bottom) with premium Wakefit mattress",
        "Single bunk bed (top) with safety ladder and reading light",
        "Ground floor sofa-cum-bed for 2 guests (up to 6 feet tall)",
        "Fresh linens, pillows, and comfortable bedding",
        "Reading corner with curated book collection"
      ]
    },
    {
      title: "Work & Entertainment",
      icon: <Monitor className="h-8 w-8 text-haven-yellow" />,
      items: [
        "32-inch monitor/Smart TV with HDMI connectivity",
        "Ergonomic workspace with keyboard and wireless mouse",
        "High-speed Wi-Fi (500 Mbps) for seamless remote work",
        "JBL Flip 5 premium speaker for music and calls",
        "Curated library of 25 books across genres"
      ]
    },
    {
      title: "Kitchen & Dining",
      icon: <ChefHat className="h-8 w-8 text-haven-yellow" />,
      items: [
        "Fully equipped kitchen with induction cooktop",
        "Premium cooking utensils and cookware",
        "Essential spices, coffee, and specialty teas",
        "Refrigerator and ample storage space",
        "Dining area with comfortable seating"
      ]
    },
    {
      title: "Outdoor & Parking",
      icon: <Car className="h-8 w-8 text-haven-yellow" />,
      items: [
        "Three-level deck system with lake views",
        "160 sq ft rooftop deck for yoga and stargazing",
        "Covered parking for 2 cars",
        "Outdoor seating areas on multiple levels",
        "Direct access to lakeside walking paths"
      ]
    }
  ];

  const quickAmenities = [
    { icon: Wifi, label: "500 Mbps Wi-Fi" },
    { icon: Monitor, label: "32\" Monitor/TV" },
    { icon: Car, label: "Parking for 2" },
    { icon: Volume2, label: "JBL Flip 5 Speaker" },
    { icon: Coffee, label: "Coffee & Teas" },
    { icon: Bath, label: "Premium Toiletries" },
    { icon: BookOpen, label: "Curated Library" },
    { icon: Utensils, label: "Full Kitchen" }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Amenities & Features"
          subtitle="Everything you need for a comfortable and productive stay at our lakeside container home."
          backgroundImage="/lovable-uploads/457f5e29-0207-45d0-822a-6252f1d6f7da.png"
        />
        <StayNavigation />
        
        {/* Main Content */}
        <section className="py-16 bg-navy-gradient relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
          <div className="absolute inset-0 leaf-pattern opacity-10"></div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-yellow">Premium Comfort</span>
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-haven-beige mb-6">
                Thoughtfully Curated
                <span className="block text-haven-yellow">Container Home Amenities</span>
              </h1>
              <p className="text-haven-beige/90 text-lg leading-relaxed max-w-3xl mx-auto">
                Our sustainable container home features carefully selected amenities designed to enhance your lakeside retreat experience, combining modern comfort with eco-friendly living.
              </p>
            </div>

            {/* Quick Amenities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
              {quickAmenities.map((amenity, index) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={index}
                    className="glass-panel-navy rounded-2xl p-4 text-center hover-lift transition-all duration-300 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-6 w-6 text-haven-yellow mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-xs text-haven-beige/80 font-medium">{amenity.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Amenities */}
            <div className="grid md:grid-cols-2 gap-8">
              {amenityCategories.map((category, index) => (
                <div
                  key={index}
                  className="glass-panel-navy rounded-3xl p-8 hover-lift transition-all duration-500 animate-fade-in group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-haven-beige group-hover:text-haven-yellow transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-haven-yellow rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-haven-beige/80 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Special Features Highlight */}
            <div className="mt-16 glass-panel-navy rounded-3xl p-8 text-center">
              <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
                Unique Features
              </Badge>
              <h3 className="font-serif text-2xl font-bold mb-4 text-haven-beige">
                What Sets Haven Apart
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">160</div>
                  <div className="text-sm text-haven-beige/70">Sq ft rooftop deck with panoramic lake views</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">500</div>
                  <div className="text-sm text-haven-beige/70">Mbps high-speed Wi-Fi for remote work</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">25</div>
                  <div className="text-sm text-haven-beige/70">Curated books for lakeside reading</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default StayAmenities;
