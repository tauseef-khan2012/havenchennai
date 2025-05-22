
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Wifi, Tv, Bath, Fan, Utensils, Snowflake, Book } from 'lucide-react';

const StayAmenities = () => {
  // Group amenities by category for better organization
  const amenities = {
    bedroom: [
      { name: 'Queen-sized bed with premium organic linens', icon: Bed },
      { name: 'Extra pillows and blankets', icon: Bed },
      { name: 'Blackout curtains', icon: Bed },
      { name: 'Bedside tables with reading lamps', icon: Bed },
    ],
    entertainment: [
      { name: 'Smart TV with Netflix access', icon: Tv },
      { name: 'Mood lighting throughout', icon: Tv },
      { name: 'Bluetooth sound system', icon: Tv },
      { name: 'Curated selection of books', icon: Book },
    ],
    bathroom: [
      { name: 'Modern bathroom with rainfall shower', icon: Bath },
      { name: 'Organic toiletries', icon: Bath },
      { name: 'Hair dryer', icon: Bath },
      { name: 'Plush towels', icon: Bath },
    ],
    workspace: [
      { name: 'Dedicated work desk with ergonomic chair', icon: Wifi },
      { name: 'Fast Wi-Fi connection', icon: Wifi },
      { name: 'Multiple power outlets', icon: Wifi },
      { name: 'Natural lighting', icon: Wifi },
    ],
    kitchen: [
      { name: 'Fully equipped kitchenette', icon: Utensils },
      { name: 'Local coffee and tea', icon: Utensils },
      { name: 'Mini refrigerator', icon: Utensils },
      { name: 'Microwave', icon: Utensils },
    ],
    comfort: [
      { name: 'Sustainable climate control', icon: Snowflake },
      { name: 'Ceiling fan', icon: Fan },
      { name: 'Multiple deck spaces', icon: Fan },
      { name: 'Indoor plants for fresh air', icon: Fan },
    ],
  };

  // Featured amenity images
  const featuredAmenities = [
    {
      name: 'Entertainment Center with Netflix',
      image: '/lovable-uploads/0f776507-f284-4d7c-9893-068e9aafd374.png',
      description: 'Relax with your favorite shows and movies on our smart TV with Netflix access and ambient mood lighting.'
    },
    {
      name: 'Curated Book Collection',
      image: '/lovable-uploads/e017493d-c2c0-467e-a191-28fe62a406ab.png',
      description: 'Enjoy our carefully selected books during your stay, perfect for quiet afternoons on the deck.'
    },
    {
      name: 'Work Desk Setup',
      image: '/lovable-uploads/d2fe6d2c-b060-49a3-99d0-62891571bc97.png',
      description: 'Stay productive with our comfortable work space, fast WiFi, and all the amenities you need.'
    }
  ];

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
              
              {/* Featured amenities with images */}
              <div className="mb-16 space-y-12">
                {featuredAmenities.map((amenity, index) => (
                  <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                    <div className="md:w-1/2">
                      <img 
                        src={amenity.image} 
                        alt={amenity.name} 
                        className="w-full h-[300px] object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="font-serif text-2xl font-semibold mb-3">{amenity.name}</h3>
                      <p className="text-gray-700">{amenity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
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
