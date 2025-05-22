
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Wifi, Coffee, Tv, Bath, Fan, Utensils, Snowflake } from 'lucide-react';

const StayAmenities = () => {
  // Group amenities by category for better organization
  const amenities = {
    bedroom: [
      { name: 'Queen-sized bed with premium organic linens', icon: Bed },
      { name: 'Extra pillows and blankets', icon: Bed },
      { name: 'Blackout curtains', icon: Bed },
      { name: 'Bedside tables with reading lamps', icon: Bed },
    ],
    bathroom: [
      { name: 'Modern bathroom with rainfall shower', icon: Bath },
      { name: 'Organic toiletries', icon: Bath },
      { name: 'Hair dryer', icon: Bath },
      { name: 'Plush towels', icon: Bath },
    ],
    kitchen: [
      { name: 'Fully equipped kitchenette', icon: Utensils },
      { name: 'Local coffee and tea', icon: Coffee },
      { name: 'Mini refrigerator', icon: Utensils },
      { name: 'Microwave', icon: Utensils },
    ],
    comfort: [
      { name: 'Sustainable climate control', icon: Snowflake },
      { name: 'Ceiling fan', icon: Fan },
      { name: 'Fast Wi-Fi', icon: Wifi },
      { name: 'Bluetooth sound system', icon: Tv },
    ],
  };

  return (
    <>
      <Navbar />
      <main>
        <StayHero 
          title="Amenities & Features"
          subtitle="Every detail of our container home is designed for comfort and convenience."
          backgroundImage="/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png"
        />
        <StayNavigation />
        
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold mb-8 text-center">Everything You Need for a Perfect Stay</h2>
              <p className="text-gray-700 mb-10 text-center">
                Our container home is thoughtfully equipped with premium amenities to ensure your comfort and convenience.
                From the plush bedding to the sustainable climate control, we've thought of everything so you don't have to.
              </p>
              
              <div className="space-y-12">
                {Object.entries(amenities).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-serif text-xl font-semibold mb-4 capitalize">{category} Amenities</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {items.map((amenity, index) => (
                        <Card key={index} className="border-haven-green/20 hover:border-haven-green transition-colors">
                          <CardContent className="p-4 flex items-start space-x-3">
                            <amenity.icon className="h-5 w-5 text-haven-green flex-shrink-0 mt-0.5" />
                            <span>{amenity.name}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 bg-haven-beige bg-opacity-20 p-6 rounded-lg">
                <h3 className="font-serif text-xl font-semibold mb-3">Special Touches</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complimentary local wine upon arrival</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fresh organic breakfast basket (weekends only)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Yoga mats and meditation cushions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Curated guidebook to local attractions</span>
                  </li>
                </ul>
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
